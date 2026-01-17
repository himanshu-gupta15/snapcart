import connectDb from "@/lib/db"
import Message from "@/model/message.models"
import Order from "@/model/order.models"
import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

export async function POST(req: NextRequest) {
  try {
    await connectDb()

    const { roomId } = await req.json()

    // Validate room
    const room = await Order.findById(roomId)
    if (!room) {
      return NextResponse.json({ message: "room not found" }, { status: 400 })
    }

    // Fetch messages
    const messages = await Message.find({
      roomId: new mongoose.Types.ObjectId(roomId)
    }).sort({ createdAt: 1 }) // oldest → newest

    return NextResponse.json(messages, { status: 200 })

  } catch (error: any) {
    console.error("get messages error:", error)
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  }
}
