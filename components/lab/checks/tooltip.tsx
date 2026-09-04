import type { LabCheck } from "@/components/lab/check-types"

import { Tooltip001 } from "@/registry/components/tooltip/tooltip-001/tooltip-001"
import { Tooltip002 } from "@/registry/components/tooltip/tooltip-002/tooltip-002"
import { Tooltip003 } from "@/registry/components/tooltip/tooltip-003/tooltip-003"
import { Tooltip004 } from "@/registry/components/tooltip/tooltip-004/tooltip-004"
import { Tooltip005 } from "@/registry/components/tooltip/tooltip-005/tooltip-005"
import { Tooltip006 } from "@/registry/components/tooltip/tooltip-006/tooltip-006"
import { Tooltip007 } from "@/registry/components/tooltip/tooltip-007/tooltip-007"
import { Tooltip008 } from "@/registry/components/tooltip/tooltip-008/tooltip-008"
import { Tooltip009 } from "@/registry/components/tooltip/tooltip-009/tooltip-009"
import { Tooltip010 } from "@/registry/components/tooltip/tooltip-010/tooltip-010"
import { Tooltip011 } from "@/registry/components/tooltip/tooltip-011/tooltip-011"
import { Tooltip012 } from "@/registry/components/tooltip/tooltip-012/tooltip-012"
import { Tooltip013 } from "@/registry/components/tooltip/tooltip-013/tooltip-013"
import { Tooltip014 } from "@/registry/components/tooltip/tooltip-014/tooltip-014"
import { Tooltip015 } from "@/registry/components/tooltip/tooltip-015/tooltip-015"
import { Tooltip016 } from "@/registry/components/tooltip/tooltip-016/tooltip-016"
import { Tooltip017 } from "@/registry/components/tooltip/tooltip-017/tooltip-017"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 68432

export const CHECKS: LabCheck[] = [
  {
    name: "tooltip-001",
    title: "Подсказка с клавиатуры",
    notes: ["Подсказка: Смена", "Сторона: top", "Показана: true"],
    node: <Tooltip001 tip="Смена" side="top" open={true} />,
  },
  {
    name: "tooltip-002",
    title: "Своя против нативной",
    notes: [
      "Подсказка: Смена",
      "Левая кнопка: Черновик",
      "Правая кнопка: Черновик",
    ],
    node: (
      <Tooltip002 tip="Смена" nativeLabel="Черновик" customLabel="Черновик" />
    ),
  },
  {
    name: "tooltip-003",
    title: "Подсказка с сочетанием",
    notes: ["Действие: Подпись: тест", "Кнопка: Что дальше"],
    node: <Tooltip003 tip="Подпись: тест" triggerLabel="Что дальше" />,
  },
  {
    name: "tooltip-004",
    title: "Панель иконок",
    notes: ["Сторона: top"],
    node: <Tooltip004 side="top" />,
  },
  {
    name: "tooltip-005",
    title: "Подсказка с переносом",
    notes: ["Подпись: Что дальше", "Ширина: Что дальше"],
    node: <Tooltip005 label="Что дальше" tipWidth="Что дальше" />,
  },
  {
    name: "tooltip-006",
    title: "Переворот у края",
    notes: ["Подсказка: Что дальше"],
    node: <Tooltip006 tip="Что дальше" />,
  },
  {
    name: "tooltip-007",
    title: "Подсказка к полю",
    notes: ["Подпись поля: Что дальше", "Требования: Смена"],
    node: <Tooltip007 label="Что дальше" hint="Смена" />,
  },
  {
    name: "tooltip-008",
    title: "Подчёркнутый термин",
    notes: ["Термин: Черновик", "Объяснение: Черновик"],
    node: <Tooltip008 term="Черновик" definition="Черновик" />,
  },
  {
    name: "tooltip-009",
    title: "Подсказка с задержкой",
    notes: ["Задержка, с: 1", "Подсказка: Черновик"],
    node: <Tooltip009 delay={1} tip="Черновик" />,
  },
  {
    name: "tooltip-010",
    title: "Горячая клавиша в меню",
    notes: ["Подпись чипа: Что дальше"],
    node: <Tooltip010 shortcutLabel="Что дальше" />,
  },
  {
    name: "tooltip-011",
    title: "Задержка при наведении",
    notes: ["Задержка, с: 0"],
    node: <Tooltip011 delay={0} />,
  },
  {
    name: "tooltip-012",
    title: "Пузырь с вопросом",
    notes: ["Заголовок: Проверка", "Пояснение: Черновик"],
    node: <Tooltip012 heading="Проверка" detail="Черновик" />,
  },
  {
    name: "tooltip-013",
    title: "Смена стороны",
    notes: ["Подсказка: Проверка"],
    node: <Tooltip013 tip="Проверка" />,
  },
  {
    name: "tooltip-014",
    title: "Причина недоступности",
    notes: [
      "Подпись кнопки: Подпись: тест",
      "Причина: Проверка",
      "Значок замка: true",
    ],
    node: (
      <Tooltip014 label="Подпись: тест" reason="Проверка" showLock={true} />
    ),
  },
  {
    name: "tooltip-015",
    title: "Карточка предпросмотра",
    notes: [
      "Подпись ссылки: Черновик",
      "Подпись под превью: Черновик",
      "Акцент: #2dc92b",
    ],
    node: <Tooltip015 label="Черновик" caption="Черновик" accent="#2dc92b" />,
  },
  {
    name: "tooltip-016",
    title: "Подсказка по фокусу",
    notes: ["Подпись поля: Подпись: тест", "Инструкция: Что дальше"],
    node: <Tooltip016 label="Подпись: тест" hint="Что дальше" />,
  },
  {
    name: "tooltip-017",
    title: "Подсказка усечённого текста",
    notes: ["Пояснение: Черновик"],
    node: <Tooltip017 note="Черновик" />,
  },
]
