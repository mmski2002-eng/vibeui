import assert from "node:assert/strict";
import test from "node:test";
import { stripQuotedReply, unmatchedReplyDedupeKey } from "../src/email/inbound.js";
import { outboundMessageId, plainTextBody } from "../src/email/gmail.js";

test("keeps only the new part of a reply", () => {
  assert.equal(stripQuotedReply("Интересно, какие условия?\n\n5 окт. 2026 г., в 10:00, VibeUI <x@gmail.com> написал:\n> Здравствуйте"), "Интересно, какие условия?");
  assert.equal(stripQuotedReply("Sounds good\n\nOn Mon, Oct 5, 2026 at 10:00 AM VibeUI wrote:\n> Hi"), "Sounds good");
  assert.equal(stripQuotedReply("Интересно, какие условия?\n\nвт, 6 окт. 2026 г. в 12:03, Vibeui Club <vibeuiclub@gmail.com>:\n\n> Здравствуйте"), "Интересно, какие условия?");
  assert.equal(stripQuotedReply("No quote here"), "No quote here");
});

test("decodes plain text from multipart, quoted-printable and base64", () => {
  const multipart = 'Content-Type: multipart/alternative; boundary="b"\r\n\r\n--b\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n=D0=94=D0=B0, =D0=B8=D0=BD=D1=82=D0=B5=D1=80=D0=B5=D1=81=D0=BD=D0=BE\r\n--b\r\nContent-Type: text/html\r\n\r\n<p>x</p>\r\n--b--';
  assert.equal(plainTextBody(multipart), "Да, интересно");
  const base64 = "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" + Buffer.from("Привет").toString("base64");
  assert.equal(plainTextBody(base64), "Привет");
});

test("outbound Message-ID is deterministic per message", () => {
  assert.equal(outboundMessageId("abc", "vibeui.partners@gmail.com"), "<abc.vibeui@gmail.com>");
});

test("unmatched reply notifications are deduplicated by normalized sender", () => {
  assert.equal(unmatchedReplyDedupeKey("Name <USER@Example.com>"), "unmatched_reply:user@example.com");
});
