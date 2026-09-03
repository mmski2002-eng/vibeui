import type { LabCheck } from "@/components/lab/check-types"

import { Slider001 } from "@/registry/components/slider/slider-001/slider-001"
import { Slider002 } from "@/registry/components/slider/slider-002/slider-002"
import { Slider003 } from "@/registry/components/slider/slider-003/slider-003"
import { Slider004 } from "@/registry/components/slider/slider-004/slider-004"
import { Slider005 } from "@/registry/components/slider/slider-005/slider-005"
import { Slider006 } from "@/registry/components/slider/slider-006/slider-006"
import { Slider007 } from "@/registry/components/slider/slider-007/slider-007"
import { Slider008 } from "@/registry/components/slider/slider-008/slider-008"
import { Slider009 } from "@/registry/components/slider/slider-009/slider-009"
import { Slider010 } from "@/registry/components/slider/slider-010/slider-010"
import { Slider011 } from "@/registry/components/slider/slider-011/slider-011"
import { Slider012 } from "@/registry/components/slider/slider-012/slider-012"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 60513

export const CHECKS: LabCheck[] = [
  {
    name: "slider-001",
    title: "Ползунок значения",
    notes: [
      "Подпись: Смена",
      "Единица: Что дальше",
      "Значение: 1",
      "Акцент: #f7a319",
    ],
    node: (
      <Slider001
        label="Смена"
        unit="Что дальше"
        defaultValue={1}
        accent="#f7a319"
      />
    ),
  },
  {
    name: "slider-002",
    title: "Ползунок с подписью значения",
    notes: [
      "Подпись: Смена",
      "Значение: 0",
      "Приписка: Что дальше",
      "Левый конец: Что дальше",
      "Правый конец: Проверка",
      "Акцент: #3a0ad7",
    ],
    node: (
      <Slider002
        label="Смена"
        defaultValue={0}
        suffix="Что дальше"
        minText="Что дальше"
        maxText="Проверка"
        accent="#3a0ad7"
      />
    ),
  },
  {
    name: "slider-003",
    title: "Ползунок с делениями",
    notes: ["Подпись: Смена", "Ступень: 0", "Акцент: #12550d"],
    node: <Slider003 label="Смена" defaultValue={0} accent="#12550d" />,
  },
  {
    name: "slider-004",
    title: "Ползунок диапазона",
    notes: [
      "Подпись: Тест",
      "Нижняя граница: 6268",
      "Верхняя граница: 16925",
      "Единица: Ня",
      "Акцент: #78d5af",
    ],
    node: (
      <Slider004
        label="Тест"
        defaultFrom={6268}
        defaultTo={16925}
        unit="Ня"
        accent="#78d5af"
      />
    ),
  },
  {
    name: "slider-005",
    title: "Ползунок громкости",
    notes: [
      "Подпись: Подпись: тест",
      "Уровень: 0",
      "Кнопка: Подпись: тест",
      "Акцент: #7542d4",
    ],
    node: (
      <Slider005
        label="Подпись: тест"
        defaultValue={0}
        muteText="Подпись: тест"
        accent="#7542d4"
      />
    ),
  },
  {
    name: "slider-006",
    title: "Ползунок по шагам",
    notes: [
      "Подпись: Проверка",
      "Значение: 0",
      "Единица: Тест",
      "Строка шага: Проверка",
      "Акцент: #e50e8e",
    ],
    node: (
      <Slider006
        label="Проверка"
        defaultValue={0}
        unit="Тест"
        stepText="Проверка"
        accent="#e50e8e"
      />
    ),
  },
  {
    name: "slider-007",
    title: "Вертикальный ползунок",
    notes: [
      "Подпись: Черновик",
      "Значение: 2",
      "Единица: 42",
      "Акцент: #107b7b",
    ],
    node: (
      <Slider007 label="Черновик" defaultValue={2} unit="42" accent="#107b7b" />
    ),
  },
  {
    name: "slider-008",
    title: "Ползунок с числовым полем",
    notes: [
      "Подпись: Проверка",
      "Значение: 2",
      "Единица: Подпись: тест",
      "Подсказка: Смена",
      "Акцент: #6c2ccf",
    ],
    node: (
      <Slider008
        label="Проверка"
        defaultValue={2}
        unit="Подпись: тест"
        hintText="Смена"
        accent="#6c2ccf"
      />
    ),
  },
  {
    name: "slider-009",
    title: "Громкость в рамке",
    notes: ["Подпись: Что дальше", "Уровень: 0", "Акцент: #97ae5e"],
    node: <Slider009 label="Что дальше" defaultValue={0} accent="#97ae5e" />,
  },
  {
    name: "slider-010",
    title: "Ползунок-линейка",
    notes: [
      "Подпись: Подпись: тест",
      "Значение: 2",
      "Единица: Подпись: тест",
      "Акцент: #6d4392",
    ],
    node: (
      <Slider010
        label="Подпись: тест"
        defaultValue={2}
        unit="Подпись: тест"
        accent="#6d4392"
      />
    ),
  },
  {
    name: "slider-011",
    title: "Ползунок цены",
    notes: [
      "Подпись: Подпись: тест",
      "Цена: 2",
      "Валюта: Ок",
      "Подпись поля: Черновик",
      "Акцент: #eeda3d",
    ],
    node: (
      <Slider011
        label="Подпись: тест"
        defaultValue={2}
        currency="Ок"
        fieldText="Черновик"
        accent="#eeda3d"
      />
    ),
  },
  {
    name: "slider-012",
    title: "Ползунок с зонами",
    notes: ["Подпись: Что дальше", "Значение: 0", "Единица: Тест"],
    node: <Slider012 label="Что дальше" defaultValue={0} unit="Тест" />,
  },
]
