"use client"

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
} from "react"

import { holdPreviewLink } from "@/lib/preview-links"
import { loadLazyPreviewMap } from "@/registry/preview-loaders-lazy"
import type { ItemKind } from "@/registry/categories"
import type { PreviewProps } from "@/registry/preview-types"

const SECTION_WIDTH = 1280

/**
 * Сколько высоты экрана отдаём кадру блока. Высокие секции (шесть экранов
 * возможностей, длинный прайс) в натуральном масштабе не помещались в окно:
 * карточка уезжала под липкую полосу поиска, и её верх приходилось искать
 * прокруткой вверх. Всё, что выше лимита, ужимается сильнее — блок остаётся
 * целым, только мельче.
 */
const MAX_FRAME_HEIGHT = 0.62

/** «8 / 3» → 2.67. Пропорция кадра приходит из metadata строкой. */
function parseAspect(value: string) {
  const [width, height] = value.split("/").map((part) => Number(part.trim()))

  return width > 0 && height > 0 ? width / height : 8 / 3
}

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
  half,
  props,
  states,
  aspect,
}: {
  slug: string
  kind: ItemKind
  category: string
  compact: boolean
  full: boolean
  /** Рисовать вдвое крупнее кадра: масштаб ровно 0.5. */
  half?: boolean
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
  // Ширина, от которой считается масштаб. Обычно это ширина секции; у блока,
  // который не влезает в экран по высоте, она объявляется больше — так блок
  // ужимается целиком, без обрезки.
  const [frameWidth, setFrameWidth] = useState(SECTION_WIDTH)

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
        if (half) {
          // Ширина секции — двойная ширина кадра, масштаб выходит ровно
          // вдвое. Высоту кадра берём из пропорции: подложка растягивается
          // на всё, что ей дали, и своей высоты не имеет.
          const ratio = aspect ? parseAspect(aspect) : 8 / 3

          setFrameWidth(width * 2)
          setFrameHeight(width / ratio)

          return
        }

        const height = (naturalHeight * width) / SECTION_WIDTH
        const limit = window.innerHeight * MAX_FRAME_HEIGHT

        if (height > limit) {
          // Масштаб задан как ширина кадра / --thumbnail-width, поэтому
          // ужать блок можно, объявив ширину секции больше настоящей.
          setFrameWidth(Math.round((SECTION_WIDTH * height) / limit))
          setFrameHeight(limit)

          return
        }

        setFrameWidth(SECTION_WIDTH)
        setFrameHeight(height)
      }
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    observer.observe(scale)

    return () => observer.disconnect()
  }, [compact, Preview, visible, half, aspect])

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
        data-part="frame"
        className="preview-frame bg-preview-surface flex w-full flex-1 justify-center"
        onClick={holdPreviewLink}
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
    //
    // Внешняя обёртка тянется на всю высоту карточки и центрирует кадр по
    // вертикали: в ряду сетки карточки одной высоты, и низкий блок иначе
    // прилипал к верху над пустотой. Замер масштаба берёт только ширину,
    // поэтому рост обёртки по высоте его не трогает.
    <div
      ref={frameRef}
      // Подложке поля не нужны: она и есть фон карточки, а не картинка в
      // паспарту. У остальных секций поля остаются — там кадр отделяет
      // блок от края.
      data-frame={half ? "section" : undefined}
      className="preview-frame bg-preview-surface @container flex w-full flex-1"
      onClick={holdPreviewLink}
      style={
        {
          "--thumbnail-width": `${frameWidth}px`,
          ...(half && frameHeight
            ? { "--thumbnail-height": `${frameHeight * 2}px` }
            : null),
        } as CSSProperties
      }
    >
      <div
        className="relative w-full"
        style={
          // Пока высота не измерена (до загрузки чанка) — пропорция секции,
          // чтобы кадр не был нулевым. После измерения высота точна под блок.
          frameHeight
            ? { height: `${frameHeight}px` }
            : { aspectRatio: aspect ?? "16 / 9" }
        }
      >
        <div className="block-thumbnail-frame">
          <div ref={scaleRef} className="block-thumbnail-scale preview-fade">
            {content}
          </div>
        </div>
      </div>
    </div>
  )
}
