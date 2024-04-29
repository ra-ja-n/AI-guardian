import mongoose from 'mongoose';

const URL:string = process.env.DBURL || 'mongodb+srv://ayushchamola8433:6o9zzMrM9QKzEFA0@knacktohack.idbcjxu.mongodb.net/';

export async function dbConnect() {
    mongoose.connect(URL,{
        serverSelectionTimeoutMS: 5000
    }).then(()=>{
        console.log("Sucessfully connected with db");
    }).catch((e:Error)=>{
        console.log("Unable to connect with db");
        console.log(e);
    })
}



