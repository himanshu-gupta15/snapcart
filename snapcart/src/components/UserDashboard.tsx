import React from 'react'
import HeroSection from './HeroSection'
import CategorySlider from './CategorySlider'
import { q } from 'motion/react-client'
import Grocery, { IGrocery } from '@/model/grocery.models'
import mongoose from 'mongoose'
import connectDb from '@/lib/db'
import GroceryItemCard from './GroceryItemCard'

async function UserDashboard({groceryList}:{groceryList:IGrocery[]}) {
  await connectDb()
  const groceries=await Grocery.find({}).lean()
  const plainGrocery=JSON.parse(JSON.stringify(groceryList))
  return (
    <div>
      <HeroSection/>
      <CategorySlider/>
      <div className='w-[90%] md:w-[80%] mx-auto mt-10'>
        <h2 className='text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center'>Popular Grocery Items</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
          {plainGrocery.map((item:any,index:number)=>(
        <GroceryItemCard key={index} item={item}/>
      ))}
        </div>

      </div>
      
    </div>
  )
}

export default UserDashboard
