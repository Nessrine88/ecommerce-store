import { Metadata } from "next";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ProfileForm from "./profile-form";

export const metadata: Metadata = {
  title: "Customer Profile",
};

const Profile = async () => {
  const session = await auth();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1a3f2e] via-[#12281d] to-[#0a1711] text-white transition-colors duration-300 dark:bg-none dark:bg-black dark:text-zinc-100 px-4 py-12 sm:px-8">
      <SessionProvider session={session}>
        <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-3xl font-bold tracking-tight">
            {session?.user?.name || "Profile"}
          </h2>
          <ProfileForm />
        </div>
      </SessionProvider>
    </div>
  );
};

export default Profile;