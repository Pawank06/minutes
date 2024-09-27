import {
    Transaction,
    PublicKey,
    SystemProgram,
    Connection,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
  } from "@solana/web3.js";
  import {
    ACTIONS_CORS_HEADERS,
    createPostResponse,
    ActionGetResponse,
    ActionPostResponse,
  } from "@solana/actions";
import connectDB from "@/db/connectdb";

import { Slot } from "@/db/models/createSlotSchema";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  
  export const GET = async (req: Request) => {

    await connectDB()


  
    const { pathname } = new URL(req.url);
    const pathSegments = pathname.split("/");
    const creatorId = pathSegments[4];

    const creatorDetails = await Slot.findById(creatorId);

  

  
    try {
      const payload: ActionGetResponse = {
        icon: creatorDetails.image,
        title: `Buy ${creatorDetails.organizationName}'s Time`,
        description: `${creatorDetails.description}`,
        label: "Buy Time",
        links: {
          actions: [
            {
              label: `Buy Time Slot For ${creatorDetails.amount} SOL`,
              href: `/api/actions/join/${creatorId}?name={name}&email={email}&timeType={timeType}`,
              
              parameters: [
                {
                  type: "text",
                  name: "name",
                  label: "Enter Your Name",
                  required: true,
                },
                {
                  type: "email",
                  name: "email",
                  label: "Enter Your Email",
                  required: true,
                },
                {
                  type: "radio",
                  name: "timeType",
                  label: "Select Time Slot (IST)",
                  options: [
                    { 
                      label: creatorDetails.time1 === null || creatorDetails.time1 === "booked" ? "Booked" : formatTime(creatorDetails.time1), 
                      value: creatorDetails.time1 === null || creatorDetails.time1 === "booked" ? "booked" : creatorDetails.time1 
                    },
                    { 
                      label: creatorDetails.time2 === null || creatorDetails.time2 === "booked" ? "Booked" : formatTime(creatorDetails.time2), 
                      value: creatorDetails.time2 === null || creatorDetails.time2 === "booked" ? "booked" : creatorDetails.time2 
                    },
                    { 
                      label: creatorDetails.time3 === null || creatorDetails.time3 === "booked" ? "Booked" : formatTime(creatorDetails.time3), 
                      value: creatorDetails.time3 === null || creatorDetails.time3 === "booked" ? "booked" : creatorDetails.time3,
                    },
                  ],
                  required: true,
                },
              ],
            }
            
          ],
        },
      };
      return new Response(JSON.stringify(payload), {
        headers: ACTIONS_CORS_HEADERS,
      });
    } catch (error) {
      console.error("Error processing GET request:", error);
      return new Response(
        JSON.stringify({ error: "Failed to process request" }),
        {
          status: 500,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }
  };
  
  export const OPTIONS = GET;
  
  export const POST = async (req: Request) => {
    try {
      
      const { pathname } = new URL(req.url);
      const pathSegments = pathname.split("/");
      const creatorId = pathSegments[4];
      const body = await req.json();
      const buyerPubKey = new PublicKey(body.account);
      const url = new URL(req.url);
      const buyerName = url.searchParams.get("name") ?? "";
      const buyerEmail = url.searchParams.get("email") ?? "";
      const timeType = url.searchParams.get("timeType") ?? "";
      
      const creatorDetails = await Slot.findById(creatorId);

      const organizerPubKey = creatorDetails.creatorPublicKey
      
      const fees = creatorDetails.amount;

      if(timeType === "booked") {
        return new Response(
          JSON.stringify({ error: "Already booked slot please select other slot" }),
          {
            status: 500,
            headers: ACTIONS_CORS_HEADERS,
          }
        ); 
      }
  
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: buyerPubKey,
          toPubkey: new PublicKey(organizerPubKey),
          lamports: fees * LAMPORTS_PER_SOL,
        })
      );
  
      transaction.feePayer = buyerPubKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;


  
      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          transaction,
          message: `Your time slot has been purchased successfully.`,
          links: {
            next: {
              type: "post",
              href: `/api/actions/saveBuyerData?buyerName=${buyerName}&buyerEmail=${buyerEmail}&timeType=${timeType}&creatorId=${creatorId}`,
            },
          },
        },
      });
  
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: ACTIONS_CORS_HEADERS,
      });
    } catch (error) {
      console.error("Error processing POST request:", error);
      return new Response(
        JSON.stringify({ error: "Failed to process request" }),
        {
          status: 500,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }
  };

  // Add this function to format time
  const formatTime = (time: string) => {
    const date = new Date(`1970-01-01T${time}:00`);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };