import { CatalogShell } from "@/components/catalog/catalog-shell"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "ru",
  path: "/legal/offer",
  title: "Оферта",
  description: "Публичный договор на доступ к библиотеке компонентов VibeUI.",
})

export default function OfferPage() {
  return (
    <CatalogShell locale="ru">
      <main className="text-shell-muted mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-12 text-sm leading-relaxed lg:px-6">
        <h1 className="text-shell-fg text-3xl font-semibold tracking-tight">
          Публичная оферта
        </h1>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">1. Общие положения</h2>
          <p>
            Настоящий документ — публичная оферта самозанятого Садкова Евгения
            Александровича (далее «Исполнитель») о предоставлении доступа к
            платным возможностям сервиса VibeUI (vibeui.ru). Оплата тарифа
            означает полное и безоговорочное принятие условий оферты (акцепт);
            с этого момента договор считается заключённым.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">2. Предмет</h2>
          <p>
            Исполнитель предоставляет доступ к возможностям PRO: снятие
            месячного лимита копирований, закрытые блоки, анимации и сценарии,
            персональный ключ для установки из реестра. Каталог, живые превью и
            поиск доступны бесплатно и без регистрации.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">3. Цена и оплата</h2>
          <p>
            Актуальные цены указаны на странице{" "}
            <a className="text-shell-fg underline" href="/pricing">тарифов</a>.
            Оплата принимается банковской картой или через СБП сервисом ЮKassa;
            данные карты Исполнителю не передаются. Оплата разовая за выбранный
            период (месяц или год).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">4. Срок и активация</h2>
          <p>
            Доступ активируется после подтверждения оплаты и действует до конца
            оплаченного периода. Автопродления нет: по окончании периода тариф
            становится бесплатным, оплатить снова можно в любой момент из
            кабинета.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">5. Возврат</h2>
          <p>
            Возврат производится по заявлению на почту Исполнителя{" "}
            <a className="text-shell-fg underline" href="mailto:mmski2002@gmail.com">mmski2002@gmail.com</a>{" "}
            тем же способом, которым была произведена оплата. Сумма возврата за
            неиспользованный период определяется по соглашению сторон и в
            соответствии с законодательством РФ.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">6. Персональные данные</h2>
          <p>
            Обрабатываются в соответствии с{" "}
            <a className="text-shell-fg underline" href="/legal/privacy">Политикой обработки персональных данных</a>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">7. Ответственность</h2>
          <p>
            Сервис предоставляется «как есть». Ответственность Исполнителя
            ограничена суммой оплаты за текущий период; за упущенную выгоду
            Исполнитель не отвечает.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">8. Реквизиты Исполнителя</h2>
          <p>
            Самозанятый Садков Евгений Александрович · ИНН 732894935375 ·{" "}
            <a className="text-shell-fg underline" href="mailto:mmski2002@gmail.com">mmski2002@gmail.com</a> · +7 909 358-13-67.
          </p>
        </section>

        <p className="text-shell-muted/70 text-xs">Редакция от 20 сентября 2026 г.</p>
      </main>
    </CatalogShell>
  )
}
