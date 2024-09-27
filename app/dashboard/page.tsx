import Containers from '@/components/dashboard/containers'
import Sidebar from '@/components/dashboard/sidebar'
import { getSession } from '@/lib/getSession'
import { redirect } from 'next/navigation'
import React from 'react'

const Dashboard = async() => {
  const session = await getSession()
  if(!session?.user) redirect('/auth/signin')
  return (
    <div className='flex md:flex-cols-2'>
      <Sidebar/>
      <Containers/>
    </div>
  )
}

export default Dashboard