'use client'
import { IOrder } from '@/model/order.models'
import axios from 'axios'
import { ArrowLeft, PackageSearch } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import UserOrderCard from '@/components/UserOrderCard'
import { getSocket } from '@/lib/socket'

// We create a helper type to ensure _id is treated as a string in the frontend
type ClientOrder = Omit<IOrder, '_id'> & { _id: string };

function Page() {
  const router = useRouter()
  
  // 1. Initialize with an empty array to avoid undefined errors
  const [orders, setOrders] = useState<ClientOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const result = await axios.get("/api/user/my-orders")
        
        // 2. Cast the incoming JSON data to our ClientOrder type
        setOrders(result.data as ClientOrder[])
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
        setLoading(false)
      }
    }
    getMyOrders()
  }, [])

  useEffect(()=>{
    const socket=getSocket()
    socket.on("order-assigned",({orderId,assignedDeliveryBoy})=>{
  setOrders((prev)=>prev?.map((o)=>(
    o._id==orderId?{...o,assignedDeliveryBoy}:o 
  )))
    })
    return ()=>{socket.off("order-assigned")}
  },[])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[50vh] text-gray-600 font-medium'>
        <div className="animate-pulse">Loading Your Orders...</div>
      </div>
    )
  }

  return (
    <div className='bg-linear-to-b from-white to-gray-100 min-h-screen w-full'>
      <div className='max-w-3xl mx-auto px-4 pt-16 pb-10 relative'>
        <div className='fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50'>
          <div className='max-w-3xl mx-auto flex items-center gap-4 px-4 py-3'>
            <button 
              className='p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition' 
              onClick={() => router.push("/")}
            >
              <ArrowLeft size={24} className='text-green-700' />
            </button>
            <h1 className='text-xl font-bold text-gray-800'>My Orders</h1>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className='pt-20 flex flex-col items-center text-center'>
            <PackageSearch size={70} className='text-green-600 mb-4 opacity-80' />
            <h2 className='text-xl font-semibold text-gray-700'>No Orders Found</h2>
            <p className='text-gray-500'>Start shopping to view your orders here.</p>
          </div>
        ) : (
          <div className='mt-4 space-y-6'>
            {orders.map((order, index) => (
              <motion.div
                key={order._id || index} // Use order._id as the key for better performance
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {/* Ensure UserOrderCard also accepts this order type */}
                <UserOrderCard order={order as any} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Page