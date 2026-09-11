import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_NAME } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from 'next-intl/server';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_NAME}`,
  description: "An Ecommerce platforme that sells plants",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages}>
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col  ">
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
    </NextIntlClientProvider>
  );
}
