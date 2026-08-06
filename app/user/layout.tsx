import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
import MainNav from "./main-nav";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col bg-bg dark:bg-black min-h-screen text-accent">
     <div className="border-b container mx-auto">
        <div className="flex items-center h-16 px-4">
            <Link href='/'>
              <Image 
               src= '/logo.svg'
               height={48}
               width={48}
               alt={APP_NAME}
              />
            </Link>
            {/*Main nav*/}
            <MainNav  />
            <div className="ml-auto items-center flex space-x-4">
                <Menu />
            </div>
        </div>
      
     </div>
     <div className=" mx-auto  container">
          {children}
     </div>
    </div>
  );
}
