

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./dashboard/storeProvider";

import { Toaster, toast } from 'sonner'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
    title: "eScout Web Management",
    description: "Generated by create next app",
  };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <StoreProvider>
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable}`}>
              <main> 
                {children} 
              </main>
              <Toaster />
          </body>
        </html>
      </StoreProvider>
    );
  }

