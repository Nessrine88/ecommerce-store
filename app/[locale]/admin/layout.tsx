import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import { Link } from "@/navigation";
import Menu from "@/app/[locale]/components/shared/header/menu";
import MainNav from "./main-nav";
import AdminSearch from "./admin-search";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {

  return (
    <div className="flex min-h-screen w-full flex-col bg-bg text-accent dark:bg-black" suppressHydrationWarning>

      {/* Header */}
      <header className="relative w-full border-b">
        <div className="w-full">
          <div className="flex h-16 w-full items-center gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link href={`/`} className="shrink-0">
              <Image
                src="/logo.svg"
                height={48}
                width={48}
                alt={APP_NAME}
                className="h-10 w-10 sm:h-12 sm:w-12"
              />
            </Link>
            {/* Mobile hamburger */}
            <MainNav />

            {/* Right side */}
            <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-4">

              {/* Search */}
              <div className="min-w-0">
                <AdminSearch />
              </div>

              {/* User menu */}
              <div className="shrink-0">
                <Menu />
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full flex-1">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

    </div>
  );
}