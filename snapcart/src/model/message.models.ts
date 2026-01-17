import mongoose from "mongoose";

export interface IMessage{
  _id?:mongoose.Types.ObjectId,
  roomId:mongoose.Types.ObjectId,
  text:string,
  senderId:mongoose.Types.ObjectId,
   createdAt: string;
  updatedAt: string;
}

const messageSchema=new mongoose.Schema<IMessage>({
  roomId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Order"
  },
  text:{
    type:String
  },
  senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  

},{timestamps:true})

const Message=mongoose.models.Message || mongoose.model("Message",messageSchema)
export default Message 