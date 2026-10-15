"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type House004Stage = { title: string; weeks: string; text: string; image: string }

export type House004Props = {
  eyebrow?: string
  title?: string
  stages?: readonly House004Stage[]
  totalLabel?: string
  total?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Этапы стройки: справа список шагов, слева на липкой сцене фото текущего
// этапа — кадры сменяются наплывом с лёгким увеличением. Активный шаг
// выбирается тем, какой пункт пересёк середину экрана; вертикальная нить
// слева от списка заливается до него янтарём.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const S = '[data-vibeui-block="house-004"]'
const STYLES = `
:where(${S}){
--vibeui-house-004-bg:light-dark(#ebe7e0,#121315);
--vibeui-house-004-fg:light-dark(#16181a,#f2efe9);
--vibeui-house-004-accent:#e8a35c;
--vibeui-house-004-muted:color-mix(in oklab,var(--vibeui-house-004-fg) 58%,transparent);
--vibeui-house-004-line:color-mix(in oklab,var(--vibeui-house-004-fg) 12%,transparent);
--vibeui-house-004-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-house-004-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) ${S}{color-scheme:dark}
:where(${S}[data-tone="light"]){color-scheme:light}
:where(${S}[data-tone="dark"]){color-scheme:dark}
${S}{padding:clamp(4rem,9cqi,7.5rem) 0;background:var(--vibeui-house-004-bg);color:var(--vibeui-house-004-fg);font-family:var(--vibeui-house-004-font)}
${S} *{box-sizing:border-box}
${S} [data-part="shell"]{max-width:90rem;margin:0 auto;padding:0 clamp(1rem,3cqi,2.5rem)}
${S} [data-part="head"]{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:1.5rem;margin-bottom:3rem}
${S} [data-part="eyebrow"]{display:flex;align-items:center;gap:.7rem;margin:0 0 1rem;font-family:var(--vibeui-house-004-mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-house-004-muted)}
${S} [data-part="eyebrow"]::before{content:"";width:1.6rem;height:1px;background:var(--vibeui-house-004-accent)}
${S} [data-part="title"]{margin:0;max-width:16ch;font-weight:300;font-size:clamp(2.2rem,5.6cqi,4.6rem);line-height:1;letter-spacing:-.04em}
${S} [data-part="total"]{font-family:var(--vibeui-house-004-mono);font-size:.75rem;color:var(--vibeui-house-004-muted)}
${S} [data-part="total"] b{display:block;font-size:2.4rem;font-weight:500;letter-spacing:-.04em;color:var(--vibeui-house-004-accent)}
${S} [data-part="grid"]{display:grid;gap:2rem}
${S} [data-part="sticky"]{display:none}
${S} [data-part="frame"]{position:relative;aspect-ratio:4/3;margin:0;border-radius:1.6rem;overflow:hidden;background:var(--vibeui-house-004-line)}
${S} [data-part="frame"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.08);transition:opacity 1s cubic-bezier(.4,0,.2,1),transform 1.6s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="frame"] img[data-on="true"]{opacity:1;transform:none}
${S} [data-part="frame"]::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgb(8 9 10 / .7))}
${S} [data-part="frame"] figcaption{position:absolute;left:1.2rem;right:1.2rem;bottom:1rem;z-index:1;display:flex;justify-content:space-between;align-items:baseline;color:#f2efe9}
${S} [data-part="frame"] figcaption b{font-size:clamp(1.2rem,2.2cqi,1.7rem);font-weight:400;letter-spacing:-.02em}
${S} [data-part="frame"] figcaption span{font-family:var(--vibeui-house-004-mono);font-size:.75rem;opacity:.8}
${S} [data-part="list"]{position:relative;margin:0;padding:0 0 0 2.2rem;list-style:none}
${S} [data-part="list"]::before,${S} [data-part="list"]::after{content:"";position:absolute;left:.45rem;top:.6rem;bottom:.6rem;width:1px;background:var(--vibeui-house-004-line)}
${S} [data-part="list"]::after{background:var(--vibeui-house-004-accent);transform-origin:top;transform:scaleY(var(--vibeui-house-004-fill));transition:transform .8s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="step"]{position:relative;padding:0 0 2.6rem;opacity:.38;transition:opacity .6s}
${S} [data-part="step"][data-on="true"],${S} [data-part="step"][data-done="true"]{opacity:1}
${S} [data-part="step"]::before{content:"";position:absolute;left:-2.2rem;top:.35rem;z-index:1;width:.9rem;height:.9rem;border:1px solid var(--vibeui-house-004-line);border-radius:50%;background:var(--vibeui-house-004-bg);transition:all .5s}
${S} [data-part="step"][data-on="true"]::before,${S} [data-part="step"][data-done="true"]::before{border-color:var(--vibeui-house-004-accent);background:var(--vibeui-house-004-accent);box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-house-004-accent) 18%,transparent)}
${S} [data-part="num"]{font-family:var(--vibeui-house-004-mono);font-size:.7rem;color:var(--vibeui-house-004-muted)}
${S} [data-part="step"] h3{margin:.3rem 0 0;font-size:clamp(1.3rem,2.4cqi,1.9rem);font-weight:400;letter-spacing:-.025em}
${S} [data-part="weeks"]{display:inline-block;margin-top:.5rem;padding:.25rem .6rem;border:1px solid var(--vibeui-house-004-line);border-radius:999px;font-family:var(--vibeui-house-004-mono);font-size:.68rem}
${S} [data-part="step"] p{margin:.7rem 0 0;max-width:30rem;font-size:.92rem;color:var(--vibeui-house-004-muted)}
${S} [data-part="thumb"]{display:block;width:100%;aspect-ratio:16/10;margin-top:1rem;border-radius:1rem;object-fit:cover}
@container (min-width: 60rem){${S} [data-part="grid"]{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:4rem}${S} [data-part="sticky"]{display:block;position:sticky;top:6rem;align-self:start}${S} [data-part="thumb"]{display:none}${S} [data-part="step"]{padding-bottom:min(22vh,14rem)}${S} [data-part="step"]:last-child{padding-bottom:min(55vh,30rem)}}
@media (prefers-reduced-motion:reduce){${S} *{transition:none!important}}`

const DEFAULT_STAGES: House004Stage[] = [
  { title: "Проект и смета", weeks: "2 недели", text: "Привязываем проект к участку, считаем нагрузки и фиксируем цену в договоре. Дальше она не меняется.", image: "/demo/house/p-03.webp" },
  { title: "Фундамент", weeks: "3 недели", text: "Геология, разметка, сваи или плита. Пока бетон набирает прочность, завод пилит ваш домокомплект.", image: "/demo/house/stage-01.webp" },
  { title: "Домокомплект", weeks: "4 недели", text: "Брус режут на ЧПУ по проекту с точностью до миллиметра, нумеруют и привозят упакованным в плёнку.", image: "/demo/house/stage-02.webp" },
  { title: "Сборка стен", weeks: "3 недели", text: "Брус собирают как конструктор: гребень в паз, утеплитель в стык, нагели через каждые полтора метра.", image: "/demo/house/stage-03.webp" },
  { title: "Кровля и окна", weeks: "4 недели", text: "Стропила, утепление, фальц или черепица. Панорамные окна ставим на скользящие опоры под усадку.", image: "/demo/house/stage-04.webp" },
  { title: "Инженерия и отделка", weeks: "8 недель", text: "Электрика в гофре, тёплые полы, сантехника, шлифовка и масло-воск. Каждую неделю — фотоотчёт.", image: "/demo/house/stage-05.webp" },
  { title: "Ключи", weeks: "день", text: "Сдаём по акту, передаём паспорт дома и гарантию 10 лет на конструктив.", image: "/demo/house/stage-06.webp" },
]

/** Этапы стройки с липким фото текущего этапа. */
export function House004({
  eyebrow = "Как мы строим",
  title = "Семь этапов от участка до ключей",
  stages = DEFAULT_STAGES,
  totalLabel = "в среднем под ключ",
  total = "24 нед",
  tone = "dark",
  accent,
  ink,
  background,
  className,
  style,
}: House004Props) {
  const [active, setActive] = useState(0)
  const items = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index))
        }
      },
      { rootMargin: "-35% 0px -60% 0px" },
    )
    for (const node of items.current) if (node) observer.observe(node)
    return () => observer.disconnect()
  }, [stages.length])

  const palette = {
    ...(accent ? { "--vibeui-house-004-accent": accent } : null),
    ...(ink ? { "--vibeui-house-004-fg": ink } : null),
    ...(background ? { "--vibeui-house-004-bg": background } : null),
    "--vibeui-house-004-fill": stages.length > 1 ? active / (stages.length - 1) : 1,
    ...style,
  } as CSSProperties

  const current = stages[active]

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-house-004" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="house-004" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
            </div>
            {total ? (
              <p data-part="total">
                <b>{total}</b>
                {totalLabel}
              </p>
            ) : null}
          </div>
          <div data-part="grid">
            <div data-part="sticky" aria-hidden="true">
              <figure data-part="frame">
                {stages.map((stage, stageIndex) => (
                  <img key={stage.title} src={stage.image} alt="" data-on={stageIndex === active} loading="lazy" />
                ))}
                {current ? (
                  <figcaption>
                    <b>{current.title}</b>
                    <span>
                      {String(active + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
                    </span>
                  </figcaption>
                ) : null}
              </figure>
            </div>
            <ol data-part="list">
              {stages.map((stage, stageIndex) => (
                <li
                  key={stage.title}
                  ref={(node) => {
                    items.current[stageIndex] = node
                  }}
                  data-index={stageIndex}
                  data-part="step"
                  data-on={stageIndex === active}
                  data-done={stageIndex < active}
                >
                  <span data-part="num">{String(stageIndex + 1).padStart(2, "0")}</span>
                  <h3>{stage.title}</h3>
                  <span data-part="weeks">{stage.weeks}</span>
                  <p>{stage.text}</p>
                  <img data-part="thumb" src={stage.image} alt="" loading="lazy" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}
