"use client"
import Navbar from "../../components/Navbar/page"
import Sidebar from "../../components/Sidebar/page"
import { useState } from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./provider"

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);

  const handleCollapse = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };
  
  return (
    <Provider>
      <html lang="en">
        <head>
          <title>Bencana</title>
          <meta name="description" content='Bencana' />
        </head>
        <body className={inter.className}>
          <div className="flex flex-col h-screen">
            <Navbar handleCollapse={handleCollapse} />
            <div className="flex h-screen">
              <div className={`sidebar ${isSidebarCollapsed ? '' : 'sidebar-hide'}`}>
                <Sidebar />
              </div>
              <div className="data-buku">
                {children}
              </div>
            </div>
          </div>
        </body>
      </html>
    </Provider>
  );
}
