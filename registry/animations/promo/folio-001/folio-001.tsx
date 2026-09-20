"use client"

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react"

export type Folio001App = {
  /** Название программы: подпись иконки и заголовок окна. */
  title: string
  /** Характер призрака и значка: about, projects, resume, contact, folder. */
  kind?: "about" | "projects" | "resume" | "contact" | "folder"
  /** Подпись под названием в меню «Пуск»; без неё — по kind. */
  hint?: string
  /** Содержимое окна вместо призрака. */
  content?: ReactNode
  /** Своя картинка значка (svg/png/webp); без неё — встроенный SVG по kind. */
  icon?: string
}

export type Folio001Props = {
  /** Имя пользователя на экране входа и в меню «Пуск». */
  name?: string
  /** Подпись под именем. */
  role?: string
  /** Картинка пользователя на входе и в «Пуске»; без неё — инициалы. */
  avatar?: string
  /** Программы на рабочем столе. Без них — четыре демонстрационные. */
  apps?: readonly Folio001App[]
  /** С какой сцены начинать: загрузка, вход или сразу рабочий стол. */
  start?: "boot" | "login" | "desktop"
  /** Обои: холмы, графит или адрес своей картинки. */
  wallpaper?: "hills" | "graphite" | (string & {})
  /** Логотип на экранах загрузки и входа; без него — четырёхцветный знак CSS. */
  logo?: string
  /** Плёнка ЭЛТ: сетка пикселей и виньетка поверх всего экрана. */
  crt?: boolean
  /** Звуки: вход, окна, меню, выход — синтез Web Audio, без файлов. Выключаются динамиком в трее. */
  sounds?: boolean
  className?: string
  style?: CSSProperties
}

// Рабочий стол в духе Windows XP: три сцены — загрузка, вход, стол.
// Окна — абсолютные блоки с z-порядком, тянутся за заголовок и за угол
// pointer-событиями, сворачиваются в таскбар, разворачиваются на весь стол.
// Хром — меню, панель кнопок, адресная строка, статус, таскбар, «Пуск» —
// нарисован CSS в пикселях оригинала; картинок и зависимостей нет.
// Свои обои, значки, аватар и знак — пропами: CSS остаётся фолбэком.
// Поверх всего — плёнка ЭЛТ (сетка пикселей и виньетка): именно она даёт
// «экранную» фактуру, без неё стол выглядит плоско.
// Звуки синтезируются Web Audio на лету (осцилляторы с огибающей):
// файлов нет, фирменные мелодии XP не используются. Играют только после
// жеста пользователя — автопереходы сцен беззвучны, так требуют браузеры.
// Палитра фиксированная светлая — у XP не было тёмной темы.
const STYLES = `
:where([data-vibeui-block="folio-001"]){
--vibeui-folio-001-blue:#0a58e6;
--vibeui-folio-001-blue-deep:#0b3fbf;
--vibeui-folio-001-title:linear-gradient(#0997ff,#0053ee 8%,#0050ee 40%,#0066ff 88%,#0066ff 93%,#005bff 95%,#003dd7 96%,#003dd7);
--vibeui-folio-001-taskbar:linear-gradient(#245edc,#3f8cf3 3%,#2a68e3 6%,#245edc 12%,#245edc 88%,#1f52c4 96%,#1941a5);
--vibeui-folio-001-tray:linear-gradient(#1290e9,#1290e9 8%,#0f7cd6 12%,#0f7cd6 88%,#0a6bc3);
--vibeui-folio-001-start:linear-gradient(#5bbf5b,#3ea23e 12%,#2f8f2f 50%,#257c25 88%,#1a5e1a);
--vibeui-folio-001-chrome:#ece9d8;
--vibeui-folio-001-chrome-dark:#d4d0c8;
--vibeui-folio-001-paper:#ffffff;
--vibeui-folio-001-ink:#000000;
--vibeui-folio-001-muted:#7f7c73;
--vibeui-folio-001-sky:#3f8dff;
--vibeui-folio-001-grass:#3d9a1b;
--vibeui-folio-001-font:Tahoma,"Segoe UI",Verdana,ui-sans-serif,system-ui,sans-serif;
--vibeui-folio-001-title-font:"Trebuchet MS",Tahoma,"Segoe UI",sans-serif;
container:folio / inline-size;
}
:where([data-vibeui-block="folio-001"][data-wallpaper="graphite"]){--vibeui-folio-001-sky:#3a3a3a;--vibeui-folio-001-grass:#1a1a1a}
[data-vibeui-block="folio-001"]{
position:relative;display:block;width:100%;height:min(38rem,100dvh);min-height:24rem;overflow:hidden;
border-radius:0.75rem;background:#000;color:var(--vibeui-folio-001-ink);
font:11px/1.35 var(--vibeui-folio-001-font);color-scheme:light;user-select:none;isolation:isolate;
}
[data-vibeui-block="folio-001"] *{box-sizing:border-box}
[data-vibeui-block="folio-001"] button{font:inherit;color:inherit;cursor:default}
[data-vibeui-block="folio-001"] img{display:block}
/* Плёнка ЭЛТ: сетка пикселей и виньетка, как у старого монитора. */
[data-vibeui-block="folio-001"] [data-part="crt"]{position:absolute;inset:0;z-index:200;pointer-events:none;mix-blend-mode:multiply;
background:
repeating-linear-gradient(0deg,rgb(0 0 0 / .085) 0 1px,transparent 1px 2px),
repeating-linear-gradient(90deg,rgb(0 0 0 / .045) 0 1px,transparent 1px 2px),
radial-gradient(ellipse at center,transparent 68%,rgb(0 0 0 / .1))}
/* Бегущая строка развёртки: тонкая светлая полоса сверху вниз, как у ЭЛТ. */
[data-vibeui-block="folio-001"] [data-part="scanline"]{position:absolute;left:0;top:-20px;width:100%;height:1px;z-index:201;pointer-events:none;mix-blend-mode:screen;opacity:0.3;background:linear-gradient(rgb(255 255 255 / .01),rgb(255 255 255 / .2) 50%,rgb(255 255 255 / .01));box-shadow:0 0 2px rgb(255 255 255 / .15);transform:translateY(0)}
/* Сцены лежат стопкой, живёт одна. */
[data-vibeui-block="folio-001"] [data-part="scene"],[data-vibeui-block="folio-001"] [data-part="boot"],[data-vibeui-block="folio-001"] [data-part="login"]{position:absolute;inset:0}
[data-vibeui-block="folio-001"] [data-part="scene"]{animation:vibeui-folio-001-fade 0.5s ease}
@keyframes vibeui-folio-001-fade{from{opacity:0}}
/* Знак и словесный знак: флажок, имя с «xp», подпись курсивом. */
[data-vibeui-block="folio-001"] [data-part="mark"]{display:block;width:3.4em;height:2.85em;flex:none;border-radius:0.25em;background:conic-gradient(from 0deg,#f35325 0 25%,#81bc06 0 50%,#05a6f0 0 75%,#ffba08 0);transform:skewY(-8deg);box-shadow:0 0.1em 0.3em rgb(0 0 0 / .45),inset 0 0 0 0.06em rgb(255 255 255 / .35)}
[data-vibeui-block="folio-001"] [data-part="mark"][data-image]{background:none;transform:none;box-shadow:none;border-radius:0}
[data-vibeui-block="folio-001"] [data-part="mark"] img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 0.08em 0.2em rgb(0 0 0 / .35))}
[data-vibeui-block="folio-001"] [data-part="wordmark"]{display:flex;flex-direction:column;align-items:center;color:#fff;line-height:1;font-size:40px}
[data-vibeui-block="folio-001"] [data-part="wordmark"] [data-part="mark"]{margin-bottom:0.2em}
[data-vibeui-block="folio-001"] [data-part="wordmark"] b{display:flex;align-items:flex-start;gap:0.12em;font-weight:700;letter-spacing:-0.02em;text-shadow:0.02em 0.04em 0.06em rgb(0 0 0 / .35);white-space:nowrap}
[data-vibeui-block="folio-001"] [data-part="wordmark"] b i{font-style:normal;font-size:0.55em;color:#f0561d;margin-top:-0.25em}
[data-vibeui-block="folio-001"] [data-part="wordmark"] em{align-self:flex-end;font-size:0.42em;font-style:italic;font-weight:400;margin:0.18em 1.7em 0 0;text-shadow:0.02em 0.04em 0.06em rgb(0 0 0 / .35);white-space:nowrap}
/* Загрузка: чёрный экран, знак, бегущие блоки, подсказки по углам. */
[data-vibeui-block="folio-001"] [data-part="boot"]{display:grid;place-items:center;background:#000;color:#fff}
[data-vibeui-block="folio-001"] [data-part="boot"] > div{display:flex;flex-direction:column;align-items:center;animation:vibeui-folio-001-fade 0.5s ease both}
[data-vibeui-block="folio-001"] [data-part="boot"] [data-part="wordmark"]{font-size:clamp(28px,6cqi,44px);margin-bottom:44px}
[data-vibeui-block="folio-001"] [data-part="progress"]{width:174px;height:22px;border:2px solid #b2b2b2;border-radius:6px;padding:2px 0;overflow:hidden;font-size:0;white-space:nowrap;transform:scale(1.06)}
[data-vibeui-block="folio-001"] [data-part="progress"] i{display:inline-block;width:9px;height:100%;margin-right:3px;background:linear-gradient(#2838c7,#5979ef 17%,#869ef3 32%,#869ef3 45%,#5979ef 59%,#2838c7);animation:vibeui-folio-001-rotbar 2.2s steps(17) infinite}
@keyframes vibeui-folio-001-rotbar{from{transform:translateX(-33.5px)}to{transform:translateX(170.5px)}}
[data-vibeui-block="folio-001"] [data-part="boot-hint"]{position:absolute;left:8%;bottom:6.5%;margin:0;font-size:15px;line-height:1.4;color:#fff}
/* Вход: тёмно-синие полосы, голубое поле с линиями, знак слева, карточка справа. */
[data-vibeui-block="folio-001"] [data-part="login"]{background:#002d99;color:#fff;overflow:hidden}
[data-vibeui-block="folio-001"] [data-part="login-inner"]{position:absolute;inset:13% 0;background:#587cdb;transition:opacity 0.3s ease-in-out}
[data-vibeui-block="folio-001"] [data-part="login-inner"]::before,[data-vibeui-block="folio-001"] [data-part="login-inner"]::after{content:"";position:absolute;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#bad7f8,transparent,transparent)}
[data-vibeui-block="folio-001"] [data-part="login-inner"]::before{top:0}
[data-vibeui-block="folio-001"] [data-part="login-inner"]::after{bottom:0;background:linear-gradient(90deg,transparent,#f8953d,transparent,transparent)}
[data-vibeui-block="folio-001"] [data-part="divider"]{position:absolute;left:50%;top:20%;bottom:20%;width:2px;transform:translateX(-50%);opacity:0.35;background:linear-gradient(rgb(186 215 248 / 0),#bad7f8 40%,#bad7f8 60%,rgb(186 215 248 / 0))}
[data-vibeui-block="folio-001"] [data-part="login-left"]{position:absolute;left:50%;top:45%;transform:translate(calc(-100% - 27px),-50%);display:flex;flex-direction:column;align-items:flex-end}
[data-vibeui-block="folio-001"] [data-part="login-left"] [data-part="wordmark"]{font-size:clamp(26px,5cqi,40px)}
[data-vibeui-block="folio-001"] [data-part="login-left"] p{margin:12px 28px 0 0;font-size:clamp(14px,2.2cqi,19px);letter-spacing:0.25px;white-space:nowrap}
[data-vibeui-block="folio-001"] [data-part="login-right"]{position:absolute;left:50%;top:45%;transform:translate(27px,-50%)}
[data-vibeui-block="folio-001"] [data-part="user"]{position:relative;z-index:0;display:flex;align-items:flex-start;gap:14px;min-width:260px;padding:10px 18px 10px 10px;border:0;border-radius:6px;background:none;color:#fff;text-align:left;cursor:pointer;overflow:hidden}
[data-vibeui-block="folio-001"] [data-part="user"]::before{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;background:linear-gradient(90deg,#113fa6,#194db8 40%,#587cdb);opacity:0;transition:opacity 70ms linear}
[data-vibeui-block="folio-001"] [data-part="user"]::after{content:"";position:absolute;inset:0;border-radius:inherit;border:1px solid rgb(186 215 248 / .55);mask-image:linear-gradient(90deg,#000 0,#000 42%,transparent 92%);opacity:0;transition:opacity 70ms linear;pointer-events:none}
[data-vibeui-block="folio-001"] [data-part="user"]:hover::before,[data-vibeui-block="folio-001"] [data-part="user"]:hover::after,[data-vibeui-block="folio-001"] [data-part="user"]:focus-visible::before,[data-vibeui-block="folio-001"] [data-part="user"]:focus-visible::after{opacity:0.92}
[data-vibeui-block="folio-001"] [data-part="user"]:focus-visible{outline:none}
[data-vibeui-block="folio-001"] [data-part="user"] span{margin-top:11px}
[data-vibeui-block="folio-001"] [data-part="user"] b{display:block;font-size:26px;font-weight:500;letter-spacing:0.25px;line-height:1;margin-bottom:2px;text-shadow:0 1px 1px rgb(0 0 0 / .14)}
[data-vibeui-block="folio-001"] [data-part="user"] small{display:block;margin-left:2px;font-size:13px;font-weight:700;line-height:1.2;color:navy;transition:color 70ms linear}
[data-vibeui-block="folio-001"] [data-part="user"]:hover small,[data-vibeui-block="folio-001"] [data-part="user"]:focus-visible small{color:#fdbd32}
[data-vibeui-block="folio-001"] [data-part="avatar"]{width:70px;height:70px;flex:none;border:3px solid #fff;border-radius:3px;box-shadow:1px 1px 0 rgb(0 0 0 / .06),1px 2px 3px rgb(0 0 0 / .14);background:linear-gradient(135deg,#ffd166,#ef476f 55%,#118ab2);display:grid;place-items:center;font-size:24px;font-weight:700;color:#fff;text-shadow:0 1px 2px rgb(0 0 0 / .35);overflow:hidden;transition:border-color 70ms linear}
[data-vibeui-block="folio-001"] [data-part="avatar"] img{width:100%;height:100%;object-fit:cover}
[data-vibeui-block="folio-001"] [data-part="user"]:hover [data-part="avatar"],[data-vibeui-block="folio-001"] [data-part="user"]:focus-visible [data-part="avatar"]{border-color:#fdbd32}
[data-vibeui-block="folio-001"] [data-part="restart"]{position:absolute;left:4%;bottom:4.5%;display:flex;align-items:center;gap:8px;border:0;background:none;color:#eff1ed;font-size:16px;font-weight:500;cursor:pointer;transition:opacity 0.3s}
[data-vibeui-block="folio-001"] [data-part="restart"] svg{width:32px;height:32px;opacity:0.8;transition:opacity 0.2s}
[data-vibeui-block="folio-001"] [data-part="restart"]:hover svg{opacity:1}
[data-vibeui-block="folio-001"] [data-part="login-note"]{position:absolute;right:4%;bottom:4%;margin:0;font-size:14px;line-height:1.55;text-align:left;transition:opacity 0.3s}
[data-vibeui-block="folio-001"] [data-part="login"][data-leaving] [data-part="login-inner"],[data-vibeui-block="folio-001"] [data-part="login"][data-leaving] [data-part="restart"],[data-vibeui-block="folio-001"] [data-part="login"][data-leaving] [data-part="login-note"]{opacity:0}
[data-vibeui-block="folio-001"] [data-part="welcome"]{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);margin:0;font-size:clamp(28px,6cqi,48px);font-style:italic;font-weight:700;letter-spacing:0.3px;color:#fff;text-shadow:1px 1px 3px #000a,0 1px 0 #36c;white-space:nowrap;animation:vibeui-folio-001-fade 0.7s ease both}
/* Стол: обои, значки. */
[data-vibeui-block="folio-001"] [data-part="desktop"]{
background:
radial-gradient(75% 58% at 18% 112%,color-mix(in oklab,var(--vibeui-folio-001-grass) 70%,#fff) 0 60%,transparent 60.5%),
radial-gradient(110% 68% at 72% 118%,var(--vibeui-folio-001-grass) 0 62%,transparent 62.5%),
radial-gradient(60% 40% at 40% 116%,color-mix(in oklab,var(--vibeui-folio-001-grass) 75%,#000) 0 55%,transparent 55.5%),
radial-gradient(40% 30% at 80% 20%,color-mix(in oklab,#fff 35%,transparent) 0%,transparent 70%),
linear-gradient(color-mix(in oklab,var(--vibeui-folio-001-sky) 70%,#fff),var(--vibeui-folio-001-sky) 55%,color-mix(in oklab,var(--vibeui-folio-001-sky) 60%,#fff) 70%);
}
[data-vibeui-block="folio-001"] [data-part="desktop"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="folio-001"] [data-part="icons"]{position:absolute;left:24px;top:28px;bottom:30px;display:grid;grid-auto-rows:104px;grid-template-columns:104px;gap:10px;place-content:start;z-index:1}
[data-vibeui-block="folio-001"] [data-part="icon"]{display:flex;flex-direction:column;align-items:center;gap:6px;width:100%;height:100%;padding:8px 6px 8px;border:1px solid transparent;border-radius:3px;background:none;color:#fff;font-size:13px;line-height:1.2;text-align:center;text-shadow:1px 1px 1px rgb(0 0 0 / .9),0 0 3px rgb(0 0 0 / .8);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}
[data-vibeui-block="folio-001"] [data-part="icon"]:hover{background:rgb(49 106 197 / .22)}
[data-vibeui-block="folio-001"] [data-part="icon"]:focus-visible,[data-vibeui-block="folio-001"] [data-part="icon"][data-selected]{background:rgb(49 106 197 / .5);border:1px dotted rgb(255 255 255 / .5);outline:none}
/* Значок: своя картинка или CSS-фолбэк с росчерком. */
[data-vibeui-block="folio-001"] [data-part="glyph"]{width:56px;height:56px;flex:none;border-radius:10px;display:grid;place-items:center;box-shadow:0 2px 4px rgb(0 0 0 / .35),inset 0 1px 0 rgb(255 255 255 / .5)}
[data-vibeui-block="folio-001"] [data-part="glyph"] svg{width:60%;height:60%;fill:none;stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="folio-001"] [data-part="glyph"][data-kind="about"]{background:linear-gradient(#ffb84d,#e8791f)}
[data-vibeui-block="folio-001"] [data-part="glyph"][data-kind="projects"]{background:linear-gradient(#4fa8ff,#1d5fd6)}
[data-vibeui-block="folio-001"] [data-part="glyph"][data-kind="resume"]{background:linear-gradient(#f2f2f2,#c9c9c9)}
[data-vibeui-block="folio-001"] [data-part="glyph"][data-kind="resume"] svg{stroke:#d33}
[data-vibeui-block="folio-001"] [data-part="glyph"][data-kind="contact"]{background:linear-gradient(#7ad0ff,#2f8fe0)}
[data-vibeui-block="folio-001"] [data-part="glyph"][data-kind="folder"]{background:linear-gradient(#ffe08a,#e6b53c)}
[data-vibeui-block="folio-001"] [data-part="glyph"][data-kind="folder"] svg{stroke:#7a5a12}
[data-vibeui-block="folio-001"] [data-part="glyph"][data-image]{background:none;box-shadow:none;border-radius:0}
[data-vibeui-block="folio-001"] [data-part="glyph"] img{width:100%;height:100%;object-fit:contain}
[data-vibeui-block="folio-001"] [data-part="glyph"][data-size="m"]{width:25px;height:25px;border-radius:5px;box-shadow:none}
[data-vibeui-block="folio-001"] [data-part="glyph"][data-size="s"]{width:16px;height:16px;border-radius:3px;box-shadow:none}
[data-vibeui-block="folio-001"] [data-part="glyph"][data-size="xs"]{width:14px;height:14px;border-radius:3px;box-shadow:none}
/* Окно: синяя рамка, заголовок-градиент, меню, панель, адрес, тело, статус. */
[data-vibeui-block="folio-001"] [data-part="window"]{position:absolute;display:flex;flex-direction:column;background:var(--vibeui-folio-001-chrome);border:2px solid #284ffd;border-top-width:1.5px;border-radius:8px 8px 0 0;filter:drop-shadow(1px 1px 4px rgb(0 0 0 / .5));overflow:hidden;min-width:300px;min-height:200px;animation:vibeui-folio-001-restore 0.15s ease-out;transform-origin:bottom center}
[data-vibeui-block="folio-001"] [data-part="window"][data-inactive]{border-color:#3d7bff}
[data-vibeui-block="folio-001"] [data-part="window"][data-inactive] [data-part="titlebar"]::after{content:"";position:absolute;inset:0;background:rgb(255 255 255 / .25);pointer-events:none}
[data-vibeui-block="folio-001"] [data-part="window"][data-minimized]{animation:vibeui-folio-001-minimize 0.15s ease-in forwards;pointer-events:none}
[data-vibeui-block="folio-001"] [data-part="window"][data-maximized]{border-width:0;border-radius:0;filter:none}
@keyframes vibeui-folio-001-minimize{to{opacity:0.5;transform:scale(0.55) translateY(40%);visibility:hidden}}
@keyframes vibeui-folio-001-restore{from{opacity:0.5;transform:scale(0.55) translateY(40%)}}
[data-vibeui-block="folio-001"] [data-part="titlebar"]{position:relative;display:flex;align-items:center;gap:4px;min-height:30px;padding:3px 5px 4px 6px;background:var(--vibeui-folio-001-title);color:#fff;font:700 13px/1 var(--vibeui-folio-001-title-font);text-shadow:1px 1px #0f1089;touch-action:none;cursor:default;flex:none}
[data-vibeui-block="folio-001"] [data-part="titlebar"] span{flex:1;padding-left:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="folio-001"] [data-part="controls"]{display:flex;gap:2px;flex:none;position:relative;z-index:1}
[data-vibeui-block="folio-001"] [data-part="controls"] button{width:21px;height:21px;border:1px solid #fff;border-radius:3px;background:linear-gradient(#4a8cff,#2a63f0 45%,#1a4fd8);box-shadow:inset 0 0 0 1px rgb(255 255 255 / .28),inset 0 -1px 2px rgb(0 0 0 / .2);color:#fff;display:grid;place-items:center;cursor:pointer;padding:0;transition:filter 0.1s}
[data-vibeui-block="folio-001"] [data-part="controls"] button:hover{filter:brightness(1.18)}
[data-vibeui-block="folio-001"] [data-part="controls"] button:active{filter:brightness(0.85)}
[data-vibeui-block="folio-001"] [data-part="controls"] button[data-close]{background:linear-gradient(#f39a7a,#e0582f 45%,#c73f1b);margin-left:2px}
[data-vibeui-block="folio-001"] [data-part="controls"] svg{width:11px;height:11px;fill:none;stroke:#fff;stroke-width:1.9;filter:drop-shadow(0 1px 0 rgb(0 0 0 / .3))}
[data-vibeui-block="folio-001"] [data-part="body"]{display:flex;flex-direction:column;flex:1;min-height:0;background:var(--vibeui-folio-001-chrome)}
[data-vibeui-block="folio-001"] [data-part="menubar"]{position:relative;display:flex;align-items:center;height:22px;padding-right:8px;border-bottom:1px solid var(--vibeui-folio-001-chrome-dark);font-size:11px;flex:none}
[data-vibeui-block="folio-001"] [data-part="menubar"] span{display:flex;align-items:center;height:100%;padding:0 12px}
[data-vibeui-block="folio-001"] [data-part="menubar"] span:hover{background:#0a6fc2;color:#fff}
[data-vibeui-block="folio-001"] [data-part="menubar"] span[data-disabled]{color:#aca899;pointer-events:none}
[data-vibeui-block="folio-001"] [data-part="menubar"] [data-part="mark"]{position:absolute;right:10px;top:3px;width:18px;height:15px;font-size:5px}
[data-vibeui-block="folio-001"] [data-part="toolbar"]{display:flex;align-items:center;height:48px;padding:0 4px;border-bottom:1px solid var(--vibeui-folio-001-chrome-dark);flex:none;overflow:hidden}
[data-vibeui-block="folio-001"] [data-part="toolbar"] button{display:flex;align-items:center;gap:5px;padding:6px 8px;border:1.5px solid transparent;border-radius:5px;background:none;color:#222;font-size:11px;white-space:nowrap;cursor:pointer;transition:background 0.13s,border-color 0.13s}
[data-vibeui-block="folio-001"] [data-part="toolbar"] button:hover{background:#e4e0d0;border-color:#c4bfa8;box-shadow:0 1px 1px rgb(0 0 0 / .1)}
[data-vibeui-block="folio-001"] [data-part="toolbar"] button[data-disabled]{opacity:0.5;pointer-events:none}
[data-vibeui-block="folio-001"] [data-part="toolbar"] button svg{width:25px;height:25px;flex:none}
[data-vibeui-block="folio-001"] [data-part="toolbar"] > i{align-self:center;width:2px;height:28px;margin:0 4px;border-left:1px solid #c0bcb0;border-right:1px solid #fff;flex:none}
[data-vibeui-block="folio-001"] [data-part="address"]{display:flex;align-items:center;height:34px;padding:0 6px 0 4px;border-bottom:1px solid var(--vibeui-folio-001-chrome-dark);font-size:11px;flex:none}
[data-vibeui-block="folio-001"] [data-part="address"] > span{padding:0 6px 0 2px;color:var(--vibeui-folio-001-muted);white-space:nowrap}
[data-vibeui-block="folio-001"] [data-part="addressbox"]{display:flex;align-items:center;gap:4px;flex:1;min-width:0;height:22px;padding:0 2px 0 4px;background:#fff;border:1px solid var(--vibeui-folio-001-chrome-dark)}
[data-vibeui-block="folio-001"] [data-part="addressbox"] span{flex:1;color:#5a5a5a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="folio-001"] [data-part="addressbox"] svg{width:16px;height:16px;flex:none;stroke:#7a7a7a;fill:none;stroke-width:1.5}
[data-vibeui-block="folio-001"] [data-part="go"]{display:flex;align-items:center;gap:4px;margin-left:4px;color:#a0a0a0;white-space:nowrap}
[data-vibeui-block="folio-001"] [data-part="go"] i{width:20px;height:20px;border-radius:3px;background:linear-gradient(#cfe7bf,#7fbf6a);border:1px solid #7fa66f;opacity:0.6;filter:grayscale(1)}
[data-vibeui-block="folio-001"] [data-part="content"]{flex:1;min-height:0;overflow:auto;background:var(--vibeui-folio-001-paper);color:var(--vibeui-folio-001-ink);scrollbar-width:thin;scrollbar-color:#c0c8dc #f0f0f0;container:win / inline-size}
[data-vibeui-block="folio-001"] [data-part="status"]{display:flex;align-items:center;height:23px;padding:2px 6px 0;font-size:11px;box-shadow:inset 0 1px 0 #fff,inset 0 2px 0 #aca899;flex:none}
[data-vibeui-block="folio-001"] [data-part="status"] i{margin-left:auto;height:100%;width:22%;border-left:1px solid #aca899;box-shadow:inset 1px 0 0 #fff}
[data-vibeui-block="folio-001"] [data-part="resize"]{position:absolute;right:0;bottom:0;width:16px;height:16px;cursor:nwse-resize;touch-action:none;background:linear-gradient(135deg,transparent 0 50%,#aca899 50% 56%,transparent 56% 66%,#aca899 66% 72%,transparent 72% 82%,#aca899 82% 88%,transparent 88%)}
/* Проводник внутри окна: синяя левая панель с карточками, поле содержимого. */
[data-vibeui-block="folio-001"] [data-part="explorer"]{display:flex;min-height:100%}
[data-vibeui-block="folio-001"] [data-part="panel"]{position:relative;flex:none;width:190px;padding-top:6px;background:linear-gradient(#748aff,#4057d3);overflow:hidden}
[data-vibeui-block="folio-001"] [data-part="panel"]::after{content:"";position:absolute;right:0;top:0;width:1px;height:100%;background:linear-gradient(#fff,transparent 70%)}
[data-vibeui-block="folio-001"] [data-part="card"]{width:calc(92% - 6px);margin:14px auto 0;border-radius:3px 3px 0 0;overflow:hidden}
[data-vibeui-block="folio-001"] [data-part="card"] header{display:flex;align-items:center;height:23px;padding:0 8px 0 10px;border-radius:5px 5px 0 0;background:linear-gradient(90deg,#fff,#f0f0ff 50%,#c2d4ec);color:#0c327d;font-size:11px;font-weight:700;letter-spacing:0.2px}
[data-vibeui-block="folio-001"] [data-part="card"] header::after{content:"";width:13px;height:13px;margin-left:auto;border-radius:50%;background:radial-gradient(circle at 50% 40%,#fff 0 28%,#3c6ad4 30% 100%);box-shadow:0 1px 1px rgb(0 0 0 / .4)}
[data-vibeui-block="folio-001"] [data-part="card"][data-social] header{background:linear-gradient(90deg,#054394,#0484fb);color:#fff}
[data-vibeui-block="folio-001"] [data-part="card"] ul{margin:0;padding:5px 10px;list-style:none;background:#c2d4ec;border:1.5px solid #fff;border-top:0}
[data-vibeui-block="folio-001"] [data-part="card"] li{display:flex;align-items:center;gap:6px;margin-bottom:2px;color:#0c327d;font-size:10px;line-height:14px}
[data-vibeui-block="folio-001"] [data-part="card"] li:hover{text-decoration:underline}
[data-vibeui-block="folio-001"] [data-part="card"] li i{width:12px;height:12px;flex:none;border-radius:3px;background:var(--dot,#3c6ad4);box-shadow:inset 0 0 0 1px rgb(255 255 255 / .5)}
[data-vibeui-block="folio-001"] [data-part="main"]{flex:1;min-width:0;padding:24px 36px;color:#fff;background:linear-gradient(#5561d8,#3f4bc4);text-shadow:1px 1px 0 #000,0 0 1px #000}
[data-vibeui-block="folio-001"] [data-part="main"][data-light]{background:#fff;color:var(--vibeui-folio-001-ink);text-shadow:none}
[data-vibeui-block="folio-001"] [data-part="main"] h3{margin:0 0 24px;font-size:30px;font-weight:700;letter-spacing:0.5px;line-height:1}
[data-vibeui-block="folio-001"] [data-part="main"][data-light] h3{font-size:22px;color:var(--vibeui-folio-001-blue-deep);margin-bottom:16px}
[data-vibeui-block="folio-001"] [data-part="para"]{display:flex;gap:18px;margin-bottom:18px}
[data-vibeui-block="folio-001"] [data-part="para"] [data-part="avatar"]{width:56px;height:56px;border-width:2px;font-size:18px}
[data-vibeui-block="folio-001"] [data-part="para"] [data-part="glyph"]{filter:drop-shadow(1px 2px 3px rgb(0 0 0 / .4))}
[data-vibeui-block="folio-001"] [data-part="para"] > div{flex:1;min-width:0;display:flex;flex-direction:column;gap:9px;padding-top:4px}
[data-vibeui-block="folio-001"] [data-part="bar"]{display:block;height:9px;border-radius:999px;background:rgb(255 255 255 / .75);width:88%}
[data-vibeui-block="folio-001"] [data-part="bar"][data-soft]{background:rgb(255 255 255 / .45);width:62%}
[data-vibeui-block="folio-001"] [data-part="main"][data-light] [data-part="bar"]{background:#c8c8c8}
[data-vibeui-block="folio-001"] [data-part="main"][data-light] [data-part="bar"][data-soft]{background:#e3e3e3}
[data-vibeui-block="folio-001"] [data-part="lead"]{display:flex;flex-direction:column;gap:4px;margin-bottom:22px;font-size:15px}
[data-vibeui-block="folio-001"] [data-part="lead"] strong{font-size:17px}
[data-vibeui-block="folio-001"] [data-part="thumbs"]{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:14px}
[data-vibeui-block="folio-001"] [data-part="thumbs"] i{display:block;aspect-ratio:4/3;border:2px solid #fff;border-radius:2px;background:linear-gradient(135deg,#dbe9ff,#8fb6f5);box-shadow:1px 2px 4px rgb(0 0 0 / .35)}
[data-vibeui-block="folio-001"] [data-part="sheet"]{max-width:520px;margin:0 auto;padding:32px 36px;background:#fff;border:1px solid #bbb;box-shadow:2px 3px 8px rgb(0 0 0 / .25);color:var(--vibeui-folio-001-ink);text-shadow:none}
[data-vibeui-block="folio-001"] [data-part="main"][data-gray]{background:#8a8a8a;padding:20px}
[data-vibeui-block="folio-001"] [data-part="sheet"] h3{font-size:20px;color:var(--vibeui-folio-001-ink);margin-bottom:4px}
[data-vibeui-block="folio-001"] [data-part="sheet"] small{display:block;color:#666;margin-bottom:18px;font-size:12px}
[data-vibeui-block="folio-001"] [data-part="sheet"] h4{margin:16px 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-folio-001-blue-deep);border-bottom:1px solid #ddd;padding-bottom:4px}
[data-vibeui-block="folio-001"] [data-part="sheet"] [data-part="bar"]{background:#d0d0d0;margin-bottom:7px}
[data-vibeui-block="folio-001"] [data-part="sheet"] [data-part="bar"][data-soft]{background:#e8e8e8}
[data-vibeui-block="folio-001"] [data-part="form"]{display:grid;gap:6px;max-width:360px}
[data-vibeui-block="folio-001"] [data-part="form"] label{font-size:11px;color:#333;margin-top:6px}
[data-vibeui-block="folio-001"] [data-part="field"]{display:block;height:22px;border:1px solid #7f9db9;background:#fff}
[data-vibeui-block="folio-001"] [data-part="field"][data-area]{height:80px}
[data-vibeui-block="folio-001"] [data-part="ok"]{justify-self:start;margin-top:10px;padding:4px 20px;border:1px solid #003c74;border-radius:3px;background:linear-gradient(#fff,#ecebe5 60%,#d8d0c4);box-shadow:inset 1px 1px 0 #fff;font-size:11px}
/* Таскбар: «Пуск», кнопки окон, трей с часами. */
[data-vibeui-block="folio-001"] [data-part="taskbar"]{position:absolute;left:0;right:0;bottom:0;height:30px;display:flex;align-items:center;background:var(--vibeui-folio-001-taskbar);color:#fff;z-index:50}
[data-vibeui-block="folio-001"] [data-part="startbtn"]{position:relative;display:flex;align-items:center;gap:5px;height:100%;padding:0 16px 0 8px;margin-right:6px;border:0;border-radius:0 11px 11px 0;background:var(--vibeui-folio-001-start);color:#fff;font:italic 700 16px/1 var(--vibeui-folio-001-title-font);text-shadow:1px 1px 1px rgb(0 0 0 / .55);box-shadow:inset 0 1px 0 rgb(255 255 255 / .45),inset -3px 0 5px rgb(0 0 0 / .3),inset 0 -1px 0 #0f4a0f,2px 0 3px rgb(0 0 0 / .25);cursor:pointer;transition:filter 0.1s}
[data-vibeui-block="folio-001"] [data-part="startbtn"]:hover{filter:brightness(1.15)}
[data-vibeui-block="folio-001"] [data-part="startbtn"][aria-expanded="true"],[data-vibeui-block="folio-001"] [data-part="startbtn"]:active{filter:brightness(0.9)}
[data-vibeui-block="folio-001"] [data-part="startbtn"] [data-part="mark"]{width:22px;height:19px;font-size:6px;filter:drop-shadow(0 1px 1px rgb(0 0 0 / .4))}
[data-vibeui-block="folio-001"] [data-part="tasks"]{flex:1;display:flex;align-items:center;gap:3px;min-width:0;height:100%;overflow:hidden}
[data-vibeui-block="folio-001"] [data-part="tasks"] button{display:flex;align-items:center;flex:0 1 168px;min-width:36px;height:26px;padding:0 10px;border:1px solid;border-color:#1a72c4 #14589e #145aa8 #1868c0;border-radius:3px;background:linear-gradient(#42a0ef,#368ee8 45%,#3484d6);box-shadow:inset 1px 0 0 rgb(93 152 245 / .45),inset 0 1px 1px rgb(255 255 255 / .28);color:#fff;font-size:11px;text-shadow:1px 1px 1px rgb(0 0 0 / .3);cursor:pointer;transition:background 0.15s,box-shadow 0.15s}
[data-vibeui-block="folio-001"] [data-part="tasks"] button:hover{background:linear-gradient(#6eb8fc,#55a8f8 50%,#2e8ef0);border-color:#2770b8 #1d5a9a #1c5c9e #2166b0}
[data-vibeui-block="folio-001"] [data-part="tasks"] button [data-part="glyph"]{margin-right:6px;width:15px;height:15px}
[data-vibeui-block="folio-001"] [data-part="tasks"] button span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="folio-001"] [data-part="tasks"] button[data-active],[data-vibeui-block="folio-001"] [data-part="tasks"] button[data-active]:hover{background:linear-gradient(0deg,#1a5a99,#1f6bb8);border-color:#1a5a9e #154a88 #144a90 #0f3d70;box-shadow:inset 1px 1px 1px rgb(0 0 0 / .35),inset -1px -1px 0 rgb(255 255 255 / .05)}
[data-vibeui-block="folio-001"] [data-part="tray"]{display:flex;align-items:center;gap:6px;height:100%;padding:0 12px 0 10px;margin-left:4px;background:var(--vibeui-folio-001-tray);box-shadow:inset 2px 0 0 #0c5fb0,inset 3px 0 0 #1c90ea;font-size:11px;text-shadow:1px 1px 1px rgb(0 0 0 / .6)}
[data-vibeui-block="folio-001"] [data-part="tray"] svg{width:16px;height:16px;margin-top:1px;filter:drop-shadow(0 1px 1px rgb(0 0 0 / .35))}
[data-vibeui-block="folio-001"] [data-part="tray"] time{margin-left:6px;white-space:nowrap}
[data-vibeui-block="folio-001"] [data-part="tray"] button{display:grid;place-items:center;width:20px;height:20px;padding:0;border:0;background:none;color:inherit;cursor:pointer;border-radius:2px}
[data-vibeui-block="folio-001"] [data-part="tray"] button:hover{background:rgb(255 255 255 / .15)}
/* Меню «Пуск»: шапка с пользователем, белая и голубая колонки, подвал. */
[data-vibeui-block="folio-001"] [data-part="startmenu"]{position:absolute;left:0;bottom:30.5px;width:min(335px,100%);display:flex;flex-direction:column;border:1px solid rgb(0 0 0 / .3);border-radius:5px 5px 0 0;overflow:hidden;background:#0f61cb;box-shadow:0 -2px 8px rgb(0 0 0 / .4),2px 4px 10px rgb(0 0 0 / .4),inset 0 0 55px rgb(255 255 255 / .08);z-index:60;animation:vibeui-folio-001-fade 0.1s ease}
[data-vibeui-block="folio-001"] [data-part="startmenu"] > header{position:relative;display:flex;align-items:center;height:51px;flex:none;border-radius:5px 5px 0 0;background:linear-gradient(#1868ce,#0e60cb 12%,#0e60cb 20%,#1164cf 32%,#1667cf 33%,#1b6cd3 47%,#1e70d9 54%,#2476dc 60%,#297ae0 65%,#3482e3 77%,#3786e5 79%,#428ee9 90%,#4791eb);box-shadow:inset 0 -2px 3px rgb(10 36 106 / .4);color:#fff;font-size:13.5px;font-weight:700;letter-spacing:0.5px;text-shadow:1px 1px 2px rgb(0 0 0 / .6)}
[data-vibeui-block="folio-001"] [data-part="startmenu"] > header::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:linear-gradient(90deg,rgb(255 140 0 / .1),rgb(255 165 0 / .9) 30%,rgb(255 165 0 / .9) 70%,rgb(255 140 0 / .1));box-shadow:0 1px 2px rgb(255 255 255 / .3)}
[data-vibeui-block="folio-001"] [data-part="startmenu"] > header [data-part="avatar"]{width:40px;height:40px;margin:7px 8px 8px;border:2px solid rgb(255 255 255 / .7);box-shadow:0 0 0 1px rgb(0 95 184 / .6),inset 0 0 2px 1px rgb(255 255 255 / .35);font-size:14px}
[data-vibeui-block="folio-001"] [data-part="sm-body"]{display:flex;box-shadow:inset 0 6px 10px -6px rgb(0 0 0 / .3)}
[data-vibeui-block="folio-001"] [data-part="startmenu"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column}
[data-vibeui-block="folio-001"] [data-part="sm-left"]{width:52%;background:#fff;box-shadow:inset -2px 0 3px -1px rgb(0 0 0 / .15),inset 0 3px 4px -3px rgb(0 0 0 / .2)}
[data-vibeui-block="folio-001"] [data-part="sm-right"]{width:48%;background:#d2e5fa;border-left:1px solid #a6bbd6;box-shadow:inset 2px 0 3px -1px rgb(255 255 255 / .7),inset 0 3px 4px -3px rgb(0 0 0 / .15)}
[data-vibeui-block="folio-001"] [data-part="startmenu"] li button{display:flex;align-items:center;gap:7px;width:100%;padding:5px 8px;border:0;background:none;text-align:left;font-size:12px;cursor:pointer}
[data-vibeui-block="folio-001"] [data-part="sm-left"] li button{min-height:36px}
[data-vibeui-block="folio-001"] [data-part="sm-right"] li button{min-height:34px;padding:7px 8px 7px 9px;font-size:11.5px}
[data-vibeui-block="folio-001"] [data-part="startmenu"] li button:hover{background:#2f71cd;color:#fff;box-shadow:inset 0 0 5px rgb(0 0 0 / .2),0 0 1px rgb(255 255 255 / .3)}
[data-vibeui-block="folio-001"] [data-part="startmenu"] li button:hover small{color:#fff}
[data-vibeui-block="folio-001"] [data-part="sm-left"] [data-part="glyph"]{width:30px;height:30px;filter:drop-shadow(1px 1px 1px rgb(0 0 0 / .3))}
[data-vibeui-block="folio-001"] [data-part="sm-right"] svg{width:25px;height:25px;flex:none;filter:drop-shadow(1px 1px 1px rgb(0 0 0 / .25))}
[data-vibeui-block="folio-001"] [data-part="startmenu"] li button > span{display:flex;flex-direction:column;justify-content:center;min-width:0}
[data-vibeui-block="folio-001"] [data-part="startmenu"] li button b{font-weight:600}
[data-vibeui-block="folio-001"] [data-part="startmenu"] li button small{color:#777;font-size:9.5px;line-height:1.2;margin-top:1px}
[data-vibeui-block="folio-001"] [data-part="sm-divider"]{height:1px;margin:0;background:linear-gradient(90deg,transparent,#d2d2d2 50%,transparent)}
[data-vibeui-block="folio-001"] [data-part="sm-right"] [data-part="sm-divider"]{background:linear-gradient(90deg,transparent,#a1c4fc 50%,transparent)}
[data-vibeui-block="folio-001"] [data-part="sm-all"]{margin-top:auto}
[data-vibeui-block="folio-001"] [data-part="sm-all"] button{justify-content:center;height:35px;font-weight:600;box-shadow:inset 0 1px 1px rgb(255 255 255 / .3)}
[data-vibeui-block="folio-001"] [data-part="sm-all"] button::after{content:"";width:0;height:0;border:7px solid transparent;border-left:10px solid #3c9a1c;border-right:0;margin-left:2px;filter:drop-shadow(0 1px 0 rgb(0 0 0 / .25))}
[data-vibeui-block="folio-001"] [data-part="startmenu"] > footer{position:relative;display:flex;justify-content:flex-end;align-items:center;gap:0;height:46px;flex:none;padding-right:4px;border-top:1px solid rgb(0 0 0 / .3);background:linear-gradient(#428ee9,#3786e5 10%,#3482e3 21%,#297ae0 35%,#2476dc 40%,#1e70d9 46%,#1b6cd3 53%,#1667cf 67%,#1164cf 68%,#0e60cb 80%,#0e60cb 88%,#1868ce);box-shadow:inset 0 1px 4px rgb(0 0 0 / .2);color:#fff;font-size:12.5px;text-shadow:1px 1px 1px rgb(0 0 0 / .4)}
[data-vibeui-block="folio-001"] [data-part="startmenu"] > footer button{display:flex;align-items:center;gap:6px;height:30px;margin:0 5px;padding:0 6px 0 0;border:0;background:none;color:#fff;cursor:pointer}
[data-vibeui-block="folio-001"] [data-part="startmenu"] > footer button svg{width:24px;height:24px;border-radius:3px;transition:filter 0.1s}
[data-vibeui-block="folio-001"] [data-part="startmenu"] > footer button:hover svg{filter:brightness(1.2)}
/* Узко: значки в строку, окна на весь стол, вход столбиком. */
@container folio (max-width: 40rem){
[data-vibeui-block="folio-001"] [data-part="icons"]{grid-template-columns:repeat(auto-fill,88px);grid-auto-rows:96px;right:0;left:12px;top:12px;gap:4px}
[data-vibeui-block="folio-001"] [data-part="window"]{inset:0 0 30px!important;width:auto!important;height:auto!important;min-width:0;border-width:0;border-radius:0;filter:none}
[data-vibeui-block="folio-001"] [data-part="resize"],[data-vibeui-block="folio-001"] [data-part="toolbar"]{display:none}
[data-vibeui-block="folio-001"] [data-part="login-inner"]{inset:10% 0}
[data-vibeui-block="folio-001"] [data-part="divider"]{display:none}
[data-vibeui-block="folio-001"] [data-part="login-left"]{left:50%;top:32%;transform:translate(-50%,-50%);align-items:center}
[data-vibeui-block="folio-001"] [data-part="login-left"] p{margin-right:0;text-align:center;white-space:normal;font-size:14px}
[data-vibeui-block="folio-001"] [data-part="login-right"]{left:50%;top:72%;transform:translate(-50%,-50%)}
[data-vibeui-block="folio-001"] [data-part="user"]{min-width:0;flex-direction:column;align-items:center;text-align:center;padding:14px 18px 16px}
[data-vibeui-block="folio-001"] [data-part="user"] span{margin-top:12px}
[data-vibeui-block="folio-001"] [data-part="user"] b{font-size:22px;white-space:nowrap}
[data-vibeui-block="folio-001"] [data-part="user"] small{margin:2px 0 0}
[data-vibeui-block="folio-001"] [data-part="user"]::after{mask-image:none}
[data-vibeui-block="folio-001"] [data-part="login-note"],[data-vibeui-block="folio-001"] [data-part="boot-hint"],[data-vibeui-block="folio-001"] [data-part="restart"] span{display:none}
[data-vibeui-block="folio-001"] [data-part="startmenu"] [data-part="sm-right"]{display:none}
[data-vibeui-block="folio-001"] [data-part="startmenu"] [data-part="sm-left"]{width:100%}
}
@container win (max-width: 520px){
[data-vibeui-block="folio-001"] [data-part="panel"]{display:none}
[data-vibeui-block="folio-001"] [data-part="main"]{padding:18px 20px}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="folio-001"] *{animation:none!important;transition:none!important}[data-vibeui-block="folio-001"] [data-part="window"][data-minimized]{visibility:hidden}}
`

const DEFAULT_APPS: readonly Folio001App[] = [
  { title: "Обо мне", kind: "about" },
  { title: "Проекты", kind: "projects" },
  { title: "Резюме", kind: "resume" },
  { title: "Контакты", kind: "contact" },
]

const HINTS: Record<NonNullable<Folio001App["kind"]>, string> = {
  about: "Кто я и чем занимаюсь",
  projects: "Посмотреть работы",
  resume: "Опыт и навыки",
  contact: "Написать мне",
  folder: "Открыть папку",
}

const PLACES: readonly (readonly [kind: string, label: string, bold: boolean] | null)[] = [
  ["docs", "Мои документы", true],
  ["pictures", "Мои рисунки", true],
  ["music", "Моя музыка", true],
  null,
  ["control", "Панель управления", false],
  ["help", "Справка и поддержка", false],
  ["search", "Поиск", false],
  ["run", "Выполнить…", false],
]

type Win = {
  id: number
  x: number
  y: number
  w: number
  h: number
  z: number
  minimized: boolean
  maximized: boolean
}

function Glyph({ kind, icon, size }: { kind: Folio001App["kind"]; icon?: string; size?: "m" | "s" | "xs" }) {
  return (
    <i data-part="glyph" data-kind={kind ?? "folder"} data-size={size} data-image={icon ? "" : undefined} aria-hidden="true">
      {icon ? (
        <img src={icon} alt="" draggable={false} loading="lazy" decoding="async" />
      ) : kind === "about" ? (
        <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
      ) : kind === "projects" ? (
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>
      ) : kind === "resume" ? (
        <svg viewBox="0 0 24 24"><path d="M6 3h8l5 5v13H6z" /><path d="M14 3v5h5M9 13h7M9 17h7" /></svg>
      ) : kind === "contact" ? (
        <svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 8l9 6 9-6" /></svg>
      ) : (
        <svg viewBox="0 0 24 24"><path d="M3 7h6l2 2h10v10H3z" /></svg>
      )}
    </i>
  )
}

function Mark({ logo }: { logo?: string }) {
  return (
    <i data-part="mark" data-image={logo ? "" : undefined} aria-hidden="true">
      {logo ? <img src={logo} alt="" draggable={false} decoding="async" /> : null}
    </i>
  )
}

function Wordmark({ name, role, logo }: { name: string; role: string; logo?: string }) {
  return (
    <span data-part="wordmark" aria-hidden="true">
      <Mark logo={logo} />
      <b>
        {name}
        <i>xp</i>
      </b>
      <em>{role}</em>
    </span>
  )
}

function Avatar({ avatar, initials }: { avatar?: string; initials: string }) {
  return (
    <i data-part="avatar" aria-hidden="true">
      {avatar ? <img src={avatar} alt="" draggable={false} decoding="async" /> : initials}
    </i>
  )
}

// Мелкие значки хрома: стрелки панели, папки правой колонки «Пуска», трей.
function Icon({ kind }: { kind: string }) {
  switch (kind) {
    case "back":
    case "forward":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="url(#vibeui-folio-001-green)" stroke="#2d7a1e" />
          <path d={kind === "back" ? "M14 7l-5 5 5 5" : "M10 7l5 5-5 5"} fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "docs":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 6h7l2 2h11v12H2z" fill="#f2c94c" stroke="#a87608" /><path d="M2 10h20v8H2z" fill="#ffe08a" /></svg>
    case "pictures":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="1" fill="#fff" stroke="#7a7a7a" /><path d="M5 17l4-5 3 3 3-4 4 6z" fill="#4caf50" /><circle cx="16" cy="8" r="2" fill="#ffb300" /></svg>
    case "music":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 6h7l2 2h11v12H2z" fill="#7cc4ff" stroke="#1a5fb4" /><path d="M11 17a2 2 0 1 0 0-4V9l5-1v5a2 2 0 1 0 0 3v-8" fill="none" stroke="#0d3f8a" strokeWidth="1.4" /></svg>
    case "control":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" fill="#e8e6dc" stroke="#8a8578" /><rect x="6" y="6" width="5" height="5" fill="#3d86e6" /><rect x="13" y="6" width="5" height="5" fill="#e0582f" /><rect x="6" y="13" width="5" height="5" fill="#3fa23e" /><rect x="13" y="13" width="5" height="5" fill="#f2c94c" /></svg>
    case "help":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#3d86e6" stroke="#0d3f8a" /><text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff" fontFamily="Tahoma, Arial, sans-serif">?</text></svg>
    case "search":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6" fill="#dff1ff" stroke="#1a5fb4" strokeWidth="1.6" /><path d="M14.5 14.5L20 20" stroke="#5a3a1a" strokeWidth="3" strokeLinecap="round" /></svg>
    case "run":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1" fill="#fff" stroke="#7a7a7a" /><path d="M7 11h6M7 14h4" stroke="#3d86e6" strokeWidth="1.5" /><path d="M14 13l4 2-4 2z" fill="#3fa23e" /></svg>
    case "logoff":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="3" fill="#f2c94c" stroke="#a87608" /><path d="M12 6v8M8 10l4 4 4-4" fill="none" stroke="#3d2a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 18h10" stroke="#3d2a00" strokeWidth="2" strokeLinecap="round" /></svg>
    case "power":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="3" fill="#e0582f" stroke="#8a1000" /><path d="M12 6v6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" /><path d="M8.5 8.5a5 5 0 1 0 7 0" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" /></svg>
    case "speaker":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#e8e6dc" stroke="#555" /><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="#1a5fb4" strokeWidth="1.6" strokeLinecap="round" /></svg>
    case "speaker-off":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#e8e6dc" stroke="#555" /><path d="M15 9l6 6M21 9l-6 6" fill="none" stroke="#c8281b" strokeWidth="2" strokeLinecap="round" /></svg>
    case "shield":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" fill="#3fa23e" stroke="#1e6e1e" /><path d="M8 12l3 3 5-6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case "network":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="12" rx="1" fill="#7cc4ff" stroke="#1a5fb4" /><rect x="5" y="7" width="14" height="8" fill="#1a5fb4" /><path d="M8 20h8" stroke="#555" strokeWidth="2" strokeLinecap="round" /></svg>
    default:
      return null
  }
}

type Sound = "startup" | "open" | "close" | "minimize" | "menu" | "logoff"

// Короткие сигналы из осцилляторов: нота = частота, старт, длительность,
// громкость. Свои мелодии, не XP — те под копирайтом.
function chime(context: AudioContext, kind: Sound) {
  const now = context.currentTime
  const note = (frequency: number, start: number, duration: number, gain: number, type: OscillatorType = "sine", glide?: number) => {
    const oscillator = context.createOscillator()
    const envelope = context.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, now + start)
    if (glide) oscillator.frequency.exponentialRampToValueAtTime(glide, now + start + duration)
    envelope.gain.setValueAtTime(0.0001, now + start)
    envelope.gain.exponentialRampToValueAtTime(gain, now + start + 0.012)
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + start + duration)
    oscillator.connect(envelope)
    envelope.connect(context.destination)
    oscillator.start(now + start)
    oscillator.stop(now + start + duration + 0.05)
  }

  switch (kind) {
    case "startup":
      note(523.25, 0, 1.4, 0.12)
      note(659.25, 0.14, 1.3, 0.12)
      note(783.99, 0.28, 1.2, 0.12)
      note(1046.5, 0.42, 1.6, 0.14)
      note(261.63, 0, 1.9, 0.06, "triangle")
      break
    case "open":
      note(880, 0, 0.05, 0.08, "triangle")
      note(1318.5, 0.05, 0.08, 0.08, "triangle")
      break
    case "close":
      note(1318.5, 0, 0.05, 0.08, "triangle")
      note(880, 0.05, 0.09, 0.08, "triangle")
      break
    case "minimize":
      note(660, 0, 0.16, 0.07, "triangle", 330)
      break
    case "menu":
      note(1200, 0, 0.03, 0.05, "square")
      break
    case "logoff":
      note(783.99, 0, 0.35, 0.1)
      note(659.25, 0.18, 0.4, 0.1)
      note(523.25, 0.36, 0.7, 0.1)
      break
  }
}

function Ghost({ app, apps, name, role, avatar, initials }: { app: Folio001App; apps: readonly Folio001App[]; name: string; role: string; avatar?: string; initials: string }) {
  const panel = (
    <aside data-part="panel" aria-hidden="true">
      <section data-part="card" data-social="">
        <header>Ссылки</header>
        <ul>
          {["Сайт", "GitHub", "LinkedIn"].map((label) => (
            <li key={label}><i style={{ "--dot": "#0d55d6" } as CSSProperties} />{label}</li>
          ))}
        </ul>
      </section>
      <section data-part="card">
        <header>Навыки</header>
        <ul>
          {["Графика", "Веб-дизайн", "Интерфейсы", "Анимация", "Видео"].map((label, index) => (
            <li key={label}><i style={{ "--dot": ["#e0582f", "#3fa23e", "#3d86e6", "#f2c94c", "#8e44ad"][index] } as CSSProperties} />{label}</li>
          ))}
        </ul>
      </section>
      <section data-part="card">
        <header>Программы</header>
        <ul>
          {apps.map((item) => (
            <li key={item.title}><Glyph kind={item.kind} icon={item.icon} size="xs" />{item.title}</li>
          ))}
        </ul>
      </section>
    </aside>
  )

  switch (app.kind) {
    case "projects":
      return (
        <div data-part="explorer" aria-hidden="true">
          {panel}
          <div data-part="main">
            <h3>{app.title}</h3>
            <div data-part="thumbs"><i /><i /><i /><i /><i /><i /></div>
          </div>
        </div>
      )
    case "resume":
      return (
        <div data-part="explorer" aria-hidden="true">
          <div data-part="main" data-gray="">
            <div data-part="sheet">
              <h3>{name}</h3>
              <small>{role}</small>
              {["Опыт", "Навыки", "Образование"].map((label) => (
                <div key={label}>
                  <h4>{label}</h4>
                  <span data-part="bar" />
                  <span data-part="bar" />
                  <span data-part="bar" data-soft="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    case "contact":
      return (
        <div data-part="explorer" aria-hidden="true">
          {panel}
          <div data-part="main" data-light="">
            <h3>{app.title}</h3>
            <div data-part="form">
              <label>Имя</label>
              <span data-part="field" />
              <label>Почта</label>
              <span data-part="field" />
              <label>Сообщение</label>
              <span data-part="field" data-area="" />
              <span data-part="ok">Отправить</span>
            </div>
          </div>
        </div>
      )
    case "about": {
      const others = apps.filter((item) => item !== app)

      return (
        <div data-part="explorer" aria-hidden="true">
          {panel}
          <div data-part="main">
            <h3>{app.title}</h3>
            <div data-part="lead">
              <strong>{name}</strong>
              <span>{role}</span>
            </div>
            {[0, 1, 2].map((index) => (
              <div key={index} data-part="para">
                {index === 0 || !others[index - 1] ? (
                  <Avatar avatar={avatar} initials={initials} />
                ) : (
                  <Glyph kind={others[index - 1].kind} icon={others[index - 1].icon} />
                )}
                <div>
                  <span data-part="bar" />
                  <span data-part="bar" />
                  <span data-part="bar" data-soft="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    default:
      return (
        <div data-part="explorer" aria-hidden="true">
          {panel}
          <div data-part="main" data-light="">
            <h3>{app.title}</h3>
            <span data-part="bar" />
            <span data-part="bar" />
            <span data-part="bar" data-soft="" />
          </div>
        </div>
      )
  }
}

/** Рабочий стол XP: загрузка, вход, значки, окна и таскбар. Без картинок и зависимостей. */
export function Folio001({
  name = "Иван Петров",
  role = "Дизайнер интерфейсов",
  avatar,
  apps = DEFAULT_APPS,
  start = "boot",
  wallpaper = "hills",
  logo,
  crt = true,
  sounds = false,
  className,
  style,
}: Folio001Props) {
  const host = useRef<HTMLDivElement>(null)
  const [scene, setScene] = useState<"boot" | "login" | "desktop">(start)
  const [leaving, setLeaving] = useState(false)
  const [windows, setWindows] = useState<Record<number, Win>>({})
  const [active, setActive] = useState<number | null>(null)
  const [menu, setMenu] = useState(false)
  const [muted, setMuted] = useState(!sounds)
  const audio = useRef<AudioContext | null>(null)
  const scanline = useRef<HTMLElement>(null)
  const [clock, setClock] = useState("")
  const zTop = useRef(10)
  const drag = useRef<{ id: number; dx: number; dy: number } | null>(null)
  const resize = useRef<{ id: number; x: number; y: number; w: number; h: number } | null>(null)
  const initials = name.split(/\s+/).map((part) => part[0] ?? "").join("").slice(0, 2).toUpperCase()

  // Сцены: загрузка сама уходит во вход через 3 с; вход ждёт клика, но
  // через 6 с заходит сам — чтобы в превью стол показался без участия.
  // Клик по пользователю гасит вход, показывает «Добро пожаловать» и
  // через 1.6 с открывает стол — как приветствие настоящей XP.
  useEffect(() => {
    if (scene === "boot") {
      const timer = window.setTimeout(() => setScene("login"), 3000)

      return () => window.clearTimeout(timer)
    }

    if (scene === "login" && !leaving) {
      const timer = window.setTimeout(() => setLeaving(true), 6000)

      return () => window.clearTimeout(timer)
    }

    if (scene === "login" && leaving) {
      const timer = window.setTimeout(() => {
        setLeaving(false)
        setScene("desktop")
      }, 1600)

      return () => window.clearTimeout(timer)
    }
  }, [scene, leaving])

  // Смена пропа sounds переключает mute — правкой состояния в рендере, без эффекта.
  const [soundsSeen, setSoundsSeen] = useState(sounds)

  if (soundsSeen !== sounds) {
    setSoundsSeen(sounds)
    setMuted(!sounds)
  }

  useEffect(() => () => void audio.current?.close(), [])

  // Строка развёртки: проход 3–4 с линейно, пауза 1–4 с, и так по кругу —
  // тайминги как у настоящего ЭЛТ-эффекта. Двигается transition, не
  // анимацией: длительность каждого прохода случайная.
  useEffect(() => {
    const line = scanline.current

    if (!line || !crt || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let timer = 0
    const run = () => {
      const height = line.parentElement?.clientHeight ?? 600

      line.style.transition = "none"
      line.style.transform = "translateY(0)"
      void line.offsetHeight
      line.style.transition = `transform ${3000 + Math.random() * 1000}ms linear`
      line.style.transform = `translateY(${height + 40}px)`
    }
    const rest = () => {
      line.style.transition = "none"
      line.style.transform = "translateY(0)"
      timer = window.setTimeout(run, 1000 + Math.random() * 3000)
    }

    line.addEventListener("transitionend", rest)
    timer = window.setTimeout(run, 1000)

    return () => {
      window.clearTimeout(timer)
      line.removeEventListener("transitionend", rest)
    }
  }, [crt])

  // Контекст создаётся при первом звуке — то есть уже внутри клика.
  function play(kind: Sound) {
    if (muted || typeof AudioContext === "undefined") return

    audio.current ??= new AudioContext()
    if (audio.current.state === "suspended") void audio.current.resume()
    chime(audio.current, kind)
  }

  useEffect(() => {
    const tick = () => setClock(new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(new Date()))

    tick()
    const timer = window.setInterval(tick, 30000)

    return () => window.clearInterval(timer)
  }, [])

  function reset(next: "boot" | "login") {
    setMenu(false)
    setWindows({})
    setActive(null)
    setScene(next)
  }

  function open(id: number) {
    if (!windows[id]) play("open")
    zTop.current += 1
    const z = zTop.current

    setWindows((current) => {
      const existing = current[id]

      if (existing) return { ...current, [id]: { ...existing, minimized: false, z } }

      const count = Object.keys(current).length
      const box = host.current
      const width = box?.clientWidth ?? 800
      const height = box?.clientHeight ?? 600

      return {
        ...current,
        [id]: {
          id,
          x: Math.max(8, Math.min(150, width * 0.12)) + count * 24,
          y: 24 + count * 24,
          w: Math.min(760, width - 170),
          h: Math.min(560, height - 96),
          z,
          minimized: false,
          maximized: false,
        },
      }
    })
    setActive(id)
    setMenu(false)
  }

  function focus(id: number) {
    zTop.current += 1
    const z = zTop.current

    setWindows((current) => (current[id] ? { ...current, [id]: { ...current[id], z } } : current))
    setActive(id)
  }

  function close(id: number) {
    play("close")
    setWindows((current) => {
      const next = { ...current }

      delete next[id]

      return next
    })
    setActive((current) => (current === id ? null : current))
  }

  function toggleMinimize(id: number) {
    if (!windows[id]?.minimized) play("minimize")
    setWindows((current) => ({ ...current, [id]: { ...current[id], minimized: !current[id].minimized } }))
    setActive((current) => (current === id ? null : current))
  }

  function toggleMaximize(id: number) {
    setWindows((current) => ({ ...current, [id]: { ...current[id], maximized: !current[id].maximized } }))
    focus(id)
  }

  // Перетаскивание за заголовок и растягивание за угол: захват указателя,
  // координаты — от стола.
  function grab(event: PointerEvent<HTMLDivElement>, id: number) {
    if ((event.target as HTMLElement).closest("button")) return

    const win = windows[id]

    if (!win || win.maximized) return

    focus(id)
    drag.current = { id, dx: event.clientX - win.x, dy: event.clientY - win.y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current
    const box = host.current

    if (!current || !box) return

    const x = Math.max(-40, Math.min(box.clientWidth - 80, event.clientX - current.dx))
    const y = Math.max(0, Math.min(box.clientHeight - 60, event.clientY - current.dy))

    setWindows((state) => ({ ...state, [current.id]: { ...state[current.id], x, y } }))
  }

  function release() {
    drag.current = null
    resize.current = null
  }

  function grabCorner(event: PointerEvent<HTMLElement>, id: number) {
    const win = windows[id]

    if (!win || win.maximized) return

    focus(id)
    resize.current = { id, x: event.clientX, y: event.clientY, w: win.w, h: win.h }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.stopPropagation()
  }

  function stretch(event: PointerEvent<HTMLElement>) {
    const current = resize.current

    if (!current) return

    const w = Math.max(300, current.w + event.clientX - current.x)
    const h = Math.max(200, current.h + event.clientY - current.y)

    setWindows((state) => ({ ...state, [current.id]: { ...state[current.id], w, h } }))
  }

  const list = Object.values(windows).sort((a, b) => a.id - b.id)

  return (
    <>
      <style href="vibeui-folio-001" precedence="medium">
        {STYLES}
      </style>
      <div
        ref={host}
        data-vibeui-block="folio-001"
        data-wallpaper={wallpaper === "graphite" ? "graphite" : undefined}
        className={className}
        style={style}
      >
        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="vibeui-folio-001-green" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8fe07a" />
              <stop offset="1" stopColor="#2f8f2f" />
            </linearGradient>
          </defs>
        </svg>

        {scene === "boot" ? (
          <div data-part="scene">
            <div data-part="boot" role="status" aria-label="Загрузка">
              <div>
                <Wordmark name={name} role={role} logo={logo} />
                <div data-part="progress" aria-hidden="true"><i /><i /><i /></div>
              </div>
              <p data-part="boot-hint">
                Для лучшего впечатления
                <br />
                откройте на весь экран (F11)
              </p>
            </div>
          </div>
        ) : null}

        {scene === "login" ? (
          <div data-part="scene">
            <div data-part="login" data-leaving={leaving ? "" : undefined}>
              <div data-part="login-inner">
                <i data-part="divider" aria-hidden="true" />
                <div data-part="login-left">
                  <Wordmark name={name} role={role} logo={logo} />
                  <p>Чтобы начать, нажмите на имя пользователя</p>
                </div>
                <div data-part="login-right">
                  <button type="button" data-part="user" onClick={() => {
                      play("startup")
                      setLeaving(true)
                    }}
                    disabled={leaving}
                  >
                    <Avatar avatar={avatar} initials={initials} />
                    <span>
                      <b>{name}</b>
                      <small>{role}</small>
                    </span>
                  </button>
                </div>
              </div>
              <button
                type="button"
                data-part="restart"
                onClick={() => {
                  play("logoff")
                  reset("boot")
                }}
              >
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <rect x="2" y="2" width="28" height="28" rx="4" fill="#3fa23e" stroke="#1e6e1e" />
                  <path d="M22 12a8 8 0 1 0 2 5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  <path d="M23 6v7h-7" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Перезагрузить</span>
              </button>
              <p data-part="login-note">
                После входа система в вашем распоряжении.
                <br />
                Каждая деталь здесь сделана не случайно.
              </p>
              {leaving ? <p data-part="welcome">Добро пожаловать</p> : null}
            </div>
          </div>
        ) : null}

        {scene === "desktop" ? (
          <div data-part="scene" onPointerDown={() => menu && setMenu(false)}>
            <div data-part="desktop" style={{ position: "absolute", inset: 0 }}>
              {wallpaper !== "hills" && wallpaper !== "graphite" ? (
                <img src={wallpaper} alt="" draggable={false} decoding="async" />
              ) : null}
            </div>
            <div data-part="icons">
              {apps.map((app, index) => (
                <button
                  key={app.title}
                  type="button"
                  data-part="icon"
                  data-selected={active === index ? "" : undefined}
                  onDoubleClick={() => open(index)}
                  onClick={() => {
                    // На touch двойного клика нет: одно касание открывает.
                    if (window.matchMedia("(hover: none)").matches) open(index)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") open(index)
                  }}
                  aria-label={`Открыть ${app.title}`}
                >
                  <Glyph kind={app.kind} icon={app.icon} />
                  {app.title}
                </button>
              ))}
            </div>

            {list.map((win) => {
              const app = apps[win.id]

              if (!app) return null

              const others = apps.map((item, index) => ({ item, index })).filter(({ index }) => index !== win.id).slice(0, 2)

              return (
                <section
                  key={win.id}
                  data-part="window"
                  data-inactive={active === win.id ? undefined : ""}
                  data-minimized={win.minimized ? "" : undefined}
                  data-maximized={win.maximized ? "" : undefined}
                  aria-label={app.title}
                  style={
                    win.maximized
                      ? { inset: "0 0 30px", width: "auto", height: "auto", zIndex: win.z }
                      : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }
                  }
                  onPointerDown={() => active !== win.id && focus(win.id)}
                >
                  <div
                    data-part="titlebar"
                    onPointerDown={(event) => grab(event, win.id)}
                    onPointerMove={move}
                    onPointerUp={release}
                    onPointerCancel={release}
                    onDoubleClick={() => toggleMaximize(win.id)}
                  >
                    <Glyph kind={app.kind} icon={app.icon} size="s" />
                    <span>{app.title}</span>
                    <div data-part="controls">
                      <button type="button" aria-label="Свернуть" onClick={() => toggleMinimize(win.id)}>
                        <svg viewBox="0 0 11 11"><path d="M2.5 8.5h5" strokeWidth="2.2" /></svg>
                      </button>
                      <button type="button" aria-label={win.maximized ? "Восстановить" : "Развернуть"} onClick={() => toggleMaximize(win.id)}>
                        {win.maximized ? (
                          <svg viewBox="0 0 11 11"><path d="M3.5 3.5v-2h6v6h-2" /><rect x="1.5" y="3.5" width="6" height="6" /><path d="M1.5 5h6" /></svg>
                        ) : (
                          <svg viewBox="0 0 11 11"><rect x="1.5" y="1.5" width="8" height="8" /><path d="M1.5 3.5h8" strokeWidth="2.2" /></svg>
                        )}
                      </button>
                      <button type="button" data-close="" aria-label="Закрыть" onClick={() => close(win.id)}>
                        <svg viewBox="0 0 11 11"><path d="M2.5 2.5l6 6M8.5 2.5l-6 6" /></svg>
                      </button>
                    </div>
                  </div>
                  <div data-part="body">
                    <div data-part="menubar" aria-hidden="true">
                      <span>Файл</span>
                      <span>Вид</span>
                      <span data-disabled="">Справка</span>
                      <Mark logo={logo} />
                    </div>
                    <div data-part="toolbar" aria-hidden="true">
                      <button type="button" data-disabled="" tabIndex={-1}><Icon kind="back" />Назад</button>
                      <button type="button" data-disabled="" tabIndex={-1}><Icon kind="forward" />Вперёд</button>
                      <i />
                      {others.map(({ item, index }) => (
                        <button key={item.title} type="button" tabIndex={-1} onClick={() => open(index)}>
                          <Glyph kind={item.kind} icon={item.icon} size="m" />
                          {item.title}
                        </button>
                      ))}
                      <i />
                      <button type="button" data-disabled="" tabIndex={-1}><Glyph kind="folder" size="m" /></button>
                    </div>
                    <div data-part="address" aria-hidden="true">
                      <span>Адрес</span>
                      <div data-part="addressbox">
                        <Glyph kind={app.kind} icon={app.icon} size="xs" />
                        <span>{app.title}</span>
                        <svg viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" /></svg>
                      </div>
                      <span data-part="go"><i />Переход</span>
                    </div>
                    <div data-part="content">
                      {app.content ?? <Ghost app={app} apps={apps} name={name} role={role} avatar={avatar} initials={initials} />}
                    </div>
                    <div data-part="status" aria-hidden="true">
                      Готово
                      <i />
                    </div>
                  </div>
                  {win.maximized ? null : (
                    <i
                      data-part="resize"
                      aria-hidden="true"
                      onPointerDown={(event) => grabCorner(event, win.id)}
                      onPointerMove={stretch}
                      onPointerUp={release}
                      onPointerCancel={release}
                    />
                  )}
                </section>
              )
            })}

            {menu ? (
              <div data-part="startmenu" role="menu" onPointerDown={(event) => event.stopPropagation()}>
                <header>
                  <Avatar avatar={avatar} initials={initials} />
                  {name}
                </header>
                <div data-part="sm-body">
                  <ul data-part="sm-left">
                    {apps.slice(0, 2).map((app, index) => (
                      <li key={app.title}>
                        <button type="button" role="menuitem" onClick={() => open(index)}>
                          <Glyph kind={app.kind} icon={app.icon} />
                          <span>
                            <b>{app.title}</b>
                            <small>{app.hint ?? HINTS[app.kind ?? "folder"]}</small>
                          </span>
                        </button>
                      </li>
                    ))}
                    <li data-part="sm-divider" role="separator" />
                    {apps.slice(2).map((app, index) => (
                      <li key={app.title}>
                        <button type="button" role="menuitem" onClick={() => open(index + 2)}>
                          <Glyph kind={app.kind} icon={app.icon} />
                          <span>{app.title}</span>
                        </button>
                      </li>
                    ))}
                    <li data-part="sm-divider" role="separator" />
                    <li data-part="sm-all">
                      <button type="button" role="menuitem">Все программы</button>
                    </li>
                  </ul>
                  <ul data-part="sm-right">
                    {PLACES.map((entry, index) =>
                      entry ? (
                        <li key={entry[0]}>
                          <button type="button" role="menuitem">
                            <Icon kind={entry[0]} />
                            <span>{entry[2] ? <b>{entry[1]}</b> : entry[1]}</span>
                          </button>
                        </li>
                      ) : (
                        <li key={index} data-part="sm-divider" role="separator" />
                      ),
                    )}
                  </ul>
                </div>
                <footer>
                  <button
                    type="button"
                    onClick={() => {
                      play("logoff")
                      reset("login")
                    }}
                  >
                    <Icon kind="logoff" />
                    Выйти
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      play("logoff")
                      reset("boot")
                    }}
                  >
                    <Icon kind="power" />
                    Выключение
                  </button>
                </footer>
              </div>
            ) : null}

            <div data-part="taskbar" onPointerDown={(event) => event.stopPropagation()}>
              <button type="button" data-part="startbtn" aria-expanded={menu} onClick={() => {
                  play("menu")
                  setMenu((open) => !open)
                }}
              >
                <Mark logo={logo} />
                пуск
              </button>
              <div data-part="tasks">
                {list.map((win) => (
                  <button
                    key={win.id}
                    type="button"
                    data-active={active === win.id && !win.minimized ? "" : undefined}
                    onClick={() => (win.minimized || active !== win.id ? (win.minimized ? toggleMinimize(win.id) : focus(win.id)) : toggleMinimize(win.id))}
                  >
                    <Glyph kind={apps[win.id]?.kind} icon={apps[win.id]?.icon} size="s" />
                    <span>{apps[win.id]?.title}</span>
                  </button>
                ))}
              </div>
              <div data-part="tray">
                <Icon kind="shield" />
                <Icon kind="network" />
                <button type="button" aria-label={muted ? "Включить звук" : "Выключить звук"} aria-pressed={!muted} onClick={() => setMuted((current) => !current)}>
                  <Icon kind={muted ? "speaker-off" : "speaker"} />
                </button>
                <time aria-hidden="true">{clock}</time>
              </div>
            </div>
          </div>
        ) : null}

        {crt ? (
          <>
            <i data-part="crt" aria-hidden="true" />
            <i ref={scanline} data-part="scanline" aria-hidden="true" />
          </>
        ) : null}
      </div>
    </>
  )
}
