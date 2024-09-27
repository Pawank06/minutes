/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'; // Add this import
import Logo from '../logo/Logo';
import { Button } from '../ui/button';
import { Plus, Search, X } from 'lucide-react';
import Link from 'next/link';
import { Session, useSidebarStore } from '@/store/store';

const Sidebar = () => {
    const { isOpen, isLargeScreen, setIsOpen, setIsLargeScreen, setSelectedSession, setSessions, sessions, selectedSession } = useSidebarStore();
    const [isUpcoming, setIsUpcoming] = useState(true); // Add state for tab selection

    useEffect(() => {
        const handleResize = () => {
            const largeScreen = window.innerWidth >= 1024;
            setIsLargeScreen(largeScreen);
            setIsOpen(largeScreen);
        };
    
        handleResize();
        window.addEventListener('resize', handleResize);
    
        return () => window.removeEventListener('resize', handleResize);
    }, []); // No extra dependencies needed


    useEffect(() => {
        // ... existing resize handler code ...

        // Fetch sessions data
        const fetchSessions = async () => {
            try {
                const response = await fetch('/api/sessions');
                if (!response.ok) {
                    throw new Error('Failed to fetch sessions');
                }
                const formData = await response.json();
                setSessions(formData);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };

        fetchSessions();
    }, [setSessions]);

    const handleToggleSidebar = () => {
        if (!isLargeScreen) {
            setIsOpen(!isOpen);
        }
    };

    const handleSessionClick = (session: Session) => {
        setSelectedSession(session);
        setIsOpen(!isOpen);
    };

    const filteredSessions = isUpcoming 
        ? sessions.filter(session => new Date(session.date) >= new Date()) // Upcoming sessions
        : sessions.filter(session => new Date(session.date) < new Date()); // Past sessions

    return (
        <>
            <motion.div 
                className={`fixed lg:static top-0 left-0 h-full bg-white overflow-y-auto`}
                initial={{ width: 0, filter: 'blur(10px)' }}
                animate={{ width: isLargeScreen ? '500px' : isOpen ? '100%' : '0', filter: 'blur(0px)' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }} // Super fast animation
            >
                <motion.div
                    className="p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 }} // Slight delay to sync with sidebar animation
                >
                    <div className="mb-10 flex justify-between items-center">
                        <Link href="/">
                            <Logo className='w-10 h-10' />
                        </Link>
                        <X className='text-center lg:hidden' onClick={handleToggleSidebar} />
                    </div>
                    <div className='flex mb-5 items-center justify-between'>
                        <h3 className='text-xl font-medium'>My Sessions</h3>
                        <Link href="/create"> 
                        <Button className='rounded-full flex gap-1 items-center'>
                            <Plus className='w-4 h-4' /> Create 
                        </Button>
                        </Link>
                    </div>
                    <div className="mb-5">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full rounded-full p-2 pl-10 border"
                            />
                            <Search className='w-6 h-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                        </div>
                    </div>
                    <div className="flex justify-between mb-5 text-sm">
                        <button 
                            className={`flex-1 rounded-full py-3 ${isUpcoming ? 'bg-stone-100' : ''}`} 
                            onClick={() => setIsUpcoming(true)} // Set to upcoming
                        >
                            Upcoming <span className='ml-2 rounded-full border px-2 py-1 bg-yellow-200 shadow-inner'>{sessions.filter(session => new Date(session.date) >= new Date()).length}</span> 
                        </button>
                        <button 
                            className={`flex-1 rounded-full py-3 ${!isUpcoming ? 'bg-stone-100' : ''}`} 
                            onClick={() => setIsUpcoming(false)} // Set to past
                        >
                            Past <span className='ml-2 rounded-full border px-2 py-1 bg-green-200 {sessions.filter(session => new Date(session.date) >= new Date()).length}'>{sessions.filter(session => new Date(session.date) <= new Date()).length}</span>
                        </button>
                    </div>
                    <div className="mt-5">
                        <div className="text-sm text-gray-500 mb-2">Select a session</div>
                        {
                            filteredSessions.map((session) => (
                                <div 
                                    key={session._id} 
                                    className={`flex items-center p-2 rounded-full mb-2 cursor-pointer ${
                                        selectedSession && selectedSession._id === session._id
                                            ? 'bg-stone-100'
                                            : ' hover:bg-stone-200'
                                    }`}
                                    onClick={() => handleSessionClick(session)}
                                >
                                    <div className="text-lg bg-white font-medium mr-3 rounded-full border px-3 py-2">
                                        {String(new Date(session.date).getDate()).padStart(2, '0')}
                                    </div>
                                    <div>
                                        <div className="font-medium">{session.organizationName}</div>
                                        <div className="text-sm text-gray-500 line-clamp-1">{session.description}</div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default Sidebar;