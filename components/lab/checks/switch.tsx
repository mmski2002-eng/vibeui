import type { LabCheck } from "@/components/lab/check-types"

import { Switch001 } from "@/registry/components/switch/switch-001/switch-001"
import { Switch002 } from "@/registry/components/switch/switch-002/switch-002"
import { Switch003 } from "@/registry/components/switch/switch-003/switch-003"
import { Switch004 } from "@/registry/components/switch/switch-004/switch-004"
import { Switch005 } from "@/registry/components/switch/switch-005/switch-005"
import { Switch006 } from "@/registry/components/switch/switch-006/switch-006"
import { Switch007 } from "@/registry/components/switch/switch-007/switch-007"
import { Switch008 } from "@/registry/components/switch/switch-008/switch-008"
import { Switch009 } from "@/registry/components/switch/switch-009/switch-009"
import { Switch010 } from "@/registry/components/switch/switch-010/switch-010"
import { Switch011 } from "@/registry/components/switch/switch-011/switch-011"
import { Switch012 } from "@/registry/components/switch/switch-012/switch-012"
import { Switch013 } from "@/registry/components/switch/switch-013/switch-013"
import { Switch014 } from "@/registry/components/switch/switch-014/switch-014"
import { Switch015 } from "@/registry/components/switch/switch-015/switch-015"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 60513

export const CHECKS: LabCheck[] = [
  {
    name: "switch-001",
    title: "Переключатель настройки",
    notes: [
      "Подпись: Смена",
      "Пояснение: Что дальше",
      "Тумблер: end",
      "Включено: false",
      "Акцент: #a31914",
      "Выключено: true",
    ],
    node: (
      <Switch001
        label="Смена"
        description="Что дальше"
        align="end"
        defaultChecked={false}
        accent="#a31914"
        disabled={true}
      />
    ),
  },
  {
    name: "switch-002",
    title: "Плитка-переключатель",
    notes: [
      "Заголовок: Смена",
      "Пояснение: Проверка",
      "Бейдж: Подпись: тест",
      "Включено: false",
      "Акцент: #3a0ad7",
    ],
    node: (
      <Switch002
        title="Смена"
        description="Проверка"
        badge="Подпись: тест"
        defaultChecked={false}
        accent="#3a0ad7"
      />
    ),
  },
  {
    name: "switch-003",
    title: "Список переключателей",
    notes: [
      "Раздел: Смена",
      "Статус «вкл»: Тест",
      "Статус «выкл»: Тест",
      "Акцент: #ef2254",
    ],
    node: (
      <Switch003 legend="Смена" onText="Тест" offText="Тест" accent="#ef2254" />
    ),
  },
  {
    name: "switch-004",
    title: "Переключатель с иконкой состояния",
    notes: [
      "Подпись: Смена",
      "Состояние «вкл»: Подпись: тест",
      "Состояние «выкл»: Проверка",
      "Включено: false",
      "Акцент: #8b345b",
    ],
    node: (
      <Switch004
        label="Смена"
        onText="Подпись: тест"
        offText="Проверка"
        defaultChecked={false}
        accent="#8b345b"
      />
    ),
  },
  {
    name: "switch-005",
    title: "Опасный переключатель с подтверждением",
    notes: [
      "Подпись: Подпись: тест",
      "Пояснение: Черновик",
      "Вопрос: Проверка",
      "Кнопка действия: Что дальше",
      "Кнопка отмены: Проверка",
      "Акцент: #b0e50e",
    ],
    node: (
      <Switch005
        label="Подпись: тест"
        description="Черновик"
        question="Проверка"
        confirmText="Что дальше"
        cancelText="Проверка"
        accent="#b0e50e"
      />
    ),
  },
  {
    name: "switch-006",
    title: "Переключатель автосохранения",
    notes: [
      "Подпись: Проверка",
      "Пояснение: Черновик",
      "Фаза «сохраняем»: Черновик",
      "Фаза «сохранено»: Подпись: тест",
      "Пауза, мс: 2030",
      "Акцент: #7c9fc1",
    ],
    node: (
      <Switch006
        label="Проверка"
        description="Черновик"
        savingText="Черновик"
        savedText="Подпись: тест"
        delay={2030}
        accent="#7c9fc1"
      />
    ),
  },
  {
    name: "switch-007",
    title: "Шкала размеров переключателя",
    notes: [
      "Заголовок: Подпись: тест",
      "Включён размер: lg",
      "Акцент: #126c2c",
    ],
    node: (
      <Switch007 legend="Подпись: тест" checkedSize="lg" accent="#126c2c" />
    ),
  },
  {
    name: "switch-008",
    title: "Заблокированный переключатель",
    notes: [
      "Подпись: Подпись: тест",
      "Причина: Что дальше",
      "Ссылка: Проверка",
      "Адрес ссылки: Проверка",
      "Акцент: #93d3df",
    ],
    node: (
      <Switch008
        label="Подпись: тест"
        reason="Что дальше"
        actionText="Проверка"
        actionHref="Проверка"
        accent="#93d3df"
      />
    ),
  },
  {
    name: "switch-009",
    title: "День и ночь",
    notes: [
      "Светлый режим: Подпись: тест",
      "Тёмный режим: Подпись: тест",
      "Пояснение: Подпись: тест",
      "Ночь: false",
      "Акцент: #2445aa",
    ],
    node: (
      <Switch009
        dayLabel="Подпись: тест"
        nightLabel="Подпись: тест"
        hint="Подпись: тест"
        defaultChecked={false}
        accent="#2445aa"
      />
    ),
  },
  {
    name: "switch-010",
    title: "Настройка с иконкой",
    notes: [
      "Подпись: Черновик",
      "Пояснение: Что дальше",
      "Включено: false",
      "Акцент: #4838d3",
      "Выключено: true",
    ],
    node: (
      <Switch010
        label="Черновик"
        description="Что дальше"
        defaultChecked={false}
        accent="#4838d3"
        disabled={true}
      />
    ),
  },
  {
    name: "switch-011",
    title: "Включение с подтверждением",
    notes: [
      "Подпись: Смена",
      "Пояснение: Проверка",
      "Вопрос: Подпись: тест",
      "Кнопка действия: Проверка",
      "Кнопка отмены: Проверка",
      "Акцент: #89ec99",
    ],
    node: (
      <Switch011
        label="Смена"
        description="Проверка"
        question="Подпись: тест"
        confirmText="Проверка"
        cancelText="Проверка"
        accent="#89ec99"
      />
    ),
  },
  {
    name: "switch-012",
    title: "Главный переключатель группы",
    notes: [
      "Раздел: Подпись: тест",
      "Общий тумблер: Смена",
      "Счётчик: Черновик",
      "Акцент: #db0b6d",
    ],
    node: (
      <Switch012
        legend="Подпись: тест"
        masterLabel="Смена"
        statusText="Черновик"
        accent="#db0b6d"
      />
    ),
  },
  {
    name: "switch-013",
    title: "Переключатель со статусом сохранения",
    notes: [
      "Подпись: Подпись: тест",
      "Пояснение: Смена",
      "Пауза, мс: 547",
      "Акцент: #d44c49",
    ],
    node: (
      <Switch013
        label="Подпись: тест"
        description="Смена"
        delay={547}
        accent="#d44c49"
      />
    ),
  },
  {
    name: "switch-014",
    title: "Иконки на дорожке",
    notes: [
      "Подпись: Подпись: тест",
      "Пояснение: Проверка",
      "Включено: false",
      "Акцент: #1dc105",
    ],
    node: (
      <Switch014
        label="Подпись: тест"
        description="Проверка"
        defaultChecked={false}
        accent="#1dc105"
      />
    ),
  },
  {
    name: "switch-015",
    title: "Матрица каналов уведомлений",
    notes: [
      "Заголовок: Черновик",
      "Подпись строк: Проверка",
      "Акцент: #6a05ec",
    ],
    node: <Switch015 title="Черновик" rowsLabel="Проверка" accent="#6a05ec" />,
  },
]
