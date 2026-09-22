"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"
import type { ComponentProps } from "react"

export type Surface009Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Темп течения: покой, спокойно или живо. */
  speed?: "still" | "calm" | "lively"
  /** Матовость стекла. */
  frost?: "clear" | "frosted"
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

// Жидкое стекло: под контентом стеклянная плита, которая преломляет живой
// фон — у кромок картинка изгибается, каналы расходятся хроматикой, по краю
// бежит блик. Геометрия плиты — DOM-элемент [data-part="ghost-slab"]: его прямо-
// угольник измеряется и уходит в шейдер, так контент и линза совпадают
// на любой ширине. Фон под стеклом — мягкие пятна той же палитры.
// Палитра живёт в CSS с light-dark и читается в шейдер через computed-цвета
// рамки холста, поэтому тема и accent работают одинаково для канваса и заглушки.
const STYLES = `
:where([data-vibeui-block="surface-009"]){
--vibeui-surface-009-c1:light-dark(#ffffff,#000000);
--vibeui-surface-009-c2:light-dark(#e6e6e6,#2b2b2b);
--vibeui-surface-009-c3:light-dark(#c9c9c9,#6b6b6b);
--vibeui-surface-009-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-surface-009-c4:var(--vibeui-surface-009-accent);
--vibeui-surface-009-ink:light-dark(#000000,#ffffff);
--vibeui-surface-009-ghost:light-dark(color-mix(in oklab,#000000 78%,transparent),color-mix(in oklab,#ffffff 82%,transparent));
--vibeui-surface-009-ghost-soft:light-dark(color-mix(in oklab,#000000 40%,transparent),color-mix(in oklab,#ffffff 45%,transparent));
--vibeui-surface-009-glass:light-dark(color-mix(in oklab,#ffffff 42%,transparent),color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-surface-009-edge:light-dark(color-mix(in oklab,#000000 10%,transparent),color-mix(in oklab,#ffffff 18%,transparent));
--vibeui-surface-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="surface-009"]{color-scheme:dark}
:where([data-vibeui-block="surface-009"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="surface-009"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="surface-009"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:var(--vibeui-surface-009-c1);color:var(--vibeui-surface-009-ink);
font-family:var(--vibeui-surface-009-font);
}
[data-vibeui-block="surface-009"] *{box-sizing:border-box}
[data-vibeui-block="surface-009"] [data-part="ghost"]{flex:1}
/* Заглушка того же характера: пока холст не ожил — и навсегда там, где
   нет WebGL 2, — те же цвета лежат мягкими пятнами. */
[data-vibeui-block="surface-009"] [data-part="still"]{
position:absolute;inset:0;pointer-events:none;
background:
radial-gradient(60% 70% at 18% 28%,var(--vibeui-surface-009-c2) 0%,transparent 70%),
radial-gradient(55% 60% at 82% 30%,var(--vibeui-surface-009-c3) 0%,transparent 70%),
radial-gradient(50% 45% at 50% 88%,var(--vibeui-surface-009-c4) 0%,transparent 70%),
var(--vibeui-surface-009-c1);
}
/* Рамка нулевой ширины несёт четыре цвета палитры: computed-значение
   border-color уже разрешило light-dark, шейдеру остаётся прочитать rgb. */
[data-vibeui-block="surface-009"] canvas{
position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;
border:0 solid transparent;
border-top-color:var(--vibeui-surface-009-c1);
border-right-color:var(--vibeui-surface-009-c2);
border-bottom-color:var(--vibeui-surface-009-c3);
border-left-color:var(--vibeui-surface-009-c4);
opacity:0;transition:opacity 0.8s ease;
}
[data-vibeui-block="surface-009"][data-drawn="true"] canvas{opacity:1}
[data-vibeui-block="surface-009"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:28rem;
padding:2rem clamp(1.5rem,6cqi,4rem);display:flex;flex-direction:column;
}
[data-vibeui-block="surface-009"] [data-part="ghost-slab"]{position:relative;margin:auto;width:min(40rem,100%);min-height:14rem;padding:2rem;display:flex;flex-direction:column;gap:1rem;justify-content:center;border-radius:1.25rem}
[data-vibeui-block="surface-009"] [data-part="ghost-slab"] span{height:1rem;border-radius:999px;background:var(--vibeui-surface-009-ghost);width:70%}
[data-vibeui-block="surface-009"] [data-part="ghost-slab"] span:nth-child(2){width:45%}
[data-vibeui-block="surface-009"] [data-part="ghost-slab"] span:nth-child(3){height:0.625rem;width:55%;background:var(--vibeui-surface-009-ghost-soft)}
[data-vibeui-block="surface-009"] [data-part="ghost-slab"] span:last-child{margin-top:1rem;width:7rem;height:2.5rem;border-radius:0.75rem;background:var(--vibeui-surface-009-ink)}
@container (min-width: 48rem){
[data-vibeui-block="surface-009"] [data-part="frame"]{min-height:34rem;padding-block:2.5rem 3rem}
[data-vibeui-block="surface-009"] [data-part="ghost-slab"]{min-height:16rem;padding:2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-009"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="surface-009"] [data-part="ghost"]{display:flex;flex-direction:column;flex:1;gap:2.5rem}
[data-vibeui-block="surface-009"] [data-part="ghost"] [data-part="nav"]{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="surface-009"] [data-part="ghost"] [data-part="mark"]{width:1.5rem;height:1.5rem;flex:none;border-radius:0.375rem;background:var(--vibeui-surface-009-ink)}
[data-vibeui-block="surface-009"] [data-part="ghost"] [data-part="nav"] span:not([data-part]){width:3rem;height:0.5rem;border-radius:999px;background:var(--vibeui-surface-009-ghost-soft)}
[data-vibeui-block="surface-009"] [data-part="ghost"] [data-part="nav"] span:last-child{margin-inline-start:auto;width:4.5rem;height:1.75rem;border-radius:0.5rem;background:var(--vibeui-surface-009-ink)}
[data-vibeui-block="surface-009"] [data-part="ghost"] [data-part="slab"]{position:relative;margin:auto;width:min(40rem,100%);min-height:14rem;padding:2rem;display:flex;flex-direction:column;gap:1rem;justify-content:center;border-radius:1.25rem}
[data-vibeui-block="surface-009"] [data-part="ghost"] [data-part="slab"] span{height:1rem;border-radius:999px;background:var(--vibeui-surface-009-ghost);width:70%}
[data-vibeui-block="surface-009"] [data-part="ghost"] [data-part="slab"] span:nth-child(2){width:45%}
[data-vibeui-block="surface-009"] [data-part="ghost"] [data-part="slab"] span:nth-child(3){height:0.625rem;width:55%;background:var(--vibeui-surface-009-ghost-soft)}
[data-vibeui-block="surface-009"] [data-part="ghost"] [data-part="slab"] span:last-child{margin-top:1rem;width:7rem;height:2.5rem;border-radius:0.75rem;background:var(--vibeui-surface-009-ink)}
@container (min-width: 48rem){
[data-vibeui-block="surface-009"] [data-part="ghost"] [data-part="slab"]{min-height:16rem;padding:2.5rem}
}
`

const VERTEX = `#version 300 es
void main(){
vec2 v=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));
gl_Position=vec4(v*2.-1.,0.,1.);
}`

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 resolution;uniform float time;uniform float p1;uniform float p2;uniform vec4 pane;
uniform vec3 c1;uniform vec3 c2;uniform vec3 c3;uniform vec3 c4;
out vec4 color;
vec3 bg(vec2 p,float t,float r){
vec3 col=c1;
col=mix(col,c2,smoothstep(1.2,0.,length(p-vec2(r*.25+.1*sin(t*.7),.6+.1*cos(t*.5)))));
col=mix(col,c3,smoothstep(1.,0.,length(p-vec2(r*.75+.12*cos(t*.6),.35+.1*sin(t*.8)))));
col=mix(col,c4,smoothstep(.9,0.,length(p-vec2(r*.5+.2*sin(t*.4),.85+.1*cos(t*.9))))*.85*p2);
return col;
}
float rrect(vec2 q,vec2 b,float rad){vec2 d=abs(q)-b+rad;return length(max(d,0.))+min(max(d.x,d.y),0.)-rad;}
void main(){
float r=resolution.x/resolution.y;
vec2 px=gl_FragCoord.xy;
vec2 p=px/resolution;p.x*=r;
float t=time*.3;
vec3 col=bg(p,t,r);
if(pane.z>0.){
vec2 hb=pane.zw*.5;
vec2 q=px-(pane.xy+hb);
float sd=rrect(q,hb,min(pane.z,pane.w)*.12);
if(sd<0.){
float lens=pane.w*.24;
float bend=1.-smoothstep(0.,lens,-sd);
vec2 dir=q/max(hb,vec2(1.));
dir=normalize(dir+vec2(1e-4));
vec2 off=dir*bend*bend*lens*.9/resolution.y;
vec3 rr=bg(p-off*1.08,t,r);vec3 gg=bg(p-off,t,r);vec3 bb=bg(p-off*.92,t,r);
vec3 refr=vec3(rr.r,gg.g,bb.b);
float s=.03;
vec3 blur=(bg(p+vec2(s,0.),t,r)+bg(p-vec2(s,0.),t,r)+bg(p+vec2(0.,s),t,r)+bg(p-vec2(0.,s),t,r))*.25;
refr=mix(refr,blur,p1);
col=mix(refr,mix(c1,c3,.5),.16);
float rim=exp(-(-sd)/(pane.w*.035));
float side=.5+.5*dot(normalize(q),vec2(-.6,.8));
col+=vec3(1.)*(rim*side*.42+rim*.08);
}
}
col+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5)/255.;
color=vec4(col,1.);
}`

const SPEEDS = { still: 0, calm: 1, lively: 2.4 } as const
const INTENSITIES = { faint: 0.3, soft: 0.55, bright: 1 } as const
const FROSTS = { clear: 0.25, frosted: 0.7 } as const

type GhostProps = Omit<ComponentProps<"div">, "title" | "children"> & {
  slabRef?: ComponentProps<"div">["ref"]
  accent?: string
  className?: string
  style?: CSSProperties
}

function Ghost({
  slabRef,
  accent,
  className,
  style,
  ...props
}: GhostProps) {
  const palette = {
    ...(accent ? { "--vibeui-surface-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <div
        {...props} aria-hidden="true"
        className={className}
        style={palette}
      >
        <div data-part="nav">
          <span data-part="mark" />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div data-part="slab" ref={slabRef}>
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
  )
}

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

/** Жидкое стекло: живой фон на WebGL2, один файл, ноль зависимостей. */
export function Surface009({
  children,
  speed = "calm",
  frost = "clear",
  intensity = "soft",
  tone = "auto",
  accent,
  colors,
  className,
  style,
}: Surface009Props) {
  const host = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const slabRef = useRef<HTMLDivElement>(null)
  // Настройки читаются на каждом кадре, поэтому живут в ref: пересобирать
  // сцену ради смены темпа незачем.
  const settings = useRef({
    speed: SPEEDS[speed],
    p1: FROSTS[frost],
    p2: INTENSITIES[intensity],
  })
  // Палитра перечитывается по сигналу: смена темы, accent или colors.
  const paletteDirty = useRef(true)
  // Запуск кадров снаружи эффекта: после «still» цикл стоит, его надо будить.
  const wake = useRef<() => void>(() => {})

  useEffect(() => {
    settings.current = {
      speed: SPEEDS[speed] ?? 1,
      p1: FROSTS[frost] ?? 0.25,
      p2: INTENSITIES[intensity] ?? 0.55,
    }
    wake.current()
  }, [speed, frost, intensity])

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
      ratio = Math.min(1, window.devicePixelRatio || 1)

      const nextWidth = Math.max(1, Math.round(section.clientWidth * ratio))
      const nextHeight = Math.max(1, Math.round(section.clientHeight * ratio))

      if (nextWidth === width && nextHeight === height) return

      width = nextWidth
      height = nextHeight
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
    }

    // Прямоугольник плиты в пикселях холста, начало координат — левый нижний
    // угол, как у gl_FragCoord. Без плиты (свой контент вне неё) линзы нет.
    const measurePane = () => {
      const slab = slabRef.current

      if (!slab) {
        gl.uniform4f(uniforms.pane, 0, 0, 0, 0)

        return
      }

      const box = section.getBoundingClientRect()
      const rect = slab.getBoundingClientRect()

      gl.uniform4f(
        uniforms.pane,
        (rect.left - box.left) * ratio,
        (box.bottom - rect.bottom) * ratio,
        rect.width * ratio,
        rect.height * ratio,
      )
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
      gl.uniform1f(uniforms.p1, current.p1)
      gl.uniform1f(uniforms.p2, current.p2)
      measurePane()
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
    ...(accent ? { "--vibeui-surface-009-accent": accent } : null),
    ...(colors
      ? {
          "--vibeui-surface-009-c1": colors[0],
          "--vibeui-surface-009-c2": colors[1],
          "--vibeui-surface-009-c3": colors[2],
          "--vibeui-surface-009-c4": colors[3],
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-009" precedence="medium">
        {STYLES}
      </style>
      <section
        ref={host}
        data-vibeui-block="surface-009"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="still" aria-hidden="true" />
        <canvas ref={canvasRef} aria-hidden="true" />
        <div data-part="frame">
          {children ? (
            <div data-part="ghost-slab" ref={slabRef}>
              {children}
            </div>
          ) : (
            <Ghost data-part="ghost" slabRef={slabRef} accent={accent} />
          )}
        </div>
      </section>
    </>
  )
}
