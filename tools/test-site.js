/*
 * Browser-level smoke tests for the static page. This intentionally uses the
 * real index.html and script.js; it does not mock the application modules.
 *
 * Run: npm install jsdom --no-save && node tools/test-site.js
 * Exit: 0 = pass, 2 = jsdom unavailable, 1 = failure.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

let JSDOM;
try {
  ({ JSDOM } = require("jsdom"));
} catch {
  console.log("site smoke test skipped: jsdom not installed (npm install jsdom --no-save)");
  process.exit(2);
}

let failures = 0;
const check = (name, condition, detail = "") => {
  console.log(`  ${condition ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
  if (!condition) failures += 1;
};

function boot() {
  const dom = new JSDOM(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"), {
    url: "https://marktantongco.github.io/aiskills-photog/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const { window } = dom;
  window.matchMedia = (query) => ({
    matches: false, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
  });
  window.requestAnimationFrame = (callback) => callback();
  window.scrollTo = () => {};
  let error = null;
  try { window.eval(fs.readFileSync(path.join(ROOT, "script.js"), "utf8")); } catch (err) { error = err; }
  return { window, error };
}

(async () => {
  console.log("\nstatic site smoke checks");
  const t = boot();
  const { document } = t.window;
  check("script.js evaluates against the real page", !t.error, t.error && String(t.error));
  check("all hash links resolve", [...document.querySelectorAll('a[href^="#"]')].every((a) => {
    const href = a.getAttribute("href");
    return href === "#" || Boolean(document.getElementById(href.slice(1)));
  }));
  check("builder assembles an initial prompt", document.getElementById("builderOutput").textContent.length > 40);
  check("builder renders six score meters", document.querySelectorAll("#scoreGrid .score-meter").length === 6);
  check("score meters expose progress semantics", [...document.querySelectorAll("#scoreGrid [role=progressbar]")].every((el) => el.getAttribute("aria-valuenow")));

  const notes = document.getElementById("bNotes");
  notes.value = "Leave negative space on the right for a campaign headline";
  notes.dispatchEvent(new t.window.Event("input", { bubbles: true }));
  check("builder notes are included in the assembled prompt", /negative space on the right/.test(document.getElementById("builderOutput").textContent));
  check("builder notes expose a character count", document.getElementById("notesCount").textContent.startsWith("57 /"));

  const search = document.getElementById("navSearch");
  search.value = "LoRA";
  search.dispatchEvent(new t.window.Event("input", { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 160));
  check("search keeps category matches discoverable", !document.getElementById("lora").hidden);
  check("search shows visible feedback", !document.getElementById("searchFeedback").hidden && /matching/.test(document.getElementById("searchFeedbackText").textContent));
  check("search highlights matching text", document.querySelectorAll("mark.hl").length > 0);
  document.getElementById("clearSearchFeedback").click();
  check("search clear restores all sections", !document.getElementById("lora").hidden && !document.body.classList.contains("searching"));

  document.getElementById("themeToggle").click();
  check("theme toggle updates the data attribute", document.documentElement.getAttribute("data-theme") === "dark");
  document.getElementById("themeToggle").click();
  check("theme toggle returns to light mode", !document.documentElement.hasAttribute("data-theme"));

  const menuButton = document.getElementById("hamburger");
  menuButton.click();
  check("mobile menu opens with ARIA state", menuButton.getAttribute("aria-expanded") === "true" && document.getElementById("mobileMenu").classList.contains("open"));
  t.window.document.dispatchEvent(new t.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  check("Escape closes the mobile menu", menuButton.getAttribute("aria-expanded") === "false");

  console.log(`\nsite smoke tests: ${failures === 0 ? "all passed" : `${failures} failed`}`);
  process.exit(failures === 0 ? 0 : 1);
})();
