"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Cursor001Props = Omit<
  ComponentProps<"div">,
  "children" | "color"
> & {
  /** Символы от разреженного к плотному: по ним раскладывается плотность. */
  charset?: string
  /** Сторона знакоместа в CSS-пикселях. */
  cellSize?: number
  /** Цвет символов. Пусто — из палитры компонента. */
  color?: string
  /** Цвет фона. Пусто — из палитры компонента. */
  backgroundColor?: string
  /** Сила вливания: во сколько раз движение курсора толкает жидкость. */
  force?: number
  /** Затухание: больше — короче след. */
  dissipation?: number
  /** Радиус кисти, 0.05…1. */
  brush?: number
  /** Медленный дрейф, пока курсор снаружи, и мерцание символов. */
  animate?: boolean
  /** Реакция на курсор. */
  interactive?: boolean
}

// Симуляция жидкости на WebGL, выведенная в ASCII: за курсором расходится
// облако символов.
//
// Порядок кадра — классический stable fluids: вливание скорости и краски в
// точку курсора → адвекция → дивергенция → итерации Якоби для давления →
// вычитание градиента → адвекция краски. Плотность краски выбирает символ,
// сам символ берётся из атласа глифов, нарисованного один раз на 2D-канве.
//
// Поля живут в текстурах 180×180 и от размера блока не зависят: сетка
// симуляции фиксированная, а знакоместо (cellSize) задаёт только то,
// насколько крупным выходит «зерно» ASCII.

const SIM = 180
const TEXEL = 1 / SIM

/** Итерации Якоби на кадр: столько нужно, чтобы поле стало несжимаемым. */
const PRESSURE_STEPS = 14

/** Сторона клетки атласа глифов в пикселях. */
const GLYPH = 64

const VERTEX = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

// Вливание в точку. Скорость хранится в обычной RGBA-текстуре без
// float-расширений, поэтому пакуется в диапазон 0…1 парой enc/dec.
const SPLAT = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_target;
uniform vec2 u_point;
uniform vec3 u_color;
uniform float u_radius;
uniform float u_aspect;
uniform float u_velocityField;

vec2 dec(vec2 e) { return (e - 0.5) / 0.05; }
vec2 enc(vec2 v) { return clamp(v * 0.05 + 0.5, 0.0, 1.0); }

void main() {
  vec2 p = v_uv - u_point;
  p.x *= u_aspect;
  float d = exp(-dot(p, p) / max(u_radius, 0.0001));
  vec3 base = texture2D(u_target, v_uv).xyz;
  if (u_velocityField > 0.5) {
    vec2 next = dec(base.xy) + u_color.xy * d;
    gl_FragColor = vec4(enc(next), 0.5, 1.0);
  } else {
    gl_FragColor = vec4(base + u_color * d, 1.0);
  }
}
`

const ADVECT = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_velocity;
uniform sampler2D u_source;
uniform vec2 u_texel;
uniform float u_dt;
uniform float u_dissipation;
uniform float u_velocityField;

vec2 dec(vec2 e) { return (e - 0.5) / 0.05; }
vec2 enc(vec2 v) { return clamp(v * 0.05 + 0.5, 0.0, 1.0); }

void main() {
  vec2 vel = dec(texture2D(u_velocity, v_uv).xy);
  vec2 coord = v_uv - u_dt * vel * u_texel * 110.0;
  vec4 src = texture2D(u_source, clamp(coord, 0.0, 1.0));
  if (u_velocityField > 0.5) {
    vec2 next = dec(src.xy) * u_dissipation;
    gl_FragColor = vec4(enc(next), 0.5, 1.0);
  } else {
    gl_FragColor = vec4(src.xyz * u_dissipation, 1.0);
  }
}
`

const DIVERGENCE = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_velocity;
uniform vec2 u_texel;

vec2 dec(vec2 e) { return (e - 0.5) / 0.05; }

void main() {
  float L = dec(texture2D(u_velocity, v_uv - vec2(u_texel.x, 0.0)).xy).x;
  float R = dec(texture2D(u_velocity, v_uv + vec2(u_texel.x, 0.0)).xy).x;
  float B = dec(texture2D(u_velocity, v_uv - vec2(0.0, u_texel.y)).xy).y;
  float T = dec(texture2D(u_velocity, v_uv + vec2(0.0, u_texel.y)).xy).y;
  float div = 0.5 * ((R - L) + (T - B));
  gl_FragColor = vec4(div * 0.05 + 0.5, 0.0, 0.0, 1.0);
}
`

const PRESSURE = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_pressure;
uniform sampler2D u_divergence;
uniform vec2 u_texel;

float dec1(float e) { return (e - 0.5) / 0.05; }
float enc1(float v) { return clamp(v * 0.05 + 0.5, 0.0, 1.0); }

void main() {
  float L = dec1(texture2D(u_pressure, v_uv - vec2(u_texel.x, 0.0)).x);
  float R = dec1(texture2D(u_pressure, v_uv + vec2(u_texel.x, 0.0)).x);
  float B = dec1(texture2D(u_pressure, v_uv - vec2(0.0, u_texel.y)).x);
  float T = dec1(texture2D(u_pressure, v_uv + vec2(0.0, u_texel.y)).x);
  float C = dec1(texture2D(u_divergence, v_uv).x);
  float p = (L + R + B + T - C) * 0.25;
  gl_FragColor = vec4(enc1(p), 0.0, 0.0, 1.0);
}
`

const GRADIENT = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_pressure;
uniform sampler2D u_velocity;
uniform vec2 u_texel;

float dec1(float e) { return (e - 0.5) / 0.05; }
vec2 dec(vec2 e) { return (e - 0.5) / 0.05; }
vec2 enc(vec2 v) { return clamp(v * 0.05 + 0.5, 0.0, 1.0); }

void main() {
  float L = dec1(texture2D(u_pressure, v_uv - vec2(u_texel.x, 0.0)).x);
  float R = dec1(texture2D(u_pressure, v_uv + vec2(u_texel.x, 0.0)).x);
  float B = dec1(texture2D(u_pressure, v_uv - vec2(0.0, u_texel.y)).x);
  float T = dec1(texture2D(u_pressure, v_uv + vec2(0.0, u_texel.y)).x);
  vec2 vel = dec(texture2D(u_velocity, v_uv).xy);
  vel -= vec2(R - L, T - B) * 0.5;
  gl_FragColor = vec4(enc(vel), 0.5, 1.0);
}
`

// Вывод: плотность краски в клетке выбирает символ из атласа, под символами
// проступает мягкое пятно, собранное с соседних клеток.
const ASCII = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_dye;
uniform sampler2D u_atlas;
uniform vec2 u_resolution;
uniform vec2 u_cell;
uniform float u_charCount;
uniform vec3 u_ink;
uniform vec3 u_paper;
uniform float u_time;
uniform float u_animate;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 pixel = v_uv * u_resolution;
  vec2 cell = floor(pixel / u_cell);
  vec2 cellUv = (cell + 0.5) * u_cell / u_resolution;

  float dens = clamp(texture2D(u_dye, cellUv).x, 0.0, 1.0);

  vec2 texel = u_cell / u_resolution;
  float glow =
    dens * 0.40 +
    texture2D(u_dye, cellUv + vec2( texel.x, 0.0)).x * 0.15 +
    texture2D(u_dye, cellUv - vec2( texel.x, 0.0)).x * 0.15 +
    texture2D(u_dye, cellUv + vec2(0.0,  texel.y)).x * 0.15 +
    texture2D(u_dye, cellUv - vec2(0.0,  texel.y)).x * 0.15;
  glow = clamp(glow, 0.0, 1.0);
  glow = pow(glow, 1.35);

  float lit = dens;
  if (u_animate > 0.5) {
    float flicker = hash21(cell + floor(u_time * 10.0)) - 0.5;
    lit = clamp(lit + flicker * 0.05, 0.0, 1.0);
  }

  float idx = min(floor(lit * (u_charCount - 0.001)), u_charCount - 1.0);
  vec2 local = fract(pixel / u_cell);
  float u0 = (idx + local.x) / u_charCount;
  float glyph = texture2D(u_atlas, vec2(u0, local.y)).r;

  float alpha = glyph * smoothstep(0.02, 0.12, dens);

  float wash = glow * 0.22;
  vec3 col = mix(u_paper, u_ink, wash);
  col = mix(col, u_ink, clamp(alpha, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}
`

const DEFAULT_CHARSET =
  " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"

const STYLES = `
:where([data-vibeui-block="cursor-001"]){
--vibeui-cursor-001-ink:light-dark(oklch(0.18 0 0),oklch(0.96 0 0));
--vibeui-cursor-001-paper:light-dark(oklch(1 0 0),oklch(0.145 0 0));
--vibeui-cursor-001-border:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 14%));
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cursor-001"]{color-scheme:dark}
[data-vibeui-block="cursor-001"]{
position:relative;box-sizing:border-box;width:100%;aspect-ratio:16/9;min-height:12rem;
overflow:hidden;border:1px solid var(--vibeui-cursor-001-border);border-radius:0.75rem;
background:var(--vibeui-cursor-001-paper);touch-action:pan-y;
}
[data-vibeui-block="cursor-001"] canvas{
position:absolute;inset:0;display:block;width:100%;height:100%;
}
/* Пробники цвета: шейдеру нужны числа, а в переменных стоит light-dark() —
   разрешённый цвет снимается с этих пустых узлов. */
[data-vibeui-block="cursor-001"] [data-part="ink"],
[data-vibeui-block="cursor-001"] [data-part="paper"]{
position:absolute;width:0;height:0;overflow:hidden;
}
[data-vibeui-block="cursor-001"] [data-part="ink"]{color:var(--vibeui-cursor-001-ink)}
[data-vibeui-block="cursor-001"] [data-part="paper"]{color:var(--vibeui-cursor-001-paper)}
`

type Target = {
  tex: WebGLTexture
  fbo: WebGLFramebuffer
  size: number
}

type Pair = { read: Target; write: Target; swap: () => void }

type Program = { program: WebGLProgram; fs: WebGLShader }

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type)

  if (!shader) {
    return null
  }

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)

    return null
  }

  return shader
}

function link(
  gl: WebGLRenderingContext,
  vertex: WebGLShader,
  source: string,
): Program | null {
  const fs = compile(gl, gl.FRAGMENT_SHADER, source)

  if (!fs) {
    return null
  }

  const program = gl.createProgram()

  if (!program) {
    gl.deleteShader(fs)

    return null
  }

  gl.attachShader(program, vertex)
  gl.attachShader(program, fs)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    gl.deleteShader(fs)

    return null
  }

  return { program, fs }
}

function createTarget(
  gl: WebGLRenderingContext,
  size: number,
  filter: number,
): Target | null {
  const tex = gl.createTexture()
  const fbo = gl.createFramebuffer()

  if (!tex || !fbo) {
    return null
  }

  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    size,
    size,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  )
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    tex,
    0,
  )
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)

  return { tex, fbo, size }
}

/** Пара текстур для пинг-понга: читаем из одной, пишем в другую. */
function createPair(
  gl: WebGLRenderingContext,
  size: number,
  filter: number,
): Pair | null {
  const read = createTarget(gl, size, filter)
  const write = createTarget(gl, size, filter)

  if (!read || !write) {
    return null
  }

  return {
    read,
    write,
    swap() {
      const previous = this.read
      this.read = this.write
      this.write = previous
    },
  }
}

/** Атлас глифов: символы charset в ряд, по клетке на символ. */
function createAtlas(
  gl: WebGLRenderingContext,
  charset: string,
): { tex: WebGLTexture; count: number } | null {
  const count = Math.max(charset.length, 1)
  const canvas = document.createElement("canvas")
  canvas.width = GLYPH * count
  canvas.height = GLYPH

  const context = canvas.getContext("2d")

  if (!context) {
    return null
  }

  context.fillStyle = "#000"
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = "#fff"
  context.font = `700 ${Math.floor(GLYPH * 0.72)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
  context.textAlign = "center"
  context.textBaseline = "middle"

  for (let index = 0; index < count; index += 1) {
    const symbol = charset[index] ?? " "

    if (symbol !== " ") {
      context.fillText(symbol, GLYPH * (index + 0.5), GLYPH * 0.55)
    }
  }

  const tex = gl.createTexture()

  if (!tex) {
    return null
  }

  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0)

  return { tex, count }
}

/**
 * Любой CSS-цвет — в три числа 0…1 для шейдера.
 *
 * Разбирать строку руками нельзя: браузер отдаёт вычисленный цвет в том же
 * пространстве, в каком он записан, и `getComputedStyle` возвращает
 * «oklch(0.18 0 0)», а не «rgb(...)». Поэтому цвет разрешается канвой
 * размером в один пиксель — она понимает всё, что понимает CSS.
 */
const swatch = { canvas: null as HTMLCanvasElement | null, cache: new Map() }

function toRgb(value: string): [number, number, number] {
  const known = swatch.cache.get(value)

  if (known) {
    return known
  }

  if (!swatch.canvas) {
    swatch.canvas = document.createElement("canvas")
    swatch.canvas.width = 1
    swatch.canvas.height = 1
  }

  const context = swatch.canvas.getContext("2d", { willReadFrequently: true })
  let rgb: [number, number, number] = [0.1, 0.1, 0.12]

  if (context) {
    // Заведомо валидный цвет до присваивания: невалидное значение
    // fillStyle молча игнорирует, и остался бы цвет прошлого вызова.
    context.fillStyle = "#000000"
    context.fillStyle = value
    context.fillRect(0, 0, 1, 1)

    const pixel = context.getImageData(0, 0, 1, 1).data
    rgb = [pixel[0] / 255, pixel[1] / 255, pixel[2] / 255]
  }

  swatch.cache.set(value, rgb)

  return rgb
}

/**
 * Поле ASCII-символов, за курсором в котором расходится облако. Под
 * символами считается настоящая жидкость: вливание, адвекция, давление.
 */
export function Cursor001({
  charset = DEFAULT_CHARSET,
  cellSize = 12,
  color,
  backgroundColor,
  force = 1,
  dissipation = 0.05,
  brush = 0.55,
  animate = true,
  interactive = true,
  className,
  style,
  ...props
}: Cursor001Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Настройки читаются из ref внутри кадра: их смена не должна означать
  // пересборку симуляции — поле обязано продолжать жить.
  const settings = useRef({
    charset,
    cellSize,
    color,
    backgroundColor,
    force,
    dissipation,
    brush,
    animate,
    interactive,
  })

  useEffect(() => {
    settings.current = {
      charset,
      cellSize,
      color,
      backgroundColor,
      force,
      dissipation,
      brush,
      animate,
      interactive,
    }
  })

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current

    if (!host || !canvas) {
      return
    }

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    })

    if (!gl) {
      return
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)

    if (!vertex) {
      return
    }

    const splat = link(gl, vertex, SPLAT)
    const advect = link(gl, vertex, ADVECT)
    const divergence = link(gl, vertex, DIVERGENCE)
    const pressure = link(gl, vertex, PRESSURE)
    const gradient = link(gl, vertex, GRADIENT)
    const ascii = link(gl, vertex, ASCII)
    const velocity = createPair(gl, SIM, gl.LINEAR)
    const dye = createPair(gl, SIM, gl.LINEAR)
    const pressureField = createPair(gl, SIM, gl.NEAREST)
    const divergenceField = createTarget(gl, SIM, gl.NEAREST)
    const atlas = createAtlas(gl, settings.current.charset)

    if (
      !splat ||
      !advect ||
      !divergence ||
      !pressure ||
      !gradient ||
      !ascii ||
      !velocity ||
      !dye ||
      !pressureField ||
      !divergenceField ||
      !atlas
    ) {
      return
    }

    let glyphs = atlas
    let atlasCharset = settings.current.charset

    const quad = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )

    /** Делает программу текущей и подключает вершинный буфер. */
    function activate(program: WebGLProgram) {
      gl!.useProgram(program)
      const location = gl!.getAttribLocation(program, "a_position")
      gl!.enableVertexAttribArray(location)
      gl!.vertexAttribPointer(location, 2, gl!.FLOAT, false, 0, 0)
    }

    function at(program: WebGLProgram, name: string) {
      return gl!.getUniformLocation(program, name)
    }

    /** Кладёт текстуру в слот и объявляет её программе. */
    function bind(
      program: WebGLProgram,
      name: string,
      texture: WebGLTexture,
      slot: number,
    ) {
      gl!.activeTexture(slot === 0 ? gl!.TEXTURE0 : gl!.TEXTURE1)
      gl!.bindTexture(gl!.TEXTURE_2D, texture)
      gl!.uniform1i(at(program, name), slot)
    }

    function blit(target: Target | null) {
      if (target) {
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo)
        gl!.viewport(0, 0, target.size, target.size)
      } else {
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null)
        gl!.viewport(0, 0, canvas!.width, canvas!.height)
      }

      gl!.drawArrays(gl!.TRIANGLES, 0, 6)
    }

    function clear(target: Target, value = 0) {
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo)
      gl!.viewport(0, 0, target.size, target.size)
      gl!.clearColor(value, value, value, 1)
      gl!.clear(gl!.COLOR_BUFFER_BIT)
    }

    // Нулевая скорость в упаковке — это 0.5, а не 0: поле стартует серым.
    clear(velocity.read, 0.5)
    clear(velocity.write, 0.5)
    clear(dye.read)
    clear(dye.write)

    const pointer = {
      x: 0.5,
      y: 0.5,
      dx: 0,
      dy: 0,
      moved: false,
      inside: false,
    }
    const still = window.matchMedia("(prefers-reduced-motion: reduce)")
    let reduced = still.matches

    function onMotionChange() {
      reduced = still.matches
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const width = host!.clientWidth
      const height = host!.clientHeight

      if (width <= 0 || height <= 0) {
        return
      }

      canvas!.width = Math.max(1, Math.floor(width * ratio))
      canvas!.height = Math.max(1, Math.floor(height * ratio))
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
    }

    // Курсор слушается на окне, а не на блоке: указатель, влетающий сбоку,
    // должен втащить за собой след с той же скоростью, с какой он шёл
    // снаружи, — иначе облако рождается уже внутри и рывком.
    function onPointerMove(event: PointerEvent) {
      if (!settings.current.interactive) {
        return
      }

      const rect = host!.getBoundingClientRect()

      if (rect.width <= 0 || rect.height <= 0) {
        return
      }

      const x = (event.clientX - rect.left) / rect.width
      // Ось Y в текстуре снизу вверх, в окне — сверху вниз.
      const y = 1 - (event.clientY - rect.top) / rect.height

      pointer.inside = x >= 0 && x <= 1 && y >= 0 && y <= 1
      pointer.dx = x - pointer.x
      pointer.dy = y - pointer.y
      pointer.x = x
      pointer.y = y
      pointer.moved = true
    }

    function onPointerLeave() {
      pointer.inside = false
    }

    resize()

    const observer = new ResizeObserver(resize)
    observer.observe(host)
    still.addEventListener("change", onMotionChange)
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    host.addEventListener("pointerleave", onPointerLeave, { passive: true })

    const inkProbe = host.querySelector<HTMLElement>('[data-part="ink"]')
    const paperProbe = host.querySelector<HTMLElement>('[data-part="paper"]')

    let frame = 0
    let running = true
    let previous = performance.now()
    const started = previous

    function render(now: number) {
      if (!running) {
        return
      }

      const dt = Math.min((now - previous) / 1000, 0.033)
      previous = now

      const time = (now - started) / 1000
      const current = settings.current

      if (current.charset !== atlasCharset) {
        const next = createAtlas(gl!, current.charset)

        if (next) {
          gl!.deleteTexture(glyphs.tex)
          glyphs = next
          atlasCharset = current.charset
        }
      }

      const ink = toRgb(
        current.color ??
          (inkProbe ? getComputedStyle(inkProbe).color : "#121212"),
      )
      const paper = toRgb(
        current.backgroundColor ??
          (paperProbe ? getComputedStyle(paperProbe).color : "#ffffff"),
      )

      const aspect = canvas!.width / Math.max(canvas!.height, 1)
      const radius =
        0.00012 + 0.0011 * Math.max(0.05, Math.min(1, current.brush))

      if (current.interactive && pointer.moved && pointer.inside && !reduced) {
        const speed = Math.hypot(pointer.dx, pointer.dy)
        const push = current.force * (18 + 120 * speed)

        activate(splat!.program)
        bind(splat!.program, "u_target", velocity!.read.tex, 0)
        gl!.uniform2f(at(splat!.program, "u_point"), pointer.x, pointer.y)
        gl!.uniform3f(
          at(splat!.program, "u_color"),
          pointer.dx * push,
          pointer.dy * push,
          0,
        )
        gl!.uniform1f(at(splat!.program, "u_radius"), radius)
        gl!.uniform1f(at(splat!.program, "u_aspect"), aspect)
        gl!.uniform1f(at(splat!.program, "u_velocityField"), 1)
        blit(velocity!.write)
        velocity!.swap()

        // Краски вливается тем больше, чем быстрее движение, но не
        // бесконечно: иначе рывок мышью заливает поле целиком.
        const amount = Math.min(1.4, 0.45 + 8 * speed) * current.force

        bind(splat!.program, "u_target", dye!.read.tex, 0)
        gl!.uniform2f(at(splat!.program, "u_point"), pointer.x, pointer.y)
        gl!.uniform3f(at(splat!.program, "u_color"), amount, 0, 0)
        gl!.uniform1f(at(splat!.program, "u_radius"), radius * 1.15)
        gl!.uniform1f(at(splat!.program, "u_aspect"), aspect)
        gl!.uniform1f(at(splat!.program, "u_velocityField"), 0)
        blit(dye!.write)
        dye!.swap()

        pointer.moved = false
        pointer.dx = 0
        pointer.dy = 0
      }

      // Пока курсора внутри нет, поле шевелит себя само: иначе карточка в
      // каталоге стоит мёртвой, пока в неё не ткнули мышью.
      if (current.animate && !reduced && !pointer.inside) {
        activate(splat!.program)
        bind(splat!.program, "u_target", velocity!.read.tex, 0)
        gl!.uniform2f(
          at(splat!.program, "u_point"),
          0.5 + 0.22 * Math.sin(0.23 * time),
          0.5 + 0.18 * Math.cos(0.19 * time),
        )
        gl!.uniform3f(
          at(splat!.program, "u_color"),
          0.22 * Math.sin(0.55 * time),
          0.22 * Math.cos(0.42 * time),
          0,
        )
        gl!.uniform1f(at(splat!.program, "u_radius"), 0.0018)
        gl!.uniform1f(at(splat!.program, "u_aspect"), aspect)
        gl!.uniform1f(at(splat!.program, "u_velocityField"), 1)
        blit(velocity!.write)
        velocity!.swap()
      }

      if (!reduced) {
        // Адвекция скорости самой собой.
        activate(advect!.program)
        bind(advect!.program, "u_velocity", velocity!.read.tex, 0)
        bind(advect!.program, "u_source", velocity!.read.tex, 1)
        gl!.uniform2f(at(advect!.program, "u_texel"), TEXEL, TEXEL)
        gl!.uniform1f(at(advect!.program, "u_dt"), dt)
        gl!.uniform1f(
          at(advect!.program, "u_dissipation"),
          1 - Math.min(0.18, 2.5 * current.dissipation),
        )
        gl!.uniform1f(at(advect!.program, "u_velocityField"), 1)
        blit(velocity!.write)
        velocity!.swap()

        // Дивергенция поля скоростей.
        activate(divergence!.program)
        bind(divergence!.program, "u_velocity", velocity!.read.tex, 0)
        gl!.uniform2f(at(divergence!.program, "u_texel"), TEXEL, TEXEL)
        blit(divergenceField)

        // Давление: итерации Якоби.
        clear(pressureField!.read, 0.5)
        clear(pressureField!.write, 0.5)
        activate(pressure!.program)

        for (let step = 0; step < PRESSURE_STEPS; step += 1) {
          bind(pressure!.program, "u_pressure", pressureField!.read.tex, 0)
          bind(pressure!.program, "u_divergence", divergenceField!.tex, 1)
          gl!.uniform2f(at(pressure!.program, "u_texel"), TEXEL, TEXEL)
          blit(pressureField!.write)
          pressureField!.swap()
        }

        // Вычитание градиента давления — поле снова несжимаемо.
        activate(gradient!.program)
        bind(gradient!.program, "u_pressure", pressureField!.read.tex, 0)
        bind(gradient!.program, "u_velocity", velocity!.read.tex, 1)
        gl!.uniform2f(at(gradient!.program, "u_texel"), TEXEL, TEXEL)
        blit(velocity!.write)
        velocity!.swap()

        // Адвекция краски по готовому полю скоростей.
        activate(advect!.program)
        bind(advect!.program, "u_velocity", velocity!.read.tex, 0)
        bind(advect!.program, "u_source", dye!.read.tex, 1)
        gl!.uniform2f(at(advect!.program, "u_texel"), TEXEL, TEXEL)
        gl!.uniform1f(at(advect!.program, "u_dt"), dt)
        gl!.uniform1f(
          at(advect!.program, "u_dissipation"),
          1 - Math.min(0.22, Math.max(0.02, current.dissipation)),
        )
        gl!.uniform1f(at(advect!.program, "u_velocityField"), 0)
        blit(dye!.write)
        dye!.swap()
      }

      // Вывод в ASCII.
      activate(ascii!.program)
      bind(ascii!.program, "u_dye", dye!.read.tex, 0)
      bind(ascii!.program, "u_atlas", glyphs.tex, 1)
      gl!.uniform2f(
        at(ascii!.program, "u_resolution"),
        canvas!.width,
        canvas!.height,
      )

      const cell =
        Math.max(7, current.cellSize) *
        Math.min(window.devicePixelRatio || 1, 2)

      gl!.uniform2f(at(ascii!.program, "u_cell"), cell, cell)
      gl!.uniform1f(at(ascii!.program, "u_charCount"), glyphs.count)
      gl!.uniform3f(at(ascii!.program, "u_ink"), ink[0], ink[1], ink[2])
      gl!.uniform3f(at(ascii!.program, "u_paper"), paper[0], paper[1], paper[2])
      gl!.uniform1f(at(ascii!.program, "u_time"), time)
      gl!.uniform1f(
        at(ascii!.program, "u_animate"),
        current.animate && !reduced ? 1 : 0,
      )
      blit(null)

      frame = requestAnimationFrame(render)
    }

    frame = requestAnimationFrame(render)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      still.removeEventListener("change", onMotionChange)
      window.removeEventListener("pointermove", onPointerMove)
      host.removeEventListener("pointerleave", onPointerLeave)

      for (const entry of [
        splat,
        advect,
        divergence,
        pressure,
        gradient,
        ascii,
      ]) {
        gl.deleteProgram(entry.program)
        gl.deleteShader(entry.fs)
      }

      gl.deleteShader(vertex)
      gl.deleteBuffer(quad)
      gl.deleteTexture(glyphs.tex)

      for (const target of [
        velocity.read,
        velocity.write,
        dye.read,
        dye.write,
        pressureField.read,
        pressureField.write,
        divergenceField,
      ]) {
        gl.deleteTexture(target.tex)
        gl.deleteFramebuffer(target.fbo)
      }
    }
  }, [])

  return (
    <>
      <style href="vibeui-cursor-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={hostRef}
        data-vibeui-block="cursor-001"
        data-slot="ascii-fluid"
        className={className}
        style={style as CSSProperties}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
        <span data-part="ink" aria-hidden="true" />
        <span data-part="paper" aria-hidden="true" />
      </div>
    </>
  )
}
