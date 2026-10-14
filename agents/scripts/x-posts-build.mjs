// Builds content/x-posts.json from the plan below and checks every post against X limits and the registry.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE = "https://vibeui.club";
const root = path.resolve(__dirname, "../..");
const kinds = {};
for (const kind of ["components", "animations", "blocks"]) {
  for (const category of fs.readdirSync(path.join(root, "registry", kind))) {
    const file = path.join(root, "registry", kind, category, "registry.json");
    if (!fs.existsSync(file)) continue;
    for (const item of JSON.parse(fs.readFileSync(file, "utf8")).items) kinds[item.name] = kind;
  }
}

const page = (name) => `${SITE}/${kinds[name]}/${name}`;
const install = (name) => `npx shadcn@latest add ${SITE}/r/${name}.json`;
const item = (name, text) => ({ text: text.replace(/\{page\}/g, page(name)).replace(/\{install\}/g, install(name)), shot: `/preview/${name}?theme=dark&lang=en`, item: name });
const site = (shotPath, text) => ({ text, shot: shotPath });
const ready = (day, text) => ({ text, image: `day-${String(day).padStart(2, "0")}.png` });

const posts = [
  ready(1, `The agent keeps redrawing your button until it almost looks right.\n\nVibeUI is a shadcn registry. Copy for AI, then the agent runs:\n\nnpx shadcn@latest add ${SITE}/r/button-001.json\n\nThe file already has accessibility and keyboard support.`),
  ready(2, `Your agent describes a navbar. You get a navbar-shaped div.\n\nVibeUI gives the agent the file.\n${SITE}/components`),
  ready(3, `One command. The component lands in the project with its own palette. Nothing else gets installed.\n\nnpx shadcn@latest add ${SITE}/r/hero-001.json`),
  ready(4, `2000+ items in the registry.\nComponents, full page sections, animations.\nSame install for all of them.\n\n${SITE}`),
  ready(5, `Free account: 20 different components a month.\n\nOpen one, copy the prompt, let the agent install it.\n${SITE}/pricing`),
  ready(6, `This section is already in the registry.\nThe agent installs it. It does not redraw it.\n\n${SITE}/blocks/cta-001`),
  ready(7, `Shipping VibeUI in public.\nThis week: the animation catalog, one file per effect.\n\n${SITE}/animations`),
  ready(8, `A prompt asks the agent to invent a card.\nThe registry gives it the card that is already built.\n\n${SITE}/components/card-001`),
  ready(9, `An animation from the registry.\nOne file. The agent installs that file.\n\n${SITE}/animations/background-005`),
  ready(10, `A whole page, already assembled from registry blocks.\nThe agent installs the sections. It does not redesign them.\n\n${SITE}/scenarios/delivery/demo`),
  ready(11, `The installed file already has keyboard support and accessibility.\nThat work is not left for the agent to invent.\n\n${SITE}`),
  ready(12, `The catalog is public.\n20 components a month are free.\nPaid plans are on the pricing page.\n\n${SITE}/pricing`),
  ready(13, `Which screen is your agent redrawing this week?\nNavbar, pricing, hero, or something else?\n\nThe matching section is probably already in the registry.\n${SITE}/blocks`),
  ready(14, `Asked for a navbar.\nThis one is in the registry.\n\n${SITE}/blocks/navbar-004`),

  item("pricing-002", `Pricing pages are where agents get creative in the wrong way.\n\nThree plans, one recommended, real spacing. Already built:\n{page}`),
  item("command-001", `A command palette with arrow keys, Enter and Escape that actually work.\n\nAsk the agent to install it, not to imagine it:\n{install}`),
  item("hero-002", `Console Hero.\nA terminal-style first screen for dev tools.\n\n{page}`),
  site("/scenarios/saas/demo", `A SaaS landing, section by section, all from the registry.\n\nHero, features, pricing, FAQ, footer. The agent installs each one.\n\n${SITE}/scenarios/saas/demo`),
  item("input-003", `Password field: show/hide, caps lock hint, proper label.\n\nSmall thing. Agents skip half of it every time.\n{page}`),
  item("faq-001", `Sticky FAQ: questions on the left stay in view while answers scroll.\n\n{install}`),
  site("/components", `Tip: give your agent the component file, not a screenshot.\n\nA screenshot gets approximated. A file gets installed.\n\n${SITE}/components`),
  item("surface-002", `Cursor spotlight background.\nOne file, reduced-motion respected, no extra packages.\n\n{page}`),
  item("dialog-002", `Destructive dialog: focus trap, Escape to close, the dangerous button is not the default.\n\n{page}`),
  item("testimonials-001", `Featured testimonials.\nOne big quote, smaller ones around it. Ready to drop in.\n\n{install}`),
  item("table-004", `Sortable table with keyboard focus on the headers.\n\nThe agent installs it and you fill in your data.\n{page}`),
  item("navbar-005", `Shop navbar with search.\nMobile menu included, not left as "TODO".\n\n{page}`),
  item("cursor-002", `Magnetic cursor.\nThe kind of detail you would not prompt your way into.\n\n{page}`),
  site("/pricing", `Every component carries its own palette in CSS variables.\nChange the brand color in one place, the rest follows.\n\n${SITE}/pricing`),
  item("toast-002", `Undo toast.\nDelete, see "Undo", click it, nothing lost. Timer pauses on hover.\n\n{page}`),
  item("about-002", `Timeline history for an About page.\nYears, milestones, responsive from 320px.\n\n{install}`),
  item("calendar-002", `Range picker.\nTwo dates, keyboard navigation, no date library.\n\n{page}`),
  item("hero-003", `Mosaic hero.\nIf your landing needs a grid of shots on the first screen:\n\n{page}`),
  site("/blocks", `How I use it:\n1. Open the block\n2. Copy for AI\n3. Paste into Claude or Cursor\n4. The agent runs one shadcn command\n\nThat's the whole flow.\n${SITE}/blocks`),
  item("combobox-004", `People picker.\nType a name, pick with arrows, see avatars.\n\n{page}`),
  item("cta-004", `Color slab CTA.\nA bold strip before the footer. Just swap the text.\n\n{install}`),
  item("text-001", `Alternating headline swap.\nThe second word rotates. Respects reduced motion.\n\n{page}`),
  item("footer-002", `Four column footer.\nThe boring part of every site. Done once, properly.\n\n{page}`),
  item("otp-003", `OTP field with a resend timer.\nPaste a 6-digit code, it fills every box.\n\n{page}`),
  site("/scenarios/restaurant/demo", `A restaurant site assembled from registry blocks.\nMenu, booking, map, reviews.\n\n${SITE}/scenarios/restaurant/demo`),
  item("chart-001", `Line chart without a chart library.\nSVG, tooltips, works in dark mode.\n\n{page}`),
  item("auth-001", `Sign in screen.\nLabels, errors, password toggle. Wire it to your auth.\n\n{install}`),
  site("/animations", `What is the most redrawn component in your projects?\n\nMine was the pricing table. Now it's one command.\n${SITE}/animations`),
  item("layout-001", `Bento showcase.\nThe grid everyone asks their agent for, already balanced.\n\n{page}`),
  item("stepper-001", `Process stepper.\nDone, current, next. Readable on mobile.\n\n{page}`),
  item("sketch-001", `Hand-drawn button.\nFor when the site should not look like every other SaaS.\n\n{page}`),
  item("subscribe-002", `Newsletter signup with an email preview.\nPeople see what they get before they type.\n\n{install}`),
  item("tree-001", `File tree with arrow-key navigation.\nExpand, collapse, select. No dependencies.\n\n{page}`),
  item("portfolio-002", `Filtered gallery.\nTags on top, smooth reflow, no layout jump.\n\n{page}`),
  site("/components", `The agent does not need a design system doc.\nIt needs the component file.\n\n${SITE}/components`),
  item("accordion-001", `Native accordion on details/summary.\nKeyboard and screen readers work without extra JS.\n\n{page}`),
  item("stack-001", `Arc fan of cards.\nHover, the fan opens. One file.\n\n{page}`),
  item("contact-003", `Demo request form.\nValidation and states included: sending, sent, error.\n\n{install}`),
  item("errorpage-001", `404 page with search.\nThe page people see most when something breaks.\n\n{page}`),
  item("slider-004", `Dual range slider.\nMin and max, keyboard steps, visible values.\n\n{page}`),
  site("/scenarios/portfolio/demo", `A portfolio site from registry blocks.\nYou change the text and photos. The layout stays.\n\n${SITE}/scenarios/portfolio/demo`),
  item("badge-001", `Status badge.\nTiny, but agents still invent a new one per page.\n\n{page}`),
  item("people-002", `Team grid with a department filter.\n\n{install}`),
  item("background-001", `Twisted ribbon background.\nCanvas, pauses off-screen, respects reduced motion.\n\n{page}`),
  item("datagrid-002", `Bulk action bar for tables.\nSelect rows, the bar slides in with actions.\n\n{page}`),
  site("/pricing", `Free: 20 components a month.\nEnough to build a landing page end to end.\n\n${SITE}/pricing`),
  item("carousel-002", `Peek cards carousel.\nScroll-snap, swipe on mobile, arrows on desktop.\n\n{page}`),
  item("hero-001", `Aurora hero.\nStill one of the most installed blocks.\n\n{install}`),
  item("buttongroup-004", `Editor toolbar.\nToggle states, groups, roving focus.\n\n{page}`),
  item("event-003", `Schedule grid for conferences and meetups.\n\n{page}`),
  site("/blocks", `Write the content yourself.\nLet the agent install the layout.\nThat split works better than asking it to do both.\n\n${SITE}/blocks`),
  item("popover-003", `Confirm popover.\nFor actions that don't deserve a full dialog.\n\n{page}`),
  item("pricing-003", `Monthly / yearly switch pricing.\nPrices update without a layout shift.\n\n{install}`),
  item("cursor-003", `Designer's crosshair cursor.\nFun on a portfolio, one file.\n\n{page}`),
  item("blog-002", `Article reader.\nGood line length, headings, code blocks. Reading first.\n\n{page}`),
  item("mockup-004", `Browser window mockup.\nPut your screenshot inside, done.\n\n{page}`),
  site("/scenarios/app/demo", `A mobile app landing from registry blocks.\n\n${SITE}/scenarios/app/demo`),
  item("select-005", `Select with a description under each option.\nBetter than a bare dropdown for plans and roles.\n\n{page}`),
  item("logocloud-002", `Logo marquee.\nPauses on hover, stops for reduced motion.\n\n{install}`),
  item("ai-001", `How the AI works: a three-node pipeline with running dots.\nFor any AI product landing.\n\n{page}`),
  item("spinner-004", `Percent ring meter.\nReal progress, not a spinner forever.\n\n{page}`),
  item("navbar-004", `Product navbar with a mega menu.\nThe hardest navbar to prompt right.\n\n{page}`),
  site("/components", `Question for people building with Claude or Cursor:\n\ndo you let the agent design UI, or do you hand it existing components?\n\n${SITE}/components`),
  item("card-004", `Product card.\nImage, price, rating, add to cart. Responsive.\n\n{install}`),
  item("surface-004", `Mesh gradient background.\nCSS only, no canvas.\n\n{page}`),
  item("checkbox-003", `Parent checkbox with the indeterminate state.\nAgents get this one wrong a lot.\n\n{page}`),
  item("faq-003", `Tabbed FAQ.\nFor products with many question groups.\n\n{page}`),
  item("tabs-003", `Tabs with a sliding underline.\nArrow keys move between tabs.\n\n{install}`),
  site("/scenarios/course/demo", `An online course landing from registry blocks.\nProgram, author, pricing, FAQ.\n\n${SITE}/scenarios/course/demo`),
  item("avatar-003", `Avatar stack with "+5".\nFor teams, comments, attendees.\n\n{page}`),
  item("testimonials-003", `Single quote testimonial.\nOne strong quote beats a wall of five-star cards.\n\n{page}`),
  item("flip-001", `Flip card.\nFront and back, keyboard accessible.\n\n{page}`),
  item("contact-001", `Contact form.\nLabels, errors, success state.\n\n{install}`),
  item("codeblock-002", `Code block with copy and a "copied" timer.\nFor docs and dev tool landings.\n\n{page}`),
  site("/blocks", `Each block is a single file with its own CSS variables.\nNo global theme to break, no extra packages.\n\n${SITE}/blocks`),
  item("pricing-004", `Plan comparison table.\nChecks, limits, sticky header.\n\n{page}`),
  item("text-003", `Paragraph with growing highlights.\nText that marks itself as you scroll.\n\n{page}`),
  item("dropdown-003", `Dropdown with keyboard shortcuts.\n\n{install}`),
  item("map-003", `Map with an address bar.\nOpenStreetMap works without an API key.\n\n{page}`),
  item("people-001", `Team grid.\nPhotos, roles, links.\n\n{page}`),
  item("alert-004", `Decision alert.\nA warning with the two actions right inside it.\n\n{page}`),
  item("bakery-002", `Coffee strength slider with a filling cup.\nIndustry blocks are where the registry gets playful.\n\n{page}`),
  item("button-anim-002", `Magnifying dock.\nThe macOS dock effect, as one React file.\n\n{install}`),
  site("/scenarios/delivery/demo", `100 days of posting about VibeUI.\nFull circle: the delivery demo, still the best example of a page built from blocks.\n\n${SITE}/scenarios/delivery/demo`),
  item("cta-002", `Centered dual CTA.\nPrimary and secondary action, nothing else.\n\n{page}`),
  site("/", `Pick a design. Hand it to AI. Ship the page.\n\nThat's the whole idea of VibeUI.\n${SITE}`),
];

const weight = (text) => text.replace(/https?:\/\/\S+/g, "x".repeat(23)).length;
const problems = [];
posts.forEach((post, index) => {
  post.day = index + 1;
  if (post.item && !kinds[post.item]) problems.push(`day ${post.day}: unknown item ${post.item}`);
  if (weight(post.text) > 280) problems.push(`day ${post.day}: ${weight(post.text)} chars`);
  if (!post.image) post.image = `day-${String(post.day).padStart(3, "0")}.png`;
});
if (posts.length !== 100) problems.push(`posts: ${posts.length}`);
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
fs.writeFileSync(path.join(__dirname, "../content/x-posts.json"), JSON.stringify(posts.map(({ day, text, image, shot }) => ({ day, text, image, shot: shot ?? null, published: day <= 3 })), null, 2) + "\n");
console.log(`ok: ${posts.length} posts`);
