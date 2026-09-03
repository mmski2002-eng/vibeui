import type { LabCheck } from "@/components/lab/check-types"

import { Gantt001 } from "@/registry/components/gantt/gantt-001/gantt-001"
import { Gantt002 } from "@/registry/components/gantt/gantt-002/gantt-002"
import { Gantt003 } from "@/registry/components/gantt/gantt-003/gantt-003"
import { Gantt004 } from "@/registry/components/gantt/gantt-004/gantt-004"
import { Gantt005 } from "@/registry/components/gantt/gantt-005/gantt-005"
import { Gantt006 } from "@/registry/components/gantt/gantt-006/gantt-006"
import { Gantt007 } from "@/registry/components/gantt/gantt-007/gantt-007"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 52594

export const CHECKS: LabCheck[] = [
  {
    name: "gantt-001",
    title: "План работ",
    notes: ["Заголовок: Подпись: тест", "Акцент: #b97f22"],
    node: <Gantt001 title="Подпись: тест" accent="#b97f22" />,
  },
  {
    name: "gantt-002",
    title: "Стрелки зависимостей",
    notes: ["Заголовок: Подпись: тест", "Акцент: #8b676b"],
    node: <Gantt002 heading="Подпись: тест" accent="#8b676b" />,
  },
  {
    name: "gantt-003",
    title: "Ромбы вех",
    notes: ["Заголовок: Проверка", "Акцент: #310e45"],
    node: <Gantt003 heading="Проверка" accent="#310e45" />,
  },
  {
    name: "gantt-004",
    title: "Прогресс внутри полосы",
    notes: ["Заголовок: Что дальше", "Текущая неделя: 3", "Акцент: #046f09"],
    node: <Gantt004 heading="Что дальше" currentWeek={3} accent="#046f09" />,
  },
  {
    name: "gantt-005",
    title: "Дорожки исполнителей",
    notes: ["Заголовок: Подпись: тест", "Акцент: #c98cb0"],
    node: <Gantt005 heading="Подпись: тест" accent="#c98cb0" />,
  },
  {
    name: "gantt-006",
    title: "Свод по неделям",
    notes: ["Масштаб: week", "Заголовок: Смена", "Акцент: #2fffb9"],
    node: <Gantt006 unit="week" heading="Смена" accent="#2fffb9" />,
  },
  {
    name: "gantt-007",
    title: "Критический путь",
    notes: ["Заголовок: Черновик", "Акцент: #92de12"],
    node: <Gantt007 heading="Черновик" accent="#92de12" />,
  },
]
