import type { LabCheck } from "@/components/lab/check-types"

import { Calendar001 } from "@/registry/components/calendar/calendar-001/calendar-001"
import { Calendar002 } from "@/registry/components/calendar/calendar-002/calendar-002"
import { Calendar003 } from "@/registry/components/calendar/calendar-003/calendar-003"
import { Calendar004 } from "@/registry/components/calendar/calendar-004/calendar-004"
import { Calendar005 } from "@/registry/components/calendar/calendar-005/calendar-005"
import { Calendar006 } from "@/registry/components/calendar/calendar-006/calendar-006"
import { Calendar007 } from "@/registry/components/calendar/calendar-007/calendar-007"
import { Calendar008 } from "@/registry/components/calendar/calendar-008/calendar-008"
import { Calendar009 } from "@/registry/components/calendar/calendar-009/calendar-009"
import { Calendar010 } from "@/registry/components/calendar/calendar-010/calendar-010"
import { Calendar011 } from "@/registry/components/calendar/calendar-011/calendar-011"
import { Calendar012 } from "@/registry/components/calendar/calendar-012/calendar-012"
import { Calendar013 } from "@/registry/components/calendar/calendar-013/calendar-013"
import { Calendar014 } from "@/registry/components/calendar/calendar-014/calendar-014"
import { Calendar015 } from "@/registry/components/calendar/calendar-015/calendar-015"
import { Calendar016 } from "@/registry/components/calendar/calendar-016/calendar-016"
import { Calendar017 } from "@/registry/components/calendar/calendar-017/calendar-017"
import { Calendar018 } from "@/registry/components/calendar/calendar-018/calendar-018"
import { Calendar019 } from "@/registry/components/calendar/calendar-019/calendar-019"
import { Calendar020 } from "@/registry/components/calendar/calendar-020/calendar-020"
import { Calendar021 } from "@/registry/components/calendar/calendar-021/calendar-021"
import { Calendar022 } from "@/registry/components/calendar/calendar-022/calendar-022"
import { Calendar023 } from "@/registry/components/calendar/calendar-023/calendar-023"
import { Calendar024 } from "@/registry/components/calendar/calendar-024/calendar-024"
import { Calendar025 } from "@/registry/components/calendar/calendar-025/calendar-025"
import { Calendar026 } from "@/registry/components/calendar/calendar-026/calendar-026"
import { Calendar027 } from "@/registry/components/calendar/calendar-027/calendar-027"
import { Calendar028 } from "@/registry/components/calendar/calendar-028/calendar-028"
import { Calendar029 } from "@/registry/components/calendar/calendar-029/calendar-029"
import { Calendar030 } from "@/registry/components/calendar/calendar-030/calendar-030"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 76351

export const CHECKS: LabCheck[] = [
  {
    name: "calendar-001",
    title: "Сетка месяца",
    notes: ["Дата: 2026-01-08", "Локаль: ru-RU", "Акцент: #434492"],
    node: (
      <Calendar001 defaultValue="2026-01-08" locale="ru-RU" accent="#434492" />
    ),
  },
  {
    name: "calendar-002",
    title: "Выбор диапазона",
    notes: [
      "Начало: 2026-07-01",
      "Конец: 2026-01-08",
      "Акцент: #c879c5",
      "Локаль: de-DE",
    ],
    node: (
      <Calendar002
        defaultFrom="2026-07-01"
        defaultTo="2026-01-08"
        accent="#c879c5"
        locale="de-DE"
      />
    ),
  },
  {
    name: "calendar-003",
    title: "Полоса недели",
    notes: ["Дней: 20", "Акцент: #05ddc0", "Локаль: de-DE"],
    node: <Calendar003 days={20} accent="#05ddc0" locale="de-DE" />,
  },
  {
    name: "calendar-004",
    title: "Слоты времени",
    notes: [
      "День: Что дальше",
      "Часовой пояс: Подпись: тест",
      "Акцент: #169cfe",
    ],
    node: (
      <Calendar004
        date="Что дальше"
        timezone="Подпись: тест"
        accent="#169cfe"
      />
    ),
  },
  {
    name: "calendar-005",
    title: "Нативное поле даты",
    notes: ["Подпись: Что дальше", "Пояснение: Черновик", "Акцент: #57c0a9"],
    node: <Calendar005 label="Что дальше" hint="Черновик" accent="#57c0a9" />,
  },
  {
    name: "calendar-006",
    title: "Повестка дня",
    notes: [
      "День: Подпись: тест",
      "Слово промежутка: Что дальше",
      "Акцент: #420b66",
    ],
    node: (
      <Calendar006
        date="Подпись: тест"
        freeLabel="Что дальше"
        accent="#420b66"
      />
    ),
  },
  {
    name: "calendar-007",
    title: "Тепловая карта загрузки",
    notes: ["Месяц: 2", "Год: 2025", "Акцент: #eba3ad", "Локаль: de-DE"],
    node: <Calendar007 month={2} year={2025} accent="#eba3ad" locale="de-DE" />,
  },
  {
    name: "calendar-008",
    title: "Выбор месяца",
    notes: ["Год: 2022", "Месяц: 1", "Акцент: #03c4fc", "Локаль: en-US"],
    node: (
      <Calendar008
        defaultYear={2022}
        defaultMonth={1}
        accent="#03c4fc"
        locale="en-US"
      />
    ),
  },
  {
    name: "calendar-009",
    title: "Диапазон по двум месяцам",
    notes: [
      "Начало: 2025-11-23",
      "Конец: 2026-03-14",
      "Акцент: #7ae94a",
      "Локаль: ru-RU",
    ],
    node: (
      <Calendar009
        from="2025-11-23"
        to="2026-03-14"
        accent="#7ae94a"
        locale="ru-RU"
      />
    ),
  },
  {
    name: "calendar-010",
    title: "Карточка события",
    notes: [
      "Название: Черновик",
      "Время: Черновик",
      "Место: Смена",
      "Акцент: #c42666",
      "Локаль: ru-RU",
    ],
    node: (
      <Calendar010
        title="Черновик"
        time="Черновик"
        place="Смена"
        accent="#c42666"
        locale="ru-RU"
      />
    ),
  },
  {
    name: "calendar-011",
    title: "Обзор года",
    notes: ["Год: 2018", "Локаль: ru-RU", "Акцент: #fde10b"],
    node: <Calendar011 year={2018} locale="ru-RU" accent="#fde10b" />,
  },
  {
    name: "calendar-012",
    title: "Выбор десятилетия",
    notes: ["Год: 0", "Верхняя граница: 2085", "Акцент: #c14e9d"],
    node: <Calendar012 defaultValue={0} max={2085} accent="#c14e9d" />,
  },
  {
    name: "calendar-013",
    title: "Закрытое прошлое",
    notes: [
      "Причина отказа: Что дальше",
      "Сегодня: 2026-07-01",
      "Язык подписей: de-DE",
      "Акцент: #c1295a",
    ],
    node: (
      <Calendar013
        reason="Что дальше"
        today="2026-07-01"
        locale="de-DE"
        accent="#c1295a"
      />
    ),
  },
  {
    name: "calendar-014",
    title: "Мини-календарь в панели",
    notes: [
      "Подпись ссылки: Проверка",
      "Месяц: 8",
      "Год: 2029",
      "Текущий день: 2",
      "Акцент: #9620d1",
    ],
    node: (
      <Calendar014
        caption="Проверка"
        month={8}
        year={2029}
        today={2}
        accent="#9620d1"
      />
    ),
  },
  {
    name: "calendar-015",
    title: "Дата и время",
    notes: [
      "Время: Проверка",
      "Кнопка: Проверка",
      "Шаг, минут: 49",
      "Язык подписей: en-US",
      "Акцент: #21917f",
    ],
    node: (
      <Calendar015
        defaultTime="Проверка"
        submitText="Проверка"
        step={49}
        locale="en-US"
        accent="#21917f"
      />
    ),
  },
  {
    name: "calendar-016",
    title: "Неделя команды",
    notes: [
      "Заголовок: Подпись: тест",
      "Норма дня, часов: 2",
      "Язык дат: de-DE",
      "Акцент: #eb3da3",
    ],
    node: (
      <Calendar016
        heading="Подпись: тест"
        capacity={2}
        locale="de-DE"
        accent="#eb3da3"
      />
    ),
  },
  {
    name: "calendar-017",
    title: "Отметки праздников",
    notes: ["Месяц: 3", "Год: 2026", "Язык подписей: de-DE", "Акцент: #f19659"],
    node: <Calendar017 month={3} year={2026} locale="de-DE" accent="#f19659" />,
  },
  {
    name: "calendar-018",
    title: "Выбор нескольких дат",
    notes: [
      "Предел выбора: 8",
      "Подсказка: Подпись: тест",
      "Язык подписей: de-DE",
      "Акцент: #d3711a",
    ],
    node: (
      <Calendar018
        max={8}
        emptyHint="Подпись: тест"
        locale="de-DE"
        accent="#d3711a"
      />
    ),
  },
  {
    name: "calendar-019",
    title: "Календарь цен",
    notes: [
      "Базовая цена: 62188",
      "Ночей: 27",
      "Валюта: Тест",
      "Язык подписей: de-DE",
      "Акцент: #d9e1e9",
    ],
    node: (
      <Calendar019
        basePrice={62188}
        nights={27}
        currency="Тест"
        locale="de-DE"
        accent="#d9e1e9"
      />
    ),
  },
  {
    name: "calendar-020",
    title: "Отсчёт до срока",
    notes: [
      "Название: Проверка",
      "Срок: 2025-11-23T18:00",
      "Язык подписей: de-DE",
      "Акцент: #793d8f",
    ],
    node: (
      <Calendar020
        heading="Проверка"
        deadline="2025-11-23T18:00"
        locale="de-DE"
        accent="#793d8f"
      />
    ),
  },
  {
    name: "calendar-021",
    title: "Сетка по неделям ISO",
    notes: [
      "Месяц: 2026-01",
      "Подпись: Что дальше",
      "Локаль: ru-RU",
      "Акцент: #bc382b",
    ],
    node: (
      <Calendar021
        month="2026-01"
        hint="Что дальше"
        locale="ru-RU"
        accent="#bc382b"
      />
    ),
  },
  {
    name: "calendar-022",
    title: "Рабочие дни",
    notes: [
      "Часов в дне: 12",
      "Заголовок: Подпись: тест",
      "Локаль: en-US",
      "Акцент: #f4356d",
    ],
    node: (
      <Calendar022
        hoursPerDay={12}
        label="Подпись: тест"
        locale="en-US"
        accent="#f4356d"
      />
    ),
  },
  {
    name: "calendar-023",
    title: "Слоты в двух поясах",
    notes: [
      "Пояс партнёра: Europe/Berlin",
      "Дата: 2026-01-08",
      "Локаль: en-US",
      "Акцент: #9cd449",
    ],
    node: (
      <Calendar023
        awayZone="Europe/Berlin"
        date="2026-01-08"
        locale="en-US"
        accent="#9cd449"
      />
    ),
  },
  {
    name: "calendar-024",
    title: "Поля даты рождения",
    notes: [
      "Минимальный возраст: 41",
      "Заголовок: Смена",
      "Локаль: de-DE",
      "Акцент: #519892",
    ],
    node: (
      <Calendar024 minAge={41} label="Смена" locale="de-DE" accent="#519892" />
    ),
  },
  {
    name: "calendar-025",
    title: "График смен",
    notes: [
      "Плотность: compact",
      "Цвет ночной смены: #d213d5",
      "Начало недели: 2026-03-14",
    ],
    node: (
      <Calendar025 density="compact" accent="#d213d5" weekStart="2026-03-14" />
    ),
  },
  {
    name: "calendar-026",
    title: "Правило повтора",
    notes: [
      "Единица повтора: weekly",
      "Интервал: 12",
      "Показать дат: 4",
      "Акцент: #f3fef2",
    ],
    node: (
      <Calendar026
        defaultFrequency="weekly"
        defaultInterval={12}
        occurrences={4}
        accent="#f3fef2"
      />
    ),
  },
  {
    name: "calendar-027",
    title: "Готовые диапазоны",
    notes: ["Пресет: today", "Акцент: #2e61bf", "Опорная дата: 2026-03-14"],
    node: (
      <Calendar027 defaultPreset="today" accent="#2e61bf" today="2026-03-14" />
    ),
  },
  {
    name: "calendar-028",
    title: "Почасовое бронирование",
    notes: [
      "Открытие: 3",
      "Закрытие: 7",
      "Акцент: #eeb602",
      "Название ресурса: Проверка",
    ],
    node: (
      <Calendar028
        openFrom={3}
        openTo={7}
        accent="#eeb602"
        heading="Проверка"
      />
    ),
  },
  {
    name: "calendar-029",
    title: "Чип фильтра по дате",
    notes: ["Акцент: #5ae755", "Подпись: Ня", "Значение: 2026-01-08"],
    node: <Calendar029 accent="#5ae755" label="Ня" defaultValue="2026-01-08" />,
  },
  {
    name: "calendar-030",
    title: "Ограниченный диапазон",
    notes: ["Максимум дней: 12", "Акцент: #2770cc", "Месяц: 2025-11"],
    node: <Calendar030 maxDays={12} accent="#2770cc" month="2025-11" />,
  },
]
