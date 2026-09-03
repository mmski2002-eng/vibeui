import type { LabCheck } from "@/components/lab/check-types"

import { Drawer001 } from "@/registry/components/drawer/drawer-001/drawer-001"
import { Drawer002 } from "@/registry/components/drawer/drawer-002/drawer-002"
import { Drawer003 } from "@/registry/components/drawer/drawer-003/drawer-003"
import { Drawer004 } from "@/registry/components/drawer/drawer-004/drawer-004"
import { Drawer005 } from "@/registry/components/drawer/drawer-005/drawer-005"
import { Drawer006 } from "@/registry/components/drawer/drawer-006/drawer-006"
import { Drawer007 } from "@/registry/components/drawer/drawer-007/drawer-007"
import { Drawer008 } from "@/registry/components/drawer/drawer-008/drawer-008"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 60513

export const CHECKS: LabCheck[] = [
  {
    name: "drawer-001",
    title: "Боковая шторка",
    notes: [
      "Кнопка: Смена",
      "Заголовок: Что дальше",
      "Действие: Черновик",
      "Отмена: Смена",
      "Акцент: #140747",
    ],
    node: (
      <Drawer001
        triggerLabel="Смена"
        title="Что дальше"
        primaryLabel="Черновик"
        cancelLabel="Смена"
        accent="#140747"
      />
    ),
  },
  {
    name: "drawer-002",
    title: "Шторка действий",
    notes: [
      "Кнопка: Что дальше",
      "Объект: Что дальше",
      "Отмена: Проверка",
      "Акцент: #3a0ad7",
    ],
    node: (
      <Drawer002
        triggerLabel="Что дальше"
        title="Что дальше"
        cancelLabel="Проверка"
        accent="#3a0ad7"
      />
    ),
  },
  {
    name: "drawer-003",
    title: "Шторка фильтров",
    notes: [
      "Заголовок: Смена",
      "Применить: Смена",
      "Сброс: Смена",
      "Акцент: #ef2254",
    ],
    node: (
      <Drawer003
        title="Смена"
        applyLabel="Смена"
        resetLabel="Смена"
        accent="#ef2254"
      />
    ),
  },
  {
    name: "drawer-004",
    title: "Шторка подробностей",
    notes: [
      "Заголовок: Смена",
      "Статус: Подпись: тест",
      "История: Проверка",
      "Акцент: #ea8b34",
    ],
    node: (
      <Drawer004
        title="Смена"
        status="Подпись: тест"
        historyLabel="Проверка"
        accent="#ea8b34"
      />
    ),
  },
  {
    name: "drawer-005",
    title: "Шторка корзины",
    notes: [
      "Заголовок: Подпись: тест",
      "Доставка: 2298",
      "Валюта: 42",
      "Акцент: #3ca143",
    ],
    node: (
      <Drawer005
        title="Подпись: тест"
        delivery={2298}
        currency="42"
        accent="#3ca143"
      />
    ),
  },
  {
    name: "drawer-006",
    title: "Шторка с защитой от закрытия",
    notes: [
      "Заголовок: Смена",
      "Предупреждение: Проверка",
      "Сохранить: Смена",
      "Акцент: #8ec4f3",
    ],
    node: (
      <Drawer006
        title="Смена"
        warning="Проверка"
        saveLabel="Смена"
        accent="#8ec4f3"
      />
    ),
  },
  {
    name: "drawer-007",
    title: "Шторка для чтения",
    notes: [
      "Заголовок: Проверка",
      "Принять: Смена",
      "Согласие: Подпись: тест",
      "Акцент: #7c9fc1",
    ],
    node: (
      <Drawer007
        title="Проверка"
        acceptLabel="Смена"
        agreeLabel="Подпись: тест"
        accent="#7c9fc1"
      />
    ),
  },
  {
    name: "drawer-008",
    title: "Пошаговая шторка",
    notes: [
      "Заголовок: Подпись: тест",
      "Финал: Смена",
      "Далее: Смена",
      "Акцент: #cf7c43",
    ],
    node: (
      <Drawer008
        title="Подпись: тест"
        finishLabel="Смена"
        nextLabel="Смена"
        accent="#cf7c43"
      />
    ),
  },
]
