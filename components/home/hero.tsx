'use client'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'; // Ensure you import motion

const Hero = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.1,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    }

  return (
    <motion.div 
      className='md:mt-20 p-4 lg:grid lg:grid-cols-2 flex flex-col items-center'
      variants={containerVariants}
            initial="hidden"
            animate="visible"
    >
      <div className='flex gap-3 flex-col items-center justify-center lg:items-start p-4'>
        <p className='px-3 border py-1 text-sm rounded-lg shadow-inner flex items-center gap-1 font-medium text-stone-800'>Version 1 is here <span className='ml-auto text-gray-500'>&#x279C;</span></p>
        <h1 className='md:text-6xl text-2xl font-bold tracking-tight text-center lg:text-start'>Monetize Your Time, Connect with Your Audience</h1>
        <p className='text-sm md:text-base text-muted-foreground text-center lg:text-start'>Create Solana-powered Blinks to sell your time,<br /> engage directly with your fans, and grow your community effortlessly.</p>
        <div className='flex items-center gap-2'>
          <Link href="/auth/signin">
            <Button className='rounded-full'>Get started now</Button>
          </Link>
          <Button className='rounded-full shadow-inner' variant="outline">Learn more</Button>
        </div>
      </div>
      <motion.div 
        className='relative h-[400px] md:min-h-[600px] mt-5 md:mt-10 lg:mt-0 bg-stone-100 rounded-2xl flex items-center justify-center w-[360px] md:w-[850px]'
        animate={{ y: [0, -10, 0] }} // Float effect
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }} // Smooth transition
      >
        {/* First image */}
        <Image
          src="/kash(1).png"
          alt='kash'
          width={270}
          height={200}
          className="absolute object-contain z-20 left-0 transform drop-shadow-md translate-x-[1rem] md:translate-x-[3rem] top-1/2 -translate-y-1/2  w-[160px] md:w-[270px] "
        />
        {/* Second image */}
        <Image
          src="/shek.png"
          alt='shek'
          width={300}
          height={300}
          className="absolute drop-shadow-lg object-contain z-30 w-[180px] md:w-[300px] top-1/2 -translate-y-1/2 "
        />
        {/* Third image */}
        <Image
          src="/irfan.png"
          alt='irfan'
          width={270}
          height={200}
          className="absolute object-contain z-10 right-0 transform drop-shadow-md -translate-x-[1rem] md:-translate-x-[3rem] top-1/2 -translate-y-1/2  w-[160px] md:w-[270px] "
        />
      </motion.div>
    </motion.div>
  )
}

export default Hero
