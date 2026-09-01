"use client"

import { useState } from "react"

/**
 * Макеты концептов для рабочей области. Не registry-код: пока концепт не
 * согласован, в `registry/` он не попадает.
 *
 * Каждый концепт несёт две палитры. Тёмная не инверсия светлой: на тёмном не
 * работают тени наружу и «бумажные» приёмы, поэтому глубина набирается
 * свечением и разницей светлот, а не тем же рецептом с обратным знаком.
 */

export type LabTheme = "light" | "dark"

type Item = { question: string; answer: string }

// Контент общий для всех четырёх: концепты сравниваются по дизайну,
// а не по длине текста. Копия взята из accordion-001.
const ITEMS: Item[] = [
  {
    question: "Что именно я получаю после установки?",
    answer:
      "Один файл компонента в вашем проекте. Тот же самый, который вы видели в превью: ни сборки, ни обёрток, ни привязки к нашей теме.",
  },
  {
    question: "А если у меня своя дизайн-система?",
    answer:
      "Компонент несёт собственную палитру в локальных переменных. Переопределите их — и он встанет в вашу тему, не трогая остальной проект.",
  },
  {
    question: "Нужно ли ставить дополнительные библиотеки?",
    answer:
      "Нет. Зависимости объявлены в метаданных каждого компонента, и у большинства их ноль: только React.",
  },
]

const SANS =
  'ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif'

/**
 * Тёмные токены пишутся один раз и раскладываются в два селектора: системный
 * (для `theme="auto"`) и явный. Явный всегда выигрывает у системного, поэтому
 * переключатель работает в обе стороны, а не только «темнее системы».
 */
function withDarkPalette(lab: string, darkTokens: string): string {
  return `
@media (prefers-color-scheme:dark){
[data-lab="${lab}"]:not([data-theme="light"]){${darkTokens}}
}
[data-lab="${lab}"][data-theme="dark"]{${darkTokens}}
`
}

/* ------------------------------------------------------------------ */
/* 01. Клавиша                                                         */
/* ------------------------------------------------------------------ */

// Тёмная клавиатура — не осветлённая светлая: нижняя грань из светлой тени
// становится провалом, а индикатор набирает свечение, потому что тень на
// тёмном не читается.
const KEYBED_DARK = `
--kb-ground:oklch(0.195 0.006 265);
--kb-key:oklch(0.255 0.007 265);
--kb-key-down:oklch(0.215 0.006 265);
--kb-edge:oklch(0.14 0.005 265);
--kb-ink:oklch(0.93 0.004 265);
--kb-muted:oklch(0.66 0.008 265);
--kb-accent:oklch(0.72 0.16 258);
--kb-press:oklch(0 0 0 / 0.5);
--kb-led-glow:0 0 6px oklch(0.72 0.16 258 / 0.55);
`

const KEYBED_CSS = `
[data-lab="keybed"]{
--kb-ground:oklch(0.94 0.005 85);
--kb-key:oklch(0.995 0.002 85);
--kb-key-down:oklch(0.965 0.004 85);
--kb-edge:oklch(0.86 0.008 85);
--kb-ink:oklch(0.22 0.012 265);
--kb-muted:oklch(0.52 0.01 265);
--kb-accent:oklch(0.52 0.18 258);
--kb-press:oklch(0.6 0.01 85 / 0.22);
--kb-led-glow:0 0 0 transparent;
display:flex;flex-direction:column;gap:2px;
width:100%;max-width:44rem;box-sizing:border-box;
padding:2px;border-radius:8px;
background:var(--kb-ground);color:var(--kb-ink);
font-family:${SANS};container-type:inline-size;
}
${withDarkPalette("keybed", KEYBED_DARK)}
[data-lab="keybed"] details{
background:var(--kb-key);border-radius:6px;
box-shadow:0 2px 0 var(--kb-edge);
transition:transform .14s ease,box-shadow .14s ease,background .14s ease;
}
[data-lab="keybed"] details[open]{
background:var(--kb-key-down);transform:translateY(2px);
box-shadow:inset 0 2px 3px var(--kb-press);
}
[data-lab="keybed"] details:not([open]):hover{
transform:translateY(-1px);box-shadow:0 3px 0 var(--kb-edge);
}
[data-lab="keybed"] details:has(summary:focus-visible){
box-shadow:inset 0 0 0 2px var(--kb-accent);
}
[data-lab="keybed"] summary{
display:flex;align-items:center;gap:0.75rem;
padding:0.875rem 1rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:500;letter-spacing:-0.01em;line-height:1.35;
}
[data-lab="keybed"] summary::-webkit-details-marker{display:none}
[data-lab="keybed"] summary:focus-visible{outline:none}
[data-lab="keybed"] [data-part="led"]{
width:0.5625rem;height:0.5625rem;flex:none;border-radius:2px;
box-shadow:inset 0 0 0 1.5px var(--kb-muted);
transition:box-shadow .14s ease,background .14s ease;
}
[data-lab="keybed"] details:not([open]):hover [data-part="led"]{
box-shadow:inset 0 0 0 2px var(--kb-ink);
}
[data-lab="keybed"] details[open] [data-part="led"]{
background:var(--kb-accent);
box-shadow:inset 0 0 0 1.5px var(--kb-accent),var(--kb-led-glow);
}
[data-lab="keybed"] [data-part="answer"]{
margin:0;padding:0 1rem 0.9375rem 2.3125rem;
font-size:0.875rem;line-height:1.65;color:var(--kb-muted);
}
@container (min-width:32rem){
[data-lab="keybed"] summary{padding:1rem 1.1875rem;font-size:1rem}
[data-lab="keybed"] [data-part="answer"]{padding:0 1.1875rem 1.0625rem 2.5rem;font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-lab="keybed"] *{transition:none!important}}
`

function Keybed({ group, theme }: { group: string; theme: LabTheme }) {
  return (
    <>
      <style href="lab-keybed" precedence="medium">
        {KEYBED_CSS}
      </style>
      <div data-lab="keybed" data-theme={theme}>
        {ITEMS.map((item, index) => (
          <details key={item.question} name={group} open={index === 0}>
            <summary>
              <span data-part="led" aria-hidden="true" />
              {item.question}
            </summary>
            <p data-part="answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 02. Диафрагма                                                       */
/* ------------------------------------------------------------------ */

// В тёмном режиме физика переворачивается честно: на светлом вырез впускает
// свет и колодец светлее плашки, на тёмном он уходит в темноту, а кромку
// выреза ловит блик сверху.
const APERTURE_DARK = `
--ap-slab:oklch(0.265 0.008 85);
--ap-slab-hi:oklch(0.305 0.009 85);
--ap-well:oklch(0.175 0.006 85);
--ap-ink:oklch(0.95 0.004 85);
--ap-muted:oklch(0.7 0.008 85);
--ap-edge:oklch(0.325 0.01 85);
--ap-well-shadow:inset 0 1px 0 oklch(1 0 0 / 0.09),inset 0 2px 4px oklch(0 0 0 / 0.45);
`

const APERTURE_CSS = `
[data-lab="aperture"]{
--ap-slab:oklch(0.885 0.009 85);
--ap-slab-hi:oklch(0.912 0.009 85);
--ap-well:oklch(0.99 0.002 85);
--ap-ink:oklch(0.2 0.012 85);
--ap-muted:oklch(0.42 0.01 85);
--ap-edge:oklch(0.82 0.012 85);
--ap-well-shadow:inset 0 1px 2px oklch(0.5 0.01 85 / .18);
width:100%;max-width:44rem;box-sizing:border-box;overflow:hidden;
border-radius:4px;background:var(--ap-slab);color:var(--ap-ink);
font-family:${SANS};container-type:inline-size;
}
${withDarkPalette("aperture", APERTURE_DARK)}
[data-lab="aperture"] details + details{border-top:1px solid var(--ap-edge)}
[data-lab="aperture"] summary{
display:flex;align-items:center;gap:0.875rem;
padding:1rem 1.125rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:600;letter-spacing:-0.015em;line-height:1.35;
transition:background .14s ease;
}
[data-lab="aperture"] summary::-webkit-details-marker{display:none}
[data-lab="aperture"] summary:hover{background:var(--ap-slab-hi)}
[data-lab="aperture"] summary:focus-visible{outline:2px solid var(--ap-ink);outline-offset:-3px}
/* Маркер — уменьшенная модель выреза: щель раскрывается в окно. */
[data-lab="aperture"] [data-part="slit"]{
width:0.875rem;height:2px;flex:none;border-radius:1px;
background:var(--ap-ink);opacity:.55;
transition:width .18s ease,height .18s ease,opacity .18s ease,background .18s ease,box-shadow .18s ease;
}
[data-lab="aperture"] summary:hover [data-part="slit"]{width:1.125rem;opacity:.8}
[data-lab="aperture"] details[open] [data-part="slit"]{
height:0.5625rem;border-radius:1.5px;opacity:1;
background:var(--ap-well);box-shadow:inset 0 0 0 1.5px var(--ap-ink);
}
[data-lab="aperture"] [data-part="answer"]{
margin:0 0.625rem 0.625rem;padding:0.8125rem 0.9375rem;
border-radius:3px;background:var(--ap-well);
box-shadow:var(--ap-well-shadow);
font-size:0.875rem;line-height:1.65;color:var(--ap-muted);
}
@container (min-width:32rem){
[data-lab="aperture"] summary{padding:1.125rem 1.375rem;font-size:1rem}
[data-lab="aperture"] [data-part="answer"]{margin:0 0.8125rem 0.8125rem;padding:0.9375rem 1.125rem;font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-lab="aperture"] *{transition:none!important}}
`

function Aperture({ group, theme }: { group: string; theme: LabTheme }) {
  return (
    <>
      <style href="lab-aperture" precedence="medium">
        {APERTURE_CSS}
      </style>
      <div data-lab="aperture" data-theme={theme}>
        {ITEMS.map((item, index) => (
          <details key={item.question} name={group} open={index === 0}>
            <summary>
              <span data-part="slit" aria-hidden="true" />
              {item.question}
            </summary>
            <p data-part="answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 03. Подсветка                                                       */
/* ------------------------------------------------------------------ */

// Подсветка не гасится в тёмной теме: браузер в тёмном режиме тоже красит
// найденное ярким пигментом, а текст внутри переводит в тёмный. Концепт
// повторяет это поведение, иначе перестал бы читаться как find-in-page.
const FIND_DARK = `
--fd-bg:oklch(0.19 0.005 265);
--fd-ink:oklch(0.95 0.004 265);
--fd-muted:oklch(0.68 0.008 265);
--fd-hl:oklch(0.86 0.17 100);
--fd-hl-ink:oklch(0.2 0.02 100);
`

const FIND_CSS = `
[data-lab="find"]{
--fd-bg:oklch(1 0 0);
--fd-ink:oklch(0.18 0.006 265);
--fd-muted:oklch(0.5 0.008 265);
--fd-hl:oklch(0.93 0.155 105);
--fd-hl-ink:oklch(0.18 0.006 265);
width:100%;max-width:44rem;box-sizing:border-box;
padding:1.375rem 1.5rem;background:var(--fd-bg);color:var(--fd-ink);
font-family:${SANS};container-type:inline-size;
}
${withDarkPalette("find", FIND_DARK)}
[data-lab="find"] details{padding:0.375rem 0}
[data-lab="find"] details + details{margin-top:0.375rem}
[data-lab="find"] summary{
display:flex;align-items:baseline;gap:0.6875rem;cursor:pointer;list-style:none;
font-size:1.0625rem;font-weight:500;letter-spacing:-0.015em;line-height:1.45;
}
[data-lab="find"] summary::-webkit-details-marker{display:none}
[data-lab="find"] summary:focus-visible{outline:2px solid var(--fd-ink);outline-offset:3px;border-radius:2px}
/* Каретка — курсор, стоящий на найденной строке. */
[data-lab="find"] [data-part="caret"]{
width:1px;height:1.05em;flex:none;background:var(--fd-muted);
transform:translateY(0.16em);
transition:width .12s ease,background .12s ease;
}
[data-lab="find"] details[open] [data-part="caret"]{width:2px;background:var(--fd-ink)}
[data-lab="find"] [data-part="hit"]{
padding:0.08em 0.3em;margin-left:-0.3em;background:transparent;
box-decoration-break:clone;-webkit-box-decoration-break:clone;
transition:background .14s ease,color .14s ease;
}
[data-lab="find"] summary:hover [data-part="hit"]{
background:color-mix(in oklab,var(--fd-hl) 40%,transparent);
}
[data-lab="find"] details[open] [data-part="hit"]{
background:var(--fd-hl);color:var(--fd-hl-ink);
}
[data-lab="find"] [data-part="answer"]{
margin:0.5rem 0 0;padding-left:1.4375rem;max-width:60ch;
font-size:0.9375rem;line-height:1.7;color:var(--fd-muted);
}
@container (min-width:32rem){
[data-lab="find"]{padding:1.75rem 1.875rem}
[data-lab="find"] summary{font-size:1.125rem}
}
@media (prefers-reduced-motion:reduce){[data-lab="find"] *{transition:none!important}}
`

function Find({ group, theme }: { group: string; theme: LabTheme }) {
  return (
    <>
      <style href="lab-find" precedence="medium">
        {FIND_CSS}
      </style>
      <div data-lab="find" data-theme={theme}>
        {ITEMS.map((item, index) => (
          <details key={item.question} name={group} open={index === 0}>
            <summary>
              <span data-part="caret" aria-hidden="true" />
              <span data-part="hit">{item.question}</span>
            </summary>
            <p data-part="answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 04. Системный                                                       */
/* ------------------------------------------------------------------ */

// Треугольник рисует браузер, но его цвет — наш: ::marker принимает color.
// В тёмном режиме бирюза выводится в светлоту, иначе маркер пропадает.
const NATIVE_DARK = `
--nt-bg:oklch(0.19 0.006 250);
--nt-ink:oklch(0.94 0.005 255);
--nt-muted:oklch(0.66 0.01 255);
--nt-rule:oklch(0.31 0.01 250);
--nt-marker:oklch(0.75 0.11 195);
`

const NATIVE_CSS = `
[data-lab="native"]{
--nt-bg:oklch(0.985 0.003 250);
--nt-ink:oklch(0.2 0.016 255);
--nt-muted:oklch(0.47 0.013 255);
--nt-rule:oklch(0.9 0.009 250);
--nt-marker:oklch(0.5 0.095 195);
width:100%;max-width:44rem;box-sizing:border-box;
padding:0.5rem 1.5rem 1.25rem;background:var(--nt-bg);color:var(--nt-ink);
font-family:${SANS};container-type:inline-size;
}
${withDarkPalette("native", NATIVE_DARK)}
/* Браузерный треугольник не прячется: он и есть механизм компонента. */
[data-lab="native"] summary{
display:list-item;list-style-position:outside;
margin-left:1rem;padding:1.0625rem 0 1.0625rem 0.375rem;cursor:pointer;
font-size:1rem;font-weight:500;letter-spacing:-0.01em;line-height:1.45;
border-bottom:1px solid var(--nt-rule);
transition:padding-left .14s ease,box-shadow .14s ease;
}
[data-lab="native"] summary::marker{color:var(--nt-marker);font-size:0.85em}
[data-lab="native"] summary:hover{padding-left:0.75rem}
[data-lab="native"] details[open] summary{box-shadow:0 1px 0 var(--nt-ink)}
[data-lab="native"] summary:focus-visible{outline:2px solid var(--nt-marker);outline-offset:2px}
[data-lab="native"] [data-part="answer"]{
margin:0;padding:0.875rem 0 1.125rem 1.375rem;max-width:66ch;
font-size:0.875rem;line-height:1.75;color:var(--nt-muted);
}
@container (min-width:32rem){
[data-lab="native"]{padding:0.75rem 1.875rem 1.5rem}
[data-lab="native"] summary{font-size:1.0625rem}
[data-lab="native"] [data-part="answer"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-lab="native"] *{transition:none!important}}
`

function Native({ group, theme }: { group: string; theme: LabTheme }) {
  return (
    <>
      <style href="lab-native" precedence="medium">
        {NATIVE_CSS}
      </style>
      <div data-lab="native" data-theme={theme}>
        {ITEMS.map((item, index) => (
          <details key={item.question} name={group} open={index === 0}>
            <summary>{item.question}</summary>
            <p data-part="answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </>
  )
}

const RENDERERS: Record<
  string,
  (props: { group: string; theme: LabTheme }) => React.ReactNode
> = {
  keybed: Keybed,
  aperture: Aperture,
  find: Find,
  native: Native,
}

/* ------------------------------------------------------------------ */

function ThemeToggle({
  theme,
  onChange,
}: {
  theme: LabTheme
  onChange: (next: LabTheme) => void
}) {
  return (
    <div
      role="group"
      aria-label="Режим превью"
      className="border-shell-border inline-flex rounded-full border p-0.5"
    >
      {(["light", "dark"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          onClick={() => onChange(value)}
          className={
            theme === value
              ? "bg-shell-accent text-shell-accent-fg focus-visible:ring-shell-ring rounded-full px-3 py-1 text-xs font-medium focus-visible:ring-2 focus-visible:outline-none"
              : "text-shell-muted hover:text-shell-fg focus-visible:ring-shell-ring rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          }
        >
          {value === "light" ? "Светлый" : "Тёмный"}
        </button>
      ))}
    </div>
  )
}

/**
 * Кадры одного концепта. Переключатель меняет и подложку кадра, и палитру
 * самого компонента: смысл двух режимов в том, что компонент несёт вторую
 * палитру, а не в том, что вокруг него поменяли фон.
 */
export function ConceptPreview({ id }: { id: string }) {
  const [theme, setTheme] = useState<LabTheme>("light")
  const Concept = RENDERERS[id]

  if (!Concept) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <ThemeToggle theme={theme} onChange={setTheme} />
        <span className="text-shell-muted text-xs">
          подложка и палитра компонента переключаются вместе
        </span>
      </div>

      <figure className="m-0 flex flex-col gap-2">
        <div
          data-preview-theme={theme}
          className="bg-preview-surface border-shell-card-strong flex items-center justify-center overflow-hidden rounded-xl border p-5"
        >
          <Concept group={`${id}-main`} theme={theme} />
        </div>
        <figcaption className="text-shell-muted text-xs">
          Живой макет
        </figcaption>
      </figure>

      <figure className="m-0 flex max-w-md flex-col gap-2">
        <div
          data-preview-theme={theme}
          className="bg-preview-surface border-shell-card-strong relative aspect-video overflow-hidden rounded-xl border"
        >
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-5">
            <Concept group={`${id}-card`} theme={theme} />
          </div>
        </div>
        <figcaption className="text-shell-muted text-xs">
          Кадр карточки каталога, 16/9
        </figcaption>
      </figure>
    </div>
  )
}
