"use client"

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"

const AUTHOR_WIDTH = 1280

// Доля высоты окна под кадр: высокий блок (две бегущие строки, длинный
// прайс) не должен занимать весь экран — ниже потолка он ужимается сильнее,
// но остаётся целым и без скролла.
const MAX_HEIGHT_RATIO = 0.62

// Та же граница, но от ширины кадра. Одной привязки к окну мало: на
// невысоком экране потолок выходил в треть тысячи пикселей, и блок в
// полторы тысячи ужимался до нечитаемого — при том что ширины карточки
// хватало на вдвое более крупный кадр. Ширина у карточки одна на всех
// экранах, поэтому и масштаб от неё одинаковый везде.
const MAX_HEIGHT_BY_WIDTH = 0.75

// Нижняя граница кадра: совсем низкий блок (строка логотипов) иначе
// схлопнулся бы в полоску.
const MIN_HEIGHT = 120

/**
 * Кадр «весь блок целиком»: блок рендерится в свою авторскую ширину (1280),
 * а кадр вписывает его масштабом по меньшей из сторон — по ширине карточки и
 * по потолку высоты. Виден весь блок, без внутреннего скролла и без паспарту.
 *
 * Один и тот же кадр обслуживает и статичную миниатюру, и конфигурируемое
 * превью: смена пропсов контролом меняет высоту контента, ResizeObserver
 * ловит её и пересчитывает масштаб — кадр не схлопывается.
 */
// Авторская высота для амбиентных блоков (фон, курсор): у них нет своей
// высоты — слой прижат к родителю (inset:0). Даём им кадр 16:9, чтобы было
// что показать, а не пустоту.
const FILL_HEIGHT = Math.round((AUTHOR_WIDTH * 9) / 16)

export function FitFrame({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // Блок без своей высоты определяется один раз: как только ему задан
  // FILL_HEIGHT, его offsetHeight становится ненулевым, и повторный замер
  // принял бы его за обычный — защёлка не даёт этой осцилляции случиться.
  const fillParent = useRef(false)
  const [scale, setScale] = useState<number>()
  const [height, setHeight] = useState<number>()
  const [contentHeight, setContentHeight] = useState<number>()

  useEffect(() => {
    const frame = frameRef.current
    const content = contentRef.current

    if (!frame || !content) {
      return
    }

    const measure = () => {
      const frameWidth = frame.clientWidth

      if (frameWidth <= 0) {
        return
      }

      const byWidth = frameWidth / AUTHOR_WIDTH

      // Амбиентный блок без своей высоты (фон, курсор — слой прижат к
      // родителю) рисуем в кадре 16:9 на ширину карточки. Нулевая высота
      // корня двусмысленна: так же выглядит блок, чей чанк ещё не приехал.
      // Различаем по потомкам: у загруженного амбиента слой уже отрисован и
      // имеет размер, у незагруженного блока поддерева ещё нет — тогда ждём.
      if (!fillParent.current && content.offsetHeight <= 1) {
        const painted = Array.from(content.querySelectorAll("*")).some(
          (node) => node instanceof HTMLElement && node.offsetHeight > 0,
        )

        if (!painted) {
          return
        }

        fillParent.current = true
      }

      if (fillParent.current) {
        setContentHeight(FILL_HEIGHT)
        setScale(byWidth)
        setHeight(FILL_HEIGHT * byWidth)

        return
      }

      // offsetHeight не учитывает transform: scale, поэтому это высота блока
      // в его натуральных 1280px.
      const naturalHeight = content.offsetHeight
      const capHeight = Math.max(
        window.innerHeight * MAX_HEIGHT_RATIO,
        frameWidth * MAX_HEIGHT_BY_WIDTH,
      )
      const nextScale = Math.min(byWidth, capHeight / naturalHeight)
      const nextHeight = Math.max(MIN_HEIGHT, naturalHeight * nextScale)

      setScale(nextScale)
      setHeight(nextHeight)
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    observer.observe(content)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={frameRef}
      className="flex w-full items-start justify-center overflow-hidden"
      style={height ? { height } : { aspectRatio: "16 / 9" }}
    >
      <div
        ref={contentRef}
        style={
          {
            flex: "none",
            width: AUTHOR_WIDTH,
            ...(contentHeight ? { height: contentHeight } : null),
            transform: `scale(${scale ?? 0})`,
            transformOrigin: "top center",
            // Пока масштаб не измерен — контент невидим, чтобы не мелькнул в
            // натуральную величину.
            visibility: scale === undefined ? "hidden" : undefined,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  )
}
