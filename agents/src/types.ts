import type { Platform } from "./policy.js";

export type Market = "ru" | "en";

export interface CandidateForContact {
  id: string;
  market: Market;
  platform: Platform;
  score: number | null;
  contact: string | null;
  contactIsPublicBusiness: boolean;
  doNotContact: boolean;
  previousContacts: number;
}

export interface ControlState {
  emergencyStop: boolean;
  outreachPaused: boolean;
}

export interface ContactContext {
  contactsToday: number;
  humanApproved: boolean;
}
