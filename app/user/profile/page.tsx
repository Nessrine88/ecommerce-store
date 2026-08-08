import { Metadata } from "next";
import { auth } from "@/auth";
import { SessionProvider } from 'next-auth/react';
import ProfileForm from "./profile-form";

export const metadata: Metadata = {
  title: 'Customer Profile'
}

const Profile = async () => {
  const session = await auth();

  return (
    <div className='text-accent'>
      <SessionProvider session={session}>
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="font-bold text-4xl mt-5">{session?.user?.name}</h2>
          <ProfileForm />
        </div>
      </SessionProvider>
    </div>
  )
}

export default Profile