import type { Metadata } from "next";
import "../globals.css"
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "../lib/constants";
import Header from "@/components/shared/header";

export const metadata: Metadata = {
  title: APP_NAME || 'Prostore',
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-bg relative" >
      <div className="sticky top-0 z-30">
        <Header />
      </div>
         
      <main className="flex h-3/4 justify-center items-center">
       
        {children}
        </main>
    </div>
  );
}
