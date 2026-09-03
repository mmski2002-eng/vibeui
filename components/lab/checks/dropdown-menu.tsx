import type { LabCheck } from "@/components/lab/check-types"

import { Dropdown001 } from "@/registry/components/dropdown-menu/dropdown-001/dropdown-001"
import { Dropdown002 } from "@/registry/components/dropdown-menu/dropdown-002/dropdown-002"
import { Dropdown003 } from "@/registry/components/dropdown-menu/dropdown-003/dropdown-003"
import { Dropdown004 } from "@/registry/components/dropdown-menu/dropdown-004/dropdown-004"
import { Dropdown005 } from "@/registry/components/dropdown-menu/dropdown-005/dropdown-005"
import { Dropdown006 } from "@/registry/components/dropdown-menu/dropdown-006/dropdown-006"
import { Dropdown007 } from "@/registry/components/dropdown-menu/dropdown-007/dropdown-007"
import { Dropdown008 } from "@/registry/components/dropdown-menu/dropdown-008/dropdown-008"
import { Dropdown009 } from "@/registry/components/dropdown-menu/dropdown-009/dropdown-009"
import { Dropdown010 } from "@/registry/components/dropdown-menu/dropdown-010/dropdown-010"
import { Dropdown011 } from "@/registry/components/dropdown-menu/dropdown-011/dropdown-011"
import { Dropdown012 } from "@/registry/components/dropdown-menu/dropdown-012/dropdown-012"
import { Dropdown013 } from "@/registry/components/dropdown-menu/dropdown-013/dropdown-013"
import { Dropdown014 } from "@/registry/components/dropdown-menu/dropdown-014/dropdown-014"
import { Dropdown015 } from "@/registry/components/dropdown-menu/dropdown-015/dropdown-015"
import { Dropdown016 } from "@/registry/components/dropdown-menu/dropdown-016/dropdown-016"
import { Dropdown017 } from "@/registry/components/dropdown-menu/dropdown-017/dropdown-017"
import { Dropdown018 } from "@/registry/components/dropdown-menu/dropdown-018/dropdown-018"
import { Dropdown019 } from "@/registry/components/dropdown-menu/dropdown-019/dropdown-019"
import { Dropdown020 } from "@/registry/components/dropdown-menu/dropdown-020/dropdown-020"
import { Dropdown021 } from "@/registry/components/dropdown-menu/dropdown-021/dropdown-021"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 15946

export const CHECKS: LabCheck[] = [
  {
    name: "dropdown-001",
    title: "Привязанное меню",
    notes: ["Кнопка: Что дальше", "Развернуто: true", "Акцент: #1cf16e"],
    node: <Dropdown001 trigger="Что дальше" open={true} accent="#1cf16e" />,
  },
  {
    name: "dropdown-002",
    title: "Меню с разделами",
    notes: [
      "Кнопка: Подпись: тест",
      "Сторона: left",
      "Подпись: Проверка",
      "Акцент: #83a214",
    ],
    node: (
      <Dropdown002
        trigger="Подпись: тест"
        align="left"
        caption="Проверка"
        accent="#83a214"
      />
    ),
  },
  {
    name: "dropdown-003",
    title: "Меню с сочетаниями клавиш",
    notes: ["Кнопка: Что дальше", "Подсказка: Ня", "Акцент: #12b3de"],
    node: <Dropdown003 trigger="Что дальше" keysLabel="Ня" accent="#12b3de" />,
  },
  {
    name: "dropdown-004",
    title: "Меню с флажками",
    notes: [
      "Кнопка: Черновик",
      "Отметка: dot",
      "Подпись: Черновик",
      "Акцент: #69271a",
    ],
    node: (
      <Dropdown004
        trigger="Черновик"
        mark="dot"
        caption="Черновик"
        accent="#69271a"
      />
    ),
  },
  {
    name: "dropdown-005",
    title: "Выбор темы",
    notes: [
      "Кнопка: Что дальше",
      "Тема: Как в системе",
      "Подпись: Проверка",
      "Акцент: #505a9b",
    ],
    node: (
      <Dropdown005
        trigger="Что дальше"
        value="Как в системе"
        caption="Проверка"
        accent="#505a9b"
      />
    ),
  },
  {
    name: "dropdown-006",
    title: "Вложенное подменю",
    notes: [
      "Кнопка: Черновик",
      "Сторона подменю: left",
      "Подпись: Что дальше",
      "Акцент: #d2cfeb",
    ],
    node: (
      <Dropdown006
        trigger="Черновик"
        side="left"
        caption="Что дальше"
        accent="#d2cfeb"
      />
    ),
  },
  {
    name: "dropdown-007",
    title: "Опасная зона",
    notes: [
      "Кнопка: Тест",
      "Опасный пункт: Проверка",
      "Подпись: Что дальше",
      "Акцент: #5fbf39",
    ],
    node: (
      <Dropdown007
        trigger="Тест"
        dangerLabel="Проверка"
        caption="Что дальше"
        accent="#5fbf39"
      />
    ),
  },
  {
    name: "dropdown-008",
    title: "Меню аккаунта",
    notes: ["Имя: Смена", "Тариф: Ок", "Акцент: #96d4e0"],
    node: <Dropdown008 name="Смена" plan="Ок" accent="#96d4e0" />,
  },
  {
    name: "dropdown-009",
    title: "Меню сортировки",
    notes: ["Подпись: Черновик", "Поле: Автор", "Акцент: #1e8fc2"],
    node: <Dropdown009 label="Черновик" value="Автор" accent="#1e8fc2" />,
  },
  {
    name: "dropdown-010",
    title: "Пункты с пояснением",
    notes: ["Кнопка: Проверка", "Ширина меню, rem: 23", "Акцент: #5fb6be"],
    node: <Dropdown010 trigger="Проверка" menuWidth={23} accent="#5fb6be" />,
  },
  {
    name: "dropdown-011",
    title: "Список с поиском",
    notes: ["Подпись: Смена", "Подсказка поиска: Черновик", "Акцент: #5f6b0b"],
    node: <Dropdown011 label="Смена" placeholder="Черновик" accent="#5f6b0b" />,
  },
  {
    name: "dropdown-012",
    title: "Массовые действия",
    notes: ["Заголовок: Проверка", "Кнопка меню: Проверка", "Акцент: #de581a"],
    node: (
      <Dropdown012 title="Проверка" actionLabel="Проверка" accent="#de581a" />
    ),
  },
  {
    name: "dropdown-013",
    title: "Меню сессии",
    notes: [
      "Имя: Проверка",
      "Почта: Подпись: тест",
      "Должность: Смена",
      "Акцент: #c86a96",
    ],
    node: (
      <Dropdown013
        name="Проверка"
        email="Подпись: тест"
        role="Смена"
        accent="#c86a96"
      />
    ),
  },
  {
    name: "dropdown-014",
    title: "Действия строки",
    notes: ["Строка: Черновик", "Подпись: Смена", "Акцент: #921e8f"],
    node: <Dropdown014 row="Черновик" meta="Смена" accent="#921e8f" />,
  },
  {
    name: "dropdown-015",
    title: "Подменю выгрузки",
    notes: ["Кнопка: Черновик", "Сторона подменю: left", "Акцент: #32512d"],
    node: <Dropdown015 trigger="Черновик" side="left" accent="#32512d" />,
  },
  {
    name: "dropdown-016",
    title: "Фильтр по меткам",
    notes: ["Кнопка: Смена", "Подпись: Смена", "Акцент: #164ada"],
    node: <Dropdown016 trigger="Смена" caption="Смена" accent="#164ada" />,
  },
  {
    name: "dropdown-017",
    title: "Меню заказа",
    notes: ["Поле: Приоритет", "Акцент: #3753ed"],
    node: <Dropdown017 value="Приоритет" accent="#3753ed" />,
  },
  {
    name: "dropdown-018",
    title: "Выбор исполнителя",
    notes: ["Подсказка поиска: Черновик", "Акцент: #b929f0"],
    node: <Dropdown018 placeholder="Черновик" accent="#b929f0" />,
  },
  {
    name: "dropdown-019",
    title: "Раздвоенная кнопка",
    notes: ["Действие: Сохранить", "Развернуто: true", "Акцент: #2f6df6"],
    node: <Dropdown019 action="Сохранить" open={true} accent="#2f6df6" />,
  },
  {
    name: "dropdown-020",
    title: "Меню, которое становится листом",
    notes: ["Кнопка: Действия", "Заголовок листа: Файл", "Развернуто: true"],
    node: <Dropdown020 trigger="Действия" title="Файл" open={true} accent="#0f9d6b" />,
  },
  {
    name: "dropdown-021",
    title: "Меню присутствия",
    notes: ["Имя: Женя Осипов", "Статус: busy", "Развернуто: true"],
    node: <Dropdown021 name="Женя Осипов" status="busy" open={true} accent="#c0416a" />,
  },
]
