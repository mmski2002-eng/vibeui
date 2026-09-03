import type { LabCheck } from "@/components/lab/check-types"

import { Number001 } from "@/registry/components/number-field/number-001/number-001"
import { Number002 } from "@/registry/components/number-field/number-002/number-002"
import { Number003 } from "@/registry/components/number-field/number-003/number-003"
import { Number004 } from "@/registry/components/number-field/number-004/number-004"
import { Number005 } from "@/registry/components/number-field/number-005/number-005"
import { Number006 } from "@/registry/components/number-field/number-006/number-006"
import { Number007 } from "@/registry/components/number-field/number-007/number-007"
import { Number008 } from "@/registry/components/number-field/number-008/number-008"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 8027

export const CHECKS: LabCheck[] = [
  {
    name: "number-001",
    title: "Счётчик числа",
    notes: [
      "Подпись: Подпись: тест",
      "Значение: 1",
      "Единицы: Тест",
      "Акцент: #81165f",
    ],
    node: (
      <Number001
        label="Подпись: тест"
        defaultValue={1}
        unit="Тест"
        accent="#81165f"
      />
    ),
  },
  {
    name: "number-002",
    title: "Счётчик упаковками",
    notes: [
      "Товар: Подпись: тест",
      "Упаковка: 4",
      "Упаковок: 12",
      "Единица: Ок",
      "Акцент: #4aff53",
    ],
    node: (
      <Number002
        label="Подпись: тест"
        pack={4}
        defaultPacks={12}
        unit="Ок"
        accent="#4aff53"
      />
    ),
  },
  {
    name: "number-003",
    title: "Поле с единицей",
    notes: [
      "Подпись: Черновик",
      "Единица: 42",
      "Значение: 2",
      "Акцент: #596197",
    ],
    node: (
      <Number003 label="Черновик" unit="42" defaultValue={2} accent="#596197" />
    ),
  },
  {
    name: "number-004",
    title: "Защита процента",
    notes: [
      "Подпись: Подпись: тест",
      "Процент: 2",
      "Текст ошибки: Подпись: тест",
      "Акцент: #88358d",
    ],
    node: (
      <Number004
        label="Подпись: тест"
        defaultValue={2}
        error="Подпись: тест"
        accent="#88358d"
      />
    ),
  },
  {
    name: "number-005",
    title: "Поле с переключением единиц",
    notes: [
      "Подпись: Подпись: тест",
      "Единица: kg",
      "Значение: 2",
      "Акцент: #ba7dad",
    ],
    node: (
      <Number005
        label="Подпись: тест"
        defaultUnit="kg"
        defaultValue={2}
        accent="#ba7dad"
      />
    ),
  },
  {
    name: "number-006",
    title: "Кнопки прибавления",
    notes: [
      "Подпись: Проверка",
      "Максимум: 5801",
      "Сумма: 2",
      "Единица: 42",
      "Акцент: #13563f",
    ],
    node: (
      <Number006
        label="Проверка"
        max={5801}
        defaultValue={2}
        unit="42"
        accent="#13563f"
      />
    ),
  },
  {
    name: "number-007",
    title: "Дробная оценка",
    notes: [
      "Подпись: Что дальше",
      "Оценка: 1",
      "Верх шкалы: 7",
      "Акцент: #9b06a3",
    ],
    node: (
      <Number007 label="Что дальше" defaultValue={1} max={7} accent="#9b06a3" />
    ),
  },
  {
    name: "number-008",
    title: "Большой шаг с Shift",
    notes: [
      "Подпись: Что дальше",
      "Крупный шаг: 7013",
      "Точный шаг: 827",
      "Акцент: #e3614f",
    ],
    node: (
      <Number008
        label="Что дальше"
        bigStep={7013}
        step={827}
        accent="#e3614f"
      />
    ),
  },
]
