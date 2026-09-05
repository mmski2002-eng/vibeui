import type { ComponentProps, CSSProperties } from "react"

export type Files004Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  fileName?: string
  fileSize?: string
  accent?: string
  /** Циклическая демонстрация загрузки. false — зона стоит в состоянии ожидания. */
  animate?: boolean
}

// Идея: зона загрузки с пунктирной рамкой, которая мягко дышит в ожидании
// файла. Один бесконечный цикл разыгрывает всю историю: ожидание → рамка
// становится сплошной и полоса прогресса растёт до 100% → галочка успеха →
// пауза → возврат к ожиданию. Все фазы завязаны на одну длительность, чтобы
// прогресс, подписи и иконка переключались синхронно, без JS и таймеров.
const STYLES = `
:where([data-vibeui-block="files-004"]){
--vibeui-files-004-zone:light-dark(oklch(0.976 0 0),oklch(0.225 0 0));
--vibeui-files-004-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-files-004-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-files-004-muted:color-mix(in oklab,var(--vibeui-files-004-fg) 58%,transparent);
--vibeui-files-004-border:light-dark(oklch(0.78 0 0),oklch(0.42 0 0));
--vibeui-files-004-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-files-004-success:light-dark(oklch(0.62 0.16 148),oklch(0.72 0.15 148));
--vibeui-files-004-track:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-files-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="files-004"]{color-scheme:dark}
[data-vibeui-block="files-004"]{
display:block;box-sizing:border-box;width:100%;max-width:16rem;margin:0;
color:var(--vibeui-files-004-fg);font-family:var(--vibeui-files-004-font);
}
[data-vibeui-block="files-004"] *{box-sizing:border-box}
[data-vibeui-block="files-004"] [data-part="zone"]{
position:relative;display:flex;flex-direction:column;align-items:center;gap:0.5rem;
padding:1.25rem 1rem;border-radius:1rem;text-align:center;
border:1.5px dashed var(--vibeui-files-004-border);
background:var(--vibeui-files-004-zone);
animation:vibeui-files-004-pulse 2.4s ease-in-out infinite,vibeui-files-004-border 6s linear infinite;
}
[data-vibeui-block="files-004"][data-animate="false"] [data-part="zone"]{
animation:none;box-shadow:none;
}
[data-vibeui-block="files-004"] [data-part="icons"]{position:relative;width:2.25rem;height:2.25rem}
[data-vibeui-block="files-004"] [data-part="icons"] svg{
position:absolute;inset:0;margin:auto;width:2.25rem;height:2.25rem;color:var(--vibeui-files-004-accent);
}
[data-vibeui-block="files-004"] [data-part="cloud"]{animation:vibeui-files-004-cloud 6s linear infinite}
[data-vibeui-block="files-004"] [data-part="check"]{
color:var(--vibeui-files-004-success);
animation:vibeui-files-004-check 6s linear infinite;
}
[data-vibeui-block="files-004"][data-animate="false"] [data-part="cloud"]{animation:none;opacity:1}
[data-vibeui-block="files-004"][data-animate="false"] [data-part="check"]{animation:none;opacity:0}
[data-vibeui-block="files-004"] [data-part="captions"]{position:relative;min-height:2rem;width:100%}
[data-vibeui-block="files-004"] [data-part="caption"]{
position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.125rem;
}
[data-vibeui-block="files-004"] [data-part="hint"]{margin:0;font-size:0.6875rem;font-weight:600}
[data-vibeui-block="files-004"] [data-part="sub"]{margin:0;font-size:0.5938rem;color:var(--vibeui-files-004-muted)}
[data-vibeui-block="files-004"] [data-part="caption"][data-id="idle"]{animation:vibeui-files-004-idle-text 6s linear infinite}
[data-vibeui-block="files-004"] [data-part="caption"][data-id="busy"]{animation:vibeui-files-004-busy-text 6s linear infinite}
[data-vibeui-block="files-004"] [data-part="caption"][data-id="done"]{animation:vibeui-files-004-done-text 6s linear infinite}
[data-vibeui-block="files-004"][data-animate="false"] [data-part="caption"][data-id="idle"]{animation:none;opacity:1}
[data-vibeui-block="files-004"][data-animate="false"] [data-part="caption"][data-id="busy"]{animation:none;opacity:0}
[data-vibeui-block="files-004"][data-animate="false"] [data-part="caption"][data-id="done"]{animation:none;opacity:0}
[data-vibeui-block="files-004"] [data-part="row"]{
width:100%;display:flex;flex-direction:column;gap:0.3125rem;
animation:vibeui-files-004-row 6s linear infinite;
}
[data-vibeui-block="files-004"][data-animate="false"] [data-part="row"]{animation:none;opacity:0}
[data-vibeui-block="files-004"] [data-part="track"]{
position:relative;width:100%;height:0.3125rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-files-004-track);
}
[data-vibeui-block="files-004"] [data-part="fill"]{
position:absolute;inset:0;width:0%;border-radius:9999px;
background:linear-gradient(90deg,var(--vibeui-files-004-accent),var(--vibeui-files-004-success));
animation:vibeui-files-004-fill 6s linear infinite;
}
[data-vibeui-block="files-004"][data-animate="false"] [data-part="fill"]{animation:none;width:0%}
@keyframes vibeui-files-004-pulse{
0%,100%{box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-files-004-accent) 22%,transparent)}
50%{box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-files-004-accent) 0%,transparent)}
}
@keyframes vibeui-files-004-border{
0%,68%{border-color:var(--vibeui-files-004-border);border-style:dashed}
74%,90%{border-color:var(--vibeui-files-004-success);border-style:solid}
96%,100%{border-color:var(--vibeui-files-004-border);border-style:dashed}
}
@keyframes vibeui-files-004-cloud{
0%,66%{opacity:1;transform:scale(1)}
74%,94%{opacity:0;transform:scale(0.7)}
100%{opacity:1;transform:scale(1)}
}
@keyframes vibeui-files-004-check{
0%,66%{opacity:0;transform:scale(0.6)}
76%{opacity:1;transform:scale(1.12)}
84%,90%{opacity:1;transform:scale(1)}
96%,100%{opacity:0;transform:scale(0.6)}
}
@keyframes vibeui-files-004-idle-text{
0%,10%{opacity:1}18%,96%{opacity:0}100%{opacity:1}
}
@keyframes vibeui-files-004-busy-text{
0%,16%{opacity:0}22%,66%{opacity:1}72%,100%{opacity:0}
}
@keyframes vibeui-files-004-done-text{
0%,72%{opacity:0}78%,90%{opacity:1}96%,100%{opacity:0}
}
@keyframes vibeui-files-004-row{
0%,14%{opacity:0}20%,88%{opacity:1}94%,100%{opacity:0}
}
@keyframes vibeui-files-004-fill{
0%,18%{width:0%}68%{width:100%}100%{width:100%}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="files-004"] [data-part="zone"]{animation:none}
[data-vibeui-block="files-004"] [data-part="cloud"]{animation:none;opacity:1}
[data-vibeui-block="files-004"] [data-part="check"]{animation:none;opacity:0}
[data-vibeui-block="files-004"] [data-part="caption"][data-id="idle"]{animation:none;opacity:1}
[data-vibeui-block="files-004"] [data-part="caption"][data-id="busy"]{animation:none;opacity:0}
[data-vibeui-block="files-004"] [data-part="caption"][data-id="done"]{animation:none;opacity:0}
[data-vibeui-block="files-004"] [data-part="row"]{animation:none;opacity:0}
[data-vibeui-block="files-004"] [data-part="fill"]{animation:none;width:0%}
}
`

const CLOUD_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    data-part="cloud"
  >
    <path d="M7 18a4.6 4.4 0 0 1-1.3-9 5.5 5.4 0 0 1 10.6-1.7A5 5 0 0 1 22 12.5a4.5 4.5 0 0 1-4.5 5.5" />
    <path d="M12 12v8m0-8 3 3m-3-3-3 3" />
  </svg>
)

const CHECK_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    data-part="check"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.5 2.5 5-5" />
  </svg>
)

/**
 * Зона загрузки файла: пунктирная рамка дышит в ожидании, при загрузке
 * полоса прогресса растёт до 100%, затем — галочка успеха. Один бесконечный
 * цикл без JS, один файл, ноль зависимостей.
 */
export function Files004({
  fileName = "Презентация.pdf",
  fileSize = "2.4 МБ",
  accent,
  animate = true,
  className,
  style,
  ...props
}: Files004Props) {
  const palette = {
    ...(accent ? { "--vibeui-files-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-files-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="files-004"
        data-slot="file-upload"
        data-animate={animate ? undefined : "false"}
        aria-label="Загрузка файла"
        className={className}
        style={palette}
      >
        <div data-part="zone">
          <span data-part="icons" aria-hidden="true">
            {CLOUD_ICON}
            {CHECK_ICON}
          </span>
          <div data-part="captions">
            <p data-part="caption" data-id="idle">
              <span data-part="hint">Перетащите файл сюда</span>
              <span data-part="sub">или нажмите, чтобы выбрать</span>
            </p>
            <p data-part="caption" data-id="busy">
              <span data-part="hint">{fileName}</span>
              <span data-part="sub">Загрузка… {fileSize}</span>
            </p>
            <p data-part="caption" data-id="done">
              <span data-part="hint">Готово</span>
              <span data-part="sub">{fileName} загружен</span>
            </p>
          </div>
          <div data-part="row">
            <div data-part="track">
              <div data-part="fill" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
