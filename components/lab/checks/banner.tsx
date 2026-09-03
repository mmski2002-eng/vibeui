import type { LabCheck } from "@/components/lab/check-types"

import { Banner001 } from "@/registry/components/banner/banner-001/banner-001"
import { Banner002 } from "@/registry/components/banner/banner-002/banner-002"
import { Banner003 } from "@/registry/components/banner/banner-003/banner-003"
import { Banner004 } from "@/registry/components/banner/banner-004/banner-004"
import { Banner005 } from "@/registry/components/banner/banner-005/banner-005"
import { Banner006 } from "@/registry/components/banner/banner-006/banner-006"
import { Banner007 } from "@/registry/components/banner/banner-007/banner-007"
import { Banner008 } from "@/registry/components/banner/banner-008/banner-008"
import { Banner009 } from "@/registry/components/banner/banner-009/banner-009"
import { Banner010 } from "@/registry/components/banner/banner-010/banner-010"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 60513

export const CHECKS: LabCheck[] = [
  {
    name: "banner-001",
    title: "Баннер объявления",
    notes: [
      "Метка: Смена",
      "Текст: Что дальше",
      "Действие: Черновик",
      "Акцент: #a31914",
    ],
    node: (
      <Banner001
        tag="Смена"
        message="Что дальше"
        actionLabel="Черновик"
        accent="#a31914"
      />
    ),
  },
  {
    name: "banner-002",
    title: "Баннер обновления",
    notes: ["Версия: Что дальше", "Действие: Что дальше", "Акцент: #cb647d"],
    node: (
      <Banner002
        version="Что дальше"
        actionLabel="Что дальше"
        accent="#cb647d"
      />
    ),
  },
  {
    name: "banner-003",
    title: "Баннер согласия",
    notes: [
      "Согласие: Что дальше",
      "Отказ: Черновик",
      "Настройки: Смена",
      "Акцент: #281255",
    ],
    node: (
      <Banner003
        acceptLabel="Что дальше"
        rejectLabel="Черновик"
        settingsLabel="Смена"
        accent="#281255"
      />
    ),
  },
  {
    name: "banner-004",
    title: "Баннер тестового стенда",
    notes: [
      "Метка: Черновик",
      "Окружение: Что дальше",
      "Пояснение: Смена",
      "Штриховка: #a178d5",
    ],
    node: (
      <Banner004
        label="Черновик"
        environment="Что дальше"
        note="Смена"
        stripe="#a178d5"
      />
    ),
  },
  {
    name: "banner-005",
    title: "Баннер лимита",
    notes: ["Израсходовано: 13732", "Лимит: 18325", "Тон: #8b345b"],
    node: <Banner005 used={13732} limit={18325} tone="#8b345b" />,
  },
  {
    name: "banner-006",
    title: "Баннер офлайна",
    notes: [
      "Сообщение: Подпись: тест",
      "Повтор: Черновик",
      "Последствия: Проверка",
      "Тон: #43400a",
    ],
    node: (
      <Banner006
        message="Подпись: тест"
        retryLabel="Черновик"
        detail="Проверка"
        tone="#43400a"
      />
    ),
  },
  {
    name: "banner-007",
    title: "Сообщение о работах",
    notes: [
      "Начало: Проверка",
      "Конец: Смена",
      "Дата: Проверка",
      "Акцент: #f3d2b9",
    ],
    node: (
      <Banner007 from="Проверка" to="Смена" date="Проверка" accent="#f3d2b9" />
    ),
  },
  {
    name: "banner-008",
    title: "Промо-баннер",
    notes: [
      "Промокод: Смена",
      "Действие: Подпись: тест",
      "Текст: Проверка",
      "Акцент: #c1d980",
    ],
    node: (
      <Banner008
        code="Смена"
        actionLabel="Подпись: тест"
        message="Проверка"
        accent="#c1d980"
      />
    ),
  },
  {
    name: "banner-009",
    title: "Подтверждение почты",
    notes: [
      "Адрес: vera@vibeui.ru",
      "Сообщение: Проверьте почту — ссылка действует час.",
      "Ожидание, с: 12",
      "Акцент: #2f6f4e",
    ],
    node: (
      <Banner009
        email="vera@vibeui.ru"
        message="Проверьте почту — ссылка действует час."
        cooldown={12}
        accent="#2f6f4e"
      />
    ),
  },
  {
    name: "banner-010",
    title: "Просмотр от чужого имени",
    notes: [
      "Владелец аккаунта: Тимур Аль",
      "Пояснение: Журнал заполняется от его имени.",
      "Кнопка выхода: Вернуться к себе",
      "Акцент: #d59a3a",
    ],
    node: (
      <Banner010
        person="Тимур Аль"
        note="Журнал заполняется от его имени."
        exitLabel="Вернуться к себе"
        accent="#d59a3a"
      />
    ),
  },
]
