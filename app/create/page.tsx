/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, CheckCircle } from "lucide-react"; // Import CheckCircle icon
import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { motion, useAnimation } from 'framer-motion';
import { FaXTwitter } from "react-icons/fa6";

interface TimeSlotFormData {
  organizationName: string;
  email: string;
  creatorPublicKey: string;
  image: File | null;
  description: string;
  amount: number;
  date: string;
  time1: string;
  time2: string;
  time3: string;
  meetlink: string;
  title: string
}

const TimeSlotForm: React.FC = () => {
  const [formData, setFormData] = useState<TimeSlotFormData>({
    organizationName: "",
    creatorPublicKey: "",
    email: "",
    image: null,
    description: "",
    amount: 0,
    date: "",
    time1: "",
    time2: "",
    time3: "",
    meetlink: "",
    title: ""
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const router = useRouter()
  const [blinkId, setBlinkId] = useState("");
  const [copied, setCopied] = useState(false);
  const [icon, setIcon] = useState(<Copy />); // State to manage the icon
  const controls = useAnimation();

  const handleCopy = () => {
    const linkToCopy = `https://www.minutess.xyz/join/${blinkId}`;
    navigator.clipboard.writeText(linkToCopy).then(() => {
      setCopied(true);
      setIcon(<CheckCircle className="text-green-500" />); // Change icon to checkmark icon
      controls.start({ scale: 1.1, rotate: 360 }); // Animation on copy
      setTimeout(() => {
        setCopied(false);
        setIcon(<Copy />); // Reset icon back to original
        controls.start({ scale: 1, rotate: 0 }); // Reset animation
      }, 1000); // Reset copied status after 3 seconds
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? Number(value) : value,
    });
  };

  const handleNavigate = () => {
    router.push('/dashboard');
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
      setFormData({
        ...formData,
        image: file,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === 'image' && formData[key]) {
        formDataToSend.append('image', formData[key]);
      } else {
        formDataToSend.append(key, String(formData[key as keyof TimeSlotFormData]));
      }
    }

    try {
      const response = await fetch("/api/create", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        setBlinkId(data.data.id)
        // console.log(data.data.id)
        nextStep()
        
        
        
      } else {
        console.error("Error creating time slot");
      }
    } catch (err) {
      console.error("Failed to submit form", err);
    }
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full md:max-w-[500px] p-4">
        <div className="mb-6">

          {currentStep !== 4 && (<>
          <h1 className="text-3xl font-bold mb-3">Create Your Session Blink</h1>
          <p className="text-sm text-muted-foreground">Provide the details below to create a session blink that you can share with your audience.</p> 
          </> )}

        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-sm">Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  className="p-3 rounded-md bg-stone-50 border border-stone-200"
                  placeholder="jhon maz"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-medium text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="p-3 rounded-md bg-stone-50 border border-stone-200"
                  placeholder="jhonmaz@gmail.com"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-sm">Solana Publickey</label>
                <input
                  type="text"
                  name="creatorPublicKey"
                  value={formData.creatorPublicKey}
                  onChange={handleInputChange}
                  className="p-3 rounded-md bg-stone-50 border border-stone-200"
                  placeholder="5ckKLcEPRi2F5UZRPGuVAUj6mrDKpJ63QVmnpHoaBfFJ"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-medium text-sm">Upload Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                  accept="image/*"
                  required
                />
                <label
                  htmlFor="fileInput"
                  className="p-3 rounded-md bg-stone-50 border border-stone-200 cursor-pointer"
                >
                  {formData.image ? formData.image.name : "Choose a file"}
                </label>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-sm">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="p-3 rounded-md bg-stone-50 border border-stone-200"
                  placeholder="Enter Title"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-sm">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="p-3 rounded-md bg-stone-50 border border-stone-200"
                  placeholder="Enter description"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-medium text-sm">Amount (SOL)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="p-3 bg-stone-50 border border-stone-200 rounded-md"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-medium text-sm">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="p-3 rounded-md bg-stone-50 border border-stone-200"
                  required
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-sm">Time 1</label>
                <input
                  type="time"
                  name="time1"
                  value={formData.time1}
                  onChange={handleInputChange}
                  className="p-3 bg-stone-50 border border-stone-200 rounded-md"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-medium text-sm">Time 2</label>
                <input
                  type="time"
                  name="time2"
                  value={formData.time2}
                  onChange={handleInputChange}
                  className="p-3 bg-stone-50 border border-stone-200 rounded-md"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-medium text-sm">Time 3</label>
                <input
                  type="time"
                  name="time3"
                  value={formData.time3}
                  onChange={handleInputChange}
                  className="p-3 bg-stone-50 border border-stone-200 rounded-md"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-medium text-sm">Meet Link</label>
                <input
                  type="url"
                  name="meetlink"
                  value={formData.meetlink}
                  onChange={handleInputChange}
                  className="p-3 bg-stone-50 border border-stone-200 rounded-md"
                  placeholder="Enter meeting link"
                  required
                />
              </div>
            </>
          )}

          {currentStep === 4 && (
            <div>
              <h1 className="text-xl font-medium flex items-center gap-1">Here is your blink share it on <FaXTwitter/></h1>
              
              <div className="px-3 py-2 mt-2 border rounded-lg bg-stone-200 flex items-center justify-between">
                <p>https://www.minutess.xyz/join/{blinkId}</p>
                <div onClick={handleCopy} className="cursor-pointer">
                  <motion.div animate={controls}>
                    {icon} {/* Display the current icon */}
                  </motion.div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {currentStep > 1 ? (
              <Button type="button" className="rounded-full flex items-center gap-1" variant="outline" onClick={prevStep}>
                <ArrowLeft className="w-4" /> Go back
              </Button>
            ) : <Button disabled type="button" className="rounded-full flex items-center gap-1" variant="outline" onClick={prevStep}>
              <ArrowLeft className="w-4" /> Go back
            </Button>}
            {currentStep < 3 && (
              <Button type="button" className="rounded-full" onClick={nextStep}>
                Next step
              </Button>
            )}
            {currentStep === 3 && (
              <Button type="submit" className="rounded-full">
                Create blink
              </Button>
            )}

             {currentStep === 4 && (
              <Button type="button"  onClick={handleNavigate} className="rounded-full">
                Go to dashboard
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeSlotForm;