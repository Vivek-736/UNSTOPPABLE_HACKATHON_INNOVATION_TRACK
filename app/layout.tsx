// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import "./globals.css";
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "YieldGuard - Secure Your Investments with Confidence",
  description: "YieldGuard is your trusted partner in DeFi security, offering real-time monitoring and alerts to protect your investments from smart contract vulnerabilities and exploits.",
  icons: {
    icon: "/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en"
      suppressHydrationWarning
    >
      <body className={`${ubuntu.className} antialiased`}>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}