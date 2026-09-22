import type { CSSProperties } from "react"
import { Badge032 } from "@/registry/components/badge/badge-032/badge-032"

export type Logocloud007Props = {
  label?: string
  /** Названия компаний текстом; каждое — своим весом по очереди. */
  names?: readonly string[]
  /** Секунд на полный круг. */
  speed?: number
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Работал с»: названия компаний текстом бегущей строкой — без логотипов,
// которые вечно не в том цвете. Вес и стиль чередуются (жирный гротеск,
// лёгкий, моноширинный, курсив), между ними точка акцентом; по наведению
// лента останавливается. Дубль для бесшовности, всё на CSS.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400;0,800;1,500&family=IBM+Plex+Mono:wght@500&display=swap"

const STYLES = `
:where([data-vibeui-block="logocloud-007"]){
--vibeui-logocloud-007-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-logocloud-007-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-logocloud-007-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-logocloud-007-muted:color-mix(in oklab,var(--vibeui-logocloud-007-fg) 60%,var(--vibeui-logocloud-007-bg));
--vibeui-logocloud-007-line:color-mix(in oklab,var(--vibeui-logocloud-007-fg) 12%,transparent);
--vibeui-logocloud-007-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-logocloud-007-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="logocloud-007"]{color-scheme:dark}
:where([data-vibeui-block="logocloud-007"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="logocloud-007"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="logocloud-007"]{box-sizing:border-box;overflow:hidden;padding:2.5rem 0;background:var(--vibeui-logocloud-007-bg);color:var(--vibeui-logocloud-007-fg);font-family:var(--vibeui-logocloud-007-display);border-top:1px solid var(--vibeui-logocloud-007-line);border-bottom:1px solid var(--vibeui-logocloud-007-line)}
[data-vibeui-block="logocloud-007"] *{box-sizing:border-box}
[data-vibeui-block="logocloud-007"] [data-part="label"]{max-width:80rem;margin:0 auto 1rem;padding:0 1.25rem;font-family:var(--vibeui-logocloud-007-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-logocloud-007-muted)}
[data-vibeui-block="logocloud-007"] [data-part="lane"]{display:flex;align-items:center;width:max-content;animation:vibeui-logocloud-007-run var(--vibeui-logocloud-007-s) linear infinite}
[data-vibeui-block="logocloud-007"] [data-part="lane"]:hover{animation-play-state:paused}
@keyframes vibeui-logocloud-007-run{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="logocloud-007"] [data-part="lane"]{animation:none!important;flex-wrap:wrap;width:auto;padding:0 1.25rem;gap:.6rem 0}}`

/** «Работал с»: названия текстом бегущей строкой с чередованием начертаний. */
export function Logocloud007({
  label = "работал с",
  names = ["Яндекс Лавка", "Точка", "Skyeng", "Ozon", "Кухня на районе", "Самокат", "Tinkoff", "Delivery Club", "Авито", "Циан"],
  speed = 40,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Logocloud007Props) {
  const tape = [...names, ...names]
  const palette = {
    "--vibeui-logocloud-007-s": `${speed}s`,
    ...(accent ? { "--vibeui-logocloud-007-accent": accent } : null),
    ...(ink ? { "--vibeui-logocloud-007-fg": ink } : null),
    ...(background ? { "--vibeui-logocloud-007-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-logocloud-007" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="logocloud-007" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette} aria-label={label}>
        {label ? <p data-part="label">{label}</p> : null}
        <div data-part="lane">
          {tape.map((name, index) => (
            <Badge032 key={`${name}-${index}`} data-part="name" name={name} data-kind={index % 4} aria-hidden={index >= names.length} accent={accent} />
          ))}
        </div>
      </section>
    </>
  )
}
