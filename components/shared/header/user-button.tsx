import { auth } from "@/auth"
import { signOutUser } from "@/lib/actions/user.actions"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserIcon } from "lucide-react"

const UserButton = async () => {
  const session = await auth()

  if (!session) {
    return (
      <Link href="/sign-in" className={buttonVariants()}>
        <UserIcon /> Sign In
      </Link>
    )
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U"

  return (
    <div className="text-accent">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200"
            >
              {firstInitial}
            </Button>
          }
        />

        <DropdownMenuContent className="w-56 text-accent" align="end">
          <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">
                {session.user?.name}
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="text-sm italic font-light mt-3 text-shadow-mauve-200 leading-none">
                {session.user?.email}
              </div>
            </div>
          </div>

          <DropdownMenuItem
            className="p-0 mb-1"
            render={<form action={signOutUser} className="w-full" />}
          >
            <Button
              className="w-full py-4 px-2 h-4 justify-start"
              variant="default"
              type="submit"
            >
              Sign Out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserButton