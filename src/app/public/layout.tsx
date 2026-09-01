import React from "react";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen bg-slate-50 font-sans ${inter.variable}`}>
      <TRPCReactProvider>
        {children}
      </TRPCReactProvider>
    </div>
  );
}
