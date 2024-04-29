import { IUtf8Message, Message, connection,  server } from 'websocket'
import http from 'http'
import { ParsedUrlQuery } from 'querystring';
import { dbConnect } from './dbConnect';
import{GoogleGenerativeAI} from  "@google/generative-ai";
import {Reddisconnect, client, Subscribedclient} from './redisconnection';
import { config } from 'dotenv';

config();

let keywords:string[] = []
const httpServer = http.createServer((req, res) => {
    console.log("Server started");
})
const websocket = new server({
    "httpServer": httpServer
})

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY||"");
console.log(genAI)
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

var connectionsToUser = new Map<connection, string>();
var UserToConnection = new Map<string, connection>();

export const getConnection = (userid:string)=>{
    console.log("Called")
    return UserToConnection.get(userid);
}

function addNewLines(inputString:string) {
    return inputString.replace(/\\n/g, '\n');
}




const setUpConnection  = async()=>{
    await dbConnect();
    await Reddisconnect(Subscribedclient);
    const res = await Subscribedclient.subscribe("positive",async (msg) => {
        const object:{id: string, message: string, valid: boolean} = JSON.parse(msg);
        console.log(object)
        let message;
        if(object.valid){
            console.log("valid hai")
            const result = await model.generateContent(object.message);
            message = result.response.text();
        } else{
            message = "Sorry I will not assist you with this prompt.";
        }
        const connections = getConnection(object.id);
        console.log("Final msg " + message)
        if (connections) {
            connections.send(JSON.stringify({valid: object.valid, message: addNewLines(message)}));
        }
    });

    const model2Publis = await Subscribedclient.subscribe("model2", async(msg)=>{
        console.log("Model 2")
        const payload = JSON.parse(msg);
        const category = payload.category;
        let matched = true
        for(let i=0; i<keywords.length; i++){
            // console.log("category "+category+" "+keywords[i]);
            const keyword = keywords[i];
            if(category==keyword){
                matched = true;
                break;
            } 
        }

        if(matched){
            console.log("Invalid")
            const connections = getConnection(payload.id);
            if(connections){
                connections.send(JSON.stringify({id: payload.id,valid: false, message: "Sorry I will not assist you with this prompt."}));
            }
        } else{
            console.log("valid prompt");
                const connections = getConnection(payload.id);
                const result = await model.generateContent(payload.message);
                const message = result.response.text();
                connections?.send(JSON.stringify({valid: true, message: addNewLines(message)}));
        }
        
    })
    

    await Reddisconnect(client);

}



websocket.on("request", (request) => {

    console.log("New Request");
    console.log(request.resourceURL.query)
    const user:string = (request.resourceURL.query as ParsedUrlQuery).userId as string;
    console.log(user)
    let connections:connection = request.accept(null, request.origin);

    connectionsToUser.set(connections, user)
    UserToConnection.set(user, connections)

    console.log("Active Connection ", UserToConnection.size);
    console.log("keys ", UserToConnection.keys());

    

    connections.on("message", async(data:Message) => {
        const parserdData = JSON.parse((data as IUtf8Message).utf8Data || '{}');
        const push = await client.lPush("message", JSON.stringify(parserdData));

    })

    

    

    connections.on("close", (code, des)=>{

        console.log("Close event");
        var saveUser = connectionsToUser.get(connections) as string;
        UserToConnection.delete(saveUser);
        connectionsToUser.delete(connections);
        
    })

})




httpServer.listen(8979, async() => {
    console.log("http server started at 8979");
    console.log("Request sent");
    const response = await fetch("http://127.0.0.1:5000/extract", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: "violence OR trojan horse OR self harming OR self development OR recruitment activities"
        })
    })

    const data = await response.json();
    keywords=data.extracted;
    keywords = keywords.map(keyword => keyword.replace(/_/g, ' '));
    console.log(keywords);
})
setUpConnection();





