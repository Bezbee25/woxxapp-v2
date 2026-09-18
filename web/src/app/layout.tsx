import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth-context";
import { AuthModal } from "../components/auth/AuthModal";
import CookieConsentBanner from "../components/legal/CookieConsentBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WoxxApp V2 — Plateforme Commerçants",
  description: "Plateforme SaaS modulaire pour lancer et gérer votre boutique e-commerce en quelques clics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-[#FFFDF9] text-slate-900 antialiased`}>
        <AuthProvider>
          {children}
          <AuthModal />
          <CookieConsentBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
