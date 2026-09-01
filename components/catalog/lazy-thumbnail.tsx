"use client"

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
} from "react"

import { loadLazyPreviewMap } from "@/registry/preview-loaders-lazy"
import type { ItemKind } from "@/registry/categories"
import type { PreviewProps } from "@/registry/preview-types"

const SECTION_WIDTH = 1280

/**
 * Клиентская часть миниатюры: компонент грузится только когда карточка
 * подъезжает к экрану.
 *
 * Витрина отдаёт сотни items. Отрисованные на сервере превью давали
 * десятки мегабайт HTML на одну страницу каталога — браузер получал разметку
 * всех компонентов сразу, включая те, до которых человек никогда не
 * доскроллит. Поэтому карточка отдаёт пустой кадр, а сам компонент
 * подтягивается отдельным чанком по IntersectionObserver.
 *
 * Тот же source of truth сохраняется: грузится файл из `registry/blocks/`,
 * который получает пользователь, отдельной demo-копии по-прежнему нет.
 *
 * Появление плавное — за него отвечает `.preview-fade` в globals.css
 * (`@starting-style`), чтобы анимация начиналась ровно в момент вставки
 * загруженного компонента, а не в момент старта загрузки.
 */
export function LazyThumbnail({
  slug,
  kind,
  category,
  compact,
  full,
  props,
}: {
  slug: string
  kind: ItemKind
  category: string
  compact: boolean
  full: boolean
  props?: Record<string, unknown>
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [Preview, setPreview] =
    useState<ComponentType<PreviewProps> | null>(null)

  useEffect(() => {
    const frame = frameRef.current

    if (!frame) {
      return
    }

    // Запас в 800px: чанк успевает приехать до того, как карточка появится
    // в поле зрения, и человек не видит пустой кадр при обычном скролле.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "800px 0px" },
    )

    observer.observe(frame)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) {
      return
    }

    let cancelled = false

    loadLazyPreviewMap(kind, category).then((map) => {
      if (!cancelled) {
        setPreview(() => map?.[slug] ?? null)
      }
    })

    return () => {
      cancelled = true
    }
  }, [category, kind, slug, visible])

  const content = visible && Preview ? <Preview {...(props ?? {})} /> : null

  if (compact) {
    return (
      <div
        ref={frameRef}
        className="bg-preview-surface flex min-h-44 w-full flex-1 items-center justify-center overflow-hidden p-6 lg:px-8 lg:py-10"
      >
        <div className={"preview-fade" + (full ? " w-full max-w-[30rem]" : "")}>
          {content}
        </div>
      </div>
    )
  }

  return (
    // Кадр 16/9 равен пропорции секции в 1280×720, поэтому блок заполняет его
    // без полос и обрезки. Подложка следует переключателю темы на карточке.
    <div
      ref={frameRef}
      className="bg-preview-surface @container relative aspect-[16/9] w-full overflow-hidden"
      style={{ "--thumbnail-width": `${SECTION_WIDTH}px` } as CSSProperties}
    >
      <div className="block-thumbnail-frame">
        <div className="block-thumbnail-scale preview-fade">{content}</div>
      </div>
    </div>
  )
}
