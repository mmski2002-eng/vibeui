import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ReactElement,
} from "react"

export type Icontile016Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children"
> & {
  label?: string
  description?: string
  hotkey?: string[]
  hotkeyAriaLabel?: string
  icon?: "search" | "add" | "command"
  tone?: "neutral" | "accent" | "success" | "warning" | "danger"
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.2" y2="16.2" />
    </svg>
  )
}

function AddIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function CommandIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 4a2 2 0 1 1 2 2H6a2 2 0 1 1 2-2Z" />
      <path d="M8 20a2 2 0 1 0 2-2H6a2 2 0 1 0 2 2Z" />
      <path d="M16 4a2 2 0 1 0-2 2h4a2 2 0 1 0-2-2Z" />
      <path d="M16 20a2 2 0 1 1-2-2h4a2 2 0 1 1-2 2Z" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
    </svg>
  )
}

const ICONS: Record<
  NonNullable<Icontile016Props["icon"]>,
  () => ReactElement
> = {
  search: SearchIcon,
  add: AddIcon,
  command: CommandIcon,
}

// Идея компонента: горячая клавиша дублируется дважды — визуальной плашкой
// в углу плитки и атрибутом aria-keyshortcuts на самой кнопке. Плашка
// помечена aria-hidden целиком, потому что для скринридера сочетание уже
// объявлено стандартным атрибутом, и повторное прочтение символов вроде «⌘»
// по буквам было бы шумом поверх осмысленного названия действия.
const STYLES = `
:where([data-vibeui-block="icontile-016"]){
container-type:inline-size;
--vibeui-icontile-016-hue:262;
--vibeui-icontile-016-chroma:0.05;
--vibeui-icontile-016-fg:oklch(0.26 0.014 265);
--vibeui-icontile-016-muted:oklch(0.52 0.014 265);
--vibeui-icontile-016-border:oklch(0.88 0.006 265);
--vibeui-icontile-016-surface:oklch(1 0 0);
--vibeui-icontile-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="icontile-016"]{
position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:0.625rem;
box-sizing:border-box;width:100%;padding:0.875rem 1rem;
background:var(--vibeui-icontile-016-surface);
border:1px solid var(--vibeui-icontile-016-border);border-radius:0.875rem;
font:inherit;font-family:var(--vibeui-icontile-016-font);color:inherit;text-align:left;cursor:pointer;
transition:border-color 0.15s ease;
}
[data-vibeui-block="icontile-016"]:hover{
border-color:oklch(0.75 0.05 var(--vibeui-icontile-016-hue));
}
[data-vibeui-block="icontile-016"]:focus-visible{
outline:2px solid oklch(0.55 0.18 var(--vibeui-icontile-016-hue));outline-offset:2px;
}
[data-vibeui-block="icontile-016"] [data-part="icon"]{
display:grid;place-items:center;flex:none;width:2.25rem;height:2.25rem;
border-radius:0.625rem;
background:oklch(0.93 var(--vibeui-icontile-016-chroma) var(--vibeui-icontile-016-hue));
color:oklch(0.42 calc(var(--vibeui-icontile-016-chroma) * 4) var(--vibeui-icontile-016-hue));
}
[data-vibeui-block="icontile-016"] [data-part="icon"] > svg{width:55%;height:55%}
[data-vibeui-block="icontile-016"] [data-part="hotkey"]{
position:absolute;top:0.75rem;right:0.75rem;display:flex;gap:0.1875rem;
}
[data-vibeui-block="icontile-016"] [data-part="key"]{
display:grid;place-items:center;min-width:1.25rem;height:1.25rem;padding:0 0.3125rem;
box-sizing:border-box;border-radius:0.375rem;border:1px solid var(--vibeui-icontile-016-border);
background:oklch(0.97 0.006 265);
font-family:inherit;font-size:0.6875rem;font-weight:650;line-height:1;
color:var(--vibeui-icontile-016-muted);
}
[data-vibeui-block="icontile-016"] [data-part="title"]{
display:block;margin:0;max-width:100%;font-size:0.9375rem;font-weight:650;
color:var(--vibeui-icontile-016-fg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-016"] [data-part="description"]{
display:block;margin:0;max-width:100%;font-size:0.8125rem;
color:var(--vibeui-icontile-016-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-016"][data-tone="neutral"]{--vibeui-icontile-016-chroma:0.015}
[data-vibeui-block="icontile-016"][data-tone="success"]{--vibeui-icontile-016-hue:152}
[data-vibeui-block="icontile-016"][data-tone="warning"]{--vibeui-icontile-016-hue:75}
[data-vibeui-block="icontile-016"][data-tone="danger"]{--vibeui-icontile-016-hue:25}
@container (max-width: 220px){
[data-vibeui-block="icontile-016"] [data-part="description"]{display:none}
}
@media (prefers-reduced-motion: reduce){
[data-vibeui-block="icontile-016"]{transition:none}
}
`

/**
 * Плитка-действие с горячей клавишей: сочетание показано плашкой в углу и
 * продублировано атрибутом aria-keyshortcuts на кнопке.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Icontile016({
  label = "Быстрый поиск",
  description = "Найти команду или файл",
  hotkey = ["⌘", "K"],
  hotkeyAriaLabel = "Meta+K",
  icon = "search",
  tone = "accent",
  className,
  style,
  type,
  ...props
}: Icontile016Props) {
  const Icon = ICONS[icon]

  return (
    <>
      <style href="vibeui-icontile-016" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type ?? "button"}
        data-vibeui-block="icontile-016"
        data-tone={tone}
        aria-keyshortcuts={hotkeyAriaLabel}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="icon" aria-hidden="true">
          <Icon />
        </span>
        <span data-part="hotkey" aria-hidden="true">
          {hotkey.map((key, index) => (
            <kbd key={`${key}-${index}`} data-part="key">
              {key}
            </kbd>
          ))}
        </span>
        <span data-part="title">{label}</span>
        {description && <span data-part="description">{description}</span>}
      </button>
    </>
  )
}
