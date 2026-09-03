import type { CSSProperties } from "react"

export type Dialog008Person = {
  name: string
  role: string
}

export type Dialog008Props = {
  id?: string
  trigger?: string
  title?: string
  link?: string
  /** Кто уже имеет доступ: показывается списком инициалов. */
  people?: Dialog008Person[]
  /** Подпись поля со ссылкой для скринридера. */
  linkLabel?: string
  accessLabel?: string
  copyLabel?: string
  doneLabel?: string
  /** Подложка окна. Пусто — цвет из палитры компонента. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: окно «поделиться». Ссылка стоит первой в поле только для
// чтения — её видно целиком и можно выделить, а рядом кнопка копирования; под
// ней список тех, у кого доступ уже есть: прежде чем звать нового, человек
// проверяет, кто там. Цвет инициалов выводится из имени, как в аватаре,
// поэтому один участник всегда одного цвета. Компонент остаётся серверным:
// копирование вешает вызывающий код.
const STYLES = `
:where([data-vibeui-block="dialog-008"]){
--vibeui-dialog-008-fg:light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265));
--vibeui-dialog-008-muted:color-mix(in oklab,var(--vibeui-dialog-008-fg) 68%,transparent);
--vibeui-dialog-008-bg:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-dialog-008-panel:light-dark(oklch(0.975 0.003 265),oklch(0.3 0.008 265));
--vibeui-dialog-008-border:light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265));
--vibeui-dialog-008-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-dialog-008-radius:1rem;
--vibeui-dialog-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-dialog-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dialog-008"]{color-scheme:dark}
[data-vibeui-block="dialog-008"]{display:inline-flex;font-family:var(--vibeui-dialog-008-font)}
[data-vibeui-block="dialog-008"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:500;
display:inline-flex;align-items:center;height:2.25rem;padding:0 0.9375rem;
border:1px solid var(--vibeui-dialog-008-border);border-radius:0.5rem;
background:var(--vibeui-dialog-008-bg);color:var(--vibeui-dialog-008-fg);
}
[data-vibeui-block="dialog-008"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-008-border) 30%,transparent)}
[data-vibeui-block="dialog-008"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dialog-008-accent);outline-offset:2px}
[data-vibeui-dialog-008-window]{
position:fixed;inset:0;margin:auto;height:fit-content;
width:min(27rem,calc(100vw - 2rem));box-sizing:border-box;padding:1.375rem;
border:1px solid var(--vibeui-dialog-008-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)));
border-radius:var(--vibeui-dialog-008-radius,1rem);
background:var(--vibeui-dialog-008-bg,light-dark(oklch(1 0 0),oklch(0.24 0.012 265)));
color:var(--vibeui-dialog-008-fg,light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265)));
font-family:var(--vibeui-dialog-008-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:scale(0.97);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-008-window]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-008-window]:popover-open{opacity:0;transform:scale(0.97)}}
[data-vibeui-dialog-008-window]::backdrop{background:oklch(0.18 0.02 265 / 45%)}
[data-vibeui-dialog-008-window] [data-part="title"]{margin:0 0 0.875rem;font-size:1.0625rem;font-weight:620;line-height:1.35}
[data-vibeui-dialog-008-window] [data-part="row"]{display:flex;gap:0.5rem}
[data-vibeui-dialog-008-window] input{
flex:1 1 auto;min-width:0;box-sizing:border-box;margin:0;height:2.375rem;padding:0 0.75rem;
border:1px solid var(--vibeui-dialog-008-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)));
border-radius:0.5rem;background:var(--vibeui-dialog-008-panel,light-dark(oklch(0.975 0.003 265),oklch(0.3 0.008 265)));
color:inherit;font-family:var(--vibeui-dialog-008-mono,ui-monospace,monospace);font-size:0.8125rem;
}
[data-vibeui-dialog-008-window] input:focus{
outline:none;border-color:var(--vibeui-dialog-008-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-dialog-008-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262))) 20%,transparent);
}
[data-vibeui-dialog-008-window] [data-part="copy"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:600;flex:none;
display:inline-flex;align-items:center;min-height:2.375rem;padding:0.3125rem 0.875rem;
border:0;border-radius:0.5rem;
background:var(--vibeui-dialog-008-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));color:light-dark(oklch(1 0 0),oklch(0.17 0.02 265));
}
[data-vibeui-dialog-008-window] [data-part="copy"]:hover{filter:brightness(0.94)}
[data-vibeui-dialog-008-window] [data-part="access"]{
margin:1.125rem 0 0.5rem;font-size:0.75rem;font-weight:650;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-dialog-008-muted,light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265)));
}
[data-vibeui-dialog-008-window] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-dialog-008-window] li{display:flex;align-items:center;gap:0.625rem;font-size:0.875rem}
[data-vibeui-dialog-008-window] [data-part="avatar"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:light-dark(oklch(0.92 0.05 var(--vibeui-dialog-008-hue,250)),oklch(0.34 0.065 var(--vibeui-dialog-008-hue,250)));
color:light-dark(oklch(0.38 0.09 var(--vibeui-dialog-008-hue,250)),oklch(0.88 0.063 var(--vibeui-dialog-008-hue,250)));
font-size:0.6875rem;font-weight:650;
}
[data-vibeui-dialog-008-window] [data-part="role"]{margin-left:auto;font-size:0.75rem;color:var(--vibeui-dialog-008-muted,light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265)))}
[data-vibeui-dialog-008-window] [data-part="actions"]{display:flex;justify-content:flex-end;margin-top:1.25rem}
[data-vibeui-dialog-008-window] [data-part="done"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:600;
display:inline-flex;align-items:center;height:2.25rem;padding:0 1rem;
border-radius:0.5rem;background:transparent;color:inherit;
border:1px solid var(--vibeui-dialog-008-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)));
}
[data-vibeui-dialog-008-window] :focus-visible{outline:2px solid var(--vibeui-dialog-008-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));outline-offset:2px}
/* Popover страницу не блокирует: фон под окном иначе продолжает прокручиваться. */
html:has([data-vibeui-dialog-008-window]:popover-open){overflow:hidden}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-008"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-008-window]{transition:none!important;opacity:1;transform:none}
}
`

const DEFAULT_PEOPLE: Dialog008Person[] = [
  { name: "Анна Ковалёва", role: "Редактор" },
  { name: "Дмитрий Орлов", role: "Читатель" },
  { name: "Сергей Мохов", role: "Владелец" },
]

function hueOf(name: string): number {
  let sum = 0

  for (let index = 0; index < name.length; index += 1) {
    sum = (sum + name.charCodeAt(index) * (index + 1)) % 360
  }

  return sum
}

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

/**
 * Ветка темы для заданной подложки. Без неё светлый фон достался бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Окно «поделиться»: ссылка, копирование и список тех, у кого есть доступ.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog008({
  id = "vibeui-dialog-008",
  trigger = "Поделиться",
  title = "Доступ к проекту",
  link = "https://vibeui.ru/p/studio-polet",
  people = DEFAULT_PEOPLE,
  linkLabel = "Ссылка на проект",
  accessLabel = "Уже есть доступ",
  copyLabel = "Копировать",
  doneLabel = "Готово",
  background = "",
  accent,
  className,
  style,
}: Dialog008Props) {
  const palette = {
    ...(accent ? { "--vibeui-dialog-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dialog-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dialog-008" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="dialog"
        data-vibeui-block="dialog-008"
        className={className}
        style={palette}
      >
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        <div
          id={id}
          popover="auto"
          data-vibeui-dialog-008-window=""
          role="dialog"
          aria-labelledby={`${id}-title`}
          style={palette}
        >
          <h2 data-part="title" id={`${id}-title`}>
            {title}
          </h2>
          <div data-part="row">
            <input type="text" value={link} readOnly aria-label={linkLabel} />
            <button data-part="copy" type="button">
              {copyLabel}
            </button>
          </div>
          <p data-part="access">{accessLabel}</p>
          <ul>
            {people.map((person) => (
              <li key={person.name}>
                <span
                  data-part="avatar"
                  aria-hidden="true"
                  style={
                    {
                      "--vibeui-dialog-008-hue": hueOf(person.name),
                    } as CSSProperties
                  }
                >
                  {initialsOf(person.name)}
                </span>
                {person.name}
                <span data-part="role">{person.role}</span>
              </li>
            ))}
          </ul>
          <div data-part="actions">
            <button data-part="done" type="button" popoverTarget={id} autoFocus>
              {doneLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
