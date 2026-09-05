import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"

// Inter: тот же шрифт, что у образцов витрин компонентов, и с полной
// кириллицей — подменять на похожий не пришлось.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
})

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
})

export const metadata: Metadata = {
  title: {
    default: "VibeUI — выбери дизайн, отдай ИИ, получи сайт",
    template: "%s — VibeUI",
  },
  description:
    "AI-native библиотека UI-компонентов для вайбкодинга: live preview, shadcn-совместимый registry и готовая инструкция для AI-агента.",
}

// Ставит data-shell-theme на <html> до первой отрисовки: без этого React
// смонтировал бы тёмную оболочку по умолчанию, а затем перекрасил в светлую
// после гидратации — заметная вспышка.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("vibeui-shell-theme");if(t==="light")document.documentElement.setAttribute("data-shell-theme","light")}catch(e){}})()`

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
