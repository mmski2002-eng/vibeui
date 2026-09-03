import type { LabCheck } from "@/components/lab/check-types"

import { Sortable001 } from "@/registry/components/sortable/sortable-001/sortable-001"
import { Sortable002 } from "@/registry/components/sortable/sortable-002/sortable-002"
import { Sortable003 } from "@/registry/components/sortable/sortable-003/sortable-003"
import { Sortable004 } from "@/registry/components/sortable/sortable-004/sortable-004"
import { Sortable005 } from "@/registry/components/sortable/sortable-005/sortable-005"
import { Sortable006 } from "@/registry/components/sortable/sortable-006/sortable-006"
import { Sortable007 } from "@/registry/components/sortable/sortable-007/sortable-007"
import { Sortable008 } from "@/registry/components/sortable/sortable-008/sortable-008"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 76351

export const CHECKS: LabCheck[] = [
  {
    name: "sortable-001",
    title: "Список с перетаскиванием",
    notes: [
      "Заголовок: Что дальше",
      "Подсказка: Что дальше",
      "Акцент: #9278ce",
    ],
    node: <Sortable001 title="Что дальше" hint="Что дальше" accent="#9278ce" />,
  },
  {
    name: "sortable-002",
    title: "Перестановка с клавиатуры",
    notes: [
      "Заголовок: Подпись: тест",
      "Подсказка: Проверка",
      "Акцент: #ec05dd",
    ],
    node: (
      <Sortable002 title="Подпись: тест" hint="Проверка" accent="#ec05dd" />
    ),
  },
  {
    name: "sortable-003",
    title: "Перестановка колонок таблицы",
    notes: ["Подпись таблицы: Черновик", "Акцент: #7d3bf4"],
    node: <Sortable003 caption="Черновик" accent="#7d3bf4" />,
  },
  {
    name: "sortable-004",
    title: "Перенос между списками",
    notes: [
      "Левая панель: Смена",
      "Правая панель: Черновик",
      "Акцент: #5833f9",
    ],
    node: (
      <Sortable004
        sourceTitle="Смена"
        targetTitle="Черновик"
        accent="#5833f9"
      />
    ),
  },
  {
    name: "sortable-005",
    title: "Сетка плиток с перестановкой",
    notes: [
      "Колонок: 5",
      "Заголовок: Проверка",
      "Подсказка: Черновик",
      "Акцент: #868e49",
    ],
    node: (
      <Sortable005
        columns={5}
        title="Проверка"
        hint="Черновик"
        accent="#868e49"
      />
    ),
  },
  {
    name: "sortable-006",
    title: "Закреплённая первая строка",
    notes: [
      "Закреплённая строка: Смена",
      "Заголовок: Смена",
      "Метка закрепления: Черновик",
      "Цвет закрепления: #a3adf4",
      "Акцент: #300403",
    ],
    node: (
      <Sortable006
        pinned="Смена"
        title="Смена"
        pinnedBadge="Черновик"
        pin="#a3adf4"
        accent="#300403"
      />
    ),
  },
  {
    name: "sortable-007",
    title: "Перестановка с отменой",
    notes: [
      "Заголовок: Черновик",
      "Кнопка отмены: Подпись: тест",
      "Акцент: #267ae9",
    ],
    node: (
      <Sortable007
        title="Черновик"
        undoLabel="Подпись: тест"
        accent="#267ae9"
      />
    ),
  },
  {
    name: "sortable-008",
    title: "Чеклист задач",
    notes: ["Заголовок: Что дальше", "Акцент: #6df7cd"],
    node: <Sortable008 title="Что дальше" accent="#6df7cd" />,
  },
]
