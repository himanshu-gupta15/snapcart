// import express from "express"
// import http from "http"
// import dotenv from "dotenv"
// import {Server} from "socket.io"
// import axios from "axios"
// dotenv.config()
// const app=express()
// app.use(express.json())
// const server=http.createServer(app)
// const port=process.env.PORT 

// const io=new Server(server,{
//   cors:{
//     origin:process.env.NEXT_BASE_URL
//   }
// })
 
// io.on("connection",(socket)=>{
 

//   socket.on("identity",async(userId)=>{
//     console.log(userId)
//     await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`,{userId,socketId:socket.id})
    
//   })

//   socket.on("update-location",async({userId,latitude,longitude})=>{
//     let location={
//       type:"Point",
//       coordinates:[longitude,latitude]
//     }
//     await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/update-location`,{userId,location})
//     io.emit("update-deliveryBoy-location",{userId,location})
//   })
 
//   socket.on("join-room",(roomId)=>{
//     console.log("join room with",roomId)
//     socket.join(roomId)
//   })

//   socket.on("send-message",async(message)=>{
//     console.log(message)
//     await axios.post(`${process.env.NEXT_BASE_URL}/api/chat/save`,message)
//     io.to(message.roomId).emit("send-message",message)
//   })
//   socket.on("disconnect",()=>{
//     console.log("user disconnected",socket.id)
//   })
// })

// app.post("/notify",(req,res)=>{
//   const {event,data,socketId}=req.body;
//   if(socketId){
//     io.to(socketId ).emit(event,data)
//   }else{
//     io.emit(event,data)
//   }
//   console.log("Notify:", event)

//   return res.status(200).json({"sucess":true})
// })

// server.listen(port,()=>{
//   console.log("server started at",port)
// })

import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import axios from "axios";

dotenv.config();
const app = express();
app.use(express.json());

const server = http.createServer(app);
const port = process.env.PORT || 4000;

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_BASE_URL,
    methods: ["GET", "POST"]
  }
});

// Helper for internal API calls
const internalApi = axios.create({
  baseURL: process.env.NEXT_BASE_URL,
  headers: {
    'x-internal-secret': process.env.INTERNAL_SECRET // Ensure this is in your .env
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("identity", async (userId) => {
    try {
      await internalApi.post("/api/socket/connect", { userId, socketId: socket.id });
    } catch (err) {
      console.error("Identity Sync Error:", err.message);
    }
  });

  socket.on("update-location", async ({ userId, latitude, longitude }) => {
    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    // 1. Emit IMMEDIATELY for smooth UI tracking
    io.emit("update-deliveryBoy-location", { userId, location });

    // 2. Sync with DB in the background
    try {
      await internalApi.post("/api/socket/update-location", { userId, location });
    } catch (err) {
      console.error("Location Sync Error:", err.message);
    }
  });

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  socket.on("send-message", async (message) => {
    // 1. Emit to room immediately
    io.to(message.roomId).emit("send-message", message);

    // 2. Save to DB
    try {
      await internalApi.post("/api/chat/save", message);
    } catch (err) {
      console.error("Chat Save Error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.post("/notify", (req, res) => {
  const { event, data, socketId } = req.body;
  if (socketId) {
    io.to(socketId).emit(event, data);
  } else {
    io.emit(event, data);
  }
  return res.status(200).json({ success: true });
});

server.listen(port, () => {
  console.log(`Socket Server running on port ${port}`);
});