import type { Metadata } from "next"
import { Geist_Mono, Inter, Onest } from "next/font/google"
import { headers } from "next/headers"
import "./globals.css"

import { Analytics } from "@/components/analytics"
import { isClubHost, originFromHost, SITE_NAME } from "@/lib/seo"

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

// Заголовки отдельным гротеском: Inter в крупном кегле нейтрален до
// безликости, а у Onest кириллица родная — его под неё и рисовали. Шрифт
// вариативный (100–900), поэтому веса заголовка ничего не стоят сверх
// одного файла на подмножество.
const onest = Onest({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
})

const DESCRIPTION =
  "AI-native библиотека UI-компонентов для вайбкодинга: live preview, shadcn-совместимый registry и готовая инструкция для AI-агента."

const EN_DESCRIPTION =
  "AI-native UI component library with live previews, a shadcn-compatible registry and ready-to-use prompts for coding agents."

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host")
  const english = isClubHost(host)
  const origin = originFromHost(host)
  const title = english
    ? "VibeUI — choose a design, give it to AI, ship your site"
    : "VibeUI — выбери дизайн, отдай ИИ, получи сайт"
  const description = english ? EN_DESCRIPTION : DESCRIPTION

  return {
    // Все относительные ссылки в canonical, hreflang и Open Graph
    // разворачиваются от этого origin.
    metadataBase: new URL(origin),
    title: {
      default: title,
      template: "%s — VibeUI",
    },
    description,
    applicationName: SITE_NAME,
    keywords: english
      ? [
          "UI components",
          "component library",
          "shadcn registry",
          "vibe coding",
          "React components",
          "Tailwind CSS",
          "Next.js",
          "website blocks",
          "AI agent",
        ]
      : [
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
      locale: english ? "en_US" : "ru_RU",
      alternateLocale: [english ? "ru_RU" : "en_US"],
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
    // Токены подтверждения прав публичны по своей природе: поисковик как раз
    // и проверяет, что они лежат в открытой разметке.
    verification: {
      google:
        process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ||
        "HcuGcVeu4NGN_Ruulsn7Xkd8VQB8rw_iftfCCZwLLjE",
      yandex: [
        process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "73c966fb1814e673",
        "76d9779913efc610",
      ],
    },
  }
}

// Ставит data-shell-theme на <html> до первой отрисовки: без этого React
// смонтировал бы тёмную оболочку по умолчанию, а затем перекрасил в светлую
// после гидратации — заметная вспышка.
//
// Порядок источников: явный выбор человека в localStorage → тема системы →
// тёмная. Системную читаем здесь же, синхронно: matchMedia в эффекте дал бы
// ту самую вспышку, ради которой скрипт и стоит блокирующим в <head>.
//
// Заодно правит lang на английской витрине: <html> объявлен в единственном
// корневом layout'е, а язык раздела известен только по пути. Для поисковиков
// язык страницы задают hreflang в <head> и sitemap, здесь — для читалок.
const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement;var t=null;try{t=localStorage.getItem("vibeui-shell-theme")}catch(e){}if(t!=="light"&&t!=="dark"){t=null;d.setAttribute("data-shell-follows-system","")}if(!t){try{t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}catch(e){t="dark"}}d.setAttribute("data-shell-theme",t);var h=location.hostname;if(h==="vibeui.club"||h==="www.vibeui.club")d.lang="en"})()`

// Поисковикам: что за сайт и как искать по нему. Достаточно объявить один раз
// в корне — на всех страницах разметка одна и та же.
function siteJsonLd(locale: "ru" | "en", origin: string) {
  const description = locale === "en" ? EN_DESCRIPTION : DESCRIPTION

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: `${origin}/`,
        name: SITE_NAME,
        description,
        inLanguage: locale === "en" ? "en-US" : "ru-RU",
        publisher: { "@id": `${origin}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${origin}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: SITE_NAME,
        url: `${origin}/`,
        logo: `${origin}/icon.svg`,
      },
    ],
  }
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const host = (await headers()).get("host")
  const locale = isClubHost(host) ? "en" : "ru"
  const jsonLd = siteJsonLd(locale, originFromHost(host))

  return (
    // Атрибут темы приходит из localStorage до гидратации, поэтому разметка
    // сервера и клиента здесь расходятся намеренно — предупреждение гасим.
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} ${onest.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
