import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/prismaClient";
import cloudinary from "@/lib/cloundinary";

export interface Time {
  id: string;
  creatorId: string;
  timeId: string;
  organizationName: string;
  title: string;
  creatorPublicKey: string;
  email: string;
  image: string;
  description: string;
  amount: number;
  date: string;
  time1: string;
  time2: string;
  time3: string;
  meetlink: string;
}

export async function POST(req: Request) {
  const session = await getSession();
  // console.log("Session", session?.user?.email);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json(
      { success: false, message: "User not authenticated" },
      { status: 401 }
    );
  }

  let userId;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    userId = user.id;
  } catch (error) {
    console.error("Error finding user:", error);
    return NextResponse.json(
      { success: false, message: "Error finding user" },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    // console.log("FORMDATA", formData);

    const imageFile = formData.get("image") as File;
    let imageUrl = "";
    if (imageFile) {
      const imageBuffer = await imageFile.arrayBuffer();
      const base64String = Buffer.from(imageBuffer).toString("base64");
      const uploadedResponse = await cloudinary.uploader.upload(
        `data:${imageFile.type};base64,${base64String}`,
        {
          folder: "time_slots",
          public_id: uuidv4(),
          resource_type: "image",
        }
      );
      imageUrl = uploadedResponse.secure_url; // Get the secure URL of the uploaded image
    }

    const timeSlotData = {
      creatorId: userId,
      timeId: uuidv4(),
      organizationName: formData.get("organizationName")?.toString().trim(),
      title: formData.get("title")?.toString().trim(),
      creatorPublicKey: formData.get("creatorPublicKey")?.toString().trim(),
      email: formData.get("email")?.toString().trim().toLowerCase(),
      image: imageUrl,
      description: formData.get("description")?.toString().trim(),
      amount: Number(formData.get("amount")) || 0,
      date: formData.get("date")?.toString(),
      time1: formData.get("time1")?.toString(),
      time2: formData.get("time2")?.toString(),
      time3: formData.get("time3")?.toString(),
      meetlink: formData.get("meetlink")?.toString().trim(),
    };

    // console.log("Time Slot", timeSlotData);

    // Validate required fields
    const requiredFields = [
      "organizationName",
      "creatorPublicKey",
      "title",
      "email",
      "image",
      "description",
      "date",
      "time1",
      "time2",
      "time3",
      "meetlink",
    ];
    for (const field of requiredFields) {
      if (!timeSlotData[field as keyof typeof timeSlotData]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!timeSlotData.email || !emailRegex.test(timeSlotData.email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate amount
    if (timeSlotData.amount < 0) {
      return NextResponse.json(
        { success: false, message: "Amount cannot be negative" },
        { status: 400 }
      );
    }

    const oldUser = await prisma.user.findUnique({ where: { id: userId } });
    console.log(oldUser)

    console.log("========");

    // const newTimeSlot = await prisma.slot.update({
    //   where: { timeId: timeSlotData.timeId }, // Use timeId (or id if available)
    //   data: timeSlotData,
    // });

    console.log("========");
    const newTimeSlot = await prisma.slot.create({
      data: timeSlotData as Time,
    });
    // console.log("New Time Slot before save:", newTimeSlot);
    // await prisma.slot.update(newTimeSlot);
    // console.log("New Time Slot after save:", newTimeSlot);

    // Find the user again to ensure we have the most up-to-date data
    const userBeforeUpdate = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log(
      "User before update:",
      JSON.stringify(userBeforeUpdate, null, 2)
    );

    // Add the new slot to the user's document
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    // new user.slots.push(newTimeSlot.id);
    // await prisma.slot.update({
    //   where: { id: user.id },
    //   data: {
    //     slots: newTimeSlot.timeId as string,
    //   },
    // }); // not sure need to check this one!

    console.log("Updated User:", JSON.stringify(user, null, 2));

    // Verify the update
    const userAfterUpdate = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log("User after update:", JSON.stringify(userAfterUpdate, null, 2));

    return NextResponse.json(
      {
        success: true,
        message: "Time slot created successfully and added to user",
        data: newTimeSlot,
        updatedUser: user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating time slot or updating user:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
