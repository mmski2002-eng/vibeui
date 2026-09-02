import type { ReactNode } from "react"

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

export type AvatarCheck = {
  name: string
  title: string
  /** Что подкручено относительно дефолтов — подпись под кадром. */
  notes: string[]
  node: ReactNode
}

/**
 * Прогон категории «Аватар» на нестандартных настройках.
 *
 * Каждый компонент собран так, как его собрал бы человек после Copy for AI:
 * значения контролов заданы явными пропами и заведомо отличаются от дефолтов,
 * фотографии подставлены там, где компонент их принимает. Набор
 * детерминирован — иначе серверный и клиентский рендер разошлись бы, а
 * найденный дефект не повторился бы на следующем открытии страницы.
 */
export const AVATAR_CHECKS: AvatarCheck[] = [
  {
    name: "avatar-001",
    title: "Аватар с фото",
    notes: [
      "Имя: Тимур Аль",
      "Размер: sm",
      "Присутствие: none",
      "Фото: /demo/avatars/oleg-256.webp",
    ],
    node: (
      <Avatar001
        name="Тимур Аль"
        size="sm"
        status="none"
        src="/demo/avatars/oleg-256.webp"
      />
    ),
  },
  {
    name: "avatar-002",
    title: "Фото с запасным вариантом",
    notes: [
      "Имя: Ника Юрьева",
      "Размер: sm",
      "Фото: /demo/avatars/maria-256.webp",
    ],
    node: (
      <Avatar002
        name="Ника Юрьева"
        size="sm"
        src="/demo/avatars/maria-256.webp"
      />
    ),
  },
  {
    name: "avatar-003",
    title: "Стопка аватаров",
    notes: [
      "Видимых: 1",
      "Размер: lg",
      "Подпись группы: Проект «Полёт»",
      "Подсказки с именами: true",
      "photos: шесть фотографий",
    ],
    node: (
      <Avatar003
        visible={1}
        size="lg"
        label="Проект «Полёт»"
        tooltip={true}
        photos={[
          "/demo/avatars/irina-256.webp",
          "/demo/avatars/petr-256.webp",
          "/demo/avatars/anna-256.webp",
          "/demo/avatars/mark-256.webp",
          "/demo/avatars/maria-256.webp",
          "/demo/avatars/oleg-256.webp",
        ]}
      />
    ),
  },
  {
    name: "avatar-004",
    title: "Кольцо прогресса",
    notes: [
      "Имя: Ника Юрьева",
      "Заполнение, %: 42",
      "Размер: sm",
      "Акцент: #0ea5e9",
      "src: /demo/avatars/mark-256.webp",
    ],
    node: (
      <Avatar004
        name="Ника Юрьева"
        value={42}
        size="sm"
        accent="#0ea5e9"
        src="/demo/avatars/mark-256.webp"
      />
    ),
  },
  {
    name: "avatar-005",
    title: "Аватар со значком",
    notes: [
      "Имя: Вера Найт",
      "Значок: admin",
      "Размер: lg",
      "src: /demo/avatars/anna-256.webp",
    ],
    node: (
      <Avatar005
        name="Вера Найт"
        badge="admin"
        size="lg"
        src="/demo/avatars/anna-256.webp"
      />
    ),
  },
  {
    name: "avatar-006",
    title: "Загрузка фото",
    notes: [
      "Имя: Вера Найт",
      "Подпись на плёнке: Смена",
      "Требования: JPEG или PNG, до 5 МБ",
      "Фон: #f59e0b",
      "Цвет текста: #0f172a",
      "src: /demo/avatars/maria-256.webp",
    ],
    node: (
      <Avatar006
        name="Вера Найт"
        label="Смена"
        hint="JPEG или PNG, до 5 МБ"
        background="#f59e0b"
        textColor="#0f172a"
        src="/demo/avatars/maria-256.webp"
      />
    ),
  },
  {
    name: "avatar-007",
    title: "Строка с именем",
    notes: [
      "Имя: Олег Дин",
      "Статус: offline",
      "Фон: #0ea5e9",
      "Цвет имени: #111827",
      "Цвет остального текста: #1f2937",
      "src: /demo/avatars/petr-256.webp",
    ],
    node: (
      <Avatar007
        name="Олег Дин"
        status="offline"
        background="#0ea5e9"
        textColor="#111827"
        mutedColor="#1f2937"
        src="/demo/avatars/petr-256.webp"
      />
    ),
  },
  {
    name: "avatar-008",
    title: "Список людей с заглушкой",
    notes: [
      "Строк: 4",
      "Подпись: Смена",
      "Фон: #e11d48",
      "Список загружен: true",
      "people: три человека с фото",
    ],
    node: (
      <Avatar008
        count={4}
        label="Смена"
        background="#e11d48"
        ready={true}
        people={[
          {
            name: "Вера Найт",
            role: "Технический директор",
            src: "/demo/avatars/anna-256.webp",
          },
          {
            name: "Тимур Аль",
            role: "Бэкенд",
            src: "/demo/avatars/mark-256.webp",
          },
          {
            name: "Ника Юрьева",
            role: "Аналитик",
            src: "/demo/avatars/maria-256.webp",
          },
        ]}
      />
    ),
  },
  {
    name: "avatar-009",
    title: "Аватар ассистента",
    notes: [
      "Имя: Олег Дин",
      "Печатает: false",
      "Размер: sm",
      "Акцент: #e11d48",
    ],
    node: (
      <Avatar009 name="Олег Дин" typing={false} size="sm" accent="#e11d48" />
    ),
  },
  {
    name: "avatar-010",
    title: "Отсутствующий участник",
    notes: ["Случай: anonymous", "Размер: lg", "Подпись: Команда"],
    node: <Avatar010 reason="anonymous" size="lg" label="Команда" />,
  },
  {
    name: "avatar-011",
    title: "Знак компании",
    notes: [
      "Название: Вера Найт",
      "Размер: sm",
      "Цвет бренда: #22c55e",
      "src: /demo/avatars/mark-256.webp",
    ],
    node: (
      <Avatar011
        name="Вера Найт"
        size="sm"
        accent="#22c55e"
        src="/demo/avatars/mark-256.webp"
      />
    ),
  },
  {
    name: "avatar-012",
    title: "Аватары с именами",
    notes: [
      "Действие: Открыть профиль",
      "Объект: Объект: тест",
      "Фон: #22c55e",
      "Хвост: и с ними",
      "Цвет текста: #0f172a",
      "photos: шесть фотографий",
    ],
    node: (
      <Avatar012
        action="Открыть профиль"
        target="Объект: тест"
        background="#22c55e"
        moreText="и с ними"
        textColor="#0f172a"
        photos={[
          "/demo/avatars/petr-256.webp",
          "/demo/avatars/anna-256.webp",
          "/demo/avatars/mark-256.webp",
          "/demo/avatars/maria-256.webp",
          "/demo/avatars/oleg-256.webp",
          "/demo/avatars/irina-256.webp",
        ]}
      />
    ),
  },
  {
    name: "avatar-013",
    title: "Аватар со статусом",
    notes: [
      "Состояние: offline",
      "Размер: lg",
      "Роль: editor",
      "Фото: /demo/avatars/irina-256.webp",
    ],
    node: (
      <Avatar013
        status="offline"
        size="lg"
        role="editor"
        src="/demo/avatars/irina-256.webp"
      />
    ),
  },
  {
    name: "avatar-014",
    title: "Аватар нестандартной формы",
    notes: [
      "Форма: circle",
      "Роль: Технический директор",
      "Имя: Вера Найт",
      "Размер: sm",
      "src: /demo/avatars/oleg-256.webp",
    ],
    node: (
      <Avatar014
        shape="circle"
        role="Технический директор"
        name="Вера Найт"
        size="sm"
        src="/demo/avatars/oleg-256.webp"
      />
    ),
  },
  {
    name: "avatar-015",
    title: "Редактор аватара",
    notes: [
      "Пункт загрузки: Заменить фото",
      "Пункт удаления: Удалить фото",
      "Фон: #f59e0b",
      "Акцент: #f59e0b",
      "Цвет текста: #1f2937",
      "src: /demo/avatars/anna-256.webp",
    ],
    node: (
      <Avatar015
        editLabel="Заменить фото"
        removeLabel="Удалить фото"
        background="#f59e0b"
        accent="#f59e0b"
        textColor="#1f2937"
        src="/demo/avatars/anna-256.webp"
      />
    ),
  },
  {
    name: "avatar-016",
    title: "Сетка аватаров",
    notes: [
      "Заголовок: Дежурная смена · 8",
      "Фон: #22c55e",
      "Размер: sm",
      "Цвет имени: #111827",
      "Цвет остального текста: #111827",
      "photos: шесть фотографий",
    ],
    node: (
      <Avatar016
        title="Дежурная смена · 8"
        background="#22c55e"
        size="sm"
        textColor="#111827"
        mutedColor="#111827"
        photos={[
          "/demo/avatars/mark-256.webp",
          "/demo/avatars/maria-256.webp",
          "/demo/avatars/oleg-256.webp",
          "/demo/avatars/irina-256.webp",
          "/demo/avatars/petr-256.webp",
          "/demo/avatars/anna-256.webp",
        ]}
      />
    ),
  },
  {
    name: "avatar-017",
    title: "Строка участника",
    notes: [
      "Роль: Head of Design",
      "Действие: Пригласить",
      "Фон: #f59e0b",
      "Имя: Ника Юрьева",
      "Цвет текста: #0f172a",
      "src: /demo/avatars/mark-256.webp",
    ],
    node: (
      <Avatar017
        role="Head of Design"
        action="Пригласить"
        background="#f59e0b"
        name="Ника Юрьева"
        textColor="#0f172a"
        src="/demo/avatars/mark-256.webp"
      />
    ),
  },
  {
    name: "avatar-018",
    title: "Кольцо роли",
    notes: [
      "Роль: reader",
      "Размер: sm",
      "Команда: Дизайн-система",
      "src: /demo/avatars/maria-256.webp",
    ],
    node: (
      <Avatar018
        role="reader"
        size="sm"
        team="Дизайн-система"
        src="/demo/avatars/maria-256.webp"
      />
    ),
  },
  {
    name: "avatar-019",
    title: "Карточка профиля",
    notes: [
      "Действие: Позвонить",
      "Фон: #e11d48",
      "Имя: Тимур Аль",
      "О себе: Ведёт платформу и разбирает входящие раз в день: так быстрее отвечает по существу.",
      "Цвет текста: #0f172a",
      "src: /demo/avatars/irina-256.webp",
    ],
    node: (
      <Avatar019
        action="Позвонить"
        background="#e11d48"
        name="Тимур Аль"
        bio="Ведёт платформу и разбирает входящие раз в день: так быстрее отвечает по существу."
        textColor="#0f172a"
        src="/demo/avatars/irina-256.webp"
      />
    ),
  },
  {
    name: "avatar-020",
    title: "Аватар с непрочитанным",
    notes: [
      "Счётчик: 200",
      "Размер: sm",
      "Имя: Олег Дин",
      "Что считаем: Проект «Полёт»",
      "src: /demo/avatars/oleg-256.webp",
    ],
    node: (
      <Avatar020
        count={200}
        size="sm"
        name="Олег Дин"
        label="Проект «Полёт»"
        src="/demo/avatars/oleg-256.webp"
      />
    ),
  },
  {
    name: "avatar-021",
    title: "Кольцо истории",
    notes: [
      "Состояние: seen",
      "Размер: sm",
      "Имя: Тимур Аль",
      "src: /demo/avatars/mark-256.webp",
    ],
    node: (
      <Avatar021
        state="seen"
        size="sm"
        name="Тимур Аль"
        src="/demo/avatars/mark-256.webp"
      />
    ),
  },
  {
    name: "avatar-022",
    title: "Аватар с набором текста",
    notes: [
      "Имя: Олег Дин",
      "Печатает: false",
      "Фон: #e11d48",
      "Подпись набора: набирает сообщение…",
      "Цвет текста: #111827",
      "src: /demo/avatars/oleg-256.webp",
    ],
    node: (
      <Avatar022
        name="Олег Дин"
        typing={false}
        background="#e11d48"
        typingText="набирает сообщение…"
        textColor="#111827"
        src="/demo/avatars/oleg-256.webp"
      />
    ),
  },
  {
    name: "avatar-023",
    title: "Мозаика группы",
    notes: [
      "Название чата: Команда",
      "Размер: sm",
      "Фон: #22c55e",
      "Цвет имени: #1f2937",
      "Цвет остального текста: #1f2937",
      "photos: шесть фотографий",
    ],
    node: (
      <Avatar023
        label="Команда"
        size="sm"
        background="#22c55e"
        textColor="#1f2937"
        mutedColor="#1f2937"
        photos={[
          "/demo/avatars/oleg-256.webp",
          "/demo/avatars/irina-256.webp",
          "/demo/avatars/petr-256.webp",
          "/demo/avatars/anna-256.webp",
          "/demo/avatars/mark-256.webp",
          "/demo/avatars/maria-256.webp",
        ]}
      />
    ),
  },
  {
    name: "avatar-028",
    title: "Меню профиля",
    notes: [
      "Почта: timur@vibeui.ru",
      "Подпись выхода: Выйти из аккаунта",
      "Фон: #e11d48",
      "Имя: Ника Юрьева",
      "Цвет текста: #0f172a",
      "src: /demo/avatars/maria-256.webp",
    ],
    node: (
      <Avatar028
        email="timur@vibeui.ru"
        signOutLabel="Выйти из аккаунта"
        background="#e11d48"
        name="Ника Юрьева"
        textColor="#0f172a"
        src="/demo/avatars/maria-256.webp"
      />
    ),
  },
  {
    name: "avatar-030",
    title: "Имя в две строки",
    notes: [
      "Должность: Бэкенд",
      "Размер: lg",
      "Фон: #e11d48",
      "Имя: Тимур Аль",
      "Цвет текста: #1f2937",
      "src: /demo/avatars/mark-256.webp",
    ],
    node: (
      <Avatar030
        role="Бэкенд"
        size="lg"
        background="#e11d48"
        name="Тимур Аль"
        textColor="#1f2937"
        src="/demo/avatars/mark-256.webp"
      />
    ),
  },
  {
    name: "avatar-031",
    title: "Раскрывающаяся стопка",
    notes: [
      "Перекрытие, %: 26",
      "Размер: sm",
      "Видимых: 7",
      "photos: шесть фотографий",
    ],
    node: (
      <Avatar031
        overlap={26}
        size="sm"
        visible={7}
        photos={[
          "/demo/avatars/anna-256.webp",
          "/demo/avatars/mark-256.webp",
          "/demo/avatars/maria-256.webp",
          "/demo/avatars/oleg-256.webp",
          "/demo/avatars/irina-256.webp",
          "/demo/avatars/petr-256.webp",
        ]}
      />
    ),
  },
  {
    name: "avatar-033",
    title: "Говорящий участник",
    notes: [
      "Состояние: muted",
      "Имя: Вера Найт",
      "Фон: #0ea5e9",
      "Цвет имени: #0f172a",
      "Цвет остального текста: #111827",
      "src: /demo/avatars/oleg-256.webp",
    ],
    node: (
      <Avatar033
        state="muted"
        name="Вера Найт"
        background="#0ea5e9"
        textColor="#0f172a"
        mutedColor="#111827"
        src="/demo/avatars/oleg-256.webp"
      />
    ),
  },
  {
    name: "avatar-034",
    title: "Время последнего визита",
    notes: [
      "Когда: вчера в 09:20",
      "Давность: today",
      "Фон: #e11d48",
      "Подпись: заходил",
      "Цвет текста: #111827",
      "src: /demo/avatars/mark-256.webp",
    ],
    node: (
      <Avatar034
        when="вчера в 09:20"
        freshness="today"
        background="#e11d48"
        seenText="заходил"
        textColor="#111827"
        src="/demo/avatars/mark-256.webp"
      />
    ),
  },
  {
    name: "avatar-035",
    title: "Подтверждённое имя",
    notes: [
      "Вид: creator",
      "Дата: с 4 июня 2024",
      "Фон: #22c55e",
      "Цвет имени: #111827",
      "Цвет остального текста: #1f2937",
      "src: /demo/avatars/petr-256.webp",
    ],
    node: (
      <Avatar035
        kind="creator"
        since="с 4 июня 2024"
        background="#22c55e"
        textColor="#111827"
        mutedColor="#1f2937"
        src="/demo/avatars/petr-256.webp"
      />
    ),
  },
  {
    name: "avatar-036",
    title: "Обрезка фото",
    notes: [
      "Кнопка выбора: Проект «Полёт»",
      "Пояснение: JPEG или PNG, до 5 МБ",
      "Сторона кадра: 391",
      "Цвет текста: #0f172a",
      "src: /demo/avatars/oleg-256.webp",
    ],
    node: (
      <Avatar036
        label="Проект «Полёт»"
        hint="JPEG или PNG, до 5 МБ"
        output={391}
        textColor="#0f172a"
        src="/demo/avatars/oleg-256.webp"
      />
    ),
  },
  {
    name: "avatar-037",
    title: "Генеративный аватар",
    notes: [
      "Идентификатор: +7 900 000-00-00",
      "Имя: Олег Дин",
      "Размер: lg",
      "Форма: square",
    ],
    node: (
      <Avatar037
        seed="+7 900 000-00-00"
        name="Олег Дин"
        size="lg"
        shape="square"
      />
    ),
  },
  {
    name: "avatar-039",
    title: "Шапка профиля",
    notes: [
      "Имя: Тимур Аль",
      "Роль: Head of Design",
      "Действие: Открыть профиль",
      "Акцент: #22c55e",
      "Цвет текста: #0f172a",
      "src: /demo/avatars/anna-256.webp",
    ],
    node: (
      <Avatar039
        name="Тимур Аль"
        role="Head of Design"
        action="Открыть профиль"
        accent="#22c55e"
        textColor="#0f172a"
        src="/demo/avatars/anna-256.webp"
      />
    ),
  },
]
