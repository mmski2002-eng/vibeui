import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Phoneinput001Country = {
  flag: string
  code: string
  name: string
}

export type Phoneinput001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  placeholder?: string
  countries?: Phoneinput001Country[]
  /** Подпись списка кодов для озвучки: компонент несёт русскую. */
  codeLabel?: string
  /** Строка под полем. */
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: код страны и номер — два разных значения, поэтому это
// два поля, сросшихся в одну рамку. Код выбирается нативным select: на
// телефоне откроется системное колесо, а не самодельный список, который
// не помещается на экран. Флаг — эмодзи в тексте пункта: ни спрайтов,
// ни картинок, ни зависимости от иконочного пакета.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="phoneinput-001"]){
--vibeui-phoneinput-001-surface:transparent;
--vibeui-phoneinput-001-surface-border:light-dark(oklch(0.91 0.006 265),oklch(0.33 0.012 265));
--vibeui-phoneinput-001-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.005 265));
--vibeui-phoneinput-001-muted:light-dark(oklch(0.54 0.014 265),oklch(0.7 0.012 265));
--vibeui-phoneinput-001-field-border:light-dark(oklch(0.85 0.01 265),oklch(0.4 0.014 265));
--vibeui-phoneinput-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-phoneinput-001-radius:0.625rem;
--vibeui-phoneinput-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="phoneinput-001"]{
box-sizing:border-box;width:100%;max-width:22rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-phoneinput-001-surface);
border:1px solid var(--vibeui-phoneinput-001-surface-border);
font-family:var(--vibeui-phoneinput-001-font);color:var(--vibeui-phoneinput-001-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="phoneinput-001"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
/* Рамка одна на два поля: у самих полей её нет, а фокус подсвечивает
   всю пару через :has() — иначе половина рамки светится, половина нет. */
[data-vibeui-block="phoneinput-001"] [data-part="group"]{
display:flex;align-items:stretch;
border:1px solid var(--vibeui-phoneinput-001-field-border);
border-radius:var(--vibeui-phoneinput-001-radius);
background:var(--vibeui-phoneinput-001-surface);overflow:hidden;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="phoneinput-001"] [data-part="group"]:has(:focus-visible){
border-color:var(--vibeui-phoneinput-001-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-phoneinput-001-accent) 22%,transparent);
}
[data-vibeui-block="phoneinput-001"] [data-part="code"]{position:relative;display:flex;flex:none}
[data-vibeui-block="phoneinput-001"] select{
appearance:none;-webkit-appearance:none;
box-sizing:border-box;height:2.5rem;
padding:0 1.5rem 0 0.75rem;
font:inherit;font-size:0.9375rem;line-height:1.2;
color:var(--vibeui-phoneinput-001-fg);background:transparent;
border:0;border-right:1px solid var(--vibeui-phoneinput-001-field-border);
cursor:pointer;outline:none;
}
[data-vibeui-block="phoneinput-001"] [data-part="arrow"]{
position:absolute;right:0.5rem;top:50%;pointer-events:none;
width:0.3125rem;height:0.3125rem;
border-right:1.5px solid var(--vibeui-phoneinput-001-muted);
border-bottom:1.5px solid var(--vibeui-phoneinput-001-muted);
translate:0 -0.1875rem;rotate:45deg;
}
[data-vibeui-block="phoneinput-001"] input{
box-sizing:border-box;width:100%;height:2.5rem;
padding:0 0.75rem;min-width:0;
font:inherit;font-size:0.9375rem;letter-spacing:0.01em;
color:var(--vibeui-phoneinput-001-fg);background:transparent;
border:0;outline:none;
}
[data-vibeui-block="phoneinput-001"] input::placeholder{color:var(--vibeui-phoneinput-001-muted)}
[data-vibeui-block="phoneinput-001"] [data-part="hint"]{
margin:0;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-phoneinput-001-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="phoneinput-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Телефон с кодом страны в нативном списке и флагом-эмодзи: код и номер —
 * два поля в одной рамке. Один файл, ноль зависимостей.
 */
export function Phoneinput001({
  label = "Телефон",
  placeholder = "999 123-45-67",
  countries = [
    { flag: "🇷🇺", code: "+7", name: "Россия" },
    { flag: "🇰🇿", code: "+7", name: "Казахстан" },
    { flag: "🇧🇾", code: "+375", name: "Беларусь" },
    { flag: "🇬🇪", code: "+995", name: "Грузия" },
    { flag: "🇷🇸", code: "+381", name: "Сербия" },
  ],
  codeLabel = "Код страны",
  hint = "Номер можно вставить из буфера в любом виде — разберём сами.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Phoneinput001Props) {
  const id = useId()
  const codeId = `${id}-code`
  const hintId = `${id}-hint`
  const palette = {
    ...(accent ? { "--vibeui-phoneinput-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-phoneinput-001-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-phoneinput-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="phoneinput-001"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <span data-part="code">
            <select
              id={codeId}
              name="country"
              aria-label={codeLabel}
              defaultValue={countries[0]?.name}
            >
              {countries.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.flag} {country.code}
                </option>
              ))}
            </select>
            <span data-part="arrow" aria-hidden="true" />
          </span>
          <input
            id={id}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={placeholder}
            aria-describedby={hintId}
          />
        </div>
        <p data-part="hint" id={hintId}>
          {hint}
        </p>
      </div>
    </>
  )
}
