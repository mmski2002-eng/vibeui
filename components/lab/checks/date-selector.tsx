import type { LabCheck } from "@/components/lab/check-types"

import { Date001 } from "@/registry/components/date-selector/date-001/date-001"
import { Date002 } from "@/registry/components/date-selector/date-002/date-002"
import { Date003 } from "@/registry/components/date-selector/date-003/date-003"
import { Date004 } from "@/registry/components/date-selector/date-004/date-004"
import { Date005 } from "@/registry/components/date-selector/date-005/date-005"
import { Date006 } from "@/registry/components/date-selector/date-006/date-006"
import { Date007 } from "@/registry/components/date-selector/date-007/date-007"
import { Date008 } from "@/registry/components/date-selector/date-008/date-008"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 15946

export const CHECKS: LabCheck[] = [
  {
    name: "date-001",
    title: "Поле даты",
    notes: ["Подпись: Что дальше", "Пояснение: Смена", "Акцент: #f16ec8"],
    node: <Date001 label="Что дальше" hint="Смена" accent="#f16ec8" />,
  },
  {
    name: "date-002",
    title: "Кнопка календаря",
    notes: [
      "Подпись: Смена",
      "Дата: 2026-03-14",
      "Подпись кнопки: Смена",
      "Акцент: #8ef37e",
    ],
    node: (
      <Date002
        label="Смена"
        defaultValue="2026-03-14"
        openLabel="Смена"
        accent="#8ef37e"
      />
    ),
  },
  {
    name: "date-003",
    title: "Диапазон двумя полями",
    notes: [
      "Заголовок: Черновик",
      "Заезд: 2025-11-23",
      "Подпись итога: Что дальше",
      "Акцент: #bc09da",
    ],
    node: (
      <Date003
        legend="Черновик"
        defaultFrom="2025-11-23"
        durationLabel="Что дальше"
        accent="#bc09da"
      />
    ),
  },
  {
    name: "date-004",
    title: "Дата и время",
    notes: [
      "Заголовок: Что дальше",
      "Часовой пояс: Подпись: тест",
      "Акцент: #10eda0",
    ],
    node: (
      <Date004 label="Что дальше" timezone="Подпись: тест" accent="#10eda0" />
    ),
  },
  {
    name: "date-005",
    title: "Относительные пресеты",
    notes: [
      "Подпись: Проверка",
      "Дата: 2026-03-14",
      "Локаль: de-DE",
      "Акцент: #34148a",
    ],
    node: (
      <Date005
        label="Проверка"
        defaultValue="2026-03-14"
        locale="de-DE"
        accent="#34148a"
      />
    ),
  },
  {
    name: "date-006",
    title: "Предупреждение о сроке",
    notes: ["Подпись: Проверка", "Порог «скоро»: 27", "Акцент: #c8f993"],
    node: <Date006 label="Проверка" soonInDays={27} accent="#c8f993" />,
  },
  {
    name: "date-007",
    title: "Три списка",
    notes: [
      "Заголовок: Черновик",
      "Первый год: 1941",
      "Последний год: 2004",
      "Акцент: #1a9165",
    ],
    node: (
      <Date007
        legend="Черновик"
        fromYear={1941}
        toYear={2004}
        accent="#1a9165"
      />
    ),
  },
  {
    name: "date-008",
    title: "Слоты по четверти часа",
    notes: ["Подпись: Смена", "Шаг, мин: 48", "Акцент: #505a9b"],
    node: <Date008 label="Смена" stepMinutes={48} accent="#505a9b" />,
  },
]
