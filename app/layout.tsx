import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"

import { Analytics } from "@/components/analytics"
import { SITE_NAME, SITE_URL } from "@/lib/seo"

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

const DESCRIPTION =
  "AI-native библиотека UI-компонентов для вайбкодинга: live preview, shadcn-совместимый registry и готовая инструкция для AI-агента."

export const metadata: Metadata = {
  // Все относительные ссылки в canonical, hreflang и Open Graph
  // разворачиваются от этого origin.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VibeUI — выбери дизайн, отдай ИИ, получи сайт",
    template: "%s — VibeUI",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "UI компоненты",
    "библиотека компонентов",
    "shadcn registry",
    "вайбкодинг",
    "vibe coding",
    "React компоненты",
    "Tailwind CSS",
    "Next.js",
    "готовые блоки для сайта",
    "AI агент",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ru_RU",
    alternateLocale: ["en_US"],
    title: "VibeUI — выбери дизайн, отдай ИИ, получи сайт",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeUI — выбери дизайн, отдай ИИ, получи сайт",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
}

// Ставит data-shell-theme на <html> до первой отрисовки: без этого React
// смонтировал бы тёмную оболочку по умолчанию, а затем перекрасил в светлую
// после гидратации — заметная вспышка.
// Заодно правит lang на английской витрине: <html> объявлен в единственном
// корневом layout'е, а язык раздела известен только по пути. Для поисковиков
// язык страницы задают hreflang в <head> и sitemap, здесь — для читалок.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("vibeui-shell-theme");if(t==="light")document.documentElement.setAttribute("data-shell-theme","light")}catch(e){}var p=location.pathname;if(p==="/en"||p.indexOf("/en/")===0)document.documentElement.lang="en"})()`

// Поисковикам: что за сайт и как искать по нему. Достаточно объявить один раз
// в корне — на всех страницах разметка одна и та же.
const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: DESCRIPTION,
      inLanguage: ["ru-RU", "en-US"],
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/icon.svg`,
    },
  ],
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Атрибут темы приходит из localStorage до гидратации, поэтому разметка
    // сервера и клиента здесь расходятся намеренно — предупреждение гасим.
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
