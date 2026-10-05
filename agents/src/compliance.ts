import type { Policy } from "./policy.js";
import type { CandidateForContact, ContactContext, ControlState } from "./types.js";

export type ContactDecision =
  | { allowed: true; reason: "allowed" }
  | { allowed: false; reason: string };

export function evaluateFirstContact(
  candidate: CandidateForContact,
  policy: Policy,
  control: ControlState,
  context: ContactContext,
): ContactDecision {
  if (control.emergencyStop) return denied("emergency_stop");
  if (control.outreachPaused || !policy.outreachEnabled) return denied("outreach_paused");
  if (candidate.doNotContact) return denied("do_not_contact");
  if (!policy.allowedPlatforms[candidate.market].includes(candidate.platform)) {
    return denied("platform_not_allowed_for_market");
  }
  if (candidate.score === null || candidate.score < policy.minimumAutomaticScore) {
    return denied("score_below_threshold");
  }
  if (!candidate.contact) return denied("missing_contact");
  if (policy.requirePublicBusinessContact && !candidate.contactIsPublicBusiness) {
    return denied("contact_not_verified_as_public_business");
  }
  if (candidate.previousContacts > 0) return denied("already_contacted");
  if (context.contactsToday >= policy.dailyContactLimit) return denied("daily_limit_reached");
  if (policy.requireHumanApprovalFor.includes("first_contact") && !context.humanApproved) {
    return denied("human_approval_required");
  }
  return { allowed: true, reason: "allowed" };
}

function denied(reason: string): ContactDecision {
  return { allowed: false, reason };
}
