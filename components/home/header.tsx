import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Logo from '../logo/Logo'
import TabAnimation from './tabanimation'
import { getSession } from '@/lib/getSession'


const Header = async() => {
    const session = await getSession()
    const user = session?.user

    return (
        <header className='w-full p-4 mx-auto'>
            <div className='flex justify-between py-2 items-center uppercase text-sm'>
                <div className='flex items-center gap-1'>
                    <Logo className='w-10 h-10' />
                <TabAnimation/>
                </div>


                {!user ? (<div className='flex items-center gap-4'>
                    <Link href="/auth/signin">
                        Login
                    </Link>
                    <Link href="/auth/sigin">
                    <Button className='rounded-full uppercase font-medium text-sm'>
                        Sign up
                    </Button>
                    </Link>
                </div>) : (
                  <Link href="/dashboard">
                  <Button className='rounded-full uppercase font-medium text-sm'>
                      Get Started
                  </Button>
                  </Link>
                )}

            </div>
        </header>
    )
}

export default Header
