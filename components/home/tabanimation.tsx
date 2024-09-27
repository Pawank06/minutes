'use client'

import React, {useRef } from 'react'
import { AnimationControls, motion, useAnimation } from 'framer-motion'
import { cn } from '@/lib/utils';

const TabAnimation = () => {
  const controls = useAnimation();

  const handleMouseLeave = () => {
    controls.start({ opacity: 0 });
  };

  return (
    <div className=' mx-auto hidden md:flex items-center justify-center'>
    <div className='flex items-center justify-center'>
      <div
        onMouseLeave={handleMouseLeave}
        className='relative mx-auto  px-1 py-1 rounded-full flex  items-center'
      >
        <Tab controls={controls}>Pricing</Tab>
        <Tab controls={controls}>Features</Tab>
        <Tab controls={controls}>Docs</Tab>
        <Tab controls={controls} >Blog</Tab>
        <Cursor controls={controls} />
      </div>
    </div>
    </div>
  )
}

export default TabAnimation;

const Tab = ({ children, controls, className }: { children: React.ReactNode, controls: AnimationControls, className?:string }) => {
  const ref = useRef<null | HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!ref?.current) return;

    const { width } = ref.current.getBoundingClientRect();

    controls.start({
      left: ref.current.offsetLeft,
      width,
      opacity: 1,
    });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      className={cn('relative z-10 block cursor-pointer px-3 py-1.5 uppercase text-white mix-blend-difference md:px-5 md:py-3 text-sm', className)}
    >
      {children}
    </div>
  );
};

const Cursor = ({ controls }: { controls: AnimationControls }) => {
  return (
    <motion.div
      animate={controls}
      className='absolute z-0 h-7 rounded-full bg-black  md:h-12'
    />
  );
};