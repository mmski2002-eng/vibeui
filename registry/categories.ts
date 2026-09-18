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
    label: "Тарифы",
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
    label: "Блог",
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
    label: "Страницы ошибок",
    en: "Error Pages",
    group: "application",
  },
  {
    slug: "about",
    label: "О компании",
    en: "About",
    group: "marketing",
  },
  {
    slug: "cases",
    label: "Кейсы",
    en: "Case Studies",
    group: "marketing",
  },
  {
    slug: "changelog",
    label: "История изменений",
    en: "Changelog",
    group: "marketing",
  },
  {
    slug: "comparison",
    label: "Сравнение",
    en: "Comparison",
    group: "marketing",
  },
  {
    slug: "waitlist",
    label: "Лист ожидания",
    en: "Waitlist",
    group: "marketing",
  },
  {
    slug: "consent",
    label: "Согласия",
    en: "Consent",
    group: "application",
  },
  {
    slug: "downloads",
    label: "Загрузка приложения",
    en: "App Downloads",
    group: "marketing",
  },
  {
    slug: "portfolio",
    label: "Портфолио",
    en: "Portfolio",
    group: "marketing",
  },
  {
    slug: "realty",
    label: "Недвижимость",
    en: "Real estate",
    group: "commerce",
  },
  {
    slug: "restaurant",
    label: "Ресторан",
    en: "Restaurant",
    group: "commerce",
  },
  {
    slug: "bakery",
    label: "Пекарня и кофейня",
    en: "Bakery & café",
    group: "commerce",
  },
  {
    slug: "opensource",
    label: "Open source",
    en: "Open source",
    group: "application",
  },
  {
    slug: "course",
    label: "Онлайн-курс",
    en: "Online course",
    group: "commerce",
  },
  {
    slug: "events",
    label: "События",
    en: "Events",
    group: "marketing",
  },
  {
    slug: "video",
    label: "Видео",
    en: "Video",
    group: "marketing",
  },
  {
    slug: "podcast",
    label: "Подкаст",
    en: "Podcast",
    group: "marketing",
  },
  {
    slug: "press",
    label: "Пресс-кит",
    en: "Press Kit",
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
    label: "Уведомление",
    en: "Alert",
    group: "application",
  },
  {
    slug: "alert-dialog",
    label: "Диалог подтверждения",
    en: "Alert Dialog",
    group: "application",
  },
  {
    slug: "aspect-ratio",
    label: "Пропорции кадра",
    en: "Aspect Ratio",
    group: "application",
  },
  {
    slug: "autocomplete",
    label: "Автодополнение",
    en: "Autocomplete",
    group: "application",
  },
  {
    slug: "avatar",
    label: "Аватар",
    en: "Avatar",
    group: "application",
  },
  {
    slug: "badge",
    label: "Плашка",
    en: "Badge",
    group: "application",
  },
  {
    slug: "banner",
    label: "Баннер",
    en: "Banner",
    group: "application",
  },
  {
    slug: "breadcrumb",
    label: "Хлебные крошки",
    en: "Breadcrumb",
    group: "navigation",
  },
  {
    slug: "button",
    label: "Кнопка",
    en: "Button",
    group: "application",
  },
  {
    slug: "button-group",
    label: "Группа кнопок",
    en: "Button Group",
    group: "application",
  },
  {
    slug: "calendar",
    label: "Календарь",
    en: "Calendar",
    group: "data",
  },
  {
    slug: "card",
    label: "Карточка",
    en: "Card",
    group: "application",
  },
  {
    slug: "carousel",
    label: "Карусель",
    en: "Carousel",
    group: "application",
  },
  {
    slug: "cascader",
    label: "Каскадный выбор",
    en: "Cascader",
    group: "application",
  },
  {
    slug: "chart",
    label: "График",
    en: "Chart",
    group: "data",
  },
  {
    slug: "checkbox",
    label: "Флажок",
    en: "Checkbox",
    group: "application",
  },
  {
    slug: "code-block",
    label: "Блок кода",
    en: "Code Block",
    group: "application",
  },
  {
    slug: "collapsible",
    label: "Сворачиваемый блок",
    en: "Collapsible",
    group: "application",
  },
  {
    slug: "combobox",
    label: "Поле с подсказками",
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
    slug: "context-menu",
    label: "Контекстное меню",
    en: "Context Menu",
    group: "navigation",
  },
  {
    slug: "currency-input",
    label: "Поле суммы",
    en: "Currency Input",
    group: "application",
  },
  {
    slug: "date-selector",
    label: "Выбор даты",
    en: "Date Selector",
    group: "application",
  },
  {
    slug: "dialog",
    label: "Диалог",
    en: "Dialog",
    group: "application",
  },
  {
    slug: "drawer",
    label: "Выдвижная панель",
    en: "Drawer",
    group: "application",
  },
  {
    slug: "dropdown-menu",
    label: "Выпадающее меню",
    en: "Dropdown Menu",
    group: "navigation",
  },
  {
    slug: "empty",
    label: "Пустое состояние",
    en: "Empty",
    group: "application",
  },
  {
    slug: "event-calendar",
    label: "Календарь событий",
    en: "Event Calendar",
    group: "data",
  },
  {
    slug: "field",
    label: "Поле формы",
    en: "Field",
    group: "application",
  },
  {
    slug: "file-upload",
    label: "Загрузка файлов",
    en: "File Upload",
    group: "application",
  },
  {
    slug: "filters",
    label: "Фильтры",
    en: "Filters",
    group: "application",
  },
  {
    slug: "frame",
    label: "Рамка",
    en: "Frame",
    group: "application",
  },
  {
    slug: "hover-card",
    label: "Карточка по наведению",
    en: "Hover Card",
    group: "application",
  },
  {
    slug: "icon-stack",
    label: "Стопка иконок",
    en: "Icon Stack",
    group: "application",
  },
  {
    slug: "icon-tile",
    label: "Плитка с иконкой",
    en: "Icon Tile",
    group: "application",
  },
  {
    slug: "input",
    label: "Поле ввода",
    en: "Input",
    group: "application",
  },
  {
    slug: "input-group",
    label: "Группа полей",
    en: "Input Group",
    group: "application",
  },
  {
    slug: "input-otp",
    label: "Ввод кода",
    en: "Input OTP",
    group: "application",
  },
  {
    slug: "item",
    label: "Строка списка",
    en: "Item",
    group: "application",
  },
  {
    slug: "kanban",
    label: "Канбан-доска",
    en: "Kanban",
    group: "data",
  },
  {
    slug: "kbd",
    label: "Клавиша",
    en: "Kbd",
    group: "application",
  },
  {
    slug: "label",
    label: "Подпись поля",
    en: "Label",
    group: "application",
  },
  {
    slug: "mockup",
    label: "Мокап устройства",
    en: "Device Mockup",
    group: "marketing",
  },
  {
    slug: "native-select",
    label: "Нативный список",
    en: "Native Select",
    group: "application",
  },
  {
    slug: "navigation-menu",
    label: "Меню навигации",
    en: "Navigation Menu",
    group: "navigation",
  },
  {
    slug: "number-field",
    label: "Числовое поле",
    en: "Number Field",
    group: "application",
  },
  {
    slug: "pagination",
    label: "Постраничная навигация",
    en: "Pagination",
    group: "navigation",
  },
  {
    slug: "phone-input",
    label: "Поле телефона",
    en: "Phone Input",
    group: "application",
  },
  {
    slug: "popover",
    label: "Всплывающая панель",
    en: "Popover",
    group: "application",
  },
  {
    slug: "progress",
    label: "Индикатор прогресса",
    en: "Progress",
    group: "application",
  },
  {
    slug: "radio-group",
    label: "Переключатели",
    en: "Radio Group",
    group: "application",
  },
  {
    slug: "range",
    label: "Диапазон",
    en: "Range",
    group: "application",
  },
  {
    slug: "rating",
    label: "Оценка",
    en: "Rating",
    group: "application",
  },
  {
    slug: "scroll-area",
    label: "Область прокрутки",
    en: "Scroll Area",
    group: "application",
  },
  {
    slug: "scrollspy",
    label: "Навигация по прокрутке",
    en: "Scrollspy",
    group: "navigation",
  },
  {
    slug: "select",
    label: "Список выбора",
    en: "Select",
    group: "application",
  },
  {
    slug: "separator",
    label: "Разделитель",
    en: "Separator",
    group: "application",
  },
  {
    slug: "sidebar",
    label: "Боковое меню",
    en: "Sidebar",
    group: "navigation",
  },
  {
    slug: "skeleton",
    label: "Скелетон загрузки",
    en: "Skeleton",
    group: "application",
  },
  {
    slug: "slider",
    label: "Ползунок",
    en: "Slider",
    group: "application",
  },
  {
    slug: "sortable",
    label: "Перетаскивание",
    en: "Sortable",
    group: "application",
  },
  {
    slug: "sparkline",
    label: "Спарклайн",
    en: "Sparkline",
    group: "data",
  },
  {
    slug: "spinner",
    label: "Индикатор ожидания",
    en: "Spinner",
    group: "application",
  },
  {
    slug: "stepper",
    label: "Шаги",
    en: "Stepper",
    group: "navigation",
  },
  {
    slug: "switch",
    label: "Переключатель",
    en: "Switch",
    group: "application",
  },
  {
    slug: "table",
    label: "Таблица",
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
    slug: "tags-input",
    label: "Ввод тегов",
    en: "Tags Input",
    group: "application",
  },
  {
    slug: "textarea",
    label: "Многострочное поле",
    en: "Textarea",
    group: "application",
  },
  {
    slug: "timeline",
    label: "Лента событий",
    en: "Timeline",
    group: "data",
  },
  {
    slug: "toast",
    label: "Всплывающее сообщение",
    en: "Toast",
    group: "application",
  },
  {
    slug: "toggle",
    label: "Кнопка-переключатель",
    en: "Toggle",
    group: "application",
  },
  {
    slug: "toggle-group",
    label: "Группа переключателей",
    en: "Toggle Group",
    group: "application",
  },
  {
    slug: "tooltip",
    label: "Подсказка",
    en: "Tooltip",
    group: "application",
  },
  {
    slug: "tree",
    label: "Дерево",
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
    slug: "api",
    label: "API",
    en: "API",
    group: "application",
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
    slug: "bento",
    label: "Бенто-сетка",
    en: "Bento",
    group: "marketing",
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
    label: "Логотипы клиентов",
    en: "Logos",
    group: "marketing",
  },
  {
    slug: "newsletter",
    label: "Рассылка",
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
    slug: "stats",
    label: "Статистика",
    en: "Stats",
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
    label: "Раскладки",
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

