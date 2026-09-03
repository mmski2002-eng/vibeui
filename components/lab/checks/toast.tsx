import type { LabCheck } from "@/components/lab/check-types"

import { Toast001 } from "@/registry/components/toast/toast-001/toast-001"
import { Toast002 } from "@/registry/components/toast/toast-002/toast-002"
import { Toast003 } from "@/registry/components/toast/toast-003/toast-003"
import { Toast004 } from "@/registry/components/toast/toast-004/toast-004"
import { Toast005 } from "@/registry/components/toast/toast-005/toast-005"
import { Toast006 } from "@/registry/components/toast/toast-006/toast-006"
import { Toast007 } from "@/registry/components/toast/toast-007/toast-007"
import { Toast008 } from "@/registry/components/toast/toast-008/toast-008"
import { Toast009 } from "@/registry/components/toast/toast-009/toast-009"
import { Toast010 } from "@/registry/components/toast/toast-010/toast-010"
import { Toast011 } from "@/registry/components/toast/toast-011/toast-011"
import { Toast012 } from "@/registry/components/toast/toast-012/toast-012"
import { Toast013 } from "@/registry/components/toast/toast-013/toast-013"
import { Toast014 } from "@/registry/components/toast/toast-014/toast-014"
import { Toast015 } from "@/registry/components/toast/toast-015/toast-015"
import { Toast016 } from "@/registry/components/toast/toast-016/toast-016"
import { Toast017 } from "@/registry/components/toast/toast-017/toast-017"
import { Toast018 } from "@/registry/components/toast/toast-018/toast-018"
import { Toast019 } from "@/registry/components/toast/toast-019/toast-019"
import { Toast020 } from "@/registry/components/toast/toast-020/toast-020"
import { Toast021 } from "@/registry/components/toast/toast-021/toast-021"
import { Toast022 } from "@/registry/components/toast/toast-022/toast-022"
import { Toast023 } from "@/registry/components/toast/toast-023/toast-023"
import { Toast024 } from "@/registry/components/toast/toast-024/toast-024"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 52594

export const CHECKS: LabCheck[] = [
  {
    name: "toast-001",
    title: "Сообщение с таймером",
    notes: [
      "Тон: success",
      "Заголовок: Проверка",
      "Описание: Смена",
      "Отмена: Подпись: тест",
      "Секунд: 11",
      "Подпись крестика: Подпись: тест",
    ],
    node: (
      <Toast001
        tone="success"
        title="Проверка"
        description="Смена"
        undoLabel="Подпись: тест"
        duration={11}
        closeLabel="Подпись: тест"
      />
    ),
  },
  {
    name: "toast-002",
    title: "Сообщение с отменой",
    notes: [
      "Сообщение: Проверка",
      "Отмена: Смена",
      "Секунд: 7",
      "После отмены: Что дальше",
      "Отсчёт: Смена",
      "Акцент: #6f09f8",
    ],
    node: (
      <Toast002
        message="Проверка"
        undoLabel="Смена"
        seconds={7}
        undoneMessage="Что дальше"
        countdownText="Смена"
        accent="#6f09f8"
      />
    ),
  },
  {
    name: "toast-003",
    title: "Стопка сообщений",
    notes: ["Показывать: 3", "Акцент: #c98cb0"],
    node: <Toast003 max={3} accent="#c98cb0" />,
  },
  {
    name: "toast-004",
    title: "Сообщение по этапам",
    notes: [
      "Стадия: loading",
      "Текст успеха: Смена",
      "Текст загрузки: Черновик",
      "Текст ошибки: Подпись: тест",
      "Подсказка: Подпись: тест",
    ],
    node: (
      <Toast004
        state="loading"
        successText="Смена"
        loadingText="Черновик"
        errorText="Подпись: тест"
        hint="Подпись: тест"
      />
    ),
  },
  {
    name: "toast-005",
    title: "Сообщение с повтором",
    notes: [
      "Заголовок: Смена",
      "Повтор: Проверка",
      "Объяснение: Черновик",
      "Раскрытие: Проверка",
      "Тон: #3e0ca7",
    ],
    node: (
      <Toast005
        title="Смена"
        retryLabel="Проверка"
        message="Черновик"
        detailsLabel="Проверка"
        tone="#3e0ca7"
      />
    ),
  },
  {
    name: "toast-006",
    title: "Сообщение с прогрессом",
    notes: [
      "Прогресс: 96",
      "Счётчик: Смена",
      "Заголовок: Что дальше",
      "Отмена: Проверка",
      "Тон: #8eec94",
    ],
    node: (
      <Toast006
        value={96}
        countLabel="Смена"
        title="Что дальше"
        cancelLabel="Проверка"
        tone="#8eec94"
      />
    ),
  },
  {
    name: "toast-007",
    title: "Развёрнутое сообщение",
    notes: [
      "Главное действие: Проверка",
      "Второе действие: Проверка",
      "Заголовок: Смена",
      "Значок: 42",
      "Подпись крестика: Черновик",
      "Акцент: #2e0cbe",
    ],
    node: (
      <Toast007
        primaryLabel="Проверка"
        secondaryLabel="Проверка"
        title="Смена"
        glyph="42"
        closeLabel="Черновик"
        tone="#2e0cbe"
      />
    ),
  },
  {
    name: "toast-008",
    title: "Область сообщений",
    notes: [
      "Угол: top-left",
      "Отступ: Тест",
      "Подпись сцены: Что дальше",
      "Тон: #a7abeb",
    ],
    node: (
      <Toast008
        corner="top-left"
        offset="Тест"
        hintText="Что дальше"
        tone="#a7abeb"
      />
    ),
  },
  {
    name: "toast-009",
    title: "Сообщение с текстом",
    notes: [
      "Имя: Смена",
      "Ответ: Черновик",
      "Сообщение: Проверка",
      "Время: Черновик",
    ],
    node: (
      <Toast009
        name="Смена"
        replyLabel="Черновик"
        message="Проверка"
        time="Черновик"
      />
    ),
  },
  {
    name: "toast-010",
    title: "Сообщение-пилюля",
    notes: ["Сообщение: Подпись: тест", "Тон: success", "Значок: Тест"],
    node: <Toast010 message="Подпись: тест" tone="success" glyph="Тест" />,
  },
  {
    name: "toast-011",
    title: "Колода сообщений",
    notes: [
      "Подпись закрытия: Подпись: тест",
      "Пустое состояние: Подпись: тест",
      "Скрытые карточки: Проверка",
    ],
    node: (
      <Toast011
        closeLabel="Подпись: тест"
        emptyLabel="Подпись: тест"
        behindText="Проверка"
      />
    ),
  },
  {
    name: "toast-012",
    title: "Сообщение с автопрогрессом",
    notes: [
      "Длительность, мс: 1127",
      "Подпись отмены: Смена",
      "Заголовок: Проверка",
      "Подпись хода: Черновик",
      "Тон: #3c77b3",
    ],
    node: (
      <Toast012
        duration={1127}
        cancelLabel="Смена"
        title="Проверка"
        loadingText="Черновик"
        tone="#3c77b3"
      />
    ),
  },
  {
    name: "toast-013",
    title: "Сообщение с возвратом",
    notes: [
      "Секунд на отмену: 7",
      "Цвет кольца: #877b61",
      "Сообщение: Что дальше",
      "После возврата: Черновик",
      "Подпись кнопки: Что дальше",
      "Отсчёт: Смена",
      "Время вышло: Проверка",
    ],
    node: (
      <Toast013
        seconds={7}
        tone="#877b61"
        message="Что дальше"
        returnedMessage="Черновик"
        returnLabel="Что дальше"
        countdownText="Смена"
        expiredText="Проверка"
      />
    ),
  },
  {
    name: "toast-014",
    title: "Выбор угла показа",
    notes: [
      "Угол по умолчанию: top-right",
      "Акцент: #95f290",
      "Текст уведомления: Смена",
      "Подпись крестика: Подпись: тест",
      "Подпись переключателя: Подпись: тест",
      "Подпись сцены: Смена",
      "Подпись снизу: Что дальше",
    ],
    node: (
      <Toast014
        defaultCorner="top-right"
        tone="#95f290"
        message="Смена"
        closeLabel="Подпись: тест"
        pickerLabel="Подпись: тест"
        stageHint="Смена"
        legendLabel="Что дальше"
      />
    ),
  },
  {
    name: "toast-015",
    title: "Сообщение с ответом",
    notes: [
      "Акцент: #73317d",
      "Имя: Смена",
      "Сообщение: Черновик",
      "Подпись ответа: Подпись: тест",
      "Подпись крестика: Проверка",
      "Уточнение крестика: Что дальше",
    ],
    node: (
      <Toast015
        accent="#73317d"
        name="Смена"
        message="Черновик"
        replyLabel="Подпись: тест"
        closeLabel="Проверка"
        closeContext="Что дальше"
      />
    ),
  },
  {
    name: "toast-016",
    title: "Состояние соединения",
    notes: [
      "Задержка стадии, мс: 1422",
      "Скрыть через, мс: 3787",
      "Текст обрыва: Что дальше",
      "Текст попытки: Что дальше",
      "Текст возврата: Проверка",
      "Подсказка обрыва: Черновик",
      "Подсказка попытки: Подпись: тест",
      "Подсказка возврата: Смена",
    ],
    node: (
      <Toast016
        reconnectAfter={1422}
        hideAfter={3787}
        offlineText="Что дальше"
        reconnectingText="Что дальше"
        onlineText="Проверка"
        offlineHint="Черновик"
        reconnectingHint="Подпись: тест"
        onlineHint="Смена"
      />
    ),
  },
  {
    name: "toast-017",
    title: "Сообщение с опасным выбором",
    notes: [
      "Тон опасности: #4ccab2",
      "Заголовок: Проверка",
      "Объяснение: Что дальше",
      "Подпись отказа: Что дальше",
      "Подпись удаления: Черновик",
      "Итог: оставлено: Смена",
      "Итог: удалено: Проверка",
    ],
    node: (
      <Toast017
        danger="#4ccab2"
        title="Проверка"
        message="Что дальше"
        keepLabel="Что дальше"
        deleteLabel="Черновик"
        keptResult="Смена"
        deletedResult="Проверка"
      />
    ),
  },
  {
    name: "toast-018",
    title: "Сгруппированные сообщения",
    notes: [
      "Видимых пунктов: 2",
      "Акцент: #6bbea4",
      "Заголовок группы: Проверка",
      "Подпись раскрытия: Черновик",
      "Подпись сворачивания: Проверка",
      "Подпись крестика: Смена",
      "Пустой список: Что дальше",
    ],
    node: (
      <Toast018
        visibleCount={2}
        accent="#6bbea4"
        groupTitle="Проверка"
        expandLabel="Черновик"
        collapseLabel="Проверка"
        closeLabel="Смена"
        emptyText="Что дальше"
      />
    ),
  },
  {
    name: "toast-019",
    title: "Файл готов",
    notes: [
      "Длительность подготовки, мс: 5379",
      "Цвет полосы: #03e0b1",
      "Имя файла: Подпись: тест",
      "Размер файла: Что дальше",
      "Подпись подготовки: Смена",
      "Подпись готовности: Смена",
      "Подпись ссылки: Черновик",
      "Подпись отмены: Что дальше",
    ],
    node: (
      <Toast019
        durationMs={5379}
        tone="#03e0b1"
        fileName="Подпись: тест"
        fileSize="Что дальше"
        exportingLabel="Смена"
        readyLabel="Смена"
        downloadLabel="Черновик"
        cancelledLabel="Что дальше"
      />
    ),
  },
  {
    name: "toast-020",
    title: "Сообщение с отсчётом",
    notes: [
      "Секунд до автодействия: 111",
      "Акцент: #dff8ef",
      "Текст предупреждения: Проверка",
      "Текст после истечения: Черновик",
      "Подпись продления: Проверка",
      "Подпись крестика: Черновик",
      "Приписка паузы: Подпись: тест",
    ],
    node: (
      <Toast020
        seconds={111}
        tone="#dff8ef"
        message="Проверка"
        expiredMessage="Черновик"
        extendLabel="Проверка"
        closeLabel="Черновик"
        pausedText="Подпись: тест"
      />
    ),
  },
  {
    name: "toast-021",
    title: "Пилюля по центру",
    notes: [
      "Тон: success",
      "Автоскрытие, мс: 752",
      "Текст: Подпись: тест",
      "Значок: Тест",
      "Подпись крестика: Проверка",
      "Подпись повтора: Подпись: тест",
      "Подпись сцены: Смена",
    ],
    node: (
      <Toast021
        tone="success"
        autoHideMs={752}
        message="Подпись: тест"
        glyph="Тест"
        closeLabel="Проверка"
        replayLabel="Подпись: тест"
        stageHint="Смена"
      />
    ),
  },
  {
    name: "toast-022",
    title: "Сообщение с подавлением",
    notes: [
      "Заголовок: Автосохранение включено",
      "Подпись подавления: Не напоминать",
      "Тон: #2a9d8f",
    ],
    node: (
      <Toast022
        title="Автосохранение включено"
        muteLabel="Не напоминать"
        tone="#2a9d8f"
      />
    ),
  },
  {
    name: "toast-023",
    title: "Сводка ошибок формы",
    notes: [
      "Заголовок: Осталось полей: {count}",
      "Подпись перехода: К первой ошибке",
      "Цвет отказа: #c1121f",
    ],
    node: (
      <Toast023
        titleTemplate="Осталось полей: {count}"
        firstLabel="К первой ошибке"
        danger="#c1121f"
      />
    ),
  },
  {
    name: "toast-024",
    title: "Несколько фоновых задач",
    notes: [
      "Заголовок: Обработка: {done} из {total}",
      "Шаг, мс: 700",
      "Подпись разворота: Подробности",
      "Тон: #7c5cff",
    ],
    node: (
      <Toast024
        titleTemplate="Обработка: {done} из {total}"
        stepMs={700}
        expandLabel="Подробности"
        tone="#7c5cff"
      />
    ),
  },
]