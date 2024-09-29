import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/prismaClient";

export async function GET() {
  // await connectDB()
  // Get the user's session
  const session = await getSession();

  console.log("User email", session?.user?.email);

  // Check if the user is authenticated
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Find the user by their email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("User Id", user.id);

    // Find all slots created by the user
    const slots = await prisma.slot.findMany({
      where: { creatorId: user.id as string },
    });
    console.log("Slot", slots);

    return new Response(JSON.stringify(slots), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
