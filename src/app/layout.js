"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { metadata } from "./metadata";
import "./globals.css";
import Navbar from "./componentes/NavBar";
import { CarritoProvider } from "./context/CarritoContext";
import { AuthProvider } from "./context/AuthContext";
import { PedidoFotosProvider } from "./context/PedidoFotosContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CarritoProvider>
            <PedidoFotosProvider>
              <Navbar />
              {children}
            </PedidoFotosProvider>
          </CarritoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
