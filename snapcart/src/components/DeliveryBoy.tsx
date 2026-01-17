import React from 'react'
import DeliveryBoyDashboard from './DeliveryBoyDashboard'
import connectDb from '@/lib/db'
import { auth } from '@/auth'
import Order from '@/model/order.models'


async function DeliveryBoy() {
  await connectDb()
  const session=await auth()
  const deliveryBoyId=session?.user?.id 
  const orders=await Order.find({
    assignedDeliveryBoy:deliveryBoyId,
    deliveryOtpVerification:true 
  })

  const today=new Date().toDateString()
  const todayOrders=orders.filter((o)=>new Date(o.deliveredAt).toDateString()===today).length
  const todaysEarning=todayOrders*40
  return (
    <div>
       
      <DeliveryBoyDashboard earning={todaysEarning}/>
    </div>
  )
}

export default DeliveryBoy
