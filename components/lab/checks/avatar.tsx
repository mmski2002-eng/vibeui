import type { LabCheck } from "@/components/lab/check-types"

import { Avatar001 } from "@/registry/components/avatar/avatar-001/avatar-001"
import { Avatar002 } from "@/registry/components/avatar/avatar-002/avatar-002"
import { Avatar003 } from "@/registry/components/avatar/avatar-003/avatar-003"
import { Avatar004 } from "@/registry/components/avatar/avatar-004/avatar-004"
import { Avatar005 } from "@/registry/components/avatar/avatar-005/avatar-005"
import { Avatar006 } from "@/registry/components/avatar/avatar-006/avatar-006"
import { Avatar007 } from "@/registry/components/avatar/avatar-007/avatar-007"
import { Avatar008 } from "@/registry/components/avatar/avatar-008/avatar-008"
import { Avatar009 } from "@/registry/components/avatar/avatar-009/avatar-009"
import { Avatar010 } from "@/registry/components/avatar/avatar-010/avatar-010"
import { Avatar011 } from "@/registry/components/avatar/avatar-011/avatar-011"
import { Avatar012 } from "@/registry/components/avatar/avatar-012/avatar-012"
import { Avatar013 } from "@/registry/components/avatar/avatar-013/avatar-013"
import { Avatar014 } from "@/registry/components/avatar/avatar-014/avatar-014"
import { Avatar015 } from "@/registry/components/avatar/avatar-015/avatar-015"
import { Avatar016 } from "@/registry/components/avatar/avatar-016/avatar-016"
import { Avatar017 } from "@/registry/components/avatar/avatar-017/avatar-017"
import { Avatar018 } from "@/registry/components/avatar/avatar-018/avatar-018"
import { Avatar019 } from "@/registry/components/avatar/avatar-019/avatar-019"
import { Avatar020 } from "@/registry/components/avatar/avatar-020/avatar-020"
import { Avatar021 } from "@/registry/components/avatar/avatar-021/avatar-021"
import { Avatar022 } from "@/registry/components/avatar/avatar-022/avatar-022"
import { Avatar023 } from "@/registry/components/avatar/avatar-023/avatar-023"
import { Avatar028 } from "@/registry/components/avatar/avatar-028/avatar-028"
import { Avatar030 } from "@/registry/components/avatar/avatar-030/avatar-030"
import { Avatar031 } from "@/registry/components/avatar/avatar-031/avatar-031"
import { Avatar033 } from "@/registry/components/avatar/avatar-033/avatar-033"
import { Avatar034 } from "@/registry/components/avatar/avatar-034/avatar-034"
import { Avatar035 } from "@/registry/components/avatar/avatar-035/avatar-035"
import { Avatar036 } from "@/registry/components/avatar/avatar-036/avatar-036"
import { Avatar037 } from "@/registry/components/avatar/avatar-037/avatar-037"
import { Avatar039 } from "@/registry/components/avatar/avatar-039/avatar-039"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 60513

export const CHECKS: LabCheck[] = [
  {
    name: "avatar-001",
    title: "Аватар с фото",
    notes: [
      "Имя: Смена",
      "Размер: md",
      "Присутствие: online",
      "Фото: Черновик",
    ],
    node: <Avatar001 name="Смена" size="md" status="online" src="Черновик" />,
  },
  {
    name: "avatar-002",
    title: "Фото с запасным вариантом",
    notes: ["Имя: Смена", "Размер: sm", "Фото: Что дальше"],
    node: <Avatar002 name="Смена" size="sm" src="Что дальше" />,
  },
  {
    name: "avatar-003",
    title: "Стопка аватаров",
    notes: [
      "Видимых: 1",
      "Размер: md",
      "Подпись группы: Что дальше",
      "Подсказки с именами: true",
    ],
    node: <Avatar003 visible={1} size="md" label="Что дальше" tooltip={true} />,
  },
  {
    name: "avatar-004",
    title: "Кольцо прогресса",
    notes: [
      "Имя: Что дальше",
      "Заполнение, %: 4",
      "Размер: lg",
      "Акцент: #f60628",
    ],
    node: <Avatar004 name="Что дальше" value={4} size="lg" accent="#f60628" />,
  },
  {
    name: "avatar-005",
    title: "Аватар со значком",
    notes: ["Имя: Что дальше", "Значок: verified", "Размер: lg"],
    node: <Avatar005 name="Что дальше" badge="verified" size="lg" />,
  },
  {
    name: "avatar-006",
    title: "Загрузка фото",
    notes: [
      "Имя: Что дальше",
      "Подпись на плёнке: Смена",
      "Требования: Подпись: тест",
      "Цвет текста: #d5afea",
    ],
    node: (
      <Avatar006
        name="Что дальше"
        label="Смена"
        hint="Подпись: тест"
        textColor="#d5afea"
      />
    ),
  },
  {
    name: "avatar-007",
    title: "Строка с именем",
    notes: [
      "Имя: Что дальше",
      "Статус: away",
      "Цвет имени: #947542",
      "Цвет остального текста: #d43ca1",
    ],
    node: (
      <Avatar007
        name="Что дальше"
        status="away"
        textColor="#947542"
        mutedColor="#d43ca1"
      />
    ),
  },
  {
    name: "avatar-008",
    title: "Список людей с заглушкой",
    notes: ["Строк: 2", "Подпись: Смена", "Список загружен: false"],
    node: <Avatar008 count={2} label="Смена" ready={false} />,
  },
  {
    name: "avatar-009",
    title: "Аватар ассистента",
    notes: ["Имя: Черновик", "Печатает: true", "Размер: md", "Акцент: #c4f3d2"],
    node: (
      <Avatar009 name="Черновик" typing={true} size="md" accent="#c4f3d2" />
    ),
  },
  {
    name: "avatar-010",
    title: "Отсутствующий участник",
    notes: ["Случай: invited", "Размер: lg", "Подпись: Подпись: тест"],
    node: <Avatar010 reason="invited" size="lg" label="Подпись: тест" />,
  },
  {
    name: "avatar-011",
    title: "Знак компании",
    notes: ["Название: Подпись: тест", "Размер: md", "Цвет бренда: #c1d980"],
    node: <Avatar011 name="Подпись: тест" size="md" accent="#c1d980" />,
  },
  {
    name: "avatar-012",
    title: "Аватары с именами",
    notes: [
      "Действие: Смена",
      "Объект: Смена",
      "Хвост: Подпись: тест",
      "Цвет текста: #433f97",
    ],
    node: (
      <Avatar012
        action="Смена"
        target="Смена"
        moreText="Подпись: тест"
        textColor="#433f97"
      />
    ),
  },
  {
    name: "avatar-013",
    title: "Аватар со статусом",
    notes: ["Состояние: busy", "Размер: md", "Роль: editor", "Фото: Черновик"],
    node: <Avatar013 status="busy" size="md" role="editor" src="Черновик" />,
  },
  {
    name: "avatar-014",
    title: "Аватар нестандартной формы",
    notes: [
      "Форма: circle",
      "Роль: Подпись: тест",
      "Имя: Подпись: тест",
      "Размер: md",
    ],
    node: (
      <Avatar014
        shape="circle"
        role="Подпись: тест"
        name="Подпись: тест"
        size="md"
      />
    ),
  },
  {
    name: "avatar-015",
    title: "Редактор аватара",
    notes: [
      "Пункт загрузки: Проверка",
      "Пункт удаления: Что дальше",
      "Акцент: #aae7ee",
      "Цвет текста: #da3dec",
    ],
    node: (
      <Avatar015
        editLabel="Проверка"
        removeLabel="Что дальше"
        accent="#aae7ee"
        textColor="#da3dec"
      />
    ),
  },
  {
    name: "avatar-016",
    title: "Сетка аватаров",
    notes: [
      "Заголовок: Что дальше",
      "Размер: lg",
      "Цвет имени: #185628",
      "Цвет остального текста: #fbb021",
    ],
    node: (
      <Avatar016
        title="Что дальше"
        size="lg"
        textColor="#185628"
        mutedColor="#fbb021"
      />
    ),
  },
  {
    name: "avatar-017",
    title: "Строка участника",
    notes: [
      "Роль: Черновик",
      "Действие: Подпись: тест",
      "Имя: Подпись: тест",
      "Цвет текста: #ec9983",
    ],
    node: (
      <Avatar017
        role="Черновик"
        action="Подпись: тест"
        name="Подпись: тест"
        textColor="#ec9983"
      />
    ),
  },
  {
    name: "avatar-018",
    title: "Кольцо роли",
    notes: ["Роль: reader", "Размер: sm", "Команда: Проверка"],
    node: <Avatar018 role="reader" size="sm" team="Проверка" />,
  },
  {
    name: "avatar-019",
    title: "Карточка профиля",
    notes: [
      "Действие: Черновик",
      "Имя: Подпись: тест",
      "О себе: Подпись: тест",
      "Цвет текста: #4c1d17",
    ],
    node: (
      <Avatar019
        action="Черновик"
        name="Подпись: тест"
        bio="Подпись: тест"
        textColor="#4c1d17"
      />
    ),
  },
  {
    name: "avatar-020",
    title: "Аватар с непрочитанным",
    notes: [
      "Счётчик: 208",
      "Размер: sm",
      "Имя: Смена",
      "Что считаем: Черновик",
    ],
    node: <Avatar020 count={208} size="sm" name="Смена" label="Черновик" />,
  },
  {
    name: "avatar-021",
    title: "Кольцо истории",
    notes: ["Состояние: seen", "Размер: md", "Имя: Проверка"],
    node: <Avatar021 state="seen" size="md" name="Проверка" />,
  },
  {
    name: "avatar-022",
    title: "Аватар с набором текста",
    notes: [
      "Имя: Подпись: тест",
      "Печатает: true",
      "Подпись набора: Проверка",
      "Цвет текста: #5af3c3",
    ],
    node: (
      <Avatar022
        name="Подпись: тест"
        typing={true}
        typingText="Проверка"
        textColor="#5af3c3"
      />
    ),
  },
  {
    name: "avatar-023",
    title: "Мозаика группы",
    notes: [
      "Название чата: Смена",
      "Размер: sm",
      "Цвет имени: #67d64c",
      "Цвет остального текста: #862633",
    ],
    node: (
      <Avatar023
        label="Смена"
        size="sm"
        textColor="#67d64c"
        mutedColor="#862633"
      />
    ),
  },
  {
    name: "avatar-028",
    title: "Меню профиля",
    notes: [
      "Почта: Подпись: тест",
      "Подпись выхода: Проверка",
      "Имя: Подпись: тест",
      "Цвет текста: #25d5c2",
    ],
    node: (
      <Avatar028
        email="Подпись: тест"
        signOutLabel="Проверка"
        name="Подпись: тест"
        textColor="#25d5c2"
      />
    ),
  },
  {
    name: "avatar-030",
    title: "Имя в две строки",
    notes: [
      "Должность: Подпись: тест",
      "Размер: md",
      "Имя: Смена",
      "Цвет текста: #69adce",
    ],
    node: (
      <Avatar030
        role="Подпись: тест"
        size="md"
        name="Смена"
        textColor="#69adce"
      />
    ),
  },
  {
    name: "avatar-031",
    title: "Раскрывающаяся стопка",
    notes: ["Перекрытие, %: 38", "Размер: sm", "Видимых: 1"],
    node: <Avatar031 overlap={38} size="sm" visible={1} />,
  },
  {
    name: "avatar-033",
    title: "Говорящий участник",
    notes: [
      "Состояние: muted",
      "Имя: Что дальше",
      "Цвет имени: #62cf08",
      "Цвет остального текста: #099b24",
    ],
    node: (
      <Avatar033
        state="muted"
        name="Что дальше"
        textColor="#62cf08"
        mutedColor="#099b24"
      />
    ),
  },
  {
    name: "avatar-034",
    title: "Время последнего визита",
    notes: [
      "Когда: Смена",
      "Давность: week",
      "Подпись: Черновик",
      "Цвет текста: #7c5b36",
    ],
    node: (
      <Avatar034
        when="Смена"
        freshness="week"
        seenText="Черновик"
        textColor="#7c5b36"
      />
    ),
  },
  {
    name: "avatar-035",
    title: "Подтверждённое имя",
    notes: [
      "Вид: organisation",
      "Дата: Подпись: тест",
      "Цвет имени: #84fa32",
      "Цвет остального текста: #8a33b8",
    ],
    node: (
      <Avatar035
        kind="organisation"
        since="Подпись: тест"
        textColor="#84fa32"
        mutedColor="#8a33b8"
      />
    ),
  },
  {
    name: "avatar-036",
    title: "Обрезка фото",
    notes: [
      "Кнопка выбора: Проверка",
      "Пояснение: Подпись: тест",
      "Сторона кадра: 333",
      "Цвет текста: #c582b1",
    ],
    node: (
      <Avatar036
        label="Проверка"
        hint="Подпись: тест"
        output={333}
        textColor="#c582b1"
      />
    ),
  },
  {
    name: "avatar-037",
    title: "Генеративный аватар",
    notes: [
      "Идентификатор: Что дальше",
      "Имя: Подпись: тест",
      "Размер: md",
      "Форма: circle",
    ],
    node: (
      <Avatar037
        seed="Что дальше"
        name="Подпись: тест"
        size="md"
        shape="circle"
      />
    ),
  },
  {
    name: "avatar-039",
    title: "Шапка профиля",
    notes: [
      "Имя: Смена",
      "Роль: Что дальше",
      "Действие: Черновик",
      "Акцент: #7a78e0",
      "Цвет текста: #ef6af9",
    ],
    node: (
      <Avatar039
        name="Смена"
        role="Что дальше"
        action="Черновик"
        accent="#7a78e0"
        textColor="#ef6af9"
      />
    ),
  },
]
