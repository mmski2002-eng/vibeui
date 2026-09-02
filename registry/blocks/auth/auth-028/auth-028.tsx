"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth028Purpose = {
  id: string
  title: string
  text: string
  required?: boolean
}

export type Auth028Props = {
  title?: string
  lead?: string
  purposes?: Auth028Purpose[]
  acceptAll?: string
  saveChoice?: string
  /** Пояснение к заблокированной обязательной цели. */
  lockText?: string
  /** Счётчик; {count} и {total} подставляются числами. */
  countText?: string
  /** Текст перед ссылкой на политику. */
  policyText?: string
  /** Подпись ссылки на политику. */
  policyLinkText?: string
  /** Хвост сноски после ссылки. */
  policyTailText?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: согласие на обработку данных по целям, а не одной галочкой.
// Ключевое требование к такому экрану — равенство кнопок: «Принять всё» и
// «Сохранить выбор» одного размера и рядом, потому что оформление, при
// котором отказ выглядит серой ссылкой, признано тёмным паттерном. По той
// же причине необязательные переключатели выключены по умолчанию.
// Обязательная категория показана выключателем в положении «включено», но
// заблокированным, и рядом написано, почему её нельзя снять: спрятать её
// значило бы умолчать о собираемых данных, а сделать снимаемой — соврать.
// Переключатели — обычные чекбоксы, вид даёт CSS; клавиатура работает сама.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственной подложки.
//
// Демонстрация интерфейса: выбор никуда не сохраняется.
const STYLES = `
:where([data-vibeui-block="auth-028"]){
--vibeui-auth-028-bg:transparent;
--vibeui-auth-028-card:light-dark(oklch(1 0 0),oklch(0.22 0.013 265));
--vibeui-auth-028-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-auth-028-muted:light-dark(oklch(0.54 0.014 265),oklch(0.71 0.012 265));
--vibeui-auth-028-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-auth-028-accent:light-dark(oklch(0.5 0.15 265),oklch(0.75 0.13 268));
--vibeui-auth-028-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 268));
--vibeui-auth-028-track:light-dark(oklch(0.85 0.008 265),oklch(0.42 0.012 265));
--vibeui-auth-028-knob:light-dark(oklch(1 0 0),oklch(0.96 0.004 265));
--vibeui-auth-028-soft:light-dark(oklch(0.55 0.02 265 / 4%),oklch(0.82 0.02 265 / 7%));
--vibeui-auth-028-badge:light-dark(oklch(0.55 0.02 265 / 12%),oklch(0.82 0.02 265 / 14%));
--vibeui-auth-028-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="auth-028"]{
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-028-bg);color:var(--vibeui-auth-028-fg);
font-family:var(--vibeui-auth-028-sans);
}
[data-vibeui-block="auth-028"] *{box-sizing:border-box}
[data-vibeui-block="auth-028"] [data-part="shell"]{
width:100%;max-width:25rem;margin:0 auto;padding:1.5rem;
background:var(--vibeui-auth-028-card);
border:1px solid var(--vibeui-auth-028-border);border-radius:1rem;
}
@container (min-width: 44rem){
[data-vibeui-block="auth-028"] [data-part="shell"]{max-width:34rem;padding:2rem}
[data-vibeui-block="auth-028"] [data-part="actions"]{flex-direction:row}
}
[data-vibeui-block="auth-028"] h2{margin:0 0 0.375rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-028"] [data-part="lead"]{margin:0 0 1.125rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-028-muted)}
[data-vibeui-block="auth-028"] ul{list-style:none;margin:0 0 1.25rem;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="auth-028"] [data-part="row"]{
display:flex;align-items:flex-start;gap:0.875rem;
padding:0.8125rem;border-radius:0.75rem;
border:1px solid var(--vibeui-auth-028-border);
}
[data-vibeui-block="auth-028"] [data-part="row"]:has(input:checked){border-color:var(--vibeui-auth-028-accent)}
[data-vibeui-block="auth-028"] [data-part="row"]:has(input:focus-visible){outline:2px solid var(--vibeui-auth-028-accent);outline-offset:2px}
[data-vibeui-block="auth-028"] [data-part="row"]:has(input:disabled){background:var(--vibeui-auth-028-soft)}
[data-vibeui-block="auth-028"] [data-part="ptitle"]{display:block;font-size:0.875rem;font-weight:650}
[data-vibeui-block="auth-028"] [data-part="ptext"]{display:block;margin-top:0.1875rem;font-size:0.75rem;line-height:1.45;color:var(--vibeui-auth-028-muted)}
[data-vibeui-block="auth-028"] [data-part="switch"]{
position:relative;flex:none;order:2;margin-left:auto;
display:inline-flex;align-items:center;
width:2.5rem;height:1.375rem;cursor:pointer;
}
[data-vibeui-block="auth-028"] [data-part="switch"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="auth-028"] [data-part="switch"] input:disabled{cursor:not-allowed}
[data-vibeui-block="auth-028"] [data-part="track"]{
width:100%;height:100%;border-radius:9999px;background:var(--vibeui-auth-028-track);
transition:background-color .16s ease;
}
[data-vibeui-block="auth-028"] [data-part="knob"]{
position:absolute;top:0.1875rem;left:0.1875rem;
width:1rem;height:1rem;border-radius:9999px;background:var(--vibeui-auth-028-knob);
transition:transform .16s ease;
}
[data-vibeui-block="auth-028"] [data-part="switch"]:has(input:checked) [data-part="track"]{background:var(--vibeui-auth-028-accent)}
[data-vibeui-block="auth-028"] [data-part="switch"]:has(input:checked) [data-part="knob"]{transform:translateX(1.125rem)}
[data-vibeui-block="auth-028"] [data-part="switch"]:has(input:disabled) [data-part="track"]{opacity:.55}
[data-vibeui-block="auth-028"] [data-part="lock"]{
display:inline-block;margin-top:0.375rem;padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-auth-028-badge);font-size:0.625rem;font-weight:650;color:var(--vibeui-auth-028-muted);
}
[data-vibeui-block="auth-028"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="auth-028"] [data-part="all"],
[data-vibeui-block="auth-028"] [data-part="save"]{
flex:1;appearance:none;cursor:pointer;height:2.625rem;padding:0 1rem;
border-radius:0.625rem;font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-028"] [data-part="all"]{border:0;background:var(--vibeui-auth-028-accent);color:var(--vibeui-auth-028-on-accent)}
[data-vibeui-block="auth-028"] [data-part="save"]{border:1px solid var(--vibeui-auth-028-accent);background:none;color:var(--vibeui-auth-028-accent)}
[data-vibeui-block="auth-028"] [data-part="all"]:focus-visible,
[data-vibeui-block="auth-028"] [data-part="save"]:focus-visible{outline:2px solid var(--vibeui-auth-028-accent);outline-offset:2px}
[data-vibeui-block="auth-028"] [data-part="foot"]{margin:0.875rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-auth-028-muted)}
[data-vibeui-block="auth-028"] [data-part="foot"] a{color:var(--vibeui-auth-028-accent);font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-028"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PURPOSES: Auth028Purpose[] = [
  {
    id: "core",
    title: "Работа аккаунта",
    text: "Почта, пароль и список установленных блоков. Без этого войти нельзя.",
    required: true,
  },
  {
    id: "stats",
    title: "Обезличенная статистика",
    text: "Какие блоки открывают чаще. Помогает решить, что делать дальше.",
  },
  {
    id: "help",
    title: "Записи ошибок интерфейса",
    text: "Что сломалось и на какой странице. Без содержимого ваших проектов.",
  },
  {
    id: "mail",
    title: "Письма о новинках",
    text: "Не чаще раза в месяц. Отписка одной ссылкой в письме.",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

/**
 * Согласие на обработку данных по целям: равные кнопки «принять всё»
 * и «сохранить выбор», обязательная цель заблокирована. Один файл.
 */
export function Auth028({
  title = "Как мы обращаемся с вашими данными",
  lead = "Отметьте, на что вы согласны. Настройки меняются в любой момент в профиле — согласие не бессрочное.",
  purposes = DEFAULT_PURPOSES,
  acceptAll = "Принять всё",
  saveChoice = "Сохранить выбор",
  lockText = "нельзя отключить — иначе аккаунт не работает",
  countText = "Выбрано целей: {count} из {total}.",
  policyText = "Подробности — в",
  policyLinkText = "политике обработки данных",
  policyTailText = "; там же список обработчиков и сроки хранения.",
  background = "",
  accent,
  className,
  style,
}: Auth028Props) {
  const [on, setOn] = useState<string[]>(
    purposes.filter((purpose) => purpose.required).map((purpose) => purpose.id),
  )

  const palette = {
    ...(accent ? { "--vibeui-auth-028-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-028-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-028" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-028"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <ul>
            {purposes.map((purpose) => (
              <li key={purpose.id}>
                <div data-part="row">
                  <span>
                    <span data-part="ptitle">{purpose.title}</span>
                    <span data-part="ptext">{purpose.text}</span>
                    {purpose.required ? (
                      <span data-part="lock">{lockText}</span>
                    ) : null}
                  </span>
                  <span data-part="switch">
                    <input
                      type="checkbox"
                      name={purpose.id}
                      aria-label={purpose.title}
                      disabled={purpose.required}
                      checked={on.includes(purpose.id)}
                      onChange={(event) =>
                        setOn((current) =>
                          event.target.checked
                            ? [...current, purpose.id]
                            : current.filter((item) => item !== purpose.id),
                        )
                      }
                    />
                    <span data-part="track" aria-hidden="true" />
                    <span data-part="knob" aria-hidden="true" />
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div data-part="actions">
            <button
              type="button"
              data-part="all"
              onClick={() => setOn(purposes.map((purpose) => purpose.id))}
            >
              {acceptAll}
            </button>
            <button type="button" data-part="save">
              {saveChoice}
            </button>
          </div>

          <p data-part="foot">
            {countText
              .replace("{count}", String(on.length))
              .replace("{total}", String(purposes.length))}{" "}
            {policyText} <a href="#">{policyLinkText}</a>
            {policyTailText}
          </p>
        </div>
      </section>
    </>
  )
}
