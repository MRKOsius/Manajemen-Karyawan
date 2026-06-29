import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientShell from "./components/ClientShell";
import { Toaster } from "sonner";

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HRIS Admin — Sistem Manajemen Karyawan",
  description: "Portal manajemen data karyawan, jabatan, departemen, dan payroll.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
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
        
        <ClientShell>
          {children}
        </ClientShell>
        
      </body>
    </html>
  );
}
