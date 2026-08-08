'use client';
import { updateProfileSchema } from "@/lib/validators";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import z from "zod";
const ProfileForm = () => {
    const {data:session, update} = useSession();
    const form = useForm<z.infer<typeof updateProfileSchema>>({
        defaultValues: {
            name: session?.user?.name ?? '',
            email: session?.user?.email ?? '',
        }
    })
  return (
    <div>ProfileForm</div>
  )
}

export default ProfileForm