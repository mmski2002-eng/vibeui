import type { LabCheck } from "@/components/lab/check-types"

import { Popover001 } from "@/registry/components/popover/popover-001/popover-001"
import { Popover002 } from "@/registry/components/popover/popover-002/popover-002"
import { Popover003 } from "@/registry/components/popover/popover-003/popover-003"
import { Popover004 } from "@/registry/components/popover/popover-004/popover-004"
import { Popover005 } from "@/registry/components/popover/popover-005/popover-005"
import { Popover006 } from "@/registry/components/popover/popover-006/popover-006"
import { Popover007 } from "@/registry/components/popover/popover-007/popover-007"
import { Popover008 } from "@/registry/components/popover/popover-008/popover-008"
import { Popover009 } from "@/registry/components/popover/popover-009/popover-009"
import { Popover010 } from "@/registry/components/popover/popover-010/popover-010"
import { Popover011 } from "@/registry/components/popover/popover-011/popover-011"
import { Popover012 } from "@/registry/components/popover/popover-012/popover-012"
import { Popover013 } from "@/registry/components/popover/popover-013/popover-013"
import { Popover014 } from "@/registry/components/popover/popover-014/popover-014"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 68432

export const CHECKS: LabCheck[] = [
  {
    name: "popover-001",
    title: "Всплывающая справка",
    notes: [
      "Кнопка: Смена",
      "Заголовок: Смена",
      "Действие: Смена",
      "Акцент: #d4e090",
    ],
    node: (
      <Popover001 defaultOpen         label="Смена"
        title="Смена"
        actionLabel="Смена"
        accent="#d4e090"
      />
    ),
  },
  {
    name: "popover-002",
    title: "Быстрое добавление",
    notes: [
      "Кнопка: Смена",
      "Подпись поля: Подпись: тест",
      "Подпись списка: Подпись: тест",
      "Отправка: Что дальше",
      "Акцент: #335392",
    ],
    node: (
      <Popover002 defaultOpen         label="Смена"
        fieldLabel="Подпись: тест"
        listLabel="Подпись: тест"
        submitLabel="Что дальше"
        accent="#335392"
      />
    ),
  },
  {
    name: "popover-003",
    title: "Подтверждение во всплывашке",
    notes: [
      "Кнопка: Подпись: тест",
      "Подтверждение: Проверка",
      "Отмена: Черновик",
      "Опасность: #e5e6de",
    ],
    node: (
      <Popover003 defaultOpen         label="Подпись: тест"
        confirmLabel="Проверка"
        cancelLabel="Черновик"
        danger="#e5e6de"
      />
    ),
  },
  {
    name: "popover-004",
    title: "Настройки списка",
    notes: [
      "Кнопка: Черновик",
      "Группа сортировки: Смена",
      "Группа колонок: Что дальше",
      "Акцент: #5fb80d",
    ],
    node: (
      <Popover004 defaultOpen         label="Черновик"
        sortsLabel="Смена"
        columnsLabel="Что дальше"
        accent="#5fb80d"
      />
    ),
  },
  {
    name: "popover-005",
    title: "Выбор цвета",
    notes: [
      "Кнопка: Смена",
      "Пояснение: Черновик",
      "Выбран: Жёлтый",
      "Акцент: #c2c33d",
    ],
    node: (
      <Popover005 defaultOpen         label="Смена"
        hint="Черновик"
        selected="Жёлтый"
        accent="#c2c33d"
      />
    ),
  },
  {
    name: "popover-006",
    title: "Подсказка рядом с полем",
    notes: [
      "Слово: Черновик",
      "Заголовок: Черновик",
      "Ссылка: Проверка",
      "Акцент: #2b8299",
    ],
    node: (
      <Popover006 defaultOpen         term="Черновик"
        title="Черновик"
        linkLabel="Проверка"
        accent="#2b8299"
      />
    ),
  },
  {
    name: "popover-007",
    title: "Колокольчик уведомлений",
    notes: [
      "Непрочитанных: 95",
      "Заголовок: Подпись: тест",
      "Подвал: Что дальше",
      "Акцент: #dd7cbc",
    ],
    node: (
      <Popover007 defaultOpen         count={95}
        title="Подпись: тест"
        footerLabel="Что дальше"
        accent="#dd7cbc"
      />
    ),
  },
  {
    name: "popover-008",
    title: "Вложенная всплывашка",
    notes: [
      "Кнопка: Подпись: тест",
      "Заголовок: Черновик",
      "Вложенный пункт: Черновик",
      "Акцент: #cdc4b4",
    ],
    node: (
      <Popover008 defaultOpen         label="Подпись: тест"
        title="Черновик"
        nestedLabel="Черновик"
        accent="#cdc4b4"
      />
    ),
  },
  {
    name: "popover-009",
    title: "Быстрая правка",
    notes: [
      "Кнопка: Что дальше",
      "Подпись поля: Подпись: тест",
      "Значение: Проверка",
      "Сохранить: Черновик",
      "Отмена: Проверка",
      "Акцент: #2628e1",
    ],
    node: (
      <Popover009 defaultOpen         label="Что дальше"
        fieldLabel="Подпись: тест"
        value="Проверка"
        saveLabel="Черновик"
        cancelLabel="Проверка"
        accent="#2628e1"
      />
    ),
  },
  {
    name: "popover-010",
    title: "Карточка пользователя",
    notes: [
      "Имя: Черновик",
      "Роль: Проверка",
      "Действие: Проверка",
      "Акцент: #13d739",
    ],
    node: (
      <Popover010 defaultOpen         name="Черновик"
        role="Проверка"
        actionLabel="Проверка"
        accent="#13d739"
      />
    ),
  },
  {
    name: "popover-011",
    title: "Выбор даты у поля",
    notes: [
      "Подпись поля: Смена",
      "Плейсхолдер: Подпись: тест",
      "Акцент: #1656bf",
    ],
    node: (
      <Popover011 defaultOpen label="Смена" placeholder="Подпись: тест" accent="#1656bf" />
    ),
  },
  {
    name: "popover-012",
    title: "Фильтр списка",
    notes: [
      "Подпись кнопки: Отбор",
      "Заголовок панели: Что показывать",
      "Подпись применения: Готово",
      "Акцент: #2a9d8f",
    ],
    node: (
      <Popover012
        defaultOpen
        label="Отбор"
        title="Что показывать"
        applyLabel="Готово"
        accent="#2a9d8f"
      />
    ),
  },
  {
    name: "popover-013",
    title: "Горячие клавиши",
    notes: [
      "Подпись кнопки: Клавиши",
      "Заголовок панели: Быстрые действия",
      "Акцент: #9d4edd",
    ],
    node: (
      <Popover013
        defaultOpen
        label="Клавиши"
        title="Быстрые действия"
        accent="#9d4edd"
      />
    ),
  },
  {
    name: "popover-014",
    title: "Выбор реакции",
    notes: [
      "Подпись кнопки: Отметить",
      "Выбранная реакция: Отлично",
      "Акцент: #f4a261",
    ],
    node: (
      <Popover014
        defaultOpen
        label="Отметить"
        defaultValue="Отлично"
        accent="#f4a261"
      />
    ),
  },
]