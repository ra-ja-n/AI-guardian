import { NextRequest, NextResponse } from "next/server";
import jwt, { JsonWebTokenError, JwtPayload, Secret, TokenExpiredError, VerifyOptions } from "jsonwebtoken";

export const GET = async (req: NextRequest) => {
    const cookiet  = req.cookies.get("auth-cookie");
    if(!cookiet){
        return NextResponse.json({success: false, message: "No cookie found"},{status: 401});
    }
    console.log(cookiet);
    try{
        console.log("Cookie value:", cookiet.value);
        const token = cookiet.value;
        console.log(token);
        const jwtSecret: Secret = process.env.jwtSecret || '';
        const options: VerifyOptions & { complete: true } = {
            complete: true // This option makes the function return a decoded JWT object with header and payload
        };
        const decoded: JwtPayload = jwt.verify(token, jwtSecret, options)
        console.log(decoded);
        return NextResponse.json({success: true, message: "Log in", id: decoded.payload.id},{status: 200});
    } catch(e){
        console.log(typeof e)
        
        if (e instanceof TokenExpiredError) {
            return NextResponse.json({
                success: false,
                message: "Token has been expired, please login again to get a new TOKEN"
            }, { status: 501 });
          } else if (e instanceof JsonWebTokenError) {
            return NextResponse.json({
                success: false,
                message: "Token has been tampered"
            }, { status: 501 });
          } else {
            return NextResponse.json({
                success: true,
                message: "Something went wrong on server",
                e
            }, { status: 501 });
          }

    }

}