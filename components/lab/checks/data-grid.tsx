import type { LabCheck } from "@/components/lab/check-types"

import { Datagrid001 } from "@/registry/components/data-grid/datagrid-001/datagrid-001"
import { Datagrid002 } from "@/registry/components/data-grid/datagrid-002/datagrid-002"
import { Datagrid003 } from "@/registry/components/data-grid/datagrid-003/datagrid-003"
import { Datagrid004 } from "@/registry/components/data-grid/datagrid-004/datagrid-004"
import { Datagrid005 } from "@/registry/components/data-grid/datagrid-005/datagrid-005"
import { Datagrid006 } from "@/registry/components/data-grid/datagrid-006/datagrid-006"
import { Datagrid007 } from "@/registry/components/data-grid/datagrid-007/datagrid-007"
import { Datagrid008 } from "@/registry/components/data-grid/datagrid-008/datagrid-008"
import { Datagrid009 } from "@/registry/components/data-grid/datagrid-009/datagrid-009"
import { Datagrid010 } from "@/registry/components/data-grid/datagrid-010/datagrid-010"
import { Datagrid011 } from "@/registry/components/data-grid/datagrid-011/datagrid-011"
import { Datagrid012 } from "@/registry/components/data-grid/datagrid-012/datagrid-012"
import { Datagrid013 } from "@/registry/components/data-grid/datagrid-013/datagrid-013"
import { Datagrid014 } from "@/registry/components/data-grid/datagrid-014/datagrid-014"
import { Datagrid015 } from "@/registry/components/data-grid/datagrid-015/datagrid-015"
import { Datagrid016 } from "@/registry/components/data-grid/datagrid-016/datagrid-016"
import { Datagrid017 } from "@/registry/components/data-grid/datagrid-017/datagrid-017"
import { Datagrid018 } from "@/registry/components/data-grid/datagrid-018/datagrid-018"
import { Datagrid019 } from "@/registry/components/data-grid/datagrid-019/datagrid-019"
import { Datagrid020 } from "@/registry/components/data-grid/datagrid-020/datagrid-020"
import { Datagrid021 } from "@/registry/components/data-grid/datagrid-021/datagrid-021"
import { Datagrid022 } from "@/registry/components/data-grid/datagrid-022/datagrid-022"
import { Datagrid023 } from "@/registry/components/data-grid/datagrid-023/datagrid-023"
import { Datagrid024 } from "@/registry/components/data-grid/datagrid-024/datagrid-024"
import { Datagrid025 } from "@/registry/components/data-grid/datagrid-025/datagrid-025"
import { Datagrid026 } from "@/registry/components/data-grid/datagrid-026/datagrid-026"
import { Datagrid027 } from "@/registry/components/data-grid/datagrid-027/datagrid-027"
import { Datagrid028 } from "@/registry/components/data-grid/datagrid-028/datagrid-028"
import { Datagrid030 } from "@/registry/components/data-grid/datagrid-030/datagrid-030"
import { Datagrid029 } from "@/registry/components/data-grid/datagrid-029/datagrid-029"
import { Datagrid031 } from "@/registry/components/data-grid/datagrid-031/datagrid-031"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 84270

export const CHECKS: LabCheck[] = [
  {
    name: "datagrid-001",
    title: "Сортировка по приоритету",
    notes: ["Подпись: Проверка", "Плотность: comfortable", "Акцент: #bf9a43"],
    node: (
      <Datagrid001 caption="Проверка" density="comfortable" accent="#bf9a43" />
    ),
  },
  {
    name: "datagrid-002",
    title: "Полоса массовых действий",
    notes: ["Подпись: Проверка", "Действие: Черновик", "Акцент: #7319f6"],
    node: (
      <Datagrid002 caption="Проверка" actionLabel="Черновик" accent="#7319f6" />
    ),
  },
  {
    name: "datagrid-003",
    title: "Закреплённые края",
    notes: ["Подпись: Смена", "Подсказка: Что дальше", "Акцент: #9ef08c"],
    node: (
      <Datagrid003 caption="Смена" scrollHint="Что дальше" accent="#9ef08c" />
    ),
  },
  {
    name: "datagrid-004",
    title: "Закреплённые итоги",
    notes: ["Подпись: Проверка", "Высота окна, rem: 9", "Акцент: #41140f"],
    node: <Datagrid004 caption="Проверка" height={9} accent="#41140f" />,
  },
  {
    name: "datagrid-005",
    title: "Правка ячейки на месте",
    notes: ["Подпись: Подпись: тест", "Пояснение: Проверка", "Акцент: #32888e"],
    node: (
      <Datagrid005 caption="Подпись: тест" hint="Проверка" accent="#32888e" />
    ),
  },
  {
    name: "datagrid-006",
    title: "Фильтры в шапке",
    notes: [
      "Подпись: Проверка",
      "Подсказка полей: Что дальше",
      "Акцент: #425464",
    ],
    node: (
      <Datagrid006
        caption="Проверка"
        placeholder="Что дальше"
        accent="#425464"
      />
    ),
  },
  {
    name: "datagrid-007",
    title: "Сгруппированные строки",
    notes: ["Подпись: Проверка", "Начать свёрнутыми: true", "Акцент: #a43d82"],
    node: (
      <Datagrid007 caption="Проверка" startCollapsed={true} accent="#a43d82" />
    ),
  },
  {
    name: "datagrid-008",
    title: "Строка с подробностями",
    notes: ["Подпись: Проверка", "Только одна строка: true", "Акцент: #aae948"],
    node: <Datagrid008 caption="Проверка" single={true} accent="#aae948" />,
  },
  {
    name: "datagrid-009",
    title: "Колонки с изменением ширины",
    notes: [
      "Подпись: Что дальше",
      "Минимум ширины, px: 221",
      "Акцент: #c0a7d9",
    ],
    node: <Datagrid009 caption="Что дальше" minWidth={221} accent="#c0a7d9" />,
  },
  {
    name: "datagrid-010",
    title: "Постраничная таблица",
    notes: ["Подпись: Черновик", "Строк на странице: 15", "Акцент: #dc3569"],
    node: <Datagrid010 caption="Черновик" pageSize={15} accent="#dc3569" />,
  },
  {
    name: "datagrid-011",
    title: "Пустой результат",
    notes: [
      "Подпись: Смена",
      "Заголовок пустого: Что дальше",
      "Акцент: #bd7e0a",
    ],
    node: (
      <Datagrid011 caption="Смена" emptyTitle="Что дальше" accent="#bd7e0a" />
    ),
  },
  {
    name: "datagrid-012",
    title: "Скелетон загрузки",
    notes: ["Подпись: Черновик", "Строк скелетона: 10", "Акцент: #7d4935"],
    node: <Datagrid012 caption="Черновик" rowCount={10} accent="#7d4935" />,
  },
  {
    name: "datagrid-013",
    title: "Видимость колонок",
    notes: [
      "Подпись: Что дальше",
      "Кнопка меню: Подпись: тест",
      "Акцент: #9885e5",
    ],
    node: (
      <Datagrid013
        caption="Что дальше"
        menuLabel="Подпись: тест"
        accent="#9885e5"
      />
    ),
  },
  {
    name: "datagrid-014",
    title: "Закрепление по требованию",
    notes: ["Подпись: Смена", "Максимум закреплённых: 2", "Акцент: #323136"],
    node: <Datagrid014 caption="Смена" maxPinned={2} accent="#323136" />,
  },
  {
    name: "datagrid-015",
    title: "Перестановка строк",
    notes: [
      "Подпись: Подпись: тест",
      "Шаблон объявления: Смена",
      "Акцент: #9369e3",
    ],
    node: (
      <Datagrid015
        caption="Подпись: тест"
        liveTemplate="Смена"
        accent="#9369e3"
      />
    ),
  },
  {
    name: "datagrid-016",
    title: "Итог по выделению",
    notes: ["Подпись: Черновик", "Свёртка: max", "Акцент: #7c259f"],
    node: <Datagrid016 caption="Черновик" aggregate="max" accent="#7c259f" />,
  },
  {
    name: "datagrid-017",
    title: "Подтверждение выгрузки",
    notes: [
      "Подпись: Подпись: тест",
      "Кнопка выгрузки: Подпись: тест",
      "Акцент: #e30ed0",
    ],
    node: (
      <Datagrid017
        caption="Подпись: тест"
        exportLabel="Подпись: тест"
        accent="#e30ed0"
      />
    ),
  },
  {
    name: "datagrid-018",
    title: "Поиск по таблице",
    notes: [
      "Подпись: Подпись: тест",
      "Подсказка поля: Черновик",
      "Стартовый запрос: Ок",
      "Акцент: #12a34e",
    ],
    node: (
      <Datagrid018
        caption="Подпись: тест"
        placeholder="Черновик"
        defaultQuery="Ок"
        accent="#12a34e"
      />
    ),
  },
  {
    name: "datagrid-019",
    title: "Конструктор фильтров",
    notes: ["Подпись: Подпись: тест", "Связка: or", "Акцент: #466c7d"],
    node: <Datagrid019 caption="Подпись: тест" joiner="or" accent="#466c7d" />,
  },
  {
    name: "datagrid-020",
    title: "Сохранённые виды",
    notes: ["Подпись: Смена", "Представление: hot", "Акцент: #eeb7e7"],
    node: <Datagrid020 caption="Смена" startView="hot" accent="#eeb7e7" />,
  },
  {
    name: "datagrid-021",
    title: "Пакетная правка",
    notes: ["Подпись: Что дальше", "Режим правки: Смена", "Акцент: #923fa2"],
    node: (
      <Datagrid021 caption="Что дальше" editLabel="Смена" accent="#923fa2" />
    ),
  },
  {
    name: "datagrid-022",
    title: "Проверка ячейки",
    notes: ["Подпись: Черновик", "Максимум часов: 117", "Акцент: #89355b"],
    node: <Datagrid022 caption="Черновик" maxHours={117} accent="#89355b" />,
  },
  {
    name: "datagrid-023",
    title: "Вставка строк",
    notes: ["Подпись: Смена", "Формат строки: Что дальше", "Акцент: #5fde77"],
    node: (
      <Datagrid023
        caption="Смена"
        separatorHint="Что дальше"
        accent="#5fde77"
      />
    ),
  },
  {
    name: "datagrid-024",
    title: "Таблица-дерево",
    notes: ["Подпись: Подпись: тест", "Шаг отступа, px: 28", "Акцент: #3baaac"],
    node: (
      <Datagrid024 caption="Подпись: тест" depthStep={28} accent="#3baaac" />
    ),
  },
  {
    name: "datagrid-025",
    title: "Бесконечная прокрутка",
    notes: ["Подпись: Подпись: тест", "Строк в порции: 29", "Акцент: #11048d"],
    node: (
      <Datagrid025 caption="Подпись: тест" batchSize={29} accent="#11048d" />
    ),
  },
  {
    name: "datagrid-026",
    title: "Строка сравнения",
    notes: [
      "Подпись: Черновик",
      "Показывать отклонение: false",
      "Акцент: #d8bcbd",
    ],
    node: <Datagrid026 caption="Черновик" showDelta={false} accent="#d8bcbd" />,
  },
  {
    name: "datagrid-027",
    title: "Переключатель плотности",
    notes: ["Подпись: Черновик", "Плотность: compact", "Акцент: #bb50d9"],
    node: <Datagrid027 caption="Черновик" density="compact" accent="#bb50d9" />,
  },
  {
    name: "datagrid-028",
    title: "Меню действий строки",
    notes: ["Подпись: Смена", "Кнопка меню: Что дальше", "Акцент: #cd7a70"],
    node: (
      <Datagrid028 caption="Смена" triggerLabel="Что дальше" accent="#cd7a70" />
    ),
  },
  {
    name: "datagrid-030",
    title: "Закреплённая первая колонка",
    notes: ["Подпись: Проверка", "Подсказка: Проверка", "Акцент: #ab9901"],
    node: (
      <Datagrid030 caption="Проверка" scrollHint="Проверка" accent="#ab9901" />
    ),
  },
  {
    name: "datagrid-029",
    title: "Ошибка загрузки",
    notes: [
      "Подпись: Подпись: тест",
      "Код ошибки: Подпись: тест",
      "Акцент: #1642ab",
    ],
    node: (
      <Datagrid029
        caption="Подпись: тест"
        errorCode="Подпись: тест"
        accent="#1642ab"
      />
    ),
  },
  {
    name: "datagrid-031",
    title: "Замороженный угол",
    notes: [
      "Заголовок: Проверка",
      "Первая колонка: Черновик",
      "Акцент: #4c8f3b",
    ],
    node: (
      <Datagrid031 heading="Проверка" leadLabel="Черновик" accent="#4c8f3b" />
    ),
  },
]
