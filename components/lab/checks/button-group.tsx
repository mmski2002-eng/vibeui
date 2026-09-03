import type { LabCheck } from "@/components/lab/check-types"

import { Buttongroup001 } from "@/registry/components/button-group/buttongroup-001/buttongroup-001"
import { Buttongroup002 } from "@/registry/components/button-group/buttongroup-002/buttongroup-002"
import { Buttongroup003 } from "@/registry/components/button-group/buttongroup-003/buttongroup-003"
import { Buttongroup004 } from "@/registry/components/button-group/buttongroup-004/buttongroup-004"
import { Buttongroup005 } from "@/registry/components/button-group/buttongroup-005/buttongroup-005"
import { Buttongroup006 } from "@/registry/components/button-group/buttongroup-006/buttongroup-006"
import { Buttongroup007 } from "@/registry/components/button-group/buttongroup-007/buttongroup-007"
import { Buttongroup008 } from "@/registry/components/button-group/buttongroup-008/buttongroup-008"
import { Buttongroup009 } from "@/registry/components/button-group/buttongroup-009/buttongroup-009"
import { Buttongroup010 } from "@/registry/components/button-group/buttongroup-010/buttongroup-010"
import { Buttongroup011 } from "@/registry/components/button-group/buttongroup-011/buttongroup-011"
import { Buttongroup012 } from "@/registry/components/button-group/buttongroup-012/buttongroup-012"
import { Buttongroup013 } from "@/registry/components/button-group/buttongroup-013/buttongroup-013"
import { Buttongroup014 } from "@/registry/components/button-group/buttongroup-014/buttongroup-014"
import { Buttongroup015 } from "@/registry/components/button-group/buttongroup-015/buttongroup-015"
import { Buttongroup016 } from "@/registry/components/button-group/buttongroup-016/buttongroup-016"
import { Buttongroup017 } from "@/registry/components/button-group/buttongroup-017/buttongroup-017"
import { Buttongroup018 } from "@/registry/components/button-group/buttongroup-018/buttongroup-018"
import { Buttongroup019 } from "@/registry/components/button-group/buttongroup-019/buttongroup-019"
import { Buttongroup020 } from "@/registry/components/button-group/buttongroup-020/buttongroup-020"
import { Buttongroup021 } from "@/registry/components/button-group/buttongroup-021/buttongroup-021"
import { Buttongroup022 } from "@/registry/components/button-group/buttongroup-022/buttongroup-022"
import { Buttongroup023 } from "@/registry/components/button-group/buttongroup-023/buttongroup-023"
import { Buttongroup024 } from "@/registry/components/button-group/buttongroup-024/buttongroup-024"
import { Buttongroup025 } from "@/registry/components/button-group/buttongroup-025/buttongroup-025"
import { Buttongroup026 } from "@/registry/components/button-group/buttongroup-026/buttongroup-026"
import { Buttongroup027 } from "@/registry/components/button-group/buttongroup-027/buttongroup-027"
import { Buttongroup028 } from "@/registry/components/button-group/buttongroup-028/buttongroup-028"
import { Buttongroup029 } from "@/registry/components/button-group/buttongroup-029/buttongroup-029"
import { Buttongroup030 } from "@/registry/components/button-group/buttongroup-030/buttongroup-030"
import { Buttongroup031 } from "@/registry/components/button-group/buttongroup-031/buttongroup-031"
import { Buttongroup032 } from "@/registry/components/button-group/buttongroup-032/buttongroup-032"
import { Buttongroup033 } from "@/registry/components/button-group/buttongroup-033/buttongroup-033"
import { Buttongroup034 } from "@/registry/components/button-group/buttongroup-034/buttongroup-034"
import { Buttongroup035 } from "@/registry/components/button-group/buttongroup-035/buttongroup-035"
import { Buttongroup036 } from "@/registry/components/button-group/buttongroup-036/buttongroup-036"
import { Buttongroup037 } from "@/registry/components/button-group/buttongroup-037/buttongroup-037"
import { Buttongroup038 } from "@/registry/components/button-group/buttongroup-038/buttongroup-038"
import { Buttongroup039 } from "@/registry/components/button-group/buttongroup-039/buttongroup-039"
import { Buttongroup040 } from "@/registry/components/button-group/buttongroup-040/buttongroup-040"
import { Buttongroup041 } from "@/registry/components/button-group/buttongroup-041/buttongroup-041"
import { Buttongroup042 } from "@/registry/components/button-group/buttongroup-042/buttongroup-042"
import { Buttongroup043 } from "@/registry/components/button-group/buttongroup-043/buttongroup-043"
import { Buttongroup044 } from "@/registry/components/button-group/buttongroup-044/buttongroup-044"
import { Buttongroup045 } from "@/registry/components/button-group/buttongroup-045/buttongroup-045"
import { Buttongroup046 } from "@/registry/components/button-group/buttongroup-046/buttongroup-046"
import { Buttongroup047 } from "@/registry/components/button-group/buttongroup-047/buttongroup-047"
import { Buttongroup048 } from "@/registry/components/button-group/buttongroup-048/buttongroup-048"
import { Buttongroup049 } from "@/registry/components/button-group/buttongroup-049/buttongroup-049"
import { Buttongroup050 } from "@/registry/components/button-group/buttongroup-050/buttongroup-050"
import { Buttongroup051 } from "@/registry/components/button-group/buttongroup-051/buttongroup-051"
import { Buttongroup052 } from "@/registry/components/button-group/buttongroup-052/buttongroup-052"
import { Buttongroup053 } from "@/registry/components/button-group/buttongroup-053/buttongroup-053"
import { Buttongroup054 } from "@/registry/components/button-group/buttongroup-054/buttongroup-054"
import { Buttongroup055 } from "@/registry/components/button-group/buttongroup-055/buttongroup-055"
import { Buttongroup056 } from "@/registry/components/button-group/buttongroup-056/buttongroup-056"
import { Buttongroup057 } from "@/registry/components/button-group/buttongroup-057/buttongroup-057"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 8027

export const CHECKS: LabCheck[] = [
  {
    name: "buttongroup-001",
    title: "Сегментированный фильтр",
    notes: [
      "Выбрано: Активные",
      "Имя группы: Подпись: тест",
      "Акцент: #7c2581",
    ],
    node: (
      <Buttongroup001
        defaultValue="Активные"
        label="Подпись: тест"
        accent="#7c2581"
      />
    ),
  },
  {
    name: "buttongroup-002",
    title: "Слитые действия",
    notes: ["Размер: compact", "Имя группы: Проверка", "Акцент: #782883"],
    node: <Buttongroup002 size="compact" label="Проверка" accent="#782883" />,
  },
  {
    name: "buttongroup-003",
    title: "Кнопка сохранения с меню",
    notes: ["Действие: Что дальше", "Имя меню: Черновик", "Акцент: #532fd3"],
    node: (
      <Buttongroup003
        action="Что дальше"
        menuLabel="Черновик"
        accent="#532fd3"
      />
    ),
  },
  {
    name: "buttongroup-004",
    title: "Панель редактора",
    notes: ["Подписи: true", "Имя панели: Черновик", "Акцент: #596197"],
    node: (
      <Buttongroup004 showLabels={true} label="Черновик" accent="#596197" />
    ),
  },
  {
    name: "buttongroup-005",
    title: "Переключатель вида",
    notes: ["Вид: grid", "Имя группы: Черновик", "Акцент: #676e88"],
    node: (
      <Buttongroup005 defaultView="grid" label="Черновик" accent="#676e88" />
    ),
  },
  {
    name: "buttongroup-006",
    title: "Группа кнопок-иконок",
    notes: ["Форма: square", "Имя группы: Черновик", "Акцент: #7745b7"],
    node: <Buttongroup006 shape="square" label="Черновик" accent="#7745b7" />,
  },
  {
    name: "buttongroup-007",
    title: "Вертикальные действия",
    notes: ["Ширина, rem: 24", "Имя группы: Проверка", "Акцент: #89a40e"],
    node: <Buttongroup007 width={24} label="Проверка" accent="#89a40e" />,
  },
  {
    name: "buttongroup-008",
    title: "Группа листания",
    notes: ["Страница: 954", "Всего страниц: 578", "Акцент: #f01356"],
    node: <Buttongroup008 page={954} total={578} accent="#f01356" />,
  },
  {
    name: "buttongroup-009",
    title: "Группа с переполнением",
    notes: [
      "Главное действие: Подпись: тест",
      "Кнопка «Ещё»: Ня",
      "Акцент: #509b06",
    ],
    node: (
      <Buttongroup009 primary="Подпись: тест" moreLabel="Ня" accent="#509b06" />
    ),
  },
  {
    name: "buttongroup-010",
    title: "Выбор периода",
    notes: ["Период: Месяц", "Имя группы: Что дальше", "Акцент: #b3d3e3"],
    node: (
      <Buttongroup010
        defaultPeriod="Месяц"
        label="Что дальше"
        accent="#b3d3e3"
      />
    ),
  },
  {
    name: "buttongroup-011",
    title: "Действия над записью",
    notes: [
      "Опасное действие: Что дальше",
      "Имя группы: Подпись: тест",
      "Акцент: #1ed6c3",
    ],
    node: (
      <Buttongroup011
        danger="Что дальше"
        label="Подпись: тест"
        accent="#1ed6c3"
      />
    ),
  },
  {
    name: "buttongroup-012",
    title: "Полоса подвала формы",
    notes: [
      "Главное действие: Проверка",
      "Второе действие: Что дальше",
      "Акцент: #452fdf",
    ],
    node: (
      <Buttongroup012
        primary="Проверка"
        secondary="Что дальше"
        accent="#452fdf"
      />
    ),
  },
  {
    name: "buttongroup-013",
    title: "Сегменты с иконкой и подписью",
    notes: ["Выбрано: chart", "Имя группы: Смена", "Акцент: #3f8076"],
    node: (
      <Buttongroup013 defaultValue="chart" label="Смена" accent="#3f8076" />
    ),
  },
  {
    name: "buttongroup-014",
    title: "Вкладки только с иконками",
    notes: ["Выбрано: day", "Имя группы: Что дальше", "Акцент: #724ffd"],
    node: (
      <Buttongroup014 defaultValue="day" label="Что дальше" accent="#724ffd" />
    ),
  },
  {
    name: "buttongroup-015",
    title: "Счётчики на кнопках",
    notes: ["Выбрано: В работе", "Единица счёта: Проверка", "Акцент: #fcb84e"],
    node: (
      <Buttongroup015
        defaultValue="В работе"
        unit="Проверка"
        accent="#fcb84e"
      />
    ),
  },
  {
    name: "buttongroup-016",
    title: "Заблокированный сегмент",
    notes: ["Выбрано: Опубликовано", "Причина: Черновик", "Акцент: #c6299b"],
    node: (
      <Buttongroup016
        defaultValue="Опубликовано"
        reason="Черновик"
        accent="#c6299b"
      />
    ),
  },
  {
    name: "buttongroup-017",
    title: "Переключатель «да — нет»",
    notes: ["Ответ: no", "Вопрос: Проверка", "Акцент: #a973f5"],
    node: (
      <Buttongroup017 defaultValue="no" question="Проверка" accent="#a973f5" />
    ),
  },
  {
    name: "buttongroup-018",
    title: "Переключатель из трёх состояний",
    notes: ["Позиция: inherit", "Имя группы: Что дальше", "Акцент: #d52aa3"],
    node: (
      <Buttongroup018
        defaultValue="inherit"
        label="Что дальше"
        accent="#d52aa3"
      />
    ),
  },
  {
    name: "buttongroup-019",
    title: "Всё и сброс",
    notes: ["Подпись «Все»: Ня", "Подпись сброса: Смена", "Акцент: #916316"],
    node: <Buttongroup019 allLabel="Ня" resetLabel="Смена" accent="#916316" />,
  },
  {
    name: "buttongroup-020",
    title: "Выбор валюты",
    notes: ["Валюта: RUB", "Имя группы: Черновик", "Акцент: #8cea8c"],
    node: (
      <Buttongroup020 defaultValue="RUB" label="Черновик" accent="#8cea8c" />
    ),
  },
  {
    name: "buttongroup-021",
    title: "Строки языков",
    notes: ["Язык: en", "Имя группы: Подпись: тест", "Акцент: #e92844"],
    node: (
      <Buttongroup021
        defaultValue="en"
        label="Подпись: тест"
        accent="#e92844"
      />
    ),
  },
  {
    name: "buttongroup-022",
    title: "Ступени масштаба",
    notes: ["Масштаб, %: 2", "Имя группы: Смена", "Акцент: #773f3e"],
    node: <Buttongroup022 defaultValue={2} label="Смена" accent="#773f3e" />,
  },
  {
    name: "buttongroup-023",
    title: "Выравнивание текста",
    notes: ["Выравнивание: start", "Имя группы: Что дальше", "Акцент: #9724ab"],
    node: (
      <Buttongroup023
        defaultValue="start"
        label="Что дальше"
        accent="#9724ab"
      />
    ),
  },
  {
    name: "buttongroup-024",
    title: "Начертания текста",
    notes: [
      "Имя группы: Черновик",
      "Префикс полей: Что дальше",
      "Акцент: #f60487",
    ],
    node: (
      <Buttongroup024 label="Черновик" name="Что дальше" accent="#f60487" />
    ),
  },
  {
    name: "buttongroup-025",
    title: "Масштаб карты",
    notes: ["Уровень: 2", "Акцент: #06de54", "Имя группы: Подпись: тест"],
    node: <Buttongroup025 level={2} accent="#06de54" label="Подпись: тест" />,
  },
  {
    name: "buttongroup-026",
    title: "Скорость воспроизведения",
    notes: ["Скорость: 2×", "Акцент: #2f72d9", "Имя группы: Подпись: тест"],
    node: (
      <Buttongroup026
        defaultValue="2×"
        accent="#2f72d9"
        label="Подпись: тест"
      />
    ),
  },
  {
    name: "buttongroup-027",
    title: "Плотность таблицы",
    notes: [
      "Плотность: regular",
      "Акцент: #6f9b1b",
      "Средний вариант: Проверка",
    ],
    node: (
      <Buttongroup027
        defaultValue="regular"
        accent="#6f9b1b"
        regularLabel="Проверка"
      />
    ),
  },
  {
    name: "buttongroup-028",
    title: "Направление сортировки",
    notes: ["Направление: asc", "Акцент: #a4c319", "Поле: Ок"],
    node: <Buttongroup028 defaultValue="asc" accent="#a4c319" field="Ок" />,
  },
  {
    name: "buttongroup-029",
    title: "Образцы темы",
    notes: ["Тема: system", "Акцент: #70fb84", "Имя группы: Черновик"],
    node: (
      <Buttongroup029 defaultValue="system" accent="#70fb84" label="Черновик" />
    ),
  },
  {
    name: "buttongroup-030",
    title: "Шаг графика",
    notes: ["Текущий шаг: День", "Акцент: #7cbb11", "Имя навигации: Черновик"],
    node: <Buttongroup030 current="День" accent="#7cbb11" label="Черновик" />,
  },
  {
    name: "buttongroup-031",
    title: "Фильтр по точкам состояния",
    notes: [
      "Акцент: #e6cf9c",
      "Имя группы: Что дальше",
      "Префикс полей: Черновик",
    ],
    node: (
      <Buttongroup031 accent="#e6cf9c" label="Что дальше" name="Черновик" />
    ),
  },
  {
    name: "buttongroup-032",
    title: "Занятый сегмент",
    notes: [
      "Занятое действие: Сохранить",
      "Акцент: #e02096",
      "Текст о работе: Черновик",
    ],
    node: (
      <Buttongroup032 busy="Сохранить" accent="#e02096" busyLabel="Черновик" />
    ),
  },
  {
    name: "buttongroup-033",
    title: "Обязательный выбор",
    notes: [
      "Акцент: #c9a5f9",
      "Вопрос: Проверка",
      "Текст ошибки: Подпись: тест",
    ],
    node: (
      <Buttongroup033
        accent="#c9a5f9"
        question="Проверка"
        error="Подпись: тест"
      />
    ),
  },
  {
    name: "buttongroup-034",
    title: "Группа в шапке карточки",
    notes: [
      "Акцент: #ad2003",
      "Заголовок: Что дальше",
      "Главное действие: Черновик",
    ],
    node: (
      <Buttongroup034 accent="#ad2003" title="Что дальше" primary="Черновик" />
    ),
  },
  {
    name: "buttongroup-035",
    title: "Раскрывающиеся дополнения",
    notes: [
      "Акцент: #c95826",
      "Кнопка раскрытия: 42",
      "Имя группы: Что дальше",
    ],
    node: <Buttongroup035 accent="#c95826" moreLabel="42" label="Что дальше" />,
  },
  {
    name: "buttongroup-036",
    title: "Способы оплаты",
    notes: ["Способ: later", "Акцент: #68cd5f", "Имя группы: Смена"],
    node: (
      <Buttongroup036 defaultValue="later" accent="#68cd5f" label="Смена" />
    ),
  },
  {
    name: "buttongroup-037",
    title: "Файл или ссылка",
    notes: [
      "Вкладка: file",
      "Акцент: #c26824",
      "Подпись вкладки файла: Черновик",
      "Подпись вкладки ссылки: Проверка",
      "Имя группы: Проверка",
    ],
    node: (
      <Buttongroup037
        defaultValue="file"
        accent="#c26824"
        fileLabel="Черновик"
        linkLabel="Проверка"
        label="Проверка"
      />
    ),
  },
  {
    name: "buttongroup-038",
    title: "Сохранить и закрыть",
    notes: [
      "Акцент: #33ef6c",
      "Первое действие: Проверка",
      "Второе действие: Что дальше",
      "Подсказка: Что дальше",
      "Имя группы: Подпись: тест",
    ],
    node: (
      <Buttongroup038
        accent="#33ef6c"
        saveLabel="Проверка"
        closeLabel="Что дальше"
        note="Что дальше"
        label="Подпись: тест"
      />
    ),
  },
  {
    name: "buttongroup-039",
    title: "Опасное действие с задержкой",
    notes: [
      "Задержка, с: 30",
      "Цвет опасного: #0f1df1",
      "Акцент: #70b3c7",
      "Опасное действие: Что дальше",
      "Безопасное действие: Черновик",
    ],
    node: (
      <Buttongroup039
        delay={30}
        danger="#0f1df1"
        accent="#70b3c7"
        dangerLabel="Что дальше"
        cancelLabel="Черновик"
      />
    ),
  },
  {
    name: "buttongroup-040",
    title: "Полоса «поделиться»",
    notes: [
      "Акцент: #9b24a4",
      "Ссылка: Смена",
      "Подпись копирования: Черновик",
      "Имя группы: Что дальше",
    ],
    node: (
      <Buttongroup040
        accent="#9b24a4"
        link="Смена"
        copyLabel="Черновик"
        label="Что дальше"
      />
    ),
  },
  {
    name: "buttongroup-041",
    title: "Реакции эмодзи",
    notes: [
      "Акцент: #e759a1",
      "Имя группы: Черновик",
      "Имя кнопки «плюс»: Подпись: тест",
    ],
    node: (
      <Buttongroup041
        accent="#e759a1"
        label="Черновик"
        addLabel="Подпись: тест"
      />
    ),
  },
  {
    name: "buttongroup-042",
    title: "Пилюля голосования",
    notes: [
      "Счёт: 1956",
      "Акцент: #c87201",
      "Имя «за»: Смена",
      "Имя «против»: Смена",
      "Имя группы: Что дальше",
    ],
    node: (
      <Buttongroup042
        score={1956}
        accent="#c87201"
        upLabel="Смена"
        downLabel="Смена"
        label="Что дальше"
      />
    ),
  },
  {
    name: "buttongroup-043",
    title: "Навигация по записям",
    notes: [
      "Номер записи: 476",
      "Всего записей: 1333",
      "Акцент: #8d80da",
      "Слово в счётчике: Проверка",
      "Формула счётчика: Проверка",
    ],
    node: (
      <Buttongroup043
        index={476}
        total={1333}
        accent="#8d80da"
        entity="Проверка"
        counterText="Проверка"
      />
    ),
  },
  {
    name: "buttongroup-044",
    title: "Счётчик количества",
    notes: [
      "Количество: 1",
      "Акцент: #f5122e",
      "Единица: Ок",
      "Доступное имя: Смена",
    ],
    node: (
      <Buttongroup044
        defaultValue={1}
        accent="#f5122e"
        unit="Ок"
        label="Смена"
      />
    ),
  },
  {
    name: "buttongroup-045",
    title: "Переключатель единиц",
    notes: [
      "Система: imperial",
      "Акцент: #4445f0",
      "Метрическое значение: Подпись: тест",
      "Имперское значение: Подпись: тест",
      "Пояснение: Подпись: тест",
    ],
    node: (
      <Buttongroup045
        defaultValue="imperial"
        accent="#4445f0"
        metricValue="Подпись: тест"
        imperialValue="Подпись: тест"
        caption="Подпись: тест"
      />
    ),
  },
  {
    name: "buttongroup-046",
    title: "Пресеты дат",
    notes: [
      "Период: custom",
      "Акцент: #b159f2",
      "Произвольный период: Смена",
      "Имя группы: Проверка",
    ],
    node: (
      <Buttongroup046
        defaultValue="custom"
        accent="#b159f2"
        customLabel="Смена"
        label="Проверка"
      />
    ),
  },
  {
    name: "buttongroup-047",
    title: "Чипы типов файлов",
    notes: [
      "Акцент: #79b8f3",
      "Имя группы: Проверка",
      "Префикс полей: Что дальше",
    ],
    node: (
      <Buttongroup047 accent="#79b8f3" label="Проверка" name="Что дальше" />
    ),
  },
  {
    name: "buttongroup-048",
    title: "Тип графика",
    notes: [
      "Вид: line",
      "Акцент: #88078c",
      "Имя группы: Проверка",
      "Подпись линии: Черновик",
    ],
    node: (
      <Buttongroup048
        defaultValue="line"
        accent="#88078c"
        label="Проверка"
        lineLabel="Черновик"
      />
    ),
  },
  {
    name: "buttongroup-049",
    title: "Выбор колонок",
    notes: [
      "Акцент: #49500e",
      "Подпись кнопки: Смена",
      "Счётчик: Подпись: тест",
      "Подсказка о последней: Что дальше",
      "Имя панели: Подпись: тест",
    ],
    node: (
      <Buttongroup049
        accent="#49500e"
        triggerLabel="Смена"
        countText="Подпись: тест"
        lastColumnHint="Что дальше"
        label="Подпись: тест"
      />
    ),
  },
  {
    name: "buttongroup-050",
    title: "Лестница ролей",
    notes: [
      "Роль: owner",
      "Акцент: #af08d5",
      "Пояснение: Что дальше",
      "Имя группы: Что дальше",
    ],
    node: (
      <Buttongroup050
        defaultValue="owner"
        accent="#af08d5"
        hint="Что дальше"
        label="Что дальше"
      />
    ),
  },
  {
    name: "buttongroup-051",
    title: "Уровни приоритета",
    notes: ["Уровень: urgent", "Акцент: #90e4e2", "Имя группы: Смена"],
    node: (
      <Buttongroup051 defaultValue="urgent" accent="#90e4e2" label="Смена" />
    ),
  },
  {
    name: "buttongroup-052",
    title: "Галочка на выбранном",
    notes: ["Канал: push", "Акцент: #4a225c", "Имя группы: Смена"],
    node: <Buttongroup052 defaultValue="push" accent="#4a225c" label="Смена" />,
  },
  {
    name: "buttongroup-053",
    title: "Действия во всю ширину",
    notes: ["Акцент: #25f9a4", "Имя группы: Смена"],
    node: <Buttongroup053 accent="#25f9a4" label="Смена" />,
  },
  {
    name: "buttongroup-054",
    title: "Инструменты плотной строки",
    notes: ["Акцент: #04ed3a", "Имя группы: Что дальше"],
    node: <Buttongroup054 accent="#04ed3a" label="Что дальше" />,
  },
  {
    name: "buttongroup-055",
    title: "Панель с группами",
    notes: ["Акцент: #d49fe0", "Имя панели: Что дальше"],
    node: <Buttongroup055 accent="#d49fe0" label="Что дальше" />,
  },
  {
    name: "buttongroup-056",
    title: "Подсказки у кнопок",
    notes: ["Акцент: #fc6526", "Выбрано: Тест", "Имя группы: Что дальше"],
    node: (
      <Buttongroup056 accent="#fc6526" defaultValue="Тест" label="Что дальше" />
    ),
  },
  {
    name: "buttongroup-057",
    title: "Запоминаемый выбор",
    notes: [
      "Акцент: #8baea1",
      "Выбрано: Подпись: тест",
      "Имя поля: Подпись: тест",
      "Строка отправки: Что дальше",
    ],
    node: (
      <Buttongroup057
        accent="#8baea1"
        defaultValue="Подпись: тест"
        name="Подпись: тест"
        wireText="Что дальше"
      />
    ),
  },
]
