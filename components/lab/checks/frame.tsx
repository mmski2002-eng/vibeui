import type { LabCheck } from "@/components/lab/check-types"

import { Frame001 } from "@/registry/components/frame/frame-001/frame-001"
import { Frame002 } from "@/registry/components/frame/frame-002/frame-002"
import { Frame003 } from "@/registry/components/frame/frame-003/frame-003"
import { Frame004 } from "@/registry/components/frame/frame-004/frame-004"
import { Frame005 } from "@/registry/components/frame/frame-005/frame-005"
import { Frame006 } from "@/registry/components/frame/frame-006/frame-006"
import { Frame007 } from "@/registry/components/frame/frame-007/frame-007"
import { Frame008 } from "@/registry/components/frame/frame-008/frame-008"
import { Frame009 } from "@/registry/components/frame/frame-009/frame-009"
import { Frame010 } from "@/registry/components/frame/frame-010/frame-010"
import { Frame011 } from "@/registry/components/frame/frame-011/frame-011"
import { Frame012 } from "@/registry/components/frame/frame-012/frame-012"
import { Frame013 } from "@/registry/components/frame/frame-013/frame-013"
import { Frame014 } from "@/registry/components/frame/frame-014/frame-014"
import { Frame015 } from "@/registry/components/frame/frame-015/frame-015"
import { Frame016 } from "@/registry/components/frame/frame-016/frame-016"
import { Frame017 } from "@/registry/components/frame/frame-017/frame-017"
import { Frame018 } from "@/registry/components/frame/frame-018/frame-018"
import { Frame019 } from "@/registry/components/frame/frame-019/frame-019"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 52594

export const CHECKS: LabCheck[] = [
  {
    name: "frame-001",
    title: "Демонстрационная рамка",
    notes: ["Вид: phone", "Адрес: Проверка", "Подпись: Смена"],
    node: <Frame001 variant="phone" url="Проверка" caption="Смена" />,
  },
  {
    name: "frame-002",
    title: "Кадр под видео",
    notes: ["Пропорция: 21:9", "Подпись заглушки: Подпись: тест"],
    node: <Frame002 ratio="21:9" title="Подпись: тест" />,
  },
  {
    name: "frame-003",
    title: "Окно браузера",
    notes: ["Адрес: Подпись: тест", "Вкладка: Проверка"],
    node: <Frame003 url="Подпись: тест" tab="Проверка" />,
  },
  {
    name: "frame-004",
    title: "Экран телефона",
    notes: [
      "Время: Тест",
      "Оператор: Проверка",
      "Заголовок заглушки: Что дальше",
    ],
    node: <Frame004 time="Тест" carrier="Проверка" stubTitle="Что дальше" />,
  },
  {
    name: "frame-005",
    title: "Экран ноутбука",
    notes: ["Заголовок экрана: Подпись: тест", "Корпус: silver"],
    node: <Frame005 title="Подпись: тест" tone="silver" />,
  },
  {
    name: "frame-006",
    title: "Иллюстрация с подписью",
    notes: [
      "Подпись: Подпись: тест",
      "Номер рисунка: 79",
      "Выравнивание: center",
      "Шаблон номера: Смена",
      "Акцент: #af002f",
    ],
    node: (
      <Frame006
        caption="Подпись: тест"
        index={79}
        align="center"
        indexText="Смена"
        accent="#af002f"
      />
    ),
  },
  {
    name: "frame-007",
    title: "Окно терминала",
    notes: [
      "Заголовок окна: Проверка",
      "Приглашение: 42",
      "Подпись вывода: Черновик",
      "Акцент: #1272b9",
    ],
    node: (
      <Frame007
        title="Проверка"
        prompt="42"
        outputLabel="Черновик"
        accent="#1272b9"
      />
    ),
  },
  {
    name: "frame-008",
    title: "Планшет горизонтально",
    notes: ["Подпись: Черновик", "Надпись экрана: Проверка"],
    node: <Frame008 caption="Черновик" stubText="Проверка" />,
  },
  {
    name: "frame-009",
    title: "Кадр карты с меткой",
    notes: [
      "Подпись метки: Смена",
      "Масштаб: Черновик",
      "Подпись линейки: Смена",
      "Акцент: #bb471f",
    ],
    node: (
      <Frame009
        label="Смена"
        scale="Черновик"
        scaleLabel="Смена"
        accent="#bb471f"
      />
    ),
  },
  {
    name: "frame-010",
    title: "Коллаж из кадров",
    notes: ["Подпись: Подпись: тест", "Заглушка кадра: Подпись: тест"],
    node: <Frame010 caption="Подпись: тест" stubText="Подпись: тест" />,
  },
  {
    name: "frame-011",
    title: "Кадр с наклоном",
    notes: [
      "Направление разворота: right",
      "Подпись: Черновик",
      "Надпись кадра: Черновик",
    ],
    node: <Frame011 tilt="right" caption="Черновик" stubText="Черновик" />,
  },
  {
    name: "frame-012",
    title: "Сравнение «до и после»",
    notes: [
      "Подпись «до»: Ок",
      "Подпись «после»: Подпись: тест",
      "Заглушка «до»: Смена",
      "Заглушка «после»: Проверка",
      "Акцент: #1ca11f",
    ],
    node: (
      <Frame012
        beforeLabel="Ок"
        afterLabel="Подпись: тест"
        beforeStub="Смена"
        afterStub="Проверка"
        accent="#1ca11f"
      />
    ),
  },
  {
    name: "frame-013",
    title: "Каркас приложения",
    notes: [
      "Название приложения: Ок",
      "Заголовок страницы: Проверка",
      "Активный пункт: 2",
      "Акцент: #b61849",
    ],
    node: (
      <Frame013
        appName="Ок"
        pageTitle="Проверка"
        activeIndex={2}
        accent="#b61849"
      />
    ),
  },
  {
    name: "frame-014",
    title: "Письмо",
    notes: [
      "Отправитель: Проверка",
      "Тема письма: Смена",
      "Дата: Тест",
      "Акцент: #6e9eae",
    ],
    node: (
      <Frame014
        sender="Проверка"
        subject="Смена"
        date="Тест"
        accent="#6e9eae"
      />
    ),
  },
  {
    name: "frame-015",
    title: "Проигрыватель видео",
    notes: [
      "Заголовок: Подпись: тест",
      "Прогресс просмотра: 58",
      "Текущее время: Ня",
      "Длительность: Ня",
      "Надпись обложки: Смена",
      "Акцент: #1672ab",
    ],
    node: (
      <Frame015
        title="Подпись: тест"
        progress={58}
        currentTime="Ня"
        duration="Ня"
        posterStub="Смена"
        accent="#1672ab"
      />
    ),
  },
  {
    name: "frame-016",
    title: "Экран смарт-часов",
    notes: [
      "Время: 42",
      "Подпись: Подпись: тест",
      "Подпись под кадром: Что дальше",
      "Цвет корпуса: #877b61",
    ],
    node: (
      <Frame016
        time="42"
        subtitle="Подпись: тест"
        caption="Что дальше"
        caseColor="#877b61"
      />
    ),
  },
  {
    name: "frame-017",
    title: "Слайд презентации",
    notes: [
      "Номер слайда: 8",
      "Всего слайдов: 4",
      "Заголовок слайда: Черновик",
      "Подпись под кадром: Что дальше",
      "Акцент: #971cab",
    ],
    node: (
      <Frame017
        index={8}
        total={4}
        stubTitle="Черновик"
        caption="Что дальше"
        accent="#971cab"
      />
    ),
  },
  {
    name: "frame-018",
    title: "Сообщение в чате",
    notes: [
      "Имя собеседника: Ок",
      "Плейсхолдер поля ввода: Черновик",
      "Подпись под кадром: Проверка",
      "Акцент: #338a73",
    ],
    node: (
      <Frame018
        contact="Ок"
        placeholder="Черновик"
        caption="Проверка"
        accent="#338a73"
      />
    ),
  },
  {
    name: "frame-019",
    title: "Кадр со свечением",
    notes: [
      "Подпись под кадром: Подпись: тест",
      "Надпись пустого кадра: Смена",
      "Акцент: #f75473",
    ],
    node: <Frame019 caption="Подпись: тест" stub="Смена" accent="#f75473" />,
  },
]
