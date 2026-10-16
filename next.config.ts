import type { NextConfig } from "next"

import { CLUB_SECTIONS, MERGED_CATEGORIES } from "./lib/club-routes"

const SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "frame-src 'self' https://yandex.ru https://www.google.com https://www.openstreetmap.org",
      "form-action 'self' https://yookassa.ru https://*.nowpayments.io",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://mc.yandex.ru https://www.google-analytics.com https://*.google-analytics.com",
      "worker-src 'self' blob:",
      "upgrade-insecure-requests",
    ].join("; "),
  },
]

function clubEnglishRewrites() {
  return ["vibeui.club", "www.vibeui.club"].flatMap((host) => {
    const has = [{ type: "host" as const, value: host }]

    return [
      { source: "/", destination: "/en", has },
      ...CLUB_SECTIONS.flatMap((section) => [
        { source: `/${section}`, destination: `/en/${section}`, has },
        {
          source: `/${section}/:path*`,
          destination: `/en/${section}/:path*`,
          has,
        },
      ]),
    ]
  })
}

const nextConfig: NextConfig = {
  // Самодостаточный сервер для деплоя на собственный VPS:
  // .next/standalone содержит node_modules, нужные в рантайме.
  output: "standalone",
  poweredByHeader: false,
  // Только dev: английскую витрину локально открывают как vibeui.club,
  // направленный на 127.0.0.1 (видео-обложки, scripts/render-scenario-motion.mjs).
  // Без этого dev-сервер отклоняет её скрипты и HMR, и страница не гидрируется.
  allowedDevOrigins: ["vibeui.club"],
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }]
  },
  // Внутренний rewrite, не второй HTTP-запрос. Иначе /en снова ловит запрет
  // в proxy и публичный /start на .club становится 404.
  async rewrites() {
    return { beforeFiles: clubEnglishRewrites() }
  },
  async redirects() {
    return Object.entries(MERGED_CATEGORIES).flatMap(([base, map]) =>
      Object.entries(map).map(([child, parent]) => ({
        source: `/${base}/${child}`,
        destination: `/${base}/${parent}`,
        permanent: true,
      })),
    )
  },
}

export default nextConfig
