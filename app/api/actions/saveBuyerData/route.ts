/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { prisma } from "@/lib/prismaClient";

import {
  createActionHeaders,
  NextActionPostRequest,
  ActionError,
  CompletedAction,
  ACTIONS_CORS_HEADERS,
} from "@solana/actions";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import nodemailer from "nodemailer";
import { Time } from "../../create/route";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const GET = async () => {
  return Response.json(
    { message: "Method not supported" },
    {
      headers: ACTIONS_CORS_HEADERS,
    }
  );
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const body: NextActionPostRequest = await req.json();
    const url = new URL(req.url);
    const creatorId = url.searchParams.get("creatorId") ?? "";
    const buyerName = url.searchParams.get("buyerName") ?? "";
    const buyerEmail = url.searchParams.get("buyerEmail") ?? "";
    const timeType = url.searchParams.get("timeType") ?? "";

    let signature: string;
    try {
      signature = body.signature;
      if (!signature) throw "Invalid signature";
    } catch (err) {
      throw 'Invalid "signature" provided';
    }

    try {
      const status = await connection.getSignatureStatus(signature);

      if (!status) throw "Unknown signature status";

      if (status.value?.confirmationStatus) {
        if (
          status.value.confirmationStatus != "confirmed" &&
          status.value.confirmationStatus != "finalized"
        ) {
          const actionError: ActionError = {
            message: "Signature not confirmed or finalized",
          };
          return new Response(JSON.stringify(actionError), {
            status: 400,
            headers: ACTIONS_CORS_HEADERS,
          });
        }
      }

      const creatorDetails = await prisma.slot.findFirst({
        where: { id: creatorId },
      });

      if (!creatorDetails) throw new Error("Slot Empty!");

      const newcreatorId = creatorDetails.creatorId;

      const newBlink = await prisma.buyer.create({
        data: {
          email: buyerEmail,
          buyername: buyerName,
          timeslot: timeType,
          creatorId,
        },
      });

      creatorDetails.earnings =
        Number(creatorDetails.earnings) + Number(creatorDetails.amount);

      // Update the corresponding time slot to null
      if (timeType === creatorDetails.time1) {
        creatorDetails.time1 = "booked";
      } else if (timeType === creatorDetails.time2) {
        creatorDetails.time2 = "booked";
      } else if (timeType === creatorDetails.time3) {
        creatorDetails.time3 = "booked";
      }

      // console.log(creatorDetails)

      await prisma.slot.update({
        where: { id: creatorDetails.id }, // or newBlink.creatorId if needed
        data: {
          earnings: creatorDetails.earnings,  // Only updating specific fields
          time1: creatorDetails.time1,
          time2: creatorDetails.time2,
          time3: creatorDetails.time3,
          // You can add other fields that you want to update here
        },
      });
      

      const transaction = await connection.getParsedTransaction(
        signature,
        "confirmed"
      );

      const payload: CompletedAction = {
        type: "completed",
        title: "Booking Confirmed",
        icon: creatorDetails.image, // No need for template literals here
        label: "Time Slot Purchased",
        description: `You have successfully booked the ${timeType} slot with ${creatorDetails.organizationName}.`,
      };

      const formattedTime = convertTo12Hour(timeType);

      // Send an email notification to the user
      // Send an email notification to the user
      await transporter.sendMail({
        from: `"Minutess" <${process.env.EMAIL}>`,
        to: buyerEmail,
        subject: `Confirmation: Time Slot Successfully Purchased`,
        text: `Hi ${buyerName},

Thank you for your purchase!

We’re excited to let you know that your time slot with ${creatorDetails.organizationName} has been successfully booked. Below are the details of your booking:

Time: ${formattedTime}
Meeting Link: ${creatorDetails.meetlink}

You’ll receive regular updates and exclusive content for the project via this email. If you have any questions or need further assistance, feel free to contact us at any time.

Best regards,
The Minutess Team

Minutess - Monetize Your Time
Website: ${process.env.BASE_URL}
Support: groww3809@gmail.com
`,
      });

      return new Response(JSON.stringify(payload), {
        headers: ACTIONS_CORS_HEADERS,
      });
    } catch (err) {
      console.error("Error in transaction or saving event:", err);
      if (typeof err == "string") throw err;
      throw "Unable to confirm the provided signature";
    }
  } catch (err) {
    console.error("General error:", err);
    const actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return new Response(JSON.stringify(actionError), {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

// Function to convert 24-hour time to 12-hour format
function convertTo12Hour(time24: any) {
  // Split the time string into hours and minutes
  const [hours, minutes] = time24.split(":");

  // Determine AM or PM
  const suffix = hours >= 12 ? "PM" : "AM";

  // Adjust hours for 12-hour format, ensuring '0' hours becomes '12'
  const adjustedHours = hours % 12 || 12; // Converts '0' to '12'

  // Return the formatted time
  return `${adjustedHours}:${minutes} ${suffix}`;
}

// Example timeType string (ensure this is in HH:mm format) // or whatever string you're receiving

// Convert the timeType to 12-hour format

