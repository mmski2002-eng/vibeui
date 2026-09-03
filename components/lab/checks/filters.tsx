import type { LabCheck } from "@/components/lab/check-types"

import { Filters001 } from "@/registry/components/filters/filters-001/filters-001"
import { Filters002 } from "@/registry/components/filters/filters-002/filters-002"
import { Filters003 } from "@/registry/components/filters/filters-003/filters-003"
import { Filters004 } from "@/registry/components/filters/filters-004/filters-004"
import { Filters005 } from "@/registry/components/filters/filters-005/filters-005"
import { Filters006 } from "@/registry/components/filters/filters-006/filters-006"
import { Filters007 } from "@/registry/components/filters/filters-007/filters-007"
import { Filters008 } from "@/registry/components/filters/filters-008/filters-008"
import { Filters009 } from "@/registry/components/filters/filters-009/filters-009"
import { Filters010 } from "@/registry/components/filters/filters-010/filters-010"
import { Filters011 } from "@/registry/components/filters/filters-011/filters-011"
import { Filters012 } from "@/registry/components/filters/filters-012/filters-012"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 68432

export const CHECKS: LabCheck[] = [
  {
    name: "filters-001",
    title: "Конструктор фильтров",
    notes: ["Найдено: Смена", "Акцент: #6f1349"],
    node: <Filters001 found="Смена" accent="#6f1349" />,
  },
  {
    name: "filters-002",
    title: "Активные чипы",
    notes: [
      "Счётчик: Черновик",
      "Кнопка сброса: Подпись: тест",
      "Акцент: #de1e7c",
    ],
    node: (
      <Filters002
        total="Черновик"
        resetLabel="Подпись: тест"
        accent="#de1e7c"
      />
    ),
  },
  {
    name: "filters-003",
    title: "Панель фасетов",
    notes: ["Заголовок: Что дальше", "Акцент: #73555f"],
    node: <Filters003 title="Что дальше" accent="#73555f" />,
  },
  {
    name: "filters-004",
    title: "Числовой диапазон",
    notes: ["Заголовок: Ок", "Единица: Ок", "Акцент: #81409a"],
    node: <Filters004 title="Ок" unit="Ок" accent="#81409a" />,
  },
  {
    name: "filters-005",
    title: "Пресеты дат",
    notes: ["Заголовок: Черновик", "Свой период: Черновик", "Акцент: #dea3f0"],
    node: (
      <Filters005 title="Черновик" customLabel="Черновик" accent="#dea3f0" />
    ),
  },
  {
    name: "filters-006",
    title: "Поиск по значениям",
    notes: ["Заголовок: Смена", "Плейсхолдер: Что дальше", "Акцент: #5fb80d"],
    node: (
      <Filters006 title="Смена" placeholder="Что дальше" accent="#5fb80d" />
    ),
  },
  {
    name: "filters-007",
    title: "Сохранённые виды",
    notes: [
      "Заголовок: Смена",
      "Кнопка сохранения: Черновик",
      "Акцент: #6cc2c3",
    ],
    node: <Filters007 title="Смена" saveLabel="Черновик" accent="#6cc2c3" />,
  },
  {
    name: "filters-008",
    title: "Компактный лист",
    notes: [
      "Заголовок: Смена",
      "Активных условий: 8",
      "Найдено: Черновик",
      "Акцент: #2dc92b",
    ],
    node: (
      <Filters008 title="Смена" active={8} found="Черновик" accent="#2dc92b" />
    ),
  },
  {
    name: "filters-009",
    title: "Применение по кнопке",
    notes: [
      "Заголовок: Подпись: тест",
      "Записей без фильтров: 9595",
      "Акцент: #556665",
    ],
    node: (
      <Filters009 title="Подпись: тест" baseCount={9595} accent="#556665" />
    ),
  },
  {
    name: "filters-010",
    title: "Чипы-переключатели",
    notes: [
      "Заголовок: Черновик",
      "Кнопка сброса: Проверка",
      "Акцент: #8f6b8e",
    ],
    node: (
      <Filters010 title="Черновик" resetLabel="Проверка" accent="#8f6b8e" />
    ),
  },
  {
    name: "filters-011",
    title: "Диапазон полями даты",
    notes: ["Заголовок: Проверка", "Акцент: #f1cdc4"],
    node: <Filters011 title="Проверка" accent="#f1cdc4" />,
  },
  {
    name: "filters-012",
    title: "Готовые запросы",
    notes: [
      "Заголовок: Черновик",
      "Кнопка применения: Проверка",
      "Акцент: #7940b4",
    ],
    node: (
      <Filters012 title="Черновик" applyLabel="Проверка" accent="#7940b4" />
    ),
  },
]
