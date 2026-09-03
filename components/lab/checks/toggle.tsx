import type { LabCheck } from "@/components/lab/check-types"

import { Toggle001 } from "@/registry/components/toggle/toggle-001/toggle-001"
import { Toggle002 } from "@/registry/components/toggle/toggle-002/toggle-002"
import { Toggle003 } from "@/registry/components/toggle/toggle-003/toggle-003"
import { Toggle004 } from "@/registry/components/toggle/toggle-004/toggle-004"
import { Toggle005 } from "@/registry/components/toggle/toggle-005/toggle-005"
import { Toggle006 } from "@/registry/components/toggle/toggle-006/toggle-006"
import { Toggle007 } from "@/registry/components/toggle/toggle-007/toggle-007"
import { Toggle008 } from "@/registry/components/toggle/toggle-008/toggle-008"
import { Toggle009 } from "@/registry/components/toggle/toggle-009/toggle-009"
import { Toggle010 } from "@/registry/components/toggle/toggle-010/toggle-010"
import { Toggle011 } from "@/registry/components/toggle/toggle-011/toggle-011"
import { Toggle012 } from "@/registry/components/toggle/toggle-012/toggle-012"
import { Toggle013 } from "@/registry/components/toggle/toggle-013/toggle-013"
import { Toggle014 } from "@/registry/components/toggle/toggle-014/toggle-014"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 60513

export const CHECKS: LabCheck[] = [
  {
    name: "toggle-001",
    title: "Переключатель жирного",
    notes: [
      "Образец: Смена",
      "Имя кнопки: Что дальше",
      "Нажата: true",
      "Акцент: #f7a319",
    ],
    node: (
      <Toggle001
        text="Смена"
        label="Что дальше"
        defaultPressed={true}
        accent="#f7a319"
      />
    ),
  },
  {
    name: "toggle-002",
    title: "Закрепление",
    notes: [
      "Подпись: Смена",
      "Результат: Смена",
      "Строка выключенного: Проверка",
      "Нажата: true",
      "Акцент: #7daa3a",
    ],
    node: (
      <Toggle002
        label="Смена"
        onLabel="Смена"
        offLabel="Проверка"
        defaultPressed={true}
        accent="#7daa3a"
      />
    ),
  },
  {
    name: "toggle-003",
    title: "Звезда избранного",
    notes: [
      "Заголовок: Черновик",
      "Счётчик: 9640",
      "Имя кнопки: Смена",
      "Строка счётчика: Что дальше",
      "Нажата: true",
      "Акцент: #ef2254",
    ],
    node: (
      <Toggle003
        title="Черновик"
        count={9640}
        label="Смена"
        countText="Что дальше"
        defaultPressed={true}
        accent="#ef2254"
      />
    ),
  },
  {
    name: "toggle-004",
    title: "Сетка поверх",
    notes: [
      "Подпись: Смена",
      "Шаг сетки: 33",
      "Подпись холста: Черновик",
      "Строка под холстом: Черновик",
      "Нажата: false",
      "Акцент: #345b94",
    ],
    node: (
      <Toggle004
        label="Смена"
        step={33}
        caption="Черновик"
        note="Черновик"
        defaultPressed={false}
        accent="#345b94"
      />
    ),
  },
  {
    name: "toggle-005",
    title: "Отключение звука",
    notes: [
      "Имя кнопки: Что дальше",
      "Громкость: 83",
      "Нажата: true",
      "Акцент: #a14340",
    ],
    node: (
      <Toggle005
        label="Что дальше"
        volume={83}
        defaultPressed={true}
        accent="#a14340"
      />
    ),
  },
  {
    name: "toggle-006",
    title: "Переключатель с сохранением",
    notes: [
      "Подпись: Проверка",
      "Задержка, мс: 2815",
      "Нажата: false",
      "Акцент: #0e8ec4",
    ],
    node: (
      <Toggle006
        label="Проверка"
        delay={2815}
        defaultPressed={false}
        accent="#0e8ec4"
      />
    ),
  },
  {
    name: "toggle-007",
    title: "Масштаб текста",
    notes: [
      "Имя кнопки: Черновик",
      "Масштаб, %: 174",
      "Заголовок образца: Смена",
      "Строка масштаба: Подпись: тест",
      "Текст образца: Проверка",
      "Нажата: false",
      "Акцент: #d980ac",
    ],
    node: (
      <Toggle007
        label="Черновик"
        scale={174}
        heading="Смена"
        valueText="Подпись: тест"
        text="Проверка"
        defaultPressed={false}
        accent="#d980ac"
      />
    ),
  },
  {
    name: "toggle-008",
    title: "Переключатель с подсказкой",
    notes: [
      "Подпись: Подпись: тест",
      "Подсказка включённого: Черновик",
      "Подсказка отпущенного: Что дальше",
      "Пояснение: Подпись: тест",
      "Нажата: false",
      "Акцент: #5eb493",
    ],
    node: (
      <Toggle008
        label="Подпись: тест"
        onHint="Черновик"
        offHint="Что дальше"
        note="Подпись: тест"
        defaultPressed={false}
        accent="#5eb493"
      />
    ),
  },
  {
    name: "toggle-009",
    title: "Сердце избранного",
    notes: [
      "Имя кнопки: Черновик",
      "Счётчик: 4872",
      "Нажата: true",
      "Акцент: #439285",
    ],
    node: (
      <Toggle009
        label="Черновик"
        count={4872}
        defaultPressed={true}
        accent="#439285"
      />
    ),
  },
  {
    name: "toggle-010",
    title: "Эквалайзер и тишина",
    notes: ["Подпись плеера: Проверка", "Нажата: true", "Акцент: #45aae7"],
    node: <Toggle010 label="Проверка" defaultPressed={true} accent="#45aae7" />,
  },
  {
    name: "toggle-011",
    title: "Переключатель темы",
    notes: [
      "Подпись кнопки: Черновик",
      "Текст образца: Черновик",
      "Нажата: true",
      "Акцент светлой: #38d318",
      "Акцент тёмной: #5628fb",
    ],
    node: (
      <Toggle011
        label="Черновик"
        sample="Черновик"
        defaultPressed={true}
        accentLight="#38d318"
        accentDark="#5628fb"
      />
    ),
  },
  {
    name: "toggle-012",
    title: "Подписка на уведомления",
    notes: [
      "Подпись: Смена",
      "Задержка, мс: 1902",
      "Нажата: false",
      "Акцент: #c167b7",
    ],
    node: (
      <Toggle012
        label="Смена"
        delay={1902}
        defaultPressed={false}
        accent="#c167b7"
      />
    ),
  },
  {
    name: "toggle-013",
    title: "Показ пароля",
    notes: [
      "Подпись поля: Черновик",
      "Значение поля: Подпись: тест",
      "Пароль виден: false",
      "Акцент: #3c1abe",
    ],
    node: (
      <Toggle013
        fieldLabel="Черновик"
        defaultValue="Подпись: тест"
        defaultPressed={false}
        accent="#3c1abe"
      />
    ),
  },
  {
    name: "toggle-014",
    title: "Поворот булавки",
    notes: [
      "Заголовок: Черновик",
      "Заметка: Подпись: тест",
      "Заметка закрепления: Подпись: тест",
      "Закреплено: true",
      "Акцент: #1d17d4",
    ],
    node: (
      <Toggle014
        title="Черновик"
        note="Подпись: тест"
        pinnedNote="Подпись: тест"
        defaultPressed={true}
        accent="#1d17d4"
      />
    ),
  },
]
