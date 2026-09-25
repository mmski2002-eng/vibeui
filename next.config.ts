import type { NextConfig } from "next"

/**
 * Категории, слитые в более крупные: items переехали в папку родителя, их
 * адреса не изменились, а страница старой категории ведёт на новую.
 * Ключ — сегмент маршрута типа, значение — child → parent.
 */
const MERGED_CATEGORIES: Record<string, Record<string, string>> = {
  blocks: {
    bakery: "industry",
    charity: "industry",
    delivery: "industry",
    flowers: "industry",
    auto: "industry",
    course: "industry",
    realty: "industry",
    renovation: "industry",
    vet: "industry",
    writer: "industry",
    fintech: "industry",
    gadget: "industry",
    language: "industry",
    market: "industry",
    restaurant: "industry",
    api: "industry",
    app: "industry",
    opensource: "industry",
    podcast: "industry",
    comparison: "pricing",
    downloads: "cta",
    changelog: "blog",
    bento: "layout",
    cases: "portfolio",
    press: "logos",
    waitlist: "newsletter",
    stats: "about",
    video: "about",
    consent: "errors",
  },
  components: {
    toggle: "button",
    "toggle-group": "button-group",
    "input-group": "input",
    field: "input",
    label: "input",
    "input-otp": "special-input",
    "number-field": "special-input",
    "phone-input": "special-input",
    "currency-input": "special-input",
    "tags-input": "special-input",
    "file-upload": "special-input",
    rating: "special-input",
    "native-select": "select",
    autocomplete: "combobox",
    cascader: "combobox",
    "radio-group": "checkbox",
    switch: "checkbox",
    "date-selector": "calendar",
    "event-calendar": "calendar",
    "alert-dialog": "dialog",
    drawer: "dialog",
    tooltip: "popover",
    "hover-card": "popover",
    "context-menu": "dropdown-menu",
    breadcrumb: "navigation",
    pagination: "navigation",
    "navigation-menu": "navigation",
    scrollspy: "navigation",
    timeline: "stepper",
    sparkline: "chart",
    filters: "table",
    sortable: "tree",
    banner: "alert",
    spinner: "loading",
    skeleton: "loading",
    progress: "loading",
    "icon-tile": "avatar",
    "icon-stack": "avatar",
    item: "card",
    separator: "card",
    kbd: "badge",
    "aspect-ratio": "carousel",
    collapsible: "accordion",
    range: "slider",
  },
  animations: {
    button: "interface",
    avatar: "interface",
    "code-block": "interface",
    chat: "interface",
    notifications: "interface",
    checklist: "interface",
    status: "interface",
    media: "interface",
    devices: "interface",
    auth: "interface",
    security: "interface",
    payments: "interface",
    metrics: "interface",
    dashboard: "interface",
    text: "promo",
    cards: "promo",
    folio: "promo",
    cta: "promo",
    process: "promo",
  },
}

/** Те же разделы, что LOCALIZABLE в proxy.ts. На .club их отдаёт app/en. */
const CLUB_SECTIONS = [
  "components",
  "blocks",
  "animations",
  "scenarios",
  "search",
  "pricing",
  "account",
  "signin",
  "signup",
  "reset",
  "report",
  "start",
  "verify",
  "legal",
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
