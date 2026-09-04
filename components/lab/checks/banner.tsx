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
import { Banner011 } from "@/registry/components/banner/banner-011/banner-011"
import { Banner012 } from "@/registry/components/banner/banner-012/banner-012"
import { Banner013 } from "@/registry/components/banner/banner-013/banner-013"
import { Banner014 } from "@/registry/components/banner/banner-014/banner-014"
import { Banner015 } from "@/registry/components/banner/banner-015/banner-015"

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
  {
    name: "banner-011",
    title: "Стопка баннеров",
    notes: [
      "Видимых полос: 2",
      "Счётчик: Скрыто ещё {count}",
      "Акцент: #7a4bd0",
    ],
    node: (
      <Banner011
        visible={2}
        moreTemplate="Скрыто ещё {count}"
        accent="#7a4bd0"
      />
    ),
  },
  {
    name: "banner-012",
    title: "Акция с отсчётом",
    notes: [
      "Текст: Два места по цене одного",
      "Промокод: SPRING",
      "Осталось, с: 95040",
      "Акцент: #1f7a5c",
    ],
    node: (
      <Banner012
        message="Два места по цене одного"
        code="SPRING"
        seconds={95040}
        accent="#1f7a5c"
      />
    ),
  },
  {
    name: "banner-013",
    title: "Согласие с категориями",
    notes: [
      "Заголовок: Данные и счётчики",
      "Согласие: Разрешить всё",
      "Отказ: Ничего лишнего",
      "Акцент: #b4451f",
    ],
    node: (
      <Banner013
        title="Данные и счётчики"
        acceptLabel="Разрешить всё"
        rejectLabel="Ничего лишнего"
        accent="#b4451f"
      />
    ),
  },
  {
    name: "banner-014",
    title: "Архивная версия",
    notes: [
      "Версия: ревизия 418",
      "Пояснение: Правки после неё сюда не попали.",
      "Переход: Открыть текущую",
      "Акцент: #d59a3a",
    ],
    node: (
      <Banner014
        version="ревизия 418"
        note="Правки после неё сюда не попали."
        actionLabel="Открыть текущую"
        accent="#d59a3a"
      />
    ),
  },
  {
    name: "banner-015",
    title: "Баннер установки приложения",
    notes: [
      "Название: Смена",
      "Описание: Что дальше",
      "Кнопка: Черновик",
      "Акцент: #2f6f9e",
    ],
    node: (
      <Banner015
        appName="Смена"
        tagline="Что дальше"
        installLabel="Черновик"
        accent="#2f6f9e"
      />
    ),
  },
]
