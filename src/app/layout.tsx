import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import ClientShell from "./components/ClientShell";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/session";

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HRIS Admin — Sistem Manajemen Karyawan",
  description: "Portal manajemen data karyawan, jabatan, departemen, dan payroll.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionData = await getSession();

  return (
    <html
      lang="id"
      className={cn("dark", "h-full", "antialiased", instrumentSerif.variable, jetbrainsMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-screen bg-canvas text-ink-primary font-sans">
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: 'var(--bg-surface)',
              color: 'var(--ink-primary)',
              border: '1px solid var(--border-default)',
            },
            className: 'font-sans text-[13px]'
          }} 
        />
        
        <ClientShell sessionData={sessionData}>
          {children}
        </ClientShell>
        
      </body>
    </html>
  );
}
