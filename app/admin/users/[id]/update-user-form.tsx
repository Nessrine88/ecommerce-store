'use client'

import { UpdateUserSchema } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { USER_ROLES } from "@/lib/constants"
import { Button } from "@/components/ui/button"

type FormValues = z.infer<typeof UpdateUserSchema>;

interface UpdateUserFormProps {
  user: FormValues;
}

const UpdateUserForm = ({ user }: UpdateUserFormProps) => {
  const router = useRouter();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: user
  });

  const onSubmit = async (values: FormValues) => {
    // TODO: Implement your update logic / API call here
    console.log(values);
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="gap-5 space-y-8 p-5">
        
        {/* Email Field (Disabled) */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input disabled placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Field */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Updating..." : "Update User"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
