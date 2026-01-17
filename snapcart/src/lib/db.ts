//  import mongoose from "mongoose"


//  const mongodbUrl=process.env.MONGODB_URL

//  if(!mongodbUrl){
//   throw new Error("db error")
//  }

//  let cached=global.mongoose
//  if(!cached){
//   cached=global.mongoose={conn:null,promise:null}
//  }

//  const connectDb=async ()=>{
//   if(cached.conn){
//     return cached.conn
//   }
//   if(!cached.promise){
//     cached.promise= mongoose.connect(mongodbUrl).then((conn)=>conn.connection)
//   }
//  try{
//    cached.conn=await cached.promise
//    console.log("db connected")
//   }catch(error){
//     throw error
//   }
//   return cached.conn
// }
// export default connectDb



import mongoose from "mongoose"

const mongodbUrl = process.env.MONGODB_URL

if (!mongodbUrl) {
  throw new Error("db error")
}

let cached = (global as any).mongoose
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

const connectDb = async () => {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongodbUrl).then((mongoose) => mongoose)
  }

  cached.conn = await cached.promise
  console.log("db connected")

  return cached.conn
}

export default connectDb
