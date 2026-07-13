import { Metadata } from "next"
import { Card,CardContent,CardDescription,CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { auth } from "@/auth";
import { redirect } from "next/navigation"
import SignUpForm from "./signup-form";
export const metadata: Metadata = {
    title: 'Sign Up',
}
const SignUpPage = async(props: {
    searchParams: Promise <{
        callbackUrl: string
    }>
}) => {
    const {callbackUrl} = await props.searchParams;
    const session = await auth();
    if(session){
        return redirect(callbackUrl || "/")
    }
  return (
    <div className= 'w-full max-w-md m-auto p-5 text-accent'>
      <Card>
        <CardHeader className="space-y-4" >
            <Link href= "/" className=" flex-center ">
             <Image 
             src= "/logo.svg"
             width={500}
             height= {500}
             alt="Logo image"
             className="rounded-full border border-accent w-28 h-auto mx-auto "
              />
            </Link>

        </CardHeader>
        <CardTitle className="text-center" >
            Create an account
        </CardTitle>
        <CardDescription className="text-center">
            Enter your informations below to sign up
        </CardDescription>
        <CardContent className="space-y-4" >
            {/*Form here*/}
           <SignUpForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpPage
