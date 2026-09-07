"use client"

import { useEffect, useRef, useState, type ComponentType } from "react"

import { loadLazyPreviewMap } from "@/registry/preview-loaders-lazy"
import type { ItemKind } from "@/registry/categories"
import type { PreviewProps } from "@/registry/preview-types"

export function ShowcasePreview({
  slug,
  kind,
  category,
  width,
  props,
}: {
  slug: string
  kind: ItemKind
  category: string
  width: number
  props?: Record<string, unknown>
}) {
  const frame = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const [Preview, setPreview] = useState<ComponentType<PreviewProps> | null>(
    null,
  )
  const [scale, setScale] = useState(0)

  useEffect(() => {
    let cancelled = false
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        loadLazyPreviewMap(kind, category).then((map) => {
          if (!cancelled) setPreview(() => map?.[slug] ?? null)
        })
      },
      { rootMargin: "500px" },
    )
    if (frame.current) observer.observe(frame.current)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [slug, kind, category])

  useEffect(() => {
    const container = frame.current
    const preview = content.current
    if (!container || !preview || !Preview) return
    // Fit the actual component on both axes, including after fonts and images load.
    const measure = () =>
      setScale(
        Math.min(
          container.clientWidth / width,
          container.clientHeight / Math.max(preview.offsetHeight, 1),
          1,
        ),
      )
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    observer.observe(preview)
    measure()
    return () => observer.disconnect()
  }, [Preview, width])

  return (
    <div
      ref={frame}
      className="relative h-full w-full"
      inert
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={content}
          className={
            kind === "block"
              ? "shrink-0"
              : "flex shrink-0 items-center justify-center"
          }
          style={{
            width,
            transform: `scale(${scale})`,
            opacity: scale ? 1 : 0,
          }}
        >
          {Preview ? <Preview {...props} /> : null}
        </div>
      </div>
    </div>
  )
}
