import type { LabCheck } from "@/components/lab/check-types"

import { Cascader001 } from "@/registry/components/cascader/cascader-001/cascader-001"
import { Cascader002 } from "@/registry/components/cascader/cascader-002/cascader-002"
import { Cascader003 } from "@/registry/components/cascader/cascader-003/cascader-003"
import { Cascader004 } from "@/registry/components/cascader/cascader-004/cascader-004"
import { Cascader005 } from "@/registry/components/cascader/cascader-005/cascader-005"
import { Cascader006 } from "@/registry/components/cascader/cascader-006/cascader-006"
import { Cascader007 } from "@/registry/components/cascader/cascader-007/cascader-007"
import { Cascader008 } from "@/registry/components/cascader/cascader-008/cascader-008"
import { Cascader009 } from "@/registry/components/cascader/cascader-009/cascader-009"
import { Cascader010 } from "@/registry/components/cascader/cascader-010/cascader-010"
import { Cascader011 } from "@/registry/components/cascader/cascader-011/cascader-011"
import { Cascader012 } from "@/registry/components/cascader/cascader-012/cascader-012"
import { Cascader013 } from "@/registry/components/cascader/cascader-013/cascader-013"
import { Cascader014 } from "@/registry/components/cascader/cascader-014/cascader-014"
import { Cascader015 } from "@/registry/components/cascader/cascader-015/cascader-015"
import { Cascader016 } from "@/registry/components/cascader/cascader-016/cascader-016"
import { Cascader017 } from "@/registry/components/cascader/cascader-017/cascader-017"
import { Cascader018 } from "@/registry/components/cascader/cascader-018/cascader-018"
import { Cascader019 } from "@/registry/components/cascader/cascader-019/cascader-019"
import { Cascader020 } from "@/registry/components/cascader/cascader-020/cascader-020"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 76351

export const CHECKS: LabCheck[] = [
  {
    name: "cascader-001",
    title: "Каскадный выбор",
    notes: [
      "Подпись: Что дальше",
      "Пустой пункт: Что дальше",
      "Акцент: #9278ce",
    ],
    node: (
      <Cascader001
        label="Что дальше"
        placeholderText="Что дальше"
        accent="#9278ce"
      />
    ),
  },
  {
    name: "cascader-002",
    title: "Колонки уровней",
    notes: ["Заголовок: Подпись: тест", "Акцент: #c5c1ec"],
    node: <Cascader002 heading="Подпись: тест" accent="#c5c1ec" />,
  },
  {
    name: "cascader-003",
    title: "Вложенное выпадающее меню",
    notes: ["Заголовок: Черновик", "Акцент: #c0de7d"],
    node: <Cascader003 heading="Черновик" accent="#c0de7d" />,
  },
  {
    name: "cascader-004",
    title: "Пошаговый выбор",
    notes: ["Сценарий: Черновик", "Акцент: #7b169c"],
    node: <Cascader004 heading="Черновик" accent="#7b169c" />,
  },
  {
    name: "cascader-005",
    title: "Крошки категорий",
    notes: ["Корень: Что дальше", "Кнопка: Черновик", "Акцент: #f357c0"],
    node: (
      <Cascader005
        rootLabel="Что дальше"
        submitLabel="Черновик"
        accent="#f357c0"
      />
    ),
  },
  {
    name: "cascader-006",
    title: "Поиск по дереву",
    notes: [
      "Подпись: Черновик",
      "Подсказка: Подпись: тест",
      "Запрос: Что дальше",
      "Акцент: #0b661e",
    ],
    node: (
      <Cascader006
        label="Черновик"
        placeholder="Подпись: тест"
        defaultQuery="Что дальше"
        accent="#0b661e"
      />
    ),
  },
  {
    name: "cascader-007",
    title: "Отмеченные ветви",
    notes: ["Заголовок: Черновик", "Акцент: #a3adf4"],
    node: <Cascader007 heading="Черновик" accent="#a3adf4" />,
  },
  {
    name: "cascader-008",
    title: "Дерево на details",
    notes: ["Имя поля: Смена", "Заголовок: Проверка", "Акцент: #fc9183"],
    node: <Cascader008 name="Смена" heading="Проверка" accent="#fc9183" />,
  },
  {
    name: "cascader-009",
    title: "Выбор папки",
    notes: ["Файл: Подпись: тест", "Действие: Что дальше", "Акцент: #3b6df7"],
    node: (
      <Cascader009
        fileName="Подпись: тест"
        actionLabel="Что дальше"
        accent="#3b6df7"
      />
    ),
  },
  {
    name: "cascader-010",
    title: "Оргструктура",
    notes: ["Заголовок: Черновик", "Акцент: #f51ac4"],
    node: <Cascader010 heading="Черновик" accent="#f51ac4" />,
  },
  {
    name: "cascader-011",
    title: "Уровни со счётчиками",
    notes: ["Заголовок: Подпись: тест", "Единица: Смена", "Акцент: #44fde1"],
    node: <Cascader011 heading="Подпись: тест" unit="Смена" accent="#44fde1" />,
  },
  {
    name: "cascader-012",
    title: "Ленивая подгрузка уровня",
    notes: ["Задержка, мс: 329", "Заголовок: Черновик", "Акцент: #c14e9d"],
    node: <Cascader012 delay={329} heading="Черновик" accent="#c14e9d" />,
  },
  {
    name: "cascader-013",
    title: "Зоны доставки",
    notes: ["Валюта: Ок", "Зона по умолчанию: Проверка", "Акцент: #c1295a"],
    node: <Cascader013 currency="Ок" defaultZone="Проверка" accent="#c1295a" />,
  },
  {
    name: "cascader-014",
    title: "План счетов",
    notes: ["Заголовок: Проверка", "Акцент: #9cb70e"],
    node: <Cascader014 label="Проверка" accent="#9cb70e" />,
  },
  {
    name: "cascader-015",
    title: "Выбор рубрики",
    notes: ["Заголовок: Смена", "Акцент: #d1dfc4"],
    node: <Cascader015 label="Смена" accent="#d1dfc4" />,
  },
  {
    name: "cascader-016",
    title: "Выбор места",
    notes: ["Заголовок: Проверка", "Комната: Подпись: тест", "Акцент: #21917f"],
    node: (
      <Cascader016
        label="Проверка"
        defaultRoom="Подпись: тест"
        accent="#21917f"
      />
    ),
  },
  {
    name: "cascader-017",
    title: "Выбор специальности",
    notes: ["Заголовок: Подпись: тест", "Акцент: #1ecbeb"],
    node: <Cascader017 label="Подпись: тест" accent="#1ecbeb" />,
  },
  {
    name: "cascader-018",
    title: "Колонки с прилипанием",
    notes: ["Заголовок: Проверка", "Акцент: #3b43ac"],
    node: <Cascader018 label="Проверка" accent="#3b43ac" />,
  },
  {
    name: "cascader-019",
    title: "Поиск по коду",
    notes: ["Код: Подпись: тест", "Подсказка: Проверка", "Акцент: #888eda"],
    node: (
      <Cascader019
        defaultCode="Подпись: тест"
        placeholder="Проверка"
        accent="#888eda"
      />
    ),
  },
  {
    name: "cascader-020",
    title: "Поле с полным путём",
    notes: ["Разделитель: Ок", "Подпись: Проверка", "Акцент: #e38500"],
    node: <Cascader020 separator="Ок" label="Проверка" accent="#e38500" />,
  },
]
