import { User } from "@/schema/userSchema";
import { dbConnect } from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { formSchema } from "@/zodResolvers/resolver";

export const POST = async(req:NextRequest)=>{
    // const {username} = req.body;
    try{
        const body = await req.json();
        const {username, email, password, firstname, lastname} = body;
        console.log(body)
        const validate = formSchema.safeParse({username, email, password, firstname, lastname});
        if(!validate.success){
            return NextResponse.json({success: false, message: validate.error.message}, {status: 400})
        }
        await dbConnect();
        const SearchUser = await User.findOne({$or: [{ username: username }, { email: email }],});
        console.log(SearchUser);
        if(!SearchUser){
            const encryptedPassword = await bcrypt.hash(password, 10);
            const NewUser = await User.create({
                username,
                password: encryptedPassword,
                email,
                firstname,
                lastname
              });
              console.log("Successfully created\n")
              return NextResponse.json({
                success: true,
                message: "Successfully created account",
                id: NewUser._id,
              }, {status: 200});
        } else{
            return NextResponse.json({success: false, message:
                SearchUser.email === email
                  ? "Email already register"
                  : "username already taken",}, {status: 201})
        }
    } catch(e){

    }
}