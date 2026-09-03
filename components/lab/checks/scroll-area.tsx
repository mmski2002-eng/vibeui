import type { LabCheck } from "@/components/lab/check-types"

import { Scrollarea001 } from "@/registry/components/scroll-area/scrollarea-001/scrollarea-001"
import { Scrollarea002 } from "@/registry/components/scroll-area/scrollarea-002/scrollarea-002"
import { Scrollarea003 } from "@/registry/components/scroll-area/scrollarea-003/scrollarea-003"
import { Scrollarea004 } from "@/registry/components/scroll-area/scrollarea-004/scrollarea-004"
import { Scrollarea005 } from "@/registry/components/scroll-area/scrollarea-005/scrollarea-005"
import { Scrollarea006 } from "@/registry/components/scroll-area/scrollarea-006/scrollarea-006"
import { Scrollarea007 } from "@/registry/components/scroll-area/scrollarea-007/scrollarea-007"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 108

export const CHECKS: LabCheck[] = [
  {
    name: "scrollarea-001",
    title: "Область прокрутки",
    notes: ["Заголовок: Что дальше", "Высота: 16rem"],
    node: <Scrollarea001 title="Что дальше" height="16rem" />,
  },
  {
    name: "scrollarea-002",
    title: "Тени у краёв",
    notes: ["Заголовок: Подпись: тест", "Высота: 13rem"],
    node: <Scrollarea002 title="Подпись: тест" height="13rem" />,
  },
  {
    name: "scrollarea-003",
    title: "Полка карточек с прилипанием",
    notes: [
      "Заголовок: Подпись: тест",
      "Ширина карточки: 7.5rem",
      "Подсказка: Подпись: тест",
    ],
    node: (
      <Scrollarea003
        title="Подпись: тест"
        cardWidth="7.5rem"
        hint="Подпись: тест"
      />
    ),
  },
  {
    name: "scrollarea-004",
    title: "Липкие заголовки групп",
    notes: ["Заголовок: Что дальше", "Высота: 14rem"],
    node: <Scrollarea004 title="Что дальше" height="14rem" />,
  },
  {
    name: "scrollarea-005",
    title: "Панель со счётчиком строк",
    notes: [
      "Заголовок: Черновик",
      "Видимых строк: 4",
      "Подпись вместимости: Что дальше",
      "Подсказка: Черновик",
    ],
    node: (
      <Scrollarea005
        title="Черновик"
        rows={4}
        capacityText="Что дальше"
        hint="Черновик"
      />
    ),
  },
  {
    name: "scrollarea-006",
    title: "Показ активного пункта",
    notes: [
      "Заголовок: Что дальше",
      "Активный элемент: 0",
      "Высота: 10rem",
      "Подпись кнопки: Подпись: тест",
    ],
    node: (
      <Scrollarea006
        title="Что дальше"
        activeIndex={0}
        height="10rem"
        revealLabel="Подпись: тест"
      />
    ),
  },
  {
    name: "scrollarea-007",
    title: "Тонкая полоса прокрутки",
    notes: [
      "Заголовок: Черновик",
      "Высота: 16rem",
      "Толщина полосы: 0.375rem",
      "Подпись подвала: Что дальше",
    ],
    node: (
      <Scrollarea007
        title="Черновик"
        height="16rem"
        barWidth="0.375rem"
        note="Что дальше"
      />
    ),
  },
]
