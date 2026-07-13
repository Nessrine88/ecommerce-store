import type { Metadata } from "next";
import "../globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "../lib/constants";
import Header from "@/components/shared/header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: APP_NAME || "Prostore",
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark:bg-inherit bg-bg flex min-h-screen w-full">
    {children}
    </div>
  );
}
