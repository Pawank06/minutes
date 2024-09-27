/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { Session, useSidebarStore } from '@/store/store';
import { ArrowUpRight, CheckCircle, ChevronsRight, Plus } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Button } from '../ui/button';
import Image from 'next/image';

interface Buyer {
  _id: string;
  timeslot: string;
  name: string;
  email: string;
  publicKey: string;
  buyername: string;
}

const Containers = () => {
  const { isOpen, isLargeScreen, setIsOpen, selectedSession, sessions } = useSidebarStore();
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);
  const [buyer, setBuyer] = useState<Buyer[]>([]);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/buyer');
        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }
  
        // Clear the buyer array before adding new data
        setBuyer([]);
  
        const formData = await response.json();
  
        // Type check to ensure that we are dealing with complete Buyer objects
        const completeBuyers: Buyer[] = formData
          .filter((data: { creatorId: string; _id: string }) => data.creatorId === selectedSession?._id)
          .map((data: { creatorId: string; _id: string }) => {
            // Map incomplete data to Buyer type with default values
            const buyer: Buyer = {
              _id: data._id,
              timeslot: (data as any).timeslot || 'Unknown timeslot', // Cast to any to avoid TS error for missing properties
              name: (data as any).name || 'Unknown name',
              email: (data as any).email || 'Unknown email',
              publicKey: (data as any).publicKey || 'Unknown key',
              buyername: (data as any).buyername || 'Unknown buyer',
            };
            return buyer;
          });
  
        setBuyer((prev) => [...prev, ...completeBuyers]);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };
  
    if (selectedSession) {
      fetchSessions();
    }
  }, [selectedSession]);
  


  const handleToggleSidebar = () => {
    if (!isLargeScreen) {
      setIsOpen(!isOpen);
    }
    controls.start({ x: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    controls.start({ x: 5 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    controls.start({ x: 0 });
  };

  useEffect(() => {
    let bookedCount = 0; // Initialize a counter

    // Check each time slot and increment the counter if booked
    if (selectedSession?.time1 === 'booked') bookedCount++;
    if (selectedSession?.time2 === 'booked') bookedCount++;
    if (selectedSession?.time3 === 'booked') bookedCount++;

    // Update the time state with the booked count
    setTime(bookedCount);
  }, [selectedSession]);

  return (
    <div className="p-8 h-screen md:w-full">
      <nav className="flex gap-10 mb-10 py-2">
        <Link href="#">Sessions</Link>
        <Link href="#">Calendar</Link>
        <Link href="#">Clients</Link>
      </nav>

      {!selectedSession && (
        <h3
          className="text-lg mb-3 text-black/75 flex gap-1 items-center cursor-pointer text-center"
          onClick={handleToggleSidebar}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          All Sessions
          {!isOpen && (
            <motion.div animate={controls}>
              <ChevronsRight className="text-black/60" />
            </motion.div>
          )}
        </h3>
      )}

      {selectedSession ? (
        <div className="xl:flex justify-between">
          <div className="xl:w-[500px] 2xl:w-[900px]">
            <h3
              className="text-lg mb-3 text-black/75 flex gap-1 items-center cursor-pointer text-center"
              onClick={handleToggleSidebar}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              All Sessions
              {!isOpen && (
                <motion.div animate={controls}>
                  <ChevronsRight className="text-black/60" />
                </motion.div>
              )}
            </h3>

            <div className="flex flex-col mb-5">
              <h3 className="text-2xl font-medium">
                {selectedSession.organizationName || 'Build'}
              </h3>
              <div className="flex items-center gap-1">
                <div className="rounded-full border p-[2px]">
                  <div className="w-[9px] h-[9px] bg-yellow-500 rounded-full" />
                </div>
                <h4 className="text-muted-foreground">mini sessions</h4>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="flex flex-col gap-2 bg-stone-100 p-3 rounded-lg">
                <h1 className="text-lg md:text-2xl">Earnings</h1>
                <h1 className="text-xl text-muted-foreground">{selectedSession.earnings} SOL</h1>
              </div>
              <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg">
                <h1 className="text-lg md:text-2xl">Booking</h1>
                <h1 className="text-xl text-muted-foreground">
                  <span className="text-black">{time}</span>/3
                </h1>
              </div>
              <div className="flex flex-col gap-2 bg-stone-50 p-3 rounded-lg">
                <h1 className="text-lg md:text-2xl">Views</h1>
                <h1 className="text-xl text-muted-foreground">{time}</h1>
              </div>
            </div>

            <div className="mt-10">
              <h1 className="text-xl">Monday September 23, 2024</h1>
              <p className="text-muted-foreground">30 min @zoom</p>
              <div className="mt-5">
                {buyer.map((b: Buyer) => (
                  <div
                    key={b._id}
                    className="px-2 border-b py-3 hover:bg-stone-100 cursor-pointer rounded-lg flex gap-2 items-center"
                  >
                    <p className="text-lg text-black/70">{b.timeslot}</p>
                    <div className="px-3 rounded-full shadow-inner bg-stone-100 border">
                      <CheckCircle className="w-3" />
                    </div>
                    <p className="text-muted-foreground">{b.buyername}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:mt-0 mt-10">
            <h3 className="text-lg mb-3 text-black/75 flex gap-1 items-center cursor-pointer text-center">
              Session details
            </h3>
            <div className="mt-5">
              <div className="md:w-[400px] h-fit rounded-lg border overflow-hidden">
                <Image
                  src={selectedSession.image || ''}
                  alt="build"
                  width={400}
                  height={400}
                />
              </div>
              <div className="mt-5 flex flex-col gap-1">
                <h1 className="font-medium">
                  {new Date(selectedSession.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h1>
                <h1 className="font-bold">{selectedSession.amount} SOL</h1>
                <h1 className="font-medium">{selectedSession.title || 'No title'}</h1>
                <h1 className="font-medium text-muted-foreground">
                  {selectedSession.description || 'No Description'}
                </h1>
                <Link
                  href={selectedSession.meetlink || ''}
                  className="w-fit font-medium underline line-clamp-1 flex items-center"
                >
                  {selectedSession.meetlink ? 'Meet Link' : 'No Link Provided'}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="">
                <Link href="/create">
                  <Button className="mt-2 rounded-full flex gap-1">
                    <Plus className="w-5" /> Create new
                  </Button>
                </Link>
              </div>
              <div className="h-[20px]" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[600px] items-center justify-center flex-col">
          {sessions.length !== 0 ? (
            <>
              <h1 className="text-center text-3xl md:text-4xl font-bold">No Session Selected.</h1>
              <p className="mt-1 text-sm md:text-base text-center text-muted-foreground">
                It looks like you haven&apos;t selected a session yet. <br className='hidden md:block' />
                You can select a session or create one to get started!
              </p>
              <Button
                className="mt-3 rounded-full flex items-center gap-1 text-center"
                onClick={handleToggleSidebar}
              >
                Select a session <ChevronsRight className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-center text-3xl md:text-4xl font-bold">You don&apos;t have any sessions.</h1>
              <p className="mt-1 text-sm md:text-base text-center text-muted-foreground">
                Create a new session to connect with your audience!
              </p>
              <Link href="/create">
                <Button className="mt-3 rounded-full flex items-center gap-1">
                  <Plus className="w-4 h-4" /> New session
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Containers;
