import type { Metadata } from "next";

import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";





export const metadata: Metadata = {
  title: "Snapcart | 10 minutes grocery Delevery App",
  description: " 10 minutes grocery Delevery App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=" w-full min-h-screen bg-linear-to-b from-green-50 to-white"
       
      >
        <Provider>
          <StoreProvider>
            <InitUser/>
        {children}
        </StoreProvider>
        
        </Provider>
      </body>
    </html>
  );
}
