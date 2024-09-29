/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prismaClient";
import { getSession } from "@/lib/getSession";

export async function GET() {
  const session = await getSession();
  // console.log("User email", session?.user?.email);

  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email as string },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }



    // Fetch all buyers for the given userId and include all fields
    const allbuyers = await prisma.buyer.findMany();

    // console.log("All buyers:", allbuyers); // Log all buyers to see their data

    // console.log(userId);

    return new Response(JSON.stringify(allbuyers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.log("Error while getting User", error.message);
  }
}
