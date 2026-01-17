import { auth } from "@/auth";
import uploadOnCLOUDINRY from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import Grocery from "@/model/grocery.models";
import { NextRequest,NextResponse } from "next/server";

export async function POST(req:NextRequest){
  try{
     await connectDb()
     const session=await auth()
     console.log("SESSION:", session);
     if(session?.user?.role!=="admin"){
        return NextResponse.json({
          message:"you are not admin"
        },
      {status:400})
     }
     const {groceryId}=await req.json()
     const grocery=await Grocery.findByIdAndDelete(groceryId)                  
     return NextResponse.json(
      grocery,
      {status:200}
     )
  }catch(error){
    return NextResponse.json(
   {message:`delete grocery error ${error}`},
   {status:500})
  }   
}