import type { LabCheck } from "@/components/lab/check-types"

import { Range001 } from "@/registry/components/range/range-001/range-001"
import { Range002 } from "@/registry/components/range/range-002/range-002"
import { Range003 } from "@/registry/components/range/range-003/range-003"
import { Range004 } from "@/registry/components/range/range-004/range-004"
import { Range005 } from "@/registry/components/range/range-005/range-005"
import { Range006 } from "@/registry/components/range/range-006/range-006"
import { Range007 } from "@/registry/components/range/range-007/range-007"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 52594

export const CHECKS: LabCheck[] = [
  {
    name: "range-001",
    title: "Диапазон цены",
    notes: ["Подпись: Ня", "От: 13733", "До: 10431", "Акцент: #22e194"],
    node: (
      <Range001
        label="Ня"
        defaultFrom={13733}
        defaultTo={10431}
        accent="#22e194"
      />
    ),
  },
  {
    name: "range-002",
    title: "Гистограмма цен",
    notes: ["Подпись: Подпись: тест", "Шаг: 899", "Акцент: #53ba31"],
    node: <Range002 label="Подпись: тест" step={899} accent="#53ba31" />,
  },
  {
    name: "range-003",
    title: "Ползунок дат",
    notes: ["Подпись: Что дальше", "Дней на шкале: 82", "Акцент: #605f04"],
    node: <Range003 label="Что дальше" days={82} accent="#605f04" />,
  },
  {
    name: "range-004",
    title: "Диапазон с полями",
    notes: ["Подпись: Смена", "Шаг: 48644", "Акцент: #76c98c"],
    node: <Range004 label="Смена" step={48644} accent="#76c98c" />,
  },
  {
    name: "range-005",
    title: "Ползунок с подписями",
    notes: ["Подпись: Смена", "Верхнее деление: 4", "Акцент: #002fff"],
    node: <Range005 label="Смена" defaultTo={4} accent="#002fff" />,
  },
  {
    name: "range-006",
    title: "Открытый диапазон",
    notes: ["Подпись: Подпись: тест", "Единица: Ня", "Акцент: #de1272"],
    node: <Range006 label="Подпись: тест" unit="Ня" accent="#de1272" />,
  },
  {
    name: "range-007",
    title: "Готовые диапазоны",
    notes: ["Подпись: Подпись: тест", "Шаг: 1956", "Акцент: #fbba3e"],
    node: <Range007 label="Подпись: тест" step={1956} accent="#fbba3e" />,
  },
]
