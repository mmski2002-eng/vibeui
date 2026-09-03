import type { LabCheck } from "@/components/lab/check-types"

import { Kanban001 } from "@/registry/components/kanban/kanban-001/kanban-001"
import { Kanban002 } from "@/registry/components/kanban/kanban-002/kanban-002"
import { Kanban003 } from "@/registry/components/kanban/kanban-003/kanban-003"
import { Kanban004 } from "@/registry/components/kanban/kanban-004/kanban-004"
import { Kanban005 } from "@/registry/components/kanban/kanban-005/kanban-005"
import { Kanban006 } from "@/registry/components/kanban/kanban-006/kanban-006"
import { Kanban007 } from "@/registry/components/kanban/kanban-007/kanban-007"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 60513

export const CHECKS: LabCheck[] = [
  {
    name: "kanban-001",
    title: "Канбан-доска",
    notes: ["Акцент: #f10165"],
    node: <Kanban001 accent="#f10165" />,
  },
  {
    name: "kanban-002",
    title: "Доска с лимитом задач",
    notes: ["Акцент: #5a5af7", "Предупреждение: #a31914"],
    node: <Kanban002 accent="#5a5af7" warn="#a31914" />,
  },
  {
    name: "kanban-003",
    title: "Доска со сроками и исполнителями",
    notes: ["Сегодня: 2026-03-14", "Акцент: #471c5a", "Просрочка: #cb647d"],
    node: <Kanban003 today="2026-03-14" accent="#471c5a" late="#cb647d" />,
  },
  {
    name: "kanban-004",
    title: "Сворачиваемые колонки",
    notes: ["Акцент: #aa3a0a"],
    node: <Kanban004 accent="#aa3a0a" />,
  },
  {
    name: "kanban-005",
    title: "Доска с фильтром по исполнителю",
    notes: ["Подпись «все»: 42", "Акцент: #062812"],
    node: <Kanban005 everyone="42" accent="#062812" />,
  },
  {
    name: "kanban-006",
    title: "Перенос карточки с клавиатуры",
    notes: ["Подсказка: Смена", "Акцент: #ef2254"],
    node: <Kanban006 hint="Смена" accent="#ef2254" />,
  },
  {
    name: "kanban-007",
    title: "Доска с итогами колонок",
    notes: ["Единица: Тест", "Акцент: #a178d5"],
    node: <Kanban007 unit="Тест" accent="#a178d5" />,
  },
]
