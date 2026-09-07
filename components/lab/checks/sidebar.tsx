import type { LabCheck } from "@/components/lab/check-types"

import { Sidebar002 } from "@/registry/components/sidebar/sidebar-002/sidebar-002"
import { Sidebar003 } from "@/registry/components/sidebar/sidebar-003/sidebar-003"
import { Sidebar004 } from "@/registry/components/sidebar/sidebar-004/sidebar-004"
import { Sidebar005 } from "@/registry/components/sidebar/sidebar-005/sidebar-005"
import { Sidebar006 } from "@/registry/components/sidebar/sidebar-006/sidebar-006"
import { Sidebar007 } from "@/registry/components/sidebar/sidebar-007/sidebar-007"
import { Sidebar008 } from "@/registry/components/sidebar/sidebar-008/sidebar-008"
import { Sidebar009 } from "@/registry/components/sidebar/sidebar-009/sidebar-009"
import { Sidebar010 } from "@/registry/components/sidebar/sidebar-010/sidebar-010"
import { Sidebar011 } from "@/registry/components/sidebar/sidebar-011/sidebar-011"
import { Sidebar012 } from "@/registry/components/sidebar/sidebar-012/sidebar-012"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 68432

export const CHECKS: LabCheck[] = [
  {
    name: "sidebar-002",
    title: "Сворачиваемое боковое меню",
    notes: ["Переключатель: Смена", "Активный: Настройки", "Акцент: #e090de"],
    node: <Sidebar002 title="Смена" activeLabel="Настройки" accent="#e090de" />,
  },
  {
    name: "sidebar-003",
    title: "Полоса иконок",
    notes: ["Текущий пункт: Обзор", "Акцент: #7c7e56"],
    node: <Sidebar003 activeLabel="Обзор" accent="#7c7e56" />,
  },
  {
    name: "sidebar-004",
    title: "Меню с группами",
    notes: ["Текущий пункт: Заказы", "Акцент: #555f33"],
    node: <Sidebar004 activeLabel="Заказы" accent="#555f33" />,
  },
  {
    name: "sidebar-005",
    title: "Меню с фильтром",
    notes: [
      "Подсказка поиска: Подпись: тест",
      "Текущий пункт: Безопасность",
      "Акцент: #81409a",
    ],
    node: (
      <Sidebar005
        placeholder="Подпись: тест"
        activeLabel="Безопасность"
        accent="#81409a"
      />
    ),
  },
  {
    name: "sidebar-006",
    title: "Профиль в подвале меню",
    notes: ["Имя: Черновик", "Текущий пункт: Файлы", "Акцент: #e6dea3"],
    node: (
      <Sidebar006 userName="Черновик" activeLabel="Файлы" accent="#e6dea3" />
    ),
  },
  {
    name: "sidebar-007",
    title: "Счётчики в меню",
    notes: ["Предел счётчика: 941", "Текущий пункт: Архив", "Акцент: #214c3c"],
    node: <Sidebar007 cap={941} activeLabel="Архив" accent="#214c3c" />,
  },
  {
    name: "sidebar-008",
    title: "Переключатель пространств",
    notes: [
      "Текущее пространство: Личное",
      "Текущий пункт: Счета",
      "Акцент: #0ddf21",
    ],
    node: <Sidebar008 current="Личное" activeLabel="Счета" accent="#0ddf21" />,
  },
  {
    name: "sidebar-009",
    title: "Меню-шторка",
    notes: ["Заголовок ящика: 42", "Текущий пункт: Заказы", "Акцент: #c2c33d"],
    node: <Sidebar009 title="42" activeLabel="Заказы" accent="#c2c33d" />,
  },
  {
    name: "sidebar-010",
    title: "Закреплённые разделы",
    notes: [
      "Заголовок закреплённых: Наверху",
      "Заголовок остальных: Прочее",
      "Текущий раздел: reports",
      "Акцент: #7c5cff",
    ],
    node: (
      <Sidebar010
        pinnedLabel="Наверху"
        restLabel="Прочее"
        activeId="reports"
        accent="#7c5cff"
      />
    ),
  },
  {
    name: "sidebar-011",
    title: "Двухуровневое меню",
    notes: [
      "Открытый раздел: work",
      "Текущий пункт: Согласования",
      "Подпись полосы: Область",
      "Акцент: #12a594",
    ],
    node: (
      <Sidebar011
        currentId="work"
        activeLabel="Согласования"
        railLabel="Область"
        accent="#12a594"
        group="lab-sidebar-011"
      />
    ),
  },
  {
    name: "sidebar-012",
    title: "Тариф в подвале меню",
    notes: [
      "Название тарифа: Тариф «Старт»",
      "Израсходовано: 3200",
      "Подпись кнопки: Расширить",
      "Акцент: #d1495b",
    ],
    node: (
      <Sidebar012
        planName="Тариф «Старт»"
        used={3200}
        actionLabel="Расширить"
        accent="#d1495b"
      />
    ),
  },
]
