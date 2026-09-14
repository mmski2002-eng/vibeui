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
  topbar: {
    components: string
    blocks: string
    items: (count: number) => string
    animations: string
    scenarios: string
    pricing: string
  }
  home: {
    title: string
    /**
     * Тот же заголовок, разбитый по смыслу: «Выбери дизайн.» отдельной
     * строкой. Автоперенос рвал фразу между «Отдай» и «ИИ».
     */
    /* Три предложения обещания по отдельности: в заголовке они идут
       разным весом, и склеенная строка этого не позволяет. */
    titleParts: [string, string, string]
    description: string
    blocksLink: string
    counts: (items: number, categories: number) => string
    // Отдельно от текста на экране: тот обрывается на ссылке «в блоках»
    // и в выдачу поисковика не годится.
    metaTitle: string
    metaDescription: string
  }
  components: { title: string; description: string; metaTitle: string }
  blocks: { title: string; description: string; metaTitle: string }
  animations: { title: string; description: string; metaTitle: string }
  nav: { heading: string; popular: string; all: string; filter: string }
  catalog: {
    filterCategories: string
    search: string
    searchHint: string
    searchEmpty: string
    compactView: string
    comfortableView: string
    viewMode: string
    overview: string
    largePreview: string
    all: string
    /** «61 компонент» / «61 блок» — с русским склонением. */
    count: (count: number) => string
    inCategory: string
  }
  search: {
    title: string
    metaTitle: string
    placeholder: string
    hint: string
    /** Заголовок выдачи: «Найдено 12 результатов». */
    found: (count: number) => string
    /** Выдача обрезана: «Найдено 397, показаны первые 48». */
    shown: (shown: number, total: number) => string
    nothing: string
    /** Точных совпадений нет — показано близкое. */
    near: string
    /** Совет, когда в запросе одни оценки: «красивое», «удобное». */
    tooVague: string
    /** Запрос про тему сайта, а не про элемент интерфейса: совет и примеры. */
    topicHint: string
    sections: string
    showAll: string
    inSection: Record<"block" | "component" | "animation" | "template", string>
  }
  card: {
    copy: string
    copied: string
    copyId: string
    idCopied: string
    favourite: string
    favouriteSoon: string
    report: string
    reportTitle: string
    reportPlaceholder: string
    reportSend: string
    reportSent: string
    toLight: string
    toDark: string
    reset: string
    accent: string
    accentPresets: {
      ink: string
      brand: string
      blue: string
      green: string
      violet: string
    }
    themeColor: string
    getCode: string
    install: string
    code: string
    copyCode: string
    copyCommand: string
    openPage: string
    close: string
    loading: string
  }
  viewport: {
    desktop: string
    tablet: string
    mobile: string
    hostTheme: string
    light: string
    dark: string
  }
  scenarios: {
    title: string
    metaTitle: string
    description: string
    /** «10 секций» — с русским склонением. */
    stepCount: (count: number) => string
    step: string
    optional: string
    chosen: string
    choose: string
    /** «ещё 15 в категории» */
    more: (count: number) => string
    parts: string
    wipTitle: string
    wipText: string
    wipLink: string
    partsNote: string
    copy: string
    copied: string
    copyNote: string
    openCategory: string
  }
  item: {
    preview: string
    use: string
    /** Подпись у главной кнопки: что именно окажется в буфере. */
    copyLead: string
    /** Что делать со ссылкой сразу после копирования. */
    copyHint: string
    flow: string
    flowSteps: [string, string, string]
    flowChat: string
    adapt: string
    tags: string
    notes: string
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
  topbar: {
    components: "Компоненты",
    blocks: "Блоки",
    scenarios: "Сценарии",
    pricing: "Тарифы",
    items: (count) => {
      const tail = count % 100
      const last = count % 10

      if (tail > 10 && tail < 20) {
        return `${count} элементов`
      }

      if (last === 1) {
        return `${count} элемент`
      }

      if (last > 1 && last < 5) {
        return `${count} элемента`
      }

      return `${count} элементов`
    },
    animations: "Анимации",
  },
  home: {
    title: "Выбери дизайн. Отдай ИИ. Получи сайт.",
    titleParts: ["Выбери дизайн.", "Отдай ИИ.", "Получи сайт."],
    description:
      "Библиотека готовых компонентов для вайбкодинга. Открой компонент, нажми «Копировать для ИИ» — агент поставит его из реестра, а не пересоздаст похожий по описанию. Целые секции страницы — в",
    blocksLink: "блоках",
    counts: (items, categories) =>
      `элементов: ${items} · категорий: ${categories} · установка одной командой`,
    metaTitle: "VibeUI — библиотека UI-компонентов для вайбкодинга",
    metaDescription:
      "Готовые React-компоненты и секции страниц на Tailwind CSS: живое превью, установка одной командой из shadcn-совместимого реестра и готовая инструкция для ИИ-агента. Выбери дизайн, отдай ИИ, получи сайт.",
  },
  components: {
    title: "Компоненты",
    metaTitle: "Компоненты",
    description:
      "Мелкие элементы интерфейса: кнопки, поля, индикаторы. Каждый ставится одной командой, не зависит от темы вашего проекта и приходит с инструкцией для ИИ-агента.",
  },
  blocks: {
    title: "Блоки",
    metaTitle: "Блоки",
    description:
      "Готовые секции лендинга целиком. Каждая ставится одной командой, не зависит от темы вашего проекта и приходит с инструкцией для ИИ-агента.",
  },
  animations: {
    title: "Анимации",
    metaTitle: "Анимации",
    description:
      "Анимированные компоненты, воссозданные в нашей концепции: один файл, ноль зависимостей, своя палитра. Каждый ставится одной командой и приходит с инструкцией для ИИ-агента.",
  },
  nav: {
    heading: "Каталог",
    popular: "Популярное",
    all: "Всё",
    filter: "Фильтр каталога",
  },
  catalog: {
    filterCategories: "Фильтр категорий…",
    search: "Поиск компонентов…",
    searchHint: "Начните вводить название или тег",
    searchEmpty: "Ничего не найдено",
    compactView: "Компактный вид",
    comfortableView: "Обычный вид",
    viewMode: "Режим витрины",
    overview: "Обзор вариантов",
    largePreview: "Крупное превью",
    all: "Все категории",
    count: (count) => {
      const tail = count % 100
      const last = count % 10

      if (tail > 10 && tail < 20) {
        return `${count} компонентов`
      }

      if (last === 1) {
        return `${count} компонент`
      }

      if (last > 1 && last < 5) {
        return `${count} компонента`
      }

      return `${count} компонентов`
    },
    inCategory: "в категории",
  },
  search: {
    title: "Поиск",
    metaTitle: "Поиск по каталогу",
    placeholder: "Поиск по всему каталогу…",
    hint: "Ищите как говорите: «тарифы», «форма заявки», «красивая кнопка»",
    found: (count) => {
      const tail = count % 100
      const last = count % 10

      if (tail > 10 && tail < 20) {
        return `Найдено ${count} результатов`
      }

      if (last === 1) {
        return `Найден ${count} результат`
      }

      if (last > 1 && last < 5) {
        return `Найдено ${count} результата`
      }

      return `Найдено ${count} результатов`
    },
    shown: (shown, total) => `Найдено ${total}, показаны первые ${shown}`,
    nothing: "Ничего не нашлось даже среди близкого",
    near: "Точных совпадений нет. Похожее:",
    tooVague: "В запросе только оценки — добавьте, что именно нужно найти",
    topicHint:
      "Похоже, вы ищете по теме сайта. Каталог ищут по типу элемента — попробуйте:",
    sections: "Подходящие разделы",
    showAll: "Показать все результаты",
    inSection: {
      block: "Блоки",
      component: "Компоненты",
      animation: "Анимации",
      template: "Шаблоны",
    },
  },
  card: {
    copy: "Копировать для ИИ",
    copied: "Ссылка скопирована",
    copyId: "Скопировать идентификатор",
    idCopied: "Идентификатор скопирован",
    favourite: "В избранное",
    favouriteSoon: "Избранное появится позже",
    report: "Пожаловаться на компонент",
    reportTitle: "Что не так с компонентом?",
    reportPlaceholder: "Опишите проблему: что сломано, где и как повторить",
    reportSend: "Отправить",
    reportSent: "Спасибо, жалоба записана",
    toLight: "Светлая подложка превью",
    toDark: "Тёмная подложка превью",
    reset: "Сбросить настройки",
    accent: "Акцентный цвет",
    accentPresets: {
      ink: "Чернильный",
      brand: "Фирменный оранжевый",
      blue: "Синий",
      green: "Зелёный",
      violet: "Фиолетовый",
    },
    themeColor: "Цвет темы",
    getCode: "Показать код",
    install: "Установка",
    code: "Код",
    copyCode: "Скопировать код",
    copyCommand: "Скопировать команду",
    openPage: "Открыть страницу",
    close: "Закрыть",
    loading: "Загружается…",
  },
  viewport: {
    desktop: "Десктоп",
    tablet: "Планшет",
    mobile: "Телефон",
    hostTheme: "Тема страницы",
    light: "Светлая",
    dark: "Тёмная",
  },
  scenarios: {
    title: "Сценарии",
    wipTitle: "Раздел в разработке",
    wipText:
      "Собираем сценарии заново: задача → готовый порядок секций → промпт на целую страницу. Пока раздел закрыт, каталог и поиск работают как обычно.",
    wipLink: "Открыть каталог",
    metaTitle: "Сценарии — с чего начать",
    description:
      "Вход со стороны задачи, а не устройства библиотеки. Сценарий раскладывает «сделать лендинг услуги» или «собрать магазин» на секции в понятном порядке и объясняет, зачем на странице каждая.",
    stepCount: (count) => {
      const tail = count % 100
      const last = count % 10

      if (tail > 10 && tail < 20) {
        return `${count} секций`
      }

      if (last === 1) {
        return `${count} секция`
      }

      if (last > 1 && last < 5) {
        return `${count} секции`
      }

      return `${count} секций`
    },
    step: "Шаг",
    optional: "необязательно",
    chosen: "Выбрано",
    choose: "Выбрать",
    more: (count) => `ещё ${count} в категории`,
    parts: "Понадобятся компоненты",
    partsNote:
      "Мелкие части страницы: их ставят по одному, когда доходит до вёрстки формы или таблицы.",
    copy: "Копировать сценарий для ИИ",
    copied: "Скопировано",
    copyNote:
      "Промпт со всеми выбранными блоками, порядком секций и командами установки. Вставьте его агенту — он поставит блоки из реестра и соберёт страницу.",
    openCategory: "Открыть категорию",
  },
  item: {
    preview: "Превью",
    use: "Использовать с ИИ",
    copyLead: "Ссылка для ИИ-агента: в ней превью, код и инструкция.",
    copyHint:
      "Вставь ссылку в чат агента в своём проекте и напиши, куда добавить блок. Ссылка личная и действует 24 часа.",
    flow: "Как это работает",
    flowSteps: [
      "Выбрали здесь",
      "Вставили в чат агента",
      "Получили в проекте",
    ],
    flowChat: "добавь это на главную первым экраном:",
    adapt: "Что можно поменять",
    tags: "Теги",
    notes: "Технические заметки",
    steps: [
      "Скопируйте ссылку.",
      "Напишите агенту своими словами и вставьте её в предложение.",
      "Агент откроет ссылку и поставит компонент из реестра.",
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
    registryUrl: "Ссылка на реестр",
    noCommand: "Команда установки недоступна: переменная окружения",
    noSource: "Исходник компонента не найден.",
  },
}

// Английский написан заново, а не переведён построчно: формулировки должны
// звучать так, как их пишут в англоязычных библиотеках компонентов.
const EN: Dictionary = {
  locale: "en",
  label: "Eng",
  topbar: {
    components: "Components",
    blocks: "Blocks",
    scenarios: "Scenarios",
    items: (count) => `${count} items`,
    animations: "Animations",
    pricing: "Pricing",
  },
  home: {
    title: "Pick a design. Hand it to your AI. Ship the page.",
    titleParts: ["Pick a design.", "Hand it to AI.", "Ship the page."],
    description:
      "A component library built for vibe coding. Open a component, hit Copy for AI, and your agent installs the real thing from the registry instead of guessing at a lookalike. Full page sections live in",
    blocksLink: "Blocks",
    counts: (items, categories) =>
      `${items} items · ${categories} categories · one command to install`,
    metaTitle: "VibeUI — UI component library for vibe coding",
    metaDescription:
      "Ready-made React components and page sections on Tailwind CSS: live preview, one-command install from a shadcn-compatible registry and a ready prompt for your AI agent.",
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
  animations: {
    title: "Animations",
    metaTitle: "Animations",
    description:
      "Animated components recreated in our concept: one file, zero dependencies, their own palette. Each installs with a single command and ships with instructions your agent can follow.",
  },
  nav: {
    heading: "Catalog",
    popular: "Popular",
    all: "All",
    filter: "Filter the catalog",
  },
  catalog: {
    filterCategories: "Filter categories…",
    search: "Search components…",
    searchHint: "Start typing a name or a tag",
    searchEmpty: "Nothing found",
    compactView: "Compact view",
    comfortableView: "Comfortable view",
    viewMode: "Catalog view",
    overview: "Browse variants",
    largePreview: "Large preview",
    all: "All categories",
    count: (count) => `${count} component${count === 1 ? "" : "s"}`,
    inCategory: "in",
  },
  search: {
    title: "Search",
    metaTitle: "Catalog search",
    placeholder: "Search the whole catalog…",
    hint: "Search the way you speak: “pricing”, “contact form”, “nice button”",
    found: (count) => `${count} result${count === 1 ? "" : "s"}`,
    shown: (shown, total) => `${total} results, showing the first ${shown}`,
    nothing: "Nothing matched, not even loosely",
    near: "No exact matches. Close ones:",
    tooVague: "The query is all adjectives — add what you are looking for",
    topicHint:
      "Looks like a site-topic query. The catalog is searched by element type — try:",
    sections: "Matching sections",
    showAll: "Show all results",
    inSection: {
      block: "Blocks",
      component: "Components",
      animation: "Animations",
      template: "Templates",
    },
  },
  card: {
    copy: "Copy for AI",
    copied: "Link copied",
    copyId: "Copy id",
    idCopied: "Id copied",
    favourite: "Add to favourites",
    favouriteSoon: "Favourites are coming later",
    report: "Report the component",
    reportTitle: "What is wrong with the component?",
    reportPlaceholder:
      "Describe the problem: what is broken, where and how to repeat it",
    reportSend: "Send",
    reportSent: "Thanks, the report is saved",
    toLight: "Switch preview to a light surface",
    toDark: "Switch preview to a dark surface",
    reset: "Reset settings",
    accent: "Accent colour",
    accentPresets: {
      ink: "Ink",
      brand: "Brand orange",
      blue: "Blue",
      green: "Green",
      violet: "Violet",
    },
    themeColor: "Theme colour",
    getCode: "Get Code",
    install: "Installation",
    code: "Code",
    copyCode: "Copy the code",
    copyCommand: "Copy the command",
    openPage: "Open the page",
    close: "Close",
    loading: "Loading…",
  },
  viewport: {
    desktop: "Desktop",
    tablet: "Tablet",
    mobile: "Mobile",
    hostTheme: "Host theme",
    light: "Light",
    dark: "Dark",
  },
  scenarios: {
    title: "Scenarios",
    wipTitle: "Section under construction",
    wipText:
      "We are rebuilding scenarios: a task → a ready order of sections → a prompt for the whole page. While the section is closed, the catalog and search work as usual.",
    wipLink: "Open the catalog",
    metaTitle: "Scenarios — where to start",
    description:
      "An entry point from the task, not from how the library is built. A scenario breaks “make a service landing” or “build a store” into sections in a sensible order and says what each one is for.",
    stepCount: (count) => `${count} section${count === 1 ? "" : "s"}`,
    step: "Step",
    optional: "optional",
    chosen: "Chosen",
    choose: "Choose",
    more: (count) => `${count} more in the category`,
    parts: "Components you will need",
    partsNote:
      "The small parts of a page: you install them one by one when you get to a form or a table.",
    copy: "Copy the scenario for AI",
    copied: "Copied",
    copyNote:
      "A prompt with every chosen block, the order of the sections and the install commands. Paste it to your agent — it installs the blocks from the registry and assembles the page.",
    openCategory: "Open the category",
  },
  item: {
    preview: "Preview",
    use: "Use it with AI",
    copyLead: "A link for your AI agent: preview, code and instructions.",
    copyHint:
      "Paste the link into your agent's chat and say where the block should go. The link is personal and valid for 24 hours.",
    flow: "How it works",
    flowSteps: ["Pick it here", "Paste into the chat", "Get it in your project"],
    flowChat: "put this on the home page as the hero:",
    adapt: "What you can change",
    tags: "Tags",
    notes: "Technical notes",
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
