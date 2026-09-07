
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
import MainNav from "./main-nav";
import AdminSearch from "./admin-search";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col bg-bg text-accent dark:bg-black">
      {/* Header */}
      <header className="w-full border-b">
        <div className="container mx-auto w-full">
          <div className="flex h-16 items-center gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
            
            {/* Logo */}
            <Link
              href="/"
              className="shrink-0"
            >
              <Image
                src="/logo.svg"
                height={48}
                width={48}
                alt={APP_NAME}
                className="h-10 w-10 sm:h-12 sm:w-12"
              />
            </Link>

            {/* Main navigation - hidden on mobile */}
            <div className="hidden md:flex">
              <MainNav />
            </div>

            {/* Right side */}
            <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-4">
              
              {/* Search */}
              <div className="min-w-0">
                <AdminSearch />
              </div>

              {/* Menu */}
              <div className="shrink-0">
                <Menu />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full flex-1">
        <div className="container mx-auto w-full px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

