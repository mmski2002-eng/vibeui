import type { CSSProperties } from "react"

export type Dashboard004Member = {
  name: string
  email: string
  role: string
  status?: "active" | "invited"
}

export type Dashboard004Props = {
  title?: string
  hint?: string
  seatsUsed?: number
  seatsTotal?: number
  members?: Dashboard004Member[]
  inviteLabel?: string
  /** Список ролей в выпадающем меню. */
  roles?: string[]
  /** Подпись строки мест. */
  seatsText?: string
  /** Значение мест: {used} и {total} — числа. */
  seatsValueText?: string
  /** Подписи состояния по ключам active и invited. */
  statusText?: Record<string, string>
  /** Подпись выбора роли для скринридера: {name} — имя участника. */
  roleText?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: список участников с ролями и расходом мест. Расход показан
// полосой и цифрой сразу: полоса даёт ощущение запаса, цифра — точность перед
// покупкой мест. Оттенок аватара считается из имени хешем FNV-1a: сумма кодов
// символов сталкивает целые алфавиты в один сектор круга, и все русские имена
// выходят одного цвета. Приглашённый участник помечен формой значка, а не
// только цветом, — иначе состояние теряется на чёрно-белой печати.
//
// Тема берётся из color-scheme окружения через light-dark(): собственной
// подложки у списка нет, карточки внутри держат свою поверхность.
const STYLES = `
:where([data-vibeui-block="dashboard-004"]){
--vibeui-dashboard-004-bg:transparent;
--vibeui-dashboard-004-card:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-dashboard-004-fg:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.005 265));
--vibeui-dashboard-004-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-dashboard-004-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-dashboard-004-track:light-dark(oklch(0.93 0.005 265),oklch(0.34 0.01 265));
--vibeui-dashboard-004-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-dashboard-004-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 262));
--vibeui-dashboard-004-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-004"]{
box-sizing:border-box;padding:1.25rem;
background:var(--vibeui-dashboard-004-bg);
font-family:var(--vibeui-dashboard-004-sans);color:var(--vibeui-dashboard-004-fg);
}
[data-vibeui-block="dashboard-004"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-004"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;
gap:0.75rem;margin-bottom:1rem;
}
[data-vibeui-block="dashboard-004"] h2{margin:0 0 0.25rem;font-size:1.125rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="dashboard-004"] [data-part="lead"]{margin:0;font-size:0.8125rem;color:var(--vibeui-dashboard-004-muted)}
[data-vibeui-block="dashboard-004"] [data-part="invite"]{
appearance:none;cursor:pointer;flex:none;
height:2.25rem;padding:0 0.875rem;border:0;border-radius:0.625rem;
background:var(--vibeui-dashboard-004-accent);color:var(--vibeui-dashboard-004-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="dashboard-004"] [data-part="invite"]:focus-visible{outline:2px solid var(--vibeui-dashboard-004-accent);outline-offset:2px}
[data-vibeui-block="dashboard-004"] [data-part="seats"]{
padding:0.75rem 1rem;margin-bottom:0.75rem;
background:var(--vibeui-dashboard-004-card);
border:1px solid var(--vibeui-dashboard-004-border);border-radius:0.875rem;
}
[data-vibeui-block="dashboard-004"] [data-part="seatline"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;
margin:0 0 0.5rem;font-size:0.8125rem;
}
[data-vibeui-block="dashboard-004"] [data-part="seatvalue"]{font-weight:650;font-variant-numeric:tabular-nums}
/* Полоса и цифра вместе: полоса даёт ощущение запаса, цифра — точность. */
[data-vibeui-block="dashboard-004"] [data-part="track"]{
height:0.375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dashboard-004-track);
}
[data-vibeui-block="dashboard-004"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
background:var(--vibeui-dashboard-004-accent);
width:var(--vibeui-dashboard-004-used,50%);
}
[data-vibeui-block="dashboard-004"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="dashboard-004"] [data-part="member"]{
display:grid;grid-template-columns:auto 1fr;align-items:center;gap:0.75rem;
padding:0.625rem 0.875rem;
background:var(--vibeui-dashboard-004-card);
border:1px solid var(--vibeui-dashboard-004-border);border-radius:0.875rem;
}
@container (min-width: 34rem){
[data-vibeui-block="dashboard-004"] [data-part="member"]{grid-template-columns:auto 1fr auto auto}
}
/* Оттенок из имени считается хешем: сумма кодов сводит алфавит в один цвет. */
[data-vibeui-block="dashboard-004"] [data-part="avatar"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:2.25rem;height:2.25rem;border-radius:9999px;
background:oklch(0.93 0.05 var(--vibeui-dashboard-004-hue,265));
color:oklch(0.38 0.12 var(--vibeui-dashboard-004-hue,265));
font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="dashboard-004"] [data-part="name"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="dashboard-004"] [data-part="email"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-004-muted)}
[data-vibeui-block="dashboard-004"] select{
height:2rem;padding:0 0.5rem;
border:1px solid var(--vibeui-dashboard-004-border);border-radius:0.5rem;
background:var(--vibeui-dashboard-004-card);color:inherit;font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="dashboard-004"] select:focus-visible{outline:2px solid var(--vibeui-dashboard-004-accent);outline-offset:1px}
/* Приглашение помечено и формой значка: цвета мало на печати. */
[data-vibeui-block="dashboard-004"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.75rem;color:var(--vibeui-dashboard-004-muted);
}
[data-vibeui-block="dashboard-004"] [data-part="mark"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;
background:var(--vibeui-dashboard-004-accent);
}
[data-vibeui-block="dashboard-004"] [data-status="invited"] [data-part="mark"]{
border-radius:0.0625rem;background:none;
box-shadow:inset 0 0 0 1.5px var(--vibeui-dashboard-004-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MEMBERS: Dashboard004Member[] = [
  {
    name: "Анна Реброва",
    email: "anna@vibeui.ru",
    role: "Владелец",
    status: "active",
  },
  {
    name: "Илья Мохов",
    email: "ilya@vibeui.ru",
    role: "Редактор",
    status: "active",
  },
  {
    name: "Ким Сон",
    email: "kim@vibeui.ru",
    role: "Читатель",
    status: "invited",
  },
]

const ROLES = ["Владелец", "Редактор", "Читатель"]

const DEFAULT_STATUS: Record<string, string> = {
  active: "Активен",
  invited: "Приглашён",
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

function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match,
  )
}

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
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Участники проекта: роли, расход мест и приглашения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard004({
  title = "Участники",
  hint = "Роль определяет, что участник может менять в каталоге.",
  seatsUsed = 3,
  seatsTotal = 10,
  members = DEFAULT_MEMBERS,
  inviteLabel = "Пригласить",
  roles = ROLES,
  seatsText = "Занято мест",
  seatsValueText = "{used} из {total}",
  statusText = DEFAULT_STATUS,
  roleText = "Роль: {name}",
  background = "",
  accent,
  className,
  style,
}: Dashboard004Props) {
  const used = `${Math.min(100, (seatsUsed / Math.max(seatsTotal, 1)) * 100)}%`

  const palette = {
    "--vibeui-dashboard-004-used": used,
    ...(accent ? { "--vibeui-dashboard-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-004"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="lead">{hint}</p>
          </div>
          <button type="button" data-part="invite">
            {inviteLabel}
          </button>
        </header>

        <div data-part="seats">
          <p data-part="seatline">
            {seatsText}
            <span data-part="seatvalue">
              {fill(seatsValueText, {
                used: String(seatsUsed),
                total: String(seatsTotal),
              })}
            </span>
          </p>
          <div
            data-part="track"
            role="progressbar"
            aria-valuenow={seatsUsed}
            aria-valuemin={0}
            aria-valuemax={seatsTotal}
            aria-label={seatsText}
          >
            <span data-part="fill" />
          </div>
        </div>

        <ul>
          {members.map((member) => (
            <li
              key={member.email}
              data-part="member"
              data-status={member.status ?? "active"}
            >
              <span
                data-part="avatar"
                aria-hidden="true"
                style={
                  {
                    "--vibeui-dashboard-004-hue": hue(member.name),
                  } as CSSProperties
                }
              >
                {initials(member.name)}
              </span>
              <div>
                <p data-part="name">{member.name}</p>
                <p data-part="email">{member.email}</p>
              </div>
              <span data-part="status">
                <span data-part="mark" aria-hidden="true" />
                {statusText[member.status ?? "active"] ??
                  DEFAULT_STATUS[member.status ?? "active"]}
              </span>
              <select
                defaultValue={member.role}
                aria-label={fill(roleText, { name: member.name })}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
