import { auth } from "@/auth";
import { signOutUser } from "@/lib/actions/user.actions";
import { Button, buttonVariants } from "@/app/[locale]/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/[locale]/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import { getLocale } from "next-intl/server";

const UserButton = async () => {
  const session = await auth();
  const locale = await getLocale();

  if (!session) {
    return (
      <Link href={`/${locale}/sign-in`} className={buttonVariants()}>
        <UserIcon /> Sign In
      </Link>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="text-black">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="relative ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200"
            >
              {firstInitial}
            </Button>
          }
        />

        <DropdownMenuContent
          className="w-56 bg-white/30 text-white backdrop-blur"
          align="end"
        >
          <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">
                {session.user?.name}
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="mt-3 text-sm font-light italic leading-none text-shadow-mauve-200">
                {session.user?.email}
              </div>
            </div>
          </div>

          <DropdownMenuItem>
            <Link href={`/${locale}/user/orders`} className="w-full">
              Order History
            </Link>
          </DropdownMenuItem>

          {session.user?.role === "admin" && (
            <DropdownMenuItem>
              <Link href={`/${locale}/admin/overview`} className="w-full">
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="mb-1 p-0"
            render={<form action={signOutUser} className="w-full" />}
          >
            <Button
              className="h-4 w-full justify-start px-2 py-4"
              variant="default"
              type="submit"
            >
              Sign Out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;