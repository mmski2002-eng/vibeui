"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

import { ADMIN_TEXTS } from "@/components/admin/texts"
import {
  addReportNote,
  assignReport,
  replyToReport,
  setReportStatus,
} from "@/lib/report-actions"
import type { ReportStatus } from "@/lib/report-types"

/**
 * Разбор обращения: ответ, заметка, статус, «взять себе».
 *
 * Ответ уходит письмом и сохраняется в переписке. Если письмо не ушло, это
 * видно строкой в потоке: администратор должен знать, дошёл ли его ответ.
 */
export function ReportPanel({
  id,
  status,
  assignee,
}: {
  id: string
  status: string
  assignee: string | null
}) {
  const t = ADMIN_TEXTS.reports
  const router = useRouter()
  const [reply, setReply] = useState("")
  const [note, setNote] = useState("")
  const [pending, setPending] = useState<string>()
  const [failed, setFailed] = useState(false)
  const [done, setDone] = useState<string>()

  async function run(name: string, action: () => Promise<unknown>) {
    setPending(name)
    setFailed(false)
    setDone(undefined)

    try {
      await action()
      setDone(t.saved)
      router.refresh()
    } catch {
      setFailed(true)
    } finally {
      setPending(undefined)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="border-shell-border bg-shell-panel acc-shadow acc-reveal rounded-2xl border p-5">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-shell-muted flex items-center gap-2 text-sm">
            {t.setStatus}
            <select
              defaultValue={status}
              onChange={(event) =>
                run("status", () =>
                  setReportStatus({
                    id,
                    status: event.target.value as ReportStatus,
                  }),
                )
              }
              className="border-shell-border bg-shell-elevated text-shell-fg h-10 rounded-lg border px-3 text-sm outline-none"
            >
              {Object.entries(t.status).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          {assignee ? (
            <span className="text-shell-muted text-sm">{t.taken(assignee)}</span>
          ) : (
            <button
              type="button"
              disabled={pending === "assign"}
              onClick={() => run("assign", () => assignReport({ id }))}
              className="acc-press border-shell-border bg-shell-panel text-shell-fg hover:border-shell-accent-line hover:bg-shell-elevated inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium disabled:opacity-60"
            >
              {pending === "assign" ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              {t.take}
            </button>
          )}
        </div>
      </div>

      <div className="border-shell-border bg-shell-panel acc-shadow acc-reveal rounded-2xl border p-5">
        <p className="text-shell-fg text-sm font-medium">{t.reply}</p>
        <p className="text-shell-muted mt-1 text-sm">{t.replyNote}</p>
        <textarea
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          rows={5}
          className="border-shell-border bg-shell-elevated text-shell-fg focus-visible:border-shell-accent focus-visible:ring-shell-ring mt-3 w-full rounded-lg border p-3 text-sm outline-none focus-visible:ring-2"
        />
        <button
          type="button"
          disabled={pending === "reply" || reply.trim().length < 2}
          onClick={() =>
            run("reply", async () => {
              await replyToReport({ id, body: reply })
              setReply("")
            })
          }
          className="acc-press bg-shell-accent text-shell-accent-fg mt-3 inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold hover:bg-shell-accent-deep disabled:opacity-60"
        >
          {pending === "reply" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          {pending === "reply" ? t.sending : t.send}
        </button>
      </div>

      <div className="border-shell-border rounded-2xl border p-5">
        <p className="text-shell-fg text-sm font-medium">{t.note}</p>
        <p className="text-shell-muted mt-1 text-sm">{t.noteNote}</p>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          className="border-shell-border bg-shell-elevated text-shell-fg focus-visible:border-shell-accent focus-visible:ring-shell-ring mt-3 w-full rounded-lg border p-3 text-sm outline-none focus-visible:ring-2"
        />
        <button
          type="button"
          disabled={pending === "note" || note.trim().length < 2}
          onClick={() =>
            run("note", async () => {
              await addReportNote({ id, body: note })
              setNote("")
            })
          }
          className="acc-press border-shell-border bg-shell-panel text-shell-fg hover:border-shell-accent-line hover:bg-shell-elevated mt-3 inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium disabled:opacity-60"
        >
          {pending === "note" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          {t.addNote}
        </button>
      </div>

      {done ? (
        <p role="status" className="text-shell-muted text-sm">
          {done}
        </p>
      ) : null}
      {failed ? (
        <p role="alert" className="text-shell-accent-text text-sm">
          {t.failed}
        </p>
      ) : null}
    </div>
  )
}
