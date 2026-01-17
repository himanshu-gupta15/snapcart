// import { auth } from '@/auth'
// import AdminDashboard from '@/components/AdminDashboard'
// import DeliveryBoy from '@/components/DeliveryBoy'
// import EditRoleMobile from '@/components/EditRoleMobile'
// import Nav from '@/components/Nav'
// import UserDashboard from '@/components/UserDashboard'
// import connectDb from '@/lib/db'
// import User from '@/model/user.model'
// import { redirect } from 'next/navigation'
// import React from 'react'



//  async function Home() {
//   await connectDb()
//   const session=await auth()
//   const user=await User.findById(session?.user?.id)
//   if(!user){
//     redirect("/login")
//   }
//   const inComplete=!user.mobile || !user.role || (!user.mobile && user.role=="user")
//   if(inComplete){
//     return <EditRoleMobile/>
//   }
//   const plainUser=JSON.parse(JSON.stringify(user))
//   return (
//     <div>
//     <Nav user={plainUser}/>
//     {user.role=="user"?(
//       <UserDashboard/>
//     ):user.role=="admin"?(
//       <AdminDashboard/>
//     ):<DeliveryBoy/>}
//     </div>
//   )
// }

// export default Home


import { auth } from '@/auth'
import AdminDashboard from '@/components/AdminDashboard'
import DeliveryBoy from '@/components/DeliveryBoy'
import EditRoleMobile from '@/components/EditRoleMobile'
import Footer from '@/components/Footer'
import GeoUpdater from '@/components/GeoUpdater'
import Nav from '@/components/Nav'
import UserDashboard from '@/components/UserDashboard'
import connectDb from '@/lib/db'
import Grocery, { IGrocery } from '@/model/grocery.models'
import User from '@/model/user.model'
import { redirect } from 'next/navigation'

export default async function Home(props:{
  searchParams:Promise<{
    q:string 
  }>
}) {

  const searchParams=await props.searchParams
  
  await connectDb()

  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await User.findById(session.user.id).lean()
  if (!user) {
    redirect('/login')
  }

  // Profile completion check
  const inComplete = !user.mobile || !user.role
  if (inComplete) {
    return <EditRoleMobile />
  }
  const plainUser=JSON.parse(JSON.stringify(user))
   let groceryList:IGrocery[]=[]

   if(user.role ==="user"){
    if(searchParams.q){
      groceryList=await Grocery.find({
        $or:[
          {name:{$regex:searchParams?.q || "",$options:"i"}},
          {category:{$regex:searchParams?.q || "",$options:"i"}},
        ]
      })
    }else{
      groceryList=await Grocery.find({})
    }
   }
  return (
    <div>
      <Nav user={plainUser} />
      <GeoUpdater userId={plainUser._id}/>

      {user.role === 'user' && <UserDashboard groceryList={groceryList}/>}
      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'deliveryBoy' && <DeliveryBoy />}
      <Footer/>
    </div>
  )
}
