// import {auth} from "@/auth"
// import { NextRequest,NextResponse } from "next/server"
// import User from "@/model/user.model"
// import connectDb from "@/lib/db"
// export async function GET(req:NextRequest){
//   try{
//     await connectDb()
//     const session=await auth()
//     if(!session|| !session.user){
//       return NextResponse.json(
//         {message:"user is not authenticated"},
//         {status:400}
//       )
//     }
//     const user=await User.findOne({email:session.user.email}).select("-password")
//     if(!user){
//       return NextResponse.json(
//         {message:"user not found"},
//         {status:400}
//       )
//     }
//     return NextResponse.json(
//       user,
//       {status:200}
//     )
//   }catch(error){
//     return NextResponse.json(
//       {message:`get me error :${error}`},
//       {status:500}
//     )
//   }
// }

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/user.model";
import connectDb from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // ✅ 401 is correct
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDb();

    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error("GetMe error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
