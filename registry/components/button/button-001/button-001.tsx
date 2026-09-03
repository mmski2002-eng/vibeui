import type { ComponentProps, CSSProperties } from "react"

export type Button001Size = "sm" | "md" | "lg"
export type Button001Tone = "solid" | "soft" | "outline"

export type Button001Props = ComponentProps<"button"> & {
  size?: Button001Size
  tone?: Button001Tone
  loading?: boolean
  /** Слово для скринридера, пока идёт загрузка: спиннер ему не виден. */
  loadingLabel?: string
  accent?: string
  accentForeground?: string
}

// Компонент везде выглядит одинаково, поэтому палитра, размеры и keyframes
// живут здесь, а не в globals.css проекта. Объявление переменных обёрнуто
// в :where() — нулевая специфичность, так что inline style пропа accent
// и любой класс пользователя переопределяют значение.
//
// Правила размеров и тонов заданы селекторами по data-атрибутам, а не
// Tailwind-классами: компонент не должен зависеть от версии Tailwind
// в чужом проекте. Базовое правило имеет специфичность (0,1,0), поэтому
// утилиты вроде mt-4 или w-full из className продолжают работать.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте акцент светлее, а подпись на нём — темнее, чтобы заливка
// не выжигала строку.
const STYLES = `
:where([data-vibeui-block="button-001"]){
--vibeui-button-001-accent:light-dark(oklch(0.62 0.187 264),oklch(0.72 0.155 264));
--vibeui-button-001-accent-fg:light-dark(oklch(0.99 0.004 264),oklch(0.21 0.045 264));
--vibeui-button-001-soft-bg:color-mix(in oklab, var(--vibeui-button-001-accent) 14%, transparent);
--vibeui-button-001-soft-bg-hover:color-mix(in oklab, var(--vibeui-button-001-accent) 22%, transparent);
--vibeui-button-001-border:color-mix(in oklab, var(--vibeui-button-001-accent) 45%, transparent);
--vibeui-button-001-ring:color-mix(in oklab, var(--vibeui-button-001-accent) 70%, transparent);
--vibeui-button-001-radius:0.625rem;
--vibeui-button-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-001"]{color-scheme:dark}
[data-vibeui-block="button-001"]{
display:inline-flex;align-items:center;justify-content:center;gap:0.5em;
border:1px solid transparent;border-radius:var(--vibeui-button-001-radius);
font-family:var(--vibeui-button-001-font);font-weight:500;line-height:1;
text-decoration:none;white-space:nowrap;cursor:pointer;-webkit-appearance:none;appearance:none;
transition:background-color .18s ease,border-color .18s ease,color .18s ease,opacity .18s ease;
}
[data-vibeui-block="button-001"]:focus-visible{outline:2px solid var(--vibeui-button-001-ring);outline-offset:2px}
[data-vibeui-block="button-001"]:disabled{cursor:not-allowed;opacity:.55}

[data-vibeui-block="button-001"][data-size="sm"]{height:2rem;padding:0 0.75rem;font-size:0.8125rem}
[data-vibeui-block="button-001"][data-size="md"]{height:2.5rem;padding:0 1.125rem;font-size:0.875rem}
[data-vibeui-block="button-001"][data-size="lg"]{height:3rem;padding:0 1.5rem;font-size:1rem}

[data-vibeui-block="button-001"][data-tone="solid"]{background:var(--vibeui-button-001-accent);color:var(--vibeui-button-001-accent-fg)}
[data-vibeui-block="button-001"][data-tone="solid"]:hover:not(:disabled){background:color-mix(in oklab, var(--vibeui-button-001-accent) 88%, black)}
[data-vibeui-block="button-001"][data-tone="soft"]{background:var(--vibeui-button-001-soft-bg);color:var(--vibeui-button-001-accent)}
[data-vibeui-block="button-001"][data-tone="soft"]:hover:not(:disabled){background:var(--vibeui-button-001-soft-bg-hover)}
[data-vibeui-block="button-001"][data-tone="outline"]{background:transparent;color:var(--vibeui-button-001-accent);border-color:var(--vibeui-button-001-border)}
[data-vibeui-block="button-001"][data-tone="outline"]:hover:not(:disabled){background:var(--vibeui-button-001-soft-bg)}

[data-vibeui-block="button-001"] [data-part="spinner"]{
width:1em;height:1em;flex:none;border-radius:9999px;
border:2px solid currentColor;border-top-color:transparent;
animation:vibeui-button-001-spin .6s linear infinite;
}
@keyframes vibeui-button-001-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="button-001"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Основная кнопка действия. Один файл, ноль зависимостей, собственная
 * палитра — выглядит одинаково в любом проекте независимо от его темы.
 */
export function Button001({
  size = "md",
  tone = "solid",
  loading = false,
  loadingLabel = "Загружаем…",
  accent,
  accentForeground,
  type = "button",
  disabled,
  className,
  style,
  children = "Начать",
  ...props
}: Button001Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-001-accent": accent } : null),
    ...(accentForeground
      ? { "--vibeui-button-001-accent-fg": accentForeground }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-001" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-001"
        data-tone={tone}
        data-size={size}
        // Кнопка в состоянии загрузки не должна принимать повторный клик,
        // а aria-busy сообщает об этом скринридеру.
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={className}
        style={palette}
      >
        {loading ? <span data-part="spinner" aria-hidden="true" /> : null}
        {/* Спиннер скринридеру не виден, поэтому состояние проговаривается
            словом: одного aria-busy на кнопке для этого мало. */}
        <span data-part="sr" aria-live="polite">
          {loading ? loadingLabel : null}
        </span>
        {children}
      </button>
    </>
  )
}
