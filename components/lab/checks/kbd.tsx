import type { LabCheck } from "@/components/lab/check-types"

import { Kbd001 } from "@/registry/components/kbd/kbd-001/kbd-001"
import { Kbd002 } from "@/registry/components/kbd/kbd-002/kbd-002"
import { Kbd003 } from "@/registry/components/kbd/kbd-003/kbd-003"
import { Kbd004 } from "@/registry/components/kbd/kbd-004/kbd-004"
import { Kbd005 } from "@/registry/components/kbd/kbd-005/kbd-005"
import { Kbd006 } from "@/registry/components/kbd/kbd-006/kbd-006"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 36756

export const CHECKS: LabCheck[] = [
  {
    name: "kbd-001",
    title: "Список сочетаний",
    notes: ["Заголовок: Смена", "Модификатор: Ctrl"],
    node: <Kbd001 title="Смена" mod="Ctrl" />,
  },
  {
    name: "kbd-002",
    title: "Разделитель аккорда",
    notes: ["Разделитель: then", "Подпись: Проверка", "Модификатор: ⌘"],
    node: <Kbd002 separator="then" caption="Проверка" mod="⌘" />,
  },
  {
    name: "kbd-003",
    title: "Клавиша внутри текста",
    notes: [
      "Текст до: Подпись: тест",
      "Текст после: Смена",
      "Модификатор: Ctrl",
    ],
    node: <Kbd003 before="Подпись: тест" after="Смена" mod="Ctrl" />,
  },
  {
    name: "kbd-004",
    title: "Полоса подсказок",
    notes: ["Выравнивание: center", "Плотность: md", "Модификатор: Ctrl"],
    node: <Kbd004 align="center" size="md" mod="Ctrl" />,
  },
  {
    name: "kbd-005",
    title: "Клавиши по платформе",
    notes: ["Платформа: auto", "Действие: Смена"],
    node: <Kbd005 platform="auto" action="Смена" />,
  },
  {
    name: "kbd-006",
    title: "Клавиши с длинной подписью",
    notes: ["Ширина клавиш: auto", "Подпись: Смена"],
    node: <Kbd006 width="auto" caption="Смена" />,
  },
]
