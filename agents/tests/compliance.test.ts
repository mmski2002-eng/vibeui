import assert from "node:assert/strict";
import test from "node:test";
import { evaluateFirstContact } from "../src/compliance.js";
import { policySchema } from "../src/policy.js";

const policy = policySchema.parse({
  version: 1, outreachEnabled: true, minimumAutomaticScore: 80, dailyContactLimit: 20,
  maximumFollowUps: 2, followUpDelayDays: 4, secondFollowUpDelayDays: 9,
  allowedPlatforms: { ru: ["telegram"], en: ["youtube"] },
  requirePublicBusinessContact: true, requireHumanApprovalFor: ["first_contact"],
  blockedContactDomains: [], monthlyModelBudgetUsd: 50, monthlyOutreachBudgetUsd: 0,
  discovery: { youtube: { ru: [], en: [] }, rutube: [], habrHubs: [], devtoTags: [], telegramQueries: [] },
});
const candidate = { id: "1", market: "ru" as const, platform: "telegram" as const, score: 90,
  contact: "public@example.com", contactIsPublicBusiness: true, doNotContact: false, previousContacts: 0 };
const context = { contactsToday: 0, humanApproved: true };

test("allows a fully compliant approved first contact", () => {
  assert.deepEqual(evaluateFirstContact(candidate, policy, { emergencyStop: false, outreachPaused: false }, context), { allowed: true, reason: "allowed" });
});
test("emergency stop overrides every other condition", () => {
  assert.equal(evaluateFirstContact(candidate, policy, { emergencyStop: true, outreachPaused: false }, context).reason, "emergency_stop");
});
test("requires human approval and a public business contact", () => {
  assert.equal(evaluateFirstContact(candidate, policy, { emergencyStop: false, outreachPaused: false }, { ...context, humanApproved: false }).reason, "human_approval_required");
  assert.equal(evaluateFirstContact({ ...candidate, contactIsPublicBusiness: false }, policy, { emergencyStop: false, outreachPaused: false }, context).reason, "contact_not_verified_as_public_business");
});
