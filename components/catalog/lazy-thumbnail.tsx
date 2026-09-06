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
  const scaleRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [Preview, setPreview] = useState<ComponentType<PreviewProps> | null>(
    null,
  )
  // Высота кадра блока: масштаб вписывает блок по ширине, но высокая секция
  // (hero, тарифы) при этом вылезает за кадр 16/9 и обрезается сверху/снизу.
  // Меряем реальную высоту блока в 1280px и задаём кадру ту же высоту в
  // масштабе — тогда секция влезает целиком.
  const [frameHeight, setFrameHeight] = useState<number>()

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

  // Кадр блока подгоняет высоту под масштабированную высоту секции. Меряем
  // layout-высоту блока (offsetHeight не учитывает transform: scale, поэтому
  // это высота в натуральных 1280px) и умножаем на масштаб = ширина кадра /
  // 1280. Пересчёт на ресайзе: ширина кадра меняется, масштаб вместе с ней.
  useEffect(() => {
    if (compact || !Preview || !visible) {
      return
    }

    const frame = frameRef.current
    const scale = scaleRef.current

    if (!frame || !scale) {
      return
    }

    const measure = () => {
      const width = frame.clientWidth
      const naturalHeight = scale.offsetHeight

      if (width > 0 && naturalHeight > 0) {
        setFrameHeight((naturalHeight * width) / SECTION_WIDTH)
      }
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    observer.observe(scale)

    return () => observer.disconnect()
  }, [compact, Preview, visible])

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
          // Пока высота не измерена (до загрузки чанка) — пропорция секции,
          // чтобы кадр не был нулевым. После измерения высота точна под блок.
          ...(frameHeight
            ? { height: `${frameHeight}px` }
            : { aspectRatio: aspect ?? "16 / 9" }),
        } as unknown as CSSProperties
      }
    >
      <div className="block-thumbnail-frame">
        <div ref={scaleRef} className="block-thumbnail-scale preview-fade">
          {content}
        </div>
      </div>
    </div>
  )
}
