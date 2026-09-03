import type { LabCheck } from "@/components/lab/check-types"

import { Alertdialog001 } from "@/registry/components/alert-dialog/alertdialog-001/alertdialog-001"
import { Alertdialog002 } from "@/registry/components/alert-dialog/alertdialog-002/alertdialog-002"
import { Alertdialog003 } from "@/registry/components/alert-dialog/alertdialog-003/alertdialog-003"
import { Alertdialog004 } from "@/registry/components/alert-dialog/alertdialog-004/alertdialog-004"
import { Alertdialog005 } from "@/registry/components/alert-dialog/alertdialog-005/alertdialog-005"
import { Alertdialog006 } from "@/registry/components/alert-dialog/alertdialog-006/alertdialog-006"
import { Alertdialog007 } from "@/registry/components/alert-dialog/alertdialog-007/alertdialog-007"
import { Alertdialog008 } from "@/registry/components/alert-dialog/alertdialog-008/alertdialog-008"
import { Alertdialog009 } from "@/registry/components/alert-dialog/alertdialog-009/alertdialog-009"
import { Alertdialog010 } from "@/registry/components/alert-dialog/alertdialog-010/alertdialog-010"
import { Alertdialog011 } from "@/registry/components/alert-dialog/alertdialog-011/alertdialog-011"
import { Alertdialog012 } from "@/registry/components/alert-dialog/alertdialog-012/alertdialog-012"
import { Alertdialog013 } from "@/registry/components/alert-dialog/alertdialog-013/alertdialog-013"
import { Alertdialog014 } from "@/registry/components/alert-dialog/alertdialog-014/alertdialog-014"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 8027

export const CHECKS: LabCheck[] = [
  {
    name: "alertdialog-001",
    title: "Диалог подтверждения",
    notes: [
      "Вопрос: Подпись: тест",
      "Пояснение: Подпись: тест",
      "Действие: Подпись: тест",
      "Отказ: Что дальше",
      "Акцент: #b47828",
    ],
    node: (
      <Alertdialog001
        title="Подпись: тест"
        text="Подпись: тест"
        confirm="Подпись: тест"
        cancel="Что дальше"
        accent="#b47828"
      />
    ),
  },
  {
    name: "alertdialog-002",
    title: "Подтверждение вводом",
    notes: [
      "Имя цели: Смена",
      "Вопрос: Что дальше",
      "Действие: Что дальше",
      "Цвет опасности: #2fd309",
    ],
    node: (
      <Alertdialog002
        target="Смена"
        title="Что дальше"
        confirm="Что дальше"
        danger="#2fd309"
      />
    ),
  },
  {
    name: "alertdialog-003",
    title: "Несохранённые изменения",
    notes: [
      "Заголовок: Черновик",
      "Уйти без сохранения: Что дальше",
      "Акцент: #975d78",
    ],
    node: (
      <Alertdialog003
        title="Черновик"
        discardLabel="Что дальше"
        accent="#975d78"
      />
    ),
  },
  {
    name: "alertdialog-004",
    title: "Подтверждение с задержкой",
    notes: [
      "Пауза, с: 10",
      "Действие: Подпись: тест",
      "Цвет опасности: #88358d",
    ],
    node: (
      <Alertdialog004 seconds={10} confirm="Подпись: тест" danger="#88358d" />
    ),
  },
  {
    name: "alertdialog-005",
    title: "Массовое подтверждение",
    notes: ["Остаток: 179", "Действие: Что дальше", "Цвет опасности: #b7ba7d"],
    node: <Alertdialog005 more={179} confirm="Что дальше" danger="#b7ba7d" />,
  },
  {
    name: "alertdialog-006",
    title: "Подтверждение с итогом",
    notes: [
      "Вопрос: Подпись: тест",
      "Заголовок ошибки: Смена",
      "Акцент: #f494f0",
    ],
    node: (
      <Alertdialog006
        title="Подпись: тест"
        errorTitle="Смена"
        accent="#f494f0"
      />
    ),
  },
  {
    name: "alertdialog-007",
    title: "Подтверждение с галочкой",
    notes: [
      "Галочка: Что дальше",
      "Действие: Подпись: тест",
      "Акцент: #44a250",
    ],
    node: (
      <Alertdialog007
        optionLabel="Что дальше"
        confirm="Подпись: тест"
        accent="#44a250"
      />
    ),
  },
  {
    name: "alertdialog-008",
    title: "Запрос разрешения",
    notes: ["Вопрос: Смена", "Разрешить: Смена", "Акцент: #5eb3d3"],
    node: <Alertdialog008 title="Смена" allow="Смена" accent="#5eb3d3" />,
  },
  {
    name: "alertdialog-009",
    title: "Выход со всех устройств",
    notes: [
      "Вопрос: Что дальше",
      "Действие: Черновик",
      "Цвет опасности: #8c1ed6",
    ],
    node: (
      <Alertdialog009 title="Что дальше" confirm="Черновик" danger="#8c1ed6" />
    ),
  },
  {
    name: "alertdialog-010",
    title: "Понижение тарифа",
    notes: ["Новый тариф: Проверка", "Действие: Что дальше", "Акцент: #44452f"],
    node: (
      <Alertdialog010 toPlan="Проверка" confirm="Что дальше" accent="#44452f" />
    ),
  },
  {
    name: "alertdialog-011",
    title: "Конфликт версий",
    notes: ["Заголовок: Черновик", "Отмена: Смена", "Акцент: #3f8076"],
    node: <Alertdialog011 title="Черновик" cancel="Смена" accent="#3f8076" />,
  },
  {
    name: "alertdialog-012",
    title: "Подтверждение списания",
    notes: ["Сумма: Смена", "Карта: Подпись: тест", "Акцент: #4ffdae"],
    node: (
      <Alertdialog012 amount="Смена" card="Подпись: тест" accent="#4ffdae" />
    ),
  },
  {
    name: "alertdialog-013",
    title: "Блокировка участника",
    notes: [
      "Участник: Проверка",
      "Действие: Проверка",
      "Цвет опасности: #4eb11f",
    ],
    node: (
      <Alertdialog013 person="Проверка" confirm="Проверка" danger="#4eb11f" />
    ),
  },
  {
    name: "alertdialog-014",
    title: "Подтверждение с отключением",
    notes: ["Вопрос: Проверка", "Действие: Проверка", "Акцент: #e53dac"],
    node: (
      <Alertdialog014 title="Проверка" confirm="Проверка" accent="#e53dac" />
    ),
  },
]
