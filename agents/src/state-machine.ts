const transitions = {
  new: ["researched", "rejected", "blocked"], researched: ["scored", "rejected", "blocked"],
  scored: ["eligible", "rejected", "blocked"], eligible: ["queued", "blocked", "do_not_contact"],
  queued: ["sent", "blocked", "do_not_contact"], sent: ["replied", "follow_up_due", "do_not_contact", "blocked"],
  replied: ["interested", "declined", "do_not_contact", "blocked"], interested: ["agreed", "declined", "blocked"],
  follow_up_due: ["sent", "blocked", "do_not_contact"], agreed: ["partner_created", "blocked"],
  partner_created: ["published", "blocked"], published: ["paid", "blocked"],
  rejected: [], declined: [], paid: [], blocked: [], do_not_contact: [],
} as const;
export type WorkflowState = keyof typeof transitions;
export function canTransition(from: WorkflowState, to: WorkflowState): boolean { return (transitions[from] as readonly string[]).includes(to); }
export function assertTransition(from: WorkflowState, to: WorkflowState): void { if (!canTransition(from, to)) throw new Error(`Invalid workflow transition: ${from} -> ${to}`); }
