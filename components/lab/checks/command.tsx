import type { LabCheck } from "@/components/lab/check-types"

import { Command001 } from "@/registry/components/command/command-001/command-001"
import { Command002 } from "@/registry/components/command/command-002/command-002"
import { Command003 } from "@/registry/components/command/command-003/command-003"
import { Command004 } from "@/registry/components/command/command-004/command-004"
import { Command005 } from "@/registry/components/command/command-005/command-005"
import { Command006 } from "@/registry/components/command/command-006/command-006"
import { Command007 } from "@/registry/components/command/command-007/command-007"
import { Command008 } from "@/registry/components/command/command-008/command-008"
import { Command009 } from "@/registry/components/command/command-009/command-009"
import { Command010 } from "@/registry/components/command/command-010/command-010"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 68432

export const CHECKS: LabCheck[] = [
  {
    name: "command-001",
    title: "Командная палитра",
    notes: [
      "Кнопка: Смена",
      "Подсказка: Смена",
      "Пустой ответ: Смена",
      "Акцент: #d4e090",
    ],
    node: (
      <Command001
        triggerLabel="Смена"
        placeholder="Смена"
        emptyText="Смена"
        accent="#d4e090"
      />
    ),
  },
  {
    name: "command-002",
    title: "Палитра в строке",
    notes: [
      "Подсказка: Смена",
      "Имя палитры: Подпись: тест",
      "Пустой ответ: Подпись: тест",
      "Строка клавиш: Что дальше",
      "Акцент: #335392",
    ],
    node: (
      <Command002
        placeholder="Смена"
        label="Подпись: тест"
        emptyText="Подпись: тест"
        hintText="Что дальше"
        accent="#335392"
      />
    ),
  },
  {
    name: "command-003",
    title: "Недавние команды",
    notes: [
      "Подсказка: Подпись: тест",
      "Заголовок истории: Проверка",
      "Кнопка очистки: Черновик",
      "Акцент: #e5e6de",
    ],
    node: (
      <Command003
        placeholder="Подпись: тест"
        recentText="Проверка"
        clearLabel="Черновик"
        accent="#e5e6de"
      />
    ),
  },
  {
    name: "command-004",
    title: "Вложенные команды",
    notes: [
      "Подсказка: Черновик",
      "Подсказка уровня: Смена",
      "Строка клавиш: Что дальше",
      "Акцент: #5fb80d",
    ],
    node: (
      <Command004
        placeholder="Черновик"
        childPlaceholder="Смена"
        hintText="Что дальше"
        accent="#5fb80d"
      />
    ),
  },
  {
    name: "command-005",
    title: "Поиск по проекту",
    notes: ["Подсказка: Смена", "Акцент: #b1fb6c"],
    node: <Command005 placeholder="Смена" accent="#b1fb6c" />,
  },
  {
    name: "command-006",
    title: "Шпаргалка сочетаний",
    notes: ["Подсказка: Проверка", "Пустой ответ: Смена", "Акцент: #e448d1"],
    node: (
      <Command006 placeholder="Проверка" emptyText="Смена" accent="#e448d1" />
    ),
  },
  {
    name: "command-007",
    title: "Подсказки синтаксиса",
    notes: [
      "Подсказка: Проверка",
      "Строка легенды: Подпись: тест",
      "Акцент: #99f555",
    ],
    node: (
      <Command007
        placeholder="Проверка"
        leadText="Подпись: тест"
        accent="#99f555"
      />
    ),
  },
  {
    name: "command-008",
    title: "Переход к файлу",
    notes: ["Подсказка: Что дальше", "Чип режима: 42", "Акцент: #7cbc8f"],
    node: (
      <Command008 placeholder="Что дальше" chipText="42" accent="#7cbc8f" />
    ),
  },
  {
    name: "command-009",
    title: "Действия над выделением",
    notes: [
      "Объект: Подпись: тест",
      "Тип объекта: Ня",
      "Подсказка: Черновик",
      "Акцент: #c4b4df",
    ],
    node: (
      <Command009
        target="Подпись: тест"
        targetKind="Ня"
        placeholder="Черновик"
        accent="#c4b4df"
      />
    ),
  },
  {
    name: "command-010",
    title: "Загрузка результатов",
    notes: [
      "Задержка, мс: 1182",
      "Подсказка: Подпись: тест",
      "Пустой ответ: Проверка",
      "Акцент: #02f302",
    ],
    node: (
      <Command010
        delay={1182}
        placeholder="Подпись: тест"
        emptyText="Проверка"
        accent="#02f302"
      />
    ),
  },
]
