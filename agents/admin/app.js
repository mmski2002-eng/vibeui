import { views } from "./views.js";

const POLL_MS = 10_000;
const state = { route: null, params: {}, timer: null, rendering: false };

export const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function safeUrl(value) {
  try {
    const url = new URL(String(value));
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch { return null; }
}

export function extLink(value, label) {
  const url = safeUrl(value);
  if (!url) return esc(value ?? "—");
  return `<a class="link wrap" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label ?? url)}</a>`;
}

export const fmt = {
  usd(value, digits = 4) { return value == null ? "—" : `$${Number(value).toFixed(digits)}`; },
  num(value) { return value == null ? "—" : Number(value).toLocaleString("ru-RU"); },
  date(value) { return value ? new Date(value).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"; },
  day(value) { return value ? new Date(value).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—"; },
  ago(value) {
    if (!value) return "—";
    const seconds = Math.round((Date.now() - new Date(value).getTime()) / 1000);
    if (seconds < 60) return "только что";
    if (seconds < 3600) return `${Math.round(seconds / 60)} мин назад`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} ч назад`;
    return `${Math.round(seconds / 86400)} дн назад`;
  },
};

const tones = {
  ok: ["completed", "normal", "active", "eligible", "passed", "sent", "delivered", "created", "idle", "approved", "interested"],
  warn: ["queued", "paused", "dry_run", "review", "draft", "pending", "degraded", "scored", "needs_review", "blocked", "asks_price", "asks_details"],
  danger: ["failed", "emergency_stop", "do_not_contact", "declined", "unsubscribe", "complained", "bounced", "critical", "cancelled"],
  info: ["running", "sending", "researched", "new", "info"],
};
const labels = {
  normal: "Норма", degraded: "Есть проблемы", paused: "Рассылка на паузе", emergency_stop: "АВАРИЙНАЯ ОСТАНОВКА",
};
export function pill(value) {
  if (value == null || value === "") return '<span class="pill">—</span>';
  const key = String(value);
  const tone = Object.entries(tones).find(([, list]) => list.includes(key) || list.some((item) => key.startsWith(`${item}:`) || key.startsWith(`classified:${item}`)))?.[0] ?? "";
  return `<span class="pill ${tone}">${esc(labels[key] ?? key)}</span>`;
}

export function table(columns, rows, options = {}) {
  if (!rows?.length) return `<div class="empty">${esc(options.empty ?? "Пока пусто")}</div>`;
  const head = columns.map((column) => `<th class="${column.num ? "num" : ""}">${esc(column.label)}</th>`).join("");
  const body = rows.map((row) => {
    const href = options.href?.(row);
    const attrs = href ? ` class="clickable" data-href="${esc(href)}" tabindex="0"` : "";
    return `<tr${attrs}>${columns.map((column) => `<td class="${column.num ? "num" : ""} ${column.cls ?? ""}">${column.render ? column.render(row) : esc(row[column.key] ?? "—")}</td>`).join("")}</tr>`;
  }).join("");
  return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

export function card(title, body, extra = "") {
  return `<section class="card">${title ? `<div class="card-head"><h2>${esc(title)}</h2>${extra}</div>` : ""}${body}</section>`;
}

export function kpi(label, value, hint = "", accent = false) {
  return `<div class="card kpi${accent ? " accent" : ""}"><div class="label">${esc(label)}</div><div class="value">${value}</div>${hint ? `<div class="hint">${hint}</div>` : ""}</div>`;
}

export function json(value) {
  return `<pre class="json">${esc(JSON.stringify(value, null, 2))}</pre>`;
}

export async function api(path) {
  const response = await fetch(relative(path), { headers: { accept: "application/json" }, cache: "no-store" });
  if (!response.ok) throw new Error(`${response.status} ${path}`);
  return response.json();
}

async function post(path, body) {
  const response = await fetch(relative(path), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);
  return data;
}

export function toast(message, isError = false) {
  const element = document.createElement("div");
  element.className = `toast${isError ? " error" : ""}`;
  element.setAttribute("role", "status");
  element.textContent = message;
  document.body.append(element);
  setTimeout(() => element.remove(), 3500);
}

const dialog = () => document.getElementById("confirm-dialog");
function confirmAction({ title, text, danger = false, askReason = false, confirmLabel = "Подтвердить" }) {
  const element = dialog();
  element.querySelector("#confirm-title").textContent = title;
  element.querySelector("#confirm-text").textContent = text;
  element.querySelector("#confirm-reason-field").hidden = !askReason;
  element.querySelector("#confirm-reason").value = "";
  const ok = element.querySelector("#confirm-ok");
  ok.textContent = confirmLabel;
  ok.className = `btn ${danger ? "danger" : "primary"}`;
  element.returnValue = "";
  element.showModal();
  return new Promise((resolve) => {
    element.addEventListener("close", () => resolve(element.returnValue === "confirm" ? { reason: element.querySelector("#confirm-reason").value.trim() } : null), { once: true });
  });
}

const actionTexts = {
  mark_sent_manually: { title: "Отмечено как отправленное вручную?", text: "Письмо считается отправленным сейчас: попадёт в статистику, автоматическая отправка для него отменяется." },
  review_message: { title: "Текст проверен?", text: "Только пометка для вас. Письмо остаётся черновиком и не ставится в очередь отправки." },
  approve_all_messages: { title: "Согласовать все черновики?", text: "Все черновики на email уйдут в очередь отправки. Отправляется не больше дневного лимита, остальные уйдут в следующие дни. Черновики в Telegram остаются для ручной отправки." },
  approve_message: { title: "Одобрить письмо?", text: "Email уйдёт сам в пределах дневного лимита. Текст для Telegram отправьте вручную и нажмите «Отправлено вручную»." },
  do_not_contact: { title: "Запретить контакт?", text: "Блогер попадёт в глобальный do_not_contact. Все его задания в очереди будут отменены немедленно во всех кампаниях.", danger: true, askReason: true, confirmLabel: "Запретить" },
  cancel_job: { title: "Отменить задание?", text: "Задание будет отменено и не выполнится." },
  retry_job: { title: "Повторить задание?", text: "Даётся одна дополнительная попытка. Внешние действия защищены идемпотентностью и не повторятся." },
};

const controlTexts = {
  pause: { title: "Остановить рассылку?", text: "Новые письма и follow-up не будут отправляться." },
  resume: { title: "Разрешить рассылку?", text: "Снимает паузу в БД. Отправка остаётся заблокирована policy-файлом и dry-run статусом кампаний, пока их не включат отдельно.", danger: true },
  "pause-partnerships": { title: "Пауза партнёров?", text: "Создание партнёров будет запрещено." },
  "resume-partnerships": { title: "Разрешить создание партнёров?", text: "Агент сможет создавать партнёров по одобренным предложениям.", danger: true },
  "pause-payouts": { title: "Пауза выплат?", text: "Выплаты будут заблокированы." },
  "resume-payouts": { title: "Разрешить выплаты?", text: "Снимает блокировку выплат.", danger: true },
  "pause-models": { title: "Остановить модельные операции?", text: "Scoring, черновики и классификация ответов перестанут вызывать LLM." },
  "resume-models": { title: "Разрешить модельные операции?", text: "Если жёсткий лимит расходов достигнут, worker снова поставит паузу." },
  stop: { title: "Остановить все агенты?", text: "Emergency stop: worker перестанет брать любые задания, рассылка остановится. Снимается только вручную.", danger: true, confirmLabel: "Остановить всё" },
  "clear-stop": { title: "Снять emergency stop?", text: "Агенты продолжат безопасные задачи: поиск, анализ, отчёты. Рассылка останется на паузе.", danger: true },
};

export async function runAction(action, id) {
  const texts = actionTexts[action];
  const answer = await confirmAction(texts);
  if (!answer) return;
  try {
    const result = await post("/api/action", { action, id, reason: answer.reason || undefined });
    toast(result.approved !== undefined ? `Согласовано писем: ${result.approved}` : "Готово");
    await refresh();
  } catch (error) {
    toast(`Ошибка: ${error.message}`, true);
  }
}

async function runControl(action) {
  const answer = await confirmAction(controlTexts[action]);
  if (!answer) return;
  try {
    await post("/api/control", { action });
    toast("Режим изменён");
    await refreshShell();
    await refresh();
  } catch (error) {
    toast(`Ошибка: ${error.message}`, true);
  }
}

const statusTone = { normal: "ok", degraded: "warn", paused: "warn", emergency_stop: "danger" };
let shellState = null;
export const getShellState = () => shellState;

async function refreshShell() {
  try {
    shellState = await api("/api/overview");
  } catch {
    document.getElementById("system-status").className = "pill danger";
    document.getElementById("system-status").textContent = "нет связи";
    return;
  }
  const { status, control } = shellState;
  const statusElement = document.getElementById("system-status");
  statusElement.className = `pill ${statusTone[status] ?? ""}`;
  statusElement.textContent = labels[status] ?? status;
  const toggle = (name, paused, label) => `<button class="btn sm${paused ? " on" : ""}" data-control="${paused ? "resume" : "pause"}-${name}" aria-pressed="${paused}">${esc(label)}: ${paused ? "пауза" : "вкл"}</button>`;
  document.getElementById("controls").innerHTML = [
    `<button class="btn sm${control.outreach_paused ? " on" : ""}" data-control="${control.outreach_paused ? "resume" : "pause"}" aria-pressed="${control.outreach_paused}">Рассылка: ${control.outreach_paused ? "пауза" : "вкл"}</button>`,
    toggle("partnerships", control.partnerships_paused, "Партнёры"),
    toggle("payouts", control.payouts_paused, "Выплаты"),
    toggle("models", control.model_operations_paused, "LLM"),
    control.emergency_stop
      ? '<button class="btn sm ghost-danger" data-control="clear-stop">Снять стоп</button>'
      : '<button class="btn sm danger" data-control="stop">Стоп всё</button>',
  ].join("");
}

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "") || "dashboard";
  const [path, query = ""] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  let route = parts[0];
  let id = parts[1] ?? null;
  if (route === "settings") { route = `settings/${parts[1] ?? "policies"}`; id = null; }
  return { route, id, query: new URLSearchParams(query) };
}

export function setQuery(params) {
  const { route, id } = parseHash();
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value));
  const next = `#/${route}${id ? `/${id}` : ""}${query.size ? `?${query}` : ""}`;
  if (location.hash !== next) history.replaceState(null, "", next);
  refresh();
}

async function navigate() {
  const { route, id, query } = parseHash();
  const view = views[route];
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("menu-toggle").setAttribute("aria-expanded", "false");
  document.querySelectorAll(".nav a").forEach((link) => {
    const target = link.getAttribute("href").slice(2);
    if (target === route) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
  });
  if (!view) {
    document.getElementById("page-title").textContent = "Не найдено";
    document.getElementById("toolbar").innerHTML = "";
    document.getElementById("view").innerHTML = '<div class="empty">Такого раздела нет</div>';
    return;
  }
  state.route = route;
  document.getElementById("page-title").textContent = view.title(id);
  document.getElementById("page-subtitle").textContent = view.subtitle ?? "";
  document.title = `${view.title(id)} · VibeUI Agents`;
  const toolbar = document.getElementById("toolbar");
  toolbar.innerHTML = view.toolbar && !id ? view.toolbar(Object.fromEntries(query)) : "";
  toolbar.querySelectorAll("input, select").forEach((input) => {
    let timer;
    input.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => setQuery(Object.fromEntries([...toolbar.querySelectorAll("[name]")].map((field) => [field.name, field.value.trim()]))), 300);
    });
  });
  document.getElementById("view").innerHTML = '<div class="empty">Загрузка…</div>';
  await refresh();
  document.getElementById("content").focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

export async function refresh() {
  if (state.rendering) return;
  const { route, id, query } = parseHash();
  const view = views[route];
  if (!view) return;
  state.rendering = true;
  try {
    const html = await view.render({ id, query: Object.fromEntries(query) });
    if (parseHash().route !== route) return;
    const container = document.getElementById("view");
    container.innerHTML = html;
    container.querySelectorAll("[data-w]").forEach((element) => { element.style.width = `${Math.max(0, Math.min(100, Number(element.dataset.w)))}%`; });
    container.querySelectorAll("[data-h]").forEach((element) => { element.style.height = `${Math.max(0, Math.min(100, Number(element.dataset.h)))}%`; });
    container.querySelectorAll("[data-h]").forEach((element) => { element.style.height = `${Math.max(0, Math.min(100, Number(element.dataset.h)))}%`; });
    document.getElementById("updated").textContent = `Обновлено ${new Date().toLocaleTimeString("ru-RU")}`;
  } catch (error) {
    document.getElementById("view").innerHTML = `<div class="empty">Не удалось загрузить: ${esc(error.message)}</div>`;
  } finally {
    state.rendering = false;
  }
}

function bindGlobal() {
  document.addEventListener("click", (event) => {
    const control = event.target.closest("[data-control]");
    if (control) return void runControl(control.dataset.control);
    const edit = event.target.closest("[data-edit]");
    if (edit) return void toggleEdit(edit.dataset.edit, true);
    const cancel = event.target.closest("[data-edit-cancel]");
    if (cancel) return void toggleEdit(cancel.dataset.editCancel, false);
    const action = event.target.closest("[data-action]");
    if (action) { event.stopPropagation(); return void runAction(action.dataset.action, action.dataset.id); }
    const row = event.target.closest("tr[data-href]");
    if (row && !event.target.closest("a, button")) location.hash = row.dataset.href;
  });
  document.addEventListener("submit", async (event) => {
    const contactForm = event.target.closest("[data-contact-form]");
    if (contactForm) {
      event.preventDefault();
      const data = new FormData(contactForm);
      try {
        const result = await post("/api/contact", { creatorId: contactForm.dataset.contactForm, kind: data.get("kind"), value: data.get("value"), sourceUrl: data.get("sourceUrl") });
        toast(result.draftsQueued ? `Контакт добавлен, черновиков в очереди: ${result.draftsQueued}` : "Контакт добавлен");
        await refresh();
      } catch (error) {
        toast(`Ошибка: ${error.message}`, true);
      }
      return;
    }
    const settingForm = event.target.closest("[data-setting]");
    if (settingForm) {
      event.preventDefault();
      try {
        const result = await post("/api/control", { action: settingForm.dataset.setting, value: new FormData(settingForm).get("value") });
        toast(result.promoted !== undefined ? `Сохранено. В письма добавлено ${result.promoted}, убрано ${result.demoted}` : "Сохранено");
        await refresh();
      } catch (error) {
        toast(`Ошибка: ${error.message}`, true);
      }
      return;
    }
    const mailForm = event.target.closest("[data-mail-form]");
    if (mailForm) {
      event.preventDefault();
      const data = new FormData(mailForm);
      const button = mailForm.querySelector("[type=submit]");
      button.disabled = true;
      try {
        await post("/api/mail/send", { account: mailForm.dataset.mailForm, to: data.get("to"), subject: data.get("subject"), text: data.get("text") });
        toast("Письмо отправлено");
        location.hash = `#/mail?${new URLSearchParams({ account: mailForm.dataset.mailForm, box: "sent" })}`;
      } catch (error) {
        button.disabled = false;
        toast(`Ошибка: ${error.message}`, true);
      }
      return;
    }
    const form = event.target.closest("[data-message-form]");
    if (!form) return;
    event.preventDefault();
    const data = new FormData(form);
    try {
      await post("/api/message", { id: form.dataset.messageForm, subject: data.get("subject"), body: data.get("body") });
      toast("Сохранено");
      await refresh();
    } catch (error) {
      toast(`Ошибка: ${error.message}`, true);
    }
  });
  document.addEventListener("keydown", (event) => {
    const row = event.target.closest?.("tr[data-href]");
    if (row && event.key === "Enter") location.hash = row.dataset.href;
  });
  document.getElementById("menu-toggle").addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const open = sidebar.classList.toggle("open");
    document.getElementById("menu-toggle").setAttribute("aria-expanded", String(open));
  });
  window.addEventListener("hashchange", navigate);
}

function toggleEdit(id, open) {
  const form = document.querySelector(`[data-message-form="${CSS.escape(id)}"]`);
  const body = document.querySelector(`[data-message-body="${CSS.escape(id)}"]`);
  if (!form || !body) return;
  form.hidden = !open;
  body.hidden = open;
  if (open) form.querySelector("textarea").focus();
}

function poll() {
  clearInterval(state.timer);
  state.timer = setInterval(async () => {
    if (document.hidden || dialog().open || document.querySelector("[data-message-form]:not([hidden]), [data-mail-form]")) return;
    const active = document.activeElement;
    if (active && ["INPUT", "SELECT", "TEXTAREA"].includes(active.tagName) && document.getElementById("view").contains(active)) return;
    await refreshShell();
    await refresh();
  }, POLL_MS);
}

bindGlobal();
await refreshShell();
await navigate();
poll();

// The panel is served under a path prefix (/agents/) behind nginx, so API calls resolve against the page URL.
function relative(path) {
  return path.replace(/^\//, "");
}
