"use client"

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input029Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  placeholder?: string
  defaultValue?: string
  /** Язык распознавания для Web Speech API. */
  lang?: string
  /** Подпись кнопки: ключи unsupported, recording, idle. */
  micLabel?: Record<string, string>
  /** Примечание под полем: те же ключи, что у micLabel. */
  noteText?: Record<string, string>
  onChange?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: голосовой ввод через Web Speech API — это не npm-пакет,
// а объект window.SpeechRecognition, который либо есть в браузере, либо нет.
// Поддержка проверяется в эффекте (на сервере window нет), кнопка недоступна
// и объясняет почему, если конструктора нет. Распознанный текст дописывается
// к тому, что уже было в поле, а не заменяет его — так голос и клавиатура
// работают вперемешку, а не исключают друг друга.
const STYLES = `
:where([data-vibeui-block="input-029"]){
--vibeui-input-029-surface:transparent;
--vibeui-input-029-shell:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-input-029-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-input-029-muted:color-mix(in oklab,var(--vibeui-input-029-fg) 68%,transparent);
--vibeui-input-029-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-input-029-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-input-029-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.72 0.15 39.8));
--vibeui-input-029-rec:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.16 39.8));
--vibeui-input-029-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-029"]{color-scheme:dark}
[data-vibeui-block="input-029"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-029-surface);
border:1px solid var(--vibeui-input-029-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-029-font);color:var(--vibeui-input-029-fg);
}
[data-vibeui-block="input-029"] *{box-sizing:border-box}
[data-vibeui-block="input-029"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-029"] [data-part="frame"]{
display:flex;align-items:center;gap:0.375rem;
height:2.5rem;padding:0 0.375rem 0 0.75rem;
background:var(--vibeui-input-029-field);
border:1px solid var(--vibeui-input-029-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-029"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-029-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-029-accent) 18%,transparent);
}
[data-vibeui-block="input-029"][data-recording="1"] [data-part="frame"]{border-color:var(--vibeui-input-029-rec)}
[data-vibeui-block="input-029"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="input-029"] input:focus{outline:none}
[data-vibeui-block="input-029"] [data-part="mic"]{
position:relative;flex:none;appearance:none;cursor:pointer;
width:2rem;height:2rem;border-radius:999px;border:0;
background:none;color:var(--vibeui-input-029-muted);
display:flex;align-items:center;justify-content:center;
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="input-029"] [data-part="mic"]:hover:not(:disabled){
background:color-mix(in oklab,var(--vibeui-input-029-fg) 8%,transparent);color:var(--vibeui-input-029-fg);
}
[data-vibeui-block="input-029"] [data-part="mic"]:focus-visible{outline:2px solid var(--vibeui-input-029-accent);outline-offset:2px}
[data-vibeui-block="input-029"] [data-part="mic"]:disabled{cursor:not-allowed;opacity:0.45}
[data-vibeui-block="input-029"] [data-part="mic"][aria-pressed="true"]{color:var(--vibeui-input-029-rec)}
[data-vibeui-block="input-029"] [data-part="mic"] svg{width:1.125rem;height:1.125rem;display:block;position:relative}
[data-vibeui-block="input-029"] [data-part="pulse"]{
position:absolute;inset:0;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-input-029-rec) 35%,transparent);
animation:vibeui-input-029-pulse 1.4s ease-out infinite;
}
@keyframes vibeui-input-029-pulse{
0%{transform:scale(0.6);opacity:0.7}
100%{transform:scale(1.6);opacity:0}
}
[data-vibeui-block="input-029"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-029-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="input-029"] *{animation:none!important;transition:none!important}
[data-vibeui-block="input-029"] [data-part="pulse"]{display:none}
}
`

type SpeechResultLike = { transcript: string }
type SpeechEventLike = { results: ArrayLike<ArrayLike<SpeechResultLike>> }
type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  stop: () => void
  onresult: ((event: SpeechEventLike) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null

  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }

  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

// Поддержка не меняется на лету, поэтому подписка пустая — нужен только
// снимок. useSyncExternalStore, а не useState+useEffect: серверный снимок
// обязан вернуть то же, что первый клиентский рендер, иначе гидратация
// расходится с реальным disabled у кнопки микрофона.
const watchSpeechSupport = () => () => {}
const isSpeechSupported = () => getRecognitionCtor() !== null
const isServer = () => false

const MIC_LABEL: Record<string, string> = {
  unsupported: "Голосовой ввод не поддерживается браузером",
  recording: "Остановить запись",
  idle: "Начать голосовой ввод",
}

const NOTE: Record<string, string> = {
  unsupported: "Голосовой ввод не поддерживается этим браузером.",
  recording: "Идёт запись — говорите, распознанный текст допишется в поле.",
  idle: "Нажмите на микрофон и продиктуйте текст.",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Текстовое поле с голосовым вводом через Web Speech API: кнопка микрофона
 * запускает запись, распознанный текст дописывается к введённому. Если
 * браузер не поддерживает API, кнопка недоступна и это объяснено под полем.
 * Один файл, ноль зависимостей.
 */
export function Input029({
  label = "Комментарий",
  placeholder = "Наберите текст или включите микрофон",
  defaultValue = "",
  lang = "ru-RU",
  micLabel = MIC_LABEL,
  noteText = NOTE,
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Input029Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [recording, setRecording] = useState(false)
  const recognition = useRef<SpeechRecognitionLike | null>(null)
  const supported = useSyncExternalStore(
    watchSpeechSupport,
    isSpeechSupported,
    isServer,
  )

  useEffect(() => {
    return () => {
      recognition.current?.stop()
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-input-029-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-029-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const stateKey = !supported ? "unsupported" : recording ? "recording" : "idle"

  const commit = (next: string) => {
    setValue(next)
    onChange?.(next)
  }

  const startRecording = () => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) return

    const instance = new Ctor()
    instance.lang = lang
    instance.interimResults = false
    instance.continuous = false
    instance.onresult = (event) => {
      const said = event.results[0]?.[0]?.transcript ?? ""
      commit(said ? `${value}${value ? " " : ""}${said}` : value)
    }
    instance.onend = () => setRecording(false)
    instance.onerror = () => setRecording(false)

    recognition.current = instance
    setRecording(true)
    instance.start()
  }

  const stopRecording = () => {
    recognition.current?.stop()
    setRecording(false)
  }

  return (
    <>
      <style href="vibeui-input-029" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-029"
        data-recording={recording ? "1" : "0"}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="frame">
          <input
            id={id}
            type="text"
            placeholder={placeholder}
            value={value}
            aria-describedby={`${id}-note`}
            onChange={(event) => commit(event.target.value)}
          />
          <button
            type="button"
            data-part="mic"
            disabled={!supported}
            aria-pressed={recording}
            aria-label={micLabel[stateKey] ?? MIC_LABEL[stateKey]}
            onClick={() => (recording ? stopRecording() : startRecording())}
          >
            {recording ? <span data-part="pulse" aria-hidden="true" /> : null}
            {recording ? (
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <rect x="4" y="4" width="8" height="8" rx="1.5" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <rect x="5.5" y="1.5" width="5" height="8" rx="2.5" />
                <path d="M3 8a5 5 0 0 0 10 0M8 13v1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
        <p data-part="note" id={`${id}-note`} aria-live="polite">
          {noteText[stateKey] ?? NOTE[stateKey]}
        </p>
      </div>
    </>
  )
}
