import { api, card, esc, extLink, fmt, json, kpi, pill, table } from "./app.js";

const marketLabel = { ru: "RU · vibeui.ru", en: "EN · vibeui.club" };
const select = (name, value, options) => `<select name="${name}" aria-label="${esc(options[0][1])}">${options.map(([key, label]) => `<option value="${esc(key)}"${key === (value ?? "") ? " selected" : ""}>${esc(label)}</option>`).join("")}</select>`;
const search = (value, placeholder) => `<input type="search" name="q" value="${esc(value ?? "")}" placeholder="${esc(placeholder)}" aria-label="${esc(placeholder)}">`;
const query = (params) => { const value = new URLSearchParams(Object.entries(params).filter(([, item]) => item)); return value.size ? `?${value}` : ""; };
const meter = (part, total) => `<div class="meter${total && part / total >= 0.8 ? " danger" : ""}"><span data-w="${total ? (part / total) * 100 : 0}"></span></div>`;
const short = (value, length = 120) => { const text = String(value ?? ""); return text.length > length ? `${text.slice(0, length)}…` : text; };
const actionButton = (action, id, label, cls = "") => `<button class="btn sm ${cls}" data-action="${action}" data-id="${esc(id)}">${esc(label)}</button>`;

const scoreParts = [
  ["topicFit", "Тематика", 30], ["builderAudience", "Аудитория билдеров", 20], ["realReach", "Реальный охват", 15],
  ["engagementQuality", "Вовлечённость", 10], ["practicalDemos", "Практические демо", 10], ["publishingRegularity", "Регулярность", 5],
  ["allowedContact", "Разрешённый контакт", 5], ["moderateAdLoad", "Умеренная реклама", 5],
];

function spendingCards(spending) {
  const openRouter = spending.openRouter;
  const remaining = openRouter ? (openRouter.error ? "ошибка" : openRouter.remaining == null ? "без лимита" : fmt.usd(openRouter.remaining)) : "нет ключа";
  const openRouterHint = openRouter && !openRouter.error ? `потрачено ${fmt.usd(openRouter.usage)}${openRouter.limit != null ? ` из ${fmt.usd(openRouter.limit, 2)}` : ""}` : esc(openRouter?.error ?? "");
  return `<div class="grid kpis">
    ${kpi("Остаток на ключе OpenRouter", remaining, `${openRouterHint}${openRouter?.limit ? meter(openRouter.usage ?? 0, openRouter.limit) : ""}`, true)}
    ${kpi("Потрачено агентами", fmt.usd(spending.total), `сегодня ${fmt.usd(spending.today)} · месяц ${fmt.usd(spending.month)}`)}
    ${kpi("До жёсткого лимита", fmt.usd(spending.hardBudgetRemaining), `лимит ${fmt.usd(spending.hardBudget, 2)}${meter(spending.total, spending.hardBudget)}`)}
  </div>`;
}

const runColumns = [
  { label: "Агент", render: (row) => esc(row.agent_name) },
  { label: "Статус", render: (row) => pill(row.status) },
  { label: "Итог", render: (row) => esc(short(row.error ?? row.output_summary ?? "—", 90)), cls: "wrap" },
  { label: "$", num: true, render: (row) => row.cost_usd == null ? "—" : fmt.usd(row.cost_usd, 5) },
  { label: "Начало", render: (row) => `<span class="nowrap">${fmt.date(row.started_at)}</span>` },
];

export const views = {
  dashboard: {
    title: () => "Дашборд",
    subtitle: "Состояние системы, воронка и расходы",
    async render() {
      const data = await api("/api/overview");
      const { counts: c, control, jobs, funnel } = data;
      const banner = {
        emergency_stop: ["danger", "Аварийная остановка", "Worker не берёт задания, рассылка остановлена. Снимается кнопкой «Снять стоп»."],
        degraded: ["warn", "Есть проблемы", "Ошибки или критичные уведомления за последние 24 часа, либо LLM на паузе."],
        paused: ["warn", "Рассылка на паузе", "Поиск, анализ и черновики работают. Письма не отправляются."],
        normal: ["ok", "Система работает", "Все флаги в рабочем положении."],
      }[data.status];
      const flags = [
        ["Рассылка", control.outreach_paused], ["Партнёры", control.partnerships_paused],
        ["Выплаты", control.payouts_paused], ["LLM", control.model_operations_paused],
      ].map(([label, paused]) => `<span class="pill ${paused ? "warn" : "ok"}">${label}: ${paused ? "пауза" : "вкл"}</span>`).join(" ");
      const replyRate = c.sent ? `${Math.round((c.replied_threads / c.sent) * 100)}%` : "—";
      return `
        <div class="status-banner ${banner[0]}"><strong>${banner[1]}</strong><span class="muted">${banner[2]}</span><span>${flags}</span>${control.reason ? `<span class="small muted">Причина: ${esc(control.reason)}</span>` : ""}</div>
        <div class="grid kpis">
          ${kpi("Кандидаты", fmt.num(c.creators), `сегодня +${fmt.num(c.creators_today)}`)}
          ${kpi("Прошли фильтр", fmt.num(c.eligible), "score ≥ 80, без флагов")}
          ${kpi("Черновики", fmt.num(c.drafts), "ждут проверки")}
          ${kpi("Отправлено", fmt.num(c.sent), `сегодня ${fmt.num(c.sent_today)}`)}
          ${kpi("Ответы", fmt.num(c.replied_threads), `доля ответов ${replyRate}`)}
          ${kpi("Активные переговоры", fmt.num(c.active_threads))}
          ${kpi("Партнёры", fmt.num(c.partners))}
          ${kpi("Публикации за 7 дней", fmt.num(c.publications_week))}
          ${kpi("Ошибки 24 ч", fmt.num(c.errors_24h), `блокировок ${fmt.num(c.blocked_24h)} · критичных ${fmt.num(c.critical_24h)}`)}
        </div>
        ${spendingCards(data.spending)}
        <div class="grid cols-2">
          ${card("Воронка партнёров", funnel.error ? `<div class="empty">Нет связи с VibeUI: ${esc(funnel.error)}</div>` : `<dl class="kv">
            <dt>Ссылок выдано</dt><dd>${fmt.num(funnel.invites)}</dd><dt>Блогеров зарегистрировалось</dt><dd>${fmt.num(funnel.claimed)}</dd>
            <dt>Переходы по ссылкам</dt><dd>${fmt.num(funnel.visits)}</dd><dt>Регистрации зрителей</dt><dd>${fmt.num(funnel.registrations)}</dd>
            <dt>Оплаты</dt><dd>${fmt.num(funnel.payments)}</dd>
            ${(funnel.revenue ?? []).map((row) => `<dt>Выручка, ${esc(row.currency)}</dt><dd>${fmt.num(row.amount)} · комиссия ${fmt.num(row.commission)}</dd>`).join("") || "<dt>Выручка</dt><dd>0</dd>"}
            </dl>`)}
          ${card("Очередь", `<dl class="kv">${["queued", "running", "failed", "completed", "cancelled"].map((status) => `<dt>${pill(status)}</dt><dd>${fmt.num(jobs[status] ?? 0)}</dd>`).join("")}</dl>`, '<a class="link small" href="#/queue">Открыть</a>')}
        </div>
        <div class="grid cols-2 section">
          ${card("Последние запуски", table(runColumns, data.recentRuns, { href: (row) => `#/runs/${row.id}`, empty: "Запусков ещё не было" }), '<a class="link small" href="#/runs">Все</a>')}
          ${card("Уведомления", table([
            { label: "Уровень", render: (row) => pill(row.severity) },
            { label: "Событие", render: (row) => esc(row.title), cls: "wrap" },
            { label: "Когда", render: (row) => fmt.ago(row.created_at) },
          ], data.notifications, { empty: "Уведомлений нет" }))}
        </div>`;
    },
  },

  agents: {
    title: () => "Агенты",
    subtitle: "Что делает каждый агент сейчас",
    async render() {
      const agents = await api("/api/agents");
      return `<div class="grid cols-3">${agents.map((agent) => `
        <section class="card agent-card">
          <div class="card-head"><h2>${esc(agent.title)}</h2><span class="state">${pill(agent.state)}</span></div>
          <p class="small muted">${esc(agent.description)}</p>
          <dl class="kv small">
            <dt>Выполняется</dt><dd>${fmt.num(agent.running)}</dd>
            <dt>В очереди</dt><dd>${fmt.num(agent.queued)}</dd>
            <dt>За 24 ч</dt><dd>${fmt.num(agent.completed24h)} ок · ${fmt.num(agent.failed24h)} ошибок</dd>
            <dt>Упавшие задания</dt><dd>${fmt.num(agent.failedJobs)}</dd>
            <dt>Вызовы LLM</dt><dd>${fmt.num(agent.modelCalls)} · ${fmt.usd(agent.costUsd)}</dd>
            <dt>Последний запуск</dt><dd>${agent.lastRun ? `${fmt.ago(agent.lastRun.last_started)} ${pill(agent.lastRun.last_status)}` : "—"}</dd>
            <dt>Последнее действие</dt><dd>${agent.lastAction ? `${esc(agent.lastAction.last_action)} · ${pill(agent.lastAction.decision)} · ${fmt.ago(agent.lastAction.created_at)}` : "—"}</dd>
          </dl>
          ${agent.lastRun?.last_error ? `<p class="small wrap"><span class="muted">Последняя ошибка:</span> ${esc(short(agent.lastRun.last_error, 200))}</p>` : ""}
          ${agent.runNames.length ? `<a class="link small" href="#/runs${query({ agent: agent.runNames[0] })}">Запуски агента</a>` : ""}
        </section>`).join("")}</div>`;
    },
  },

  runs: {
    title: (id) => id ? "Запуск" : "Запуски",
    subtitle: "Журнал запусков агентов: модель, токены, стоимость, итог",
    toolbar: (params) => `<div class="toolbar">
      ${select("agent", params.agent, [["", "Все агенты"], ["creator_scorer", "Scoring"], ["candidate_scorer", "Scoring (legacy)"], ["personalization_agent", "Personalization"], ["reply_agent", "Reply"]])}
      ${select("status", params.status, [["", "Все статусы"], ["running", "running"], ["completed", "completed"], ["failed", "failed"], ["blocked", "blocked"]])}
    </div>`,
    async render({ id, query: params }) {
      if (id) {
        const { run, job, usage } = await api(`/api/runs/${id}`);
        return `<p><a class="link" href="#/runs">← Все запуски</a></p>
          <div class="grid cols-2">
            ${card("Запуск", `<dl class="kv">
              <dt>ID</dt><dd class="mono">${esc(run.id)}</dd><dt>Агент</dt><dd>${esc(run.agent_name)}</dd>
              <dt>Статус</dt><dd>${pill(run.status)}</dd><dt>Модель</dt><dd>${esc(run.model ?? "—")}</dd>
              <dt>Вход</dt><dd>${esc(run.input_summary ?? "—")}</dd><dt>Итог</dt><dd>${esc(run.output_summary ?? "—")}</dd>
              <dt>Ошибка</dt><dd>${esc(run.error ?? "—")}</dd>
              <dt>Начало</dt><dd>${fmt.date(run.started_at)}</dd><dt>Конец</dt><dd>${fmt.date(run.finished_at)}</dd></dl>`)}
            ${card("Задание", job ? `<dl class="kv"><dt>Тип</dt><dd>${esc(job.kind)}</dd><dt>Статус</dt><dd>${pill(job.status)}</dd>
              <dt>Попытки</dt><dd>${job.attempts}/${job.max_attempts}</dd><dt>Ошибка</dt><dd>${esc(job.last_error ?? "—")}</dd></dl>
              <h3 class="section">Входные данные</h3>${json(job.payload)}` : '<div class="empty">Без задания</div>')}
          </div>
          <div class="section">${card("Токены и стоимость", table([
            { label: "Модель", key: "model" }, { label: "Вход", num: true, render: (row) => fmt.num(row.input_tokens) },
            { label: "Кэш", num: true, render: (row) => fmt.num(row.cached_input_tokens) }, { label: "Выход", num: true, render: (row) => fmt.num(row.output_tokens) },
            { label: "$", num: true, render: (row) => fmt.usd(row.cost_usd, 6) },
          ], usage, { empty: "Модель не вызывалась или запуск упал до ответа" }))}</div>
          <p class="small muted">Внутренние рассуждения модели не сохраняются. Обоснование решения — в итоге запуска и в карточке объекта.</p>`;
      }
      const rows = await api(`/api/runs${query({ agent: params.agent, status: params.status })}`);
      return card("", table(runColumns, rows, { href: (row) => `#/runs/${row.id}`, empty: "Запусков нет" }));
    },
  },

  queue: {
    title: () => "Очередь",
    subtitle: "Задания worker. Retry не повторяет внешний эффект: письма и партнёры защищены идемпотентностью",
    toolbar: (params) => `<div class="toolbar">
      ${select("status", params.status, [["", "Все статусы"], ["queued", "queued"], ["running", "running"], ["failed", "failed"], ["completed", "completed"], ["cancelled", "cancelled"]])}
      ${select("kind", params.kind, [["", "Все типы"], ["score_creator", "score_creator"], ["personalize_thread", "personalize_thread"], ["send_message", "send_message"], ["classify_reply", "classify_reply"], ["create_partner", "create_partner"], ["monitor_publication", "monitor_publication"], ["sync_partner_stats", "sync_partner_stats"]])}
    </div>`,
    async render({ query: params }) {
      const rows = await api(`/api/queue${query({ status: params.status, kind: params.kind })}`);
      return card("", table([
        { label: "Задание", render: (row) => `${esc(row.kind)}<div class="small muted mono">${esc(Object.values(row.payload ?? {}).join(", "))}</div>` },
        { label: "Статус", render: (row) => pill(row.status) },
        { label: "Попытки", render: (row) => `${row.attempts}/${row.max_attempts}` },
        { label: "Следующий запуск", render: (row) => row.status === "queued" ? `<span class="nowrap">${fmt.date(row.available_at)}</span>` : "—" },
        { label: "Исполнитель", render: (row) => esc(row.locked_by ?? "—"), cls: "small" },
        { label: "Ошибка", render: (row) => esc(short(row.last_error ?? "", 140)), cls: "wrap small" },
        { label: "", render: (row) => row.status === "queued" ? actionButton("cancel_job", row.id, "Отменить") : row.status === "failed" ? actionButton("retry_job", row.id, "Повторить") : "" },
      ], rows, { empty: "Очередь пуста" }));
    },
  },

  creators: {
    title: (id) => id ? "Блогер" : "Блогеры",
    subtitle: "База кандидатов: оценка, флаги, контакты, статус",
    toolbar: (params) => `<div class="toolbar">
      ${search(params.q, "Имя или URL профиля")}
      ${select("market", params.market, [["", "Все рынки"], ["ru", "RU · vibeui.ru"], ["en", "EN · vibeui.club"]])}
      ${select("status", params.status, [["", "Все статусы"], ["researched", "researched"], ["scored", "scored"], ["eligible", "eligible"], ["sent", "sent"], ["partner_created", "partner_created"], ["do_not_contact", "do_not_contact"]])}
      ${select("platform", params.platform, [["", "Все площадки"], ["youtube", "YouTube"], ["telegram", "Telegram"], ["vk", "VK"], ["habr", "Habr"], ["x", "X"], ["newsletter", "Newsletter"], ["website", "Сайт"]])}
    </div>`,
    async render({ id, query: params }) {
      if (id) return creatorCard(id);
      const rows = await api(`/api/creators${query(params)}`);
      return card("", table([
        { label: "Имя", render: (row) => `<strong>${esc(row.display_name)}</strong><div class="small">${extLink(row.profile_url, row.platform)}</div>` },
        { label: "Рынок", render: (row) => esc(marketLabel[row.market] ?? row.market) },
        { label: "Подписчики", num: true, render: (row) => fmt.num(row.followers) },
        { label: "Медиана", num: true, render: (row) => fmt.num(row.median_views) },
        { label: "Score", num: true, render: (row) => row.score == null ? "—" : `<strong>${row.score}</strong>${row.score_valid === false ? ' <span class="small muted">невалид.</span>' : ""}` },
        { label: "Флаги", render: (row) => Array.isArray(row.red_flags) && row.red_flags.length ? `<span class="pill danger">${row.red_flags.length}</span>` : "—" },
        { label: "Контакт", render: (row) => row.contact_source ? extLink(row.contact_source, "источник") : '<span class="muted">нет</span>' },
        { label: "Статус", render: (row) => pill(row.do_not_contact ? "do_not_contact" : row.status) },
        { label: "Контакт был", render: (row) => fmt.date(row.last_contact_at) },
      ], rows, { href: (row) => `#/creators/${row.id}`, empty: "Блогеров пока нет" }));
    },
  },

  conversations: {
    title: (id) => id ? "Переписка" : "Переписки",
    subtitle: "Черновики, отправленные письма и ответы",
    toolbar: (params) => `<div class="toolbar">${select("state", params.state, [["", "Все стадии"], ["queued", "queued"], ["sent", "sent"], ["interested", "interested"], ["asks_price", "asks_price"], ["asks_details", "asks_details"], ["declined", "declined"], ["unsubscribe", "unsubscribe"], ["do_not_contact", "do_not_contact"]])}</div>`,
    async render({ id, query: params }) {
      if (id) {
        const { thread, messages } = await api(`/api/conversations/${id}`);
        return `<p><a class="link" href="#/conversations">← Все переписки</a></p>
          <div class="grid cols-2">
            ${card(thread.display_name, `<dl class="kv"><dt>Стадия</dt><dd>${pill(thread.state)}</dd><dt>Кампания</dt><dd>${esc(thread.campaign)}</dd>
              <dt>Канал</dt><dd>${esc(thread.channel)}</dd><dt>Контакт</dt><dd>${esc(thread.contact)} · ${extLink(thread.contact_source, "источник")}</dd>
              <dt>Follow-up</dt><dd>${thread.follow_up_count}</dd><dt>Следующее действие</dt><dd>${fmt.date(thread.next_action_at)}</dd></dl>`,
              `<a class="link small" href="#/creators/${esc(thread.creator_id)}">Карточка</a>`)}
            ${card("Защиты", `<ul class="list small"><li>Первое письмо требует ручного одобрения.</li><li>Перед отправкой повторно проверяются policy, пауза, лимит, do_not_contact и emergency stop.</li><li>К письму автоматически добавляется отказ от рассылки.</li></ul>
              ${thread.do_not_contact ? '<p><span class="pill danger">do_not_contact</span></p>' : actionButton("do_not_contact", thread.creator_id, "Запретить контакт", "ghost-danger")}`)}
          </div>
          <div class="section">${messages.map(messageBlock).join("") || '<div class="empty">Сообщений нет</div>'}</div>`;
      }
      const rows = await api(`/api/conversations${query({ state: params.state })}`);
      return card("", table([
        { label: "Блогер", render: (row) => `<strong>${esc(row.display_name)}</strong><div class="small muted">${esc(marketLabel[row.market] ?? row.market)}</div>` },
        { label: "Стадия", render: (row) => pill(row.state) },
        { label: "Последнее", render: (row) => `${esc(short(row.subject ?? "—", 80))}<div class="small">${pill(row.last_status)} ${esc(row.last_direction ?? "")}</div>`, cls: "wrap" },
        { label: "Сообщений", num: true, render: (row) => fmt.num(row.messages) },
        { label: "Когда", render: (row) => fmt.date(row.last_at ?? row.updated_at) },
      ], rows, { href: (row) => `#/conversations/${row.id}`, empty: "Переписок пока нет. Черновики появятся после scoring и подготовки писем." }));
    },
  },

  campaigns: {
    title: () => "Кампании",
    subtitle: "Новая кампания стартует в dry run: поиск, оценка и черновики без отправки",
    async render() {
      const rows = await api("/api/campaigns");
      return `<div class="grid cols-2">${rows.map((row) => card(row.name, `
        <p>${pill(row.status)} <span class="pill brand">${esc(row.domain)}</span> <span class="pill">${esc(row.language)}</span></p>
        <dl class="kv small">
          <dt>Мин. score</dt><dd>${row.minimum_score}</dd><dt>Лимит в день</dt><dd>${row.daily_limit}</dd>
          <dt>Кандидаты</dt><dd>${fmt.num(row.creators)} · прошли фильтр ${fmt.num(row.eligible)}</dd>
          <dt>Переписки</dt><dd>${fmt.num(row.threads)} · отправлено ${fmt.num(row.sent)}</dd>
          <dt>Бюджет LLM</dt><dd>${fmt.usd(row.spent_month)} из ${fmt.usd(row.model_budget_usd, 2)} в месяц${meter(row.spent_month, row.model_budget_usd)}</dd>
          <dt>Темы</dt><dd>${esc((row.target_topics ?? []).join(", "))}</dd>
          <dt>Запросы</dt><dd>${esc((row.search_queries ?? []).join(", "))}</dd>
          <dt>Площадки</dt><dd>${esc((row.allowed_platforms ?? []).join(", "))}</dd>
          <dt>Период</dt><dd>${fmt.day(row.starts_at)} — ${fmt.day(row.ends_at)}</dd>
        </dl>`)).join("")}</div>
        <p class="small muted">Перевод кампании в active делается только после dry run на 500 кандидатах и проверки 100 черновиков.</p>`;
    },
  },

  partners: {
    title: () => "Партнёры",
    subtitle: "Реферальные коды, промокоды и статистика",
    async render() {
      const rows = await api("/api/partners");
      return card("", table([
        { label: "Партнёр", render: (row) => `<a class="link" href="#/creators/${esc(row.creator_id)}">${esc(row.display_name)}</a><div class="small muted">${esc(marketLabel[row.market] ?? row.market)}</div>` },
        { label: "Статус", render: (row) => pill(row.status) },
        { label: "Реф. код", render: (row) => `<span class="mono">${esc(row.referral_code ?? "—")}</span>` },
        { label: "Промокод", render: (row) => `<span class="mono">${esc(row.promo_code ?? "—")}</span>` },
        { label: "Публикации", num: true, render: (row) => fmt.num(row.publications) },
        { label: "Переходы", num: true, render: (row) => fmt.num(row.visits) },
        { label: "Регистрации", num: true, render: (row) => fmt.num(row.registrations) },
        { label: "Установки", num: true, render: (row) => fmt.num(row.installations) },
        { label: "Оплаты", num: true, render: (row) => fmt.num(row.payments) },
        { label: "Комиссия", num: true, render: (row) => fmt.num(row.commission) },
      ], rows, { empty: "Партнёров пока нет. Создание партнёров заблокировано до готовности закрытого API VibeUI." }));
    },
  },

  publications: {
    title: () => "Публикации",
    subtitle: "Проверки ссылки, disclosure и erid",
    async render() {
      const rows = await api("/api/publications");
      const check = (value) => value == null ? "—" : value ? '<span class="pill ok">да</span>' : '<span class="pill danger">нет</span>';
      return card("", table([
        { label: "Публикация", render: (row) => `${extLink(row.url, short(row.url, 50))}<div class="small muted">${esc(row.display_name)} · ${esc(row.platform)}</div>` },
        { label: "Статус", render: (row) => pill(row.status) },
        { label: "Доступна", render: (row) => check(row.reachable) },
        { label: "Реф. ссылка", render: (row) => check(row.referral_present) },
        { label: "Disclosure", render: (row) => check(row.disclosure_present) },
        { label: "erid", render: (row) => row.erid_required ? `${check(row.erid_present)} <span class="mono small">${esc(row.erid ?? "")}</span>` : '<span class="muted">не нужен</span>' },
        { label: "Проверено", render: (row) => fmt.date(row.checked_at ?? row.last_checked_at) },
      ], rows, { empty: "Публикаций пока нет" }));
    },
  },

  finance: {
    title: () => "Финансы",
    subtitle: "Стоимость LLM по дням, моделям, агентам и кампаниям",
    toolbar: (params) => `<div class="toolbar">${select("days", params.days, [["", "30 дней"], ["7", "7 дней"], ["90", "90 дней"], ["365", "Год"]])}</div>`,
    async render({ query: params }) {
      const data = await api(`/api/finance${query({ days: params.days })}`);
      const max = Math.max(...data.byDay.map((row) => row.cost_usd), 0);
      const tokenColumns = [
        { label: "Вызовы", num: true, render: (row) => fmt.num(row.calls) },
        { label: "Вход", num: true, render: (row) => fmt.num(row.input_tokens) },
        { label: "Кэш", num: true, render: (row) => fmt.num(row.cached_input_tokens) },
        { label: "Выход", num: true, render: (row) => fmt.num(row.output_tokens) },
        { label: "$", num: true, render: (row) => fmt.usd(row.cost_usd, 5) },
      ];
      const forecast = (() => {
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        return data.spending.month / now.getDate() * daysInMonth;
      })();
      return `${spendingCards(data.spending)}
        <div class="grid kpis">
          ${kpi("Прогноз до конца месяца", fmt.usd(forecast), "по текущему темпу")}
          ${kpi("Месячный бюджет policy", fmt.usd(data.monthlyModelBudgetUsd, 2), `потрачено ${fmt.usd(data.spending.month)}${meter(data.spending.month, data.monthlyModelBudgetUsd)}`)}
          ${kpi("Выручка партнёров", fmt.num(data.revenue.revenue), `комиссии ${fmt.num(data.revenue.commission)}`)}
        </div>
        ${card(`Расход по дням · ${data.days} дн.`, data.byDay.length ? `<div class="chart" role="img" aria-label="Расход по дням">${data.byDay.map((row) => `<div class="col" title="${esc(row.day)}: ${fmt.usd(row.cost_usd, 5)}, ${row.calls} вызовов"><span class="b" data-h="${max ? (row.cost_usd / max) * 100 : 0}"></span><small>${esc(row.day.slice(5))}</small></div>`).join("")}</div>` : '<div class="empty">Расходов за период нет</div>')}
        <div class="grid cols-2 section">
          ${card("По моделям", table([{ label: "Модель", key: "model" }, ...tokenColumns], data.byModel, { empty: "Нет вызовов" }))}
          ${card("По кампаниям", table([
            { label: "Кампания", render: (row) => `${esc(row.name)} <span class="small muted">${esc(row.market)}</span>` },
            { label: "$", num: true, render: (row) => fmt.usd(row.cost_usd, 5) },
            { label: "Бюджет", num: true, render: (row) => fmt.usd(row.budget, 2) },
          ], data.byCampaign))}
        </div>
        <div class="section">${card("По агентам", table([{ label: "Агент", key: "agent_name" }, { label: "Модель", key: "model" }, ...tokenColumns], data.byAgent, { empty: "Нет вызовов" }))}</div>
        <div class="section">${card("Выплаты", table([
          { label: "Статус", render: (row) => pill(row.status) }, { label: "Валюта", key: "currency" },
          { label: "Заявок", num: true, render: (row) => fmt.num(row.count) }, { label: "Сумма", num: true, render: (row) => fmt.num(row.amount) },
        ], data.payouts, { empty: "Выплат нет. Автоматические выплаты отключены." }))}</div>`;
    },
  },

  compliance: {
    title: () => "Compliance",
    subtitle: "Нарушения, блокировки, отписки",
    async render() {
      const data = await api("/api/compliance");
      return `<div class="grid kpis">
          ${kpi("Публикации без проверки", fmt.num(data.failedPublications.length))}
          ${kpi("Открытые нарушения", fmt.num(data.checks.length))}
          ${kpi("Заблокированные действия", fmt.num(data.blocked.length))}
          ${kpi("do_not_contact", fmt.num(data.doNotContact.length))}
        </div>
        <div class="grid cols-2">
          ${card("Заблокированные действия", table([
            { label: "Действие", render: (row) => `${esc(row.action)}<div class="small muted">${esc(row.actor)}</div>` },
            { label: "Причина", render: (row) => `<span class="pill warn">${esc(row.reason ?? "—")}</span>` },
            { label: "Когда", render: (row) => fmt.date(row.created_at) },
          ], data.blocked, { empty: "Блокировок не было" }))}
          ${card("Критичные уведомления", table([
            { label: "Событие", render: (row) => `${esc(row.title)}<div class="small muted">${esc(row.kind)}</div>` },
            { label: "Когда", render: (row) => fmt.date(row.created_at) },
          ], data.critical, { empty: "Критичных событий нет" }))}
        </div>
        <div class="grid cols-2 section">
          ${card("Публикации: ссылка, disclosure, erid", table([
            { label: "Публикация", render: (row) => `${extLink(row.url, short(row.url, 40))}<div class="small muted">${esc(row.display_name)}</div>` },
            { label: "Статус", render: (row) => pill(row.status) },
            { label: "erid", render: (row) => `<span class="mono small">${esc(row.erid ?? "—")}</span>` },
          ], data.failedPublications, { empty: "Все публикации проверены" }))}
          ${card("do_not_contact", table([
            { label: "Блогер", render: (row) => esc(row.display_name ?? "контакт") },
            { label: "Причина", render: (row) => esc(row.reason) }, { label: "Источник", render: (row) => esc(row.source) },
            { label: "Когда", render: (row) => fmt.date(row.created_at) },
          ], data.doNotContact, { empty: "Список пуст" }))}
        </div>
        <div class="section">${card("Открытые проверки", table([
          { label: "Правило", key: "rule" }, { label: "Результат", render: (row) => pill(row.result) },
          { label: "Объект", render: (row) => `${esc(row.object_type)} <span class="mono small">${esc(row.object_id)}</span>` },
          { label: "Доказательство", render: (row) => `<span class="mono small wrap">${esc(short(JSON.stringify(row.evidence), 160))}</span>` },
        ], data.checks, { empty: "Открытых проверок нет" }))}</div>`;
    },
  },

  audit: {
    title: () => "Аудит",
    subtitle: "Неизменяемый журнал действий агентов и администратора",
    toolbar: (params) => `<div class="toolbar">
      ${search(params.q, "Действие, объект или причина")}
      ${select("decision", params.decision, [["", "Все решения"], ["completed", "completed"], ["blocked", "blocked"], ["failed", "failed"]])}
      ${select("actor", params.actor, [["", "Все исполнители"], ["administrator", "Администратор"], ["creator_scorer", "Scoring"], ["personalization_agent", "Personalization"], ["outreach_agent", "Outreach"], ["reply_agent", "Reply"], ["partner_agent", "Partner"]])}
    </div>`,
    async render({ query: params }) {
      const rows = await api(`/api/audit${query({ q: params.q, decision: params.decision, actor: params.actor, limit: "200" })}`);
      return card("", table([
        { label: "Когда", render: (row) => `<span class="nowrap">${fmt.date(row.created_at)}</span>` },
        { label: "Исполнитель", render: (row) => esc(row.actor), cls: "small" },
        { label: "Действие", render: (row) => esc(row.action) },
        { label: "Решение", render: (row) => pill(row.decision) },
        { label: "Объект", render: (row) => row.target_type === "creator" ? `<a class="link" href="#/creators/${esc(row.target_id)}">блогер</a>` : `<span class="small">${esc(row.target_type ?? "—")}</span> <span class="mono small muted">${esc(short(row.target_id ?? "", 13))}</span>` },
        { label: "Причина / детали", render: (row) => `${esc(row.reason ?? "")} <span class="mono small muted wrap">${esc(short(JSON.stringify(row.details ?? {}) === "{}" ? "" : JSON.stringify(row.details), 140))}</span>`, cls: "wrap" },
      ], rows, { empty: "Записей нет" }));
    },
  },

  "settings/policies": {
    title: () => "Политики",
    subtitle: "Действующий policy-файл. Изменение — через файл в репозитории с ревью и деплоем",
    async render() {
      const { path, policy } = await api("/api/settings/policies");
      if (!policy) return '<div class="empty">Policy-файл не прочитан</div>';
      const yesNo = (value) => value ? '<span class="pill danger">включено</span>' : '<span class="pill ok">выключено</span>';
      return `<div class="grid cols-2">
          ${card("Ключевые ограничения", `<dl class="kv">
            <dt>Версия</dt><dd>${esc(policy.version)}</dd>
            <dt>Отправка</dt><dd>${yesNo(policy.outreachEnabled)}</dd>
            <dt>Мин. score</dt><dd>${esc(policy.minimumAutomaticScore)}</dd>
            <dt>Писем в день</dt><dd>${esc(policy.dailyContactLimit)}</dd>
            <dt>Follow-up</dt><dd>до ${esc(policy.maximumFollowUps)}, через ${esc(policy.followUpDelayDays)} и ${esc(policy.secondFollowUpDelayDays)} дн.</dd>
            <dt>Только business-контакт</dt><dd>${policy.requirePublicBusinessContact ? "да" : "нет"}</dd>
            <dt>Ручное одобрение</dt><dd>${esc((policy.requireHumanApprovalFor ?? []).join(", "))}</dd>
            <dt>Бюджет LLM / мес</dt><dd>${fmt.usd(policy.monthlyModelBudgetUsd, 2)}</dd>
          </dl>`)}
          ${card("Разрешённые площадки", `<dl class="kv"><dt>RU</dt><dd>${esc((policy.allowedPlatforms?.ru ?? []).join(", "))}</dd><dt>EN</dt><dd>${esc((policy.allowedPlatforms?.en ?? []).join(", "))}</dd></dl>`)}
        </div>
        <div class="section">${card("Файл", `<p class="small muted mono">${esc(path)}</p>${json(policy)}`)}</div>`;
    },
  },

  "settings/integrations": {
    title: () => "Интеграции",
    subtitle: "Что подключено. Значения ключей не показываются",
    async render() {
      const data = await api("/api/settings/integrations");
      return `<div class="grid cols-2">
        ${card("Подключения", table([
          { label: "Интеграция", key: "name" }, { label: "Назначение", key: "purpose", cls: "small" },
          { label: "Статус", render: (row) => row.configured ? '<span class="pill ok">настроено</span>' : '<span class="pill warn">нет</span>' },
        ], data.integrations))}
        ${card("Модели", `<dl class="kv"><dt>Scoring и ответы</dt><dd class="mono">${esc(data.models.scoring)}</dd><dt>Черновики</dt><dd class="mono">${esc(data.models.generation)}</dd><dt>Жёсткий лимит</dt><dd>${fmt.usd(data.models.hardBudgetUsd, 2)}</dd></dl>`)}
      </div>`;
    },
  },
};

function messageBlock(message) {
  const draft = message.direction === "outbound" && message.status === "draft";
  const facts = Array.isArray(message.facts) && message.facts.length
    ? `<ul class="facts small">${message.facts.map((fact) => `<li>${esc(fact.claim)} — ${extLink(fact.sourceUrl, "источник")}</li>`).join("")}</ul>` : "";
  return `<article class="message ${message.direction}">
    <div class="card-head"><div><strong>${esc(message.subject ?? (message.direction === "inbound" ? "Ответ" : "Письмо"))}</strong>
      <div class="small muted">${message.direction === "inbound" ? "входящее" : "исходящее"} · ${esc(message.kind)} · ${message.model ? esc(message.model) : ""} · ${fmt.date(message.sent_at ?? message.received_at ?? message.created_at)}</div></div>
      <div class="message-actions">${pill(message.status)}${draft && message.reviewed_at ? ` ${pill("passed")} <span class="small muted">текст проверен</span>` : ""}${draft ? ` <button class="btn sm" data-edit="${esc(message.id)}" aria-label="Редактировать текст" title="Редактировать">✎</button>${message.reviewed_at ? "" : ` ${actionButton("review_message", message.id, "Текст проверен")}`} ${actionButton("mark_sent_manually", message.id, "Отправлено вручную")} ${actionButton("approve_message", message.id, "Одобрить", "primary")}` : ""}</div></div>
    <div class="message-body" data-message-body="${esc(message.id)}">${esc(message.body)}</div>
    ${draft ? `<form class="message-edit" data-message-form="${esc(message.id)}" hidden>
      <label class="field"><span class="small muted">Тема</span><input name="subject" maxlength="160" value="${esc(message.subject ?? "")}" required></label>
      <label class="field"><span class="small muted">Текст</span><textarea name="body" rows="14" maxlength="5000" required>${esc(message.body)}</textarea></label>
      <div class="message-actions"><button class="btn sm primary" type="submit">Сохранить</button> <button class="btn sm" type="button" data-edit-cancel="${esc(message.id)}">Отмена</button></div>
    </form>` : ""}
    ${facts ? `<div class="small muted section">Использованные факты:</div>${facts}` : ""}
  </article>`;
}

async function creatorCard(id) {
  const data = await api(`/api/creators/${id}`);
  const { creator } = data;
  const score = data.scores[0];
  const details = score?.details ?? {};
  const flags = Array.isArray(details.redFlags) ? details.redFlags : [];
  return `<p><a class="link" href="#/creators">← Все блогеры</a></p>
    <div class="status-banner ${creator.do_not_contact ? "danger" : ""}">
      <strong>${esc(creator.display_name)}</strong>
      <span class="muted">${esc(marketLabel[creator.market] ?? creator.market)} · ${esc(creator.language ?? "—")} · ${esc(creator.country ?? "—")}</span>
      ${pill(creator.do_not_contact ? "do_not_contact" : creator.status)}
      ${data.profiles[0] ? extLink(data.profiles[0].profile_url, `${data.profiles[0].platform} ↗`) : ""}
      ${data.threads[0] ? `<a class="btn sm" href="#/conversations/${esc(data.threads[0].id)}">Переписка</a>` : ""}
      <span class="spacer"></span>
      ${creator.do_not_contact ? `<span class="small muted">${esc(creator.blocked_reason ?? "")}</span>` : actionButton("do_not_contact", creator.id, "Do not contact", "ghost-danger")}
    </div>
    <div class="grid cols-2">
      ${card("Оценка", score ? `
        <p><span class="score-big">${score.total}</span> ${score.valid ? '<span class="pill ok">валидна</span>' : '<span class="pill warn">не валидна</span>'} <span class="small muted">${esc(score.model)} · ${fmt.date(score.created_at)}</span></p>
        <div class="score-bars">${scoreParts.map(([key, label, max]) => `<div class="score-row"><span>${label}</span><span class="bar"><span data-w="${((details[key] ?? 0) / max) * 100}"></span></span><span class="small muted">${details[key] ?? 0}/${max}</span></div>`).join("")}</div>
        ${flags.length ? `<h3 class="section">Красные флаги</h3><ul class="list small">${flags.map((flag) => `<li>${esc(flag)}</li>`).join("")}</ul>` : ""}
        <h3 class="section">Обоснование</h3><p class="small">${esc(details.rationale ?? "—")}</p>
        <h3 class="section">Источники</h3><ul class="list small">${(score.evidence_urls ?? []).map((url) => `<li>${extLink(url)}</li>`).join("") || "<li>—</li>"}</ul>`
        : '<div class="empty">Ещё не оценён</div>')}
      <div class="grid">
        ${card("Профили", table([
          { label: "Площадка", render: (row) => extLink(row.profile_url, row.platform) },
          { label: "Подписчики", num: true, render: (row) => fmt.num(row.followers) },
          { label: "Медиана", num: true, render: (row) => fmt.num(row.median_views) },
          { label: "Проверен", render: (row) => fmt.day(row.verified_at) },
        ], data.profiles))}
        ${card("Контакты", table([
          { label: "Контакт", render: (row) => `${esc(row.kind)}: ${esc(row.value)}` },
          { label: "Источник", render: (row) => extLink(row.source_url, "источник") },
          { label: "Business", render: (row) => row.is_public_business ? '<span class="pill ok">да</span>' : '<span class="pill warn">нет</span>' },
        ], data.contacts, { empty: "Подтверждённого контакта нет — письмо не отправится" }) + `
          <form class="contact-form" data-contact-form="${esc(creator.id)}">
            <select name="kind" aria-label="Тип контакта"><option value="email">email</option><option value="telegram">telegram</option></select>
            <input name="value" required placeholder="name@example.com или @username" aria-label="Контакт">
            <input name="sourceUrl" type="url" placeholder="где найден (ссылка, необязательно)" aria-label="Источник">
            <button class="btn sm primary" type="submit">Добавить контакт</button>
          </form>`)}
        ${data.partner ? card("Партнёр", `<dl class="kv"><dt>Статус</dt><dd>${pill(data.partner.status)}</dd><dt>Реф. код</dt><dd class="mono">${esc(data.partner.referral_code ?? "—")}</dd><dt>Промокод</dt><dd class="mono">${esc(data.partner.promo_code ?? "—")}</dd><dt>Ссылка</dt><dd>${extLink(data.partner.referral_url)}</dd></dl>`) : ""}
      </div>
    </div>
    <div class="section">${card("Публикации", table([
      { label: "Публикация", render: (row) => `${extLink(row.url, row.title)}<div class="small muted">${esc(short(row.summary ?? "", 160))}</div>`, cls: "wrap" },
      { label: "Дата", render: (row) => fmt.day(row.published_at) },
      { label: "Просмотры", num: true, render: (row) => fmt.num(row.views) },
    ], data.posts, { empty: "Публикаций нет" }))}</div>
    <div class="section">${card("Коммуникация", data.threads.length ? data.threads.map((thread) => `<p>${pill(thread.state)} <span class="small muted">${esc(thread.campaign)} · ${esc(thread.channel)}</span> <a class="link small" href="#/conversations/${esc(thread.id)}">открыть</a></p>${(thread.messages ?? []).map(messageBlock).join("")}`).join("") : '<div class="empty">Писем ещё не было</div>')}</div>
    <div class="section">${card("История действий", table([
      { label: "Когда", render: (row) => fmt.date(row.created_at) }, { label: "Исполнитель", key: "actor" },
      { label: "Действие", key: "action" }, { label: "Решение", render: (row) => pill(row.decision) }, { label: "Причина", render: (row) => esc(row.reason ?? "—") },
    ], data.actions, { empty: "Действий нет" }))}</div>`;
}
