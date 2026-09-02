import type { ReactNode } from "react"

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

export type AutocompleteCheck = {
  name: string
  title: string
  /** Что подкручено относительно дефолтов — подпись под кадром. */
  notes: string[]
  node: ReactNode
}

/**
 * Прогон категории «Аватар» на нестандартных настройках.
 *
 * Каждый компонент собран так, как его собрал бы человек после Copy for AI:
 * значения контролов заданы явными пропами и заведомо отличаются от дефолтов,
 * фотографии подставлены там, где компонент их принимает. Набор
 * детерминирован — иначе серверный и клиентский рендер разошлись бы, а
 * найденный дефект не повторился бы на следующем открытии страницы.
 */
export const AUTOCOMPLETE_CHECKS: AutocompleteCheck[] = [
  {
    name: "autocomplete-014",
    title: "Мультивыбор с галочками",
    notes: [
      "Подпись: Смена",
      "Плейсхолдер: Плейсхолдер: тест",
      "Кнопка сброса: Кнопка сброса: тест",
      "Акцент: #0ea5e9",
      "Фон: #e11d48",
    ],
    node: (
      <Autocomplete014
        label="Смена"
        placeholder="Плейсхолдер: тест"
        clearLabel="Кнопка сброса: тест"
        accent="#0ea5e9"
        background="#e11d48"
      />
    ),
  },
  {
    name: "autocomplete-001",
    title: "Поле со списком datalist",
    notes: [
      "Подпись: Смена",
      "Плейсхолдер: Плейсхолдер: тест",
      "Подсказка: JPEG или PNG, до 5 МБ",
      "Акцент: #e11d48",
      "Фон: #0ea5e9",
    ],
    node: (
      <Autocomplete001
        label="Смена"
        placeholder="Плейсхолдер: тест"
        hint="JPEG или PNG, до 5 МБ"
        accent="#e11d48"
        background="#0ea5e9"
      />
    ),
  },
  {
    name: "autocomplete-002",
    title: "Подсказки с клавиатуры",
    notes: [
      "Подпись: Команда",
      "Плейсхолдер: Плейсхолдер: тест",
      "Пустой результат: Пустой результат: тест",
      "Акцент: #22c55e",
      "Фон: #22c55e",
    ],
    node: (
      <Autocomplete002
        label="Команда"
        placeholder="Плейсхолдер: тест"
        emptyLabel="Пустой результат: тест"
        accent="#22c55e"
        background="#22c55e"
      />
    ),
  },
  {
    name: "autocomplete-003",
    title: "Выбор тегов",
    notes: [
      "Подпись: Проект «Полёт»",
      "Плейсхолдер: Плейсхолдер: тест",
      "Предел: 8",
      "Акцент: #0ea5e9",
      "Фон: #0ea5e9",
    ],
    node: (
      <Autocomplete003
        label="Проект «Полёт»"
        placeholder="Плейсхолдер: тест"
        max={8}
        accent="#0ea5e9"
        background="#0ea5e9"
      />
    ),
  },
  {
    name: "autocomplete-004",
    title: "Командный поиск",
    notes: [
      "Плейсхолдер: Плейсхолдер: тест",
      "Пустой результат: Пустой результат: тест",
      "Имя списка: Имя списка: тест",
      "Акцент: #0ea5e9",
      "Фон: #e11d48",
    ],
    node: (
      <Autocomplete004
        placeholder="Плейсхолдер: тест"
        emptyLabel="Пустой результат: тест"
        listLabel="Имя списка: тест"
        accent="#0ea5e9"
        background="#e11d48"
      />
    ),
  },
  {
    name: "autocomplete-005",
    title: "Подсказки с сервера",
    notes: [
      "Подпись: Команда",
      "Плейсхолдер: Плейсхолдер: тест",
      "Пауза: 267",
      "Акцент: #22c55e",
      "Фон: #e11d48",
    ],
    node: (
      <Autocomplete005
        label="Команда"
        placeholder="Плейсхолдер: тест"
        delay={267}
        accent="#22c55e"
        background="#e11d48"
      />
    ),
  },
  {
    name: "autocomplete-006",
    title: "Поиск по каталогу",
    notes: [
      "Подпись: Команда",
      "Плейсхолдер: Плейсхолдер: тест",
      "Пустой результат: Пустой результат: тест",
      "Акцент: #0ea5e9",
      "Фон: #0ea5e9",
    ],
    node: (
      <Autocomplete006
        label="Команда"
        placeholder="Плейсхолдер: тест"
        emptyLabel="Пустой результат: тест"
        accent="#0ea5e9"
        background="#0ea5e9"
      />
    ),
  },
  {
    name: "autocomplete-007",
    title: "Недавние запросы",
    notes: [
      "Подпись: Проект «Полёт»",
      "Плейсхолдер: Плейсхолдер: тест",
      "Кнопка очистки: Кнопка очистки: тест",
      "Акцент: #f59e0b",
      "Фон: #0ea5e9",
    ],
    node: (
      <Autocomplete007
        label="Проект «Полёт»"
        placeholder="Плейсхолдер: тест"
        clearLabel="Кнопка очистки: тест"
        accent="#f59e0b"
        background="#0ea5e9"
      />
    ),
  },
  {
    name: "autocomplete-008",
    title: "Домен почты",
    notes: [
      "Подпись: Смена",
      "Плейсхолдер: Плейсхолдер: тест",
      "Строка под полем: Строка под полем: тест",
      "Акцент: #f59e0b",
      "Фон: #0ea5e9",
    ],
    node: (
      <Autocomplete008
        label="Смена"
        placeholder="Плейсхолдер: тест"
        idleHint="Строка под полем: тест"
        accent="#f59e0b"
        background="#0ea5e9"
      />
    ),
  },
  {
    name: "autocomplete-009",
    title: "Код страны",
    notes: [
      "Подпись: Команда",
      "Плейсхолдер: Плейсхолдер: тест",
      "Страна: RS",
      "Акцент: #22c55e",
      "Фон: #22c55e",
    ],
    node: (
      <Autocomplete009
        label="Команда"
        placeholder="Плейсхолдер: тест"
        defaultCode="RS"
        accent="#22c55e"
        background="#22c55e"
      />
    ),
  },
  {
    name: "autocomplete-010",
    title: "Создание значения",
    notes: [
      "Подпись: Смена",
      "Плейсхолдер: Плейсхолдер: тест",
      "Строка создания: Строка создания: тест",
      "Акцент: #e11d48",
      "Фон: #f59e0b",
    ],
    node: (
      <Autocomplete010
        label="Смена"
        placeholder="Плейсхолдер: тест"
        createLabel="Строка создания: тест"
        accent="#e11d48"
        background="#f59e0b"
      />
    ),
  },
  {
    name: "autocomplete-011",
    title: "Упоминание участника",
    notes: [
      "Подпись: Команда",
      "Плейсхолдер: Плейсхолдер: тест",
      "Строка под полем: Строка под полем: тест",
      "Акцент: #e11d48",
      "Фон: #0ea5e9",
    ],
    node: (
      <Autocomplete011
        label="Команда"
        placeholder="Плейсхолдер: тест"
        hintText="Строка под полем: тест"
        accent="#e11d48"
        background="#0ea5e9"
      />
    ),
  },
  {
    name: "autocomplete-012",
    title: "Подсказка в строке",
    notes: [
      "Подпись: Смена",
      "Плейсхолдер: Плейсхолдер: тест",
      "Строка под полем: Строка под полем: тест",
      "Акцент: #0ea5e9",
      "Фон: #e11d48",
    ],
    node: (
      <Autocomplete012
        label="Смена"
        placeholder="Плейсхолдер: тест"
        idleHint="Строка под полем: тест"
        accent="#0ea5e9"
        background="#e11d48"
      />
    ),
  },
  {
    name: "autocomplete-013",
    title: "Отказ и повтор",
    notes: [
      "Подпись: Смена",
      "Плейсхолдер: Плейсхолдер: тест",
      "Состояние: failed",
      "Акцент: #e11d48",
      "Фон: #0ea5e9",
    ],
    node: (
      <Autocomplete013
        label="Смена"
        placeholder="Плейсхолдер: тест"
        defaultState="failed"
        accent="#e11d48"
        background="#0ea5e9"
      />
    ),
  },
  {
    name: "autocomplete-015",
    title: "Поиск с превью",
    notes: [
      "Плейсхолдер: Плейсхолдер: тест",
      "Запрос: Запрос: тест",
      "Подсказка внизу: Подсказка внизу: тест",
      "Акцент: #22c55e",
      "Фон: #0ea5e9",
    ],
    node: (
      <Autocomplete015
        placeholder="Плейсхолдер: тест"
        defaultQuery="Запрос: тест"
        hintText="Подсказка внизу: тест"
        accent="#22c55e"
        background="#0ea5e9"
      />
    ),
  },
]
