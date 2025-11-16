'use client'
import "./globals.css";
import { AuthProvider } from "@/components/context/Authprovider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
        {/* {children} */}
      </body>
    </html>
  );
}
