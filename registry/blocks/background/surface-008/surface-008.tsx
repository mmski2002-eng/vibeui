"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"

export type Surface008Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Темп течения: покой, спокойно или живо. */
  speed?: "still" | "calm" | "lively"
  /** Шаг сетки. */
  pitch?: "tight" | "wide"
  /** Сила акцента: едва заметный, спокойный или яркий. */
  intensity?: "faint" | "soft" | "bright"
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  /** Акцентный цвет палитры. */
  accent?: string
  /** Своя палитра четырёх цветов в hex; без неё — база темы плюс accent. */
  colors?: readonly [string, string, string, string]
  className?: string
  style?: CSSProperties
}

// Точечная матрица: регулярная сетка точек, чей размер дышит по волне от
// центра и по шуму — как LED-панель или вычислительное поле. Точки считаются
// в шейдере по ячейкам, DOM не участвует; шаг задаётся в CSS-пикселях и
// пересчитывается в холст по DPR, чтобы сетка не плыла между экранами.
// Палитра живёт в CSS с light-dark и читается в шейдер через computed-цвета
// рамки холста, поэтому тема и accent работают одинаково для канваса и заглушки.
const STYLES = `
:where([data-vibeui-block="surface-008"]){
--vibeui-surface-008-c1:light-dark(#ffffff,#000000);
--vibeui-surface-008-c2:light-dark(#f2f2f2,#1a1a1a);
--vibeui-surface-008-c3:light-dark(#d9d9d9,#444444);
--vibeui-surface-008-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-surface-008-c4:var(--vibeui-surface-008-accent);
--vibeui-surface-008-ink:light-dark(#000000,#ffffff);
--vibeui-surface-008-ghost:light-dark(color-mix(in oklab,#000000 78%,transparent),color-mix(in oklab,#ffffff 82%,transparent));
--vibeui-surface-008-ghost-soft:light-dark(color-mix(in oklab,#000000 40%,transparent),color-mix(in oklab,#ffffff 45%,transparent));
--vibeui-surface-008-glass:light-dark(color-mix(in oklab,#ffffff 42%,transparent),color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-surface-008-edge:light-dark(color-mix(in oklab,#000000 10%,transparent),color-mix(in oklab,#ffffff 18%,transparent));
--vibeui-surface-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="surface-008"]{color-scheme:dark}
:where([data-vibeui-block="surface-008"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="surface-008"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="surface-008"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:var(--vibeui-surface-008-c1);color:var(--vibeui-surface-008-ink);
font-family:var(--vibeui-surface-008-font);
}
[data-vibeui-block="surface-008"] *{box-sizing:border-box}
/* Заглушка того же характера: пока холст не ожил — и навсегда там, где
   нет WebGL 2, — те же цвета лежат мягкими пятнами. */
[data-vibeui-block="surface-008"] [data-part="still"]{
position:absolute;inset:0;pointer-events:none;
background:
radial-gradient(60% 70% at 18% 28%,var(--vibeui-surface-008-c2) 0%,transparent 70%),
radial-gradient(55% 60% at 82% 30%,var(--vibeui-surface-008-c3) 0%,transparent 70%),
radial-gradient(50% 45% at 50% 88%,var(--vibeui-surface-008-c4) 0%,transparent 70%),
var(--vibeui-surface-008-c1);
}
/* Рамка нулевой ширины несёт четыре цвета палитры: computed-значение
   border-color уже разрешило light-dark, шейдеру остаётся прочитать rgb. */
[data-vibeui-block="surface-008"] canvas{
position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;
border:0 solid transparent;
border-top-color:var(--vibeui-surface-008-c1);
border-right-color:var(--vibeui-surface-008-c2);
border-bottom-color:var(--vibeui-surface-008-c3);
border-left-color:var(--vibeui-surface-008-c4);
opacity:0;transition:opacity 0.8s ease;
}
[data-vibeui-block="surface-008"][data-drawn="true"] canvas{opacity:1}
[data-vibeui-block="surface-008"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:28rem;
padding:2rem clamp(1.5rem,6cqi,4rem);display:flex;flex-direction:column;
}
/* Призрак страницы: шапка, заголовок и ряд стеклянных карточек — на живом
   фоне стекло показывает, что он действительно течёт под контентом. */
[data-vibeui-block="surface-008"] [data-part="ghost"]{display:flex;flex-direction:column;flex:1;gap:3rem}
[data-vibeui-block="surface-008"] [data-part="nav"]{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="surface-008"] [data-part="mark"]{width:1.5rem;height:1.5rem;flex:none;border-radius:0.375rem;background:var(--vibeui-surface-008-ink)}
[data-vibeui-block="surface-008"] [data-part="nav"] span:not([data-part]){width:3rem;height:0.5rem;border-radius:999px;background:var(--vibeui-surface-008-ghost-soft)}
[data-vibeui-block="surface-008"] [data-part="nav"] span:last-child{margin-inline-start:auto;width:4.5rem;height:1.75rem;border-radius:0.5rem;background:var(--vibeui-surface-008-ink)}
[data-vibeui-block="surface-008"] [data-part="title"]{display:flex;flex-direction:column;gap:0.875rem;max-width:36rem}
[data-vibeui-block="surface-008"] [data-part="title"] span{height:1.25rem;border-radius:999px;background:var(--vibeui-surface-008-ghost);width:90%}
[data-vibeui-block="surface-008"] [data-part="title"] span:nth-child(2){width:62%}
[data-vibeui-block="surface-008"] [data-part="title"] span:nth-child(3){height:0.625rem;width:48%;background:var(--vibeui-surface-008-ghost-soft);margin-top:0.5rem}
[data-vibeui-block="surface-008"] [data-part="cards"]{margin-top:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
[data-vibeui-block="surface-008"] [data-part="cards"] span{height:6.5rem;border-radius:1rem;background:var(--vibeui-surface-008-glass);border:1px solid var(--vibeui-surface-008-edge);-webkit-backdrop-filter:blur(18px) saturate(1.2);backdrop-filter:blur(18px) saturate(1.2)}
[data-vibeui-block="surface-008"] [data-part="cards"] span:last-child{display:none}
@container (min-width: 48rem){
[data-vibeui-block="surface-008"] [data-part="frame"]{min-height:34rem;padding-block:2.5rem 3rem}
[data-vibeui-block="surface-008"] [data-part="cards"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="surface-008"] [data-part="cards"] span:last-child{display:block}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-008"] *{animation:none!important;transition:none!important}}
`

const VERTEX = `#version 300 es
void main(){
vec2 v=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));
gl_Position=vec4(v*2.-1.,0.,1.);
}`

// Simplex-шум — Ashima Arts / Stefan Gustavson (MIT).
const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 resolution;uniform float time;uniform float p1;uniform float p2;uniform vec4 pane;
uniform vec3 c1;uniform vec3 c2;uniform vec3 c3;uniform vec3 c4;
out vec4 color;
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
float snoise(vec2 v){
const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);
vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);m=m*m;m=m*m;
vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;
m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
return 130.*dot(m,g);}
void main(){
float r=resolution.x/resolution.y;
float t=time*.4;
vec2 g=gl_FragCoord.xy/p1;
vec2 cell=floor(g);vec2 f=fract(g)-.5;
vec2 cp=(cell+.5)*p1/resolution;cp.x*=r;
float wave=.5+.5*sin(length(cp-vec2(r*.5,.5))*4.-t*1.5);
float n=.5+.5*snoise(cp*2.+t*.3);
float a=wave*.6+n*.4;
float rad=mix(.05,mix(.22,.32,p2),a);
float d=length(f);
float dot=smoothstep(rad+.08,rad-.08,d);
vec3 col=mix(c1,mix(c3,c4,a*a),dot*mix(.35,1.,a)*mix(.6,1.,p2));
color=vec4(col,1.);
}`

const SPEEDS = { still: 0, calm: 1, lively: 2.4 } as const
const INTENSITIES = { faint: 0.3, soft: 0.55, bright: 1 } as const
const PITCHS = { tight: 14, wide: 22 } as const

/** Цвет из computed-style ("rgb(r, g, b)") → три числа 0…1. */
function toRgb(value: string, fallback: [number, number, number]) {
  const match = /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(value)

  if (!match) return fallback

  return [
    Number(match[1]) / 255,
    Number(match[2]) / 255,
    Number(match[3]) / 255,
  ] as [number, number, number]
}

function compile(gl: WebGL2RenderingContext, kind: number, source: string) {
  const shader = gl.createShader(kind)

  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // Шейдер не собрался — остаётся CSS-заглушка; причину видно в консоли.
    console.warn("vibeui: шейдер не скомпилировался", gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)

    return null
  }

  return shader
}

/** Точечная матрица: живой фон на WebGL2, один файл, ноль зависимостей. */
export function Surface008({
  children,
  speed = "calm",
  pitch = "tight",
  intensity = "soft",
  tone = "auto",
  accent,
  colors,
  className,
  style,
}: Surface008Props) {
  const host = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Настройки читаются на каждом кадре, поэтому живут в ref: пересобирать
  // сцену ради смены темпа незачем.
  const settings = useRef({
    speed: SPEEDS[speed],
    p1: PITCHS[pitch],
    p2: INTENSITIES[intensity],
  })
  // Палитра перечитывается по сигналу: смена темы, accent или colors.
  const paletteDirty = useRef(true)
  // Запуск кадров снаружи эффекта: после «still» цикл стоит, его надо будить.
  const wake = useRef<() => void>(() => {})

  useEffect(() => {
    settings.current = {
      speed: SPEEDS[speed] ?? 1,
      p1: PITCHS[pitch] ?? 14,
      p2: INTENSITIES[intensity] ?? 0.55,
    }
    wake.current()
  }, [speed, pitch, intensity])

  useEffect(() => {
    paletteDirty.current = true
    wake.current()
  }, [tone, accent, colors])

  useEffect(() => {
    const section = host.current
    const canvas = canvasRef.current

    if (!section || !canvas) return

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
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
      p1: gl.getUniformLocation(program, "p1"),
      p2: gl.getUniformLocation(program, "p2"),
      pane: gl.getUniformLocation(program, "pane"),
      c1: gl.getUniformLocation(program, "c1"),
      c2: gl.getUniformLocation(program, "c2"),
      c3: gl.getUniformLocation(program, "c3"),
      c4: gl.getUniformLocation(program, "c4"),
    }

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)")
    const scheme = window.matchMedia("(prefers-color-scheme: dark)")

    let frame = 0
    let previous = 0
    let elapsed = 0
    let visible = true
    let width = 0
    let height = 0
    let ratio = 1

    const readPalette = () => {
      const computed = getComputedStyle(canvas)

      gl.uniform3fv(uniforms.c1, toRgb(computed.borderTopColor, [0, 0, 0]))
      gl.uniform3fv(uniforms.c2, toRgb(computed.borderRightColor, [0.1, 0.1, 0.1]))
      gl.uniform3fv(uniforms.c3, toRgb(computed.borderBottomColor, [0.4, 0.4, 0.4]))
      gl.uniform3fv(uniforms.c4, toRgb(computed.borderLeftColor, [0.95, 0.95, 0.95]))
      paletteDirty.current = false
    }

    const resize = () => {
      ratio = Math.min(1.5, window.devicePixelRatio || 1)

      const nextWidth = Math.max(1, Math.round(section.clientWidth * ratio))
      const nextHeight = Math.max(1, Math.round(section.clientHeight * ratio))

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
        elapsed += (now - previous) * 0.001 * current.speed
      }

      previous = now

      resize()

      if (paletteDirty.current) readPalette()

      gl.uniform2f(uniforms.resolution, width, height)
      gl.uniform1f(uniforms.time, elapsed)
      gl.uniform1f(uniforms.p1, current.p1 * ratio)
      gl.uniform1f(uniforms.p2, current.p2)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      section.dataset.drawn = "true"

      // Покой и темп «still» — один кадр: картинка есть, кадры не крутятся.
      if (calm.matches || current.speed === 0) {
        previous = 0

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

    const repaint = () => {
      paletteDirty.current = true
      run()
    }

    wake.current = run

    // Фон за пределами экрана и во вкладке в фоне не рисуется: он там никому
    // не виден, а батарею тратит.
    const watcher = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting)

      if (visible) run()
      else stop()
    })

    watcher.observe(section)

    const onVisibility = () => {
      if (document.hidden) stop()
      else if (visible) run()
    }

    const sizes = new ResizeObserver(run)

    sizes.observe(section)

    // Классовая тёмная тема переключается на <html>: ловим её, чтобы
    // перечитать палитру, иначе холст останется в прошлой теме.
    const themes = new MutationObserver(repaint)

    themes.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    })

    document.addEventListener("visibilitychange", onVisibility)
    calm.addEventListener("change", run)
    scheme.addEventListener("change", repaint)
    run()

    return () => {
      stop()
      wake.current = () => {}
      watcher.disconnect()
      sizes.disconnect()
      themes.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      calm.removeEventListener("change", run)
      scheme.removeEventListener("change", repaint)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-surface-008-accent": accent } : null),
    ...(colors
      ? {
          "--vibeui-surface-008-c1": colors[0],
          "--vibeui-surface-008-c2": colors[1],
          "--vibeui-surface-008-c3": colors[2],
          "--vibeui-surface-008-c4": colors[3],
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-008" precedence="medium">
        {STYLES}
      </style>
      <section
        ref={host}
        data-vibeui-block="surface-008"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="still" aria-hidden="true" />
        <canvas ref={canvasRef} aria-hidden="true" />
        <div data-part="frame">
          {children ?? (
            <div data-part="ghost" aria-hidden="true">
              <div data-part="nav">
                <span data-part="mark" />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div data-part="title">
                <span />
                <span />
                <span />
              </div>
              <div data-part="cards">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
