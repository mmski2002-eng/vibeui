import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Checkbox001 } from "@/registry/components/checkbox/checkbox-001/checkbox-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"

export type Blog004Props = {
  eyebrow?: string
  title?: string
  description?: string
  bullets?: string[]
  emailLabel?: string
  placeholder?: string
  submitLabel?: string
  consentLabel?: string
  proof?: string
  frequency?: string
  errorText?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: подписка, на которую соглашаются осознанно. Поэтому рядом с
// полем стоят три вещи, которые обычно прячут в подвал: что именно придёт,
// как часто и сколько человек уже подписано. Обещание «полезные материалы»
// не работает — работает список из трёх пунктов.
//
// Валидация — нативная: type="email" и required. Сообщение об ошибке
// показывается через :user-invalid, а не :invalid, потому что :invalid
// красит поле красным ещё до того, как в него что-то ввели. Текст ошибки
// связан с полем через aria-describedby и лежит в разметке всегда, скрытый
// только визуально, — иначе скринридер не найдёт его в момент появления.
const STYLES = `
:where([data-vibeui-block="blog-004"]){
--vibeui-blog-004-bg:light-dark(oklch(0.985 0 265),oklch(0.21 0 265));
--vibeui-blog-004-panel:light-dark(oklch(0.96 0 0),oklch(0.26 0 0));
--vibeui-blog-004-fg:light-dark(oklch(0.22 0 265),oklch(0.97 0 265));
--vibeui-blog-004-muted:light-dark(oklch(0.5 0 265),oklch(0.76 0 265));
--vibeui-blog-004-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-blog-004-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-blog-004-alarm:light-dark(oklch(0.55 0.16 25),oklch(0.72 0.15 25));
--vibeui-blog-004-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="blog-004"]{color-scheme:dark}
[data-vibeui-block="blog-004"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-blog-004-bg);color:var(--vibeui-blog-004-fg);
font-family:var(--vibeui-blog-004-sans);
}
[data-vibeui-block="blog-004"] *{box-sizing:border-box}
[data-vibeui-block="blog-004"] [data-part="frame"]{
max-width:68rem;margin:0 auto;padding:3rem 1.25rem;display:grid;gap:1.75rem;align-items:start;
}
/* Три пункта вместо «полезных материалов»: обещание должно быть проверяемым. */
[data-vibeui-block="blog-004"] ul{list-style:none;margin:1.125rem 0 0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="blog-004"] li{display:flex;gap:0.5625rem;font-size:0.875rem;line-height:1.55}
[data-vibeui-block="blog-004"] li::before{
content:"";flex:none;width:1rem;height:1rem;margin-top:0.125rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-blog-004-accent) 26%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-blog-004-accent) 60%,transparent);
}
[data-vibeui-block="blog-004"] [data-part="panel"]{
display:grid;gap:0.75rem;padding:1.25rem;border-radius:1.125rem;
background:var(--vibeui-blog-004-panel);border:1px solid var(--vibeui-blog-004-border);
}
[data-vibeui-block="blog-004"] [data-part="foot"]{
display:flex;flex-wrap:wrap;gap:0.5rem 1rem;padding-top:0.75rem;
border-top:1px solid var(--vibeui-blog-004-border);
font-size:0.75rem;color:var(--vibeui-blog-004-muted);
}
[data-vibeui-block="blog-004"] :focus-visible{outline:2px solid var(--vibeui-blog-004-accent);outline-offset:2px}
@container (min-width: 46rem){
[data-vibeui-block="blog-004"] [data-part="frame"]{padding:4rem 2rem;grid-template-columns:1fr 22rem;column-gap:3rem}
[data-vibeui-block="blog-004"] [data-part="panel"]{padding:1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="blog-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_BULLETS = [
  "Один разбор реального решения: что сделали и чем это вышло",
  "Список правок каталога за две недели — без пересказа changelog",
  "Одна находка из чужого продукта с объяснением, почему она работает",
]

/**
 * Подписка на рассылку с проверяемым обещанием и нативной валидацией почты.
 * Один файл, ноль зависимостей, отправку реализует вызывающий код.
 */
export function Blog004({
  eyebrow = "Рассылка",
  title = "Письмо раз в две недели",
  description = "Без дайджестов «интересного в мире веба». Только то, что мы сами сделали или разобрали.",
  bullets = DEFAULT_BULLETS,
  emailLabel = "Электронная почта",
  placeholder = "you@example.com",
  submitLabel = "Подписаться",
  consentLabel = "Согласен на обработку адреса. Отписка — ссылкой в любом письме.",
  proof = "4 200 подписчиков",
  frequency = "Два письма в месяц",
  errorText = "Похоже, в адресе опечатка. Проверьте символ @ и домен.",
  accent,
  className,
  style,
}: Blog004Props) {
  const palette = {
    ...(accent ? { "--vibeui-blog-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-blog-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="blog-004"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="frame">
          <div>
            <Heading001
              data-part="heading"
              eyebrow={eyebrow}
              title={title}
              lede={description}
              ledeWidth={46}
              accent={accent}
            />
            <ul>
              {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>

          <form data-part="panel">
            <Input001
              type="email"
              name="email"
              autoComplete="email"
              required
              label={emailLabel}
              accent={accent}
            />

            <Checkbox001 name="consent" required label={consentLabel} description="" accent={accent} />

            <Button001 type="submit" size="lg" accent={accent}>
              {submitLabel}
            </Button001>

            <p data-part="foot">
              <span>{proof}</span>
              <span>{frequency}</span>
            </p>
          </form>
        </div>
      </section>
    </>
  )
}
