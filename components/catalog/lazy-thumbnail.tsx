"use client"

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type MouseEvent,
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
/**
 * Гасит переход по демо-ссылке внутри превью. В компонентах каталога ссылки
 * ведут в "#": на витрине такой клик прокручивает страницу к началу и меняет
 * адрес, хотя человек просто щёлкнул по карточке.
 */
function holdDemoLinks(event: MouseEvent<HTMLDivElement>) {
  const link = (event.target as HTMLElement).closest("a")
  const href = link?.getAttribute("href")

  if (link && (href === "#" || href === "" || href === null)) {
    event.preventDefault()
  }
}

export function LazyThumbnail({
  slug,
  kind,
  category,
  compact,
  full,
  props,
  states,
  aspect,
}: {
  slug: string
  kind: ItemKind
  category: string
  compact: boolean
  full: boolean
  props?: Record<string, unknown>
  states?: Record<string, unknown>[]
  aspect?: string
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [Preview, setPreview] = useState<ComponentType<PreviewProps> | null>(
    null,
  )

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

  // Ряд состояний: тот же компонент, разные пропсы. Кадр мелкого компонента
  // иначе стоит почти пустым, а размеры и состояния присутствия с витрины
  // не читаются. Высота кадра при этом не меняется — ряд идёт по горизонтали.
  const row = states && states.length > 0 ? states : null

  const content =
    visible && Preview ? (
      row ? (
        row.map((state, index) => (
          <Preview key={index} {...(props ?? {})} {...state} />
        ))
      ) : (
        <Preview {...(props ?? {})} />
      )
    ) : null

  if (compact) {
    return (
      <div
        ref={frameRef}
        className="bg-preview-surface flex min-h-44 w-full flex-1 items-center justify-center overflow-hidden p-6 lg:px-8 lg:py-10"
        onClick={holdDemoLinks}
      >
        <div
          className={
            "preview-fade" +
            // Компонент со своей максимальной шириной иначе прижимается к
            // левому краю кадра: обёртка занимает всю ширину, а он — нет.
            (full ? " preview-center w-full max-w-[30rem]" : "") +
            (row ? " flex flex-wrap items-center justify-center gap-4" : "")
          }
        >
          {content}
        </div>
      </div>
    )
  }

  return (
    // Кадр 16/9 равен пропорции секции в 1280×720, поэтому блок заполняет его
    // без полос и обрезки. Подложка следует переключателю темы на карточке.
    //
    // Низкий блок (шапка сайта — одна строка на всю ширину) просит свою
    // пропорцию через `meta.preview.aspect`: в кадре 16/9 он занял бы десятую
    // часть высоты, и на витрине от него осталась бы полоска в пустоте.
    <div
      ref={frameRef}
      className="bg-preview-surface @container relative w-full overflow-hidden"
      onClick={holdDemoLinks}
      style={
        {
          "--thumbnail-width": `${SECTION_WIDTH}px`,
          aspectRatio: aspect ?? "16 / 9",
        } as CSSProperties
      }
    >
      <div className="block-thumbnail-frame">
        <div className="block-thumbnail-scale preview-fade">{content}</div>
      </div>
    </div>
  )
}
