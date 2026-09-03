import type { LabCheck } from "@/components/lab/check-types"

import { Scrollspy001 } from "@/registry/components/scrollspy/scrollspy-001/scrollspy-001"
import { Scrollspy002 } from "@/registry/components/scrollspy/scrollspy-002/scrollspy-002"
import { Scrollspy003 } from "@/registry/components/scrollspy/scrollspy-003/scrollspy-003"
import { Scrollspy004 } from "@/registry/components/scrollspy/scrollspy-004/scrollspy-004"
import { Scrollspy005 } from "@/registry/components/scrollspy/scrollspy-005/scrollspy-005"
import { Scrollspy006 } from "@/registry/components/scrollspy/scrollspy-006/scrollspy-006"
import { Scrollspy007 } from "@/registry/components/scrollspy/scrollspy-007/scrollspy-007"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 84270

export const CHECKS: LabCheck[] = [
  {
    name: "scrollspy-001",
    title: "Оглавление с подсветкой",
    notes: ["Заголовок: Проверка", "Акцент: #44bf9a"],
    node: <Scrollspy001 title="Проверка" accent="#44bf9a" />,
  },
  {
    name: "scrollspy-002",
    title: "Оглавление статьи",
    notes: ["Заголовок: Что дальше", "Акцент: #ae77fb"],
    node: <Scrollspy002 title="Что дальше" accent="#ae77fb" />,
  },
  {
    name: "scrollspy-003",
    title: "Вложенное оглавление",
    notes: ["Заголовок: Смена", "Акцент: #f6c225"],
    node: <Scrollspy003 title="Смена" accent="#f6c225" />,
  },
  {
    name: "scrollspy-004",
    title: "Прогресс чтения",
    notes: ["Заголовок: Что дальше", "Акцент: #9ef08c"],
    node: <Scrollspy004 title="Что дальше" accent="#9ef08c" />,
  },
  {
    name: "scrollspy-005",
    title: "Липкая полоса раздела",
    notes: ["Подпись панели: Проверка", "Акцент: #0a4114"],
    node: <Scrollspy005 label="Проверка" accent="#0a4114" />,
  },
  {
    name: "scrollspy-006",
    title: "Наверх",
    notes: ["Подпись возврата: Что дальше", "Акцент: #9420b7"],
    node: <Scrollspy006 topLabel="Что дальше" accent="#9420b7" />,
  },
  {
    name: "scrollspy-007",
    title: "Компактное оглавление",
    notes: ["Порог сворачивания: 369", "Акцент: #888e6d"],
    node: <Scrollspy007 compactAt={369} accent="#888e6d" />,
  },
]
