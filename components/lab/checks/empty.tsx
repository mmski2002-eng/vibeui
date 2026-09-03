import type { LabCheck } from "@/components/lab/check-types"

import { Empty001 } from "@/registry/components/empty/empty-001/empty-001"
import { Empty002 } from "@/registry/components/empty/empty-002/empty-002"
import { Empty003 } from "@/registry/components/empty/empty-003/empty-003"
import { Empty004 } from "@/registry/components/empty/empty-004/empty-004"
import { Empty005 } from "@/registry/components/empty/empty-005/empty-005"
import { Empty006 } from "@/registry/components/empty/empty-006/empty-006"
import { Empty007 } from "@/registry/components/empty/empty-007/empty-007"
import { Empty008 } from "@/registry/components/empty/empty-008/empty-008"
import { Empty009 } from "@/registry/components/empty/empty-009/empty-009"
import { Empty010 } from "@/registry/components/empty/empty-010/empty-010"
import { Empty011 } from "@/registry/components/empty/empty-011/empty-011"
import { Empty012 } from "@/registry/components/empty/empty-012/empty-012"
import { Empty013 } from "@/registry/components/empty/empty-013/empty-013"
import { Empty014 } from "@/registry/components/empty/empty-014/empty-014"
import { Empty015 } from "@/registry/components/empty/empty-015/empty-015"
import { Empty016 } from "@/registry/components/empty/empty-016/empty-016"
import { Empty017 } from "@/registry/components/empty/empty-017/empty-017"
import { Empty018 } from "@/registry/components/empty/empty-018/empty-018"
import { Empty019 } from "@/registry/components/empty/empty-019/empty-019"
import { Empty020 } from "@/registry/components/empty/empty-020/empty-020"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 52594

export const CHECKS: LabCheck[] = [
  {
    name: "empty-001",
    title: "Пустое состояние",
    notes: [
      "Заголовок: Подпись: тест",
      "Описание: Подпись: тест",
      "Действие: Черновик",
      "Подсказка: Подпись: тест",
      "Акцент: #676b53",
    ],
    node: (
      <Empty001
        title="Подпись: тест"
        description="Подпись: тест"
        actionLabel="Черновик"
        hint="Подпись: тест"
        accent="#676b53"
      />
    ),
  },
  {
    name: "empty-002",
    title: "Ничего не найдено",
    notes: [
      "Запрос: Смена",
      "Заголовок: Что дальше",
      "Сброс: Что дальше",
      "Акцент: #5f046f",
    ],
    node: (
      <Empty002
        query="Смена"
        title="Что дальше"
        resetLabel="Что дальше"
        accent="#5f046f"
      />
    ),
  },
  {
    name: "empty-003",
    title: "Разбор запроса",
    notes: [
      "Запрос: Черновик",
      "Слов в основе: 3",
      "Заголовок: Подпись: тест",
      "Кнопка: Смена",
      "Акцент: #af002f",
    ],
    node: (
      <Empty003
        query="Черновик"
        keep={3}
        title="Подпись: тест"
        actionTemplate="Смена"
        accent="#af002f"
      />
    ),
  },
  {
    name: "empty-004",
    title: "Пустая папка",
    notes: [
      "Заголовок: Проверка",
      "Действие: Черновик",
      "Форматы: Черновик",
      "Акцент: #1272b9",
    ],
    node: (
      <Empty004
        title="Проверка"
        actionLabel="Черновик"
        formats="Черновик"
        accent="#1272b9"
      />
    ),
  },
  {
    name: "empty-005",
    title: "Первый запуск",
    notes: ["Заголовок: Черновик", "Действие: Проверка", "Акцент: #3e0ca7"],
    node: <Empty005 title="Черновик" actionLabel="Проверка" accent="#3e0ca7" />,
  },
  {
    name: "empty-006",
    title: "Отсеяно фильтрами",
    notes: ["Заголовок: Что дальше", "Всего записей: 5922", "Акцент: #bb471f"],
    node: <Empty006 title="Что дальше" total={5922} accent="#bb471f" />,
  },
  {
    name: "empty-007",
    title: "Ошибка загрузки",
    notes: [
      "Заголовок: Подпись: тест",
      "Код ошибки: Подпись: тест",
      "Повтор: Проверка",
      "Тревога: #fbb0d9",
    ],
    node: (
      <Empty007
        title="Подпись: тест"
        code="Подпись: тест"
        retryLabel="Проверка"
        danger="#fbb0d9"
      />
    ),
  },
  {
    name: "empty-008",
    title: "Нет доступа",
    notes: [
      "Заголовок: Что дальше",
      "Причина: Подпись: тест",
      "Действие: Смена",
      "Акцент: #0cbe1c",
    ],
    node: (
      <Empty008
        title="Что дальше"
        reason="Подпись: тест"
        actionLabel="Смена"
        accent="#0cbe1c"
      />
    ),
  },
  {
    name: "empty-009",
    title: "Нет соединения",
    notes: [
      "Заголовок: Смена",
      "Возраст данных: Что дальше",
      "Повтор: Проверка",
      "Ожидание: #ebb618",
    ],
    node: (
      <Empty009
        title="Смена"
        updatedAt="Что дальше"
        retryLabel="Проверка"
        wait="#ebb618"
      />
    ),
  },
  {
    name: "empty-010",
    title: "Повтор поиска",
    notes: [
      "Заголовок: Черновик",
      "Запрос: Проверка",
      "Кнопка поиска: Черновик",
      "Акцент: #206e9e",
    ],
    node: (
      <Empty010
        title="Черновик"
        initialQuery="Проверка"
        searchLabel="Черновик"
        accent="#206e9e"
      />
    ),
  },
  {
    name: "empty-011",
    title: "Запрос разрешения",
    notes: ["Заголовок: Смена", "Действие: Подпись: тест", "Акцент: #258a9d"],
    node: (
      <Empty011 title="Смена" actionLabel="Подпись: тест" accent="#258a9d" />
    ),
  },
  {
    name: "empty-012",
    title: "Повтор с отсчётом",
    notes: [
      "Заголовок: Смена",
      "Код ошибки: Смена",
      "Отсчёт: 29",
      "Автоповтор: false",
      "Тревога: #23f03c",
    ],
    node: (
      <Empty012
        title="Смена"
        code="Смена"
        seconds={29}
        autoRetry={false}
        danger="#23f03c"
      />
    ),
  },
  {
    name: "empty-013",
    title: "Чеклист знакомства",
    notes: [
      "Заголовок: Проверка",
      "Действие: Подпись: тест",
      "Акцент: #7b61e0",
    ],
    node: (
      <Empty013 title="Проверка" actionLabel="Подпись: тест" accent="#7b61e0" />
    ),
  },
  {
    name: "empty-014",
    title: "Пустая корзина",
    notes: [
      "Заголовок: Что дальше",
      "Действие: Что дальше",
      "В избранном: 33",
      "Акцент: #971cab",
    ],
    node: (
      <Empty014
        title="Что дальше"
        actionLabel="Что дальше"
        savedCount={33}
        accent="#971cab"
      />
    ),
  },
  {
    name: "empty-015",
    title: "Баннер офлайн-кэша",
    notes: ["Заголовок: Что дальше", "Повтор: Черновик", "Акцент: #90bf33"],
    node: (
      <Empty015 title="Что дальше" retryLabel="Черновик" accent="#90bf33" />
    ),
  },
  {
    name: "empty-016",
    title: "Сброс чипов фильтров",
    notes: [
      "Заголовок: Подпись: тест",
      "Всего записей: 92344",
      "Акцент: #7a972e",
    ],
    node: <Empty016 title="Подпись: тест" total={92344} accent="#7a972e" />,
  },
  {
    name: "empty-017",
    title: "Входящие разобраны",
    notes: ["Заголовок: Что дальше", "Действие: Смена", "Акцент: #7d4131"],
    node: <Empty017 title="Что дальше" actionLabel="Смена" accent="#7d4131" />,
  },
  {
    name: "empty-018",
    title: "Нет уведомлений",
    notes: [
      "Заголовок: Черновик",
      "Действие: Подпись: тест",
      "Акцент: #f3bdd8",
    ],
    node: (
      <Empty018 title="Черновик" actionLabel="Подпись: тест" accent="#f3bdd8" />
    ),
  },
  {
    name: "empty-019",
    title: "Зона перетаскивания",
    notes: ["Заголовок: Что дальше", "Действие: Смена", "Акцент: #63a151"],
    node: <Empty019 title="Что дальше" actionLabel="Смена" accent="#63a151" />,
  },
  {
    name: "empty-020",
    title: "Скоро появится",
    notes: [
      "Заголовок: Проверка",
      "Кнопка подписки: Черновик",
      "Акцент: #13951a",
    ],
    node: <Empty020 title="Проверка" submitLabel="Черновик" accent="#13951a" />,
  },
]
