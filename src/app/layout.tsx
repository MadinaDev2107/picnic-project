"use client";

// import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import "bootstrap/dist/css/bootstrap.css";
import Footer from "@/components/footer";
import "rodal/lib/rodal.css";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const showHeaderFooter = !pathname?.startsWith("/auth"); 

  return (
    <html lang="en">
      <body>
        {showHeaderFooter && <Header />}
        {children}
        {showHeaderFooter && <Footer />}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
