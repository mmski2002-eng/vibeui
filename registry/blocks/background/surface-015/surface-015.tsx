"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { Mockup010 } from "@/registry/components/mockup/mockup-010/mockup-010"

export type Surface015Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Темп течения: покой, спокойно или живо. */
  speed?: "still" | "calm" | "lively"
  /** Частота перелива. */
  shimmer?: "wide" | "tight"
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

// Перламутровая фольга: складчатое поле с нормалью, а цвет — не радуга, а
// циклический переход по трём тонам палитры в зависимости от угла между
// нормалью и взглядом. Так голографический перелив остаётся в бренде:
// с чернильным акцентом это перламутр, с цветным — фольга этого цвета.
// Палитра живёт в CSS с light-dark и читается в шейдер через computed-цвета
// рамки холста, поэтому тема и accent работают одинаково для канваса и заглушки.
const STYLES = `
:where([data-vibeui-block="surface-015"]){
--vibeui-surface-015-c1:light-dark(#d9d9d9,#000000);
--vibeui-surface-015-c2:light-dark(#ffffff,#2a2a2a);
--vibeui-surface-015-c3:light-dark(#bfbfbf,#8c8c8c);
--vibeui-surface-015-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-surface-015-c4:var(--vibeui-surface-015-accent);
--vibeui-surface-015-ink:light-dark(#000000,#ffffff);
--vibeui-surface-015-ghost:light-dark(color-mix(in oklab,#000000 78%,transparent),color-mix(in oklab,#ffffff 82%,transparent));
--vibeui-surface-015-ghost-soft:light-dark(color-mix(in oklab,#000000 40%,transparent),color-mix(in oklab,#ffffff 45%,transparent));
--vibeui-surface-015-glass:light-dark(color-mix(in oklab,#ffffff 42%,transparent),color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-surface-015-edge:light-dark(color-mix(in oklab,#000000 10%,transparent),color-mix(in oklab,#ffffff 18%,transparent));
--vibeui-surface-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="surface-015"]{color-scheme:dark}
:where([data-vibeui-block="surface-015"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="surface-015"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="surface-015"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:var(--vibeui-surface-015-c1);color:var(--vibeui-surface-015-ink);
font-family:var(--vibeui-surface-015-font);
}
[data-vibeui-block="surface-015"] *{box-sizing:border-box}
[data-vibeui-block="surface-015"] [data-part="ghost"]{flex:1}
/* Заглушка того же характера: пока холст не ожил — и навсегда там, где
   нет WebGL 2, — те же цвета лежат мягкими пятнами. */
[data-vibeui-block="surface-015"] [data-part="still"]{
position:absolute;inset:0;pointer-events:none;
background:
radial-gradient(60% 70% at 18% 28%,var(--vibeui-surface-015-c2) 0%,transparent 70%),
radial-gradient(55% 60% at 82% 30%,var(--vibeui-surface-015-c3) 0%,transparent 70%),
radial-gradient(50% 45% at 50% 88%,var(--vibeui-surface-015-c4) 0%,transparent 70%),
var(--vibeui-surface-015-c1);
}
/* Рамка нулевой ширины несёт четыре цвета палитры: computed-значение
   border-color уже разрешило light-dark, шейдеру остаётся прочитать rgb. */
[data-vibeui-block="surface-015"] canvas{
position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;
border:0 solid transparent;
border-top-color:var(--vibeui-surface-015-c1);
border-right-color:var(--vibeui-surface-015-c2);
border-bottom-color:var(--vibeui-surface-015-c3);
border-left-color:var(--vibeui-surface-015-c4);
opacity:0;transition:opacity 0.8s ease;
}
[data-vibeui-block="surface-015"][data-drawn="true"] canvas{opacity:1}
[data-vibeui-block="surface-015"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:28rem;
padding:2rem clamp(1.5rem,6cqi,4rem);display:flex;flex-direction:column;
}
@container (min-width: 48rem){
[data-vibeui-block="surface-015"] [data-part="frame"]{min-height:34rem;padding-block:2.5rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-015"] *{animation:none!important;transition:none!important}}
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
uniform vec2 mouse;uniform float mouseOn;uniform float scroll;uniform vec3 drops[8];uniform sampler2D tex;uniform vec2 texSize;
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
float field(vec2 p,float t){
vec2 w=p;
for(int i=0;i<3;i++){float f=float(i);w+=.4*vec2(sin(w.y*1.2+t*.6+f*1.9),cos(w.x*1.-t*.4+f*1.3));}
return .5*sin(w.x*1.3+t)+.5*cos(w.y*1.1-t*.5)+.3*snoise(w*.9+t*.15);
}
void main(){
float r=resolution.x/resolution.y;
vec2 p=gl_FragCoord.xy/resolution;p.x*=r;
p*=2.*max(1.,1.2/r);
float t=time*.15;
float e=.01;
float h=field(p,t);
float gx=(field(p+vec2(e,0.),t)-h)/e;
float gy=(field(p+vec2(0.,e),t)-h)/e;
vec3 n=normalize(vec3(-gx*.4,-gy*.4,1.));
vec3 v=vec3(0.,0.,1.);
vec3 l=normalize(vec3(-.4,.7,.6));
float a=dot(n,v);
float band=fract(a*p1+p.x*.15+t*.2);
float w1=.5+.5*cos(6.2832*band);
float w2=.5+.5*cos(6.2832*band-2.094);
float w3=(.5+.5*cos(6.2832*band-4.189))*p2;
vec3 iri=(c2*w1+c3*w2+c4*w3)/max(w1+w2+w3,1e-3);
float diff=.5+.5*dot(n,l);
float spec=pow(max(dot(reflect(-l,n),v),0.),30.);
vec3 col=mix(c1,iri,(.3+.45*diff)*mix(.6,1.,p2));
col+=c4*spec*.35*p2;
col+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5)/255.;
color=vec4(col,1.);
}`

const SPEEDS = { still: 0, calm: 1, lively: 2.4 } as const
const INTENSITIES = { faint: 0.3, soft: 0.55, bright: 1 } as const
const SHIMMERS = { wide: 2.5, tight: 5 } as const

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

/** Перламутровая фольга: живой фон на WebGL2, один файл, ноль зависимостей. */
export function Surface015({
  children,
  speed = "calm",
  shimmer = "wide",
  intensity = "soft",
  tone = "auto",
  accent,
  colors,
  className,
  style,
}: Surface015Props) {
  const host = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Настройки читаются на каждом кадре, поэтому живут в ref: пересобирать
  // сцену ради смены темпа незачем.
  const settings = useRef({
    speed: SPEEDS[speed],
    p1: SHIMMERS[shimmer],
    p2: INTENSITIES[intensity],
  })
  // Палитра перечитывается по сигналу: смена темы, accent или colors.
  const paletteDirty = useRef(true)
  // Запуск кадров снаружи эффекта: после «still» цикл стоит, его надо будить.
  const wake = useRef<() => void>(() => {})

  useEffect(() => {
    settings.current = {
      speed: SPEEDS[speed] ?? 1,
      p1: SHIMMERS[shimmer] ?? 2.5,
      p2: INTENSITIES[intensity] ?? 0.55,
    }
    wake.current()
  }, [speed, shimmer, intensity])

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
      mouse: gl.getUniformLocation(program, "mouse"),
      mouseOn: gl.getUniformLocation(program, "mouseOn"),
      scroll: gl.getUniformLocation(program, "scroll"),
      drops: gl.getUniformLocation(program, "drops"),
      tex: gl.getUniformLocation(program, "tex"),
      texSize: gl.getUniformLocation(program, "texSize"),
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
      ratio = Math.min(1, window.devicePixelRatio || 1) * 0.75

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
      gl.uniform1f(uniforms.p1, current.p1)
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
    ...(accent ? { "--vibeui-surface-015-accent": accent } : null),
    ...(colors
      ? {
          "--vibeui-surface-015-c1": colors[0],
          "--vibeui-surface-015-c2": colors[1],
          "--vibeui-surface-015-c3": colors[2],
          "--vibeui-surface-015-c4": colors[3],
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-015" precedence="medium">
        {STYLES}
      </style>
      <section
        ref={host}
        data-vibeui-block="surface-015"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="still" aria-hidden="true" />
        <canvas ref={canvasRef} aria-hidden="true" />
        <div data-part="frame">
          {children ?? (
            <Mockup010 data-part="ghost"  accent={accent} />
          )}
        </div>
      </section>
    </>
  )
}
