import type { LabCheck } from "@/components/lab/check-types"

import { Menu002 } from "@/registry/components/context-menu/menu-002/menu-002"
import { Contextmenu001 } from "@/registry/components/context-menu/contextmenu-001/contextmenu-001"
import { Contextmenu002 } from "@/registry/components/context-menu/contextmenu-002/contextmenu-002"
import { Contextmenu003 } from "@/registry/components/context-menu/contextmenu-003/contextmenu-003"
import { Contextmenu004 } from "@/registry/components/context-menu/contextmenu-004/contextmenu-004"
import { Contextmenu005 } from "@/registry/components/context-menu/contextmenu-005/contextmenu-005"
import { Contextmenu006 } from "@/registry/components/context-menu/contextmenu-006/contextmenu-006"
import { Contextmenu007 } from "@/registry/components/context-menu/contextmenu-007/contextmenu-007"
import { Contextmenu008 } from "@/registry/components/context-menu/contextmenu-008/contextmenu-008"
import { Contextmenu009 } from "@/registry/components/context-menu/contextmenu-009/contextmenu-009"
import { Contextmenu010 } from "@/registry/components/context-menu/contextmenu-010/contextmenu-010"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 8027

export const CHECKS: LabCheck[] = [
  {
    name: "menu-002",
    title: "Контекстное меню",
    notes: [
      "Заголовок области: Подпись: тест",
      "Подпись области: Подпись: тест",
      "Акцент: #258116",
    ],
    node: (
      <Menu002
        zoneTitle="Подпись: тест"
        hint="Подпись: тест"
        accent="#258116"
      />
    ),
  },
  {
    name: "contextmenu-001",
    title: "Контекстное меню на popover",
    notes: ["Подпись: Проверка", "Кнопка: Смена", "Акцент: #832361"],
    node: (
      <Contextmenu001 hint="Проверка" actionLabel="Смена" accent="#832361" />
    ),
  },
  {
    name: "contextmenu-002",
    title: "Плитки файлов",
    notes: ["Заголовок: Черновик", "Подсказка: Смена", "Акцент: #d309d5"],
    node: <Contextmenu002 title="Черновик" hint="Смена" accent="#d309d5" />,
  },
  {
    name: "contextmenu-003",
    title: "Открыть с помощью",
    notes: ["Файл: Что дальше", "Подменю: Подпись: тест", "Акцент: #5d78e9"],
    node: (
      <Contextmenu003
        fileName="Что дальше"
        submenuLabel="Подпись: тест"
        accent="#5d78e9"
      />
    ),
  },
  {
    name: "contextmenu-004",
    title: "Меню буфера обмена",
    notes: ["Заголовок: Подпись: тест", "Акцент: #88358d"],
    node: <Contextmenu004 title="Подпись: тест" accent="#88358d" />,
  },
  {
    name: "contextmenu-005",
    title: "Меню выделения",
    notes: [
      "Пустое выделение: Подпись: тест",
      "Подсказка: Проверка",
      "Акцент: #ba7dad",
    ],
    node: (
      <Contextmenu005
        emptyHint="Подпись: тест"
        hint="Проверка"
        accent="#ba7dad"
      />
    ),
  },
  {
    name: "contextmenu-006",
    title: "Меню строки таблицы",
    notes: ["Подпись таблицы: Проверка", "Акцент: #0ef494"],
    node: <Contextmenu006 caption="Проверка" accent="#0ef494" />,
  },
  {
    name: "contextmenu-007",
    title: "Переключение колонок",
    notes: ["Подпись таблицы: Смена", "Акцент: #563f95"],
    node: <Contextmenu007 caption="Смена" accent="#563f95" />,
  },
  {
    name: "contextmenu-008",
    title: "Подсказка правого клика",
    notes: ["Подсказка: Проверка", "Акцент: #509b06"],
    node: <Contextmenu008 hint="Проверка" accent="#509b06" />,
  },
  {
    name: "contextmenu-009",
    title: "Меню карточки файла",
    notes: ["Файл: Смена", "Акцент: #5eb3d3"],
    node: <Contextmenu009 fileName="Смена" accent="#5eb3d3" />,
  },
  {
    name: "contextmenu-010",
    title: "Меню форматирования",
    notes: ["Пустое выделение: Что дальше", "Акцент: #4fd38c"],
    node: <Contextmenu010 emptyHint="Что дальше" accent="#4fd38c" />,
  },
]
