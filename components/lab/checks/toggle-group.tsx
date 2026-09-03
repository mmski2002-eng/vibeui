import type { LabCheck } from "@/components/lab/check-types"

import { Togglegroup001 } from "@/registry/components/toggle-group/togglegroup-001/togglegroup-001"
import { Togglegroup002 } from "@/registry/components/toggle-group/togglegroup-002/togglegroup-002"
import { Togglegroup003 } from "@/registry/components/toggle-group/togglegroup-003/togglegroup-003"
import { Togglegroup004 } from "@/registry/components/toggle-group/togglegroup-004/togglegroup-004"
import { Togglegroup005 } from "@/registry/components/toggle-group/togglegroup-005/togglegroup-005"
import { Togglegroup006 } from "@/registry/components/toggle-group/togglegroup-006/togglegroup-006"
import { Togglegroup007 } from "@/registry/components/toggle-group/togglegroup-007/togglegroup-007"
import { Togglegroup008 } from "@/registry/components/toggle-group/togglegroup-008/togglegroup-008"
import { Togglegroup009 } from "@/registry/components/toggle-group/togglegroup-009/togglegroup-009"
import { Togglegroup010 } from "@/registry/components/toggle-group/togglegroup-010/togglegroup-010"
import { Togglegroup011 } from "@/registry/components/toggle-group/togglegroup-011/togglegroup-011"
import { Togglegroup012 } from "@/registry/components/toggle-group/togglegroup-012/togglegroup-012"
import { Togglegroup013 } from "@/registry/components/toggle-group/togglegroup-013/togglegroup-013"
import { Togglegroup014 } from "@/registry/components/toggle-group/togglegroup-014/togglegroup-014"
import { Togglegroup015 } from "@/registry/components/toggle-group/togglegroup-015/togglegroup-015"
import { Togglegroup016 } from "@/registry/components/toggle-group/togglegroup-016/togglegroup-016"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 8027

export const CHECKS: LabCheck[] = [
  {
    name: "togglegroup-001",
    title: "Группа выравнивания",
    notes: [
      "Выравнивание: center",
      "Имя группы: Подпись: тест",
      "Акцент: #7c2581",
    ],
    node: (
      <Togglegroup001
        defaultValue="center"
        label="Подпись: тест"
        accent="#7c2581"
      />
    ),
  },
  {
    name: "togglegroup-002",
    title: "Группа начертаний",
    notes: [
      "Имя группы: Что дальше",
      "Образец: Подпись: тест",
      "Акцент: #288323",
    ],
    node: (
      <Togglegroup002
        label="Что дальше"
        text="Подпись: тест"
        accent="#288323"
      />
    ),
  },
  {
    name: "togglegroup-003",
    title: "Вид списка",
    notes: [
      "Вид: grid",
      "Имя группы: Черновик",
      "Заголовок: Смена",
      "Акцент: #d309d5",
    ],
    node: (
      <Togglegroup003
        defaultValue="grid"
        label="Черновик"
        heading="Смена"
        accent="#d309d5"
      />
    ),
  },
  {
    name: "togglegroup-004",
    title: "Фильтр по дням недели",
    notes: [
      "Имя группы: Что дальше",
      "Пояснение: Подпись: тест",
      "Пресет: Подпись: тест",
      "Акцент: #e9676e",
    ],
    node: (
      <Togglegroup004
        label="Что дальше"
        hint="Подпись: тест"
        presetText="Подпись: тест"
        accent="#e9676e"
      />
    ),
  },
  {
    name: "togglegroup-005",
    title: "Выбор размера",
    notes: ["Размер: L", "Имя группы: Подпись: тест", "Акцент: #e47745"],
    node: (
      <Togglegroup005 defaultValue="L" label="Подпись: тест" accent="#e47745" />
    ),
  },
  {
    name: "togglegroup-006",
    title: "Группа каналов",
    notes: [
      "Имя группы: Проверка",
      "Текст пустого выбора: Проверка",
      "Акцент: #89a40e",
    ],
    node: (
      <Togglegroup006 label="Проверка" emptyNote="Проверка" accent="#89a40e" />
    ),
  },
  {
    name: "togglegroup-007",
    title: "Панель форматирования",
    notes: ["Выравнивание: right", "Имя панели: Черновик", "Акцент: #13563f"],
    node: (
      <Togglegroup007 defaultAlign="right" label="Черновик" accent="#13563f" />
    ),
  },
  {
    name: "togglegroup-008",
    title: "Обязательная группа",
    notes: [
      "Имя группы: Что дальше",
      "Текст отказа: Что дальше",
      "Акцент: #9b06a3",
    ],
    node: (
      <Togglegroup008
        label="Что дальше"
        minMessage="Что дальше"
        accent="#9b06a3"
      />
    ),
  },
  {
    name: "togglegroup-009",
    title: "Переключатель представления данных",
    notes: [
      "Вид: grid",
      "Имя группы: Проверка",
      "Заголовок: Черновик",
      "Акцент: #614fd3",
    ],
    node: (
      <Togglegroup009
        defaultValue="grid"
        label="Проверка"
        heading="Черновик"
        accent="#614fd3"
      />
    ),
  },
  {
    name: "togglegroup-010",
    title: "Форматирование в строке",
    notes: ["Имя группы: Смена", "Образец: Проверка", "Акцент: #b59e58"],
    node: <Togglegroup010 label="Смена" text="Проверка" accent="#b59e58" />,
  },
  {
    name: "togglegroup-011",
    title: "Вертикальное выравнивание",
    notes: [
      "Выравнивание: middle",
      "Имя группы: Смена",
      "Подпись карточки: Черновик",
      "Акцент: #6e1c3f",
    ],
    node: (
      <Togglegroup011
        defaultValue="middle"
        label="Смена"
        chipText="Черновик"
        accent="#6e1c3f"
      />
    ),
  },
  {
    name: "togglegroup-012",
    title: "Переключатель периода",
    notes: ["Период: month", "Имя группы: Что дальше", "Акцент: #263972"],
    node: (
      <Togglegroup012
        defaultValue="month"
        label="Что дальше"
        accent="#263972"
      />
    ),
  },
  {
    name: "togglegroup-013",
    title: "Способ доставки",
    notes: ["Способ: courier", "Акцент: #fdaedf", "Имя группы: Черновик"],
    node: (
      <Togglegroup013
        defaultValue="courier"
        accent="#fdaedf"
        label="Черновик"
      />
    ),
  },
  {
    name: "togglegroup-014",
    title: "Приоритет с подсказками",
    notes: ["Приоритет: high", "Акцент: #4eb11f", "Имя группы: Проверка"],
    node: (
      <Togglegroup014 defaultValue="high" accent="#4eb11f" label="Проверка" />
    ),
  },
  {
    name: "togglegroup-015",
    title: "Фильтр задач",
    notes: ["Фильтр: all", "Акцент: #9be53d", "Имя группы: Проверка"],
    node: (
      <Togglegroup015 defaultValue="all" accent="#9be53d" label="Проверка" />
    ),
  },
  {
    name: "togglegroup-016",
    title: "Сбрасываемый фильтр",
    notes: [
      "Начальный фильтр: progress",
      "Акцент: #f5a933",
      "Имя группы: Черновик",
    ],
    node: (
      <Togglegroup016
        defaultValue="progress"
        accent="#f5a933"
        label="Черновик"
      />
    ),
  },
]
