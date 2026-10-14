// Screenshots vibeui.club for every post without a ready frame: node scripts/x-posts-shoot.cjs [day...]
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const root = path.resolve(__dirname, "../..");
const out = path.join(__dirname, "../content/x-posts");
const posts = JSON.parse(fs.readFileSync(path.join(__dirname, "../content/x-posts.json"), "utf8"));
const small = new Set(["components", "animations"]);
const kindOf = {};
for (const kind of ["components", "animations", "blocks"]) {
  for (const category of fs.readdirSync(path.join(root, "registry", kind))) {
    const file = path.join(root, "registry", kind, category, "registry.json");
    if (fs.existsSync(file)) for (const item of JSON.parse(fs.readFileSync(file, "utf8")).items) kindOf[item.name] = kind;
  }
}

const only = new Set(process.argv.slice(2).map(Number));
fs.mkdirSync(out, { recursive: true });
for (const post of posts) {
  if (!post.shot || (only.size && !only.has(post.day))) continue;
  const target = path.join(out, post.image);
  if (!only.size && fs.existsSync(target)) continue;
  const name = /^\/preview\/([^?]+)/.exec(post.shot)?.[1];
  const zoom = kindOf[name] === "components" ? 2.5 : name && small.has(kindOf[name]) ? 1.75 : 1;
  const width = Math.round(1200 / zoom);
  const height = Math.round(675 / zoom);
  try {
    execFileSync(chrome, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-dark-mode",
    `--user-data-dir=${path.join(os.tmpdir(), "vibeui-x-shoot")}`,
    `--force-device-scale-factor=${zoom}`, `--window-size=${width},${height}`,
    "--virtual-time-budget=10000", `--screenshot=${target}`, `https://vibeui.club${post.shot}`,
    ], { stdio: "ignore", timeout: 60_000 });
    console.log(post.day, post.shot);
  } catch {
    console.log(post.day, "FAILED", post.shot);
  }
}
