import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import Order from "@/model/order.models";
import User from "@/model/user.model";

import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest){
  try{
    await connectDb()
    const {userId,items,paymentMethod,totalAmount,address}=await req.json()
    if(!items || !userId || !paymentMethod || !totalAmount || !address){
      return NextResponse.json(
        {message:"please send all credentials"},
        {status:400}
      )
    }
    const user=await User.findById(userId)
    if(!user){
    return NextResponse.json(
      {message:"user not found"},
      {status:400}
    )
    }

    const newOrder=await Order.create({
      user:userId,
      items,
      
      paymentMethod,
      totalAmount,
      address,
        assignment: null,
  assignedDeliveryBoy: null
    })
  //  await emitEventHandler("new-order",newOrder)
  // Convert to a plain object so defaults like 'status' are included
const orderToEmit = newOrder.toObject();

// IMPORTANT: Emit the plain object with the status
await emitEventHandler("new-order", orderToEmit);
    return NextResponse.json(
     newOrder,
      {status:201}
    )


  }catch(error){
 return NextResponse.json(
      {message:`place order error ${error}`},
      {status:500}
    )
  }
}