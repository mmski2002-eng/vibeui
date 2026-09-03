import type { LabCheck } from "@/components/lab/check-types"

import { Menu006 } from "@/registry/components/navigation-menu/menu-006/menu-006"
import { Navmenu001 } from "@/registry/components/navigation-menu/navmenu-001/navmenu-001"
import { Navmenu002 } from "@/registry/components/navigation-menu/navmenu-002/navmenu-002"
import { Navmenu003 } from "@/registry/components/navigation-menu/navmenu-003/navmenu-003"
import { Navmenu004 } from "@/registry/components/navigation-menu/navmenu-004/navmenu-004"
import { Navmenu005 } from "@/registry/components/navigation-menu/navmenu-005/navmenu-005"
import { Navmenu006 } from "@/registry/components/navigation-menu/navmenu-006/navmenu-006"
import { Navmenu007 } from "@/registry/components/navigation-menu/navmenu-007/navmenu-007"
import { Navmenu008 } from "@/registry/components/navigation-menu/navmenu-008/navmenu-008"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 31784

export const CHECKS: LabCheck[] = [
  {
    name: "menu-006",
    title: "Мега-меню",
    notes: ["Подпись раздела: Проверка", "Акцент: #6fd963"],
    node: <Menu006 label="Проверка" accent="#6fd963" />,
  },
  {
    name: "navmenu-001",
    title: "Меню в колонки",
    notes: ["Акцент: #1ec46f", "Подпись навигации: Смена"],
    node: <Navmenu001 accent="#1ec46f" label="Смена" />,
  },
  {
    name: "navmenu-002",
    title: "Меню с промо-блоком",
    notes: [
      "Раздел: Что дальше",
      "Заголовок промо: Черновик",
      "Метка промо: Проверка",
      "Акцент: #f4275d",
    ],
    node: (
      <Navmenu002
        panelLabel="Что дальше"
        promoTitle="Черновик"
        badgeText="Проверка"
        accent="#f4275d"
      />
    ),
  },
  {
    name: "navmenu-003",
    title: "Простое меню",
    notes: ["Акцент: #0edc53", "Подпись навигации: Смена"],
    node: <Navmenu003 accent="#0edc53" label="Смена" />,
  },
  {
    name: "navmenu-004",
    title: "Меню каталога",
    notes: ["Кнопка: Что дальше", "Ссылка внизу: Смена", "Акцент: #b31eea"],
    node: (
      <Navmenu004
        triggerLabel="Что дальше"
        footerLabel="Смена"
        accent="#b31eea"
      />
    ),
  },
  {
    name: "navmenu-005",
    title: "Меню с предпросмотром",
    notes: ["Кнопка: Черновик", "Акцент: #2f1fa5"],
    node: <Navmenu005 triggerLabel="Черновик" accent="#2f1fa5" />,
  },
  {
    name: "navmenu-006",
    title: "Меню на телефоне",
    notes: [
      "Название: Что дальше",
      "Действие: Подпись: тест",
      "Подпись бургера: Ок",
      "Акцент: #a6cb38",
    ],
    node: (
      <Navmenu006
        brand="Что дальше"
        actionLabel="Подпись: тест"
        burgerLabel="Ок"
        accent="#a6cb38"
      />
    ),
  },
  {
    name: "navmenu-007",
    title: "Меню с брендом",
    notes: [
      "Название: Подпись: тест",
      "Кнопка: Смена",
      "Вторичная ссылка: Что дальше",
      "Акцент: #87f550",
    ],
    node: (
      <Navmenu007
        brand="Подпись: тест"
        actionLabel="Смена"
        secondaryLabel="Что дальше"
        accent="#87f550"
      />
    ),
  },
  {
    name: "navmenu-008",
    title: "Меню с поиском",
    notes: [
      "Подсказка: Смена",
      "Кнопка: Проверка",
      "Кнопка формы: Черновик",
      "Акцент: #5905f4",
    ],
    node: (
      <Navmenu008
        placeholder="Смена"
        triggerLabel="Проверка"
        submitLabel="Черновик"
        accent="#5905f4"
      />
    ),
  },
]
