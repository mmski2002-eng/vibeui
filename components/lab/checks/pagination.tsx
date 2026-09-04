import type { LabCheck } from "@/components/lab/check-types"

import { Pagination001 } from "@/registry/components/pagination/pagination-001/pagination-001"
import { Pagination002 } from "@/registry/components/pagination/pagination-002/pagination-002"
import { Pagination003 } from "@/registry/components/pagination/pagination-003/pagination-003"
import { Pagination004 } from "@/registry/components/pagination/pagination-004/pagination-004"
import { Pagination005 } from "@/registry/components/pagination/pagination-005/pagination-005"
import { Pagination006 } from "@/registry/components/pagination/pagination-006/pagination-006"
import { Pagination007 } from "@/registry/components/pagination/pagination-007/pagination-007"
import { Pagination008 } from "@/registry/components/pagination/pagination-008/pagination-008"
import { Pagination009 } from "@/registry/components/pagination/pagination-009/pagination-009"
import { Pagination010 } from "@/registry/components/pagination/pagination-010/pagination-010"
import { Pagination011 } from "@/registry/components/pagination/pagination-011/pagination-011"
import { Pagination012 } from "@/registry/components/pagination/pagination-012/pagination-012"
import { Pagination013 } from "@/registry/components/pagination/pagination-013/pagination-013"
import { Pagination014 } from "@/registry/components/pagination/pagination-014/pagination-014"
import { Pagination015 } from "@/registry/components/pagination/pagination-015/pagination-015"
import { Pagination016 } from "@/registry/components/pagination/pagination-016/pagination-016"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 92189

export const CHECKS: LabCheck[] = [
  {
    name: "pagination-001",
    title: "Постраничная навигация ссылками",
    notes: ["Страница: 4", "Всего: 31", "Соседей: 2", "Акцент: #1a49ee"],
    node: <Pagination001 page={4} total={31} siblings={2} accent="#1a49ee" />,
  },
  {
    name: "pagination-002",
    title: "Навигация курсором",
    notes: [
      "Первая строка: 25",
      "На странице: 7",
      "Всего: 425",
      "Акцент: #5a22bb",
    ],
    node: <Pagination002 from={25} perPage={7} total={425} accent="#5a22bb" />,
  },
  {
    name: "pagination-003",
    title: "Многоточие с переходом",
    notes: [
      "Страница: 24",
      "Всего страниц: 50",
      "Соседей: 2",
      "Акцент: #26640c",
    ],
    node: (
      <Pagination003
        defaultPage={24}
        total={50}
        siblings={2}
        accent="#26640c"
      />
    ),
  },
  {
    name: "pagination-004",
    title: "Назад-вперёд со счётчиком",
    notes: ["Страница: 7", "Всего: 89", "Акцент: #9a21ac"],
    node: <Pagination004 page={7} total={89} accent="#9a21ac" />,
  },
  {
    name: "pagination-005",
    title: "«Показать ещё» с прогрессом",
    notes: ["Всего: 39", "Порция: 56", "Показано: 57", "Акцент: #368ef0"],
    node: (
      <Pagination005
        total={39}
        perPage={56}
        defaultShown={57}
        accent="#368ef0"
      />
    ),
  },
  {
    name: "pagination-006",
    title: "Маяк бесконечной ленты",
    notes: ["Всего записей: 18", "Порция: 32", "Акцент: #6b3ddc"],
    node: <Pagination006 total={18} batch={32} accent="#6b3ddc" />,
  },
  {
    name: "pagination-007",
    title: "Навигация с размером страницы",
    notes: ["Всего строк: 144", "На странице: 80", "Акцент: #d7c3e6"],
    node: <Pagination007 total={144} defaultPerPage={80} accent="#d7c3e6" />,
  },
  {
    name: "pagination-008",
    title: "Переход к странице",
    notes: ["Всего страниц: 752", "Страница: 67", "Акцент: #60ca34"],
    node: <Pagination008 total={752} defaultPage={67} accent="#60ca34" />,
  },
  {
    name: "pagination-009",
    title: "Навигация миниатюрами",
    notes: ["Страница: 10", "Всего: 59", "Акцент: #48dbfc"],
    node: <Pagination009 page={10} total={59} accent="#48dbfc" />,
  },
  {
    name: "pagination-010",
    title: "Ползунок с многоточием",
    notes: ["Страница: 168", "Всего: 664", "Соседей: 1", "Акцент: #76d56a"],
    node: (
      <Pagination010 page={168} total={664} siblings={1} accent="#76d56a" />
    ),
  },
  {
    name: "pagination-011",
    title: "«Показать ещё» с кольцом",
    notes: [
      "Всего: 816",
      "Порция: 156",
      "Показано сразу: 95",
      "Акцент: #a9e4c1",
    ],
    node: (
      <Pagination011
        total={816}
        batch={156}
        defaultShown={95}
        accent="#a9e4c1"
      />
    ),
  },
  {
    name: "pagination-012",
    title: "Автоподгрузка при прокрутке",
    notes: ["Всего: 49", "Порция: 12", "Акцент: #000bf3"],
    node: <Pagination012 total={49} batch={12} accent="#000bf3" />,
  },
  {
    name: "pagination-013",
    title: "Переключатель размера страницы",
    notes: [
      "Всего строк: 2005",
      "Размер страницы: 69",
      "Соседей: 0",
      "Акцент: #15005e",
    ],
    node: (
      <Pagination013
        total={2005}
        defaultPerPage={69}
        siblings={0}
        accent="#15005e"
      />
    ),
  },
  {
    name: "pagination-014",
    title: "Сворачиваемая навигация",
    notes: ["Страница: 18", "Всего: 915", "Соседей: 3", "Акцент: #b9477a"],
    node: <Pagination014 page={18} total={915} siblings={3} accent="#b9477a" />,
  },
  {
    name: "pagination-015",
    title: "Правка номера страницы",
    notes: ["Страница: 40", "Всего: 485", "Акцент: #1d739a"],
    node: <Pagination015 page={40} total={485} accent="#1d739a" />,
  },
  {
    name: "pagination-016",
    title: "Список страниц выбором",
    notes: ["Страница: 22", "Всего страниц: 90", "Акцент: #ea7c1d"],
    node: <Pagination016 total={90} defaultPage={22} accent="#ea7c1d" />,
  },
]
