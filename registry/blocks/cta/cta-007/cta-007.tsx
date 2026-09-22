import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"

export type Cta007Props = {
  eyebrow?: string
  title?: string
  description?: string
  emailLabel?: string
  placeholder?: string
  submitLabel?: string
  note?: string
  action?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Призыв с формой почты в одну строку: поле и оранжевая кнопка склеены в
// одну капсулу. Подпись поля скрыта визуально, но связана через htmlFor —
// в однострочной форме видимая подпись сломала бы капсулу, а без связи
// скринридер прочитал бы «поле ввода» без объяснения.
const STYLES = `[data-vibeui-block="cta-007"] [data-part="heading"]{margin-bottom:1.75rem}

:where([data-vibeui-block="cta-007"]){
--vibeui-cta-007-bg:transparent;
--vibeui-cta-007-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-cta-007-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-cta-007-border:light-dark(oklch(0.88 0 0),oklch(0.34 0 0));
--vibeui-cta-007-field:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-cta-007-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-cta-007-button:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-cta-007-button-ink:oklch(from var(--vibeui-cta-007-button) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cta-007-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-007"]{color-scheme:dark}
[data-vibeui-block="cta-007"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-cta-007-bg);color:var(--vibeui-cta-007-ink);
font-family:var(--vibeui-cta-007-font);
}
[data-vibeui-block="cta-007"] [data-part="shell"]{
max-width:44rem;margin:0 auto;padding:3rem 1.25rem;text-align:center;
}
[data-vibeui-block="cta-007"] [data-part="form"]{
display:grid;gap:0.625rem;max-width:30rem;margin:0 auto;
}
[data-vibeui-block="cta-007"] [data-part="form"] > [data-vibeui-block="input-001"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="cta-007"] [data-part="form"] > [data-vibeui-block="button-001"]{align-self:center}
[data-vibeui-block="cta-007"] [data-part="footnote"]{
margin:1rem auto 0;max-width:46ch;
color:var(--vibeui-cta-007-muted);font-size:0.8125rem;line-height:1.5;
}
@container (min-width: 34rem){
[data-vibeui-block="cta-007"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="cta-007"] [data-part="form"]{grid-template-columns:1fr auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Центрированный призыв с формой почты в одну строку и оранжевой кнопкой. */
export function Cta007({
  eyebrow = "Ранний доступ",
  title = "Оставьте почту — пришлём доступ к каталогу",
  description = "Одно письмо со ссылкой на полный каталог секций и инструкцией, как отдать их вашему AI-агенту. Без цепочек прогрева.",
  emailLabel = "Электронная почта",
  submitLabel = "Получить доступ",
  note = "Никакого спама: одно письмо, отписка не понадобится.",
  action = "#subscribe",
  background = "",
  accent,
  className,
  style,
}: Cta007Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-cta-007-accent": accent,
          "--vibeui-cta-007-button": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-cta-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-007"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            lede={description}
            align="center"
            ledeWidth={46}
            accent={accent}
          />
          <form data-part="form" action={action} method="post">
            <Input001 type="email" name="email" required label={emailLabel} autoComplete="email" accent={accent} />
            <Button001 type="submit" size="lg" accent={accent}>
              {submitLabel}
            </Button001>
          </form>
          <p data-part="footnote">{note}</p>
        </div>
      </section>
    </>
  )
}
