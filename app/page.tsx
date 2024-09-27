import Header from '@/components/home/header'
import Hero from '@/components/home/hero'
import React from 'react'


const page = () => {
  return (
    <main className='w-full lg:w-[1800px] mx-auto'>
      <Header/>
      <Hero/>
    </main>
  )
}

export default page
