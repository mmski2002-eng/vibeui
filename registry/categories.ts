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
  { slug: "template", label: "Шаблоны", plural: "шаблонов" },
] as const

export type ItemKind = (typeof KINDS)[number]["slug"]

export const GROUPS = [
  { slug: "marketing", label: "Marketing" },
  { slug: "application", label: "Application" },
  { slug: "data", label: "Data" },
  { slug: "commerce", label: "Commerce" },
  { slug: "navigation", label: "Navigation" },
] as const

export type ItemGroup = (typeof GROUPS)[number]["slug"]

export const CATEGORIES = [
  { slug: "hero", label: "Hero", group: "marketing" },
  { slug: "navbar", label: "Navbar", group: "navigation" },
  { slug: "features", label: "Features", group: "marketing" },
  { slug: "pricing", label: "Pricing", group: "commerce" },
  { slug: "testimonials", label: "Testimonials", group: "marketing" },
  { slug: "faq", label: "FAQ", group: "marketing" },
  { slug: "cta", label: "CTA", group: "marketing" },
  { slug: "footer", label: "Footer", group: "navigation" },
  { slug: "ai", label: "AI", group: "application" },
  { slug: "dashboard", label: "Dashboard", group: "data" },
  { slug: "commerce", label: "Commerce", group: "commerce" },
  { slug: "auth", label: "Auth", group: "application" },
  { slug: "datagrid", label: "Data Grid", group: "data" },
  { slug: "solutions", label: "Solutions", group: "application" },
  { slug: "blog", label: "Blog", group: "marketing" },
  { slug: "contact", label: "Contact", group: "marketing" },
  // Категории компонентов: одна категория — один тип. Сборных корзин
  // («Inputs», «Display») здесь нет: тип, спрятанный внутри такой корзины,
  // невозможно найти ни в списке категорий, ни по адресу.
  { slug: "accordion", label: "Accordion", group: "application" },
  { slug: "alert", label: "Alert", group: "application" },
  { slug: "alert-dialog", label: "Alert Dialog", group: "application" },
  { slug: "aspect-ratio", label: "Aspect Ratio", group: "application" },
  { slug: "autocomplete", label: "Autocomplete", group: "application" },
  { slug: "avatar", label: "Avatar", group: "application" },
  { slug: "badge", label: "Badge", group: "application" },
  { slug: "banner", label: "Banner", group: "application" },
  { slug: "breadcrumb", label: "Breadcrumb", group: "navigation" },
  { slug: "button", label: "Button", group: "application" },
  { slug: "button-group", label: "Button Group", group: "application" },
  { slug: "calendar", label: "Calendar", group: "data" },
  { slug: "card", label: "Card", group: "application" },
  { slug: "carousel", label: "Carousel", group: "application" },
  { slug: "cascader", label: "Cascader", group: "application" },
  { slug: "chart", label: "Chart", group: "data" },
  { slug: "checkbox", label: "Checkbox", group: "application" },
  { slug: "code-block", label: "Code Block", group: "application" },
  { slug: "collapsible", label: "Collapsible", group: "application" },
  { slug: "combobox", label: "Combobox", group: "application" },
  { slug: "command", label: "Command", group: "navigation" },
  { slug: "context-menu", label: "Context Menu", group: "navigation" },
  { slug: "currency-input", label: "Currency Input", group: "application" },
  { slug: "data-grid", label: "Data Grid", group: "data" },
  { slug: "date-selector", label: "Date Selector", group: "application" },
  { slug: "dialog", label: "Dialog", group: "application" },
  { slug: "drawer", label: "Drawer", group: "application" },
  { slug: "dropdown-menu", label: "Dropdown Menu", group: "navigation" },
  { slug: "empty", label: "Empty", group: "application" },
  { slug: "event-calendar", label: "Event Calendar", group: "data" },
  { slug: "field", label: "Field", group: "application" },
  { slug: "file-upload", label: "File Upload", group: "application" },
  { slug: "filters", label: "Filters", group: "application" },
  { slug: "frame", label: "Frame", group: "application" },
  { slug: "gantt", label: "Gantt", group: "data" },
  { slug: "hover-card", label: "Hover Card", group: "application" },
  { slug: "icon-stack", label: "Icon Stack", group: "application" },
  { slug: "icon-tile", label: "Icon Tile", group: "application" },
  { slug: "input", label: "Input", group: "application" },
  { slug: "input-group", label: "Input Group", group: "application" },
  { slug: "input-otp", label: "Input OTP", group: "application" },
  { slug: "item", label: "Item", group: "application" },
  { slug: "kanban", label: "Kanban", group: "data" },
  { slug: "kbd", label: "Kbd", group: "application" },
  { slug: "label", label: "Label", group: "application" },
  { slug: "menubar", label: "Menubar", group: "navigation" },
  { slug: "native-select", label: "Native Select", group: "application" },
  { slug: "navigation-menu", label: "Navigation Menu", group: "navigation" },
  { slug: "number-field", label: "Number Field", group: "application" },
  { slug: "pagination", label: "Pagination", group: "navigation" },
  { slug: "phone-input", label: "Phone Input", group: "application" },
  { slug: "popover", label: "Popover", group: "application" },
  { slug: "progress", label: "Progress", group: "application" },
  { slug: "radio-group", label: "Radio Group", group: "application" },
  { slug: "range", label: "Range", group: "application" },
  { slug: "rating", label: "Rating", group: "application" },
  { slug: "resizable", label: "Resizable", group: "application" },
  { slug: "scroll-area", label: "Scroll Area", group: "application" },
  { slug: "scrollspy", label: "Scrollspy", group: "navigation" },
  { slug: "select", label: "Select", group: "application" },
  { slug: "separator", label: "Separator", group: "application" },
  { slug: "sheet", label: "Sheet", group: "application" },
  { slug: "sidebar", label: "Sidebar", group: "navigation" },
  { slug: "skeleton", label: "Skeleton", group: "application" },
  { slug: "slider", label: "Slider", group: "application" },
  { slug: "sortable", label: "Sortable", group: "application" },
  { slug: "sparkline", label: "Sparkline", group: "data" },
  { slug: "spinner", label: "Spinner", group: "application" },
  { slug: "stepper", label: "Stepper", group: "navigation" },
  { slug: "switch", label: "Switch", group: "application" },
  { slug: "table", label: "Table", group: "data" },
  { slug: "tabs", label: "Tabs", group: "navigation" },
  { slug: "tags-input", label: "Tags Input", group: "application" },
  { slug: "textarea", label: "Textarea", group: "application" },
  { slug: "timeline", label: "Timeline", group: "data" },
  { slug: "toast", label: "Toast", group: "application" },
  { slug: "toggle", label: "Toggle", group: "application" },
  { slug: "toggle-group", label: "Toggle Group", group: "application" },
  { slug: "tooltip", label: "Tooltip", group: "application" },
  { slug: "tree", label: "Tree", group: "data" },
] as const satisfies readonly {
  slug: string
  label: string
  group: ItemGroup
}[]

export type CategorySlug = (typeof CATEGORIES)[number]["slug"]
