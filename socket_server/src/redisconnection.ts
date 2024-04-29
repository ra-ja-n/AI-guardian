import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();


export const Subscribedclient = createClient({
    url: process.env.redis_url,
});

export const client = createClient({
    url: process.env.redis_url,
});

export const Reddisconnect = async (client:any)=>{

    try{
        const res = await client.connect();
        console.log('Redis client connected');

    } catch(e){
        console.log("Unable to Connect to redis");
        console.log(e);
    }
     
}

