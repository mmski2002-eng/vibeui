export const LOCALES = ["ru", "en"] as const

export type Locale = (typeof LOCALES)[number]

/** Русский живёт в корне, английский — под `/en`. Старые ссылки не ломаются. */
export const DEFAULT_LOCALE: Locale = "ru"

export function isLocale(value: string | undefined): value is Locale {
  return value === "ru" || value === "en"
}

/** Путь внутри сайта для выбранного языка. Принимает путь без префикса. */
export function localePath(locale: Locale, path: string): string {
  return locale === DEFAULT_LOCALE ? path : `/en${path === "/" ? "" : path}`
}

/** Обратная операция: убирает префикс, чтобы переключатель нашёл пару. */
export function stripLocale(path: string): string {
  return path === "/en" ? "/" : path.replace(/^\/en(?=\/)/, "")
}

type Dictionary = {
  locale: Locale
  label: string
  topbar: { components: string; blocks: string; items: string }
  home: {
    title: string
    description: string
    blocksLink: string
    counts: (items: number, categories: number) => string
  }
  components: { title: string; description: string; metaTitle: string }
  blocks: { title: string; description: string; metaTitle: string }
  nav: { heading: string; all: string; filter: string }
  card: {
    copy: string
    copied: string
    configure: string
    closeConfigure: string
    toLight: string
    toDark: string
    reset: string
  }
  control: { unset: string; clear: string }
  item: {
    preview: string
    use: string
    steps: [string, string, string]
    example: string
    showFull: string
    fullNote: string
    copyFull: string
    dev: string
    source: string
    sourceNote: string
    copyCode: string
    copyCommand: string
    registryUrl: string
    noCommand: string
    noSource: string
  }
}

const RU: Dictionary = {
  locale: "ru",
  label: "Рус",
  topbar: { components: "Компоненты", blocks: "Блоки", items: "items" },
  home: {
    title: "Выбери дизайн. Отдай ИИ. Получи сайт.",
    description:
      "Библиотека готовых компонентов для вайбкодинга. Открой компонент, нажми Copy for AI — агент поставит его из registry, а не пересоздаст похожий по описанию. Целые секции страницы — в",
    blocksLink: "блоках",
    counts: (items, categories) =>
      `items: ${items} · категорий: ${categories} · установка одной командой`,
  },
  components: {
    title: "Компоненты",
    metaTitle: "Компоненты",
    description:
      "Мелкие элементы интерфейса: кнопки, поля, индикаторы. Каждый ставится одной командой, не зависит от темы вашего проекта и приходит с инструкцией для AI-агента.",
  },
  blocks: {
    title: "Блоки",
    metaTitle: "Блоки",
    description:
      "Готовые секции лендинга целиком. Каждая ставится одной командой, не зависит от темы вашего проекта и приходит с инструкцией для AI-агента.",
  },
  nav: { heading: "Каталог", all: "Всё", filter: "Фильтр каталога" },
  card: {
    copy: "Copy for AI",
    copied: "Ссылка скопирована",
    configure: "Настроить компонент",
    closeConfigure: "Закрыть настройку",
    toLight: "Светлая подложка превью",
    toDark: "Тёмная подложка превью",
    reset: "Сбросить настройки",
  },
  control: { unset: "по умолчанию", clear: "сбросить" },
  item: {
    preview: "Превью",
    use: "Использовать с AI",
    steps: [
      "Скопируйте ссылку.",
      "Напишите агенту своими словами и вставьте её в предложение.",
      "Агент откроет ссылку и поставит компонент из registry.",
    ],
    example: "размести это в шапке:",
    showFull: "Показать полную инструкцию",
    fullNote:
      "То, что лежит по ссылке в развёрнутом виде. Нужна, если агент не может открыть ссылку — тогда вставьте этот текст целиком.",
    copyFull: "Копировать полную инструкцию",
    dev: "Для разработчика",
    source: "Исходник компонента",
    sourceNote:
      "Тот же файл, который поставит агент. Нужен, если вы предпочитаете скопировать код руками.",
    copyCode: "Копировать код",
    copyCommand: "Копировать команду",
    registryUrl: "Registry URL",
    noCommand: "Команда установки недоступна: переменная окружения",
    noSource: "Исходник компонента не найден.",
  },
}

// Английский написан заново, а не переведён построчно: формулировки должны
// звучать так, как их пишут в англоязычных библиотеках компонентов.
const EN: Dictionary = {
  locale: "en",
  label: "Eng",
  topbar: { components: "Components", blocks: "Blocks", items: "items" },
  home: {
    title: "Pick a design. Hand it to your AI. Ship the page.",
    description:
      "A component library built for vibe coding. Open a component, hit Copy for AI, and your agent installs the real thing from the registry instead of guessing at a lookalike. Full page sections live in",
    blocksLink: "Blocks",
    counts: (items, categories) =>
      `${items} items · ${categories} categories · one command to install`,
  },
  components: {
    title: "Components",
    metaTitle: "Components",
    description:
      "The small pieces: buttons, inputs, indicators. Each one installs with a single command, carries its own palette instead of borrowing your theme, and ships with instructions your agent can follow.",
  },
  blocks: {
    title: "Blocks",
    metaTitle: "Blocks",
    description:
      "Whole landing page sections. Each one installs with a single command, carries its own palette instead of borrowing your theme, and ships with instructions your agent can follow.",
  },
  nav: { heading: "Catalog", all: "All", filter: "Filter the catalog" },
  card: {
    copy: "Copy for AI",
    copied: "Link copied",
    configure: "Configure component",
    closeConfigure: "Close configuration",
    toLight: "Switch preview to a light surface",
    toDark: "Switch preview to a dark surface",
    reset: "Reset settings",
  },
  control: { unset: "default", clear: "clear" },
  item: {
    preview: "Preview",
    use: "Use it with AI",
    steps: [
      "Copy the link.",
      "Write to your agent in your own words and drop the link into the sentence.",
      "The agent opens the link and installs the component from the registry.",
    ],
    example: "put this in the header:",
    showFull: "Show the full instructions",
    fullNote:
      "What the link says, spelled out. Use it when your agent cannot open links — paste this text instead.",
    copyFull: "Copy full instructions",
    dev: "For developers",
    source: "Component source",
    sourceNote:
      "The same file your agent installs. Here in case you would rather copy it by hand.",
    copyCode: "Copy code",
    copyCommand: "Copy command",
    registryUrl: "Registry URL",
    noCommand: "The install command is unavailable: the environment variable",
    noSource: "Component source not found.",
  },
}

const DICTIONARIES: Record<Locale, Dictionary> = { ru: RU, en: EN }

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale]
}
