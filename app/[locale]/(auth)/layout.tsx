import type { Metadata } from "next";
import "../globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import Header from "@/app/[locale]/components/shared/header";
import Footer from "@/app/[locale]/components/Footer";

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
    <div className="dark:bg-inherit min-h-screen bg-bg flex w-full">
      {children}
    </div>
  );
}
