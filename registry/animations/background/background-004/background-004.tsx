"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Background004Action = {
  label: string
  keys?: string
  group?: string
}

export type Background004Props = Omit<ComponentProps<"div">, "children"> & {
  /** Раскалённая сердцевина луча. */
  core?: string
  /** Тёплое тело света: янтарь. */
  glow?: string
  /** Дальний край луча и угли по краям кадра. */
  deep?: string
  /** Ночь вокруг света. */
  background?: string
  /** Поверхность палитры и клавиш. */
  panel?: string
  /** Сила света: 0.4 — сумерки, 1.6 — пересвет. */
  intensity?: number
  /** Пыль в луче: 0 убирает пылинки, 2 делает воздух густым. */
  dust?: number
  /** Скорость дыхания света. Ноль останавливает движение. */
  speed?: number
  /** Тёплое пятно за курсором. */
  spotlight?: boolean
  /** Подпись поля палитры. */
  placeholder?: string
  /** Заголовок группы над списком действий. */
  groupLabel?: string
  /** Строки палитры: действие и его горячая клавиша. */
  actions?: Background004Action[]
  /** Ряды клавиатуры под палитрой. */
  rows?: string[][]
  /** Содержимое сцены целиком. Задано — вытесняет палитру и клавиатуру. */
  children?: ReactNode
}

const DEFAULTS = {
  core: "#fff3d6",
  glow: "#ffab3d",
  deep: "#7a2f06",
  background: "#0a0908",
  panel: "#17150f",
}

// Линия палитры: свет упирается в её верхнюю кромку. Значение живёт и в
// шейдере, и в CSS, поэтому объявлено один раз.
const LINE = 0.46

const VERTEX = `#version 300 es
void main(){
  vec2 point = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(point * 2.0 - 1.0, 0.0, 1.0);
}`

// Тёплый луч считается в экранных координатах: по вертикали 0 — верх кадра,
// 1 — низ, по горизонтали единица равна высоте кадра, поэтому конус не
// растягивается на широком экране.
//
// Это не водопад: свет здесь не падает струями, а стоит косым столбом, в
// котором висит пыль. Отсюда и слои — конус с мягкими краями, дрожание
// воздуха, пылинки, накал на кромке палитры и тёплый разлив по ней.
const FRAGMENT = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;
uniform float line;
uniform float intensity;
uniform float dust;
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
  float y = 1.0 - uv.y;
  float x = (uv.x - 0.5) * ratio;
  float t = time;

  // Конус: источник висит над кадром, поэтому у верхней кромки луч уже
  // широкий, а не сходится в точку.
  float span = 0.075 + 0.46 * clamp(y / line, 0.0, 1.35);
  float across = abs(x) / max(span, 0.001);
  // Мягкий край: степень 2.6 держит середину плотной, а край — рыхлым.
  float cone = exp(-pow(across, 2.6) * 1.25);
  cone *= smoothstep(-0.06, 0.3, y);

  // Дрожание воздуха: медленный шум вдоль луча, из-за него столб дышит и
  // не выглядит вырезанным из бумаги.
  float shiver = fbm(vec2(x * 2.6, y * 2.2 - t * 0.22));
  cone *= mix(0.72, 1.2, shiver);

  // Пыль: редкие яркие точки, всплывающие в луче. Порог по шуму даёт
  // пылинки, а не сетку.
  float speck = fbm(vec2(x * 34.0, y * 34.0 - t * 0.55));
  float motes = pow(clamp(speck, 0.0, 1.0), 9.0) * 7.5 * dust;
  motes *= cone * smoothstep(0.05, 0.45, y);

  // Накал на кромке палитры: свет упирается в неё и разливается вширь.
  float rim = exp(-abs(y - line) * 52.0) * exp(-pow(abs(x) / 0.62, 1.6)) * 1.15;
  rim += exp(-abs(y - line) * 16.0) * exp(-pow(abs(x) / 0.9, 1.7)) * 0.4;

  // Косые лучи из щели: тонкие полосы вдоль конуса. Их немного, иначе
  // сцена превращается в веер.
  float shafts = fbm(vec2(x * 9.0 / max(span, 0.05), t * 0.08));
  shafts = pow(clamp(shafts, 0.0, 1.0), 3.2) * 1.6 * cone;

  // Ниже кромки свет ложится на палитру и клавиши: тёплое пятно, гаснущее
  // ко дну кадра.
  float below = smoothstep(line - 0.002, line + 0.006, y);
  float depth = max(y - line, 0.0);
  float spill = below * exp(-depth * 3.4) * exp(-pow(abs(x) / 0.78, 1.8)) * 0.48;
  spill += below * exp(-depth * 12.0) * exp(-pow(abs(x) / 0.55, 1.6)) * 0.34;

  float beam = cone * 0.62 + shafts * 0.3 + motes * 0.5 + rim;
  // Сам столб в палитру не проваливается: ниже кромки остаётся разлив.
  beam *= mix(1.0, 0.18, below);

  float energy = (beam + spill) * intensity;

  if (pointerOn > 0.5){
    vec2 spot = vec2((pointer.x - 0.5) * ratio, pointer.y);
    energy += exp(-length(vec2(x, y) - spot) * 5.0) * 0.26 * intensity;
  }

  // Цвет: угли по краям, янтарь в теле, белое золото в сердцевине.
  float level = clamp(energy, 0.0, 3.0);
  vec3 colour = deep * pow(level, 0.75) * 0.9;
  colour += glow * pow(level, 1.45) * 0.95;
  colour += core * pow(level, 3.4) * 0.8;
  // Тонмаппинг Рейнхарда: тёплый свет выгорает в белое быстрее холодного,
  // и без сжатия сердцевина теряет цвет.
  colour = colour / (1.0 + colour * 0.42);

  colour += (hash(gl_FragCoord.xy + t) - 0.5) / 255.0;
  colour = max(colour, vec3(0.0));

  float alpha = clamp(max(max(colour.r, colour.g), colour.b), 0.0, 1.0);
  fragColor = vec4(min(colour, vec3(1.0)) * alpha, alpha);
}`

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея компонента: тёплый луч, стоящий над палитрой команд. Свет считает
// видеокарта, DOM держит саму сцену: палитру со списком действий и ряды
// клавиш под ней. Полотно лежит поверх них в режиме screen, поэтому свет
// действительно ложится на поверхности, а не подсвечивает их снизу.
//
// Сцена всегда ночная, поэтому light-dark() здесь нет: у тёплого луча в
// темноте нет светлой ветки, как нет её у фотографии ночи.
const STYLES = `
:where([data-vibeui-block="background-004"]){
--vibeui-background-004-core:#fff3d6;
--vibeui-background-004-glow:#ffab3d;
--vibeui-background-004-deep:#7a2f06;
--vibeui-background-004-bg:#0a0908;
--vibeui-background-004-panel:#17150f;
--vibeui-background-004-intensity:1;
--vibeui-background-004-x:50%;
--vibeui-background-004-y:35%;
/* Линия палитры: то же значение, что и в шейдере. */
--vibeui-background-004-line:46%;
--vibeui-background-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-background-004-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
[data-vibeui-block="background-004"]{
position:relative;box-sizing:border-box;overflow:hidden;isolation:isolate;
width:100%;min-width:min(100%,16rem);min-height:30rem;height:100%;
background:
radial-gradient(120% 80% at 50% 0,color-mix(in oklab,var(--vibeui-background-004-deep) 30%,transparent) 0,transparent 70%),
var(--vibeui-background-004-bg);
color:#f5ece0;font-family:var(--vibeui-background-004-font);
}
[data-vibeui-block="background-004"] *{box-sizing:border-box}
[data-vibeui-block="background-004"] canvas{
position:absolute;inset:0;z-index:3;display:block;width:100%;height:100%;
pointer-events:none;mix-blend-mode:screen;
}
/* Пока полотно не ожило — и навсегда там, где нет WebGL 2, — сцену держат
   градиенты того же рисунка: конус, накал на кромке и разлив по палитре. */
[data-vibeui-block="background-004"] [data-part="fallback"]{
position:absolute;inset:0;z-index:3;pointer-events:none;mix-blend-mode:screen;
background:
radial-gradient(34% 52% at 50% var(--vibeui-background-004-line),color-mix(in oklab,var(--vibeui-background-004-glow) 70%,transparent) 0,transparent 74%),
radial-gradient(52% 10% at 50% var(--vibeui-background-004-line),var(--vibeui-background-004-core) 0,transparent 78%),
radial-gradient(60% 30% at 50% calc(var(--vibeui-background-004-line) + 18%),color-mix(in oklab,var(--vibeui-background-004-glow) 32%,transparent) 0,transparent 76%),
radial-gradient(18% 46% at 50% calc(var(--vibeui-background-004-line) - 26%),color-mix(in oklab,var(--vibeui-background-004-deep) 80%,transparent) 0,transparent 80%);
opacity:calc(0.9 * var(--vibeui-background-004-intensity));
}
[data-vibeui-block="background-004"][data-drawn="true"] [data-part="fallback"]{display:none}
/* Сетка и точки: без них ночь читается как незаполненный слой, а не как
   комната, в которой стоит стол с клавиатурой. */
[data-vibeui-block="background-004"] [data-part="grid"]{
position:absolute;inset:0;z-index:1;pointer-events:none;
background-image:
linear-gradient(90deg,color-mix(in oklab,var(--vibeui-background-004-glow) 14%,transparent) 1px,transparent 1px),
linear-gradient(180deg,color-mix(in oklab,var(--vibeui-background-004-glow) 14%,transparent) 1px,transparent 1px),
radial-gradient(circle,color-mix(in oklab,var(--vibeui-background-004-glow) 22%,transparent) 0.0625rem,transparent 0.0625rem);
background-size:6rem 6rem,6rem 6rem,1.5rem 1.5rem;
/* Гаснет к лучу: под самым светом сетка мешала бы. */
mask-image:radial-gradient(52% 60% at 50% var(--vibeui-background-004-line),transparent 0,#000 72%);
opacity:0.4;
}
/* Поле символов: команды, которых ещё не набрали. На фоне их не видно —
   они проявляются только под лучом курсора, как рисунок под фонариком. */
[data-vibeui-block="background-004"] [data-part="glyphs"]{
position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden;
padding:0.5rem 0.75rem;
font-family:var(--vibeui-background-004-mono);
font-size:0.5625rem;line-height:2.1;letter-spacing:0.34em;
white-space:pre;user-select:none;color:transparent;
}
[data-vibeui-block="background-004"] [data-part="glyphs"][data-role="beam"]{
color:color-mix(in oklab,var(--vibeui-background-004-core) 45%,transparent);
opacity:0;transition:opacity 0.35s ease;
mask-image:radial-gradient(9rem 9rem at var(--vibeui-background-004-x) var(--vibeui-background-004-y),#000 0,rgba(0,0,0,0.45) 55%,transparent 100%);
}
[data-vibeui-block="background-004"][data-pointer="true"] [data-part="glyphs"][data-role="beam"]{opacity:1}
/* Сцена: палитра стоит ровно на линии света, клавиатура уходит за нижний
   край кадра — сцена продолжается за экраном. */
[data-vibeui-block="background-004"] [data-part="stage"]{
position:absolute;left:0;right:0;top:var(--vibeui-background-004-line);bottom:0;
z-index:2;display:flex;flex-direction:column;align-items:center;gap:1.25rem;
padding:0 1.25rem;
}
[data-vibeui-block="background-004"] [data-part="palette"]{
flex:none;width:min(100%,26rem);border-radius:0.875rem;overflow:hidden;
background:color-mix(in oklab,var(--vibeui-background-004-panel) 86%,#000000);
border:1px solid rgb(255 214 150 / 16%);
box-shadow:0 1.25rem 2.5rem -1rem rgb(0 0 0 / 70%),0 0 0 1px rgb(0 0 0 / 40%);
}
/* Верхняя кромка палитры горит: именно в неё упирается луч. */
[data-vibeui-block="background-004"] [data-part="edge"]{
height:0.0625rem;
background:linear-gradient(90deg,
transparent 0,
color-mix(in oklab,var(--vibeui-background-004-glow) 60%,transparent) 18%,
var(--vibeui-background-004-core) 46%,
var(--vibeui-background-004-core) 54%,
color-mix(in oklab,var(--vibeui-background-004-glow) 60%,transparent) 82%,
transparent 100%);
opacity:calc(0.95 * var(--vibeui-background-004-intensity));
}
[data-vibeui-block="background-004"] [data-part="field"]{
display:flex;align-items:center;gap:0.5rem;padding:0.6875rem 0.875rem;
border-bottom:1px solid rgb(255 214 150 / 10%);
font-size:0.8125rem;color:rgb(245 236 224 / 62%);
}
[data-vibeui-block="background-004"] [data-part="glass"]{
flex:none;width:0.875rem;height:0.875rem;border-radius:9999px;
border:1.5px solid rgb(245 236 224 / 45%);
}
[data-vibeui-block="background-004"] [data-part="group"]{
padding:0.5rem 0.875rem 0.25rem;
font-size:0.625rem;font-weight:650;letter-spacing:0.09em;text-transform:uppercase;
color:rgb(245 236 224 / 42%);
}
[data-vibeui-block="background-004"] ul{margin:0;padding:0 0 0.5rem;list-style:none}
[data-vibeui-block="background-004"] li{
display:flex;align-items:center;gap:0.75rem;
padding:0.4375rem 0.875rem;font-size:0.8125rem;
}
/* Первая строка подсвечена: палитра всегда открывается с выбранным
   действием, иначе непонятно, что нажатие Enter что-то сделает. */
[data-vibeui-block="background-004"] li[data-active="true"]{
background:linear-gradient(90deg,
color-mix(in oklab,var(--vibeui-background-004-glow) 22%,transparent),
transparent 70%);
}
[data-vibeui-block="background-004"] [data-part="label"]{flex:1;min-width:0;color:#f3e9dc}
[data-vibeui-block="background-004"] kbd{
flex:none;min-width:1.25rem;padding:0.0625rem 0.3125rem;border-radius:0.25rem;
background:rgb(255 255 255 / 7%);border:1px solid rgb(255 214 150 / 14%);
font-family:var(--vibeui-background-004-mono);font-size:0.6875rem;
color:rgb(245 236 224 / 72%);text-align:center;
}
/* Клавиатура: ряды клавиш под палитрой. Верхние грани ловят свет, поэтому
   у каждой клавиши светлая кромка сверху. */
[data-vibeui-block="background-004"] [data-part="keyboard"]{
flex:none;width:min(100%,34rem);display:grid;gap:0.3125rem;
}
[data-vibeui-block="background-004"] [data-part="row"]{
display:flex;gap:0.3125rem;justify-content:center;
}
[data-vibeui-block="background-004"] [data-part="key"]{
flex:1 1 0;min-width:0;height:2rem;border-radius:0.375rem;
display:grid;place-items:center;
background:linear-gradient(180deg,
color-mix(in oklab,var(--vibeui-background-004-panel) 70%,#ffffff 6%),
color-mix(in oklab,var(--vibeui-background-004-panel) 92%,#000000));
border:1px solid rgb(255 214 150 / 10%);
box-shadow:inset 0 1px 0 rgb(255 226 178 / 14%);
font-size:0.6875rem;color:rgb(245 236 224 / 55%);
font-family:var(--vibeui-background-004-mono);
}
@container (min-width: 40rem){
[data-vibeui-block="background-004"] [data-part="stage"]{gap:1.5rem}
[data-vibeui-block="background-004"] [data-part="key"]{height:2.375rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="background-004"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_ACTIONS: Background004Action[] = [
  { label: "Отметить задачу выполненной", keys: "V" },
  { label: "Открыть список дел", keys: "B" },
  { label: "Перейти к таймлайну", keys: "M" },
]

const DEFAULT_ROWS = [
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", ",", "."],
]

// Символы фона: обрывки команд и клавиш. Поле строится один раз и
// детерминированно: случайные символы на сервере и на клиенте разошлись бы
// и уронили гидратацию.
const GLYPH_ALPHABET = "01<>{}[]()/|+-*=#%&@:;.·⌘⌥⇧⏎→←↑↓"

function buildGlyphs(rows: number, columns: number) {
  let seed = 19
  let field = ""

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      seed = (seed * 1103515245 + 12345) % 2147483648
      field +=
        seed % 6 === 0 ? " " : GLYPH_ALPHABET[seed % GLYPH_ALPHABET.length]
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

/** Палитра команд и клавиатура под лучом. */
function CommandScene({
  placeholder,
  groupLabel,
  actions,
  rows,
}: {
  placeholder: string
  groupLabel: string
  actions: Background004Action[]
  rows: string[][]
}) {
  return (
    <>
      <div data-part="palette">
        <span data-part="edge" />
        <div data-part="field">
          <span data-part="glass" aria-hidden="true" />
          <span>{placeholder}</span>
        </div>
        <div data-part="group">{groupLabel}</div>
        <ul>
          {actions.map((action, index) => (
            <li key={action.label} data-active={index === 0 ? "true" : undefined}>
              <span data-part="label">{action.label}</span>
              {action.keys ? <kbd>{action.keys}</kbd> : null}
            </li>
          ))}
        </ul>
      </div>
      <div data-part="keyboard" aria-hidden="true">
        {rows.map((row, index) => (
          <div data-part="row" key={index}>
            {row.map((key, position) => (
              <span data-part="key" key={`${key}-${position}`}>
                {key}
              </span>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

/**
 * Тёплый луч над палитрой команд: столб света стоит в пыльном воздухе,
 * упирается в кромку палитры и разливается по клавишам. Считает видеокарта,
 * зависимостей и ассетов нет.
 */
export function Background004({
  core = DEFAULTS.core,
  glow = DEFAULTS.glow,
  deep = DEFAULTS.deep,
  background = DEFAULTS.background,
  panel = DEFAULTS.panel,
  intensity = 1,
  dust = 1,
  speed = 1,
  spotlight = true,
  placeholder = "Выполнить команду…",
  groupLabel = "Действия",
  actions = DEFAULT_ACTIONS,
  rows = DEFAULT_ROWS,
  children,
  className,
  style,
  ...props
}: Background004Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Настройки читаются на каждом кадре, поэтому живут в ref: пересобирать
  // сцену ради смены цвета незачем.
  const settings = useRef({ core, glow, deep, intensity, dust, speed, spotlight })
  const pointer = useRef({ x: 0.5, y: 0.3, on: false })

  useEffect(() => {
    settings.current = { core, glow, deep, intensity, dust, speed, spotlight }
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
      dust: gl.getUniformLocation(program, "dust"),
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
      gl.uniform1f(uniforms.dust, Math.max(current.dust, 0))
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

      // Покой означает один кадр: свет остаётся, движение прекращается.
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
        "--vibeui-background-004-x",
        `${pointer.current.x * 100}%`,
      )
      host.style.setProperty(
        "--vibeui-background-004-y",
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
    "--vibeui-background-004-core": core,
    "--vibeui-background-004-glow": glow,
    "--vibeui-background-004-deep": deep,
    "--vibeui-background-004-bg": background,
    "--vibeui-background-004-panel": panel,
    "--vibeui-background-004-intensity": intensity,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-background-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={hostRef}
        data-slot="background"
        data-vibeui-block="background-004"
        className={className}
        style={palette}
      >
        <div data-part="grid" />
        <div data-part="glyphs" data-role="beam" aria-hidden="true">
          {GLYPHS}
        </div>

        <div data-part="stage">
          {children ?? (
            <CommandScene
              placeholder={placeholder}
              groupLabel={groupLabel}
              actions={actions}
              rows={rows}
            />
          )}
        </div>
        <div data-part="fallback" />
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
    </>
  )
}
