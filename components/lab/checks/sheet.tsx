import type { LabCheck } from "@/components/lab/check-types"

import { Sheet001 } from "@/registry/components/sheet/sheet-001/sheet-001"
import { Sheet002 } from "@/registry/components/sheet/sheet-002/sheet-002"
import { Sheet003 } from "@/registry/components/sheet/sheet-003/sheet-003"
import { Sheet004 } from "@/registry/components/sheet/sheet-004/sheet-004"
import { Sheet005 } from "@/registry/components/sheet/sheet-005/sheet-005"
import { Sheet006 } from "@/registry/components/sheet/sheet-006/sheet-006"
import { Sheet007 } from "@/registry/components/sheet/sheet-007/sheet-007"
import { Menu007 } from "@/registry/components/sheet/menu-007/menu-007"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 52594

export const CHECKS: LabCheck[] = [
  {
    name: "sheet-001",
    title: "Нижний лист",
    notes: [
      "Кнопка: Подпись: тест",
      "Заголовок: Подпись: тест",
      "Действие: Черновик",
      "Акцент: #948b67",
    ],
    node: (
      <Sheet001
        triggerLabel="Подпись: тест"
        title="Подпись: тест"
        primaryLabel="Черновик"
        accent="#948b67"
      />
    ),
  },
  {
    name: "sheet-002",
    title: "Лист настроек",
    notes: ["Кнопка: Что дальше", "Заголовок: Смена", "Акцент: #0e45a3"],
    node: <Sheet002 triggerLabel="Что дальше" title="Смена" accent="#0e45a3" />,
  },
  {
    name: "sheet-003",
    title: "Лист с вкладками",
    notes: [
      "Заголовок: Что дальше",
      "Кнопка: Подпись: тест",
      "Акцент: #09f876",
    ],
    node: (
      <Sheet003
        title="Что дальше"
        triggerLabel="Подпись: тест"
        accent="#09f876"
      />
    ),
  },
  {
    name: "sheet-004",
    title: "Лист файла",
    notes: ["Файл: Подпись: тест", "Скачать: Смена", "Акцент: #af002f"],
    node: (
      <Sheet004
        fileName="Подпись: тест"
        downloadLabel="Смена"
        accent="#af002f"
      />
    ),
  },
  {
    name: "sheet-005",
    title: "Лист выбора",
    notes: ["Заголовок: Проверка", "Поиск: Черновик", "Акцент: #92de12"],
    node: <Sheet005 title="Проверка" searchLabel="Черновик" accent="#92de12" />,
  },
  {
    name: "sheet-006",
    title: "Лист подтверждения",
    notes: [
      "Вопрос: Проверка",
      "Подтвердить: Черновик",
      "Опасный цвет: #fbba3e",
    ],
    node: (
      <Sheet006 title="Проверка" confirmLabel="Черновик" danger="#fbba3e" />
    ),
  },
  {
    name: "sheet-007",
    title: "Вложенный лист",
    notes: ["Заголовок: Проверка", "Кнопка: Что дальше", "Акцент: #0fbb47"],
    node: (
      <Sheet007 title="Проверка" triggerLabel="Что дальше" accent="#0fbb47" />
    ),
  },
  {
    name: "menu-007",
    title: "Лист действий",
    notes: ["Объект: Проверка", "Отмена: Черновик", "Акцент: #948bac"],
    node: <Menu007 title="Проверка" cancelLabel="Черновик" accent="#948bac" />,
  },
]
