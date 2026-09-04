import type { LabCheck } from "@/components/lab/check-types"

import { Collapsible001 } from "@/registry/components/collapsible/collapsible-001/collapsible-001"
import { Collapsible002 } from "@/registry/components/collapsible/collapsible-002/collapsible-002"
import { Collapsible003 } from "@/registry/components/collapsible/collapsible-003/collapsible-003"
import { Collapsible004 } from "@/registry/components/collapsible/collapsible-004/collapsible-004"
import { Collapsible005 } from "@/registry/components/collapsible/collapsible-005/collapsible-005"
import { Collapsible006 } from "@/registry/components/collapsible/collapsible-006/collapsible-006"
import { Collapsible008 } from "@/registry/components/collapsible/collapsible-008/collapsible-008"
import { Collapsible009 } from "@/registry/components/collapsible/collapsible-009/collapsible-009"
import { Collapsible010 } from "@/registry/components/collapsible/collapsible-010/collapsible-010"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 108

export const CHECKS: LabCheck[] = [
  {
    name: "collapsible-001",
    title: "Нативное раскрытие",
    notes: ["Заголовок: Что дальше", "Подсказка: Черновик", "Акцент: #854867"],
    node: (
      <Collapsible001 title="Что дальше" hint="Черновик" accent="#854867" />
    ),
  },
  {
    name: "collapsible-002",
    title: "Анимация высоты",
    notes: ["Заголовок: Смена", "Открыт сразу: false", "Акцент: #8de344"],
    node: <Collapsible002 title="Смена" defaultOpen={false} accent="#8de344" />,
  },
  {
    name: "collapsible-003",
    title: "Читать дальше",
    notes: ["Строк видно: 5", "Заголовок: Черновик", "Акцент: #47644b"],
    node: <Collapsible003 lines={5} title="Черновик" accent="#47644b" />,
  },
  {
    name: "collapsible-004",
    title: "Свёрнутый лог",
    notes: ["Заголовок: Черновик", "Акцент: #ed5616"],
    node: <Collapsible004 title="Черновик" accent="#ed5616" />,
  },
  {
    name: "collapsible-005",
    title: "Взаимоисключающие шаги",
    notes: ["Имя группы: Подпись: тест", "Акцент: #8f8ed0"],
    node: <Collapsible005 groupName="Подпись: тест" accent="#8f8ed0" />,
  },
  {
    name: "collapsible-006",
    title: "Счётчик скрытого",
    notes: ["Видно имён: 5", "Заголовок: Проверка", "Акцент: #3ef600"],
    node: <Collapsible006 visible={5} title="Проверка" accent="#3ef600" />,
  },
  {
    name: "collapsible-008",
    title: "Изменённые настройки",
    notes: ["Заголовок: Что дальше", "Акцент: #ae275d"],
    node: <Collapsible008 title="Что дальше" accent="#ae275d" />,
  },
  {
    name: "collapsible-009",
    title: "Состояние в разметке",
    notes: ["Заголовок: Смена", "Акцент: #54c3b6"],
    node: <Collapsible009 title="Смена" accent="#54c3b6" />,
  },
  {
    name: "collapsible-010",
    title: "Липкие заголовки",
    notes: ["Заголовок: Смена", "Акцент: #ffd739"],
    node: <Collapsible010 title="Смена" accent="#ffd739" />,
  },
]
