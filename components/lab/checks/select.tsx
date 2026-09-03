import type { LabCheck } from "@/components/lab/check-types"

import { Select001 } from "@/registry/components/select/select-001/select-001"
import { Select002 } from "@/registry/components/select/select-002/select-002"
import { Select003 } from "@/registry/components/select/select-003/select-003"
import { Select004 } from "@/registry/components/select/select-004/select-004"
import { Select005 } from "@/registry/components/select/select-005/select-005"
import { Select006 } from "@/registry/components/select/select-006/select-006"
import { Select007 } from "@/registry/components/select/select-007/select-007"
import { Select008 } from "@/registry/components/select/select-008/select-008"
import { Select009 } from "@/registry/components/select/select-009/select-009"
import { Select010 } from "@/registry/components/select/select-010/select-010"
import { Select011 } from "@/registry/components/select/select-011/select-011"
import { Select012 } from "@/registry/components/select/select-012/select-012"
import { Select013 } from "@/registry/components/select/select-013/select-013"
import { Select014 } from "@/registry/components/select/select-014/select-014"
import { Select015 } from "@/registry/components/select/select-015/select-015"
import { Select016 } from "@/registry/components/select/select-016/select-016"
import { Select017 } from "@/registry/components/select/select-017/select-017"
import { Select018 } from "@/registry/components/select/select-018/select-018"
import { Select019 } from "@/registry/components/select/select-019/select-019"
import { Select020 } from "@/registry/components/select/select-020/select-020"
import { Select021 } from "@/registry/components/select/select-021/select-021"
import { Select022 } from "@/registry/components/select/select-022/select-022"
import { Select023 } from "@/registry/components/select/select-023/select-023"
import { Select024 } from "@/registry/components/select/select-024/select-024"
import { Select025 } from "@/registry/components/select/select-025/select-025"
import { Select026 } from "@/registry/components/select/select-026/select-026"
import { Select027 } from "@/registry/components/select/select-027/select-027"
import { Select028 } from "@/registry/components/select/select-028/select-028"
import { Select029 } from "@/registry/components/select/select-029/select-029"
import { Select030 } from "@/registry/components/select/select-030/select-030"
import { Select031 } from "@/registry/components/select/select-031/select-031"
import { Select032 } from "@/registry/components/select/select-032/select-032"
import { Select033 } from "@/registry/components/select/select-033/select-033"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 60513

export const CHECKS: LabCheck[] = [
  {
    name: "select-001",
    title: "Нативный список",
    notes: [
      "Подпись: Смена",
      "Заглушка: Что дальше",
      "Размер: md",
      "Акцент: #f7a319",
      "Выключено: true",
    ],
    node: (
      <Select001
        label="Смена"
        placeholder="Что дальше"
        size="md"
        accent="#f7a319"
        disabled={true}
      />
    ),
  },
  {
    name: "select-002",
    title: "Нативный список с группами",
    notes: [
      "Подпись: Что дальше",
      "Подсказка: Что дальше",
      "Заглушка: Что дальше",
      "Акцент: #7daa3a",
    ],
    node: (
      <Select002
        label="Что дальше"
        hint="Что дальше"
        placeholder="Что дальше"
        accent="#7daa3a"
      />
    ),
  },
  {
    name: "select-003",
    title: "Список с иконкой",
    notes: ["Подпись: Черновик", "Значение: cash", "Акцент: #062812"],
    node: <Select003 label="Черновик" defaultValue="cash" accent="#062812" />,
  },
  {
    name: "select-004",
    title: "Список с множественным выбором",
    notes: ["Высота списка: 5", "Подсказка: Черновик", "Акцент: #2254d6"],
    node: <Select004 rows={5} hint="Черновик" accent="#2254d6" />,
  },
  {
    name: "select-005",
    title: "Список с пояснениями",
    notes: ["Подпись: Проверка", "Значение: editor", "Акцент: #d5afea"],
    node: <Select005 label="Проверка" defaultValue="editor" accent="#d5afea" />,
  },
  {
    name: "select-006",
    title: "Список в строке заказа",
    notes: [
      "Товар: Что дальше",
      "Цена: 35521",
      "Валюта: Ок",
      "Акцент: #42d43c",
    ],
    node: (
      <Select006
        title="Что дальше"
        price={35521}
        currency="Ок"
        accent="#42d43c"
      />
    ),
  },
  {
    name: "select-007",
    title: "Загружающийся список",
    notes: [
      "Загрузка: false",
      "Текст ожидания: Что дальше",
      "Заглушка: Проверка",
      "Акцент: #b0e50e",
    ],
    node: (
      <Select007
        loading={false}
        loadingText="Что дальше"
        placeholder="Проверка"
        accent="#b0e50e"
      />
    ),
  },
  {
    name: "select-008",
    title: "Список с ошибкой",
    notes: [
      "Текст ошибки: Проверка",
      "Заглушка: Черновик",
      "Подсказка: Черновик",
      "Акцент: #107b7b",
    ],
    node: (
      <Select008
        error="Проверка"
        placeholder="Черновик"
        hint="Черновик"
        accent="#107b7b"
      />
    ),
  },
  {
    name: "select-009",
    title: "Обязательный список",
    notes: ["Заглушка: Проверка", "Подсказка: Черновик", "Акцент: #80ac12"],
    node: <Select009 placeholder="Проверка" hint="Черновик" accent="#80ac12" />,
  },
  {
    name: "select-010",
    title: "Список с поиском",
    notes: [
      "Подпись: Смена",
      "Плейсхолдер: Подпись: тест",
      "Текст пустого результата: Что дальше",
      "Акцент: #97ae5e",
    ],
    node: (
      <Select010
        label="Смена"
        placeholder="Подпись: тест"
        emptyText="Что дальше"
        accent="#97ae5e"
      />
    ),
  },
  {
    name: "select-011",
    title: "Список с точкой статуса",
    notes: ["Подпись: Подпись: тест", "Значение: done", "Акцент: #df7c6d"],
    node: (
      <Select011 label="Подпись: тест" defaultValue="done" accent="#df7c6d" />
    ),
  },
  {
    name: "select-012",
    title: "Список кодов стран",
    notes: ["Подпись: Подпись: тест", "Значение: us", "Акцент: #96c024"],
    node: (
      <Select012 label="Подпись: тест" defaultValue="us" accent="#96c024" />
    ),
  },
  {
    name: "select-013",
    title: "Множественный выбор чипами",
    notes: [
      "Подпись: Проверка",
      "Текст кнопки: Черновик",
      "Текст пустого набора: Что дальше",
      "Подпись удаления: Что дальше",
      "Акцент: #38d318",
    ],
    node: (
      <Select013
        label="Проверка"
        addLabel="Черновик"
        emptyText="Что дальше"
        removeLabel="Что дальше"
        accent="#38d318"
      />
    ),
  },
  {
    name: "select-014",
    title: "Выбор исполнителя с аватаром",
    notes: ["Подпись: Смена", "Значение: mark", "Акцент: #b02172"],
    node: <Select014 label="Смена" defaultValue="mark" accent="#b02172" />,
  },
  {
    name: "select-015",
    title: "Варианты в две строки",
    notes: ["Подпись: Проверка", "Значение: daily", "Акцент: #b789ec"],
    node: <Select015 label="Проверка" defaultValue="daily" accent="#b789ec" />,
  },
  {
    name: "select-016",
    title: "Часовой пояс с часами",
    notes: [
      "Подпись: Подпись: тест",
      "Значение: newyork",
      "Акцент: #3c1abe",
      "Локаль часов: ru-RU",
    ],
    node: (
      <Select016
        label="Подпись: тест"
        defaultValue="newyork"
        accent="#3c1abe"
        locale="ru-RU"
      />
    ),
  },
  {
    name: "select-017",
    title: "Повтор после ошибки",
    notes: [
      "Подпись: Подпись: тест",
      "Состояние: loading",
      "Акцент: #814c1d",
      "Текст пустого варианта: Черновик",
    ],
    node: (
      <Select017
        label="Подпись: тест"
        defaultStatus="loading"
        accent="#814c1d"
        placeholderText="Черновик"
      />
    ),
  },
  {
    name: "select-018",
    title: "Язык интерфейса",
    notes: ["Подпись: Что дальше", "Значение: ru", "Акцент: #8ed8a7"],
    node: <Select018 label="Что дальше" defaultValue="ru" accent="#8ed8a7" />,
  },
  {
    name: "select-019",
    title: "Валюта с курсом",
    notes: [
      "Подпись: Смена",
      "Значение: cny",
      "Акцент: #05750f",
      "Строка курса: Проверка",
    ],
    node: (
      <Select019
        label="Смена"
        defaultValue="cny"
        accent="#05750f"
        rateText="Проверка"
      />
    ),
  },
  {
    name: "select-020",
    title: "Выбор периода",
    notes: [
      "Подпись: Черновик",
      "Значение: quarter",
      "Акцент: #0f2e3f",
      "Пункт своего диапазона: Черновик",
    ],
    node: (
      <Select020
        label="Черновик"
        defaultValue="quarter"
        accent="#0f2e3f"
        customLabel="Черновик"
      />
    ),
  },
  {
    name: "select-021",
    title: "Нативный список с иконками",
    notes: ["Подпись: Подпись: тест", "Значение: email", "Акцент: #333f92"],
    node: (
      <Select021 label="Подпись: тест" defaultValue="email" accent="#333f92" />
    ),
  },
  {
    name: "select-022",
    title: "Список внутри предложения",
    notes: [
      "Текст до поля: Проверка",
      "Текст после поля: Подпись: тест",
      "Значение: 10",
      "Акцент: #d5c2d3",
    ],
    node: (
      <Select022
        before="Проверка"
        after="Подпись: тест"
        defaultValue="10"
        accent="#d5c2d3"
      />
    ),
  },
  {
    name: "select-023",
    title: "Размер с подсказкой",
    notes: [
      "Подпись: Подпись: тест",
      "Подсказка: Смена",
      "Акцент: #69adce",
      "Значение: m",
    ],
    node: (
      <Select023
        label="Подпись: тест"
        hint="Смена"
        accent="#69adce"
        defaultValue="m"
      />
    ),
  },
  {
    name: "select-024",
    title: "Причина недоступности",
    notes: ["Подпись: Смена", "Заглушка: Черновик", "Акцент: #5e62cf"],
    node: <Select024 label="Смена" placeholder="Черновик" accent="#5e62cf" />,
  },
  {
    name: "select-025",
    title: "Зависимая категория",
    notes: [
      "Подпись категории: Смена",
      "Подпись товара: Смена",
      "Категория по умолчанию: clothes",
      "Акцент: #286122",
    ],
    node: (
      <Select025
        categoryLabel="Смена"
        itemLabel="Смена"
        defaultCategory="clothes"
        accent="#286122"
      />
    ),
  },
  {
    name: "select-026",
    title: "Количество по остатку",
    notes: [
      "Подпись: Подпись: тест",
      "Остаток на складе: 7",
      "Акцент: #369b37",
      "Потолок списка: 11",
      "Порог низкого остатка: 5",
    ],
    node: (
      <Select026
        label="Подпись: тест"
        stock={7}
        accent="#369b37"
        maxOption={11}
        lowStockThreshold={5}
      />
    ),
  },
  {
    name: "select-027",
    title: "Переход по алфавиту",
    notes: ["Подпись: Смена", "Акцент: #8a33b8"],
    node: <Select027 label="Смена" accent="#8a33b8" />,
  },
  {
    name: "select-028",
    title: "Приоритет плашкой",
    notes: ["Подпись: Проверка", "Значение: high", "Акцент: #863ac5"],
    node: <Select028 label="Проверка" defaultValue="high" accent="#863ac5" />,
  },
  {
    name: "select-029",
    title: "Шаблон миниатюрой",
    notes: ["Подпись: Проверка", "Значение: grid", "Акцент: #5a0d95"],
    node: <Select029 label="Проверка" defaultValue="grid" accent="#5a0d95" />,
  },
  {
    name: "select-030",
    title: "Компактная строка фильтров",
    notes: ["Заголовок панели: Подпись: тест", "Акцент: #d01e04"],
    node: <Select030 legend="Подпись: тест" accent="#d01e04" />,
  },
  {
    name: "select-031",
    title: "Недавние значения",
    notes: ["Подпись: Смена", "Акцент: #df7a78"],
    node: <Select031 label="Смена" accent="#df7a78" />,
  },
  {
    name: "select-032",
    title: "Подтверждение смены",
    notes: ["Подпись: Черновик", "Значение: review", "Акцент: #f910df"],
    node: <Select032 label="Черновик" defaultValue="review" accent="#f910df" />,
  },
  {
    name: "select-033",
    title: "Список по ширине содержимого",
    notes: ["Подпись: Черновик", "Потолок ширины (ch): 24", "Акцент: #d6f863"],
    node: <Select033 label="Черновик" maxWidthCh={24} accent="#d6f863" />,
  },
]
