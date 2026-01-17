import axios from "axios";
import React from "react";

async function emitEventHandler(
  event: string,
  data: any,
  socketId?: string
) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_SERVER}/notify`,
      { socketId, event, data }
    )
    console.log("Emitting", event)

    return response.data
  } catch (error) {
    console.error("Emit failed:", error)
    throw error
  }
}


export default emitEventHandler