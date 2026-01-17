import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/model/deliveryAssignment.models";
import Order from "@/model/order.models";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
  try{
   await connectDb() 
   const {orderId,otp}=await req.json()
   if(!orderId || !otp){
    return NextResponse.json(
      {message:"orderId or OTP not found"},
      {status:400}

    )
   }
   const order=await Order.findById(orderId)
   if(!order){
   return NextResponse.json(
    {message:"order not found"},
    {status:400}
   )}

   if(order.deliveryOtp!=otp){
    return NextResponse.json(
      {message:"Incorrect or expired Otp"},
      {status:400}
    )
   }

   order.status="delivered"
   order.deliveryOtpVerification=true 
   order.deliveredAt=new Date()
   await order.save()

    await emitEventHandler("order-status-update",{orderId:order._id,status:order.status})
   
  //  await DeliveryAssignment.updateOne(
  //   {order:orderId},
  //   {$set:{assignedTo:null,status:"completed"}}
  //  )
   

 const assignment = await DeliveryAssignment.findOne({ order: orderId })

if (assignment) {
  const deliveryBoyId = assignment.assignedTo   // 🔥 save it first

  assignment.status = "completed"
  assignment.assignedTo = null
  await assignment.save()

  await emitEventHandler("order-completed", {
    assignmentId: assignment._id,
    orderId: order._id,
    deliveryBoyId
  })
}


   return NextResponse.json(
    {message:"Delivery successfully completed"},
    {status:200}
   )
  }catch(error){
    return NextResponse.json(
      {message:`verify otp error ${error}`},
      {status:500}
    )
  }
}