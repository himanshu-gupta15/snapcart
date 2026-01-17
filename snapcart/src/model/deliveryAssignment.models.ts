import mongoose from "mongoose";

interface IDeliveryAssigment{
  _id?:mongoose.Types.ObjectId 
  order:mongoose.Types.ObjectId 
  broadcastedTo:mongoose.Types.ObjectId[]
  assignedTo:mongoose.Types.ObjectId | null 
  status:"broadcasted" | "assigned" | "completed"
  acceptedAt:Date 
  createdAt?:Date 
  updatedAt?:Date 
}

const deliveryAssignmentSchema=new mongoose.Schema<IDeliveryAssigment>({
  order:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Order"  
  },
  broadcastedTo:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  ],
  assignedTo:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"User",
      default: null
  },
  status:{
    type:String,
    enum:["broadcasted","assigned","completed"],
    default:"broadcasted"
  },
  acceptedAt:{
    type:Date 
  }
},{timestamps:true})

const DeliveryAssignment=mongoose.models.DeliveryAssignment || mongoose.model("DeliveryAssignment",deliveryAssignmentSchema)

export default DeliveryAssignment