import type { LabCheck } from "@/components/lab/check-types"

import { Sparkline001 } from "@/registry/components/sparkline/sparkline-001/sparkline-001"
import { Sparkline002 } from "@/registry/components/sparkline/sparkline-002/sparkline-002"
import { Sparkline003 } from "@/registry/components/sparkline/sparkline-003/sparkline-003"
import { Sparkline004 } from "@/registry/components/sparkline/sparkline-004/sparkline-004"
import { Sparkline005 } from "@/registry/components/sparkline/sparkline-005/sparkline-005"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 84270

export const CHECKS: LabCheck[] = [
  {
    name: "sparkline-001",
    title: "Спарклайн показателя",
    notes: [
      "Подпись: Проверка",
      "Значение: Проверка",
      "Изменение: 21",
      "Единица: Ок",
      "Акцент: #ae77fb",
    ],
    node: (
      <Sparkline001
        label="Проверка"
        value="Проверка"
        delta={21}
        unit="Ок"
        accent="#ae77fb"
      />
    ),
  },
  {
    name: "sparkline-002",
    title: "Таблица со спарклайнами",
    notes: ["Заголовок таблицы: Смена", "Период: Проверка", "Акцент: #254e64"],
    node: <Sparkline002 caption="Смена" period="Проверка" accent="#254e64" />,
  },
  {
    name: "sparkline-003",
    title: "Спарклайн столбиками",
    notes: ["Подпись: Проверка", "Значение: 21", "Акцент: #1f7a5c"],
    node: <Sparkline003 label="Проверка" value="21" accent="#1f7a5c" />,
  },
  {
    name: "sparkline-004",
    title: "Ряд исходов",
    notes: ["Подпись: Черновик", "Цвет успеха: #2f6df6"],
    node: <Sparkline004 label="Черновик" accent="#2f6df6" />,
  },
  {
    name: "sparkline-005",
    title: "Спарклайн с зоной нормы",
    notes: ["Подпись: Проверка", "Норма: 120–150", "Акцент: #c0416a"],
    node: (
      <Sparkline005 label="Проверка" low={120} high={150} accent="#c0416a" />
    ),
  },
]
