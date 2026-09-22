"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { Mockup010 } from "@/registry/components/mockup/mockup-010/mockup-010"

export type Surface004Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Темп течения: покой, спокойно или живо. */
  speed?: "still" | "calm" | "lively"
  /** Сила искажения — насколько сильно пятна закручиваются друг в друга. */
  warp?: "soft" | "strong"
  /** Сила акцента: едва заметный, спокойный или яркий. */
  intensity?: "faint" | "soft" | "bright"
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  /** Цвет четвёртого, акцентного пятна. */
  accent?: string
  /** Своя палитра четырёх пятен в hex; без неё — база темы плюс accent. */
  colors?: readonly [string, string, string, string]
  className?: string
  style?: CSSProperties
}

// Mesh-градиент: четыре цветовых пятна медленно плывут по полю, а поле
// перед смешением искажается шумом — так получается шёлк, а не четыре
// круга. Считает видеокарта в полразрешения: градиент гладкий, лишние
// пиксели ему не нужны, слабой машине — тем более. Палитра живёт в CSS
// с light-dark и читается в шейдер через computed-цвета рамки холста,
// поэтому тема и accent работают одинаково для канваса и для заглушки.
const STYLES = `
:where([data-vibeui-block="surface-004"]){
--vibeui-surface-004-c1:light-dark(#ffffff,#000000);
--vibeui-surface-004-c2:light-dark(#f2f2f2,#1a1a1a);
--vibeui-surface-004-c3:light-dark(#d9d9d9,#8c8c8c);
--vibeui-surface-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-surface-004-c4:var(--vibeui-surface-004-accent);
--vibeui-surface-004-ink:light-dark(#000000,#ffffff);
--vibeui-surface-004-ghost:light-dark(color-mix(in oklab,#000000 78%,transparent),color-mix(in oklab,#ffffff 82%,transparent));
--vibeui-surface-004-ghost-soft:light-dark(color-mix(in oklab,#000000 40%,transparent),color-mix(in oklab,#ffffff 45%,transparent));
--vibeui-surface-004-glass:light-dark(color-mix(in oklab,#ffffff 42%,transparent),color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-surface-004-edge:light-dark(color-mix(in oklab,#000000 10%,transparent),color-mix(in oklab,#ffffff 18%,transparent));
--vibeui-surface-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="surface-004"]{color-scheme:dark}
:where([data-vibeui-block="surface-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="surface-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="surface-004"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:var(--vibeui-surface-004-c2);color:var(--vibeui-surface-004-ink);
font-family:var(--vibeui-surface-004-font);
}
[data-vibeui-block="surface-004"] *{box-sizing:border-box}
[data-vibeui-block="surface-004"] [data-part="ghost"]{flex:1}
/* Заглушка того же характера: пока холст не ожил — и навсегда там, где
   нет WebGL 2, — те же четыре цвета лежат мягкими пятнами. */
[data-vibeui-block="surface-004"] [data-part="still"]{
position:absolute;inset:0;pointer-events:none;
background:
radial-gradient(60% 70% at 18% 28%,var(--vibeui-surface-004-c1) 0%,transparent 70%),
radial-gradient(55% 60% at 82% 30%,var(--vibeui-surface-004-c3) 0%,transparent 70%),
radial-gradient(60% 55% at 50% 88%,var(--vibeui-surface-004-c4) 0%,transparent 70%),
radial-gradient(70% 70% at 15% 85%,var(--vibeui-surface-004-c2) 0%,transparent 70%),
var(--vibeui-surface-004-c2);
}
/* Рамка нулевой ширины несёт четыре цвета палитры: computed-значение
   border-color уже разрешило light-dark, шейдеру остаётся прочитать rgb. */
[data-vibeui-block="surface-004"] canvas{
position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;
border:0 solid transparent;
border-top-color:var(--vibeui-surface-004-c1);
border-right-color:var(--vibeui-surface-004-c2);
border-bottom-color:var(--vibeui-surface-004-c3);
border-left-color:var(--vibeui-surface-004-c4);
opacity:0;transition:opacity 0.8s ease;
}
[data-vibeui-block="surface-004"][data-drawn="true"] canvas{opacity:1}
[data-vibeui-block="surface-004"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:28rem;
padding:2rem clamp(1.5rem,6cqi,4rem);display:flex;flex-direction:column;
}
@container (min-width: 48rem){
[data-vibeui-block="surface-004"] [data-part="frame"]{min-height:34rem;padding-block:2.5rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-004"] *{animation:none!important;transition:none!important}}
`

const VERTEX = `#version 300 es
void main(){
vec2 v=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));
gl_Position=vec4(v*2.-1.,0.,1.);
}`

// Поле трижды складывается синусоидами — так получаются шёлковые складки,
// а не облака. Высота поля выбирает цвет из трёх базовых, нормаль по
// конечным разностям даёт свет и блик четвёртым цветом — ткань, не блюр.
// Simplex-шум — Ashima Arts / Stefan Gustavson (MIT), лишь чуть рябит волны.
const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 resolution;uniform float time;uniform float warp;uniform float power;
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
float field(vec2 p,float t,float warp,float zoom){
vec2 w=p*zoom;
for(int i=0;i<3;i++){float f=float(i);w+=warp*.5*vec2(sin(w.y*.9+t*.8+f*1.7),cos(w.x*.8-t*.6+f*2.3));}
return .5*sin(w.x*.9+t)+.5*cos(w.y*1.1-t*.7)+.4*snoise(w*.5+t*.3);
}
void main(){
float r=resolution.x/resolution.y;
vec2 p=gl_FragCoord.xy/resolution;p.x*=r;
float t=time*.18;
float e=.012;
float zoom=2.4*max(1.,1.2/r);
float h=field(p,t,warp,zoom);
float gx=(field(p+vec2(e,0.),t,warp,zoom)-h)/e;
float gy=(field(p+vec2(0.,e),t,warp,zoom)-h)/e;
vec3 n=normalize(vec3(-gx*.22,-gy*.22,1.));
vec3 l=normalize(vec3(-.45,.7,.6));
float diff=dot(n,l)*.5+.5;
float spec=pow(max(dot(reflect(-l,n),vec3(0.,0.,1.)),0.),7.);
float k=clamp(h*.5+.5,0.,1.);
vec3 col=mix(mix(c1,c2,smoothstep(0.,.5,k)),c3,smoothstep(.5,1.,k));
float lum=dot(c1,vec3(.299,.587,.114));
col=mix(col,c4,smoothstep(.68,1.,k)*mix(.8,.6,lum)*power);
col=col*mix(.4+.6*diff,.82+.22*diff,lum)+c4*spec*mix(.2,.1,lum)*power;
col+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5)/255.;
color=vec4(col,1.);
}`

const SPEEDS = { still: 0, calm: 1, lively: 2.4 } as const
const WARPS = { soft: 0.6, strong: 1.1 } as const
const INTENSITIES = { faint: 0.3, soft: 0.55, bright: 1 } as const

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

/** Живой mesh-градиент: четыре пятна плывут по искажённому шумом полю. */
export function Surface004({
  children,
  speed = "calm",
  warp = "soft",
  intensity = "soft",
  tone = "auto",
  accent,
  colors,
  className,
  style,
}: Surface004Props) {
  const host = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Настройки читаются на каждом кадре, поэтому живут в ref: пересобирать
  // сцену ради смены темпа незачем.
  const settings = useRef({
    speed: SPEEDS[speed],
    warp: WARPS[warp],
    power: INTENSITIES[intensity],
  })
  // Палитра перечитывается по сигналу: смена темы, accent или colors.
  const paletteDirty = useRef(true)
  // Запуск кадров снаружи эффекта: после «still» цикл стоит, его надо будить.
  const wake = useRef<() => void>(() => {})

  useEffect(() => {
    settings.current = {
      speed: SPEEDS[speed] ?? 1,
      warp: WARPS[warp] ?? 0.6,
      power: INTENSITIES[intensity] ?? 0.55,
    }
    wake.current()
  }, [speed, warp, intensity])

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
      warp: gl.getUniformLocation(program, "warp"),
      power: gl.getUniformLocation(program, "power"),
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

    const readPalette = () => {
      const computed = getComputedStyle(canvas)

      gl.uniform3fv(uniforms.c1, toRgb(computed.borderTopColor, [1, 1, 1]))
      gl.uniform3fv(uniforms.c2, toRgb(computed.borderRightColor, [0.95, 0.95, 0.95]))
      gl.uniform3fv(uniforms.c3, toRgb(computed.borderBottomColor, [0.85, 0.85, 0.85]))
      gl.uniform3fv(uniforms.c4, toRgb(computed.borderLeftColor, [0.1, 0.1, 0.1]))
      paletteDirty.current = false
    }

    const resize = () => {
      // Гладкому градиенту хватает половины пикселей: браузер растянет
      // холст сам, а видеокарта считает вчетверо меньше.
      const ratio = Math.min(1, window.devicePixelRatio || 1) * 0.5
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
      gl.uniform1f(uniforms.warp, current.warp)
      gl.uniform1f(uniforms.power, current.power)
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
    ...(accent ? { "--vibeui-surface-004-accent": accent } : null),
    ...(colors
      ? {
          "--vibeui-surface-004-c1": colors[0],
          "--vibeui-surface-004-c2": colors[1],
          "--vibeui-surface-004-c3": colors[2],
          "--vibeui-surface-004-c4": colors[3],
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-004" precedence="medium">
        {STYLES}
      </style>
      <section
        ref={host}
        data-vibeui-block="surface-004"
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
