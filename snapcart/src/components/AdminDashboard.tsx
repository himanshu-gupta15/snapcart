import React from 'react'
import Nav from './Nav'
import AdminDashboardClient from './AdminDashboardClient'
import connectDb from '@/lib/db'
import Order from '@/model/order.models'
import User from '@/model/user.model'
import Grocery from '@/model/grocery.models'
import { join } from 'path'


async function AdminDashboard() {
  await connectDb()
  const orders=await Order.find({})
  const users=await User.find({role:"user"})
  const groceries=await Grocery.find({})

  const totalOrders=orders.length 
  const totalCustomers=users.length 
  const pendingDeliveries=orders.filter((o)=>o.status==="pending").length 
  const totalRevenue=orders.reduce((sum,o)=>sum+(o.totalAmount || 0),0)


  const today=new Date() 
  const startofToday=new Date(today) 
  startofToday.setHours(0,0,0,0) 

  const sevenDaysAgo=new Date() 
  sevenDaysAgo.setDate(today.getDate()-6)

  const todayOrders=orders.filter((o)=>new Date(o.createdAt)>=startofToday)
  const todayRevenue=todayOrders.reduce((sum,o)=>sum+(o.totalAmount || 0),0)

  const sevenDaysOrders=orders.filter((o)=>new Date(o.createdAt)>=sevenDaysAgo) 
  const sevenDaysRevenue=sevenDaysOrders.reduce((sum,o)=>sum+(o.totalAmount ||0),0)

  const stats=[
    {title:"Total Orders",value:totalOrders},
    {title:"Total Curstomers",value:totalCustomers},
    {
      title:"Pending Deliveries",value:pendingDeliveries
    },
    {title:"Total Revenue", value:totalRevenue}
  ]

  const chartData=[]
  for(let i=6;i>=0;i--){
    const date=new Date()
    date.setDate(date.getDate()-i)
    date.setHours(0,0,0,0) 

    const nextDay=new Date(date) 
    nextDay.setDate(nextDay.getDate()+1)

    const ordersCount=orders.filter((o)=>
      new Date(o.createdAt)>=date && new Date(o.createdAt)<nextDay).length
     chartData.push({
      day:date.toLocaleDateString("en-US",{weekday:"short"}),
      orders:ordersCount
     })
  }
  return (
    <div>
      <AdminDashboardClient
      earning={{
        today:todayRevenue,
        sevenDays:sevenDaysRevenue,
        total:totalRevenue
      }}
      stats={stats}
      chartData={chartData}
      />
    </div>
  )
}

export default AdminDashboard
