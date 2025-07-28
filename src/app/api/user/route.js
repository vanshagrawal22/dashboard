
import connectDb from "@/database"
import User from "@/models/user"
import { NextResponse } from "next/server"

export async function POST(req){
    try{
        await connectDb()
        const {email , name} = await req.json()
        const newUser = await User.create({name , email})
        if(newUser){
            return NextResponse.json({
                success:true,
                data:newUser,
                message:"User Registered Successfully"
            })
        }else{
            return NextResponse.json({
                success:false,
                message:"Failed to register the user please try again"
            })
        }
    }catch(error){
        console.log(error)
        return NextResponse.json({
            success:false,
            message:"Something went wrong!"
        })
    }
}