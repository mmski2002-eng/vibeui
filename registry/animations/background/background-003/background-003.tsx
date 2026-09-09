"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Background003Props = Omit<ComponentProps<"div">, "children"> & {
  /** Ядро потока — самая горячая часть света. */
  core?: string
  /** Свечение вокруг ядра и тело водопада. */
  glow?: string
  /** Дальний холодный край и брызги. */
  deep?: string
  /** Ночь вокруг потока. */
  background?: string
  /** Поверхность карточки, на которую падает свет. */
  card?: string
  /** Сила света: 0.4 — тусклый поток, 1.6 — пересвет. */
  intensity?: number
  /** Густота струй в водопаде. */
  strands?: number
  /** Скорость падения. Ноль останавливает поток. */
  speed?: number
  /** Пятно света за курсором: свет живёт под рукой. */
  spotlight?: boolean
  /** Надзаголовок карточки. */
  eyebrow?: string
  /** Заголовок карточки. */
  title?: string
  /** Абзац под заголовком. */
  text?: string
  /** Подпись автора: имя и роль. */
  author?: string
  role?: string
  /** Фотография автора. Пусто — кружок с инициалом. */
  avatar?: string
  /** Подпись действия на плашке. */
  action?: string
  /** Кадры справа. Пусто — на их месте остаётся тёмная подложка. */
  photos?: Background003Photo[]
  /** Содержимое карточки целиком. Задано — вытесняет текст и кадры. */
  children?: ReactNode
}

export type Background003Photo = {
  src?: string
  alt?: string
  caption?: string
}

const DEFAULTS = {
  core: "#f7f9ff",
  glow: "#7fa0ff",
  deep: "#1b2a6b",
  background: "#090b0d",
  card: "#141518",
}

// Линия кромки карточки: водопад падает ровно на неё. Значение живёт и в
// шейдере, и в CSS, поэтому объявлено один раз.
const LINE = 0.55

const VERTEX = `#version 300 es
void main(){
  vec2 point = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(point * 2.0 - 1.0, 0.0, 1.0);
}`

// Водопад считается в экранных координатах: по вертикали 0 — верх кадра,
// 1 — низ, по горизонтали единица равна высоте кадра, поэтому струи не
// растягиваются на широком экране.
//
// Слои идут в том порядке, в каком свет ведёт себя в жизни: нить сверху,
// расширяющаяся завеса струй, удар о кромку, разлёт вдоль неё, god-rays из
// точки удара и отражение на самой карточке.
const FRAGMENT = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;
uniform float line;
uniform float intensity;
uniform float strands;
uniform vec3 core;
uniform vec3 glow;
uniform vec3 deep;
uniform vec2 pointer;
uniform float pointerOn;

// Целочисленный hash: sin-hash даёт полосы на градиенте, а сцена почти
// целиком из мягких переходов.
float hash(vec2 p){
  uvec2 t = floatBitsToUint(p);
  uint h = 0xc2b2ae3du * t.x + 0x165667b9u;
  h = (h << 17u | h >> 15u) * 0x27d4eb2fu;
  h += 0xc2b2ae3du * t.y;
  h ^= h >> 15u; h *= 0x85ebca77u; h ^= h >> 13u;
  return uintBitsToFloat(h >> 9u | 0x3f800000u) - 1.0;
}

float noise(vec2 p){
  vec2 cell = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(cell);
  float b = hash(cell + vec2(1.0, 0.0));
  float c = hash(cell + vec2(0.0, 1.0));
  float d = hash(cell + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p){
  float sum = 0.0;
  float weight = 0.5;
  for (int i = 0; i < 4; i++){
    sum += weight * noise(p);
    p *= 2.03;
    weight *= 0.5;
  }
  return sum;
}

void main(){
  vec2 uv = gl_FragCoord.xy / resolution;
  float ratio = resolution.x / max(resolution.y, 1.0);
  // y считаем сверху вниз: поток падает, и так его проще описывать.
  float y = 1.0 - uv.y;
  float x = (uv.x - 0.5) * ratio;
  float fall = clamp(y / line, 0.0, 1.4);
  float t = time;

  // Ширина потока: сверху нитка, у кромки — завеса.
  float width = mix(0.005, 0.013, pow(fall, 1.5));
  float spread = 0.010 + 0.24 * pow(clamp(fall, 0.0, 1.0), 3.2);

  // Струи: шум едет вниз вместе с водой и растягивается к низу, поэтому
  // ближе к кромке поток выглядит разогнавшимся.
  float lane = x / max(spread, 0.001);
  float flow = fbm(vec2(lane * (5.0 * strands), y * (3.4 * strands) - t * 1.35));
  float fine = fbm(vec2(lane * (13.0 * strands), y * (7.0 * strands) - t * 2.1));
  float streaks = mix(0.32, 1.5, flow) * mix(0.7, 1.25, fine);

  // Завеса: гауссиана поперёк потока, растущая книзу.
  float curtain = exp(-pow(abs(x) / max(spread, 0.001), 1.9) * 1.7);
  curtain *= smoothstep(0.02, 0.42, fall) * streaks;
  curtain *= smoothstep(1.06, 0.86, fall);

  // Ядро: узкая раскалённая нить от самого верха.
  float beam = exp(-pow(abs(x) / width, 2.0) * 1.35);
  beam *= mix(0.25, 1.0, smoothstep(0.0, 0.55, fall));
  beam *= smoothstep(1.04, 0.9, fall);
  beam *= mix(0.85, 1.15, fbm(vec2(x * 40.0, y * 5.0 - t * 1.8)));

  // Дым: медленные облака в тёмной части кадра. Они не спорят с потоком —
  // их задача убрать «сырой» чёрный фон, на котором луч висит в пустоте.
  float cloud = fbm(vec2(x * 0.85 + t * 0.045, y * 1.25 - t * 0.03));
  cloud = smoothstep(0.44, 0.92, cloud);
  cloud *= smoothstep(-0.05, 0.45, y) * smoothstep(line + 0.08, line - 0.3, y);

  // Молния: редкая и далёкая. Вспышка живёт доли секунды и подсвечивает
  // облако, а не рисует ветку — близкая молния спорила бы с водопадом.
  float strikeId = floor(t * 0.1);
  float strikePhase = fract(t * 0.1);
  float strikeSide = hash(vec2(strikeId, 11.3)) * 1.4 - 0.7;
  float strikeOn = step(hash(vec2(strikeId, 3.7)), 0.4);
  float flicker = exp(-strikePhase * 30.0) * (0.65 + 0.35 * sin(strikePhase * 120.0));
  float bolt = strikeOn * max(flicker, 0.0) * cloud;
  bolt *= exp(-pow((x - strikeSide) / 0.5, 2.0));

  // Дымка вокруг потока: воздух светится сам, иначе струи висят в пустоте
  // вырезанными ножницами.
  float haze = exp(-pow(abs(x) / (spread * 3.0 + 0.045), 1.7));
  haze *= smoothstep(0.0, 0.95, fall) * smoothstep(1.12, 0.9, fall) * 0.3;

  // Удар о кромку: самое горячее место сцены.
  vec2 hitVector = vec2(x, (y - line) * 1.35);
  float hitDistance = length(hitVector);
  float hit = exp(-hitDistance * 30.0) * 1.05 + exp(-hitDistance * 11.0) * 0.32;

  // Разлёт вдоль кромки: свет уходит длинной вспышкой влево и вправо.
  float wash = exp(-abs(y - line) * 44.0) * exp(-abs(x) * 1.15) * 0.7;
  wash += exp(-abs(y - line) * 70.0) * exp(-abs(x) * 0.5) * 0.26;
  wash += exp(-abs(y - line) * 12.0) * exp(-abs(x) * 2.6) * 0.34;

  // God-rays: угловые штрихи из точки удара, только вверх.
  vec2 rayVector = vec2(x, max(line - y, 0.0004));
  float angle = atan(rayVector.x, rayVector.y);
  float rays = fbm(vec2(angle * 26.0, t * 0.12));
  rays = pow(clamp(rays, 0.0, 1.0), 2.6) * 1.9;
  rays *= exp(-hitDistance * 4.2) * smoothstep(line + 0.005, line - 0.06, y);
  rays *= smoothstep(0.9, 0.55, abs(angle));

  // Стекание по карточке: свет не обрывается на кромке. Часть его бежит
  // вдоль края в обе стороны, часть переливается через край и льётся вниз
  // струями — как вода по стеклу.
  float below = smoothstep(line - 0.002, line + 0.004, y);
  float depth = max(y - line, 0.0);
  // Карточка занимает 86% ширины кадра, поэтому свет гаснет у её краёв.
  float edge = smoothstep(0.43 * ratio, 0.3 * ratio, abs(x));
  // Бег вдоль кромки: у краёв карточки он тоньше и тусклее.
  float along = exp(-depth * 30.0) * exp(-abs(x) * 0.5) * 0.9;
  along += exp(-depth * 90.0) * exp(-abs(x) * 0.22) * 0.45;
  // Струи вниз: тот же шум, что и в водопаде, но медленнее — стекающая
  // вода всегда идёт ленивее падающей.
  float trail = fbm(vec2(x * (7.0 * strands), y * (4.0 * strands) - t * 0.5));
  trail = pow(clamp(trail, 0.0, 1.0), 1.5);
  float runs = exp(-depth * 4.6) * trail * exp(-abs(x) * 0.85) * 0.75;
  // Капли: редкие яркие языки, уходящие ниже общего разлива.
  float drops = pow(clamp(fbm(vec2(x * 26.0, y * 2.2 - t * 0.32)), 0.0, 1.0), 5.0);
  runs += exp(-depth * 2.4) * drops * exp(-abs(x) * 1.1) * 1.4;
  float spill = below * edge * (along + runs);

  float stream =
    beam * 0.9 + curtain * 0.86 + haze + hit + wash + rays * 0.5 + cloud * 0.07 + bolt * 0.5;
  // Ниже кромки сам поток гаснет: в карточку он не проваливается.
  stream *= mix(1.0, 0.16, below);

  float energy = (stream + spill) * intensity;

  // Пятно под курсором: мягкая добавка света там, где рука.
  if (pointerOn > 0.5){
    vec2 spot = vec2((pointer.x - 0.5) * ratio, pointer.y);
    float near = length(vec2(x, y) - spot);
    energy += exp(-near * 5.5) * 0.28 * intensity;
  }

  // Цвет: холодная глубина, свечение, белое ядро. Ступени складываются, а не
  // смешиваются, поэтому яркий центр не сереет от дальнего края.
  float level = clamp(energy, 0.0, 3.0);
  vec3 colour = deep * pow(level, 0.8) * 0.85;
  colour += glow * pow(level, 1.35) * 0.9;
  colour += core * pow(level, 3.4) * 0.8;
  // Тонмаппинг Рейнхарда: в свечении остаётся структура струй, а не белое
  // пятно — у донора ядро тоже светится, но не выгорает.
  colour = colour / (1.0 + colour * 0.32);

  // Дизеринг: в тёмной сцене без него на градиентах видны полосы.
  colour += (hash(gl_FragCoord.xy + t) - 0.5) / 255.0;
  colour = max(colour, vec3(0.0));

  float alpha = clamp(max(max(colour.r, colour.g), colour.b), 0.0, 1.0);
  fragColor = vec4(min(colour, vec3(1.0)) * alpha, alpha);
}`

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея компонента: водопад света, падающий на карточку. Поток считает
// видеокарта — CSS отвечает только за сцену вокруг: ночь, карточку и её
// горящую кромку. Слой света лежит поверх карточки в режиме screen, поэтому
// свет действительно ложится на поверхность, а не подсвечивает её снизу.
//
// Сцена всегда ночная, поэтому light-dark() здесь нет: у водопада света в
// темноте нет светлой ветки, как нет её у фотографии ночи.
const STYLES = `
:where([data-vibeui-block="background-003"]){
--vibeui-background-003-core:#f7f9ff;
--vibeui-background-003-glow:#7fa0ff;
--vibeui-background-003-deep:#1b2a6b;
--vibeui-background-003-bg:#090b0d;
--vibeui-background-003-card:#141518;
--vibeui-background-003-intensity:1;
/* Линия кромки карточки: то же значение, что и в шейдере. */
--vibeui-background-003-line:55%;
--vibeui-background-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="background-003"]{
position:relative;box-sizing:border-box;overflow:hidden;isolation:isolate;
width:100%;min-width:min(100%,16rem);min-height:30rem;height:100%;
background:
radial-gradient(120% 70% at 50% 100%,color-mix(in oklab,var(--vibeui-background-003-deep) 45%,transparent) 0,transparent 74%),
var(--vibeui-background-003-bg);
color:#e7ecff;font-family:var(--vibeui-background-003-font);
}
[data-vibeui-block="background-003"] *{box-sizing:border-box}
/* Слой света поверх карточки: в режиме screen он не закрывает содержимое,
   а добавляет к нему яркость — ровно так же ведёт себя настоящий свет. */
[data-vibeui-block="background-003"] canvas{
position:absolute;inset:0;z-index:3;display:block;width:100%;height:100%;
pointer-events:none;mix-blend-mode:screen;
}
/* Пока полотно не ожило — и навсегда там, где нет WebGL 2, — сцену держат
   градиенты: нить потока, воронка у кромки и разлёт вдоль неё. Пустой кадр
   читался бы поломкой. */
[data-vibeui-block="background-003"] [data-part="fallback"]{
position:absolute;inset:0;z-index:3;pointer-events:none;mix-blend-mode:screen;
background:
radial-gradient(0.6% 46% at 50% var(--vibeui-background-003-line),var(--vibeui-background-003-core) 0,transparent 100%),
radial-gradient(22% 34% at 50% var(--vibeui-background-003-line),color-mix(in oklab,var(--vibeui-background-003-glow) 85%,transparent) 0,transparent 72%),
radial-gradient(46% 12% at 50% var(--vibeui-background-003-line),color-mix(in oklab,var(--vibeui-background-003-glow) 55%,transparent) 0,transparent 76%),
radial-gradient(9% 62% at 50% calc(var(--vibeui-background-003-line) - 22%),color-mix(in oklab,var(--vibeui-background-003-deep) 75%,transparent) 0,transparent 78%);
opacity:calc(0.9 * var(--vibeui-background-003-intensity));
}
[data-vibeui-block="background-003"][data-drawn="true"] [data-part="fallback"]{display:none}
/* Сетка и точки: без них ночь читается как незаполненный слой, а не как
   пространство. Мелкий шаг у точек, крупный у линий — так фон держит
   масштаб и не спорит с потоком. */
[data-vibeui-block="background-003"] [data-part="grid"]{
position:absolute;inset:0;z-index:1;pointer-events:none;
background-image:
linear-gradient(90deg,color-mix(in oklab,var(--vibeui-background-003-glow) 16%,transparent) 1px,transparent 1px),
linear-gradient(180deg,color-mix(in oklab,var(--vibeui-background-003-glow) 16%,transparent) 1px,transparent 1px),
radial-gradient(circle,color-mix(in oklab,var(--vibeui-background-003-glow) 24%,transparent) 0.0625rem,transparent 0.0625rem);
background-size:6rem 6rem,6rem 6rem,1.5rem 1.5rem;
/* Гаснет к центру: под самым потоком сетка мешала бы свету. */
mask-image:radial-gradient(60% 55% at 50% var(--vibeui-background-003-line),transparent 0,#000 70%);
opacity:0.42;
}
/* Поле символов: на фоне его не видно вовсе — оно проявляется только под
   лучом курсора, как рисунок под фонариком в доноре. Само поле лежит на
   месте всегда, показывает его маска. */
[data-vibeui-block="background-003"] [data-part="glyphs"]{
position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden;
padding:0.5rem 0.75rem;
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
font-size:0.5625rem;line-height:2.1;letter-spacing:0.34em;
white-space:pre;user-select:none;color:transparent;
}
[data-vibeui-block="background-003"] [data-part="glyphs"][data-role="beam"]{
color:color-mix(in oklab,var(--vibeui-background-003-core) 55%,transparent);
opacity:0;transition:opacity 0.35s ease;
mask-image:radial-gradient(9rem 9rem at var(--vibeui-background-003-x) var(--vibeui-background-003-y),#000 0,rgba(0,0,0,0.45) 55%,transparent 100%);
}
[data-vibeui-block="background-003"][data-pointer="true"] [data-part="glyphs"][data-role="beam"]{opacity:1}
/* Карточка: она не декорация, а то, на что падает свет. Верх скруглён и
   срезан кромкой, низ уходит за кадр — сцена продолжается за экраном. */
[data-vibeui-block="background-003"] [data-part="card"]{
position:absolute;left:7%;right:7%;top:var(--vibeui-background-003-line);bottom:-6%;
z-index:2;border-radius:0.875rem 0.875rem 0 0;overflow:hidden;
background:linear-gradient(180deg,
color-mix(in oklab,var(--vibeui-background-003-card) 84%,#ffffff 5%) 0,
var(--vibeui-background-003-card) 44%,
color-mix(in oklab,var(--vibeui-background-003-card) 88%,#000000) 100%);
box-shadow:0 -0.0625rem 0 0 rgb(255 255 255 / 7%),0 -1.5rem 3rem -1rem rgb(0 0 0 / 55%);
}
/* Горящая кромка: белая нить по верхнему краю, ярче всего под потоком. */
[data-vibeui-block="background-003"] [data-part="rim"]{
position:absolute;left:0;right:0;top:0;height:0.0625rem;pointer-events:none;
background:linear-gradient(90deg,
transparent 0,
color-mix(in oklab,var(--vibeui-background-003-glow) 60%,transparent) 20%,
var(--vibeui-background-003-core) 45%,
var(--vibeui-background-003-core) 55%,
color-mix(in oklab,var(--vibeui-background-003-glow) 60%,transparent) 80%,
transparent 100%);
opacity:calc(0.9 * var(--vibeui-background-003-intensity));
}
/* Содержимое карточки: текст слева, кадры справа. Карточка стоит под
   потоком, поэтому текст держится левее центра — там, где света меньше. */
[data-vibeui-block="background-003"] [data-part="pane"]{
position:absolute;inset:0;display:grid;gap:1.25rem;
grid-template-columns:minmax(0,1fr);padding:1.125rem 1.25rem;
}
[data-vibeui-block="background-003"] [data-part="copy"]{
display:flex;flex-direction:column;gap:0.5rem;min-width:0;
}
[data-vibeui-block="background-003"] [data-part="eyebrow"]{
font-size:0.6875rem;font-weight:650;letter-spacing:0.1em;text-transform:uppercase;
color:color-mix(in oklab,var(--vibeui-background-003-glow) 75%,#ffffff);
}
[data-vibeui-block="background-003"] h3{
margin:0;font-size:clamp(1.0625rem,2.4cqi,1.5rem);font-weight:660;
line-height:1.2;letter-spacing:-0.01em;color:#f2f5ff;
}
[data-vibeui-block="background-003"] [data-part="text"]{
margin:0;font-size:0.8125rem;line-height:1.55;max-width:44ch;
color:rgb(226 233 255 / 62%);
}
/* Подпись идёт сразу за абзацем, а не прижата к низу: низ карточки уходит
   за кадр, и прижатая подпись оказывалась бы срезанной. */
[data-vibeui-block="background-003"] [data-part="byline"]{
margin-top:0.375rem;display:flex;align-items:center;gap:0.625rem;min-width:0;
}
[data-vibeui-block="background-003"] [data-part="avatar"]{
flex:none;display:grid;place-items:center;overflow:hidden;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:rgb(255 255 255 / 10%);border:1px solid rgb(255 255 255 / 14%);
font-size:0.6875rem;font-weight:650;color:#e8edff;
}
[data-vibeui-block="background-003"] [data-part="avatar"] img{
width:100%;height:100%;object-fit:cover;display:block;
}
[data-vibeui-block="background-003"] [data-part="who"]{
display:flex;flex-direction:column;gap:0.0625rem;min-width:0;
font-size:0.75rem;line-height:1.25;
}
[data-vibeui-block="background-003"] [data-part="role"]{color:rgb(226 233 255 / 52%);font-size:0.6875rem}
[data-vibeui-block="background-003"] [data-part="cta"]{
margin-left:auto;flex:none;display:inline-flex;align-items:center;
height:1.875rem;padding:0 0.875rem;border-radius:9999px;
background:rgb(255 255 255 / 10%);border:1px solid rgb(255 255 255 / 16%);
font-size:0.75rem;font-weight:620;color:#eef2ff;
}
/* Кадры: свет ложится и на них, поэтому они приглушены — иначе фотография
   спорит с потоком за внимание. */
[data-vibeui-block="background-003"] [data-part="gallery"]{
display:grid;gap:0.625rem;grid-template-columns:repeat(2,minmax(0,1fr));min-width:0;
}
[data-vibeui-block="background-003"] [data-part="shot"]{
position:relative;overflow:hidden;border-radius:0.625rem;min-height:5rem;
background:rgb(255 255 255 / 4%);border:1px solid rgb(255 255 255 / 8%);
}
[data-vibeui-block="background-003"] [data-part="shot"] img{
width:100%;height:100%;object-fit:cover;display:block;
filter:saturate(0.85) brightness(0.72);
}
[data-vibeui-block="background-003"] [data-part="caption"]{
position:absolute;left:0.5rem;right:0.5rem;bottom:0.4375rem;
font-size:0.625rem;line-height:1.3;color:rgb(240 244 255 / 82%);
text-shadow:0 1px 2px rgb(0 0 0 / 65%);
}
@container (min-width: 44rem){
[data-vibeui-block="background-003"] [data-part="pane"]{
grid-template-columns:minmax(0,1.05fr) minmax(0,0.95fr);padding:1.5rem 1.75rem;
}
[data-vibeui-block="background-003"] [data-part="shot"]{min-height:7.5rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="background-003"] *{animation:none!important;transition:none!important}
}
`

// Символы фона: набор нарочно технический — цифры, скобки, стрелки. Поле
// строится один раз и детерминированно: случайные символы на сервере и на
// клиенте разошлись бы и уронили гидратацию.
const GLYPH_ALPHABET = "01<>{}[]()/|+-*=#%&@:;.·→←↑↓"

function buildGlyphs(rows: number, columns: number) {
  let seed = 7
  let field = ""

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      seed = (seed * 1103515245 + 12345) % 2147483648
      field +=
        seed % 7 === 0 ? " " : GLYPH_ALPHABET[seed % GLYPH_ALPHABET.length]
    }

    field += "\n"
  }

  return field
}

const GLYPHS = buildGlyphs(40, 220)

/** #rrggbb → три числа 0…1 для шейдера. */
function toRgb(value: string, fallback: string) {
  const hex =
    /^#?([0-9a-f]{6})$/i.exec(value.trim()) ??
    /^#?([0-9a-f]{6})$/i.exec(fallback)

  if (!hex) return [1, 1, 1]

  const number = Number.parseInt(hex[1], 16)

  return [
    ((number >> 16) & 255) / 255,
    ((number >> 8) & 255) / 255,
    (number & 255) / 255,
  ]
}

function compile(gl: WebGL2RenderingContext, kind: number, source: string) {
  const shader = gl.createShader(kind)

  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)

    return null
  }

  return shader
}

/** Карточка под потоком: текст слева, кадры справа. */
function CardContent({
  eyebrow,
  title,
  text,
  author,
  role,
  avatar,
  action,
  photos,
}: {
  eyebrow: string
  title: string
  text: string
  author: string
  role: string
  avatar: string
  action: string
  photos: Background003Photo[]
}) {
  return (
    <div data-part="pane">
      <div data-part="copy">
        <span data-part="eyebrow">{eyebrow}</span>
        <h3>{title}</h3>
        <p data-part="text">{text}</p>
        <div data-part="byline">
          <span data-part="avatar">
            {avatar ? (
              <img src={avatar} alt="" loading="lazy" decoding="async" />
            ) : (
              author.slice(0, 1)
            )}
          </span>
          <span data-part="who">
            <span>{author}</span>
            <span data-part="role">{role}</span>
          </span>
          {action ? <span data-part="cta">{action}</span> : null}
        </div>
      </div>
      <div data-part="gallery">
        {photos.map((photo, index) => (
          <span data-part="shot" key={photo.src ?? index}>
            {photo.src ? (
              <img
                src={photo.src}
                alt={photo.alt ?? ""}
                loading="lazy"
                decoding="async"
              />
            ) : null}
            {photo.caption ? (
              <span data-part="caption">{photo.caption}</span>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Водопад света, падающий на карточку: поток идёт сверху, разгоняется,
 * бьёт в верхнюю кромку окна и растекается по ней. Считает видеокарта,
 * зависимостей и ассетов нет.
 */
export function Background003({
  core = DEFAULTS.core,
  glow = DEFAULTS.glow,
  deep = DEFAULTS.deep,
  background = DEFAULTS.background,
  card = DEFAULTS.card,
  intensity = 1,
  strands = 1,
  speed = 1,
  spotlight = true,
  eyebrow = "Ночная сборка",
  title = "Свет собирается там, где идёт работа",
  text = "Поток падает на карточку, растекается по кромке и стекает вниз — сцена живёт сама, пока страница открыта.",
  author = "Аня Соколова",
  role = "Инженер платформы",
  avatar = "",
  action = "Смотреть",
  photos = [],
  children,
  className,
  style,
  ...props
}: Background003Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Настройки читаются на каждом кадре, поэтому живут в ref: пересобирать
  // сцену ради смены цвета незачем.
  const settings = useRef({
    core,
    glow,
    deep,
    intensity,
    strands,
    speed,
    spotlight,
  })
  const pointer = useRef({ x: 0.5, y: 0.4, on: false })

  useEffect(() => {
    settings.current = { core, glow, deep, intensity, strands, speed, spotlight }
  })

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current

    if (!host || !canvas) return

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    })

    if (!gl) return

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    const program = vertex && fragment ? gl.createProgram() : null

    if (!vertex || !fragment || !program) return

    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return

    gl.useProgram(program)

    const uniforms = {
      resolution: gl.getUniformLocation(program, "resolution"),
      time: gl.getUniformLocation(program, "time"),
      line: gl.getUniformLocation(program, "line"),
      intensity: gl.getUniformLocation(program, "intensity"),
      strands: gl.getUniformLocation(program, "strands"),
      core: gl.getUniformLocation(program, "core"),
      glow: gl.getUniformLocation(program, "glow"),
      deep: gl.getUniformLocation(program, "deep"),
      pointer: gl.getUniformLocation(program, "pointer"),
      pointerOn: gl.getUniformLocation(program, "pointerOn"),
    }

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)")

    let frame = 0
    let previous = 0
    let elapsed = 0
    let visible = true
    let width = 0
    let height = 0

    const resize = () => {
      // Плотность пикселей выше двух глазу не видна, а кадры стоит.
      const ratio = Math.min(2, window.devicePixelRatio || 1)
      const nextWidth = Math.round(host.clientWidth * ratio)
      const nextHeight = Math.round(host.clientHeight * ratio)

      if (nextWidth === width && nextHeight === height) return

      width = nextWidth
      height = nextHeight
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
    }

    const draw = (now: number) => {
      const current = settings.current

      frame = 0

      if (document.hidden || !visible) return

      if (previous && !calm.matches) {
        elapsed += (now - previous) * 0.001 * Math.max(current.speed, 0)
      }

      previous = now

      resize()

      if (width === 0 || height === 0) {
        frame = requestAnimationFrame(draw)

        return
      }

      gl.uniform2f(uniforms.resolution, width, height)
      gl.uniform1f(uniforms.time, elapsed)
      gl.uniform1f(uniforms.line, LINE)
      gl.uniform1f(uniforms.intensity, Math.max(current.intensity, 0))
      gl.uniform1f(uniforms.strands, Math.max(current.strands, 0.2))
      gl.uniform3fv(uniforms.core, toRgb(current.core, DEFAULTS.core))
      gl.uniform3fv(uniforms.glow, toRgb(current.glow, DEFAULTS.glow))
      gl.uniform3fv(uniforms.deep, toRgb(current.deep, DEFAULTS.deep))
      gl.uniform2f(uniforms.pointer, pointer.current.x, pointer.current.y)
      gl.uniform1f(
        uniforms.pointerOn,
        current.spotlight && pointer.current.on ? 1 : 0,
      )

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      host.dataset.drawn = "true"

      // Покой означает один кадр: поток замирает, картинка остаётся.
      if (calm.matches) {
        frame = 0

        return
      }

      frame = requestAnimationFrame(draw)
    }

    const run = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const stop = () => {
      previous = 0
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    const move = (event: PointerEvent) => {
      const box = host.getBoundingClientRect()

      if (box.width === 0 || box.height === 0) return

      pointer.current = {
        x: (event.clientX - box.left) / box.width,
        y: (event.clientY - box.top) / box.height,
        on: true,
      }

      // Те же координаты уходят в CSS: под курсором проявляется поле символов.
      host.style.setProperty(
        "--vibeui-background-003-x",
        `${pointer.current.x * 100}%`,
      )
      host.style.setProperty(
        "--vibeui-background-003-y",
        `${pointer.current.y * 100}%`,
      )
      host.dataset.pointer = "true"

      // В покое кадры не крутятся, но за рукой свет всё равно идёт.
      if (calm.matches) run()
    }

    const leave = () => {
      pointer.current = { ...pointer.current, on: false }
      host.dataset.pointer = "false"

      if (calm.matches) run()
    }

    // Фон за пределами экрана и во вкладке в фоне не рисуется: он там никому
    // не виден, а батарею тратит.
    const watcher = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting)

      if (visible) run()
      else stop()
    })

    watcher.observe(host)

    const onVisibility = () => {
      if (document.hidden) stop()
      else if (visible) run()
    }

    const sizes = new ResizeObserver(() => {
      if (!frame) run()
    })

    sizes.observe(host)
    document.addEventListener("visibilitychange", onVisibility)
    calm.addEventListener("change", run)
    host.addEventListener("pointermove", move)
    host.addEventListener("pointerleave", leave)
    run()

    return () => {
      stop()
      watcher.disconnect()
      sizes.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      calm.removeEventListener("change", run)
      host.removeEventListener("pointermove", move)
      host.removeEventListener("pointerleave", leave)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [])

  const palette = {
    "--vibeui-background-003-core": core,
    "--vibeui-background-003-glow": glow,
    "--vibeui-background-003-deep": deep,
    "--vibeui-background-003-bg": background,
    "--vibeui-background-003-card": card,
    "--vibeui-background-003-intensity": intensity,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-background-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={hostRef}
        data-slot="background"
        data-vibeui-block="background-003"
        className={className}
        style={palette}
      >
        <div data-part="grid" />
        <div data-part="glyphs" data-role="beam" aria-hidden="true">
          {GLYPHS}
        </div>

        <div data-part="card">
          {children ?? (
            <CardContent
              eyebrow={eyebrow}
              title={title}
              text={text}
              author={author}
              role={role}
              avatar={avatar}
              action={action}
              photos={photos}
            />
          )}
          <span data-part="rim" />
        </div>
        <div data-part="fallback" />
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
    </>
  )
}
