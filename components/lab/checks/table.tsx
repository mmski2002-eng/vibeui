import type { LabCheck } from "@/components/lab/check-types"

import { Table001 } from "@/registry/components/table/table-001/table-001"
import { Table002 } from "@/registry/components/table/table-002/table-002"
import { Table003 } from "@/registry/components/table/table-003/table-003"
import { Table004 } from "@/registry/components/table/table-004/table-004"
import { Table005 } from "@/registry/components/table/table-005/table-005"
import { Table006 } from "@/registry/components/table/table-006/table-006"
import { Table007 } from "@/registry/components/table/table-007/table-007"
import { Table008 } from "@/registry/components/table/table-008/table-008"
import { Table009 } from "@/registry/components/table/table-009/table-009"
import { Table010 } from "@/registry/components/table/table-010/table-010"
import { Table011 } from "@/registry/components/table/table-011/table-011"
import { Table012 } from "@/registry/components/table/table-012/table-012"
import { Table013 } from "@/registry/components/table/table-013/table-013"
import { Table014 } from "@/registry/components/table/table-014/table-014"
import { Table015 } from "@/registry/components/table/table-015/table-015"
import { Table016 } from "@/registry/components/table/table-016/table-016"
import { Table017 } from "@/registry/components/table/table-017/table-017"
import { Table018 } from "@/registry/components/table/table-018/table-018"
import { Table019 } from "@/registry/components/table/table-019/table-019"
import { Table020 } from "@/registry/components/table/table-020/table-020"
import { Table021 } from "@/registry/components/table/table-021/table-021"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 52594

export const CHECKS: LabCheck[] = [
  {
    name: "table-001",
    title: "Таблица данных",
    notes: ["Подпись: Подпись: тест", "Плотно: false", "Акцент: #7f22e1"],
    node: <Table001 caption="Подпись: тест" dense={false} accent="#7f22e1" />,
  },
  {
    name: "table-002",
    title: "Таблица сравнения",
    notes: [
      "Выделить колонку: 1",
      "Акцент: #8b676b",
      "Первая колонка: Проверка",
    ],
    node: <Table002 highlight={1} accent="#8b676b" featureLabel="Проверка" />,
  },
  {
    name: "table-003",
    title: "Таблица счёта",
    notes: ["Заголовок: Смена", "НДС, %: 8", "Валюта: Ок", "Акцент: #5f046f"],
    node: (
      <Table003 caption="Смена" taxRate={8} currency="Ок" accent="#5f046f" />
    ),
  },
  {
    name: "table-004",
    title: "Таблица с сортировкой",
    notes: ["Подпись: Черновик", "Акцент: #76c98c"],
    node: <Table004 caption="Черновик" accent="#76c98c" />,
  },
  {
    name: "table-005",
    title: "Таблица с выделением",
    notes: ["Подпись: Смена", "Акцент: #af002f"],
    node: <Table005 caption="Смена" accent="#af002f" />,
  },
  {
    name: "table-006",
    title: "Раскрывающиеся строки",
    notes: ["Подпись: Проверка", "Акцент: #7ce592"],
    node: <Table006 caption="Проверка" accent="#7ce592" />,
  },
  {
    name: "table-007",
    title: "Адаптивная таблица",
    notes: ["Подпись: Смена", "Акцент: #72b988"],
    node: <Table007 caption="Смена" accent="#72b988" />,
  },
  {
    name: "table-008",
    title: "Таблица логов",
    notes: ["Подпись: Черновик", "Акцент: #ba3e0c"],
    node: <Table008 caption="Черновик" accent="#ba3e0c" />,
  },
  {
    name: "table-009",
    title: "Состояния таблицы",
    notes: [
      "Состояние: empty",
      "Заголовок пустого: Что дальше",
      "Строк-заглушек: 1",
      "Акцент: #bb471f",
    ],
    node: (
      <Table009
        state="empty"
        emptyTitle="Что дальше"
        rows={1}
        accent="#bb471f"
      />
    ),
  },
  {
    name: "table-010",
    title: "Таблица долей",
    notes: ["Подпись: Подпись: тест", "Акцент: #ec948b"],
    node: <Table010 caption="Подпись: тест" accent="#ec948b" />,
  },
  {
    name: "table-011",
    title: "Матрица тарифов",
    notes: [
      "Тариф с подсветкой: Бизнес",
      "Подпись: Проверка",
      "Акцент: #d92c4b",
    ],
    node: <Table011 featured="Бизнес" caption="Проверка" accent="#d92c4b" />,
  },
  {
    name: "table-012",
    title: "Итоги сметы",
    notes: ["Ставка налога, %: 38", "Подпись: Черновик", "Акцент: #2e0cbe"],
    node: <Table012 taxRate={38} caption="Черновик" accent="#2e0cbe" />,
  },
  {
    name: "table-013",
    title: "Расписание недели",
    notes: ["День с подсветкой: Пн", "Подпись: Смена", "Акцент: #7e4da7"],
    node: <Table013 today="Пн" caption="Смена" accent="#7e4da7" />,
  },
  {
    name: "table-014",
    title: "Сгруппированная шапка",
    notes: ["Первая колонка: Черновик", "Подпись: Смена", "Акцент: #49ecb2"],
    node: <Table014 leadTitle="Черновик" caption="Смена" accent="#49ecb2" />,
  },
  {
    name: "table-015",
    title: "Таблица со сносками",
    notes: [
      "Заголовок сносок: Смена",
      "Подпись: Смена",
      "Префикс якорей: Проверка",
      "Акцент: #ae1f95",
    ],
    node: (
      <Table015
        notesTitle="Смена"
        caption="Смена"
        idPrefix="Проверка"
        accent="#ae1f95"
      />
    ),
  },
  {
    name: "table-016",
    title: "Выровненные числа",
    notes: [
      "Знаков после запятой: 2",
      "Первая колонка: Подпись: тест",
      "Подпись итога: Проверка",
      "Подпись: Смена",
      "Акцент: #1672ab",
    ],
    node: (
      <Table016
        decimals={2}
        leadTitle="Подпись: тест"
        totalLabel="Проверка"
        caption="Смена"
        accent="#1672ab"
      />
    ),
  },
  {
    name: "table-017",
    title: "Переход в карточки",
    notes: [
      "Ширина карточки: Черновик",
      "Первая колонка: Подпись: тест",
      "Подпись: Что дальше",
      "Акцент: #877b61",
    ],
    node: (
      <Table017
        cardWidth="Черновик"
        leadTitle="Подпись: тест"
        caption="Что дальше"
        accent="#877b61"
      />
    ),
  },
  {
    name: "table-018",
    title: "Полоса состояния у строки",
    notes: ["Плотность: compact", "Подпись: Что дальше", "Акцент: #f13d56"],
    node: <Table018 density="compact" caption="Что дальше" accent="#f13d56" />,
  },
  {
    name: "table-019",
    title: "Итоги с долями",
    notes: [
      "Подпись итога: Смена",
      "Единицы: Проверка",
      "Подпись: Подпись: тест",
      "Акцент: #f290bf",
    ],
    node: (
      <Table019
        totalLabel="Смена"
        unit="Проверка"
        caption="Подпись: тест"
        accent="#f290bf"
      />
    ),
  },
  {
    name: "table-020",
    title: "Подпись единиц",
    notes: [
      "Заголовок: Подпись: тест",
      "Первая колонка: Черновик",
      "Пояснение: Подпись: тест",
      "Акцент: #2ef754",
    ],
    node: (
      <Table020
        caption="Подпись: тест"
        leadTitle="Черновик"
        note="Подпись: тест"
        accent="#2ef754"
      />
    ),
  },
  {
    name: "table-021",
    title: "Слитые категории",
    notes: ["Подпись: Смена", "Валюта: Ок", "Акцент: #3fae7c"],
    node: <Table021 caption="Смена" currency="Ок" accent="#3fae7c" />,
  },
]
