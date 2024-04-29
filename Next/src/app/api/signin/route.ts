import { User } from "@/schema/userSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { dbConnect } from "@/utils/dbConnect";
import ms from "ms"

dotenv.config();

const zodRes = z.object({username: z.string()})

export const POST = async(req:NextRequest)=>{
    const body = await req.json();
    try{
        const {username, password} = body;
        console.log("Username " + username + " password " + password);
        await dbConnect();
        const SearchUser = await User.findOne({ username: username });
        if (!SearchUser) {
            return (NextResponse.json({
                success: false,
                msg: "User does not exist",
            }, {status:404}))
        }
        console.log(SearchUser)
        const comparePassword = await bcrypt.compare(password, SearchUser.password);
        if (!comparePassword) {
            console.log("Incorrect password");
            return (NextResponse.json({
              success: false,
              msg: "Incorrect password, please double check before submitting",
            },{status: 401}))
        }

        const payload = {
            username: username,
            email: SearchUser.email,
            id: SearchUser._id
        };
        const options = {
            expiresIn: ms(Date.now()+7*24*60*60*1000)
          };
        const jwtSecret: string = process.env.jwtSecret || '';
        let jwt_TOKEN = jwt.sign(payload, jwtSecret, options);
        const expirationDate = new Date(Date.now() + 7*24*60*60*1000);
        const cookieOptions = {
            expires: expirationDate,
            sameSite: "none" as const,
            secure: true,
            httpOnly: true,
        };
        console.log("Final Phase")
        
        const response =  NextResponse.json({
            success: true,
            message: "Successfully logged in",
            id: SearchUser._id
        }, {status: 200})
        response.cookies.set("auth-cookie", jwt_TOKEN, cookieOptions);
        
        return response
    } catch(e){
        console.log("error aagye")
        console.log(e)
        return (NextResponse.json({
            success: false,
            message: "Server Error",
            error: e
        },{status: 500}))
    }
}


