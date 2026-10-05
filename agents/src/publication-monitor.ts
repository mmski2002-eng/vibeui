export interface PublicationRequirement { url: string; referralUrl: string; market: "ru" | "en"; erid?: string | null }
export interface PublicationResult { reachable: boolean; referralPresent: boolean; disclosurePresent: boolean; eridPresent: boolean; status: "passed" | "failed" }

export async function checkPublication(input: PublicationRequirement): Promise<PublicationResult> {
  const response = await fetch(input.url, { headers: { "user-agent": "VibeUI-Publication-Monitor/1.0" }, redirect: "follow", signal: AbortSignal.timeout(20_000) });
  if (!response.ok) return { reachable: false, referralPresent: false, disclosurePresent: false, eridPresent: false, status: "failed" };
  const body = (await response.text()).toLowerCase();
  const referralPresent = body.includes(input.referralUrl.toLowerCase()) || body.includes(new URL(input.referralUrl).pathname.toLowerCase());
  const disclosurePresent = input.market === "ru" ? body.includes("реклама") : /sponsored|affiliate|commission|paid partnership/.test(body);
  const eridPresent = input.market !== "ru" || Boolean(input.erid && body.includes(input.erid.toLowerCase()));
  return { reachable: true, referralPresent, disclosurePresent, eridPresent, status: referralPresent && disclosurePresent && eridPresent ? "passed" : "failed" };
}
