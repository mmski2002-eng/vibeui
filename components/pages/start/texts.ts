import type { Locale } from "@/lib/i18n"

export type AgentTab = {
  id: "claude" | "cursor" | "other"
  label: string
  /** Шаги вставки: команда терминала помечена `code`. */
  steps: { text: string; code?: string }[]
}

export type StartTexts = {
  metaTitle: string
  metaDescription: string
  title: string
  lead: string
  /** Бейдж над заголовком: что это и сколько займёт. */
  badge: string
  navLabel: string
  /** Счётчик чек-листа в ленте шагов: «2 из 8». */
  progress: (done: number, total: number) => string
  /** aria-label кнопки-номера, которая становится галкой. */
  checkLabel: (title: string) => string
  copy: string
  copied: string
  /** Три входа по уровню: заголовок, подпись, якорь. */
  levels: { title: string; note: string; anchor: string }[]
  welcome: { title: string; lead: string; skip: string; done: string }
  demo: {
    heading: string
    pause: string
    play: string
    /** Подписи сцен ролика: заставка, каталог, блок, чат, результат. */
    scenes: [string, string, string, string, string]
    chatLine: string
    agentLines: [string, string, string]
    copy: string
    copied: string
  }
  setup: {
    heading: string
    lead: string
    steps: {
      title: string
      body: string
      code?: string
      link?: { href: string; label: string }
    }[]
  }
  paste: {
    heading: string
    lead: string
    pick: { title: string; body: string }
    copy: { title: string; body: string }
    agent: { title: string; body: string; tabs: AgentTab[]; fallback: string }
    check: { title: string; body: string; fix: string }
    tryIt: { title: string; body: string; open: string }
  }
  page: {
    heading: string
    lead: string
    items: {
      title: string
      body: string
      link?: { href: string; label: string }
    }[]
  }
  finish: { title: string; lead: string; catalog: string; scenarios: string }
}

const PROMPT_RU = "добавь это на главную первым экраном: <ссылка>"
const PROMPT_EN = "put this on the home page as the hero: <link>"

const RU: StartTexts = {
  metaTitle: "Как начать: от установки до первого блока",
  metaDescription:
    "Пошаговый гайд для новичков: установить Node.js и редактор, подключить ИИ-агента, скопировать блок VibeUI и получить его в своём проекте.",
  title: "Как пользоваться VibeUI",
  lead: "От пустого компьютера до готовой секции на сайте. Своё описываем подробно, чужое — одной строкой и ссылкой на официальную инструкцию.",
  badge: "Гайд для новичка · 5 минут",
  navLabel: "Шаги гайда",
  progress: (done, total) => `${done} из ${total} сделано`,
  checkLabel: (title) => `Отметить «${title}» сделанным`,
  copy: "Копировать",
  copied: "Скопировано",
  levels: [
    {
      title: "У меня ничего нет",
      note: "Два установщика, расширение, одна фраза агенту. Без терминала.",
      anchor: "setup",
    },
    {
      title: "Есть проект и агент",
      note: "Куда нажать, куда вставить и что должно получиться.",
      anchor: "paste",
    },
    {
      title: "Хочу целую страницу",
      note: "Сценарии, своя палитра, лимиты.",
      anchor: "page",
    },
  ],
  welcome: {
    title: "Почта подтверждена",
    lead: "Пять минут на этот гайд — и первый блок стоит в проекте. Его всегда можно открыть снова из подвала сайта.",
    skip: "Пропустить",
    done: "Готово, в кабинет",
  },
  demo: {
    heading: "Вся цепочка за полминуты",
    pause: "Пауза",
    play: "Запустить",
    scenes: [
      "Выбери дизайн. Отдай ИИ. Получи сайт.",
      "Выберите блок в каталоге",
      "Нажмите «Копировать для ИИ»",
      "Вставьте ссылку в чат агента",
      "Блок стоит в проекте — как в превью",
    ],
    chatLine: "добавь это на главную первым экраном: vibeui.ru/c/hero-001",
    agentLines: [
      "Открываю ссылку, читаю инструкцию",
      "Ставлю hero-001 из реестра",
      "Готово: components/hero-001.tsx, app/page.tsx",
    ],
    copy: "Копировать для ИИ",
    copied: "Скопировано",
  },
  setup: {
    heading: "Рабочее место",
    lead: "Windows или Mac, терминал не понадобится: два обычных установщика, расширение и одна фраза агенту — дальше он работает сам.",
    steps: [
      {
        title: "Node.js",
        body: "Скачайте LTS-версию и установите как любую программу: «Далее → Далее → Готово». Это движок, на котором крутится сайт; открывать его не придётся.",
        link: { href: "https://nodejs.org", label: "nodejs.org" },
      },
      {
        title: "VS Code",
        body: "Бесплатный редактор, в котором живёт агент. Скачайте и установите с настройками по умолчанию. Cursor — тот же VS Code с агентом уже внутри: если выбрали его, следующий шаг не нужен.",
        link: {
          href: "https://code.visualstudio.com",
          label: "code.visualstudio.com",
        },
      },
      {
        title: "Расширение Claude Code",
        body: "В VS Code откройте «Расширения» (иконка из квадратов слева или Ctrl+Shift+X), найдите «Claude Code», нажмите Install. Появится иконка Claude в боковой панели — нажмите и войдите в аккаунт. Нужна подписка Claude Pro или Max.",
        link: {
          href: "https://claude.com/claude-code",
          label: "claude.com/claude-code",
        },
      },
      {
        title: "Проект",
        body: "Создайте пустую папку, например my-site, и откройте её: «Файл → Открыть папку». В панели Claude напишите одну фразу — агент сам создаст сайт, запустит его и даст ссылку вида localhost:3000.",
        code: "создай здесь новый сайт на Next.js с Tailwind и запусти его",
      },
    ],
  },
  paste: {
    heading: "Первый блок",
    lead: "Один блок от каталога до вашего localhost. Дальше всё повторяется.",
    pick: {
      title: "Выберите блок",
      body: "Превью — ровно то, что получите. Подложка и настройки под превью уходят в ссылку: агент поставит блок таким, каким вы его видели.",
    },
    copy: {
      title: "Скопируйте для ИИ",
      body: "Кнопка «Копировать для ИИ» кладёт в буфер личную ссылку на сутки. По ней агент получает превью, код и инструкцию: что сохранить, что можно менять. Нужен вход — он бесплатный.",
    },
    agent: {
      title: "Вставьте агенту",
      body: "Напишите своими словами, куда поставить блок, и вставьте ссылку в это же предложение.",
      tabs: [
        {
          id: "claude",
          label: "Claude Code в VS Code",
          steps: [
            {
              text: "Откройте папку проекта в VS Code и нажмите иконку Claude в боковой панели.",
            },
            { text: "Отправьте сообщение:", code: PROMPT_RU },
            {
              text: "Агент откроет ссылку, поставит файлы и напишет, что изменил.",
            },
          ],
        },
        {
          id: "cursor",
          label: "Cursor",
          steps: [
            {
              text: "Откройте папку проекта, нажмите Ctrl+I (⌘I на Mac) и выберите режим Agent.",
            },
            { text: "Отправьте сообщение:", code: PROMPT_RU },
            { text: "Подтвердите правки файлов, когда Cursor их предложит." },
          ],
        },
        {
          id: "other",
          label: "Другой агент",
          steps: [
            {
              text: "Codex, Windsurf, Copilot Agent — любой, кто открывает ссылки и правит файлы. Сообщение то же:",
              code: PROMPT_RU,
            },
            {
              text: "Claude Code в терминале: команда `claude` в папке проекта, затем то же сообщение.",
            },
          ],
        },
      ],
      fallback:
        "Агент не открывает ссылки? На странице блока есть «Показать полную инструкцию» — вставьте её текст целиком.",
    },
    check: {
      title: "Сравните с превью",
      body: "Откройте localhost:3000. Блок должен совпасть с превью: те же анимации, отступы, поведение на телефоне.",
      fix: "Если агент «пересобрал по мотивам» — нет анимации, другие отступы — ответьте: «не пересоздавай, поставь компонент из реестра точно как в инструкции по ссылке».",
    },
    tryIt: {
      title: "Попробуйте прямо здесь",
      body: "Бесплатный блок hero-001. Скопируйте, вставьте агенту — и цепочка пройдена.",
      open: "Открыть страницу блока",
    },
  },
  page: {
    heading: "Целая страница",
    lead: "Когда один блок встал, остальное — вопрос количества.",
    items: [
      {
        title: "Сценарии",
        body: "Готовые страницы из блоков каталога: лендинг, портфолио, ресторан. Одна ссылка — все секции в нужном порядке.",
        link: { href: "/scenarios", label: "Смотреть сценарии" },
      },
      {
        title: "Своя палитра",
        body: "Каждый блок несёт цвета в собственных переменных `--vibeui-<имя>-*`. Попросите агента: «подставь наши цвета в переменные блока, остальное не трогай».",
      },
      {
        title: "Что агент сохраняет, а что меняет",
        body: "В инструкции по ссылке это разделено: анимации, типографика, отступы и responsive — сохранить; тексты, картинки, бренд-цвета — под вас.",
      },
      {
        title: "Лимиты",
        body: "Бесплатно — {limit} копирований в месяц, этого хватает на несколько сайтов. Pro снимает лимит и открывает закрытые блоки.",
        link: { href: "/pricing", label: "Тарифы" },
      },
    ],
  },
  finish: {
    title: "Первый блок уже стоит?",
    lead: "Дальше — каталог: полторы тысячи секций, компонентов и анимаций, каждая ставится той же фразой.",
    catalog: "Открыть каталог",
    scenarios: "Сценарии",
  },
}

const EN: StartTexts = {
  metaTitle: "Getting started: from setup to your first block",
  metaDescription:
    "Step-by-step guide for beginners: install Node.js and an editor, connect an AI agent, copy a VibeUI block and get it into your project.",
  title: "How to use VibeUI",
  lead: "From an empty computer to a finished section on your site. Our part in detail; everyone else's in one line with a link to the official docs.",
  badge: "Beginner guide · 5 minutes",
  navLabel: "Guide steps",
  progress: (done, total) => `${done} of ${total} done`,
  checkLabel: (title) => `Mark “${title}” as done`,
  copy: "Copy",
  copied: "Copied",
  levels: [
    {
      title: "I have nothing yet",
      note: "Two installers, an extension, one sentence to the agent. No terminal.",
      anchor: "setup",
    },
    {
      title: "I have a project and an agent",
      note: "What to click, where to paste, what to expect.",
      anchor: "paste",
    },
    {
      title: "I want a whole page",
      note: "Scenarios, your own palette, limits.",
      anchor: "page",
    },
  ],
  welcome: {
    title: "Email confirmed",
    lead: "Five minutes on this guide and your first block is in the project. It stays available from the site footer.",
    skip: "Skip",
    done: "Done, go to account",
  },
  demo: {
    heading: "The whole flow in thirty seconds",
    pause: "Pause",
    play: "Play",
    scenes: [
      "Pick a design. Hand it to AI. Ship the page.",
      "Pick a block in the catalog",
      "Press “Copy for AI”",
      "Paste the link into your agent's chat",
      "The block is in your project — same as the preview",
    ],
    chatLine: "put this on the home page as the hero: vibeui.ru/c/hero-001",
    agentLines: [
      "Opening the link, reading the instructions",
      "Installing hero-001 from the registry",
      "Done: components/hero-001.tsx, app/page.tsx",
    ],
    copy: "Copy for AI",
    copied: "Copied",
  },
  setup: {
    heading: "Workspace",
    lead: "Windows or Mac, no terminal needed: two ordinary installers, an extension and one sentence to the agent — it does the rest.",
    steps: [
      {
        title: "Node.js",
        body: "Download the LTS version and install it like any app: “Next → Next → Finish”. It's the engine the site runs on; you won't need to open it.",
        link: { href: "https://nodejs.org", label: "nodejs.org" },
      },
      {
        title: "VS Code",
        body: "The free editor the agent lives in. Download and install with defaults. Cursor is the same VS Code with the agent already inside: pick it and the next step is not needed.",
        link: {
          href: "https://code.visualstudio.com",
          label: "code.visualstudio.com",
        },
      },
      {
        title: "Claude Code extension",
        body: "In VS Code open Extensions (the squares icon on the left, or Ctrl+Shift+X), search “Claude Code”, press Install. A Claude icon appears in the sidebar — click it and sign in. Requires a Claude Pro or Max subscription.",
        link: {
          href: "https://claude.com/claude-code",
          label: "claude.com/claude-code",
        },
      },
      {
        title: "Project",
        body: "Create an empty folder, say my-site, and open it: “File → Open Folder”. In the Claude panel type one sentence — the agent creates the site, starts it and gives you a localhost:3000 link.",
        code: "create a new Next.js site with Tailwind here and run it",
      },
    ],
  },
  paste: {
    heading: "First block",
    lead: "One block from the catalog to your localhost. Everything after that repeats.",
    pick: {
      title: "Pick a block",
      body: "The preview is exactly what you get. The surface and the controls under the preview go into the link: the agent installs the block the way you saw it.",
    },
    copy: {
      title: "Copy for AI",
      body: "The “Copy for AI” button puts a personal 24-hour link on your clipboard. Through it the agent gets the preview, the code and the instructions: what to keep, what may change. Sign-in required — it's free.",
    },
    agent: {
      title: "Paste it to the agent",
      body: "Say in your own words where the block goes and paste the link into that same sentence.",
      tabs: [
        {
          id: "claude",
          label: "Claude Code in VS Code",
          steps: [
            {
              text: "Open the project folder in VS Code and click the Claude icon in the sidebar.",
            },
            { text: "Send the message:", code: PROMPT_EN },
            {
              text: "The agent opens the link, installs the files and reports what changed.",
            },
          ],
        },
        {
          id: "cursor",
          label: "Cursor",
          steps: [
            {
              text: "Open the project folder, press Ctrl+I (⌘I on Mac) and pick Agent mode.",
            },
            { text: "Send the message:", code: PROMPT_EN },
            { text: "Accept the file edits when Cursor proposes them." },
          ],
        },
        {
          id: "other",
          label: "Another agent",
          steps: [
            {
              text: "Codex, Windsurf, Copilot Agent — anything that opens links and edits files. Same message:",
              code: PROMPT_EN,
            },
            {
              text: "Claude Code in the terminal: run `claude` in the project folder, then the same message.",
            },
          ],
        },
      ],
      fallback:
        "Agent can't open links? The block page has “Show the full instructions” — paste that text in full.",
    },
    check: {
      title: "Compare with the preview",
      body: "Open localhost:3000. The block should match the preview: same animations, spacing, mobile behaviour.",
      fix: "If the agent “rebuilt it from memory” — no animation, different spacing — reply: “don't recreate it, install the registry component exactly as the linked instructions say”.",
    },
    tryIt: {
      title: "Try it right here",
      body: "Free block hero-001. Copy it, paste it to your agent — and the flow is done.",
      open: "Open the block page",
    },
  },
  page: {
    heading: "A whole page",
    lead: "Once one block is in, the rest is a matter of quantity.",
    items: [
      {
        title: "Scenarios",
        body: "Ready pages assembled from catalog blocks: landing, portfolio, restaurant. One link — every section in order.",
        link: { href: "/scenarios", label: "Browse scenarios" },
      },
      {
        title: "Your own palette",
        body: "Every block carries its colours in its own `--vibeui-<name>-*` variables. Ask the agent: “put our colours into the block's variables, leave the rest alone”.",
      },
      {
        title: "What the agent keeps and what it changes",
        body: "The linked instructions split it: animations, typography, spacing and responsive behaviour — keep; copy, images, brand colours — yours to change.",
      },
      {
        title: "Limits",
        body: "Free — {limit} copies a month, enough for several sites. Pro removes the limit and unlocks the gated blocks.",
        link: { href: "/pricing", label: "Pricing" },
      },
    ],
  },
  finish: {
    title: "First block in place?",
    lead: "Next stop — the catalog: fifteen hundred sections, components and animations, each installed with the same sentence.",
    catalog: "Open the catalog",
    scenarios: "Scenarios",
  },
}

export const START_TEXTS: Record<Locale, StartTexts> = { ru: RU, en: EN }
