import type { LabCheck } from "@/components/lab/check-types"

import { Autocomplete014 } from "@/registry/components/autocomplete/autocomplete-014/autocomplete-014"
import { Autocomplete001 } from "@/registry/components/autocomplete/autocomplete-001/autocomplete-001"
import { Autocomplete002 } from "@/registry/components/autocomplete/autocomplete-002/autocomplete-002"
import { Autocomplete003 } from "@/registry/components/autocomplete/autocomplete-003/autocomplete-003"
import { Autocomplete004 } from "@/registry/components/autocomplete/autocomplete-004/autocomplete-004"
import { Autocomplete005 } from "@/registry/components/autocomplete/autocomplete-005/autocomplete-005"
import { Autocomplete006 } from "@/registry/components/autocomplete/autocomplete-006/autocomplete-006"
import { Autocomplete007 } from "@/registry/components/autocomplete/autocomplete-007/autocomplete-007"
import { Autocomplete008 } from "@/registry/components/autocomplete/autocomplete-008/autocomplete-008"
import { Autocomplete009 } from "@/registry/components/autocomplete/autocomplete-009/autocomplete-009"
import { Autocomplete010 } from "@/registry/components/autocomplete/autocomplete-010/autocomplete-010"
import { Autocomplete011 } from "@/registry/components/autocomplete/autocomplete-011/autocomplete-011"
import { Autocomplete012 } from "@/registry/components/autocomplete/autocomplete-012/autocomplete-012"
import { Autocomplete013 } from "@/registry/components/autocomplete/autocomplete-013/autocomplete-013"
import { Autocomplete015 } from "@/registry/components/autocomplete/autocomplete-015/autocomplete-015"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 8027

export const CHECKS: LabCheck[] = [
  {
    name: "autocomplete-014",
    title: "Мультивыбор с галочками",
    notes: [
      "Подпись: Подпись: тест",
      "Плейсхолдер: Подпись: тест",
      "Кнопка сброса: Подпись: тест",
      "Акцент: #165fb4",
    ],
    node: (
      <Autocomplete014
        label="Подпись: тест"
        placeholder="Подпись: тест"
        clearLabel="Подпись: тест"
        accent="#165fb4"
      />
    ),
  },
  {
    name: "autocomplete-001",
    title: "Поле со списком datalist",
    notes: [
      "Подпись: Смена",
      "Плейсхолдер: Смена",
      "Подсказка: Что дальше",
      "Акцент: #ff532f",
    ],
    node: (
      <Autocomplete001
        label="Смена"
        placeholder="Смена"
        hint="Что дальше"
        accent="#ff532f"
      />
    ),
  },
  {
    name: "autocomplete-002",
    title: "Подсказки с клавиатуры",
    notes: [
      "Подпись: Смена",
      "Плейсхолдер: Черновик",
      "Пустой результат: Что дальше",
      "Акцент: #975d78",
    ],
    node: (
      <Autocomplete002
        label="Смена"
        placeholder="Черновик"
        emptyLabel="Что дальше"
        accent="#975d78"
      />
    ),
  },
  {
    name: "autocomplete-003",
    title: "Выбор тегов",
    notes: [
      "Подпись: Подпись: тест",
      "Плейсхолдер: Подпись: тест",
      "Предел: 3",
      "Акцент: #8de477",
    ],
    node: (
      <Autocomplete003
        label="Подпись: тест"
        placeholder="Подпись: тест"
        max={3}
        accent="#8de477"
      />
    ),
  },
  {
    name: "autocomplete-004",
    title: "Командный поиск",
    notes: [
      "Плейсхолдер: Проверка",
      "Пустой результат: Подпись: тест",
      "Имя списка: Подпись: тест",
      "Акцент: #a40ef4",
    ],
    node: (
      <Autocomplete004
        placeholder="Проверка"
        emptyLabel="Подпись: тест"
        listLabel="Подпись: тест"
        accent="#a40ef4"
      />
    ),
  },
  {
    name: "autocomplete-005",
    title: "Подсказки с сервера",
    notes: [
      "Подпись: Черновик",
      "Плейсхолдер: Что дальше",
      "Пауза: 198",
      "Акцент: #9544a2",
    ],
    node: (
      <Autocomplete005
        label="Черновик"
        placeholder="Что дальше"
        delay={198}
        accent="#9544a2"
      />
    ),
  },
  {
    name: "autocomplete-006",
    title: "Поиск по каталогу",
    notes: [
      "Подпись: Проверка",
      "Плейсхолдер: Проверка",
      "Пустой результат: Что дальше",
      "Акцент: #b3d3e3",
    ],
    node: (
      <Autocomplete006
        label="Проверка"
        placeholder="Проверка"
        emptyLabel="Что дальше"
        accent="#b3d3e3"
      />
    ),
  },
  {
    name: "autocomplete-007",
    title: "Недавние запросы",
    notes: [
      "Подпись: Что дальше",
      "Плейсхолдер: Подпись: тест",
      "Кнопка очистки: Черновик",
      "Акцент: #c3b59e",
    ],
    node: (
      <Autocomplete007
        label="Что дальше"
        placeholder="Подпись: тест"
        clearLabel="Черновик"
        accent="#c3b59e"
      />
    ),
  },
  {
    name: "autocomplete-008",
    title: "Домен почты",
    notes: [
      "Подпись: Что дальше",
      "Плейсхолдер: Смена",
      "Строка под полем: Черновик",
      "Акцент: #6e1c3f",
    ],
    node: (
      <Autocomplete008
        label="Что дальше"
        placeholder="Смена"
        idleHint="Черновик"
        accent="#6e1c3f"
      />
    ),
  },
  {
    name: "autocomplete-009",
    title: "Код страны",
    notes: [
      "Подпись: Подпись: тест",
      "Плейсхолдер: Смена",
      "Страна: KZ",
      "Акцент: #724ffd",
    ],
    node: (
      <Autocomplete009
        label="Подпись: тест"
        placeholder="Смена"
        defaultCode="KZ"
        accent="#724ffd"
      />
    ),
  },
  {
    name: "autocomplete-010",
    title: "Создание значения",
    notes: [
      "Подпись: Черновик",
      "Плейсхолдер: Черновик",
      "Строка создания: Что дальше",
      "Акцент: #b11ffd",
    ],
    node: (
      <Autocomplete010
        label="Черновик"
        placeholder="Черновик"
        createLabel="Что дальше"
        accent="#b11ffd"
      />
    ),
  },
  {
    name: "autocomplete-011",
    title: "Упоминание участника",
    notes: [
      "Подпись: Смена",
      "Плейсхолдер: Черновик",
      "Строка под полем: Проверка",
      "Акцент: #a973f5",
    ],
    node: (
      <Autocomplete011
        label="Смена"
        placeholder="Черновик"
        hintText="Проверка"
        accent="#a973f5"
      />
    ),
  },
  {
    name: "autocomplete-012",
    title: "Подсказка в строке",
    notes: [
      "Подпись: Что дальше",
      "Плейсхолдер: Черновик",
      "Строка под полем: Проверка",
      "Акцент: #44ac54",
    ],
    node: (
      <Autocomplete012
        label="Что дальше"
        placeholder="Черновик"
        idleHint="Проверка"
        accent="#44ac54"
      />
    ),
  },
  {
    name: "autocomplete-013",
    title: "Отказ и повтор",
    notes: [
      "Подпись: Подпись: тест",
      "Плейсхолдер: Смена",
      "Состояние: idle",
      "Акцент: #5cfb8c",
    ],
    node: (
      <Autocomplete013
        label="Подпись: тест"
        placeholder="Смена"
        defaultState="idle"
        accent="#5cfb8c"
      />
    ),
  },
  {
    name: "autocomplete-015",
    title: "Поиск с превью",
    notes: [
      "Плейсхолдер: Подпись: тест",
      "Запрос: Ок",
      "Подсказка внизу: Черновик",
      "Акцент: #2844ed",
    ],
    node: (
      <Autocomplete015
        placeholder="Подпись: тест"
        defaultQuery="Ок"
        hintText="Черновик"
        accent="#2844ed"
      />
    ),
  },
]
