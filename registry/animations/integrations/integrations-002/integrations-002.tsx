import type { ComponentProps, CSSProperties } from "react"

export type Integrations002Satellite = {
  label: string
}

export type Integrations002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка: число подключений и т. п. */
  badge?: string
  satellites?: Integrations002Satellite[]
  accent?: string
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
}

// Идея: центральный значок бренда, вокруг него по круговой орбите вращаются
// значки сторонних сервисов. Каждый значок сидит в кольце (data-part="ring"),
// кольцо крутится на 360° бесконечно, а сам значок внутри крутится в
// обратную сторону с той же длительностью и той же задержкой — поворот
// компенируется, и иконка остаётся прямой, меняется только её положение на
// орбите. Стартовый угол каждого спутника — это просто отрицательная
// задержка анимации, доля периода от его индекса (--vibeui-integrations-002-i
// из --vibeui-integrations-002-n), так спутники расходятся по кругу
// равномерно независимо от их числа.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="integrations-002"]){
--vibeui-integrations-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-integrations-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-integrations-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-integrations-002-muted:color-mix(in oklab,var(--vibeui-integrations-002-fg) 60%,transparent);
--vibeui-integrations-002-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-integrations-002-orbit-line:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-integrations-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-integrations-002-hub-fg:oklch(0.98 0 0);
--vibeui-integrations-002-sat-fg:oklch(0.98 0 0);
--vibeui-integrations-002-n1:oklch(0.68 0.19 25);
--vibeui-integrations-002-n2:oklch(0.76 0.15 80);
--vibeui-integrations-002-n3:oklch(0.72 0.16 150);
--vibeui-integrations-002-n4:oklch(0.66 0.15 225);
--vibeui-integrations-002-n5:oklch(0.63 0.19 300);
--vibeui-integrations-002-n6:oklch(0.7 0.16 340);
--vibeui-integrations-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="integrations-002"]{color-scheme:dark}
[data-vibeui-block="integrations-002"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-integrations-002-fg);font-family:var(--vibeui-integrations-002-font);
}
[data-vibeui-block="integrations-002"] *{box-sizing:border-box}
[data-vibeui-block="integrations-002"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="integrations-002"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-integrations-002-border);
background:color-mix(in oklab,var(--vibeui-integrations-002-frame) 75%,transparent);
transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="integrations-002"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,var(--vibeui-integrations-002-n1),var(--vibeui-integrations-002-n2),var(--vibeui-integrations-002-n3),var(--vibeui-integrations-002-n4),var(--vibeui-integrations-002-n5),var(--vibeui-integrations-002-n6));
filter:blur(7px);opacity:0.55;transform-origin:center bottom;
animation:vibeui-integrations-002-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="integrations-002"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="integrations-002"] [data-part="card"]{
position:relative;z-index:1;
border-radius:1rem;border:1px solid var(--vibeui-integrations-002-border);
background:var(--vibeui-integrations-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="integrations-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.75rem;border-bottom:1px solid var(--vibeui-integrations-002-border);
}
[data-vibeui-block="integrations-002"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="integrations-002"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1rem;min-width:1rem;padding:0 0.3125rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-integrations-002-accent);
background:color-mix(in oklab,var(--vibeui-integrations-002-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-integrations-002-accent) 22%,transparent);
}
[data-vibeui-block="integrations-002"] [data-part="body"]{
display:flex;align-items:center;justify-content:center;padding:1.75rem 1rem 1.875rem;
}
[data-vibeui-block="integrations-002"] [data-part="orbit"]{
position:relative;width:11.5rem;height:11.5rem;flex:none;
}
[data-vibeui-block="integrations-002"] [data-part="path"]{
position:absolute;inset:0;border-radius:9999px;
border:1px dashed var(--vibeui-integrations-002-orbit-line);
}
[data-vibeui-block="integrations-002"] [data-part="hub"]{
position:absolute;top:50%;left:50%;z-index:1;
width:3.375rem;height:3.375rem;margin:-1.6875rem 0 0 -1.6875rem;
display:flex;align-items:center;justify-content:center;border-radius:1.125rem;
background:var(--vibeui-integrations-002-accent);
box-shadow:0 6px 16px -6px color-mix(in oklab,var(--vibeui-integrations-002-accent) 55%,transparent);
animation:vibeui-integrations-002-pulse 4.5s ease-in-out infinite;
}
[data-vibeui-block="integrations-002"] [data-part="hub"] svg{
width:1.625rem;height:1.625rem;color:var(--vibeui-integrations-002-hub-fg);
}
[data-vibeui-block="integrations-002"] [data-part="ring"]{
position:absolute;inset:0;
animation:vibeui-integrations-002-orbit 18s linear infinite;
animation-delay:calc(var(--vibeui-integrations-002-i) / var(--vibeui-integrations-002-n) * -18s);
}
[data-vibeui-block="integrations-002"] [data-part="satellite"]{
position:absolute;top:0;left:50%;width:2rem;height:2rem;margin:-1rem 0 0 -1rem;
display:flex;align-items:center;justify-content:center;border-radius:9999px;
background:var(--vibeui-integrations-002-satcolor,var(--vibeui-integrations-002-accent));
box-shadow:0 3px 8px -3px oklch(0 0 0 / 0.35);
animation:vibeui-integrations-002-counter 18s linear infinite;
animation-delay:calc(var(--vibeui-integrations-002-i) / var(--vibeui-integrations-002-n) * -18s);
}
[data-vibeui-block="integrations-002"] [data-part="satellite"] svg{
width:1rem;height:1rem;color:var(--vibeui-integrations-002-sat-fg);
}
@keyframes vibeui-integrations-002-breathe{0%,100%{transform:scaleX(0.82)}50%{transform:scaleX(1)}}
@keyframes vibeui-integrations-002-orbit{to{transform:rotate(360deg)}}
@keyframes vibeui-integrations-002-counter{to{transform:translate(-50%,-50%) rotate(-360deg)}}
@keyframes vibeui-integrations-002-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="integrations-002"] [data-part="glow"]{animation:none;transform:scaleX(0.92)}
[data-vibeui-block="integrations-002"] [data-part="hub"]{animation:none}
[data-vibeui-block="integrations-002"] [data-part="ring"]{animation:none}
[data-vibeui-block="integrations-002"] [data-part="satellite"]{animation:none}
}
`

const DEFAULT_SATELLITES: Integrations002Satellite[] = [
  { label: "Почта" },
  { label: "Чат" },
  { label: "Платежи" },
  { label: "Хранилище" },
  { label: "Аналитика" },
]

const HUB_MARK = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3 20 8v8l-8 5-8-5V8l8-5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.4" fill="currentColor" />
  </svg>
)

/** Простые абстрактные значки-плашки для спутников (без брендов). */
function satelliteMark(index: number) {
  const k = index % 6
  const props = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }

  if (k === 0) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="6" {...props} fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (k === 1) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6" y="6" width="12" height="12" rx="3" fill="currentColor" />
      </svg>
    )
  }

  if (k === 2) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="6.5"
          y="6.5"
          width="11"
          height="11"
          rx="2"
          fill="currentColor"
          transform="rotate(45 12 12)"
        />
      </svg>
    )
  }

  if (k === 3) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <polygon points="12,5 19,18 5,18" fill="currentColor" />
      </svg>
    )
  }

  if (k === 4) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <polygon
          points="12,4 19,8 19,16 12,20 5,16 5,8"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="10.5" y="5" width="3" height="14" rx="1.5" fill="currentColor" />
      <rect x="5" y="10.5" width="14" height="3" rx="1.5" fill="currentColor" />
    </svg>
  )
}

/**
 * Орбита логотипов: центральный значок бренда, вокруг него по кругу
 * вращаются значки сервисов, оставаясь прямыми за счёт обратного вращения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Integrations002({
  title = "Интеграции",
  badge = "5 сервисов",
  satellites = DEFAULT_SATELLITES,
  accent,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: Integrations002Props) {
  const palette = {
    ...(accent ? { "--vibeui-integrations-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const count = Math.max(satellites.length, 1)

  return (
    <>
      <style href="vibeui-integrations-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="integrations-002"
        data-slot="integrations-logo-orbit"
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="head">
                <p data-part="gtitle">{title}</p>
                {badge ? <span data-part="badge">{badge}</span> : null}
              </div>
              <div data-part="body">
                <div
                  data-part="orbit"
                  role="img"
                  aria-label={`${title}: ${satellites.map((s) => s.label).join(", ")}`}
                >
                  <span data-part="path" aria-hidden="true" />
                  <span data-part="hub" aria-hidden="true">
                    {HUB_MARK}
                  </span>
                  {satellites.map((satellite, index) => (
                    <span
                      key={satellite.label}
                      data-part="ring"
                      aria-hidden="true"
                      style={
                        {
                          "--vibeui-integrations-002-i": index,
                          "--vibeui-integrations-002-n": count,
                        } as CSSProperties
                      }
                    >
                      <span
                        data-part="satellite"
                        style={
                          {
                            "--vibeui-integrations-002-i": index,
                            "--vibeui-integrations-002-n": count,
                            "--vibeui-integrations-002-satcolor": `var(--vibeui-integrations-002-n${(index % 6) + 1})`,
                          } as CSSProperties
                        }
                      >
                        {satelliteMark(index)}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
