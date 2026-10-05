import assert from "node:assert/strict";
import test from "node:test";
import { checkPublication } from "../src/publication-monitor.js";

test("passes an English publication with referral link and disclosure", async () => {
  const html = encodeURIComponent("Sponsored by VibeUI. I receive a commission. https://vibeui.club/r/demo");
  const result = await checkPublication({ url: `data:text/html,${html}`, referralUrl: "https://vibeui.club/r/demo", market: "en" });
  assert.equal(result.status, "passed");
});

test("requires erid for a Russian publication", async () => {
  const html = encodeURIComponent("Реклама https://vibeui.ru/r/demo");
  const result = await checkPublication({ url: `data:text/html,${html}`, referralUrl: "https://vibeui.ru/r/demo", market: "ru", erid: "ERID-123" });
  assert.equal(result.status, "failed");
  assert.equal(result.eridPresent, false);
});
