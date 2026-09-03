import type { LabCheck } from "@/components/lab/check-types"

import { Currency001 } from "@/registry/components/currency-input/currency-001/currency-001"
import { Currency002 } from "@/registry/components/currency-input/currency-002/currency-002"
import { Currency003 } from "@/registry/components/currency-input/currency-003/currency-003"
import { Currency004 } from "@/registry/components/currency-input/currency-004/currency-004"
import { Currency005 } from "@/registry/components/currency-input/currency-005/currency-005"
import { Currency006 } from "@/registry/components/currency-input/currency-006/currency-006"
import { Currency007 } from "@/registry/components/currency-input/currency-007/currency-007"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 23865

export const CHECKS: LabCheck[] = [
  {
    name: "currency-001",
    title: "Поле суммы",
    notes: [
      "Подпись: Черновик",
      "Валюта: Тест",
      "Подсказка: Черновик",
      "Акцент: #37be39",
    ],
    node: (
      <Currency001
        label="Черновик"
        currency="Тест"
        hint="Черновик"
        accent="#37be39"
      />
    ),
  },
  {
    name: "currency-002",
    title: "Выбор валюты",
    notes: [
      "Подпись: Что дальше",
      "Валюта: CNY",
      "Подпись под полем: Проверка",
      "Акцент: #abc8bc",
    ],
    node: (
      <Currency002
        label="Что дальше"
        defaultCurrency="CNY"
        hint="Проверка"
        accent="#abc8bc"
      />
    ),
  },
  {
    name: "currency-003",
    title: "Ввод как в кассе",
    notes: [
      "Подпись: Проверка",
      "Знак валюты: Тест",
      "Пояснение: Проверка",
      "Акцент: #30c872",
    ],
    node: (
      <Currency003
        label="Проверка"
        currency="Тест"
        hint="Проверка"
        accent="#30c872"
      />
    ),
  },
  {
    name: "currency-004",
    title: "Конвертер по курсу",
    notes: [
      "Заголовок: Подпись: тест",
      "Сумма: 2",
      "Подпись связи: Подпись: тест",
      "Акцент: #9b1e7a",
    ],
    node: (
      <Currency004
        label="Подпись: тест"
        defaultValue={2}
        linkText="Подпись: тест"
        accent="#9b1e7a"
      />
    ),
  },
  {
    name: "currency-005",
    title: "Лимит бюджета",
    notes: [
      "Подпись: Проверка",
      "Потолок: 496105",
      "Сумма: 2",
      "Акцент: #ee3a5f",
    ],
    node: (
      <Currency005
        label="Проверка"
        limit={496105}
        defaultValue={2}
        accent="#ee3a5f"
      />
    ),
  },
  {
    name: "currency-006",
    title: "Комиссия перевода",
    notes: [
      "Подпись: Проверка",
      "Комиссия, %: 7",
      "Минимум комиссии: 676",
      "Акцент: #a1176d",
    ],
    node: (
      <Currency006 label="Проверка" percent={7} minFee={676} accent="#a1176d" />
    ),
  },
  {
    name: "currency-007",
    title: "Цена «от и до»",
    notes: [
      "Заголовок: Тест",
      "Нижняя граница: Тест",
      "Верхняя граница: Смена",
      "Акцент: #6ced76",
    ],
    node: (
      <Currency007
        legend="Тест"
        defaultFrom="Тест"
        defaultTo="Смена"
        accent="#6ced76"
      />
    ),
  },
]
