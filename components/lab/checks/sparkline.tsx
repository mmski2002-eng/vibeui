import type { LabCheck } from "@/components/lab/check-types"

import { Sparkline001 } from "@/registry/components/sparkline/sparkline-001/sparkline-001"
import { Sparkline002 } from "@/registry/components/sparkline/sparkline-002/sparkline-002"

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
]
