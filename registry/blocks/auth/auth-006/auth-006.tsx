import type { CSSProperties } from "react"

export type Auth006Props = {
  project?: string
  inviter?: string
  inviterRole?: string
  role?: string
  rights?: string[]
  members?: string[]
  accept?: string
  decline?: string
  note?: string
  expires?: string
  /** Заголовок приглашения; {project} подставляется названием проекта. */
  headingTemplate?: string
  /** Строка роли; {role} подставляется значением role. */
  roleTemplate?: string
  /** Строка состава; {count} и {names} подставляются из members. */
  membersTemplate?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: приглашение в проект. Роль и её права перечислены до кнопки —
// человек соглашается на конкретный доступ, а не на слово «участник». Отказ
// оформлен обычной кнопкой рядом, а не мелкой ссылкой в углу: отказ такой же
// законный исход, как согласие. Срок жизни приглашения написан явно, иначе
// протухшая ссылка выглядит поломкой сервиса. Кто пригласил — с ролью, чтобы
// понять, вправе ли этот человек раздавать доступ.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="auth-006"]){
--vibeui-auth-006-bg:transparent;
--vibeui-auth-006-panel:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-auth-006-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-auth-006-muted:light-dark(oklch(0.55 0 265),oklch(0.69 0 265));
--vibeui-auth-006-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-auth-006-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.74 0.16 39.8));
--vibeui-auth-006-accent-soft:light-dark(oklch(0.55 0.2 39.8 / 10%),oklch(0.74 0.16 39.8 / 18%));
--vibeui-auth-006-on-accent:oklch(0.15 0.02 39.8);
--vibeui-auth-006-ok:light-dark(oklch(0.58 0.14 152),oklch(0.74 0.13 152));
--vibeui-auth-006-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-006"]{color-scheme:dark}
[data-vibeui-block="auth-006"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:26rem;margin-inline:auto;box-sizing:border-box;padding:1.25rem;
background:var(--vibeui-auth-006-bg);
border:1px solid var(--vibeui-auth-006-border);border-radius:1rem;
font-family:var(--vibeui-auth-006-sans);color:var(--vibeui-auth-006-fg);
}
[data-vibeui-block="auth-006"] *{box-sizing:border-box}
[data-vibeui-block="auth-006"] [data-part="who"]{
display:flex;align-items:center;gap:0.625rem;margin-bottom:0.875rem;
}
[data-vibeui-block="auth-006"] [data-part="avatar"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:2.25rem;height:2.25rem;border-radius:9999px;
background:oklch(0.9 0.07 var(--vibeui-auth-006-hue,262));
color:oklch(0.35 0.12 var(--vibeui-auth-006-hue,262));
font-size:0.8125rem;font-weight:700;
}
/* Кто пригласил — вместе с ролью: видно, вправе ли он раздавать доступ. */
[data-vibeui-block="auth-006"] [data-part="inviter"]{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="auth-006"] [data-part="inviterrole"]{margin:0;font-size:0.6875rem;color:var(--vibeui-auth-006-muted)}
[data-vibeui-block="auth-006"] h2{margin:0 0 0.375rem;font-size:1.1875rem;font-weight:700;line-height:1.25;letter-spacing:-0.01em}
[data-vibeui-block="auth-006"] [data-part="project"]{color:var(--vibeui-auth-006-accent)}
[data-vibeui-block="auth-006"] [data-part="role"]{
display:inline-flex;align-items:center;gap:0.375rem;margin:0 0 0.75rem;
padding:0.25rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-auth-006-accent-soft);color:var(--vibeui-auth-006-accent);
font-size:0.75rem;font-weight:650;
}
/* Права перечислены до кнопки: соглашаются на доступ, а не на слово. */
[data-vibeui-block="auth-006"] ul{
list-style:none;margin:0 0 0.875rem;padding:0.75rem 0.875rem;
border-radius:0.75rem;background:var(--vibeui-auth-006-panel);
border:1px solid var(--vibeui-auth-006-border);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="auth-006"] li{display:flex;gap:0.5rem;font-size:0.8125rem;line-height:1.4}
[data-vibeui-block="auth-006"] [data-part="mark"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:1rem;height:1rem;margin-top:0.0625rem;border-radius:9999px;
background:var(--vibeui-auth-006-ok);color:var(--vibeui-auth-006-on-accent);
font-size:0.5625rem;line-height:1;
}
[data-vibeui-block="auth-006"] [data-part="members"]{
margin:0 0 0.875rem;font-size:0.75rem;color:var(--vibeui-auth-006-muted);
}
[data-vibeui-block="auth-006"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="auth-006"] button{
appearance:none;cursor:pointer;height:2.5rem;padding:0 1rem;border-radius:0.625rem;
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-006"] [data-part="accept"]{
flex:1 1 10rem;border:0;background:var(--vibeui-auth-006-accent);color:var(--vibeui-auth-006-on-accent);
}
/* Отказ — обычная кнопка рядом: это такой же законный исход. */
[data-vibeui-block="auth-006"] [data-part="decline"]{
border:1px solid var(--vibeui-auth-006-border);background:none;color:inherit;
}
[data-vibeui-block="auth-006"] button:focus-visible{outline:2px solid var(--vibeui-auth-006-accent);outline-offset:2px}
[data-vibeui-block="auth-006"] [data-part="expires"]{
margin:0.75rem 0 0;font-size:0.6875rem;color:var(--vibeui-auth-006-muted);
}
[data-vibeui-block="auth-006"] [data-part="note"]{
margin:0.375rem 0 0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-auth-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_RIGHTS = [
  "Смотреть каталог и историю установок",
  "Ставить блоки в проекты команды",
  "Приглашать читателей, но не владельцев",
]

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return [12, 22, 32, 39.8, 48, 58][(hash >>> 0) % 6]
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Приглашение в проект: права перечислены до кнопки, отказ рядом с согласием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Auth006({
  project = "Каталог VibeUI",
  inviter = "Анна Реброва",
  inviterRole = "владелец проекта",
  role = "Редактор",
  rights = DEFAULT_RIGHTS,
  members = ["Илья Мохов", "Ким Сон", "Пётр Гай"],
  accept = "Принять приглашение",
  decline = "Отказаться",
  note = "Отказ можно отменить: попросите пригласить ещё раз.",
  expires = "Приглашение действует до 20 марта",
  headingTemplate = "Приглашение в проект {project}",
  roleTemplate = "Роль: {role}",
  membersTemplate = "В команде уже {count}: {names}",
  background = "",
  accent,
  className,
  style,
}: Auth006Props) {
  const [headingBefore, headingAfter] = headingTemplate.split("{project}")
  const palette = {
    "--vibeui-auth-006-hue": hue(inviter),
    ...(accent ? { "--vibeui-auth-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-006"
        className={className}
        style={palette}
        aria-label={headingTemplate.replace("{project}", project)}
      >
        <div data-part="who">
          <span data-part="avatar" aria-hidden="true">
            {initials(inviter)}
          </span>
          <div>
            <p data-part="inviter">{inviter}</p>
            <p data-part="inviterrole">{inviterRole}</p>
          </div>
        </div>

        <h2>
          {headingBefore}
          <span data-part="project">«{project}»</span>
          {headingAfter}
        </h2>
        <p data-part="role">{roleTemplate.replace("{role}", role)}</p>

        <ul>
          {rights.map((right) => (
            <li key={right}>
              <span data-part="mark" aria-hidden="true">
                ✓
              </span>
              {right}
            </li>
          ))}
        </ul>

        <p data-part="members">
          {membersTemplate
            .replace("{count}", String(members.length))
            .replace("{names}", members.join(", "))}
        </p>

        <div data-part="actions">
          <button type="button" data-part="accept">
            {accept}
          </button>
          <button type="button" data-part="decline">
            {decline}
          </button>
        </div>

        <p data-part="expires">{expires}</p>
        <p data-part="note">{note}</p>
      </section>
    </>
  )
}
