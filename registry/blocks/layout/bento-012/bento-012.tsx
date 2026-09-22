import type { CSSProperties } from "react"
import { Card078 } from "@/registry/components/card/card-078/card-078"
import { Chart030 } from "@/registry/components/chart/chart-030/chart-030"

export type Bento012Sensor = {
  label: string
  value: string
  /** Заполнение кольца, 0–100. */
  percent: number
}

export type Bento012Alarm = {
  time: string
  label: string
  on?: boolean
}

export type Bento012Props = {
  eyebrow?: string
  title?: string
  lede?: string
  soundTitle?: string
  soundText?: string
  soundChip?: string
  sensorsTitle?: string
  sensors?: readonly Bento012Sensor[]
  appTitle?: string
  appText?: string
  alarms?: readonly Bento012Alarm[]
  spectrumTitle?: string
  spectrumText?: string
  silentTitle?: string
  silentValue?: string
  silentText?: string
  localTitle?: string
  localText?: string
  localChips?: readonly string[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Возможности гаджета в bento: шесть плиток разного размера, в каждой
// живёт своя CSS-сцена. Звук — эквалайзер из полосок (каждая со своей
// задержкой); датчики — три кольца conic-gradient, которые заполняются
// через @property при загрузке; приложение — телефон из CSS с расписанием
// будильников и тумблером, который сам переключается; спектр — полоса
// 2700→6500 K с бегающим маркером. Плитки asymmetric: 2×2, 1×3, 2×1.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
@property --vibeui-bento-012-v{syntax:"<percentage>";inherits:false;initial-value:0%}
:where([data-vibeui-block="bento-012"]){
--vibeui-bento-012-bg:light-dark(#ffffff,#0a0a0a);
--vibeui-bento-012-fg:light-dark(#111111,#f2ede4);
--vibeui-bento-012-accent:light-dark(#111111,#f2ede4);
--vibeui-bento-012-on-accent:oklch(from var(--vibeui-bento-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-bento-012-muted:color-mix(in oklab,var(--vibeui-bento-012-fg) 60%,var(--vibeui-bento-012-bg));
--vibeui-bento-012-line:color-mix(in oklab,var(--vibeui-bento-012-fg) 12%,transparent);
--vibeui-bento-012-card:color-mix(in oklab,var(--vibeui-bento-012-fg) 5%,var(--vibeui-bento-012-bg));
--vibeui-bento-012-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-012-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-012-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bento-012"]{color-scheme:dark}
:where([data-vibeui-block="bento-012"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bento-012"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bento-012"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-bento-012-bg);color:var(--vibeui-bento-012-fg);font-family:var(--vibeui-bento-012-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="bento-012"] *{box-sizing:border-box}
[data-vibeui-block="bento-012"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bento-012"] [data-part="head"]{max-width:46rem;margin:0 0 2.5rem}
[data-vibeui-block="bento-012"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-bento-012-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-bento-012-accent)}
[data-vibeui-block="bento-012"] [data-part="title"]{margin:0;font-family:var(--vibeui-bento-012-display);font-weight:900;font-size:clamp(2rem,5.4cqi,4rem);line-height:1;letter-spacing:-.03em;text-wrap:balance}
[data-vibeui-block="bento-012"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;font-size:1.05rem;color:var(--vibeui-bento-012-muted)}
[data-vibeui-block="bento-012"] [data-part="grid"]{display:grid;gap:1rem;grid-auto-flow:dense}
[data-vibeui-block="bento-012"] [data-part="tile"]{position:relative;display:flex;flex-direction:column;gap:1rem;min-height:15rem;padding:1.5rem;border-radius:1.6rem;background:var(--vibeui-bento-012-card);border:1px solid var(--vibeui-bento-012-line);overflow:hidden;transition:transform .3s cubic-bezier(.2,.7,.2,1),border-color .3s}
[data-vibeui-block="bento-012"] [data-part="tile"]:hover{transform:translateY(-3px);border-color:color-mix(in oklab,var(--vibeui-bento-012-accent) 40%,transparent)}
[data-vibeui-block="bento-012"] [data-part="tile"] h3{margin:0;font-family:var(--vibeui-bento-012-display);font-weight:700;font-size:1.15rem;letter-spacing:-.02em}
[data-vibeui-block="bento-012"] [data-part="tile"] p{margin:0;font-size:.95rem;color:var(--vibeui-bento-012-muted)}
[data-vibeui-block="bento-012"] [data-part="chip"]{position:absolute;top:1.2rem;right:1.2rem;padding:.25rem .6rem;border-radius:999px;border:1px solid var(--vibeui-bento-012-line);font-family:var(--vibeui-bento-012-mono);font-size:.66rem;letter-spacing:.06em;color:var(--vibeui-bento-012-muted)}
[data-vibeui-block="bento-012"] [data-part="text"]{margin-top:auto;display:grid;gap:.4rem}
[data-vibeui-block="bento-012"] [data-part="eq"]{display:flex;align-items:flex-end;gap:.35rem;height:7rem;margin-top:1.5rem}
[data-vibeui-block="bento-012"] [data-part="eq"] i{flex:1;border-radius:.3rem .3rem 0 0;background:linear-gradient(180deg,var(--vibeui-bento-012-accent),color-mix(in oklab,var(--vibeui-bento-012-accent) 40%,transparent));transform-origin:bottom;transform:scaleY(var(--vibeui-bento-012-h));animation:vibeui-bento-012-eq 1.3s ease-in-out infinite alternate;animation-delay:var(--vibeui-bento-012-d);height:100%}
[data-vibeui-block="bento-012"] [data-part="rings"]{display:flex;gap:1rem;flex-wrap:wrap;margin-top:.5rem}
[data-vibeui-block="bento-012"] [data-part="phone"]{margin:.5rem auto 0;width:min(100%,13rem);border-radius:1.6rem;border:.4rem solid color-mix(in oklab,var(--vibeui-bento-012-fg) 85%,#000);background:var(--vibeui-bento-012-bg);padding:1.4rem .9rem 1rem;box-shadow:0 30px 50px -30px rgb(0 0 0/.6)}
[data-vibeui-block="bento-012"] [data-part="phone"]::before{content:"";display:block;width:2.6rem;height:.4rem;margin:-.8rem auto .8rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-bento-012-fg) 85%,#000)}
[data-vibeui-block="bento-012"] [data-part="spectrum"]{position:relative;height:1.4rem;margin-top:1.5rem;border-radius:999px;background:linear-gradient(90deg,#ff8a2a,#ffb454,#fff1d0,#dbe9ff,#b8d3ff)}
[data-vibeui-block="bento-012"] [data-part="spectrum"] i{position:absolute;top:-.3rem;left:0;right:0;height:2rem;animation:vibeui-bento-012-marker 5s cubic-bezier(.45,0,.55,1) infinite alternate}
[data-vibeui-block="bento-012"] [data-part="spectrum"] i::before{content:"";position:absolute;left:0;top:0;width:2rem;height:2rem;border-radius:50%;border:3px solid var(--vibeui-bento-012-fg);background:var(--vibeui-bento-012-bg);box-shadow:0 4px 10px rgb(0 0 0/.3)}
[data-vibeui-block="bento-012"] [data-part="scale"]{display:flex;justify-content:space-between;margin:.6rem 0 0;font-family:var(--vibeui-bento-012-mono);font-size:.66rem;color:var(--vibeui-bento-012-muted)}
[data-vibeui-block="bento-012"] [data-part="big"]{margin:auto 0 0;font-family:var(--vibeui-bento-012-display);font-weight:900;font-size:clamp(2.6rem,6cqi,4rem);line-height:1;letter-spacing:-.04em;color:var(--vibeui-bento-012-accent)}
[data-vibeui-block="bento-012"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="bento-012"] [data-part="chips"] li{padding:.35rem .7rem;border-radius:999px;background:var(--vibeui-bento-012-accent);color:var(--vibeui-bento-012-on-accent);font-family:var(--vibeui-bento-012-mono);font-size:.7rem;letter-spacing:.04em}
@keyframes vibeui-bento-012-eq{from{transform:scaleY(calc(var(--vibeui-bento-012-h) * .3))}to{transform:scaleY(var(--vibeui-bento-012-h))}}
@keyframes vibeui-bento-012-fill{from{--vibeui-bento-012-v:0%}}
@keyframes vibeui-bento-012-toggle{0%,40%{background:var(--vibeui-bento-012-line)}55%,100%{background:var(--vibeui-bento-012-accent)}}
@keyframes vibeui-bento-012-knob{0%,40%{transform:none}55%,100%{transform:translateX(.85rem)}}
@keyframes vibeui-bento-012-marker{from{transform:translateX(0)}to{transform:translateX(calc(100% - 2rem))}}
@container (min-width: 44rem){[data-vibeui-block="bento-012"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}[data-vibeui-block="bento-012"] [data-part="tile"][data-kind="sound"],[data-vibeui-block="bento-012"] [data-part="tile"][data-kind="local"]{grid-column:span 2}}
@container (min-width: 66rem){[data-vibeui-block="bento-012"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(3,minmax(14rem,auto))}[data-vibeui-block="bento-012"] [data-part="tile"][data-kind="sound"]{grid-column:span 2;grid-row:span 2}[data-vibeui-block="bento-012"] [data-part="tile"][data-kind="app"]{grid-column:4;grid-row:span 3}[data-vibeui-block="bento-012"] [data-part="tile"][data-kind="local"]{grid-column:span 2}[data-vibeui-block="bento-012"] [data-part="eq"]{height:11rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bento-012"] *{animation:none!important;transition:none!important}[data-vibeui-block="bento-012"] [data-part="spectrum"] i{transform:translateX(40%)}}`

const BAR_HEIGHTS = [0.35, 0.6, 0.45, 0.9, 0.7, 1, 0.55, 0.8, 0.4, 0.95, 0.65, 0.5, 0.85, 0.3]

/** Возможности гаджета bento: звук, датчики, приложение, спектр. */
export function Bento012({
  eyebrow = "Возможности",
  title = "Не будильник. Маленькое солнце с характером",
  lede = "Луч будит светом, а звук держит про запас. Между будильниками он следит за воздухом, подсвечивает стол и слушается телефона — или обходится без него.",
  soundTitle = "Звук, который не пугает",
  soundText = "Динамик 5 Вт на 360°: птицы, дождь, ручей, белый шум. Громкость растёт от нуля — ни одного резкого звонка. Хлопок — и тишина.",
  soundChip = "48 кГц · 5 Вт",
  sensorsTitle = "Знает, чем вы дышите",
  sensors = [
    { label: "CO₂, ppm", value: "640", percent: 32 },
    { label: "Влажность", value: "42 %", percent: 42 },
    { label: "Свет, лк", value: "320", percent: 64 },
  ],
  appTitle = "Приложение — если хочется",
  appText = "Расписание, сценарии, обновления. Без приложения Луч работает целиком: колесо на корпусе и хлопок.",
  alarms = [
    { time: "06:00", label: "Будни · рассвет 30 мин", on: true },
    { time: "08:30", label: "Суббота · птицы", on: true },
    { time: "22:30", label: "Закат · 15 мин" },
  ],
  spectrumTitle = "Весь дневной спектр",
  spectrumText = "От свечи 2700 K до полудня 6500 K. CRI 97 — цвета на столе такие же, как при окне.",
  silentTitle = "Тише, чем комната",
  silentValue = "0 дБ",
  silentText = "Ни вентилятора, ни писка блока питания. Ночью — нулевой свет: ни одного индикатора.",
  localTitle = "Работает без облака",
  localText = "Будильники и сценарии живут в лампе. Интернет нужен только для обновлений и голосовых ассистентов.",
  localChips = ["Matter", "Thread", "Wi-Fi 6", "Bluetooth 5.3"],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bento012Props) {
  const palette = {
    ...(accent ? { "--vibeui-bento-012-accent": accent } : null),
    ...(ink ? { "--vibeui-bento-012-fg": ink } : null),
    ...(background ? { "--vibeui-bento-012-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bento-012" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="bento-012" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="grid">
            <article data-part="tile" data-kind="sound">
              {soundChip ? <span data-part="chip">{soundChip}</span> : null}
              <div data-part="eq" aria-hidden="true">
                {BAR_HEIGHTS.map((height, index) => (
                  <i key={index} style={{ ["--vibeui-bento-012-h" as string]: height, ["--vibeui-bento-012-d" as string]: `${-(index * 0.17) % 1.3}s` }} />
                ))}
              </div>
              <div data-part="text">
                <h3>{soundTitle}</h3>
                <p>{soundText}</p>
              </div>
            </article>
            <article data-part="tile" data-kind="sensors">
              <div data-part="rings">
                {sensors.map((sensor) => (
                  <Chart030 key={sensor.label} data-part="ring" label={sensor.label} percent={sensor.percent} value={sensor.value} accent={accent} />
                ))}
              </div>
              <div data-part="text">
                <h3>{sensorsTitle}</h3>
              </div>
            </article>
            <article data-part="tile" data-kind="app">
              <div data-part="phone" aria-hidden="true">
                {alarms.map((alarm, index) => (
                  <Card078 key={alarm.time} data-part="alarm" time={alarm.time} label={alarm.label} on={alarm.on} live={index === alarms.length - 1} accent={accent} />
                ))}
              </div>
              <div data-part="text">
                <h3>{appTitle}</h3>
                <p>{appText}</p>
              </div>
            </article>
            <article data-part="tile" data-kind="spectrum">
              <div data-part="spectrum" aria-hidden="true">
                <i />
              </div>
              <div data-part="scale" aria-hidden="true">
                <span>2700 K</span>
                <span>4000 K</span>
                <span>6500 K</span>
              </div>
              <div data-part="text">
                <h3>{spectrumTitle}</h3>
                <p>{spectrumText}</p>
              </div>
            </article>
            <article data-part="tile" data-kind="silent">
              <p data-part="big">{silentValue}</p>
              <div data-part="text">
                <h3>{silentTitle}</h3>
                <p>{silentText}</p>
              </div>
            </article>
            <article data-part="tile" data-kind="local">
              {localChips.length > 0 ? (
                <ul data-part="chips">
                  {localChips.map((chip) => (
                    <li key={chip}>{chip}</li>
                  ))}
                </ul>
              ) : null}
              <div data-part="text">
                <h3>{localTitle}</h3>
                <p>{localText}</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
