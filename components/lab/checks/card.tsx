import type { LabCheck } from "@/components/lab/check-types"

import { Card001 } from "@/registry/components/card/card-001/card-001"
import { Card002 } from "@/registry/components/card/card-002/card-002"
import { Card003 } from "@/registry/components/card/card-003/card-003"
import { Card004 } from "@/registry/components/card/card-004/card-004"
import { Card005 } from "@/registry/components/card/card-005/card-005"
import { Card006 } from "@/registry/components/card/card-006/card-006"
import { Card007 } from "@/registry/components/card/card-007/card-007"
import { Card008 } from "@/registry/components/card/card-008/card-008"
import { Card009 } from "@/registry/components/card/card-009/card-009"
import { Card010 } from "@/registry/components/card/card-010/card-010"
import { Card011 } from "@/registry/components/card/card-011/card-011"
import { Card012 } from "@/registry/components/card/card-012/card-012"
import { Card013 } from "@/registry/components/card/card-013/card-013"
import { Card014 } from "@/registry/components/card/card-014/card-014"
import { Card015 } from "@/registry/components/card/card-015/card-015"
import { Card016 } from "@/registry/components/card/card-016/card-016"
import { Card017 } from "@/registry/components/card/card-017/card-017"
import { Card018 } from "@/registry/components/card/card-018/card-018"
import { Card019 } from "@/registry/components/card/card-019/card-019"
import { Card020 } from "@/registry/components/card/card-020/card-020"
import { Card021 } from "@/registry/components/card/card-021/card-021"
import { Card022 } from "@/registry/components/card/card-022/card-022"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 44675

export const CHECKS: LabCheck[] = [
  {
    name: "card-001",
    title: "Карточка материала",
    notes: [
      "Надзаголовок: Смена",
      "Заголовок: Подпись: тест",
      "Описание: Проверка",
      "Подвал: Подпись: тест",
      "Акцент: #257bd9",
    ],
    node: (
      <Card001
        eyebrow="Смена"
        title="Подпись: тест"
        description="Проверка"
        footer="Подпись: тест"
        accent="#257bd9"
      />
    ),
  },
  {
    name: "card-002",
    title: "Карточка показателя",
    notes: [
      "Показатель: Смена",
      "Значение: Подпись: тест",
      "Изменение, %: 46",
      "Акцент: #3f2b20",
      "Хорошее направление: down",
    ],
    node: (
      <Card002
        title="Смена"
        value="Подпись: тест"
        change={46}
        accent="#3f2b20"
        goodDirection="down"
      />
    ),
  },
  {
    name: "card-003",
    title: "Карточка человека",
    notes: [
      "Имя: Проверка",
      "Роль: Черновик",
      "Действие: Подпись: тест",
      "Второе действие: Что дальше",
      "Акцент: #3268f6",
    ],
    node: (
      <Card003
        name="Проверка"
        role="Черновик"
        actionLabel="Подпись: тест"
        secondaryLabel="Что дальше"
        accent="#3268f6"
      />
    ),
  },
  {
    name: "card-004",
    title: "Карточка товара",
    notes: [
      "Название: Проверка",
      "Цена: Проверка",
      "Плашка: Подпись: тест",
      "Кнопка: Черновик",
      "Старая цена: Смена",
      "Рейтинг: 5",
      "Акцент: #82fdb5",
    ],
    node: (
      <Card004
        title="Проверка"
        price="Проверка"
        badge="Подпись: тест"
        actionLabel="Черновик"
        oldPrice="Смена"
        rating={5}
        accent="#82fdb5"
      />
    ),
  },
  {
    name: "card-005",
    title: "Карточки выбора",
    notes: ["Название группы: Подпись: тест", "Акцент: #66fde5"],
    node: <Card005 legend="Подпись: тест" accent="#66fde5" />,
  },
  {
    name: "card-006",
    title: "Карточка задачи",
    notes: [
      "Задача: Что дальше",
      "Статус: review",
      "Готово: 11",
      "Всего: 29",
      "Акцент: #ca9cb7",
    ],
    node: (
      <Card006
        title="Что дальше"
        status="review"
        done={11}
        total={29}
        accent="#ca9cb7"
      />
    ),
  },
  {
    name: "card-007",
    title: "Карточка уведомления",
    notes: [
      "Отправитель: Черновик",
      "Заголовок: Черновик",
      "Главное действие: Проверка",
      "Второе действие: Что дальше",
      "Акцент: #9fc284",
    ],
    node: (
      <Card007
        from="Черновик"
        title="Черновик"
        primaryLabel="Проверка"
        secondaryLabel="Что дальше"
        accent="#9fc284"
      />
    ),
  },
  {
    name: "card-008",
    title: "Карточка добавления",
    notes: ["Действие: Смена", "Что появится: Проверка", "Акцент: #eec1d6"],
    node: <Card008 title="Смена" hint="Проверка" accent="#eec1d6" />,
  },
  {
    name: "card-009",
    title: "Карточка с подробностями",
    notes: [
      "Заголовок: Проверка",
      "Подпись раскрытия: Что дальше",
      "Раскрыть сразу: true",
      "Акцент: #a887de",
    ],
    node: (
      <Card009
        title="Проверка"
        moreLabel="Что дальше"
        defaultOpen={true}
        accent="#a887de"
      />
    ),
  },
  {
    name: "card-010",
    title: "Скелетон карточки",
    notes: ["Строк: 1", "Обложка: false", "Подпись: Черновик"],
    node: <Card010 lines={1} media={false} label="Черновик" />,
  },
  {
    name: "card-011",
    title: "Карточка закладки",
    notes: [
      "Заголовок: Проверка",
      "Домен: Подпись: тест",
      "Акцент: #5d8791",
      "Внешняя ссылка: true",
    ],
    node: (
      <Card011
        title="Проверка"
        url="Подпись: тест"
        accent="#5d8791"
        external={true}
      />
    ),
  },
  {
    name: "card-012",
    title: "Карточка с кадром",
    notes: [
      "Соотношение: 3/2",
      "Заголовок: Подпись: тест",
      "Длительность: Что дальше",
      "Плашка: Что дальше",
      "Акцент: #81e226",
    ],
    node: (
      <Card012
        ratio="3/2"
        title="Подпись: тест"
        duration="Что дальше"
        badge="Что дальше"
        accent="#81e226"
      />
    ),
  },
  {
    name: "card-013",
    title: "Карточка с адаптивной раскладкой",
    notes: ["Заголовок: Проверка", "Подпись: Черновик", "Акцент: #d1be4d"],
    node: <Card013 title="Проверка" meta="Черновик" accent="#d1be4d" />,
  },
  {
    name: "card-014",
    title: "Плитка с изменением",
    notes: [
      "Показатель: Подпись: тест",
      "Изменение, %: 21",
      "Рост — плохо: true",
      "Акцент: #afc808",
    ],
    node: (
      <Card014
        label="Подпись: тест"
        delta={21}
        invert={true}
        accent="#afc808"
      />
    ),
  },
  {
    name: "card-015",
    title: "Карточка-чеклист",
    notes: [
      "Задача: Что дальше",
      "Показывать выполненные: true",
      "Акцент: #a48b01",
    ],
    node: <Card015 title="Что дальше" showDone={true} accent="#a48b01" />,
  },
  {
    name: "card-016",
    title: "Карточка файла",
    notes: [
      "Имя файла: Подпись: тест",
      "Тип: code",
      "Размер: Подпись: тест",
      "Акцент: #745649",
    ],
    node: (
      <Card016
        name="Подпись: тест"
        kind="code"
        size="Подпись: тест"
        accent="#745649"
      />
    ),
  },
  {
    name: "card-017",
    title: "Карточка с цитатой",
    notes: [
      "Цитата: Черновик",
      "Автор: Что дальше",
      "Оценка: 4",
      "Акцент: #ea6b99",
    ],
    node: (
      <Card017
        quote="Черновик"
        author="Что дальше"
        rating={4}
        accent="#ea6b99"
      />
    ),
  },
  {
    name: "card-018",
    title: "Карточка выделенного тарифа",
    notes: [
      "Тариф: Что дальше",
      "Цена: Что дальше",
      "Рекомендуем: false",
      "Акцент: #6a1db5",
    ],
    node: (
      <Card018
        name="Что дальше"
        price="Что дальше"
        featured={false}
        accent="#6a1db5"
      />
    ),
  },
  {
    name: "card-019",
    title: "Карточка пустого состояния",
    notes: ["Заголовок: Черновик", "Объяснение: Смена", "Акцент: #af5d61"],
    node: <Card019 title="Черновик" description="Смена" accent="#af5d61" />,
  },
  {
    name: "card-020",
    title: "Карточка со сроком",
    notes: [
      "Важность: info",
      "Заголовок: Черновик",
      "Время: Подпись: тест",
      "Акцент: #2359fb",
    ],
    node: (
      <Card020
        severity="info"
        title="Черновик"
        time="Подпись: тест"
        accent="#2359fb"
      />
    ),
  },
  {
    name: "card-021",
    title: "Скелетон ленты",
    notes: [
      "Строк: 2",
      "Аватар: true",
      "Подпись: Что дальше",
      "Акцент: #d1ec64",
    ],
    node: (
      <Card021 rows={2} avatar={true} label="Что дальше" accent="#d1ec64" />
    ),
  },
  {
    name: "card-022",
    title: "Карточка события",
    notes: [
      "Заголовок: Подпись: тест",
      "День: 24",
      "Время: 20:15",
      "Место: Смена",
      "Акцент: #2f7d5c",
    ],
    node: (
      <Card022
        title="Подпись: тест"
        dateDay="24"
        time="20:15"
        location="Смена"
        accent="#2f7d5c"
      />
    ),
  },
]
