import { CatalogShell } from "@/components/catalog/catalog-shell"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "ru",
  path: "/legal/privacy",
  title: "Политика обработки персональных данных",
  description:
    "Какие данные собирает VibeUI, зачем они нужны и как долго хранятся.",
})

export default function PrivacyPage() {
  return (
    <CatalogShell locale="ru">
      <main className="text-shell-muted mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-12 text-sm leading-relaxed lg:px-6">
        <h1 className="text-shell-fg text-3xl font-semibold tracking-tight">
          Политика обработки персональных данных
        </h1>
        <p>
          Оператор — самозанятый, владелец сервиса VibeUI. Вопросы по обработке
          персональных данных: <a className="text-shell-fg underline" href="mailto:mmski2002@gmail.com">mmski2002@gmail.com</a>,
          +7&nbsp;909&nbsp;358-13-67.
        </p>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">Какие данные собираем</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>адрес электронной почты и имя (если не указали — присвоим автоматически);</li>
            <li>дату и версию принятых оферты и настоящей политики;</li>
            <li>язык интерфейса, на котором создан аккаунт;</li>
            <li>сведения о подписке и оплатах (факт, сумма, статус) и историю расхода месячного лимита;</li>
            <li>при обращении в поддержку — текст обращения и адрес почты;</li>
            <li>технические данные для защиты от злоупотреблений (обезличенный отпечаток IP).</li>
          </ul>
          <p>
            Данные банковской карты и криптокошелька к нам не поступают — оплату
            проводят платёжные провайдеры на своей стороне.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">Цели обработки</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>регистрация и ведение аккаунта;</li>
            <li>доступ к библиотеке компонентов и учёт лимита копирований;</li>
            <li>оформление и продление подписки;</li>
            <li>ответы на обращения в поддержку.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">Правовая основа и место хранения</h2>
          <p>
            Обработка ведётся по ФЗ-152 «О персональных данных» и ФЗ-149 «Об
            информации, информационных технологиях и о защите информации».
            Данные хранятся на сервере на территории Российской Федерации.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">Сроки хранения</h2>
          <p>
            Пока существует аккаунт и пока данные нужны для указанных целей.
            Удаляются по запросу или при удалении аккаунта; сведения об оплатах
            хранятся в срок, установленный законом для расчётов и отчётности.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">Передача третьим лицам</h2>
          <p>
            Платёжным провайдерам — только для проведения оплаты. Иным лицам
            данные не передаются, кроме случаев, прямо предусмотренных законом.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">Ваши права</h2>
          <p>
            Вы можете запросить доступ к своим данным, их исправление или
            удаление и отозвать согласие — письмом на{" "}
            <a className="text-shell-fg underline" href="mailto:mmski2002@gmail.com">mmski2002@gmail.com</a>.
          </p>
        </section>
      </main>
    </CatalogShell>
  )
}
