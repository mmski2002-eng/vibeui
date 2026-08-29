import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "VibeUI — выбери дизайн, отдай ИИ, получи сайт",
    template: "%s — VibeUI",
  },
  description:
    "AI-native библиотека UI-компонентов для вайбкодинга: live preview, shadcn-совместимый registry и готовая инструкция для AI-агента.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
