import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/actions/user.actions";
import UpdateUserForm from "./update-user-form";
export const metadata: Metadata= {
  title: 'Update User'
}
const AdminUserUpdatePage = async(props:{
  params: Promise<
 { id:string}
  >
}) => {
  const {id} = await props.params;
  const user = await getUserById(id);
  if(!user) notFound();

  const userForForm = {
    ...user,
    email: user.email ?? "",
  };

  return (
    <div className="space-y-8 p-5 max-w-lg mx-auto">
      <h1 className=" fon-bold text-2xl">Update User</h1>
      <UpdateUserForm user={userForForm} />
    </div>
  )
}

export default AdminUserUpdatePage
