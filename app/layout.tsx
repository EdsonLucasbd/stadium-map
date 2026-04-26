import { Geist_Mono, Inter, Outfit } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "./globals.css";

const outfitHeading = Outfit({ subsets: ['latin'], variable: '--font-heading' });

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Mapa dos Estádios",
  description: "Mapa dos Estádios mais icônicos do mundo!",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Mapa dos Estádios",
    description: "Mapa dos Estádios mais icônicos do mundo!",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mapa dos Estádios",
    description: "Mapa dos Estádios mais icônicos do mundo!",
  },
}

import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable, outfitHeading.variable)}
    >
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
