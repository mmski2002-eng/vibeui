import type { CSSProperties } from "react"
import { Card053 } from "@/registry/components/card/card-053/card-053"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"


type People005Member = {
  name: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  role: string
}

export type People005Props = {
  eyebrow?: string
  title?: string
  members?: People005Member[]
  joinTitle?: string
  joinText?: string
  ctaLabel?: string
  ctaHref?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Сетка команды с карточкой-приглашением в конце: пунктирная рамка читается
// как «место ещё не занято», тёплая подложка и оранжевая кнопка ведут в
// вакансии. Приглашение стоит в общей сетке, а не отдельным баннером:
// кандидат буквально видит свою будущую карточку рядом с будущими коллегами.
const STYLES = `[data-vibeui-block="people-005"] [data-part="heading"]{margin-bottom:2rem}

:where([data-vibeui-block="people-005"]){
--vibeui-people-005-bg:transparent;
--vibeui-people-005-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-people-005-ink:light-dark(oklch(0.2 0 0),oklch(0.96 0 0));
--vibeui-people-005-muted:light-dark(oklch(0.51 0 0),oklch(0.72 0 0));
--vibeui-people-005-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-people-005-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-people-005-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-people-005-on-accent:oklch(from var(--vibeui-people-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-people-005-shadow:light-dark(oklch(0.2 0 0 / 55%),oklch(0 0 0 / 80%));
--vibeui-people-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-people-005-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-005"]{color-scheme:dark}
[data-vibeui-block="people-005"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-people-005-bg);color:var(--vibeui-people-005-ink);
font-family:var(--vibeui-people-005-font);
}
[data-vibeui-block="people-005"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="people-005"] [data-part="grid"]{display:grid;gap:1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="people-005"] [data-part="join"]{
min-inline-size:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.375rem;
padding:1.75rem 1.25rem;text-align:center;
border:1px dashed color-mix(in oklab,var(--vibeui-people-005-accent) 50%,var(--vibeui-people-005-border));
border-radius:1.125rem;
background:color-mix(in oklab,var(--vibeui-people-005-accent) 8%,var(--vibeui-people-005-card));
}
[data-vibeui-block="people-005"] [data-part="join-avatar"]{
width:3.5rem;height:3.5rem;flex:none;border-radius:999px;margin-bottom:0.625rem;
display:grid;place-items:center;
border:1px dashed color-mix(in oklab,var(--vibeui-people-005-accent) 60%,var(--vibeui-people-005-border));
color:var(--vibeui-people-005-accent);
font-size:1.375rem;font-weight:600;line-height:1;
}
[data-vibeui-block="people-005"] [data-part="join-avatar"]::before{content:"+"}
[data-vibeui-block="people-005"] [data-part="join-title"]{margin:0;font-size:1rem;font-weight:700}
[data-vibeui-block="people-005"] [data-part="join-text"]{
margin:0;color:var(--vibeui-people-005-muted);font-size:0.8125rem;line-height:1.5;
}
@container (min-width: 30rem){
[data-vibeui-block="people-005"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 48rem){
[data-vibeui-block="people-005"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="people-005"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}
}
@container (min-width: 64rem){
[data-vibeui-block="people-005"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MEMBERS: People005Member[] = [
  { name: "Алексей Громов", role: "Основатель, продукт" },
  { name: "Вера Лапина", role: "Дизайн-система и токены" },
  { name: "Марат Гареев", role: "Фронтенд-инженер" },
  { name: "Ксения Орлова", role: "Технический писатель" },
  { name: "Никита Белов", role: "Инженер registry" },
  { name: "Полина Царёва", role: "Дизайнер блоков" },
  { name: "Тимур Ахметов", role: "Доступность и качество" },
]

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

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

/** Сетка команды с карточкой-приглашением «твоё место» и кнопкой вакансий. */
export function People005({
  eyebrow = "Команда",
  title = "Нас пока немного — и это вакансия",
  members = DEFAULT_MEMBERS,
  joinTitle = "Твоё место свободно",
  joinText = "Ищем инженера каталога и второго технического писателя. Вся команда удалённая.",
  ctaLabel = "Смотреть вакансии",
  ctaHref = "#",
  background = "",
  accent,
  className,
  style,
}: People005Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-people-005-accent": accent,
          "--vibeui-people-005-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-people-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-people-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="people-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            accent={accent}
          />
          <ul data-part="grid">
            {members.map((member) => (
              <Card053 key={member.name} data-part="card" name={member.name} image={member.image} role={member.role} accent={accent} />
            ))}
            <li data-part="join">
              <span data-part="join-avatar" aria-hidden="true" />
              <p data-part="join-title">{joinTitle}</p>
              <p data-part="join-text">{joinText}</p>
              <Button016
                data-part="cta"
                label={ctaLabel}
                href={ctaHref}
                external={false}
                size="md"
                tone="neutral"
                accent={accent}
              />
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
