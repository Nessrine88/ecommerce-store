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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="dark:bg-inherit bg-bg relative flex min-h-screen flex-col"
      suppressHydrationWarning
    >
      <div className="sticky top-0 z-30">
        <Header />
      </div>

      <main className="mx-4 flex-1 md:mx-6">{children}</main>
      <Footer />
    </div>
  );
}