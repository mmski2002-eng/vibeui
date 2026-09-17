"use client"

import { Pause, Play } from "lucide-react"
import { useState, type CSSProperties } from "react"

import type { StartTexts } from "@/components/pages/start/texts"

import "./start-demo.css"

/**
 * Ролик «вся цепочка за полминуты», нарисованный разметкой и CSS-анимацией
 * вместо видео: весит килобайты, чёткий на любом экране, язык берёт из
 * словаря страницы. Один таймлайн на все слои (`--sd-loop`), поэтому его
 * можно промотать снаружи через Web Animations API — так из той же сцены
 * рендерится mp4 для YouTube. Сама сцена — макет, не скриншот: интерфейсы
 * агентов меняются каждый месяц, а фигуры остаются верными.
 */
export function StartDemo({ text }: { text: StartTexts["demo"] }) {
  const [paused, setPaused] = useState(false)

  return (
    <figure
      data-start-demo
      data-paused={paused ? "true" : undefined}
      className="sd border-shell-border bg-shell-panel overflow-hidden rounded-2xl border"
    >
      <div className="sd-stage" aria-hidden="true">
        <section className="sd-scene sd-title" data-scene="0">
          <span className="sd-wordmark wordmark">
            Vibe<b>UI</b>
          </span>
          <p className="sd-promise">{text.scenes[0]}</p>
        </section>

        <section className="sd-scene sd-catalog" data-scene="1">
          <Browser url="vibeui.ru/blocks">
            <div className="sd-grid">
              <Card />
              <Card target />
              <Card />
              <Card />
              <Card />
              <Card />
            </div>
          </Browser>
          <p className="sd-caption">{text.scenes[1]}</p>
        </section>

        <section className="sd-scene sd-item" data-scene="2">
          <Browser url="vibeui.ru/blocks/hero-001">
            <div className="sd-item-layout">
              <div className="sd-preview">
                <Hero />
              </div>
              <div className="sd-panel">
                <span className="sd-line sd-line-title" />
                <span className="sd-line sd-line-w60" />
                <span className="sd-line sd-line-w80" />
                <span className="sd-copy">
                  <span className="sd-copy-idle">{text.copy}</span>
                  <span className="sd-copy-done">✓ {text.copied}</span>
                </span>
              </div>
            </div>
          </Browser>
          <p className="sd-caption">{text.scenes[2]}</p>
        </section>

        <section className="sd-scene sd-chat" data-scene="3">
          <div className="sd-terminal">
            <div className="sd-terminal-bar">
              <span className="sd-dot" />
              <span className="sd-dot" />
              <span className="sd-dot" />
              <span className="sd-terminal-title">Claude Code · my-site</span>
            </div>
            <div className="sd-terminal-body">
              <p className="sd-user">
                <span className="sd-prompt">›</span>
                <span
                  className="sd-typed"
                  style={
                    {
                      "--sd-chars": text.chatLine.length,
                    } as CSSProperties
                  }
                >
                  {text.chatLine.split("vibeui.ru")[0]}
                  <span className="sd-link">
                    vibeui.ru{text.chatLine.split("vibeui.ru")[1]}
                  </span>
                </span>
                <span className="sd-caret" />
              </p>
              {text.agentLines.map((line, index) => (
                <p key={line} className="sd-agent" data-step={index}>
                  <span className="sd-tick">✓</span>
                  {line}
                </p>
              ))}
            </div>
          </div>
          <p className="sd-caption">{text.scenes[3]}</p>
        </section>

        <section className="sd-scene sd-result" data-scene="4">
          <Browser url="localhost:3000">
            <div className="sd-result-page">
              <Hero />
              <div className="sd-result-rest">
                {[0, 1, 2].map((column) => (
                  <span key={column}>
                    <span className="sd-line sd-line-w60" />
                    <span className="sd-line sd-line-w80" />
                    <span className="sd-line sd-line-w40" />
                  </span>
                ))}
              </div>
              <span className="sd-badge">✓</span>
            </div>
          </Browser>
          <p className="sd-caption">{text.scenes[4]}</p>
        </section>

        <span className="sd-cursor">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4.5 2.5 19 12.4l-6.6 1 3.9 7-2.8 1.5-3.9-7L4.5 20z"
              fill="#fff"
              stroke="#111"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          <span className="sd-cursor-ring" />
        </span>
      </div>

      <figcaption className="border-shell-border flex items-center justify-between gap-3 border-t px-4 py-2.5">
        <span className="text-shell-muted text-xs">{text.heading}</span>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          className="text-shell-muted hover:text-shell-fg inline-flex items-center gap-1.5 text-xs transition-colors"
        >
          {paused ? (
            <Play className="size-3.5" aria-hidden="true" />
          ) : (
            <Pause className="size-3.5" aria-hidden="true" />
          )}
          {paused ? text.play : text.pause}
        </button>
      </figcaption>
    </figure>
  )
}

function Browser({
  url,
  children,
}: {
  url: string
  children: React.ReactNode
}) {
  return (
    <div className="sd-browser">
      <div className="sd-browser-bar">
        <span className="sd-dot" />
        <span className="sd-dot" />
        <span className="sd-dot" />
        <span className="sd-url">{url}</span>
      </div>
      <div className="sd-browser-body">{children}</div>
    </div>
  )
}

/* Карточка каталога: та же фигура, что и блок, в масштабе миниатюры.
   Целевая — с hero, чтобы результат в конце узнавался как «тот самый». */
function Card({ target = false }: { target?: boolean }) {
  return (
    <div className={target ? "sd-card is-target" : "sd-card"}>
      {target ? (
        <Hero compact />
      ) : (
        <div className="sd-card-abstract">
          <span className="sd-line sd-line-w60" />
          <span className="sd-line sd-line-w80" />
          <span className="sd-line sd-line-w40" />
        </div>
      )}
      <div className="sd-card-foot">
        <span className="sd-line sd-line-w40" />
      </div>
    </div>
  )
}

function Hero({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "sd-hero is-compact" : "sd-hero"}>
      <span className="sd-hero-pill" />
      <span className="sd-hero-title" />
      <span className="sd-hero-title is-second" />
      <span className="sd-hero-lead" />
      <span className="sd-hero-actions">
        <span className="sd-hero-btn is-primary" />
        <span className="sd-hero-btn" />
      </span>
    </div>
  )
}
