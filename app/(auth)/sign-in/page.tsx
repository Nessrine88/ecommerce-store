import { Metadata } from "next"
import { Card,CardContent,CardDescription,CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import CredentialsSignInForm from "./credentials-signin-form"
import { auth } from "@/auth";
import { redirect } from "next/navigation"
export const metadata: Metadata = {
    title: 'Sign In',
}
const SignInPage = async(props: {
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
            Sign In
        </CardTitle>
        <CardDescription className="text-center">
            Sign in to your account 
        </CardDescription>
        <CardContent className="space-y-4" >
            {/*Form here*/}
            <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignInPage
