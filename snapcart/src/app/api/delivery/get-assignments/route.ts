// import { auth } from "@/auth";
// import connectDb from "@/lib/db";
// import DeliveryAssignment from "@/model/deliveryAssignment.models";
// import { NextResponse } from "next/server";
// import Order from "@/model/order.models" 


// export async function GET(){
//   try{
//  await connectDb()
//  const session=await auth()
//  console.log("SESSION:", session);

//  const assignments=await DeliveryAssignment.find({
//   broadcastedTo:session?.user?.id,
//   status:"broadcasted"
//  }).populate("order")
//  return NextResponse.json(
//   assignments,{status:200}
//  )
//   }catch(error){
//     return NextResponse.json(
//       {message:`get assignments error ${error}`},{status:500}
//     )
//   }
// }


// export async function GET() {
//   try {
//     await connectDb()
   
//     const session = await auth()

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { message: "Unauthorized" },
//         { status: 401 }
//       )
//     }

//     const assignments = await DeliveryAssignment.find({
//       broadcastedTo: session.user.id,
//       status: "broadcasted"
//     }).populate("order")

//     return NextResponse.json(assignments, { status: 200 })

//   } catch (error) {
//     return NextResponse.json(
//       { message: `get assignments error ${error}` },
//       { status: 500 }
//     )
//   }
// }



import { auth } from "@/auth"
import connectDb from "@/lib/db"
import DeliveryAssignment from "@/model/deliveryAssignment.models"
import "@/model/order.models" // 🔥 important
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDb()

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const assignments = await DeliveryAssignment.find({
      broadcastedTo: session.user.id,
      status: "broadcasted"
    }).populate("order")

    return NextResponse.json(assignments, { status: 200 })

  } catch (error: any) {
    console.error("❌ GET ASSIGNMENTS ERROR:", error)
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  }
}
