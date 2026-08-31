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
const STYLES = `
:where([data-vibeui-block="auth-006"]){
--vibeui-auth-006-bg:oklch(1 0 0);
--vibeui-auth-006-panel:oklch(0.985 0.002 265);
--vibeui-auth-006-fg:oklch(0.22 0.014 265);
--vibeui-auth-006-muted:oklch(0.55 0.014 265);
--vibeui-auth-006-border:oklch(0.9 0.006 265);
--vibeui-auth-006-accent:oklch(0.55 0.2 262);
--vibeui-auth-006-ok:oklch(0.58 0.14 152);
--vibeui-auth-006-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="auth-006"]{
width:100%;max-width:26rem;box-sizing:border-box;padding:1.25rem;
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
background:oklch(0.55 0.2 262 / 10%);color:var(--vibeui-auth-006-accent);
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
background:var(--vibeui-auth-006-ok);color:oklch(1 0 0);
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
flex:1 1 10rem;border:0;background:var(--vibeui-auth-006-accent);color:oklch(1 0 0);
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
  accent,
  className,
  style,
}: Auth006Props) {
  const palette = {
    "--vibeui-auth-006-hue": hue(inviter),
    ...(accent ? { "--vibeui-auth-006-accent": accent } : null),
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
        aria-label={`Приглашение в проект ${project}`}
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
          Приглашение в проект <span data-part="project">«{project}»</span>
        </h2>
        <p data-part="role">Роль: {role}</p>

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
          В команде уже {members.length}: {members.join(", ")}
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
