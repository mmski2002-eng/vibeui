"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Cascader009Folder = {
  label: string
  files?: number
  locked?: boolean
  children?: Cascader009Folder[]
}

export type Cascader009Props = {
  fileName?: string
  actionLabel?: string
  tree?: Cascader009Folder[]
  /** aria-подпись группы: {file}. */
  groupText?: string
  /** Заголовок диалога перед именем файла. */
  titleText?: string
  /** Как назван корень дерева. */
  rootText?: string
  /** Подпись строки возврата на уровень выше. */
  upText?: string
  /** Приписка у заблокированной папки. */
  lockedText?: string
  /** Приписка со счётчиком файлов: {count}. */
  filesText?: string
  /** Подпись кнопки отмены. */
  cancelText?: string
  /** Подпись кнопки действия: {action} и {folder}. */
  moveText?: string
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: каскад как выбор папки назначения. Здесь важен не листовой
// узел, а любая точка дерева: положить файл можно и в промежуточную папку,
// поэтому кнопка действия работает на каждом шаге и всегда называет текущую
// папку. Строка «наверх» — отдельная цель, а не крошка: в файловых диалогах
// это привычный путь возврата. Папка-источник заблокирована: переместить
// файл туда, где он уже лежит, — пустое действие с непонятным результатом.
const STYLES = `
:where([data-vibeui-block="cascader-009"]){
--vibeui-cascader-009-bg:transparent;
--vibeui-cascader-009-panel:light-dark(oklch(0.975 0 250),oklch(0.27 0 250));
--vibeui-cascader-009-fg:light-dark(oklch(0.23 0 250),oklch(0.94 0 250));
--vibeui-cascader-009-muted:color-mix(in oklab,var(--vibeui-cascader-009-fg) 68%,transparent);
--vibeui-cascader-009-border:light-dark(oklch(0.9 0 250),oklch(0.38 0 250));
--vibeui-cascader-009-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-cascader-009-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 255));
--vibeui-cascader-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cascader-009"]{color-scheme:dark}
[data-vibeui-block="cascader-009"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-009-bg);color:var(--vibeui-cascader-009-fg);
border:1px solid var(--vibeui-cascader-009-border);border-radius:1rem;
font-family:var(--vibeui-cascader-009-font);
box-shadow:0 22px 48px -34px oklch(0.2 0 250 / 65%);
}
[data-vibeui-block="cascader-009"] *{box-sizing:border-box}
[data-vibeui-block="cascader-009"] [data-part="title"]{
margin:0;font-size:0.875rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="cascader-009"] [data-part="title"] em{
font-style:normal;color:var(--vibeui-cascader-009-accent);
}
[data-vibeui-block="cascader-009"] [data-part="where"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-cascader-009-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-009"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.125rem;margin:0;padding:0.25rem;
list-style:none;height:10.5rem;overflow:auto;overscroll-behavior:contain;
background:var(--vibeui-cascader-009-panel);
border:1px solid var(--vibeui-cascader-009-border);border-radius:0.75rem;
}
[data-vibeui-block="cascader-009"] [data-part="row"]{
display:flex;align-items:center;gap:0.5rem;width:100%;
padding:0.375rem 0.5rem;border:0;border-radius:0.5rem;
background:transparent;color:inherit;font:inherit;font-size:0.8125rem;
text-align:left;cursor:pointer;
transition:background-color .14s ease;
}
[data-vibeui-block="cascader-009"] [data-part="row"]:hover:not(:disabled){
background:color-mix(in oklab,var(--vibeui-cascader-009-accent) 10%,transparent);
}
[data-vibeui-block="cascader-009"] [data-part="row"]:focus-visible{
outline:2px solid var(--vibeui-cascader-009-accent);outline-offset:-2px;
}
[data-vibeui-block="cascader-009"] [data-part="row"]:disabled{
opacity:.45;cursor:not-allowed;
}
[data-vibeui-block="cascader-009"] [data-part="row"] span{
flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-009"] [data-part="count"]{
flex:0 0 auto;font-size:0.6875rem;color:var(--vibeui-cascader-009-muted);
}
[data-vibeui-block="cascader-009"] [data-part="icon"]{
flex:0 0 auto;width:0.875rem;height:0.6875rem;border-radius:0.1875rem 0.1875rem 0.125rem 0.125rem;
background:color-mix(in oklab,var(--vibeui-cascader-009-accent) 30%,transparent);
position:relative;
}
[data-vibeui-block="cascader-009"] [data-part="icon"]::before{
content:"";position:absolute;top:-0.1875rem;left:0;width:0.4375rem;height:0.1875rem;
border-radius:0.125rem 0.125rem 0 0;
background:color-mix(in oklab,var(--vibeui-cascader-009-accent) 30%,transparent);
}
[data-vibeui-block="cascader-009"] [data-part="up"]{
font-weight:600;color:var(--vibeui-cascader-009-muted);
}
[data-vibeui-block="cascader-009"] [data-part="up-icon"]{
flex:0 0 auto;width:0.4375rem;height:0.4375rem;
border-left:1.5px solid currentColor;border-top:1.5px solid currentColor;
transform:rotate(45deg) translate(0.0625rem,0.0625rem);
}
[data-vibeui-block="cascader-009"] [data-part="foot"]{
display:flex;gap:0.375rem;
}
[data-vibeui-block="cascader-009"] [data-part="cancel"],
[data-vibeui-block="cascader-009"] [data-part="move"]{
padding:0.5rem 0.75rem;border-radius:0.625rem;font:inherit;font-size:0.8125rem;
cursor:pointer;transition:opacity .14s ease,border-color .14s ease;
}
[data-vibeui-block="cascader-009"] [data-part="cancel"]{
border:1px solid var(--vibeui-cascader-009-border);
background:var(--vibeui-cascader-009-panel);color:var(--vibeui-cascader-009-muted);
}
[data-vibeui-block="cascader-009"] [data-part="move"]{
flex:1 1 auto;min-width:0;border:0;font-weight:600;
background:var(--vibeui-cascader-009-accent);color:oklch(from var(--vibeui-cascader-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-009"] [data-part="move"]:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="cascader-009"] [data-part="cancel"]:focus-visible,
[data-vibeui-block="cascader-009"] [data-part="move"]:focus-visible{
outline:2px solid var(--vibeui-cascader-009-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cascader-009"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_TREE: Cascader009Folder[] = [
  {
    label: "Проекты",
    files: 18,
    children: [
      {
        label: "Витрина 2026",
        files: 9,
        children: [
          { label: "Макеты", files: 24 },
          { label: "Исследования", files: 6 },
        ],
      },
      { label: "Архив", files: 132, children: [{ label: "2024", files: 71 }] },
    ],
  },
  {
    label: "Входящие",
    files: 3,
    locked: true,
  },
  {
    label: "Команда",
    files: 11,
    children: [
      { label: "Онбординг", files: 7 },
      { label: "Регламенты", files: 15 },
    ],
  },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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

function foldersAt(tree: Cascader009Folder[], path: string[]) {
  let nodes = tree

  for (const step of path) {
    const found = nodes.find((node) => node.label === step)

    if (!found?.children?.length) {
      return [] as Cascader009Folder[]
    }

    nodes = found.children
  }

  return nodes
}

/**
 * Выбор папки для перемещения файла: каскад, где целью может быть любой уровень.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader009({
  fileName = "отчёт-за-квартал.pdf",
  actionLabel = "Переместить в",
  tree = DEFAULT_TREE,
  groupText = "Перемещение файла {file}",
  titleText = "Переместить",
  rootText = "Корень диска",
  upText = "Наверх",
  lockedText = "источник",
  filesText = "{count} файлов",
  cancelText = "Отмена",
  moveText = "{action} «{folder}»",
  background = "",
  accent,
  className,
  style,
}: Cascader009Props) {
  const [path, setPath] = useState<string[]>(() =>
    tree[0]?.children?.length ? [tree[0].label] : [],
  )
  const folders = foldersAt(tree, path)
  const here = path.length ? path[path.length - 1] : rootText

  const palette = {
    ...(accent ? { "--vibeui-cascader-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cascader-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-009" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="cascader"
        data-vibeui-block="cascader-009"
        className={className}
        style={palette}
        role="group"
        aria-label={groupText.replace("{file}", fileName)}
      >
        <p data-part="title">
          {titleText} <em>{fileName}</em>
        </p>
        <p data-part="where" aria-live="polite">
          {[rootText, ...path].join(" / ")}
        </p>
        <ul data-part="list">
          {path.length ? (
            <li>
              <button
                data-part="row"
                type="button"
                onClick={() => setPath(path.slice(0, -1))}
              >
                <i data-part="up-icon" aria-hidden="true" />
                <span data-part="up">{upText}</span>
              </button>
            </li>
          ) : null}
          {folders.map((folder) => (
            <li key={folder.label}>
              <button
                data-part="row"
                type="button"
                disabled={folder.locked}
                onClick={() => setPath([...path, folder.label])}
              >
                <i data-part="icon" aria-hidden="true" />
                <span>{folder.label}</span>
                <span data-part="count">
                  {folder.locked
                    ? lockedText
                    : filesText.replace("{count}", String(folder.files ?? 0))}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div data-part="foot">
          <button data-part="cancel" type="button">
            {cancelText}
          </button>
          <button data-part="move" type="button">
            {moveText
              .replace("{action}", actionLabel)
              .replace("{folder}", here)}
          </button>
        </div>
      </div>
    </>
  )
}
