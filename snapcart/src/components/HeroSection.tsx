'use client'

import { RootState } from '@/redux/store'

import { Leaf, ShoppingBasket, Smartphone, Truck } from 'lucide-react'
import { AnimatePresence,motion } from 'motion/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function HeroSection() {
  
 
 
  const slides=[
    {
      id:1,
      icon:<Leaf/>,
      title:"Fresh Organic Groceries",
      subtitle:"Farm-fresh fruits,vegetables, and daily essentials delivered to you.",
      btnText:"Shop Now",
      bg:"https://media.istockphoto.com/id/1257538623/photo/fresh-food-delivery-service.jpg?s=612x612&w=is&k=20&c=uDuZVS61Y_rqxCBBdDFz87bJYKKwSlOryhdfF4hOKZE="
    },
    {
      id:2,
      icon:<Truck className='w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-lg'/>,
      title:"Fast & Reliable Delivery",
      subtitle:"We ensures groceries reach your doorstep in no time.",
      btnText:"Order Now",
      bg:"https://media.istockphoto.com/id/2213567563/photo/couriers-exchanging-package-on-city-street.jpg?s=1024x1024&w=is&k=20&c=d8sikNqN7n7YdtggrgIuNnoRnIorgQdPKRavoyV4AXA="
    },
    {
      id:3,
      icon:<Smartphone className='w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-lg'/>,
      title:"Shop Anytime, Anywhere",
      subtitle:"Easy and seamless online grocery shopping experience.",
      btnText:"Get Started",
      bg:"https://media.istockphoto.com/id/2200540700/photo/online-shopping-24-7.jpg?s=1024x1024&w=is&k=20&c=xrce42n3YWPHBGmRjBfQ7ifSfmeLGwkZFXTnNasHPu4="
    }
  ]
  const [current,setCurrent]=useState(0)
  useEffect(()=>{
    const timer=setInterval(()=>{
      setCurrent(prev=>(prev+1)%slides.length)
    },4000)
   return()=>clearInterval(timer)
  },[])
  return (
    <div className='relative w-[98%] mx-auto mt-32 h-[80vh] rounded-3xl overflow-hidden shadow-2xl'>
      <AnimatePresence mode='wait'>
      <motion.div
       initial={{
          opacity:0,
         
        }}
        animate={{
          opacity:1,
          
        }}
        transition={{
          duration:0.8
        }}
        exit={{opacity:0}}
         key={current}
        className='absolute inset-0'
      >
        <Image
        src={slides[current].bg}
        fill 
        alt='slide'
        priority
        />
    <div className='absolute inset-0 bg-black/50 backdrop-blur-[1px]
    '></div>
      </motion.div>
      </AnimatePresence>
       <div className='absolute inset-0 flex items-center justify-center text-center text-white px-6'>
        <motion.div
        initial={{
          opacity:0,
         
        }}
        animate={{
          opacity:1,
          
        }}
        transition={{
          duration:0.6
        }}
        className='flex flex-col items-center justify-center gap-6 max-w-3xl'
        >
          <div className='bg-white/10 backdrop-blur-md p-6 rounded-full shadow-lg'>{slides[current].icon}</div>
           <h1 className='text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg'>{slides[current].title}</h1>
           <p className='text-lg sm:text-xl text-gray-200 max-w-2xl'>{slides[current].subtitle}</p>
           <motion.button
           whileHover={{scale:1.09}}
           whileTap={{scale:0.96}}
           transition={{duration:0.2}}
            className='mt-4 bg-white text-green-700 hover:bg-green-100 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2'
           >
            <ShoppingBasket className='w-5 h-5'/>
            {slides[current].btnText}
           </motion.button>
        </motion.div>

       </div>
       <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3'>
       {slides.map((_,index)=>(
        <button
         key={index}
         className={`w-3 h-3 rounded-full transition-all ${
          index===current ? "bg-white w-6":"bg-white/50"
         }`}
        />

        
       ))}
       </div>
    </div>
  )
}

export default HeroSection
