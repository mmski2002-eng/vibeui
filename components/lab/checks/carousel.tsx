import type { LabCheck } from "@/components/lab/check-types"

import { Carousel001 } from "@/registry/components/carousel/carousel-001/carousel-001"
import { Carousel002 } from "@/registry/components/carousel/carousel-002/carousel-002"
import { Carousel003 } from "@/registry/components/carousel/carousel-003/carousel-003"
import { Carousel004 } from "@/registry/components/carousel/carousel-004/carousel-004"
import { Carousel005 } from "@/registry/components/carousel/carousel-005/carousel-005"
import { Carousel006 } from "@/registry/components/carousel/carousel-006/carousel-006"
import { Carousel007 } from "@/registry/components/carousel/carousel-007/carousel-007"
import { Carousel008 } from "@/registry/components/carousel/carousel-008/carousel-008"
import { Carousel009 } from "@/registry/components/carousel/carousel-009/carousel-009"
import { Carousel010 } from "@/registry/components/carousel/carousel-010/carousel-010"
import { Carousel011 } from "@/registry/components/carousel/carousel-011/carousel-011"
import { Carousel012 } from "@/registry/components/carousel/carousel-012/carousel-012"
import { Carousel013 } from "@/registry/components/carousel/carousel-013/carousel-013"
import { Carousel014 } from "@/registry/components/carousel/carousel-014/carousel-014"
import { Carousel015 } from "@/registry/components/carousel/carousel-015/carousel-015"
import { Carousel016 } from "@/registry/components/carousel/carousel-016/carousel-016"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 76351

export const CHECKS: LabCheck[] = [
  {
    name: "carousel-001",
    title: "Карусель с прилипанием",
    notes: ["Название: Что дальше", "Подсказка: Что дальше", "Акцент: #9278ce"],
    node: <Carousel001 label="Что дальше" hint="Что дальше" accent="#9278ce" />,
  },
  {
    name: "carousel-002",
    title: "Карточки с подглядыванием",
    notes: ["Заголовок: Подпись: тест", "Акцент: #c5c1ec"],
    node: <Carousel002 label="Подпись: тест" accent="#c5c1ec" />,
  },
  {
    name: "carousel-003",
    title: "Слайдер с миниатюрами",
    notes: ["Название: Черновик", "Счётчик: Черновик", "Акцент: #7d3bf4"],
    node: (
      <Carousel003 label="Черновик" counterText="Черновик" accent="#7d3bf4" />
    ),
  },
  {
    name: "carousel-004",
    title: "Бегущая строка логотипов",
    notes: ["Подпись: Смена", "Секунд на проход: 63"],
    node: <Carousel004 label="Смена" duration={63} />,
  },
  {
    name: "carousel-005",
    title: "Слайдер отзывов",
    notes: ["Название: Что дальше", "Акцент: #33f9f3"],
    node: <Carousel005 label="Что дальше" accent="#33f9f3" />,
  },
  {
    name: "carousel-006",
    title: "Проигрыватель историй",
    notes: [
      "Секунд на кадр: 7",
      "Название: Проверка",
      "Подсказка: Подпись: тест",
    ],
    node: <Carousel006 seconds={7} label="Проверка" hintText="Подпись: тест" />,
  },
  {
    name: "carousel-007",
    title: "Киноплёнка",
    notes: ["Название: Что дальше", "Подсказка: Смена"],
    node: <Carousel007 label="Что дальше" hint="Смена" />,
  },
  {
    name: "carousel-008",
    title: "Шаги знакомства",
    notes: [
      "Кнопка дальше: Смена",
      "Кнопка завершения: Черновик",
      "Кнопка пропуска: Проверка",
      "Акцент: #f43004",
    ],
    node: (
      <Carousel008
        nextLabel="Смена"
        doneLabel="Черновик"
        skipLabel="Проверка"
        accent="#f43004"
      />
    ),
  },
  {
    name: "carousel-009",
    title: "Точки-листалка",
    notes: ["Подпись: Проверка", "Акцент: #fc9183"],
    node: <Carousel009 label="Проверка" accent="#fc9183" />,
  },
  {
    name: "carousel-010",
    title: "Полка товаров",
    notes: [
      "Заголовок: Подпись: тест",
      "Значок скидки: Что дальше",
      "Акцент: #3b6df7",
    ],
    node: (
      <Carousel010
        title="Подпись: тест"
        saleLabel="Что дальше"
        accent="#3b6df7"
      />
    ),
  },
  {
    name: "carousel-011",
    title: "Автопрокрутка отзывов",
    notes: ["Секунд на отзыв: 17", "Название: Черновик", "Акцент: #1ac426"],
    node: <Carousel011 interval={17} label="Черновик" accent="#1ac426" />,
  },
  {
    name: "carousel-012",
    title: "Ленты со счётчиком",
    notes: ["Заголовок: Что дальше", "Секунд на проход: 26"],
    node: <Carousel012 title="Что дальше" duration={26} />,
  },
  {
    name: "carousel-013",
    title: "Центрирующиеся миниатюры",
    notes: ["Подпись: Черновик", "Подсказка: Смена", "Акцент: #1fdfc1"],
    node: <Carousel013 label="Черновик" hint="Смена" accent="#1fdfc1" />,
  },
  {
    name: "carousel-014",
    title: "Колода с якорями",
    notes: [
      "Подпись: Проверка",
      "Основа якорей: Что дальше",
      "Подсказка: Проверка",
      "Акцент: #c1295a",
    ],
    node: (
      <Carousel014
        label="Проверка"
        idPrefix="Что дальше"
        hint="Проверка"
        accent="#c1295a"
      />
    ),
  },
  {
    name: "carousel-015",
    title: "Кадры с подписями",
    notes: ["Подпись: Проверка", "Акцент: #9cb70e"],
    node: <Carousel015 label="Проверка" accent="#9cb70e" />,
  },
  {
    name: "carousel-016",
    title: "Счётчик слайдов",
    notes: ["Подпись: Смена", "Счётчик: Черновик", "Акцент: #c452b4"],
    node: <Carousel016 label="Смена" counterText="Черновик" accent="#c452b4" />,
  },
]
