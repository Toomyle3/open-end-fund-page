import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "./provider/ConvexClerkProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Open-end fund app",
  description: "Performance dashboard of open-ended funds in Vietnam",
  icons: {
    icon: "/icons/logo.jpg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html>
        <body className={inter.className}>
            {children}
        </body>
      </html>
    </ConvexClerkProvider>
  );
}
