"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Background001Props = Omit<ComponentProps<"div">, "children"> & {
  /** Тёплая кромка ленты. Шестнадцатеричный цвет: значение уходит в шейдер. */
  accent?: string
  /** Средняя прядь. */
  tint?: string
  /** Прядь между средней и холодной кромкой. */
  far?: string
  /** Холодная кромка. */
  cool?: string
  /** Самая тёплая прядь у края ленты. */
  sun?: string
  /** Масштаб длительности движения. Больше — спокойнее. */
  speed?: number
  /** Глубина волны. Ноль — ровное полотно. */
  amplitude?: number
  /** Сила перекрута. Ноль отключает повороты, сохраняя продольный сгиб. */
  twist?: number
  /** Продольные нити внутри ленты. */
  fibers?: boolean
}

// Настраиваемая палитра от холодной кромки к тёплому сгибу.
const DEFAULTS = {
  cool: "#bbcefb",
  far: "#cca1ff",
  tint: "#ff88d1",
  accent: "#ff6f55",
  sun: "#ffc369",
}

// Сетка полотна снята с образца: 257 узлов вдоль ленты и 129 поперёк.
// Перекрут живёт в вершинах, и при вдвое более редкой сетке излом становится
// гранёным.
const GRID_X = 129
const GRID_Y = 257

// Палитра исходной ленты: встроена, чтобы установленный блок работал без CDN.
// Источник: https://stripe.com/en-lv (палитра hero-wave-animation).
const PALETTE =
  "data:image/webp;base64,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"

// Simplex noise: Stefan Gustavson; xxHash: https://xxhash.com/ (BSD-2-Clause).
// Сохраняем целочисленный hash: sin-hash меняет траекторию волны.
const NOISE = `float xxhash(vec2 x) {
  uvec2 t = floatBitsToUint(x);
  uint h = 0xc2b2ae3du * t.x + 0x165667b9u;
  h = (h << 17u | h >> 15u) * 0x27d4eb2fu;
  h += 0xc2b2ae3du * t.y;
  h = (h << 17u | h >> 15u) * 0x27d4eb2fu;
  h ^= h >> 15u;
  h *= 0x85ebca77u;
  h ^= h >> 13u;
  h *= 0xc2b2ae3du;
  h ^= h >> 16u;
  return uintBitsToFloat(h >> 9u | 0x3f800000u) - 1.0;
}

vec2 hash(vec2 x) {
  float k = 6.283185307 * xxhash(x);
  return vec2(cos(k), sin(k));
}





float simplexNoise(in vec2 p) {
  const float K1 = 0.366025404; // (sqrt(3)-1)/2;
  const float K2 = 0.211324865; // (3-sqrt(3))/6;

  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0))); // changed to h^3 [1]

  return dot(n, vec3(32.99)); // analytic factor (= 2916*sqrt(2)/125)
}`

/**
 * Полотно сложено вдвое; перед проекцией его трижды поворачивают
 * вокруг наклонных осей на угол, который резко затухает от края к краю.
 * Отсюда перекрут: часть ленты успевает встать ребром, часть остаётся
 * развёрнутой к зрителю. Плоская полоса в двух измерениях так не умеет —
 * у неё нет изнанки.
 */
const VERTEX = `#version 300 es
in vec2 grid;

out vec2 v_uv;
out vec3 v_position;

uniform float time;
uniform mat4 camera;
uniform float amplitude;
uniform float twist;
uniform vec3 twistTurn;
uniform vec3 twistFalloff;
uniform float tilt;
uniform vec2 shift;

${NOISE}

// Резкое затухание: у одного края поворот полный, у другого сходит на нет.
// Равномерный поворот скрутил бы ленту винтом по всей длине, а нужен один
// перехлёст.
float falloff(float x, float power) {
  return exp2(-exp2(power) * pow(max(x, 0.0), power));
}

mat3 turn(vec3 axis, float angle) {
  vec3 a = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float t = 1.0 - c;

  return mat3(
    t * a.x * a.x + c,       t * a.x * a.y - a.z * s, t * a.z * a.x + a.y * s,
    t * a.x * a.y + a.z * s, t * a.y * a.y + c,       t * a.y * a.z - a.x * s,
    t * a.z * a.x - a.y * s, t * a.y * a.z + a.x * s, t * a.z * a.z + c
  );
}

void main() {
  v_uv = grid;

  // UV.x огибает сложенное вдвое полотно, UV.y идёт вдоль него.
  // Повороты плоской сетки не воспроизводят этот сгиб: нужны обе стороны.
  float across = (grid.x - 0.5) * 400.0;
  float radius = 4.0 - 2.0 * pow(4.0 * grid.y * (1.0 - grid.y), 9.5);
  float bend = clamp((across + 16.0) / 32.0, 0.0, 1.0) * 3.14159265;
  vec3 position = vec3(
    (grid.y - 0.5) * 400.0,
    cos(bend) * radius,
    abs(across) < 16.0 ? 84.0 + sin(bend) * radius : 100.0 - abs(across)
  );

  position.y += amplitude * simplexNoise(
    vec2(position.x * 0.005831 + time, position.z * 0.016001 + time)
  );

  // Вектор умножается на матрицу справа, а не слева: у поворота, взятого с
  // другой стороны, знак обратный, и полотно складывается в другую сторону.
  position = position * turn(vec3(0.5, 0.0, 0.5), twist * twistTurn.y * falloff(grid.x, twistFalloff.y));
  position = position * turn(vec3(0.0, 0.5, 0.5), twist * twistTurn.x * falloff(grid.y, twistFalloff.x));
  position = position * turn(vec3(0.5, 0.0, 0.5), twist * twistTurn.z * falloff(grid.y, twistFalloff.z));

  v_position = position;

  vec4 clip = camera * vec4(position, 1.0);
  float s = sin(tilt);
  float c = cos(tilt);

  gl_Position = vec4(
    (clip.x * c - clip.y * s) + shift.x * clip.w,
    (clip.x * s + clip.y * c) + shift.y * clip.w,
    clip.z,
    clip.w
  );
}`

const FRAGMENT = `#version 300 es
precision highp float;
precision highp int;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D palette;
uniform vec2 resolution;
uniform vec3 cool;
uniform vec3 far;
uniform vec3 tint;
uniform vec3 accent;
uniform vec3 sun;
uniform float fibers;

${NOISE}

void main() {
  vec3 colour = texture(palette, v_uv).rgb;
  // Пропы дают поправку к исходной палитре; при defaults поправка нулевая.
  vec3 weights = exp(-12.0 * vec3(
    distance(colour, vec3(0.73, 0.81, 0.98)),
    distance(colour, vec3(0.80, 0.63, 1.0)),
    distance(colour, vec3(1.0, 0.53, 0.82))));
  vec2 warm = exp(-12.0 * vec2(
    distance(colour, vec3(1.0, 0.44, 0.33)),
    distance(colour, vec3(1.0, 0.76, 0.41))));
  colour += (cool * weights.x + far * weights.y + tint * weights.z +
    accent * warm.x + sun * warm.y) / max(dot(weights, vec3(1.0)) + warm.x + warm.y, 0.0001);

  float slope = clamp(dFdy(v_uv.y) * resolution.y * 1.98 * 0.5 + 0.5, 0.0, 1.0);
  slope = smoothstep(0.0, 0.834, pow(slope, 0.806));
  if (fibers > 0.5) {
    float slow = simplexNoise(vec2(v_uv.x * 0.1, v_uv.y * 0.5));
    float threads = simplexNoise(vec2(v_uv.x * (600.0 + 300.0 * slow), v_uv.y * 4.0 * slow));
    float attenuation = 1.0 - pow(4.0 * v_uv.x * (1.0 - v_uv.x), 3.0);
    colour += (threads * 0.5 + 0.5) * 0.2 * (1.0 - colour.b * 0.9) * slope * attenuation;
  }
  vec3 axis = vec3(0.57735);
  vec3 projection = axis * dot(axis, colour);
  vec3 u = colour - projection;
  colour = u * cos(-0.001592653589793) + cross(axis, u) * sin(-0.001592653589793) + projection;
  fragColor = clamp(vec4(colour + (1.0 - slope) * 0.25, 1.0), 0.0, 1.0);
}`

const POST_VERTEX = `#version 300 es
out vec2 uv;
void main() {
  vec2 point = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  uv = point;
  gl_Position = vec4(point * 2.0 - 1.0, 0.0, 1.0);
}`

const POST_FRAGMENT = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 fragColor;
uniform sampler2D scene;
void main() {
  vec2 point = uv - 0.5;
  float angle = 0.02 / 6.0;
  mat2 rotation = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
  vec4 blurred = vec4(0.0);
  for (int i = 0; i < 6; i++) {
    blurred += texture(scene, point + 0.5);
    point *= rotation;
  }
  float strength = smoothstep(0.0, 0.7, uv.y) - smoothstep(0.2, 1.0, uv.y);
  vec4 colour = mix(blurred / 6.0, texture(scene, uv), strength);
  float random = fract(sin(dot(gl_FragCoord.xy * 0.01, vec2(12.9898, 78.233))) * 43758.5453);
  colour.rgb += mix(1.1 * 4.0 / 255.0, -1.1 * 4.0 / 255.0, random);
  fragColor = vec4(min(colour.rgb, 1.0), colour.a);
}`

const STYLES = `
:where([data-vibeui-block="background-001"]){
/* Тёмная ветка — чистый чёрный: лента светится, и любая подмешанная
   тёплая серость под ней читается как грязь на стекле. */
--vibeui-background-001-bg:light-dark(oklch(0.99 0.002 60),oklch(0 0 0));
--vibeui-background-001-fallback:light-dark(oklch(0.33 0 0 / 45%),oklch(0.899 0 0 / 35%));
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="background-001"]{color-scheme:dark}
[data-vibeui-block="background-001"]{
position:relative;box-sizing:border-box;overflow:hidden;isolation:isolate;
/* Фон занимает всё, что ему дали: он подложка, а не картинка в рамке.
   Своя высота нужна только тогда, когда родитель её не задал. */
width:100%;min-width:min(100%,16rem);min-height:30rem;height:100%;
background:var(--vibeui-background-001-bg);
}
[data-vibeui-block="background-001"] *{box-sizing:border-box}
[data-vibeui-block="background-001"] canvas{
position:absolute;inset:0;width:100%;height:100%;display:block;
}
/* Пока полотно не ожило — и навсегда там, где нет WebGL 2, — в кадре лежит
   градиентная заливка тех же цветов. Пустой прямоугольник читался бы
   поломкой. */
[data-vibeui-block="background-001"] [data-part="fallback"]{
position:absolute;inset:0;pointer-events:none;
background:
radial-gradient(70% 60% at 78% 12%,var(--vibeui-background-001-fallback),transparent 70%),
radial-gradient(60% 50% at 30% 78%,var(--vibeui-background-001-fallback),transparent 72%);
}
[data-vibeui-block="background-001"][data-drawn="true"] [data-part="fallback"]{display:none}
`

/** #rrggbb → три числа 0…1 для шейдера. */
function toRgb(value: string, fallback: string) {
  const hex =
    /^#?([0-9a-f]{6})$/i.exec(value.trim()) ??
    /^#?([0-9a-f]{6})$/i.exec(fallback)

  if (!hex) return [1, 0.35, 0]

  const number = Number.parseInt(hex[1], 16)

  return [
    ((number >> 16) & 255) / 255,
    ((number >> 8) & 255) / 255,
    (number & 255) / 255,
  ]
}

/**
 * Камера снята с образца: параллельная проекция и наклон, при котором
 * полотно уходит от зрителя по диагонали. Числа матрицы — замер, а не
 * подбор: собственный ракурс давал другую перспективу перекрута, и лента
 * читалась иначе.
 *
 * Размер ортографического окна адаптируется к контейнеру без растяжения.
 */
const MODEL_VIEW = [
  -2.591275691986084, 7.59769868850708, -4.069430828094482, 0,
  -7.584522724151611, -2.5433096885681152, 0.08116345852613449, 0,
  -0.6759144067764282, 2.157986640930176, 4.45939826965332, 0,
  380.1459655761719, -301.70001220703125, -5004.4990234375, 1,
]

function cameraMatrix(aspect: number) {
  // Ортографическое окно сохраняет пропорции и глубину перекрытий.
  // На узком контейнере расширяем видимую высоту, сохраняя ленту целиком.
  const viewWidth = Math.max(1100, 829 * aspect)
  const viewHeight = viewWidth / aspect

  const projection = [
    2 / viewWidth,
    0,
    0,
    0,
    0,
    2 / viewHeight,
    0,
    0,
    0,
    0,
    -2 / 9999,
    0,
    0,
    0,
    -10001 / 9999,
    1,
  ]

  return multiply(projection, MODEL_VIEW)
}

function multiply(a: number[], b: number[]) {
  const out = new Array<number>(16).fill(0)

  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      let sum = 0

      for (let k = 0; k < 4; k += 1) {
        sum += a[k * 4 + row] * b[column * 4 + k]
      }

      out[column * 4 + row] = sum
    }
  }

  return out
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

/** Сетка полотна: координаты вершин в долях и индексы треугольников. */
function buildGrid(columns: number, rows: number) {
  const points = new Float32Array(columns * rows * 2)
  let cursor = 0

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      points[cursor] = column / (columns - 1)
      points[cursor + 1] = 1 - row / (rows - 1)
      cursor += 2
    }
  }

  const indices = new Uint32Array((columns - 1) * (rows - 1) * 6)
  let index = 0

  for (let row = 0; row < rows - 1; row += 1) {
    for (let column = 0; column < columns - 1; column += 1) {
      const corner = row * columns + column

      indices[index] = corner
      indices[index + 1] = corner + 1
      indices[index + 2] = corner + columns
      indices[index + 3] = corner + 1
      indices[index + 4] = corner + columns + 1
      indices[index + 5] = corner + columns
      index += 6
    }
  }

  return { points, indices }
}

/**
 * Фон-полотно: скрученная лента спектра пересекает кадр, волна медленно
 * идёт вдоль неё. Считает видеокарта, зависимостей нет.
 */
export function Background001({
  accent = DEFAULTS.accent,
  tint = DEFAULTS.tint,
  far = DEFAULTS.far,
  cool = DEFAULTS.cool,
  sun = DEFAULTS.sun,
  speed = 60,
  amplitude = -7.821,
  twist = 1,
  fibers = true,
  className,
  style,
  ...props
}: Background001Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Настройки читаются на каждом кадре, поэтому живут в ref: пересобирать
  // сцену ради смены цвета незачем.
  const settings = useRef({
    accent,
    tint,
    far,
    cool,
    sun,
    speed,
    amplitude,
    twist,
    fibers,
  })

  useEffect(() => {
    settings.current = {
      accent,
      tint,
      far,
      cool,
      sun,
      speed,
      amplitude,
      twist,
      fibers,
    }
  })

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current

    if (!host || !canvas) return

    // WebGL 2 нужен ради производных в шейдере: именно они рисуют кромку на
    // перекруте. В первой версии это отдельное расширение, которого на части
    // машин нет, — там остаётся градиентная заливка.
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

    const postVertex = compile(gl, gl.VERTEX_SHADER, POST_VERTEX)
    const postFragment = compile(gl, gl.FRAGMENT_SHADER, POST_FRAGMENT)
    const postProgram = gl.createProgram()
    if (!postVertex || !postFragment || !postProgram) return
    gl.attachShader(postProgram, postVertex)
    gl.attachShader(postProgram, postFragment)
    gl.linkProgram(postProgram)
    if (!gl.getProgramParameter(postProgram, gl.LINK_STATUS)) return

    const palette = gl.createTexture()
    const sceneTexture = gl.createTexture()
    const framebuffer = gl.createFramebuffer()
    const depth = gl.createRenderbuffer()
    if (!palette || !sceneTexture || !framebuffer || !depth) return
    let paletteReady = false
    const paletteImage = new Image()
    paletteImage.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, palette)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE)
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        paletteImage,
      )
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR,
      )
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.generateMipmap(gl.TEXTURE_2D)
      paletteReady = true
      run()
    }
    paletteImage.src = PALETTE
    gl.bindTexture(gl.TEXTURE_2D, sceneTexture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.useProgram(program)

    const { points, indices } = buildGrid(GRID_X, GRID_Y)

    const array = gl.createVertexArray()
    gl.bindVertexArray(array)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

    const grid = gl.getAttribLocation(program, "grid")
    gl.enableVertexAttribArray(grid)
    gl.vertexAttribPointer(grid, 2, gl.FLOAT, false, 0, 0)

    const elements = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    const uniforms = {
      time: gl.getUniformLocation(program, "time"),
      camera: gl.getUniformLocation(program, "camera"),
      resolution: gl.getUniformLocation(program, "resolution"),
      amplitude: gl.getUniformLocation(program, "amplitude"),
      twist: gl.getUniformLocation(program, "twist"),
      twistTurn: gl.getUniformLocation(program, "twistTurn"),
      twistFalloff: gl.getUniformLocation(program, "twistFalloff"),
      tilt: gl.getUniformLocation(program, "tilt"),
      shift: gl.getUniformLocation(program, "shift"),
      accent: gl.getUniformLocation(program, "accent"),
      tint: gl.getUniformLocation(program, "tint"),
      far: gl.getUniformLocation(program, "far"),
      cool: gl.getUniformLocation(program, "cool"),
      sun: gl.getUniformLocation(program, "sun"),
      palette: gl.getUniformLocation(program, "palette"),
      fibers: gl.getUniformLocation(program, "fibers"),
    }

    // У эталона SRC_COLOR / ZERO: цвет поверхности возводится в квадрат
    // до размытия. Обычное альфа-смешивание заметно высветляет всю ленту.
    gl.blendFunc(gl.SRC_COLOR, gl.ZERO)

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)")

    let width = 0
    let height = 0
    let frame = 0
    let elapsed = 0
    let previous = 0
    let intro = 0
    let visible = true
    let skipFrame = false

    const resize = () => {
      // Плотность пикселей ограничена: на ретине вчетверо большее полотно
      // ради размытого фона — плата ни за что.
      const density = Math.min(window.devicePixelRatio || 1, 2)
      const nextWidth = Math.round(host.clientWidth * density)
      const nextHeight = Math.round(host.clientHeight * density)

      if (nextWidth === width && nextHeight === height) return

      width = nextWidth
      height = nextHeight
      canvas.width = width
      canvas.height = height
      gl.bindTexture(gl.TEXTURE_2D, sceneTexture)
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        width,
        height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
      )
      gl.bindRenderbuffer(gl.RENDERBUFFER, depth)
      gl.renderbufferStorage(
        gl.RENDERBUFFER,
        gl.DEPTH_COMPONENT16,
        width,
        height,
      )
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        sceneTexture,
        0,
      )
      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.DEPTH_ATTACHMENT,
        gl.RENDERBUFFER,
        depth,
      )
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, width, height)
    }

    const draw = (now: number) => {
      const current = settings.current

      frame = 0
      if (!paletteReady || document.hidden || !visible) return
      // Как у оригинала: один проход на два animation frame.
      if (!calm.matches && skipFrame) {
        skipFrame = false
        frame = requestAnimationFrame(draw)
        return
      }
      skipFrame = true
      if (previous && !calm.matches) {
        elapsed += now - previous
        intro = Math.min(1, intro + (now - previous) * 0.00048)
      }
      previous = now

      resize()

      if (width === 0 || height === 0) {
        frame = requestAnimationFrame(draw)

        return
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
      gl.useProgram(program)
      gl.bindVertexArray(array)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, palette)
      gl.uniform1i(uniforms.palette, 0)
      // В оригинале offset 17500 применяется дважды: исходное время 35000 ms.
      const phase =
        (35000 +
          (calm.matches
            ? 0
            : elapsed * intro * (60 / Math.max(10, current.speed)))) *
        0.00004
      gl.uniform1f(uniforms.time, phase)
      gl.uniformMatrix4fv(
        uniforms.camera,
        false,
        new Float32Array(cameraMatrix(width / height)),
      )
      gl.uniform2f(uniforms.resolution, width, height)
      gl.uniform1f(uniforms.amplitude, current.amplitude)
      gl.uniform1f(uniforms.twist, current.twist)
      // Углы и крутизна затухания у трёх поворотов разные: одинаковые дали бы
      // симметричный винт, а нужен один перехлёст со смещением.
      gl.uniform3f(uniforms.twistTurn, -0.65, 0.41, -0.58)
      gl.uniform3f(uniforms.twistFalloff, 3.63, 0.7, 3.95)
      // Композиция эталона без дополнительного поворота и сдвига.
      gl.uniform1f(uniforms.tilt, 0)
      gl.uniform2f(uniforms.shift, 0, 0)
      gl.uniform3fv(
        uniforms.accent,
        toRgb(current.accent, DEFAULTS.accent).map(
          (value, index) =>
            value - toRgb(DEFAULTS.accent, DEFAULTS.accent)[index],
        ),
      )
      gl.uniform3fv(
        uniforms.tint,
        toRgb(current.tint, DEFAULTS.tint).map(
          (value, index) => value - toRgb(DEFAULTS.tint, DEFAULTS.tint)[index],
        ),
      )
      gl.uniform3fv(
        uniforms.far,
        toRgb(current.far, DEFAULTS.far).map(
          (value, index) => value - toRgb(DEFAULTS.far, DEFAULTS.far)[index],
        ),
      )
      gl.uniform3fv(
        uniforms.cool,
        toRgb(current.cool, DEFAULTS.cool).map(
          (value, index) => value - toRgb(DEFAULTS.cool, DEFAULTS.cool)[index],
        ),
      )
      gl.uniform3fv(
        uniforms.sun,
        toRgb(current.sun, DEFAULTS.sun).map(
          (value, index) => value - toRgb(DEFAULTS.sun, DEFAULTS.sun)[index],
        ),
      )
      gl.uniform1f(uniforms.fibers, current.fibers ? 1 : 0)

      gl.clearColor(0, 0, 0, 0)
      gl.enable(gl.DEPTH_TEST)
      gl.depthFunc(gl.LEQUAL)
      gl.enable(gl.BLEND)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_INT, 0)

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.useProgram(postProgram)
      gl.bindVertexArray(null)
      gl.disable(gl.DEPTH_TEST)
      gl.disable(gl.BLEND)
      gl.bindTexture(gl.TEXTURE_2D, sceneTexture)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      host.dataset.drawn = "true"

      // Покой означает один кадр: полотно остаётся, движение прекращается.
      if (calm.matches || !visible) {
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

    document.addEventListener("visibilitychange", onVisibility)
    calm.addEventListener("change", run)

    const sizes = new ResizeObserver(() => {
      if (!frame) run()
    })

    sizes.observe(host)
    run()

    return () => {
      stop()
      watcher.disconnect()
      sizes.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      calm.removeEventListener("change", run)
      paletteImage.onload = null
      gl.deleteTexture(palette)
      gl.deleteTexture(sceneTexture)
      gl.deleteFramebuffer(framebuffer)
      gl.deleteRenderbuffer(depth)
      gl.deleteProgram(postProgram)
      gl.deleteShader(postVertex)
      gl.deleteShader(postFragment)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      gl.deleteBuffer(buffer)
      gl.deleteBuffer(elements)
      gl.deleteVertexArray(array)
    }
  }, [])

  return (
    <>
      <style href="vibeui-background-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={hostRef}
        data-vibeui-block="background-001"
        data-slot="ribbon-background"
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="fallback" />
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
    </>
  )
}
