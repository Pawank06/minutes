/* eslint-disable @typescript-eslint/no-explicit-any */
import connectDB from "@/db/connectdb";
import { Buyer } from "@/db/models/buyerSchema";
import { User } from "@/db/models/userSchema";
import { getSession } from "@/lib/getSession";

export async function GET() {
    await connectDB()
    const session = await getSession()
    console.log('User email', session?.user?.email)

    if (!session || !session.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const user = await User.findOne({email: session?.user?.email})

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const userId = user._id

        
        const buyer = await Buyer.findOne({creatorId: userId})
        
        // Fetch all buyers for the given userId and include all fields
        const allbuyers = await Buyer.find(); 

        console.log("All buyers:", allbuyers); // Log all buyers to see their data

        console.log(buyer)
        console.log(userId)

        return new Response(JSON.stringify(allbuyers), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

        
    } catch (error: any) {
        console.log("Error while getting User", error.message)
    }

    

}