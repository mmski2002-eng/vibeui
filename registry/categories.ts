/**
 * Таксономия каталога. Три независимых оси:
 *
 * - `kind`     — что это за единица установки (секция, компонент, шаблон);
 * - `category` — штатное поле схемы shadcn (`categories[0]`), тип секции;
 * - `group`    — крупная предметная область, выводится из категории.
 *
 * Всё выводимое живёт здесь, а не в metadata блоков: `registry.json` блока
 * объявляет только `categories`, остальное резолвится по этим таблицам.
 * Так `kind` и `group` не дублируются по items и не попадают в публикуемый
 * `/r/<name>.json`.
 */

export const KINDS = [
  { slug: "block", label: "Блоки", plural: "блоков" },
  { slug: "component", label: "Компоненты", plural: "компонентов" },
  { slug: "animation", label: "Анимации", plural: "анимаций" },
  { slug: "template", label: "Шаблоны", plural: "шаблонов" },
] as const

export type ItemKind = (typeof KINDS)[number]["slug"]

export const GROUPS = [
  { slug: "marketing", label: "Маркетинг", en: "Marketing" },
  { slug: "application", label: "Приложение", en: "Application" },
  { slug: "data", label: "Данные", en: "Data" },
  { slug: "commerce", label: "Коммерция", en: "Commerce" },
  { slug: "navigation", label: "Навигация", en: "Navigation" },
] as const

export type ItemGroup = (typeof GROUPS)[number]["slug"]

export const CATEGORIES = [
  {
    slug: "hero",
    label: "Первый экран",
    en: "Hero",
    group: "marketing",
  },
  {
    slug: "navbar",
    label: "Шапка сайта",
    en: "Navbar",
    group: "navigation",
  },
  {
    slug: "pricing",
    label: "Тарифы и сравнение",
    en: "Pricing",
    group: "commerce",
  },
  {
    slug: "testimonials",
    label: "Отзывы",
    en: "Testimonials",
    group: "marketing",
  },
  {
    slug: "faq",
    label: "Вопросы и ответы",
    en: "FAQ",
    group: "marketing",
  },
  {
    slug: "cta",
    label: "Призыв к действию",
    en: "CTA",
    group: "marketing",
  },
  {
    slug: "footer",
    label: "Подвал",
    en: "Footer",
    group: "navigation",
  },
  {
    slug: "ai",
    label: "ИИ",
    en: "AI",
    group: "application",
  },
  {
    slug: "dashboard",
    label: "Панель показателей",
    en: "Dashboard",
    group: "data",
  },
  {
    slug: "commerce",
    label: "Магазин",
    en: "Commerce",
    group: "commerce",
  },
  {
    slug: "auth",
    label: "Вход и регистрация",
    en: "Auth",
    group: "application",
  },
  {
    slug: "datagrid",
    label: "Таблица данных",
    en: "Data Grid",
    group: "data",
  },
  {
    slug: "blog",
    label: "Блог и подкаст",
    en: "Blog",
    group: "marketing",
  },
  {
    slug: "contact",
    label: "Контакты",
    en: "Contact",
    group: "marketing",
  },
  {
    slug: "map",
    label: "Карты",
    en: "Maps",
    group: "marketing",
  },
  {
    slug: "errors",
    label: "Служебные страницы",
    en: "Service pages",
    group: "application",
  },
  {
    slug: "industry",
    label: "Отраслевые секции",
    en: "Industry sections",
    group: "commerce",
  },
  {
    slug: "about",
    label: "О компании",
    en: "About",
    group: "marketing",
  },
  {
    slug: "portfolio",
    label: "Портфолио и кейсы",
    en: "Portfolio",
    group: "marketing",
  },
  {
    slug: "events",
    label: "События",
    en: "Events",
    group: "marketing",
  },
  {
    slug: "data-grid",
    label: "Таблица данных",
    en: "Data Grid",
    group: "data",
  },
  // Категории компонентов: одна категория — один тип. Сборных корзин
  // («Inputs», «Display») здесь нет: тип, спрятанный внутри такой корзины,
  // невозможно найти ни в списке категорий, ни по адресу.
  {
    slug: "accordion",
    label: "Аккордеон",
    en: "Accordion",
    group: "application",
  },
  {
    slug: "alert",
    label: "Уведомления и баннеры",
    en: "Alert",
    group: "application",
  },
  {
    slug: "avatar",
    label: "Аватары и иконки",
    en: "Avatar",
    group: "application",
  },
  {
    slug: "badge",
    label: "Значки",
    en: "Badge",
    group: "application",
  },
  {
    slug: "button",
    label: "Кнопки",
    en: "Button",
    group: "application",
  },
  {
    slug: "button-group",
    label: "Группы кнопок",
    en: "Button group",
    group: "application",
  },
  {
    slug: "calendar",
    label: "Календари и даты",
    en: "Calendar",
    group: "data",
  },
  {
    slug: "card",
    label: "Карточки",
    en: "Card",
    group: "application",
  },
  {
    slug: "carousel",
    label: "Карусели",
    en: "Carousel",
    group: "application",
  },
  {
    slug: "chart",
    label: "Графики",
    en: "Chart",
    group: "data",
  },
  {
    slug: "checkbox",
    label: "Флажки и переключатели",
    en: "Checkbox & toggles",
    group: "application",
  },
  {
    slug: "code-block",
    label: "Блок кода",
    en: "Code Block",
    group: "application",
  },
  {
    slug: "combobox",
    label: "Поиск и выбор",
    en: "Combobox",
    group: "application",
  },
  {
    slug: "command",
    label: "Командное меню",
    en: "Command",
    group: "navigation",
  },
  {
    slug: "dialog",
    label: "Диалоги и панели",
    en: "Dialog",
    group: "application",
  },
  {
    slug: "dropdown-menu",
    label: "Выпадающие меню",
    en: "Dropdown menu",
    group: "navigation",
  },
  {
    slug: "empty",
    label: "Пустое состояние",
    en: "Empty",
    group: "application",
  },
  {
    slug: "loading",
    label: "Загрузка",
    en: "Loading",
    group: "application",
  },
  {
    slug: "frame",
    label: "Рамка",
    en: "Frame",
    group: "application",
  },
  {
    slug: "input",
    label: "Поля ввода",
    en: "Input",
    group: "application",
  },
  {
    slug: "special-input",
    label: "Специальные поля",
    en: "Specialized inputs",
    group: "application",
  },
  {
    slug: "kanban",
    label: "Канбан-доска",
    en: "Kanban",
    group: "data",
  },
  {
    slug: "mockup",
    label: "Мокап устройства",
    en: "Device Mockup",
    group: "marketing",
  },
  {
    slug: "popover",
    label: "Всплывающие подсказки",
    en: "Popover",
    group: "application",
  },
  {
    slug: "scroll-area",
    label: "Область прокрутки",
    en: "Scroll Area",
    group: "application",
  },
  {
    slug: "select",
    label: "Списки выбора",
    en: "Select",
    group: "application",
  },
  {
    slug: "sidebar",
    label: "Боковое меню",
    en: "Sidebar",
    group: "navigation",
  },
  {
    slug: "slider",
    label: "Слайдеры",
    en: "Slider",
    group: "application",
  },
  {
    slug: "stepper",
    label: "Шаги и таймлайн",
    en: "Stepper",
    group: "navigation",
  },
  {
    slug: "table",
    label: "Таблицы и фильтры",
    en: "Table",
    group: "data",
  },
  {
    slug: "tabs",
    label: "Вкладки",
    en: "Tabs",
    group: "navigation",
  },
  {
    slug: "navigation",
    label: "Навигация",
    en: "Navigation",
    group: "navigation",
  },
  {
    slug: "textarea",
    label: "Многострочное поле",
    en: "Textarea",
    group: "application",
  },
  {
    slug: "toast",
    label: "Всплывающее сообщение",
    en: "Toast",
    group: "application",
  },
  {
    slug: "tree",
    label: "Деревья и перетаскивание",
    en: "Tree",
    group: "data",
  },
  // Категории анимаций: живут в дереве registry/animations, свой kind, в
  // каталог компонентов/блоков не попадают.
  {
    slug: "activity",
    label: "Активность",
    en: "Activity",
    group: "data",
  },
  {
    slug: "branding",
    label: "Брендинг",
    en: "Branding",
    group: "marketing",
  },
  {
    slug: "browser",
    label: "Окно браузера",
    en: "Browser",
    group: "application",
  },
  {
    slug: "chat",
    label: "Чат",
    en: "Chat",
    group: "application",
  },
  {
    slug: "connections",
    label: "Связи",
    en: "Connections",
    group: "data",
  },
  {
    slug: "devices",
    label: "Устройства",
    en: "Devices",
    group: "application",
  },
  {
    slug: "email",
    label: "Почта",
    en: "Email",
    group: "application",
  },
  {
    slug: "files",
    label: "Файлы",
    en: "Files",
    group: "application",
  },
  {
    slug: "geo",
    label: "Карта",
    en: "Geo",
    group: "data",
  },
  {
    slug: "git",
    label: "Git",
    en: "Git",
    group: "application",
  },
  {
    slug: "images",
    label: "Изображения",
    en: "Images",
    group: "application",
  },
  {
    slug: "integrations",
    label: "Интеграции",
    en: "Integrations",
    group: "application",
  },
  {
    slug: "media",
    label: "Медиаплеер",
    en: "Media",
    group: "application",
  },
  {
    slug: "metrics",
    label: "Метрики",
    en: "Metrics",
    group: "data",
  },
  {
    slug: "notifications",
    label: "Уведомления",
    en: "Notifications",
    group: "application",
  },
  {
    slug: "payments",
    label: "Платежи",
    en: "Payments",
    group: "commerce",
  },
  {
    slug: "search",
    label: "Поиск",
    en: "Search",
    group: "navigation",
  },
  {
    slug: "security",
    label: "Безопасность",
    en: "Security",
    group: "application",
  },
  {
    slug: "status",
    label: "Статус сервиса",
    en: "Status",
    group: "data",
  },
  {
    slug: "checklist",
    label: "Чек-лист",
    en: "Checklist",
    group: "application",
  },
  {
    slug: "blog-post",
    label: "Статья блога",
    en: "Blog Post",
    group: "marketing",
  },
  {
    slug: "comments",
    label: "Комментарии",
    en: "Comments",
    group: "application",
  },
  {
    slug: "error",
    label: "Ошибка",
    en: "Error",
    group: "application",
  },
  {
    slug: "logos",
    label: "Партнёры и пресса",
    en: "Logos & press",
    group: "marketing",
  },
  {
    slug: "newsletter",
    label: "Рассылка и лист ожидания",
    en: "Newsletter",
    group: "marketing",
  },
  {
    slug: "process",
    label: "Этапы процесса",
    en: "Process",
    group: "marketing",
  },
  {
    slug: "team",
    label: "Команда",
    en: "Team",
    group: "marketing",
  },
  {
    slug: "maintenance",
    label: "Технические работы",
    en: "Maintenance",
    group: "application",
  },
  {
    slug: "not-found",
    label: "Страница не найдена",
    en: "Not Found",
    group: "application",
  },
  {
    slug: "stacks",
    label: "Стопки карточек",
    en: "Card stacks",
    group: "marketing",
  },
  {
    slug: "cursor",
    label: "Курсоры",
    en: "Cursors",
    group: "application",
  },
  {
    slug: "sketch",
    label: "Рукописный",
    en: "Hand-drawn",
    group: "marketing",
  },
  {
    slug: "cards",
    label: "Карточки",
    en: "Cards",
    group: "marketing",
  },
  {
    slug: "folio",
    label: "Портфолио",
    en: "Portfolio",
    group: "marketing",
    // Рабочий стол и подобные сцены живут во всю ширину: в половинном
    // кадре не видно ни окон, ни таскбара.
    wide: true,
  },
  {
    slug: "text",
    label: "Текстовая анимация",
    en: "Text animation",
    group: "marketing",
    wide: true,
  },
  {
    slug: "background",
    label: "Фон",
    en: "Background",
    group: "marketing",
    // Фон живёт во всю ширину экрана: в половинном кадре от него остаётся
    // угол, по которому не понять ни рисунка, ни движения.
    wide: true,
  },
  {
    slug: "layout",
    label: "Раскладки и бенто",
    en: "Layouts",
    group: "marketing",
    // Раскладка — композиция во всю ширину: bento, стопки, ленты. В половине
    // кадра её геометрия не читается.
    wide: true,
  },
] as const satisfies readonly {
  slug: string
  /** Подпись на витрине. Базовый язык каталога — русский. */
  label: string
  /** Английское имя типа: оно же имя компонента в чужих библиотеках. */
  en: string
  group: ItemGroup
  /**
   * Одна карточка в ряд. Нужна категориям, чей item — строка или абзац во
   * всю ширину: вдвоём в ряду кадр сужается и крупная типографика,
   * ради которой item и берут, читается как мелкий текст.
   */
  wide?: boolean
}[]

export type CategorySlug = (typeof CATEGORIES)[number]["slug"]

/**
 * Категории, с которых начинают. Список категорий длинный — семьдесят
 * штук у компонентов, — и алфавит честно показывает всё, но не помогает
 * тому, кто пришёл за кнопкой или первым экраном. Поэтому наверху колонки
 * стоит короткая подборка, а ниже, за разделителем, идёт весь алфавит.
 *
 * Порядок внутри подборки смысловой, а не алфавитный: сначала то, с чего
 * собирают страницу.
 */
export const POPULAR_CATEGORIES: Record<ItemKind, readonly CategorySlug[]> = {
  block: [
    "hero",
    "pricing",
    "cta",
    "testimonials",
    "faq",
    "footer",
    "contact",
    "auth",
    "blog",
  ],
  component: [
    "button",
    "input",
    "select",
    "card",
    "table",
    "dialog",
    "tabs",
    "badge",
    "avatar",
    "toast",
  ],
  animation: ["background", "text", "cursor", "stacks", "button", "avatar"],
  template: [],
}

