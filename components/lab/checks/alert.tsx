import type { LabCheck } from "@/components/lab/check-types"

import { Alert001 } from "@/registry/components/alert/alert-001/alert-001"
import { Alert002 } from "@/registry/components/alert/alert-002/alert-002"
import { Alert003 } from "@/registry/components/alert/alert-003/alert-003"
import { Alert004 } from "@/registry/components/alert/alert-004/alert-004"
import { Alert005 } from "@/registry/components/alert/alert-005/alert-005"
import { Alert006 } from "@/registry/components/alert/alert-006/alert-006"
import { Alert007 } from "@/registry/components/alert/alert-007/alert-007"
import { Alert008 } from "@/registry/components/alert/alert-008/alert-008"
import { Alert009 } from "@/registry/components/alert/alert-009/alert-009"
import { Alert010 } from "@/registry/components/alert/alert-010/alert-010"
import { Alert011 } from "@/registry/components/alert/alert-011/alert-011"
import { Alert012 } from "@/registry/components/alert/alert-012/alert-012"
import { Alert013 } from "@/registry/components/alert/alert-013/alert-013"
import { Alert014 } from "@/registry/components/alert/alert-014/alert-014"
import { Alert015 } from "@/registry/components/alert/alert-015/alert-015"
import { Alert016 } from "@/registry/components/alert/alert-016/alert-016"
import { Alert017 } from "@/registry/components/alert/alert-017/alert-017"
import { Alert018 } from "@/registry/components/alert/alert-018/alert-018"
import { Alert019 } from "@/registry/components/alert/alert-019/alert-019"
import { Alert020 } from "@/registry/components/alert/alert-020/alert-020"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 52594

export const CHECKS: LabCheck[] = [
  {
    name: "alert-001",
    title: "Строчное уведомление",
    notes: [
      "Тон: success",
      "Заголовок: Проверка",
      "Описание: Смена",
      "Действие: Подпись: тест",
    ],
    node: (
      <Alert001
        tone="success"
        title="Проверка"
        description="Смена"
        action="Подпись: тест"
      />
    ),
  },
  {
    name: "alert-002",
    title: "Заливное уведомление",
    notes: [
      "Тон: warning",
      "Заголовок: Подпись: тест",
      "Описание: Проверка",
      "Действие: Смена",
    ],
    node: (
      <Alert002
        tone="warning"
        title="Подпись: тест"
        description="Проверка"
        action="Смена"
      />
    ),
  },
  {
    name: "alert-003",
    title: "Уведомление у поля",
    notes: ["Тон: success", "Сообщение: Что дальше"],
    node: <Alert003 tone="success" message="Что дальше" />,
  },
  {
    name: "alert-004",
    title: "Уведомление с выбором",
    notes: [
      "Заголовок: Смена",
      "Описание: Смена",
      "Подтверждение: Подпись: тест",
      "Опасное: false",
      "Акцент: #8cb02e",
    ],
    node: (
      <Alert004
        title="Смена"
        description="Смена"
        confirmLabel="Подпись: тест"
        destructive={false}
        accent="#8cb02e"
      />
    ),
  },
  {
    name: "alert-005",
    title: "Закрываемое уведомление",
    notes: [
      "Тон: warning",
      "Заголовок: Смена",
      "Описание: Проверка",
      "Примечание: Черновик",
    ],
    node: (
      <Alert005
        tone="warning"
        title="Смена"
        description="Проверка"
        footnote="Черновик"
      />
    ),
  },
  {
    name: "alert-006",
    title: "Уведомление о новинке",
    notes: [
      "Плашка: Черновик",
      "Заголовок: Подпись: тест",
      "Описание: Подпись: тест",
      "Кнопка: Черновик",
      "Акцент: #ba3e0c",
    ],
    node: (
      <Alert006
        badge="Черновик"
        title="Подпись: тест"
        description="Подпись: тест"
        actionLabel="Черновик"
        accent="#ba3e0c"
      />
    ),
  },
  {
    name: "alert-007",
    title: "Уведомление с текстом",
    notes: [
      "Имя: Черновик",
      "Роль: Смена",
      "Сообщение: Что дальше",
      "Время: Проверка",
      "Акцент: #8eec94",
    ],
    node: (
      <Alert007
        name="Черновик"
        role="Смена"
        message="Что дальше"
        time="Проверка"
        accent="#8eec94"
      />
    ),
  },
  {
    name: "alert-008",
    title: "Уведомление с прогрессом",
    notes: [
      "Заголовок: Проверка",
      "Шаг: Проверка",
      "Процент: 85",
      "Акцент: #2c4bf0",
    ],
    node: (
      <Alert008 title="Проверка" step="Проверка" value={85} accent="#2c4bf0" />
    ),
  },
  {
    name: "alert-009",
    title: "Уведомление с отсчётом",
    notes: [
      "Остаток: Черновик",
      "Прошло, %: 18",
      "Заголовок: Проверка",
      "Действие: Проверка",
      "Акцент: #1f7e4d",
    ],
    node: (
      <Alert009
        remaining="Черновик"
        elapsed={18}
        title="Проверка"
        actionLabel="Проверка"
        accent="#1f7e4d"
      />
    ),
  },
  {
    name: "alert-010",
    title: "Ошибки формы",
    notes: ["Заголовок: Проверка"],
    node: <Alert010 title="Проверка" />,
  },
  {
    name: "alert-011",
    title: "Техническая ошибка",
    notes: [
      "Заголовок: Проверка",
      "Описание: Что дальше",
      "Обращение: Проверка",
    ],
    node: (
      <Alert011
        title="Проверка"
        description="Что дальше"
        reference="Проверка"
      />
    ),
  },
  {
    name: "alert-012",
    title: "Уведомление об обновлении",
    notes: [
      "Версия: Смена",
      "Заголовок: Смена",
      "Кнопка: Проверка",
      "Акцент: #ae1f95",
    ],
    node: (
      <Alert012
        version="Смена"
        title="Смена"
        updateLabel="Проверка"
        accent="#ae1f95"
      />
    ),
  },
  {
    name: "alert-013",
    title: "Запрос согласия",
    notes: [
      "Заголовок: Смена",
      "Согласие: Проверка",
      "Отказ: Смена",
      "Акцент: #2a1672",
    ],
    node: (
      <Alert013
        title="Смена"
        acceptLabel="Проверка"
        rejectLabel="Смена"
        accent="#2a1672"
      />
    ),
  },
  {
    name: "alert-014",
    title: "Уведомление о состоянии",
    notes: [
      "Состояние: down",
      "Заголовок: Черновик",
      "Обновлено: Подпись: тест",
    ],
    node: <Alert014 state="down" title="Черновик" updated="Подпись: тест" />,
  },
  {
    name: "alert-015",
    title: "Уведомление о лимите",
    notes: [
      "Использовано: 70",
      "Всего: 24",
      "Единица: Подпись: тест",
      "Счётчик: Черновик",
      "Действие: Что дальше",
      "Акцент: #f13d56",
    ],
    node: (
      <Alert015
        used={70}
        total={24}
        unit="Подпись: тест"
        counterLabel="Черновик"
        actionLabel="Что дальше"
        accent="#f13d56"
      />
    ),
  },
  {
    name: "alert-016",
    title: "Сгруппированные уведомления",
    notes: [
      "Заголовок: Смена",
      "Показывать: 5",
      "Очистка: Что дальше",
      "Хвост: Черновик",
    ],
    node: (
      <Alert016
        title="Смена"
        visible={5}
        clearLabel="Что дальше"
        moreLabel="Черновик"
      />
    ),
  },
  {
    name: "alert-017",
    title: "Технические работы",
    notes: [
      "Заголовок: Проверка",
      "Окно работ: Подпись: тест",
      "Описание: Черновик",
      "Акцент: #7a972e",
    ],
    node: (
      <Alert017
        title="Проверка"
        window="Подпись: тест"
        description="Черновик"
        accent="#7a972e"
      />
    ),
  },
  {
    name: "alert-018",
    title: "Нет соединения",
    notes: ["Заголовок: Что дальше", "Описание: Смена", "Показать: true"],
    node: <Alert018 title="Что дальше" description="Смена" force={true} />,
  },
  {
    name: "alert-019",
    title: "Уведомление с инструкцией",
    notes: [
      "Заголовок: Смена",
      "Описание: Черновик",
      "Подпись: Подпись: тест",
      "Действие: Проверка",
      "Акцент: #d85c34",
    ],
    node: (
      <Alert019
        title="Смена"
        description="Черновик"
        meta="Подпись: тест"
        actionLabel="Проверка"
        accent="#d85c34"
      />
    ),
  },
  {
    name: "alert-020",
    title: "Подтверждение словом",
    notes: [
      "Заголовок: Смена",
      "Слово-подтверждение: Проверка",
      "Кнопка: Проверка",
    ],
    node: (
      <Alert020 title="Смена" confirmWord="Проверка" confirmLabel="Проверка" />
    ),
  },
]
