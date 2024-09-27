

import { Button } from "@/components/ui/button"
import { signIn } from "@/auth"
import { getSession } from "@/lib/getSession"
import { redirect } from "next/navigation"
import { FaGoogle } from "react-icons/fa";

export async function SignInPage () {
  const session = await getSession()
  if(session?.user) redirect('/dashboard')

  return (
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Get Started</h1>
          </div>
          
            <form action={
              async () => {
                'use server';
                await signIn("google")
              }
            }>
            <Button type="submit" variant="outline" className="w-full flex gap-2"
            >
                 <FaGoogle />
              Continue with Google
            </Button>
            </form>
        </div>
      </div>
  )
}
