import type { CSSProperties } from "react"

export type Auth017Props = {
  project?: string
  inviter?: string
  inviterRole?: string
  role?: string
  team?: string[]
  stats?: { value: string; label: string }[]
  accept?: string
  decline?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: приглашение как широкий баннер, а не узкая карточка. Решение
// «принять или нет» человек принимает не по названию проекта, а по тому, кто
// там уже есть: стопка аватаров с реальными именами отвечает на вопрос
// «это точно моя команда» быстрее любого описания. Три числа рядом заменяют
// абзац про то, чем этот проект живёт. Аватары наложены друг на друга и
// подписаны текстом для скринридера — декоративная стопка без подписи для
// него просто пустое место.
// Приглашение приходит на конкретный адрес, поэтому внизу есть выход для
// того, кто открыл ссылку под другим аккаунтом — иначе он примет приглашение
// не тем пользователем и повторить будет нечем: ссылка одноразовая.
//
// Демонстрация интерфейса: кнопки ничего не отправляют.
const STYLES = `
:where([data-vibeui-block="auth-017"]){
--vibeui-auth-017-bg:oklch(0.97 0.006 145);
--vibeui-auth-017-card:oklch(1 0 0);
--vibeui-auth-017-fg:oklch(0.22 0.016 150);
--vibeui-auth-017-muted:oklch(0.53 0.014 150);
--vibeui-auth-017-border:oklch(0.89 0.01 150);
--vibeui-auth-017-accent:oklch(0.5 0.14 150);
--vibeui-auth-017-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="auth-017"]{
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-017-bg);color:var(--vibeui-auth-017-fg);
font-family:var(--vibeui-auth-017-sans);
}
[data-vibeui-block="auth-017"] *{box-sizing:border-box}
[data-vibeui-block="auth-017"] [data-part="shell"]{
width:100%;max-width:24rem;margin:0 auto;overflow:hidden;
background:var(--vibeui-auth-017-card);
border:1px solid var(--vibeui-auth-017-border);border-radius:1.125rem;
}
[data-vibeui-block="auth-017"] [data-part="ribbon"]{
height:0.375rem;
background:linear-gradient(90deg,var(--vibeui-auth-017-accent),oklch(0.6 0.15 190));
}
[data-vibeui-block="auth-017"] [data-part="body"]{padding:1.5rem}
[data-vibeui-block="auth-017"] [data-part="stats"]{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin:1.125rem 0}
@container (min-width: 46rem){
[data-vibeui-block="auth-017"] [data-part="shell"]{max-width:42rem}
[data-vibeui-block="auth-017"] [data-part="body"]{padding:2rem 2.25rem}
[data-vibeui-block="auth-017"] [data-part="head"]{display:flex;align-items:center;gap:1.25rem}
[data-vibeui-block="auth-017"] [data-part="stats"]{margin-left:auto;width:20rem;flex:none}
[data-vibeui-block="auth-017"] [data-part="actions"]{flex-direction:row}
[data-vibeui-block="auth-017"] [data-part="accept"]{flex:1.4}
[data-vibeui-block="auth-017"] [data-part="decline"]{flex:1}
}
[data-vibeui-block="auth-017"] [data-part="from"]{
display:inline-flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;
font-size:0.8125rem;color:var(--vibeui-auth-017-muted);
}
[data-vibeui-block="auth-017"] [data-part="from"] b{color:var(--vibeui-auth-017-fg);font-weight:650}
[data-vibeui-block="auth-017"] h2{margin:0 0 0.375rem;font-size:1.375rem;font-weight:700;line-height:1.2;letter-spacing:-0.02em}
[data-vibeui-block="auth-017"] [data-part="lead"]{margin:0;font-size:0.875rem;line-height:1.55;color:var(--vibeui-auth-017-muted)}
[data-vibeui-block="auth-017"] [data-part="role"]{
display:inline-block;padding:0.125rem 0.5rem;border-radius:9999px;
background:oklch(0.5 0.14 150 / 12%);color:var(--vibeui-auth-017-accent);
font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="auth-017"] [data-part="stat"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:oklch(0.55 0.02 150 / 5%);
}
[data-vibeui-block="auth-017"] [data-part="value"]{display:block;font-size:1.125rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="auth-017"] [data-part="label"]{display:block;margin-top:0.125rem;font-size:0.6875rem;line-height:1.3;color:var(--vibeui-auth-017-muted)}
[data-vibeui-block="auth-017"] [data-part="team"]{display:flex;align-items:center;gap:0.625rem;margin-bottom:1.25rem}
[data-vibeui-block="auth-017"] [data-part="stack"]{display:flex;padding-left:0.5rem}
[data-vibeui-block="auth-017"] [data-part="face"]{
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;margin-left:-0.5rem;border-radius:9999px;
border:2px solid var(--vibeui-auth-017-card);
background:oklch(0.88 0.07 var(--vibeui-auth-017-hue));
color:oklch(0.33 0.12 var(--vibeui-auth-017-hue));
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="auth-017"] [data-part="who"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-auth-017-muted)}
[data-vibeui-block="auth-017"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="auth-017"] [data-part="accept"],
[data-vibeui-block="auth-017"] [data-part="decline"]{
appearance:none;cursor:pointer;height:2.75rem;padding:0 1rem;
border-radius:0.75rem;font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-017"] [data-part="accept"]{border:0;background:var(--vibeui-auth-017-accent);color:oklch(1 0 0)}
[data-vibeui-block="auth-017"] [data-part="decline"]{border:1px solid var(--vibeui-auth-017-border);background:none;color:inherit}
[data-vibeui-block="auth-017"] [data-part="accept"]:focus-visible,
[data-vibeui-block="auth-017"] [data-part="decline"]:focus-visible{outline:2px solid var(--vibeui-auth-017-accent);outline-offset:2px}
[data-vibeui-block="auth-017"] [data-part="foot"]{
margin:1rem 0 0;padding-top:0.875rem;border-top:1px solid var(--vibeui-auth-017-border);
font-size:0.75rem;line-height:1.5;color:var(--vibeui-auth-017-muted);
}
[data-vibeui-block="auth-017"] [data-part="foot"] a{color:var(--vibeui-auth-017-accent);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TEAM = ["Пётр Гай", "Лиза Ким", "Марк Овчинников", "Даша Ли"]

const DEFAULT_STATS = [
  { value: "128", label: "блоков в проекте" },
  { value: "12", label: "человек в команде" },
  { value: "3 года", label: "истории правок" },
]

/**
 * Приглашение в команду широким баннером: кто зовёт, куда,
 * состав команды и два равноправных ответа. Один файл, ноль зависимостей.
 */
export function Auth017({
  project = "Каталог «Мера»",
  inviter = "Пётр Гай",
  inviterRole = "владелец проекта",
  role = "Редактор",
  team = DEFAULT_TEAM,
  stats = DEFAULT_STATS,
  accept = "Принять и войти",
  decline = "Отклонить",
  accent,
  className,
  style,
}: Auth017Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-017" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-017"
        className={className}
        style={palette}
        aria-label={`Приглашение в проект ${project}`}
      >
        <div data-part="shell">
          <div data-part="ribbon" aria-hidden="true" />
          <div data-part="body">
            <div data-part="head">
              <div>
                <p data-part="from">
                  <b>{inviter}</b>, {inviterRole}, приглашает вас
                </p>
                <h2>{project}</h2>
                <p data-part="lead">
                  Роль при входе: <span data-part="role">{role}</span>. Её можно
                  изменить позже — это делает владелец проекта.
                </p>
              </div>

              <div data-part="stats">
                {stats.map((stat) => (
                  <div key={stat.label} data-part="stat">
                    <span data-part="value">{stat.value}</span>
                    <span data-part="label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div data-part="team">
              <span data-part="stack" aria-hidden="true">
                {team.map((person) => (
                  <span
                    key={person}
                    data-part="face"
                    style={
                      {
                        "--vibeui-auth-017-hue": `${hue(person)}`,
                      } as CSSProperties
                    }
                  >
                    {person
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                ))}
              </span>
              <span data-part="who">
                Уже в проекте: {team.join(", ")} и ещё восемь человек
              </span>
            </div>

            <div data-part="actions">
              <button type="button" data-part="accept">
                {accept}
              </button>
              <button type="button" data-part="decline">
                {decline}
              </button>
            </div>

            <p data-part="foot">
              Приглашение выписано на адрес anna@vibeui.ru и действует 7 дней.
              Это не ваш адрес? <a href="#">Войти другим аккаунтом</a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
