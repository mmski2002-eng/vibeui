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
  // Категории мелких компонентов. Появятся вместе с registry/components/*.
  { slug: "buttons", label: "Buttons", group: "application" },
  { slug: "accordion", label: "Accordion", group: "application" },
  { slug: "alert", label: "Alert", group: "application" },
  { slug: "inputs", label: "Inputs", group: "application" },
  { slug: "display", label: "Display", group: "application" },
  { slug: "feedback", label: "Feedback", group: "application" },
  { slug: "navigation", label: "Navigation", group: "navigation" },
  { slug: "tables", label: "Tables", group: "data" },
  { slug: "charts", label: "Charts", group: "data" },
] as const satisfies readonly {
  slug: string
  label: string
  group: ItemGroup
}[]

export type CategorySlug = (typeof CATEGORIES)[number]["slug"]
