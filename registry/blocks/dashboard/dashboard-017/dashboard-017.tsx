import type { CSSProperties } from "react"

export type Dashboard017Member = {
  name: string
  email: string
  role: string
  rights: string
  lastSeen?: string
}

export type Dashboard017Invite = {
  email: string
  role: string
  sent: string
}

export type Dashboard017Props = {
  title?: string
  hint?: string
  roles?: string[]
  inviteRole?: string
  members?: Dashboard017Member[]
  invites?: Dashboard017Invite[]
  inviteLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: страница участников, где приглашение — это форма на экране, а
// не кнопка, ведущая в модальное окно. Рядом лежит список уже отправленных
// приглашений: без него человек шлёт второе письмо тому же адресату. Права
// роли расписаны словами в самой строке — «редактор» ничего не значит, пока
// не сказано, что редактор может.
const STYLES = `
:where([data-vibeui-block="dashboard-017"]){
--vibeui-dashboard-017-bg:oklch(1 0 0);
--vibeui-dashboard-017-panel:oklch(0.985 0.003 265);
--vibeui-dashboard-017-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-017-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-017-border:oklch(0.91 0.006 265);
--vibeui-dashboard-017-accent:oklch(0.55 0.2 262);
--vibeui-dashboard-017-wait:oklch(0.68 0.14 75);
--vibeui-dashboard-017-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-017"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-017-bg);
color:var(--vibeui-dashboard-017-fg);
font-family:var(--vibeui-dashboard-017-sans);
border:1px solid var(--vibeui-dashboard-017-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-017"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-017"] [data-part="shell"]{
display:grid;grid-template-columns:1fr;gap:1.25rem;padding:1.125rem;
}
[data-vibeui-block="dashboard-017"] h2{margin:0 0 0.125rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-017"] [data-part="hint"]{margin:0 0 0.875rem;font-size:0.75rem;color:var(--vibeui-dashboard-017-muted)}
[data-vibeui-block="dashboard-017"] ul{list-style:none;margin:0;padding:0}
[data-vibeui-block="dashboard-017"] [data-part="member"]{
display:grid;grid-template-columns:auto 1fr;gap:0.25rem 0.75rem;align-items:center;
padding:0.75rem 0;border-top:1px solid var(--vibeui-dashboard-017-border);
}
[data-vibeui-block="dashboard-017"] [data-part="member"]:first-child{border-top:0;padding-top:0}
[data-vibeui-block="dashboard-017"] [data-part="avatar"]{
grid-row:span 2;width:2.25rem;height:2.25rem;border-radius:9999px;
display:grid;place-items:center;font-size:0.75rem;font-weight:700;
background:oklch(0.94 0.03 var(--vibeui-dashboard-017-hue));
color:oklch(0.38 0.09 var(--vibeui-dashboard-017-hue));
}
[data-vibeui-block="dashboard-017"] [data-part="who"]{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="dashboard-017"] [data-part="mail"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-017-muted);overflow-wrap:anywhere;
}
[data-vibeui-block="dashboard-017"] [data-part="rights"]{
grid-column:2;margin:0.25rem 0 0;font-size:0.6875rem;color:var(--vibeui-dashboard-017-muted);
}
[data-vibeui-block="dashboard-017"] [data-part="role"]{grid-column:2;justify-self:start;margin-top:0.375rem}
[data-vibeui-block="dashboard-017"] select,
[data-vibeui-block="dashboard-017"] input{
appearance:none;font:inherit;font-size:0.75rem;color:inherit;width:100%;
padding:0.4375rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-017-border);
background:var(--vibeui-dashboard-017-bg);
}
[data-vibeui-block="dashboard-017"] select{
padding-right:1.75rem;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23777' stroke-width='1.6'/%3E%3C/svg%3E");
background-repeat:no-repeat;background-position:right 0.5rem center;background-size:0.625rem;
}
[data-vibeui-block="dashboard-017"] :is(select,input,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-017-accent);outline-offset:2px;
}
[data-vibeui-block="dashboard-017"] [data-part="aside"]{
background:var(--vibeui-dashboard-017-panel);
border:1px solid var(--vibeui-dashboard-017-border);border-radius:0.875rem;
padding:0.875rem;align-self:start;
}
[data-vibeui-block="dashboard-017"] h3{margin:0 0 0.5rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="dashboard-017"] [data-part="field"]{display:block;margin-bottom:0.5rem}
[data-vibeui-block="dashboard-017"] [data-part="fieldlabel"]{
display:block;margin-bottom:0.25rem;font-size:0.6875rem;font-weight:600;
color:var(--vibeui-dashboard-017-muted);
}
[data-vibeui-block="dashboard-017"] [data-part="send"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:650;
width:100%;padding:0.5rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-017-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-017"] [data-part="pending"]{
margin-top:0.875rem;padding-top:0.75rem;border-top:1px solid var(--vibeui-dashboard-017-border);
}
[data-vibeui-block="dashboard-017"] [data-part="invite"]{
display:flex;align-items:baseline;gap:0.375rem;padding:0.3125rem 0;font-size:0.6875rem;
}
[data-vibeui-block="dashboard-017"] [data-part="mark"]{
width:0.5rem;height:0.5rem;flex:none;border-radius:0.125rem;
box-shadow:inset 0 0 0 2px var(--vibeui-dashboard-017-wait);
}
[data-vibeui-block="dashboard-017"] [data-part="sent"]{margin-left:auto;color:var(--vibeui-dashboard-017-muted);white-space:nowrap}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-017"] [data-part="shell"]{grid-template-columns:1fr 17rem;padding:1.375rem}
[data-vibeui-block="dashboard-017"] [data-part="member"]{grid-template-columns:auto 1fr auto}
[data-vibeui-block="dashboard-017"] [data-part="role"]{grid-column:3;grid-row:1 / span 2;justify-self:end;margin-top:0;width:9rem}
[data-vibeui-block="dashboard-017"] [data-part="rights"]{grid-column:2}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MEMBERS: Dashboard017Member[] = [
  {
    name: "Анна Реброва",
    email: "anna@vibeui.ru",
    role: "Владелец",
    rights: "Полный доступ, оплата, удаление проекта",
    lastSeen: "сейчас",
  },
  {
    name: "Илья Мохов",
    email: "ilya@vibeui.ru",
    role: "Редактор",
    rights: "Правит блоки и метаданные, не трогает оплату",
    lastSeen: "2 часа назад",
  },
  {
    name: "Ким Сон",
    email: "kim@vibeui.ru",
    role: "Читатель",
    rights: "Смотрит каталог и историю, ничего не меняет",
    lastSeen: "вчера",
  },
]

const DEFAULT_INVITES: Dashboard017Invite[] = [
  { email: "petr@vibeui.ru", role: "Редактор", sent: "12 марта" },
  { email: "lena@studio.io", role: "Читатель", sent: "10 марта" },
]

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

/**
 * Участники и доступ: роли с расшифровкой прав, форма приглашения и список
 * уже отправленных писем. Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard017({
  title = "Участники",
  hint = "Роль определяет, что человек может делать в проекте",
  roles = ["Владелец", "Редактор", "Читатель"],
  inviteRole = "Редактор",
  members = DEFAULT_MEMBERS,
  invites = DEFAULT_INVITES,
  inviteLabel = "Отправить приглашение",
  accent,
  className,
  style,
}: Dashboard017Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-017" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-017"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
            <ul>
              {members.map((member) => (
                <li
                  key={member.email}
                  data-part="member"
                  style={
                    {
                      "--vibeui-dashboard-017-hue": `${hue(member.name)}`,
                    } as CSSProperties
                  }
                >
                  <span data-part="avatar" aria-hidden="true">
                    {initials(member.name)}
                  </span>
                  <p data-part="who">
                    {member.name}
                    {member.lastSeen ? ` · ${member.lastSeen}` : null}
                  </p>
                  <p data-part="mail">{member.email}</p>
                  <p data-part="rights">{member.rights}</p>
                  <select
                    data-part="role"
                    defaultValue={member.role}
                    aria-label={`Роль: ${member.name}`}
                  >
                    {roles.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          </div>

          <aside data-part="aside">
            <h3>Пригласить в проект</h3>
            <label data-part="field">
              <span data-part="fieldlabel">Почта</span>
              <input type="email" placeholder="name@company.com" />
            </label>
            <label data-part="field">
              <span data-part="fieldlabel">Роль</span>
              <select defaultValue={inviteRole}>
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </label>
            <button type="button" data-part="send">
              {inviteLabel}
            </button>

            <div data-part="pending">
              <h3>Ждут ответа</h3>
              <ul>
                {invites.map((invite) => (
                  <li key={invite.email} data-part="invite">
                    <span data-part="mark" aria-hidden="true" />
                    <span>
                      {invite.email} · {invite.role}
                    </span>
                    <span data-part="sent">{invite.sent}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
