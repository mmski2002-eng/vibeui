"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { CSSProperties, KeyboardEvent } from "react"

export type AvatarAnim004Member = {
  id: string
  name: string
  role: string
  photo?: string
  /** Абзацы биографии — по одному на элемент. */
  bio?: string[]
  linkedin?: string
}

export type AvatarAnim004Props = {
  members?: AvatarAnim004Member[]
  title?: string
  description?: string
  /** Ход шторки, мс. Текст внутри появляется после того, как она доехала. */
  duration?: number
  /** Ширина шторки на широком экране, % окна. Уже 48rem — во всё окно. */
  panelWidth?: number
  /** Затемнение страницы под шторкой, % от чёрного. */
  overlay?: number
  /** Пусто — берётся из палитры блока. */
  panelBackground?: string
  panelColor?: string
  accent?: string
  closeLabel?: string
  linkedinLabel?: string
  className?: string
  style?: CSSProperties
}

// Сетка команды, где карточка открывает шторку-досье справа: сначала
// затемняется страница и въезжает панель, потом, когда она встала,
// проявляется текст; закрытие — в обратном порядке. Вся хореография на
// CSS-переходах с задержками, JS лишь переключает data-open и держит
// прокрутку страницы, пока шторка открыта.
const STYLES = `
:where([data-vibeui-block="avatar-anim-004"]){
--vibeui-avatar-anim-004-bg:transparent;
--vibeui-avatar-anim-004-fg:light-dark(oklch(0.22 0.012 265),oklch(0.95 0.005 265));
--vibeui-avatar-anim-004-muted:color-mix(in oklab,var(--vibeui-avatar-anim-004-fg) 62%,transparent);
--vibeui-avatar-anim-004-panel-bg:light-dark(oklch(0.995 0.002 265),oklch(0.18 0.012 265));
--vibeui-avatar-anim-004-panel-fg:light-dark(oklch(0.2 0.012 265),oklch(0.96 0.005 265));
--vibeui-avatar-anim-004-accent:#ff5900;
--vibeui-avatar-anim-004-plate:light-dark(oklch(0.92 0.006 265),oklch(0.28 0.012 265));
--vibeui-avatar-anim-004-overlay:0.28;
--vibeui-avatar-anim-004-width:70%;
--vibeui-avatar-anim-004-dur:650ms;
--vibeui-avatar-anim-004-dur-2:180ms;
--vibeui-avatar-anim-004-dur-3:240ms;
--vibeui-avatar-anim-004-dur-5:460ms;
--vibeui-avatar-anim-004-ease:cubic-bezier(0.45,0,0.55,1);
--vibeui-avatar-anim-004-out:cubic-bezier(0.16,1,0.3,1);
--vibeui-avatar-anim-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-anim-004"]{color-scheme:dark}
[data-vibeui-block="avatar-anim-004"]{
position:relative;box-sizing:border-box;width:100%;
padding:3rem 1.25rem 3.5rem;
background:var(--vibeui-avatar-anim-004-bg);color:var(--vibeui-avatar-anim-004-fg);
font-family:var(--vibeui-avatar-anim-004-font);
}
[data-vibeui-block="avatar-anim-004"] *{box-sizing:border-box}
[data-vibeui-block="avatar-anim-004"] [data-part="head"]{
display:flex;flex-direction:column;gap:1rem;margin:0 0 2rem;
}
[data-vibeui-block="avatar-anim-004"] [data-part="title"]{
margin:0;width:fit-content;max-width:100%;
font-size:clamp(1.75rem,4.6cqi,3.5rem);line-height:1.02;font-weight:650;
letter-spacing:-0.025em;text-transform:uppercase;text-wrap:balance;
}
[data-vibeui-block="avatar-anim-004"] [data-part="lead"]{
margin:0;max-width:44rem;
font-size:clamp(0.9375rem,1.5cqi,1.125rem);line-height:1.4;font-weight:500;
color:var(--vibeui-avatar-anim-004-muted);text-wrap:pretty;
}
/* Уже 48rem — лента с прокруткой вбок в один ряд; сеткой карточки ложатся
   только когда все пять умещаются в строку. */
[data-vibeui-block="avatar-anim-004"] [data-part="grid"]{
display:flex;gap:1rem;margin:0 -1.25rem;padding:0 1.25rem;
overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;
scrollbar-width:none;
}
[data-vibeui-block="avatar-anim-004"] [data-part="grid"]::-webkit-scrollbar{display:none}
/* С мышью полосу прокрутки не прячем: без неё узкий блок показывал бы две
   карточки без способа добраться до остальных. */
@media (hover:hover){
[data-vibeui-block="avatar-anim-004"] [data-part="grid"]{
scrollbar-width:thin;
scrollbar-color:color-mix(in oklab,var(--vibeui-avatar-anim-004-fg) 30%,transparent) transparent;
padding-bottom:0.75rem;
}
[data-vibeui-block="avatar-anim-004"] [data-part="grid"]::-webkit-scrollbar{display:block;height:6px}
}
[data-vibeui-block="avatar-anim-004"] [data-part="card"]{
position:relative;flex:0 0 62%;aspect-ratio:3/4;overflow:hidden;
border-radius:0.5rem;background:var(--vibeui-avatar-anim-004-plate);
cursor:pointer;scroll-snap-align:start;isolation:isolate;
-webkit-tap-highlight-color:transparent;
}
[data-vibeui-block="avatar-anim-004"] [data-part="card"]:focus-visible{
outline:2px solid var(--vibeui-avatar-anim-004-accent);outline-offset:3px;
}
[data-vibeui-block="avatar-anim-004"] [data-part="photo"]{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;
transition:filter var(--vibeui-avatar-anim-004-dur-5) ease,transform var(--vibeui-avatar-anim-004-dur-5) var(--vibeui-avatar-anim-004-out);
}
/* Тёплая засветка снизу в цвет акцента: на наведении фото не гаснет, а
   разогревается, как будто на него направили лампу. */
[data-vibeui-block="avatar-anim-004"] [data-part="glow"]{
position:absolute;inset:0;z-index:1;pointer-events:none;opacity:0;
background:
radial-gradient(120% 70% at 50% 110%,color-mix(in oklab,var(--vibeui-avatar-anim-004-accent) 55%,transparent),transparent 60%),
linear-gradient(to top,color-mix(in oklab,var(--vibeui-avatar-anim-004-accent) 35%,transparent),transparent 55%);
mix-blend-mode:screen;
transition:opacity var(--vibeui-avatar-anim-004-dur-5) ease;
}
[data-vibeui-block="avatar-anim-004"] [data-part="card"]::after{
content:"";position:absolute;inset:0;z-index:3;pointer-events:none;border-radius:inherit;
box-shadow:inset 0 0 0 0 var(--vibeui-avatar-anim-004-accent);
transition:box-shadow var(--vibeui-avatar-anim-004-dur-3) ease;
}
[data-vibeui-block="avatar-anim-004"] [data-part="initials"]{
position:absolute;inset:0;display:grid;place-items:center;
font-size:clamp(3rem,12cqi,6rem);font-weight:650;letter-spacing:-0.04em;
color:var(--vibeui-avatar-anim-004-muted);
}
/* Плюс в углу — подсказка для тача, где нет наведения и подписи не видно. */
[data-vibeui-block="avatar-anim-004"] [data-part="plus"]{
position:absolute;top:0.75rem;right:0.75rem;z-index:2;
width:2rem;height:2rem;border-radius:50%;
background:rgb(0 0 0 / 0.4);backdrop-filter:blur(12px);
display:grid;place-items:center;
transition:opacity var(--vibeui-avatar-anim-004-dur-2) ease;
}
[data-vibeui-block="avatar-anim-004"] [data-part="plus"]::before,
[data-vibeui-block="avatar-anim-004"] [data-part="plus"]::after{
content:"";position:absolute;background:#fff;border-radius:1px;
}
[data-vibeui-block="avatar-anim-004"] [data-part="plus"]::before{width:0.875rem;height:2px}
[data-vibeui-block="avatar-anim-004"] [data-part="plus"]::after{width:2px;height:0.875rem}
[data-vibeui-block="avatar-anim-004"] [data-part="caption"]{
position:absolute;left:0;right:0;bottom:0;z-index:2;
display:flex;align-items:flex-end;justify-content:space-between;gap:0.75rem;
padding:0.75rem;color:#fff;
background:rgb(0 0 0 / 0.42);backdrop-filter:blur(14px);
transition:transform var(--vibeui-avatar-anim-004-dur-5) var(--vibeui-avatar-anim-004-out);
}
[data-vibeui-block="avatar-anim-004"] [data-part="name"]{
margin:0;font-size:clamp(0.875rem,1.5cqi,1.125rem);line-height:1.15;font-weight:650;
text-transform:uppercase;letter-spacing:-0.01em;
}
[data-vibeui-block="avatar-anim-004"] [data-part="role"]{
margin:0.2rem 0 0;font-size:clamp(0.75rem,1.1cqi,0.875rem);line-height:1.3;opacity:0.85;
}
/* Две стрелки в одной коробке: на наведении верхняя выезжает вниз и
   исчезает, а на её место сверху приезжает такая же. */
[data-vibeui-block="avatar-anim-004"] [data-part="arrow"]{
position:relative;flex:none;width:1.25rem;height:1.25rem;overflow:hidden;
transform:rotate(-135deg);color:var(--vibeui-avatar-anim-004-accent);
}
[data-vibeui-block="avatar-anim-004"] [data-part="arrow"] svg{
position:absolute;inset:0;width:100%;height:100%;
transition:transform var(--vibeui-avatar-anim-004-dur-5) var(--vibeui-avatar-anim-004-out),opacity var(--vibeui-avatar-anim-004-dur-5) ease;
}
[data-vibeui-block="avatar-anim-004"] [data-part="arrow"] svg:first-child{
transform:translateY(-110%) scale(0.3);opacity:0;
}
/* На устройствах с наведением подпись спрятана и всплывает на hover;
   там, где наведения нет, она видна всегда, а фото не выцветает. */
@media (hover:hover){
[data-vibeui-block="avatar-anim-004"] [data-part="plus"]{opacity:0}
[data-vibeui-block="avatar-anim-004"] [data-part="caption"]{transform:translateY(100%)}
[data-vibeui-block="avatar-anim-004"] [data-part="card"]:hover [data-part="caption"],
[data-vibeui-block="avatar-anim-004"] [data-part="card"]:focus-visible [data-part="caption"]{transform:translateY(0)}
[data-vibeui-block="avatar-anim-004"] [data-part="card"]:hover [data-part="photo"],
[data-vibeui-block="avatar-anim-004"] [data-part="card"]:focus-visible [data-part="photo"]{filter:saturate(1.3) contrast(1.05) brightness(1.06);transform:scale(1.06)}
[data-vibeui-block="avatar-anim-004"] [data-part="card"]:hover [data-part="glow"],
[data-vibeui-block="avatar-anim-004"] [data-part="card"]:focus-visible [data-part="glow"]{opacity:1}
[data-vibeui-block="avatar-anim-004"] [data-part="card"]:hover::after,
[data-vibeui-block="avatar-anim-004"] [data-part="card"]:focus-visible::after{box-shadow:inset 0 0 0 2px var(--vibeui-avatar-anim-004-accent)}
[data-vibeui-block="avatar-anim-004"] [data-part="card"]:hover [data-part="arrow"] svg:first-child,
[data-vibeui-block="avatar-anim-004"] [data-part="card"]:focus-visible [data-part="arrow"] svg:first-child{transform:none;opacity:1}
[data-vibeui-block="avatar-anim-004"] [data-part="card"]:hover [data-part="arrow"] svg:last-child,
[data-vibeui-block="avatar-anim-004"] [data-part="card"]:focus-visible [data-part="arrow"] svg:last-child{transform:translateY(110%) scale(0.3);opacity:0}
}
@container (min-width: 30rem){
[data-vibeui-block="avatar-anim-004"] [data-part="card"]{flex-basis:38%}
}
@container (min-width: 48rem){
[data-vibeui-block="avatar-anim-004"] [data-part="head"]{margin-bottom:2.5rem;gap:1.25rem}
[data-vibeui-block="avatar-anim-004"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1.25rem;
margin:0;padding:0;overflow:visible;
}
[data-vibeui-block="avatar-anim-004"] [data-part="card"]{flex:none}
}
@container (min-width: 64rem){
[data-vibeui-block="avatar-anim-004"] [data-part="head"]{gap:2rem}
}

/* Шторка живёт поверх страницы, поэтому меряется от окна, а не от блока. */
[data-vibeui-block="avatar-anim-004"] [data-part="layer"]{
position:fixed;inset:0;z-index:200;pointer-events:none;
visibility:hidden;
transition:visibility 0s linear calc(var(--vibeui-avatar-anim-004-dur) + var(--vibeui-avatar-anim-004-dur-3));
}
[data-vibeui-block="avatar-anim-004"] [data-part="layer"][data-open="true"]{
pointer-events:auto;visibility:visible;transition-delay:0s;
}
[data-vibeui-block="avatar-anim-004"] [data-part="overlay"]{
position:absolute;inset:0;border:0;padding:0;margin:0;
background:#000;opacity:0;cursor:pointer;
transition:opacity var(--vibeui-avatar-anim-004-dur) var(--vibeui-avatar-anim-004-ease) var(--vibeui-avatar-anim-004-dur-3);
}
[data-vibeui-block="avatar-anim-004"] [data-part="layer"][data-open="true"] [data-part="overlay"]{
opacity:var(--vibeui-avatar-anim-004-overlay);transition-delay:0s;
}
[data-vibeui-block="avatar-anim-004"] [data-part="panel"]{
position:absolute;top:0;right:0;bottom:0;
width:100%;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;
background:var(--vibeui-avatar-anim-004-panel-bg);color:var(--vibeui-avatar-anim-004-panel-fg);
container-type:inline-size;
transform:translateX(100%);
/* Закрытие: текст гаснет первым, шторка ждёт его и уезжает следом. */
transition:transform var(--vibeui-avatar-anim-004-dur) var(--vibeui-avatar-anim-004-ease) var(--vibeui-avatar-anim-004-dur-3);
}
[data-vibeui-block="avatar-anim-004"] [data-part="layer"][data-open="true"] [data-part="panel"]{
transform:translateX(0);transition-delay:0s;
}
@media (min-width: 48rem){
[data-vibeui-block="avatar-anim-004"] [data-part="panel"]{width:var(--vibeui-avatar-anim-004-width)}
}
[data-vibeui-block="avatar-anim-004"] [data-part="sheet"]{
display:flex;flex-direction:column;gap:1.5rem;
min-height:100%;padding:clamp(1.5rem,8cqi,5rem) clamp(1.25rem,5cqi,3.5rem) clamp(2rem,8cqi,4rem);
opacity:0;
transition:opacity var(--vibeui-avatar-anim-004-dur-3) ease;
}
/* Открытие: текст ждёт, пока шторка доедет, и только потом проявляется. */
[data-vibeui-block="avatar-anim-004"] [data-part="layer"][data-open="true"] [data-part="sheet"]{
opacity:1;transition-delay:var(--vibeui-avatar-anim-004-dur);
}
[data-vibeui-block="avatar-anim-004"] [data-part="bar"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
padding-bottom:1.25rem;border-bottom:1px solid currentColor;
}
[data-vibeui-block="avatar-anim-004"] [data-part="close"]{
appearance:none;cursor:pointer;flex:none;
width:clamp(2.5rem,6cqi,3.25rem);height:clamp(2.5rem,6cqi,3.25rem);border-radius:50%;
border:1px solid currentColor;background:transparent;color:inherit;
display:grid;place-items:center;
transition:background-color var(--vibeui-avatar-anim-004-dur-2) ease,color var(--vibeui-avatar-anim-004-dur-2) ease;
}
[data-vibeui-block="avatar-anim-004"] [data-part="close"]:hover{
background:var(--vibeui-avatar-anim-004-panel-fg);color:var(--vibeui-avatar-anim-004-panel-bg);
}
[data-vibeui-block="avatar-anim-004"] [data-part="close"]:focus-visible{
outline:2px solid var(--vibeui-avatar-anim-004-accent);outline-offset:3px;
}
[data-vibeui-block="avatar-anim-004"] [data-part="close"] svg{width:45%;height:45%}
[data-vibeui-block="avatar-anim-004"] [data-part="count"]{
font-size:clamp(1rem,2.2cqi,1.375rem);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="avatar-anim-004"] [data-part="intro"]{
display:flex;flex-direction:column;gap:1.5rem;
}
[data-vibeui-block="avatar-anim-004"] [data-part="portrait"]{
flex:none;width:100%;max-width:26rem;aspect-ratio:5/6;
border-radius:0.75rem;overflow:hidden;background:var(--vibeui-avatar-anim-004-plate);
}
[data-vibeui-block="avatar-anim-004"] [data-part="portrait"] img{
width:100%;height:100%;object-fit:cover;object-position:top;display:block;
}
[data-vibeui-block="avatar-anim-004"] [data-part="heading"]{
margin:0;font-size:clamp(2rem,7cqi,4.25rem);line-height:1.02;font-weight:650;letter-spacing:-0.03em;
text-wrap:balance;
}
[data-vibeui-block="avatar-anim-004"] [data-part="subtitle"]{
margin:0.5rem 0 0;font-size:clamp(1rem,2cqi,1.25rem);font-weight:500;
color:color-mix(in oklab,currentColor 70%,transparent);
}
[data-vibeui-block="avatar-anim-004"] [data-part="bio"]{
display:flex;flex-direction:column;gap:1rem;
font-size:clamp(1rem,2cqi,1.375rem);line-height:1.45;font-weight:500;
}
[data-vibeui-block="avatar-anim-004"] [data-part="bio"] p{margin:0;text-wrap:pretty}
[data-vibeui-block="avatar-anim-004"] [data-part="social"]{
display:inline-flex;align-items:center;gap:0.5rem;width:fit-content;
color:inherit;opacity:0.55;text-decoration:none;font-size:0.9375rem;font-weight:600;
transition:opacity var(--vibeui-avatar-anim-004-dur-3) ease;
}
[data-vibeui-block="avatar-anim-004"] [data-part="social"]:hover,
[data-vibeui-block="avatar-anim-004"] [data-part="social"]:focus-visible{opacity:1}
[data-vibeui-block="avatar-anim-004"] [data-part="social"] svg{width:1.25rem;height:1.25rem}
@container (min-width: 40rem){
[data-vibeui-block="avatar-anim-004"] [data-part="intro"]{flex-direction:row;gap:2rem;align-items:flex-start}
[data-vibeui-block="avatar-anim-004"] [data-part="portrait"]{width:40%}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="avatar-anim-004"] *{transition-duration:0s!important;transition-delay:0s!important;animation:none!important}
}
`

const DEFAULT_MEMBERS: AvatarAnim004Member[] = [
  {
    id: "alisa",
    name: "Алиса Воронцова",
    role: "Арт-директор",
    photo: "/demo/cards/portrait-01.webp",
    linkedin: "https://www.linkedin.com",
    bio: [
      "Алиса отвечает за то, как выглядит каждый компонент в каталоге: от первого экрана до тултипа. Её правило — блок должен читаться как вещь, а не как заготовка, иначе ИИ соберёт из него безликий шаблон.",
      "До VibeUI семь лет вела дизайн-системы в продуктовых командах и устала объяснять разработчикам, почему кнопка «почти такая же» — это другая кнопка. Теперь объясняет это агентам через metadata, и они слушают лучше.",
      "Вне работы рисует акварелью и утверждает, что именно поэтому в её палитрах никогда не бывает чистого серого.",
    ],
  },
  {
    id: "marina",
    name: "Марина Соколова",
    role: "Голос бренда",
    photo: "/demo/posters/poster-03.webp",
    linkedin: "https://www.linkedin.com",
    bio: [
      "Марина пишет всё, что читает человек и агент: заголовки на витрине, описания компонентов, инструкции для ИИ. Один и тот же блок она называет так, как его назовёт дизайнер, разработчик и заказчик, — и все трое его находят.",
      "Пришла из музыкальной журналистики и до сих пор считает, что у описания компонента есть ритм: если фраза не звучит вслух, её не поймёт и модель. Каждый текст в каталоге она действительно читает вслух.",
      "По вечерам поёт в небольшом джазовом составе — отсюда и внимание к тому, где в тексте пауза.",
    ],
  },
  {
    id: "igor",
    name: "Игорь Беляев",
    role: "Ведущий фронтенд-инженер",
    photo: "/demo/cards/portrait-02.webp",
    linkedin: "https://www.linkedin.com",
    bio: [
      "Игорь следит, чтобы каждый компонент оставался одним файлом без зависимостей, который можно унести в любой проект и он заработает. Если блок тянет за собой библиотеку — блок переписывается, а не библиотека добавляется.",
      "Пятнадцать лет во фронтенде, из них последние пять — на границе с дизайном: контейнерные запросы, light-dark(), переносимые палитры. Он первым в команде проверяет, как компонент ведёт себя в чужом Tailwind-конфиге и на слабом ноутбуке.",
      "Держит дома старый ThinkPad специально для того, чтобы смотреть, не роняет ли анимация кадры там, где нет видеокарты.",
    ],
  },
  {
    id: "elena",
    name: "Елена Крылова",
    role: "Руководитель проектов",
    photo: "/demo/cards/portrait-04.webp",
    linkedin: "https://www.linkedin.com",
    bio: [
      "Елена ведёт каталог как продукт: какие категории нужны в первую очередь, что уходит в релиз, а что ждёт. Она же первая говорит команде, что дедлайн нереален, — и обычно это экономит всем неделю в конце.",
      "До VibeUI руководила проектами в студии веб-разработки и на своём опыте знает, сколько времени уходит на сборку сайта из готовых блоков. Сейчас это её главная метрика: от «выбрал дизайн» до «сайт работает» — один вечер.",
      "Скоуп, сроки и что кому мешает — всегда на одной доске, у всех перед глазами. Сюрпризов не любит, поэтому их не бывает.",
    ],
  },
  {
    id: "timur",
    name: "Тимур Гареев",
    role: "Motion-дизайнер",
    photo: "/demo/cards/portrait-06.webp",
    linkedin: "https://www.linkedin.com",
    bio: [
      "Тимур делает движение: как раскрывается шторка, как всплывает подпись, как карточки ложатся веером. Его мерило простое — если анимацию замечаешь раньше, чем понимаешь, что она сообщает, она лишняя.",
      "Работает с макетом с первых набросков, а не «оживляет» готовое, поэтому движение в каталоге читается как замысел, а не как украшение. Каждую кривую он выписывает в CSS сам: библиотеки анимации в компоненты не попадают.",
      "В свободное время снимает замедленную съёмку воды и падающей ткани — потом это возвращается в linear() с перелётом.",
    ],
  },
]

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
}

/**
 * Сетка команды со шторкой-досье: карточка открывает панель справа, страница
 * под ней затемняется и замирает, текст проявляется после хода шторки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function AvatarAnim004({
  members = DEFAULT_MEMBERS,
  title = "Кто делает VibeUI",
  description = "Пять человек, одна библиотека: дизайн, код, движение и слова, из которых ИИ собирает сайты. Нажмите на карточку, чтобы узнать, кто за что отвечает.",
  duration = 650,
  panelWidth = 70,
  overlay = 28,
  panelBackground = "",
  panelColor = "",
  accent = "",
  closeLabel = "Закрыть",
  linkedinLabel = "LinkedIn",
  className,
  style,
}: AvatarAnim004Props) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<AvatarAnim004Member | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const headingId = useId()

  const openMember = (member: AvatarAnim004Member, trigger: HTMLElement) => {
    returnFocusRef.current = trigger
    setSelected(member)
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    returnFocusRef.current?.focus()
  }

  const onCardKeyDown = (event: KeyboardEvent<HTMLDivElement>, member: AvatarAnim004Member) => {
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    openMember(member, event.currentTarget)
  }

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    document.addEventListener("keydown", onKeyDown)

    // Фокус переезжает на «Закрыть», когда шторка доехала: раньше кнопка
    // ещё за кадром, и браузер прокрутил бы страницу к ней.
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), duration)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
      window.clearTimeout(focusTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, duration])

  const palette = {
    "--vibeui-avatar-anim-004-dur": `${duration}ms`,
    "--vibeui-avatar-anim-004-width": `${panelWidth}%`,
    "--vibeui-avatar-anim-004-overlay": overlay / 100,
    ...(panelBackground ? { "--vibeui-avatar-anim-004-panel-bg": panelBackground } : null),
    ...(panelColor ? { "--vibeui-avatar-anim-004-panel-fg": panelColor } : null),
    ...(accent ? { "--vibeui-avatar-anim-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  const index = selected ? members.findIndex((member) => member.id === selected.id) : -1

  return (
    <>
      <style href="vibeui-avatar-anim-004" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="avatar-anim-004" className={className} style={palette}>
        <div data-part="head">
          <h2 data-part="title">{title}</h2>
          {description ? <p data-part="lead">{description}</p> : null}
        </div>

        <div data-part="grid" aria-hidden={open || undefined}>
          {members.map((member) => (
            <div
              key={member.id}
              data-part="card"
              role="button"
              tabIndex={open ? -1 : 0}
              aria-label={`${member.name}, ${member.role}`}
              onClick={(event) => openMember(member, event.currentTarget)}
              onKeyDown={(event) => onCardKeyDown(event, member)}
            >
              {member.photo ? (
                <img data-part="photo" src={member.photo} alt="" loading="lazy" />
              ) : (
                <span data-part="initials" aria-hidden="true">
                  {initialsOf(member.name)}
                </span>
              )}
              <span data-part="glow" aria-hidden="true" />
              <span data-part="plus" aria-hidden="true" />
              <div data-part="caption">
                <div>
                  <p data-part="name">{member.name}</p>
                  <p data-part="role">{member.role}</p>
                </div>
                <span data-part="arrow" aria-hidden="true">
                  <ArrowIcon />
                  <ArrowIcon />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div data-part="layer" data-open={open ? "true" : "false"}>
          <button
            type="button"
            data-part="overlay"
            aria-label={closeLabel}
            tabIndex={-1}
            onClick={close}
          />
          <div
            data-part="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={selected ? headingId : undefined}
            aria-hidden={!open}
          >
            {selected ? (
              <div data-part="sheet">
                <div data-part="bar">
                  <button
                    ref={closeRef}
                    type="button"
                    data-part="close"
                    aria-label={closeLabel}
                    onClick={close}
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <span data-part="count">
                    {index + 1}/{members.length}
                  </span>
                </div>
                <div data-part="intro">
                  {selected.photo ? (
                    <div data-part="portrait">
                      <img src={selected.photo} alt={selected.name} />
                    </div>
                  ) : null}
                  <div>
                    <h2 data-part="heading" id={headingId}>
                      {selected.name}
                    </h2>
                    <p data-part="subtitle">{selected.role}</p>
                  </div>
                </div>
                {selected.bio?.length ? (
                  <div data-part="bio">
                    {selected.bio.map((paragraph, position) => (
                      <p key={position}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}
                {selected.linkedin ? (
                  <a
                    data-part="social"
                    href={selected.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${selected.name} — ${linkedinLabel}`}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
                    </svg>
                    {linkedinLabel}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 19 23" fill="none" aria-hidden="true">
      <path
        d="M9.44 23c-.06-.07-.1-.14-.17-.2L.2 14.01c-.06-.06-.14-.11-.2-.16.58-.55 1.13-1.07 1.67-1.59l6.54 6.34c.02-.01.05-.02.08-.04V0h2.39v18.59l6.59-6.39c.58.55 1.13 1.08 1.73 1.67-.05.03-.14.06-.21.13l-9.09 8.8c-.06.06-.11.14-.17.2h-.09Z"
        fill="currentColor"
      />
    </svg>
  )
}
