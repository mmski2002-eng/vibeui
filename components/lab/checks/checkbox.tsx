import type { LabCheck } from "@/components/lab/check-types"

import { Checkbox001 } from "@/registry/components/checkbox/checkbox-001/checkbox-001"
import { Checkbox002 } from "@/registry/components/checkbox/checkbox-002/checkbox-002"
import { Checkbox003 } from "@/registry/components/checkbox/checkbox-003/checkbox-003"
import { Checkbox004 } from "@/registry/components/checkbox/checkbox-004/checkbox-004"
import { Checkbox005 } from "@/registry/components/checkbox/checkbox-005/checkbox-005"
import { Checkbox006 } from "@/registry/components/checkbox/checkbox-006/checkbox-006"
import { Checkbox007 } from "@/registry/components/checkbox/checkbox-007/checkbox-007"
import { Checkbox008 } from "@/registry/components/checkbox/checkbox-008/checkbox-008"
import { Checkbox009 } from "@/registry/components/checkbox/checkbox-009/checkbox-009"
import { Checkbox010 } from "@/registry/components/checkbox/checkbox-010/checkbox-010"
import { Checkbox011 } from "@/registry/components/checkbox/checkbox-011/checkbox-011"
import { Checkbox012 } from "@/registry/components/checkbox/checkbox-012/checkbox-012"
import { Checkbox013 } from "@/registry/components/checkbox/checkbox-013/checkbox-013"
import { Checkbox014 } from "@/registry/components/checkbox/checkbox-014/checkbox-014"
import { Checkbox015 } from "@/registry/components/checkbox/checkbox-015/checkbox-015"
import { Checkbox016 } from "@/registry/components/checkbox/checkbox-016/checkbox-016"
import { Checkbox017 } from "@/registry/components/checkbox/checkbox-017/checkbox-017"
import { Checkbox018 } from "@/registry/components/checkbox/checkbox-018/checkbox-018"
import { Checkbox019 } from "@/registry/components/checkbox/checkbox-019/checkbox-019"
import { Checkbox020 } from "@/registry/components/checkbox/checkbox-020/checkbox-020"
import { Checkbox021 } from "@/registry/components/checkbox/checkbox-021/checkbox-021"
import { Checkbox022 } from "@/registry/components/checkbox/checkbox-022/checkbox-022"
import { Checkbox023 } from "@/registry/components/checkbox/checkbox-023/checkbox-023"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 76351

export const CHECKS: LabCheck[] = [
  {
    name: "checkbox-001",
    title: "Строка с флажком",
    notes: [
      "Подпись: Что дальше",
      "Пояснение: Что дальше",
      "Отмечен: false",
      "Акцент: #78cec8",
      "Выключено: true",
    ],
    node: (
      <Checkbox001
        label="Что дальше"
        description="Что дальше"
        defaultChecked={false}
        accent="#78cec8"
        disabled={true}
      />
    ),
  },
  {
    name: "checkbox-002",
    title: "Флажки выбора",
    notes: ["Название группы: Проверка", "Акцент: #ec05dd"],
    node: <Checkbox002 legend="Проверка" accent="#ec05dd" />,
  },
  {
    name: "checkbox-003",
    title: "Родительский флажок",
    notes: ["Название группы: Черновик", "Акцент: #7d3bf4"],
    node: <Checkbox003 legend="Черновик" accent="#7d3bf4" />,
  },
  {
    name: "checkbox-004",
    title: "Список фильтров",
    notes: ["Название группы: Смена", "Акцент: #9cfe58"],
    node: <Checkbox004 legend="Смена" accent="#9cfe58" />,
  },
  {
    name: "checkbox-005",
    title: "Флажок согласия",
    notes: [
      "Текст: Черновик",
      "Ссылка: Что дальше",
      "Ошибка: Проверка",
      "Акцент: #f4868e",
    ],
    node: (
      <Checkbox005
        text="Черновик"
        linkLabel="Что дальше"
        error="Проверка"
        accent="#f4868e"
      />
    ),
  },
  {
    name: "checkbox-006",
    title: "Выделение строк",
    notes: ["Акцент: #49420b"],
    node: <Checkbox006 accent="#49420b" />,
  },
  {
    name: "checkbox-007",
    title: "Чеклист",
    notes: ["Название списка: Смена", "Акцент: #7eeba3"],
    node: <Checkbox007 title="Смена" accent="#7eeba3" />,
  },
  {
    name: "checkbox-008",
    title: "Флажок для пальца",
    notes: [
      "Подпись: Черновик",
      "Пояснение: Смена",
      "Выключен: true",
      "Отмечен: false",
      "Акцент: #fc9183",
    ],
    node: (
      <Checkbox008
        label="Черновик"
        hint="Смена"
        disabled={true}
        defaultChecked={false}
        accent="#fc9183"
      />
    ),
  },
  {
    name: "checkbox-009",
    title: "Настройки черновика",
    notes: ["Заголовок: Подпись: тест", "Акцент: #e94a3b"],
    node: <Checkbox009 title="Подпись: тест" accent="#e94a3b" />,
  },
  {
    name: "checkbox-010",
    title: "Карточки дополнений",
    notes: ["Название группы: Черновик", "Валюта: Черновик", "Акцент: #f51ac4"],
    node: (
      <Checkbox010 legend="Черновик" currency="Черновик" accent="#f51ac4" />
    ),
  },
  {
    name: "checkbox-011",
    title: "Полоса «выбрать всё»",
    notes: ["Имя блока: Подпись: тест", "Акцент: #362e44"],
    node: <Checkbox011 title="Подпись: тест" accent="#362e44" />,
  },
  {
    name: "checkbox-012",
    title: "Ограничение выбора",
    notes: ["Название группы: Черновик", "Лимит: 1", "Акцент: #1fdfc1"],
    node: <Checkbox012 legend="Черновик" limit={1} accent="#1fdfc1" />,
  },
  {
    name: "checkbox-013",
    title: "Обязательное согласие",
    notes: [
      "Обязательное условие: Проверка",
      "Кнопка: Что дальше",
      "Акцент: #7dc8c1",
    ],
    node: (
      <Checkbox013 terms="Проверка" submitLabel="Что дальше" accent="#7dc8c1" />
    ),
  },
  {
    name: "checkbox-014",
    title: "Ящик выполненного",
    notes: ["Название списка: Что дальше", "Акцент: #e0b19c"],
    node: <Checkbox014 title="Что дальше" accent="#e0b19c" />,
  },
  {
    name: "checkbox-015",
    title: "Ошибка группы",
    notes: [
      "Название группы: Смена",
      "Текст ошибки: Смена",
      "Кнопка: Черновик",
      "Акцент: #c452b4",
    ],
    node: (
      <Checkbox015
        legend="Смена"
        error="Смена"
        submitLabel="Черновик"
        accent="#c452b4"
      />
    ),
  },
  {
    name: "checkbox-016",
    title: "Поиск по вариантам",
    notes: [
      "Заголовок: Подпись: тест",
      "Подсказка поиска: Подпись: тест",
      "Акцент: #7fe77d",
    ],
    node: (
      <Checkbox016
        label="Подпись: тест"
        placeholder="Подпись: тест"
        accent="#7fe77d"
      />
    ),
  },
  {
    name: "checkbox-017",
    title: "Выделение диапазона",
    notes: ["Заголовок таблицы: Проверка", "Акцент: #eb3da3"],
    node: <Checkbox017 caption="Проверка" accent="#eb3da3" />,
  },
  {
    name: "checkbox-018",
    title: "Флажки разной формы",
    notes: ["Название группы: Что дальше", "Акцент: #acf196"],
    node: <Checkbox018 legend="Что дальше" accent="#acf196" />,
  },
  {
    name: "checkbox-019",
    title: "Чипы фильтров",
    notes: ["Название группы: Проверка", "Акцент: #888eda"],
    node: <Checkbox019 legend="Проверка" accent="#888eda" />,
  },
  {
    name: "checkbox-020",
    title: "Согласие после прокрутки",
    notes: [
      "Заголовок: Подпись: тест",
      "Подпись согласия: Проверка",
      "Акцент: #e38500",
    ],
    node: (
      <Checkbox020 title="Подпись: тест" label="Проверка" accent="#e38500" />
    ),
  },
  {
    name: "checkbox-021",
    title: "Дерево прав",
    notes: ["Заголовок: Черновик", "Акцент: #e1e901"],
    node: <Checkbox021 title="Черновик" accent="#e1e901" />,
  },
  {
    name: "checkbox-022",
    title: "Закрытые настройки",
    notes: [
      "Название группы: Проверка",
      "Сноска: Подпись: тест",
      "Акцент: #3d8ffa",
    ],
    node: (
      <Checkbox022
        legend="Проверка"
        footnote="Подпись: тест"
        accent="#3d8ffa"
      />
    ),
  },
  {
    name: "checkbox-023",
    title: "Матрица прав доступа",
    notes: [
      "Заголовок: Черновик",
      "Подпись строк: Проверка",
      "Акцент: #05c8ec",
    ],
    node: (
      <Checkbox023 title="Черновик" rowsLabel="Проверка" accent="#05c8ec" />
    ),
  },
]
