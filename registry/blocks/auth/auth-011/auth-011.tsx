"use client"

import {
  useId,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react"

type Side = "login" | "signup"
/** Обработчик отправки: вернул текст — он показывается как ошибка формы. */
type SubmitResult = ReactNode | void | Promise<ReactNode | void>

export type Auth011Props = {
  initialSide?: Side
  onSideChange?: (side: Side) => void
  onLogin?: (data: {
    email: string
    password: string
    remember: boolean
  }) => SubmitResult
  /** Вызывается после анимации успеха — сюда переход в кабинет. */
  onSuccess?: (side: Side) => void
  onSignup?: (data: {
    name: string
    email: string
    password: string
  }) => SubmitResult
  /** Сообщение над кнопкой входа — например, «пароль обновлён». */
  loginNotice?: ReactNode
  forgotHref?: string
  nameRequired?: boolean
  passwordMinLength?: number
  mismatchLabel?: string
  emailMissingLabel?: string
  emailInvalidLabel?: string
  passwordMissingLabel?: string
  /** {n} заменяется минимальной длиной. */
  passwordShortLabel?: string
  pendingLabel?: string
  loginTitle?: string
  loginLead?: string
  loginSubmit?: string
  signupTitle?: string
  signupLead?: string
  signupSubmit?: string
  nameLabel?: string
  emailLabel?: string
  passwordLabel?: string
  confirmLabel?: string
  rememberLabel?: string
  forgot?: string
  toSignup?: string
  toLogin?: string
  /** Текст на кнопке после отправки, пока форма «празднует» успех. */
  successLabel?: string
  showPasswordLabel?: string
  accent?: string
  /** Цвет поверхности: неоморфизм лепит тени из того же цвета, что и фон. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: вход и регистрация на одной неоморфной карточке, которая
// переворачивается по кнопке-кругу. Обе стороны лежат в одной ячейке грида,
// поэтому высота карточки равна высоте большей стороны — без жёсткого
// min-height и без обрезки на узкой ширине. Неоморфизм держится на том, что
// подложка, поля и кнопки одного цвета, а объём дают две тени — светлая и
// тёмная; поэтому фон у блока свой и меняется вместе с тенями.
const STYLES = `
:where([data-vibeui-block="auth-011"]){
--vibeui-auth-011-surface:light-dark(oklch(0.945 0.003 60),oklch(0.215 0.003 60));
--vibeui-auth-011-field:light-dark(oklch(0.93 0.004 60),oklch(0.175 0.003 60));
--vibeui-auth-011-edge:light-dark(oklch(1 0 0 / 0.7),oklch(1 0 0 / 0.07));
--vibeui-auth-011-fg:light-dark(oklch(0.24 0.01 60),oklch(0.96 0.003 60));
--vibeui-auth-011-muted:light-dark(oklch(0.5 0.01 60),oklch(0.72 0.005 60));
--vibeui-auth-011-accent:oklch(0.6803 0.2144 39.8);
--vibeui-auth-011-accent-hi:oklch(from var(--vibeui-auth-011-accent) calc(l + 0.1) c calc(h + 22));
--vibeui-auth-011-on-accent:oklch(0.145 0 0);
--vibeui-auth-011-light:light-dark(oklch(1 0 0 / 0.95),oklch(1 0 0 / 0.045));
--vibeui-auth-011-dark:light-dark(oklch(0.6 0.015 60 / 0.35),oklch(0 0 0 / 0.6));
--vibeui-auth-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-011"]{color-scheme:dark}
[data-vibeui-block="auth-011"]{
width:100%;min-width:min(100%,17rem);max-width:25rem;margin-inline:auto;box-sizing:border-box;
color:var(--vibeui-auth-011-fg);font-family:var(--vibeui-auth-011-font);
}
[data-vibeui-block="auth-011"] *{box-sizing:border-box}
/* Отступ под тени карточки, сам слой прозрачный. */
[data-vibeui-block="auth-011"] [data-part="scene"]{padding:1rem}
[data-vibeui-block="auth-011"] [data-part="card"]{display:grid}
[data-vibeui-block="auth-011"] [data-part="panel"]{
grid-area:1/1;padding:1.5rem 1.5rem 1.25rem;border-radius:1.75rem;
background:var(--vibeui-auth-011-surface);
border:1px solid var(--vibeui-auth-011-edge);
box-shadow:10px 10px 22px var(--vibeui-auth-011-dark),-8px -8px 18px var(--vibeui-auth-011-light);
}
[data-vibeui-block="auth-011"] [data-part="panel"][inert]{visibility:hidden}
/* 3D включается только на время переворота: preserve-3d и backface-visibility
   выносят карточку в отдельный GPU-слой, и при масштабе превью он мылится.
   В покое карточка — обычный плоский элемент с чётким текстом. */
[data-vibeui-block="auth-011"][data-flipping] [data-part="scene"]{perspective:1600px}
[data-vibeui-block="auth-011"][data-flipping] [data-part="card"]{transform-style:preserve-3d}
/* Переход включается вторым шагом: иначе при старте со стороны регистрации
   карточка сначала анимированно уезжала бы в 180°, и обратный переворот
   выглядел бы простым переключением. */
[data-vibeui-block="auth-011"][data-flipping="run"] [data-part="card"]{transition:transform 1s cubic-bezier(.68,-0.55,.27,1.55)}
[data-vibeui-block="auth-011"][data-flipping][data-side="signup"] [data-part="card"]{transform:rotateY(180deg)}
[data-vibeui-block="auth-011"][data-flipping] [data-part="panel"]{
visibility:visible;backface-visibility:hidden;-webkit-backface-visibility:hidden;
}
[data-vibeui-block="auth-011"][data-flipping] [data-part="panel"][data-face="signup"]{transform:rotateY(180deg)}
[data-vibeui-block="auth-011"] [data-part="logo"]{
width:3.25rem;height:3.25rem;margin:0 auto .75rem;display:grid;place-items:center;border-radius:50%;
color:var(--vibeui-auth-011-accent);background:var(--vibeui-auth-011-surface);
box-shadow:5px 5px 10px var(--vibeui-auth-011-dark),-5px -5px 10px var(--vibeui-auth-011-light);
transition:transform .4s ease;
}
[data-vibeui-block="auth-011"] [data-part="logo"]:hover{transform:translateY(-5px) rotate(8deg)}
[data-vibeui-block="auth-011"] [data-part="logo"] svg{width:1.3rem;height:1.3rem}
[data-vibeui-block="auth-011"] h2{margin:0 0 .3rem;text-align:center;font-size:1.4rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="auth-011"] [data-part="lead"]{margin:0 0 1.25rem;text-align:center;font-size:.8125rem;color:var(--vibeui-auth-011-muted)}
[data-vibeui-block="auth-011"] form{display:grid;gap:.85rem}
[data-vibeui-block="auth-011"] [data-part="field"]{position:relative;height:3.1rem}
/* Бегущая искра вокруг поля: конический градиент крутится под маской-подложкой,
   видна только полоска в 2px между краем подложки и краем поля. */
[data-vibeui-block="auth-011"] [data-part="spark"],
[data-vibeui-block="auth-011"] [data-part="glow"]{
position:absolute;border-radius:1.2rem;overflow:hidden;pointer-events:none;opacity:0;transition:opacity .2s ease;
}
[data-vibeui-block="auth-011"] [data-part="spark"]{inset:-2px}
[data-vibeui-block="auth-011"] [data-part="glow"]{inset:-3px;filter:blur(4px)}
[data-vibeui-block="auth-011"] [data-part="spark"]::before,
[data-vibeui-block="auth-011"] [data-part="glow"]::before{
content:"";position:absolute;width:170%;height:170%;left:-35%;top:-35%;
background:conic-gradient(from 0deg,transparent 0deg 30deg,var(--vibeui-auth-011-accent-hi) 45deg,var(--vibeui-auth-011-accent) 70deg,transparent 105deg 360deg);
animation:vibeui-auth-011-spin 1.1s linear infinite;
}
[data-vibeui-block="auth-011"] [data-part="spark"]::after{
content:"";position:absolute;inset:2px;border-radius:1.1rem;background:var(--vibeui-auth-011-field);
}
[data-vibeui-block="auth-011"] [data-part="field"]:focus-within [data-part="spark"]{opacity:1}
[data-vibeui-block="auth-011"] [data-part="field"]:focus-within [data-part="glow"]{opacity:.5}
@keyframes vibeui-auth-011-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="auth-011"] [data-part="field"] input{
position:absolute;inset:2px;width:calc(100% - 4px);height:calc(100% - 4px);z-index:1;
border:0;outline:0;border-radius:1rem;padding:0 3rem 0 1.1rem;
background:var(--vibeui-auth-011-field);color:inherit;font:inherit;font-size:.9375rem;
box-shadow:inset 3px 3px 6px var(--vibeui-auth-011-dark),inset -3px -3px 6px var(--vibeui-auth-011-light);
transition:box-shadow .25s ease;
}
/* Автозаполнение Chrome красит фон своим цветом через !important — перекрываем
   его заливкой inset-тенью, иначе поле не следует за темой. */
[data-vibeui-block="auth-011"] [data-part="field"] input:autofill{-webkit-text-fill-color:var(--vibeui-auth-011-fg);caret-color:var(--vibeui-auth-011-fg);
box-shadow:inset 3px 3px 6px var(--vibeui-auth-011-dark),inset -3px -3px 6px var(--vibeui-auth-011-light),inset 0 0 0 100px var(--vibeui-auth-011-field)}
[data-vibeui-block="auth-011"] [data-part="field"] input:focus{
box-shadow:inset 2px 2px 4px var(--vibeui-auth-011-dark),inset -2px -2px 4px var(--vibeui-auth-011-light),inset 0 0 0 100px var(--vibeui-auth-011-field);
}
[data-vibeui-block="auth-011"] [data-part="field"] label{
position:absolute;left:1.1rem;top:50%;translate:0 -50%;z-index:2;pointer-events:none;
color:var(--vibeui-auth-011-muted);font-size:.9375rem;transition:all .25s ease;
}
[data-vibeui-block="auth-011"] [data-part="field"] input:focus + label,
[data-vibeui-block="auth-011"] [data-part="field"] input:not(:placeholder-shown) + label,
[data-vibeui-block="auth-011"] [data-part="field"] input:autofill + label{
top:0;left:.8rem;padding:.1rem .5rem;border-radius:.45rem;font-size:.6875rem;
color:var(--vibeui-auth-011-accent);background:var(--vibeui-auth-011-field);white-space:nowrap;
}
[data-vibeui-block="auth-011"] [data-part="reveal"]{
position:absolute;right:.75rem;top:50%;translate:0 -50%;z-index:3;width:2rem;height:2rem;
display:grid;place-items:center;appearance:none;border:0;border-radius:50%;cursor:pointer;
background:transparent;color:var(--vibeui-auth-011-muted);transition:color .2s ease,scale .2s ease;
}
[data-vibeui-block="auth-011"] [data-part="reveal"]:hover{color:var(--vibeui-auth-011-accent);scale:1.1}
[data-vibeui-block="auth-011"] [data-part="reveal"] svg{width:1.1rem;height:1.1rem}
[data-vibeui-block="auth-011"] [data-part="options"]{
display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.5rem;
margin:-.1rem .2rem .35rem;font-size:.8125rem;color:var(--vibeui-auth-011-muted);
}
[data-vibeui-block="auth-011"] [data-part="options"] label{display:flex;align-items:center;gap:.45rem;cursor:pointer}
[data-vibeui-block="auth-011"] [data-part="options"] input{accent-color:var(--vibeui-auth-011-accent);margin:0}
[data-vibeui-block="auth-011"] [data-part="options"] a{color:var(--vibeui-auth-011-accent);text-decoration:none}
[data-vibeui-block="auth-011"] [data-part="options"] a:hover{text-decoration:underline}
/* Сообщения всплывают поверх формы и не сдвигают раскладку: у поля — под
   ним, общие — над кнопкой. */
[data-vibeui-block="auth-011"] [data-part="action"]{position:relative}
[data-vibeui-block="auth-011"] [data-part="message"]{
position:absolute;z-index:10;left:.25rem;right:.25rem;margin:0;
padding:.5rem .75rem;border-radius:.75rem;font-size:.75rem;line-height:1.4;text-align:left;
background:var(--vibeui-auth-011-accent);color:var(--vibeui-auth-011-on-accent);font-weight:600;
box-shadow:0 10px 24px oklch(0 0 0 / 0.35);
animation:vibeui-auth-011-pop .18s ease-out;pointer-events:auto;
}
[data-vibeui-block="auth-011"] [data-part="message"]::before{
content:"";position:absolute;left:1.1rem;width:.6rem;height:.6rem;rotate:45deg;background:inherit;
}
[data-vibeui-block="auth-011"] [data-part="field"] [data-part="message"]{top:calc(100% + .45rem)}
[data-vibeui-block="auth-011"] [data-part="field"] [data-part="message"]::before{top:-.25rem}
[data-vibeui-block="auth-011"] [data-part="action"] [data-part="message"]{bottom:calc(100% + .55rem)}
[data-vibeui-block="auth-011"] [data-part="action"] [data-part="message"]::before{bottom:-.25rem}
[data-vibeui-block="auth-011"] [data-part="message"] a{color:inherit;font-weight:650}
@keyframes vibeui-auth-011-pop{from{opacity:0;translate:0 -4px}}
[data-vibeui-block="auth-011"] [data-part="submit"]:disabled{cursor:progress;opacity:.7}
[data-vibeui-block="auth-011"] [data-part="submit"]{
position:relative;isolation:isolate;overflow:hidden;width:100%;height:3rem;margin-top:.15rem;
appearance:none;border:0;border-radius:1.05rem;cursor:pointer;
background:var(--vibeui-auth-011-surface);color:var(--vibeui-auth-011-accent);
font:inherit;font-size:.875rem;font-weight:700;letter-spacing:.03em;text-transform:uppercase;
box-shadow:5px 5px 10px var(--vibeui-auth-011-dark),-5px -5px 10px var(--vibeui-auth-011-light);
transition:color .3s ease,transform .3s ease,box-shadow .3s ease;
}
[data-vibeui-block="auth-011"] [data-part="submit"]::before{
content:"";position:absolute;inset:0;z-index:-1;
background:linear-gradient(110deg,var(--vibeui-auth-011-accent),var(--vibeui-auth-011-accent-hi),var(--vibeui-auth-011-accent));
background-size:200% 100%;transform:translateY(102%);transition:transform .35s ease;
}
[data-vibeui-block="auth-011"] [data-part="submit"]:hover::before,
[data-vibeui-block="auth-011"] [data-part="submit"][data-done]::before{
transform:translateY(0);animation:vibeui-auth-011-slide 1.5s linear infinite;
}
@keyframes vibeui-auth-011-slide{from{background-position:0 50%}to{background-position:200% 50%}}
[data-vibeui-block="auth-011"] [data-part="submit"]:hover,
[data-vibeui-block="auth-011"] [data-part="submit"][data-done]{
color:var(--vibeui-auth-011-on-accent);transform:translateY(-3px);
box-shadow:0 10px 25px oklch(from var(--vibeui-auth-011-accent) l c h / 0.35);
}
[data-vibeui-block="auth-011"] [data-part="submit"]:active{transform:scale(.97)}
[data-vibeui-block="auth-011"] [data-part="switch"]{
display:flex;align-items:center;justify-content:center;gap:.75rem;margin-top:1rem;
font-size:.8125rem;color:var(--vibeui-auth-011-muted);
}
[data-vibeui-block="auth-011"] [data-part="flip"]{
width:2.5rem;height:2.5rem;flex:none;display:grid;place-items:center;appearance:none;border:0;border-radius:50%;cursor:pointer;
background:var(--vibeui-auth-011-surface);color:var(--vibeui-auth-011-accent);
box-shadow:4px 4px 9px var(--vibeui-auth-011-dark),-4px -4px 9px var(--vibeui-auth-011-light);
transition:transform .35s ease,background-color .35s ease,color .35s ease,box-shadow .35s ease;
}
[data-vibeui-block="auth-011"] [data-part="flip"] svg{width:1.3rem;height:1.3rem}
[data-vibeui-block="auth-011"] [data-part="flip"]:hover{
color:var(--vibeui-auth-011-on-accent);background:var(--vibeui-auth-011-accent);transform:rotate(180deg) scale(1.08);
box-shadow:0 8px 25px oklch(from var(--vibeui-auth-011-accent) l c h / 0.35);
}
[data-vibeui-block="auth-011"] [data-part="flip"]:active{transform:scale(.9)}
[data-vibeui-block="auth-011"] :is(button,a,input[type="checkbox"]):focus-visible{
outline:2px solid var(--vibeui-auth-011-accent);outline-offset:3px;
}
@container (max-width:22rem){
[data-vibeui-block="auth-011"] [data-part="scene"]{padding:.75rem}
[data-vibeui-block="auth-011"] [data-part="panel"]{padding:1.25rem 1.1rem 1.1rem}
}
/* На низком экране значок первым уступает место форме. */
@media (max-height:44rem){[data-vibeui-block="auth-011"] [data-part="logo"]{display:none}}
[data-vibeui-block="auth-011"] [data-part="field"][data-invalid] input{
box-shadow:inset 2px 2px 4px var(--vibeui-auth-011-dark),inset -2px -2px 4px var(--vibeui-auth-011-light),inset 0 0 0 100px var(--vibeui-auth-011-field),0 0 0 1.5px var(--vibeui-auth-011-accent);
}
/* Ожидание ответа: значок дышит, пока сервер думает. */
[data-vibeui-block="auth-011"][data-pending] [data-part="logo"]{animation:vibeui-auth-011-breathe 1.1s ease-in-out infinite}
@keyframes vibeui-auth-011-breathe{50%{transform:scale(1.08);box-shadow:0 0 0 6px oklch(from var(--vibeui-auth-011-accent) l c h / 0.18)}}
/* Успех в три такта: кнопка заливается и ставит галочку (1), карточка
   уходит вглубь, а в центре всплывает круг с открывающимся замком (2),
   круг вспыхивает и гаснет вместе с подсветкой сцены (3). Круг живёт поверх
   карточки, а не в её шапке: на низком экране значок шапки спрятан. */
[data-vibeui-block="auth-011"] [data-part="scene"]{position:relative}
[data-vibeui-block="auth-011"] [data-part="card"]{transition:opacity .55s ease,scale .55s ease,filter .55s ease}
[data-vibeui-block="auth-011"]:is([data-success="2"],[data-success="3"]) [data-part="card"]{opacity:0;scale:.92;filter:blur(8px);pointer-events:none}
[data-vibeui-block="auth-011"] [data-part="success"]{
position:absolute;inset:0;z-index:5;display:grid;place-items:center;pointer-events:none;
opacity:0;visibility:hidden;
}
[data-vibeui-block="auth-011"] [data-part="success"]::before{
content:"";position:absolute;width:70%;aspect-ratio:1;border-radius:50%;
background:radial-gradient(closest-side,oklch(from var(--vibeui-auth-011-accent) l c h / 0.55),transparent);
opacity:0;scale:.4;
}
[data-vibeui-block="auth-011"]:is([data-success="2"],[data-success="3"]) [data-part="success"]{opacity:1;visibility:visible}
[data-vibeui-block="auth-011"][data-success="2"] [data-part="success"]::before{animation:vibeui-auth-011-glow 1.1s ease-out .15s forwards}
@keyframes vibeui-auth-011-glow{40%{opacity:1;scale:1.25}100%{opacity:.35;scale:1}}
[data-vibeui-block="auth-011"] [data-part="badge"]{
position:relative;width:6.5rem;height:6.5rem;display:grid;place-items:center;border-radius:50%;
background:var(--vibeui-auth-011-surface);color:var(--vibeui-auth-011-accent);
box-shadow:10px 10px 22px var(--vibeui-auth-011-dark),-8px -8px 18px var(--vibeui-auth-011-light);
scale:.5;opacity:0;
}
[data-vibeui-block="auth-011"]:is([data-success="2"],[data-success="3"]) [data-part="badge"]{animation:vibeui-auth-011-pop .5s cubic-bezier(.34,1.56,.64,1) .2s forwards}
@keyframes vibeui-auth-011-pop{to{scale:1;opacity:1}}
[data-vibeui-block="auth-011"] [data-part="badge"]::after{
content:"";position:absolute;inset:0;border-radius:50%;border:2px solid var(--vibeui-auth-011-accent);opacity:0;
}
[data-vibeui-block="auth-011"][data-success="2"] [data-part="badge"]::after{animation:vibeui-auth-011-ring .8s ease-out .75s}
@keyframes vibeui-auth-011-ring{from{opacity:.9;scale:1}to{opacity:0;scale:1.7}}
[data-vibeui-block="auth-011"] [data-part="badge"] svg{width:2.6rem;height:2.6rem;overflow:visible}
/* Дужка замка поднимается и проворачивается вокруг правой ножки. */
[data-vibeui-block="auth-011"] [data-part="shackle"]{transform-box:fill-box;transform-origin:100% 100%}
[data-vibeui-block="auth-011"][data-success="2"] [data-part="shackle"]{animation:vibeui-auth-011-unlock .5s cubic-bezier(.34,1.56,.64,1) .65s forwards}
@keyframes vibeui-auth-011-unlock{to{transform:translateY(-3px) rotate(-28deg)}}
[data-vibeui-block="auth-011"] [data-part="tick"]{stroke-dasharray:24;stroke-dashoffset:24}
[data-vibeui-block="auth-011"][data-success="2"] [data-part="tick"]{animation:vibeui-auth-011-draw .45s ease-out .65s forwards}
@keyframes vibeui-auth-011-draw{to{stroke-dashoffset:0}}
[data-vibeui-block="auth-011"][data-success="3"] [data-part="success"]{transition:opacity .4s ease,scale .4s ease;opacity:0;scale:1.12}
[data-vibeui-block="auth-011"][data-success="3"] [data-part="badge"]{scale:1;opacity:1}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-011"] *,[data-vibeui-block="auth-011"] *::before,[data-vibeui-block="auth-011"] *::after{animation:none!important;transition:none!important}[data-vibeui-block="auth-011"] [data-part="badge"]{scale:1;opacity:1}[data-vibeui-block="auth-011"] [data-part="tick"]{stroke-dashoffset:0}}
`

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const

const LockIcon = () => (
  <svg {...ICON_PROPS}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
)

const UnlockIcon = () => (
  <svg {...ICON_PROPS}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path data-part="shackle" d="M8 11V7a4 4 0 0 1 8 0v4" />
    <circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none" />
  </svg>
)

const UserCheckIcon = () => (
  <svg {...ICON_PROPS}>
    <circle cx="9.5" cy="8" r="3.5" />
    <path d="M3 20a6.5 6.5 0 0 1 13 0" />
    <path data-part="tick" d="m15.5 11.5 2.5 2.5 4.5-5" />
  </svg>
)

const UserIcon = () => (
  <svg {...ICON_PROPS}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
)

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

const PlusIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
)

const EyeIcon = ({ crossed }: { crossed: boolean }) => (
  <svg {...ICON_PROPS}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {crossed ? <path d="M3 3l18 18" /> : null}
  </svg>
)

type FieldProps = {
  id: string
  label: string
  type: string
  name: string
  autoComplete: string
  revealLabel?: string
  required?: boolean
  minLength?: number
  autoFocus?: boolean
  message?: ReactNode
  onInput?: () => void
}

function Field({
  id,
  label,
  type,
  name,
  autoComplete,
  revealLabel,
  required = true,
  minLength,
  autoFocus,
  message,
  onInput,
}: FieldProps) {
  const invalid = Boolean(message)
  const [shown, setShown] = useState(false)
  // Браузер подставляет сохранённые логин и пароль только в доступные для
  // записи поля при загрузке: пока поле readOnly, форма открывается пустой.
  const [locked, setLocked] = useState(true)

  return (
    <div data-part="field" data-invalid={invalid || undefined}>
      <span data-part="glow" />
      <span data-part="spark" />
      {/* placeholder из пробела нужен для :placeholder-shown — по нему подпись всплывает. */}
      <input
        id={id}
        name={name}
        type={revealLabel && shown ? "text" : type}
        autoComplete={autoComplete}
        placeholder=" "
        required={required}
        minLength={minLength}
        autoFocus={autoFocus}
        readOnly={locked}
        onFocus={() => setLocked(false)}
        onPointerDown={() => setLocked(false)}
        onInput={onInput}
        aria-invalid={invalid || undefined}
      />
      <label htmlFor={id}>{label}</label>
      {message ? (
        <span data-part="message" role="alert">
          {message}
        </span>
      ) : null}
      {revealLabel ? (
        <button
          type="button"
          data-part="reveal"
          aria-label={revealLabel}
          aria-pressed={shown}
          onClick={() => setShown((value) => !value)}
        >
          <EyeIcon crossed={shown} />
        </button>
      ) : null}
    </div>
  )
}

function SubmitButton({
  label,
  successLabel,
  pendingLabel,
  done,
  pending,
}: {
  label: string
  successLabel: string
  pendingLabel: string
  done: boolean
  pending: boolean
}) {
  return (
    <button
      type="submit"
      data-part="submit"
      data-done={done || undefined}
      disabled={pending}
      aria-live="polite"
    >
      {pending ? pendingLabel : done ? successLabel : label}
    </button>
  )
}

/**
 * Вход и регистрация на неоморфной карточке-перевёртыше: поля с бегущей
 * искрой по контуру в фокусе, плавающие подписи, показ пароля.
 */
export function Auth011({
  loginTitle = "С возвращением",
  loginLead = "Войдите, чтобы продолжить работу",
  loginSubmit = "Войти",
  signupTitle = "Новый аккаунт",
  signupLead = "Пара полей — и можно начинать",
  signupSubmit = "Создать аккаунт",
  nameLabel = "Имя",
  emailLabel = "Почта",
  passwordLabel = "Пароль",
  confirmLabel = "Повторите пароль",
  rememberLabel = "Запомнить меня",
  forgot = "Забыли пароль?",
  toSignup = "Нет аккаунта?",
  toLogin = "Уже есть аккаунт?",
  successLabel = "✓ Готово",
  showPasswordLabel = "Показать пароль",
  mismatchLabel = "Пароли не совпадают",
  emailMissingLabel = "Введите почту",
  emailInvalidLabel = "Похоже, в адресе почты опечатка",
  passwordMissingLabel = "Введите пароль",
  passwordShortLabel = "Пароль короче {n} символов",
  pendingLabel = "Секунду…",
  initialSide = "login",
  onSideChange,
  onLogin,
  onSignup,
  loginNotice,
  forgotHref = "#",
  nameRequired = true,
  passwordMinLength,
  onSuccess,
  accent,
  background,
  className,
  style,
}: Auth011Props) {
  const id = useId()
  const [side, setSide] = useState<Side>(initialSide)
  const [done, setDone] = useState<Side | null>(null)
  const [pending, setPending] = useState<Side | null>(null)
  const [success, setSuccess] = useState<1 | 2 | 3 | null>(null)
  const [error, setError] = useState<{
    face: Side
    message: ReactNode
    field?: string
  } | null>(null)
  const fieldMessage = (face: Side, field: string) =>
    error?.face === face && error.field === field ? error.message : undefined
  const clearField = (face: Side, field: string) => () => {
    if (fieldMessage(face, field)) setError(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-auth-011-accent": accent } : null),
    ...(background ? { "--vibeui-auth-011-surface": background } : null),
    ...style,
  } as CSSProperties

  // Без обработчика форма ничего не шлёт, только показывает отклик кнопки.
  async function handleSubmit(event: FormEvent<HTMLFormElement>, face: Side) {
    event.preventDefault()
    if (pending || success) return
    setError(null)

    const element = event.currentTarget
    const form = new FormData(element)
    const text = (name: string) => String(form.get(name) ?? "")
    const fail = (field: string, message: string) => {
      setError({ face, message, field })
      element.querySelector<HTMLInputElement>(`[name="${field}"]`)?.focus()
    }

    const email = text("email").trim()
    const password = text("password")
    const minLength = face === "signup" ? passwordMinLength : undefined

    if (!email) return fail("email", emailMissingLabel)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return fail("email", emailInvalidLabel)
    if (!password) return fail("password", passwordMissingLabel)
    if (minLength && password.length < minLength)
      return fail(
        "password",
        passwordShortLabel.replace("{n}", String(minLength)),
      )
    if (face === "signup" && password !== text("confirm"))
      return fail("confirm", mismatchLabel)

    setPending(face)
    try {
      const message =
        face === "login"
          ? await onLogin?.({
              email,
              password,
              remember: form.has("remember"),
            })
          : await onSignup?.({
              name: text("name").trim(),
              email,
              password,
            })

      if (message) {
        setError({ face, message })
        return
      }
    } finally {
      setPending(null)
    }

    setDone(face)
    // Без движения анимации нет — сразу дальше, не заставляя ждать.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setSuccess(1)
    await wait(still ? 0 : 450)
    setSuccess(2)
    await wait(still ? 300 : 1300)
    setSuccess(3)
    await wait(still ? 0 : 350)

    if (onSuccess) {
      onSuccess(face)
      return
    }

    // Демонстрация: карточка возвращается, чтобы анимацию можно было повторить.
    await wait(900)
    setSuccess(null)
    setDone(null)
  }

  const [flipping, setFlipping] = useState<"prep" | "run" | null>(null)

  // Сначала включаем 3D при старой стороне — картинка не меняется, затем
  // через кадр меняем сторону, и уже тогда transform анимируется.
  function flip() {
    if (flipping) return
    setFlipping("prep")
    const next = side === "login" ? "signup" : "login"
    setError(null)
    onSideChange?.(next)
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => {
        setFlipping("run")
        setSide(next)
        window.setTimeout(() => setFlipping(null), 1000)
      }),
    )
  }

  return (
    <>
      <style href="vibeui-auth-011" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-011"
        data-side={side}
        data-flipping={flipping ?? undefined}
        data-pending={pending ? "" : undefined}
        data-success={success ?? undefined}
        className={className}
        style={palette}
        aria-label={side === "login" ? loginTitle : signupTitle}
      >
        <div data-part="scene">
          <div data-part="card">
            <div data-part="panel" data-face="login" inert={side !== "login"}>
              <div data-part="logo">
                <LockIcon />
              </div>
              <h2>{loginTitle}</h2>
              <p data-part="lead">{loginLead}</p>
              <form
                noValidate
                onSubmit={(event) => handleSubmit(event, "login")}
              >
                <Field
                  id={`${id}-login-email`}
                  message={fieldMessage("login", "email")}
                  onInput={clearField("login", "email")}
                  name="email"
                  type="email"
                  autoComplete="username"
                  label={emailLabel}
                  autoFocus={initialSide === "login"}
                />
                <Field
                  id={`${id}-login-password`}
                  message={fieldMessage("login", "password")}
                  onInput={clearField("login", "password")}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  label={passwordLabel}
                  revealLabel={showPasswordLabel}
                />
                <div data-part="options">
                  <label>
                    <input type="checkbox" name="remember" />
                    {rememberLabel}
                  </label>
                  <a href={forgotHref}>{forgot}</a>
                </div>
                <div data-part="action">
                  {error?.face === "login" && !error.field ? (
                    <p data-part="message" role="alert">
                      {error.message}
                    </p>
                  ) : loginNotice && !error ? (
                    <p data-part="message" role="status">
                      {loginNotice}
                    </p>
                  ) : null}
                  <SubmitButton
                    label={loginSubmit}
                    successLabel={successLabel}
                    pendingLabel={pendingLabel}
                    done={done === "login"}
                    pending={pending === "login"}
                  />
                </div>
              </form>
              <div data-part="switch">
                <span>{toSignup}</span>
                <button
                  type="button"
                  data-part="flip"
                  aria-label={signupTitle}
                  onClick={flip}
                >
                  <PlusIcon />
                </button>
              </div>
            </div>

            <div data-part="panel" data-face="signup" inert={side !== "signup"}>
              <div data-part="logo">
                <UserIcon />
              </div>
              <h2>{signupTitle}</h2>
              <p data-part="lead">{signupLead}</p>
              <form
                noValidate
                onSubmit={(event) => handleSubmit(event, "signup")}
              >
                <Field
                  id={`${id}-signup-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  label={nameLabel}
                  required={nameRequired}
                  autoFocus={initialSide === "signup"}
                />
                <Field
                  id={`${id}-signup-email`}
                  message={fieldMessage("signup", "email")}
                  onInput={clearField("signup", "email")}
                  name="email"
                  type="email"
                  autoComplete="email"
                  label={emailLabel}
                />
                <Field
                  id={`${id}-signup-password`}
                  message={fieldMessage("signup", "password")}
                  onInput={clearField("signup", "password")}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  label={passwordLabel}
                  revealLabel={showPasswordLabel}
                  minLength={passwordMinLength}
                />
                <Field
                  id={`${id}-signup-confirm`}
                  message={fieldMessage("signup", "confirm")}
                  onInput={clearField("signup", "confirm")}
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  label={confirmLabel}
                  minLength={passwordMinLength}
                />
                <div data-part="action">
                  {error?.face === "signup" && !error.field ? (
                    <p data-part="message" role="alert">
                      {error.message}
                    </p>
                  ) : null}
                  <SubmitButton
                    label={signupSubmit}
                    successLabel={successLabel}
                    pendingLabel={pendingLabel}
                    done={done === "signup"}
                    pending={pending === "signup"}
                  />
                </div>
              </form>
              <div data-part="switch">
                <span>{toLogin}</span>
                <button
                  type="button"
                  data-part="flip"
                  aria-label={loginTitle}
                  onClick={flip}
                >
                  <ArrowLeftIcon />
                </button>
              </div>
            </div>
          </div>
          <div data-part="success" aria-hidden="true">
            <span data-part="badge">
              {side === "login" ? <UnlockIcon /> : <UserCheckIcon />}
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
