import type { MouseEvent } from "react"

/**
 * Клик по внутренней ссылке демо внутри превью.
 *
 * Компоненты каталога ведут ссылки в "#": на витрине такой переход
 * прокручивает страницу к началу и меняет адрес, хотя человек просто щёлкнул
 * по карточке. Поэтому переход гасится всегда.
 *
 * Но у карусели на якорях та же ссылка — единственный способ листать: точка
 * и стрелка указывают на слайд по id, а прокрутку делает сам браузер. Гашение
 * перехода ломало листание. Поэтому, если цель ссылки лежит внутри этого же
 * превью, слайд подводится прокруткой своего контейнера: карусель листается,
 * страница стоит на месте.
 */
export function holdPreviewLink(event: MouseEvent<HTMLElement>) {
  const link = (event.target as HTMLElement).closest("a")
  const href = link?.getAttribute("href")

  if (!link || !(href == null || href === "" || href.startsWith("#"))) {
    return
  }

  event.preventDefault()

  const id = href && href.length > 1 ? href.slice(1) : ""

  if (!id) {
    return
  }

  const target = event.currentTarget.querySelector(`#${CSS.escape(id)}`)

  // block: "nearest" — цель уже видна по вертикали, поэтому страница не
  // дёргается, а горизонтальная лента доезжает до слайда.
  target?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "nearest",
  })
}
