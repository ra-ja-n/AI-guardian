"use client"
import { userDetail } from "@/store/recoil";
import { useRecoilValue } from "recoil";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation";
import { KeyboardEvent, use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import logo from "@/assets/logo.png"
import userLogo from "@/assets/user.jpg"
import gptLogo from "@/assets/logo.png"
import Alert from "@/components/Alert/Alert";

type TMessage = {
  message: string;
  sender: "user" | "chatgpt";
  valid: boolean;
}


const Home = () => {
  const [alert, setALert] = useState(false);
  const [userId, setUserId] = useState(""); //store user id from local storage
  const [disabled, setDisabled] = useState(true); //disable prompt
  const [socketRef, setSocketRef] = useState<WebSocket|null>(null); //socket ref
  const prompRef = useRef<HTMLTextAreaElement|null>(null); //prompt ref
  const [prompt, setPrompt] = useState(""); //prompt message
  const [isLogin, setIsLogin] = useState(false); //check if user is logged in
  const router = useRouter(); 
  const [message, setMessage] = useState<TMessage[]>([]); //message from chatgpt
   
    //authenticate user function
    const authenticate = async () => {
        try {
          const response = await fetch("/api/random", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          const data = await response.json();
          if (!data.success) {
            router.push("/auth");
          } else{
            setIsLogin(true)
          }
        } catch (error) {
          console.error("Error during authentication:", error);
        }
    };
      
      //authenticate user
      useEffect(() => {
        authenticate();
      }, []);

      //setup socket connection
      const setUpSocketConnection = async()=>{
        await new Promise((res)=>setTimeout(res, 4000));
        const ws = new WebSocket(`ws://localhost:8979?userId=${userId}`);
        ws.onopen = () => {
          console.log("connected");
          if(ws.readyState==1){
            setSocketRef(ws);
          }
        };
        ws.onmessage = (e) => {
          const response = JSON.parse(e.data);
          console.log(response)
          if(!response.valid){
            setALert(true);
          }
          setMessage((prev)=> [...prev, {message: response.message, sender: "chatgpt", valid: response.valid}])
        };
        ws.onclose = () => {
          console.log("disconnected");
          // setIsLogin(false);
        };
      
      }

      useEffect(()=>{
        console.log("diable prompt", disabled)
        if(!disabled){
          if(prompRef && prompRef.current){
            console.log(prompRef.current)
            console.log("Focus")
            prompRef.current.focus();
          }
        }
      }, [disabled])

      //enable prompt when socket connection is successfull
      useEffect(()=>{
        if(socketRef){
          console.log("Successfull connection")
          setDisabled(false);
          
        }
      }, [socketRef])

      //setup socket connection when user is logged in
      useEffect(()=>{
        if(userId.length>0){
          setUpSocketConnection();
        }
      }, [isLogin, userId])

      //get user id from local storage when user is logged in
      useEffect(()=>{
        if(isLogin){
          const user = localStorage.getItem("id") || "";
          if(user.length>0){
            setUserId(user.split(`"`)[1]);
          } else{
            setUserId(user);
          }
        }
      }, [isLogin])

      //handle keydow
      const handleKeyDown = (e:KeyboardEvent<HTMLTextAreaElement>)=>{
        if(e.key === "Enter" && prompt.length>0){
          if(socketRef){
            
            setMessage((prev:TMessage[])=>{
              return [...prev, {message: prompt, sender: "user", valid: true}]
            })
            
            const payload = {
              query: "message",
              id: userId,
              message: prompt
            }

            socketRef.send(JSON.stringify(payload));
            setPrompt("");
          } 
        } 
      }

      


    const Detail = useRecoilValue(userDetail);
    
    if(!isLogin){
        return(
            <div className="bg-black h-[100vh] w-[100vw] flex items-center justify-center flex-col">
                <Image src={logo} alt="Logo" />
                <span className="loader"></span>
            </div>
        )
    }

    return ( <div className="relative h-screen w-screen overflow-y-auto bg-blackish text-white flex">

        <ScrollArea className="h-[100%] w-[15%] rounded-md pt-[2rem] px-[1rem] pb-[2rem]">
            
                          <div className="h-[5rem] w-[5rem] border-[1px] border-black rounded-full flex items-center justify-center overflow-hidden">
                            <Image src={gptLogo} alt="userLogo" className="h-[100%] w-[100%]"/>
                          </div>
                          <div>Team Ctrl c Ctrl v</div>
            
        </ScrollArea>
        
        <div className="h-[100%] w-[85%] pt-[3rem] pb-[2rem]  items-center justify-center flex flex-col gap-[1rem] bg-greyish">
            <ScrollArea className="h-[90%] w-[100%] flex items-center justify-center rounded-md  text-white">
                
                {
                  message.map((msg, index)=>(
                    <div key={index} className="w-[100%] flex justify-center  mb-[2rem] gap-[1rem] pl-[8%]">
                      
                      <div className="h-[100%] flex ">
                          <div className="h-[2.5rem] w-[2.5rem] border-[1px] border-black rounded-full flex items-center justify-center overflow-hidden">
                            <Image src={msg.sender=="user" ? userLogo : gptLogo} alt="userLogo" className="h-[100%] w-[100%]"/>
                          </div>
                      </div>
                      <div className={`${msg.valid ? 'text-white': 'text-red-600 font-bold'} pr-[25%] w-[80%] flex items-center`}>
                        {msg.message}
                      </div>
                    </div>
                  ))
                }
                
            </ScrollArea>
            <Textarea placeholder="Message Chatgpt" ref={prompRef}  onKeyDown={handleKeyDown} onChange={(e)=> setPrompt(e.currentTarget.value)} value={prompt} className="w-[70%]  flex items-center justify-center"/>
        </div>

        <Alert open={alert} setOpen={setALert}/>



    </div> );
}
 
export default Home;