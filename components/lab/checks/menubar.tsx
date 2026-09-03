import type { LabCheck } from "@/components/lab/check-types"

import { Menu003 } from "@/registry/components/menubar/menu-003/menu-003"
import { Menubar001 } from "@/registry/components/menubar/menubar-001/menubar-001"
import { Menubar002 } from "@/registry/components/menubar/menubar-002/menubar-002"
import { Menubar003 } from "@/registry/components/menubar/menubar-003/menubar-003"
import { Menubar004 } from "@/registry/components/menubar/menubar-004/menubar-004"
import { Menubar005 } from "@/registry/components/menubar/menubar-005/menubar-005"
import { Menubar006 } from "@/registry/components/menubar/menubar-006/menubar-006"
import { Menubar007 } from "@/registry/components/menubar/menubar-007/menubar-007"
import { Menubar008 } from "@/registry/components/menubar/menubar-008/menubar-008"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 68432

export const CHECKS: LabCheck[] = [
  {
    name: "menu-003",
    title: "Строка меню",
    notes: ["Акцент: #37326f", "Подсказка: Что дальше"],
    node: <Menu003 accent="#37326f" hint="Что дальше" />,
  },
  {
    name: "menubar-001",
    title: "Строка меню приложения",
    notes: ["Акцент: #07d4e0"],
    node: <Menubar001 accent="#07d4e0" />,
  },
  {
    name: "menubar-002",
    title: "Строка меню со стрелками",
    notes: ["Акцент: #90de1e", "Подсказка: Подпись: тест"],
    node: <Menubar002 accent="#90de1e" hint="Подпись: тест" />,
  },
  {
    name: "menubar-003",
    title: "Строка меню с сочетаниями",
    notes: ["Платформа: mac", "Акцент: #73555f"],
    node: <Menubar003 platform="mac" accent="#73555f" />,
  },
  {
    name: "menubar-004",
    title: "Строка меню с флажками",
    notes: ["Плотность: compact", "Кнопка: Ня", "Акцент: #4b8140"],
    node: (
      <Menubar004 defaultChoice="compact" triggerLabel="Ня" accent="#4b8140" />
    ),
  },
  {
    name: "menubar-005",
    title: "Сворачиваемая строка меню",
    notes: ["Кнопка: Тест", "Акцент: #f0e5e6"],
    node: <Menubar005 burgerLabel="Тест" accent="#f0e5e6" />,
  },
  {
    name: "menubar-006",
    title: "Строка меню с разделами",
    notes: ["Активный раздел: Настройки", "Акцент: #a3f0fd"],
    node: <Menubar006 activeLabel="Настройки" accent="#a3f0fd" />,
  },
  {
    name: "menubar-007",
    title: "Строка меню с подменю",
    notes: ["Акцент: #214c3c"],
    node: <Menubar007 accent="#214c3c" />,
  },
  {
    name: "menubar-008",
    title: "Строка меню с действиями",
    notes: ["Имя: Проверка", "Непрочитанных: 5", "Акцент: #df21b1"],
    node: <Menubar008 userName="Проверка" unread={5} accent="#df21b1" />,
  },
]
