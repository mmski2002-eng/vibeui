import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Avatar006Props = Omit<ComponentProps<"div">, "children"> & {
  name?: string
  src?: string
  label?: string
  hint?: string
  accept?: string
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
  /** Цвет текста. Пусто — берётся из темы окружения, приглушённый выводится из него. */
  textColor?: string
}

// Идея компонента: смена фотографии без единой строки JS. Поле выбора файла
// спрятано, а его роль играет <label>: он уже кликабелен, доступен с
// клавиатуры и объявлен скринридеру как кнопка выбора файла. Подпись
// появляется при наведении и при фокусе — фокус без подсветки бесполезен.
const STYLES = `
:where([data-vibeui-block="avatar-006"]){
--vibeui-avatar-006-size:5rem;
--vibeui-avatar-006-bg:transparent;
--vibeui-avatar-006-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-avatar-006-muted:color-mix(in oklab,var(--vibeui-avatar-006-fg) 68%,transparent);
--vibeui-avatar-006-border:light-dark(oklch(0.9 0.006 265),oklch(0.31 0.01 265));
--vibeui-avatar-006-hue:250;
--vibeui-avatar-006-shape:light-dark(oklch(0.92 0.05 var(--vibeui-avatar-006-hue)),oklch(0.34 0.065 var(--vibeui-avatar-006-hue)));
--vibeui-avatar-006-initials:light-dark(oklch(0.38 0.09 var(--vibeui-avatar-006-hue)),oklch(0.88 0.063 var(--vibeui-avatar-006-hue)));
--vibeui-avatar-006-veil:oklch(0.2 0.02 265 / 62%);
--vibeui-avatar-006-accent:light-dark(oklch(0.55 0.17 265),oklch(0.69 0.17 265));
--vibeui-avatar-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-006"]{
display:flex;align-items:center;gap:0.875rem;
box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-avatar-006-bg);
border:1px solid var(--vibeui-avatar-006-border);border-radius:0.875rem;
color:var(--vibeui-avatar-006-fg);font-family:var(--vibeui-avatar-006-font);
}
[data-vibeui-block="avatar-006"] [data-part="picker"]{
position:relative;display:flex;align-items:center;justify-content:center;flex:none;
width:var(--vibeui-avatar-006-size);height:var(--vibeui-avatar-006-size);
overflow:hidden;border-radius:9999px;cursor:pointer;
background:var(--vibeui-avatar-006-shape);color:var(--vibeui-avatar-006-initials);
font-size:calc(var(--vibeui-avatar-006-size) * 0.32);font-weight:650;line-height:1;user-select:none;
}
[data-vibeui-block="avatar-006"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
/* Плёнка проявляется и на наведении, и на фокусе: с клавиатуры иначе
   непонятно, где находишься. */
[data-vibeui-block="avatar-006"] [data-part="veil"]{
position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
background:var(--vibeui-avatar-006-veil);color:oklch(0.99 0.003 265);
font-size:0.6875rem;font-weight:600;text-align:center;line-height:1.2;
opacity:0;transition:opacity .16s ease;
}
[data-vibeui-block="avatar-006"] [data-part="picker"]:hover [data-part="veil"],
[data-vibeui-block="avatar-006"] input:focus-visible + [data-part="veil"]{opacity:1}
[data-vibeui-block="avatar-006"] [data-part="picker"]:has(input:focus-visible){outline:2px solid var(--vibeui-avatar-006-accent);outline-offset:2px}
/* Поле спрятано, но не выключено: удалять его из потока нельзя — с ним
   исчезнет и фокус. */
[data-vibeui-block="avatar-006"] input{
position:absolute;width:1px;height:1px;opacity:0;
}
[data-vibeui-block="avatar-006"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;min-width:0}
[data-vibeui-block="avatar-006"] [data-part="name"]{font-size:0.9375rem;font-weight:600;line-height:1.2}
[data-vibeui-block="avatar-006"] [data-part="hint"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-avatar-006-muted)}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-006"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-006"] *{animation:none!important;transition:none!important}}
`

// Оттенок из имени: FNV-1a, разложенный по двенадцати ступеням круга.
// Сумма кодов символов не годится — кириллические имена ложатся в один
// розовый сектор; ступени в 30° дают заведомо различимые цвета.
function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Смена фотографии профиля на label и скрытом input — без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar006({
  background = "",
  name = "Анна Реброва",
  src = "",
  label = "Сменить фото",
  hint = "JPG или PNG, квадрат, до 2 МБ",
  accept = "image/png,image/jpeg",
  textColor,
  className,
  style,
  ...props
}: Avatar006Props) {
  const id = useId()
  const palette = {
    "--vibeui-avatar-006-hue": hue(name),
    ...(background
      ? {
          "--vibeui-avatar-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(textColor ? { "--vibeui-avatar-006-fg": textColor } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-006"
        className={className}
        style={palette}
      >
        <label data-part="picker" htmlFor={id}>
          {src ? (
            <img src={src} alt="" loading="lazy" decoding="async" />
          ) : null}
          {src ? null : initials(name)}
          <input id={id} type="file" accept={accept} />
          <span data-part="veil">{label}</span>
        </label>
        <span data-part="text">
          <span data-part="name">{name}</span>
          <span data-part="hint">{hint}</span>
        </span>
      </div>
    </>
  )
}
