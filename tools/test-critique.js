/* ============================================================
   tools/test-critique.js — regression test for the AI Critique drawer.

   Loads the real index.html + script.js in jsdom against the real Pages URL
   and spies on fetch, so it asserts the *network behaviour* visitors get:
     · a static host that declares no proxy must issue zero requests
     · a declared proxy must resolve relative to the page (/aiskills-photog/),
       not the domain root, and a 404 must not be re-probed per click
     · no call may ever reach Google with key=null
     · blocked localStorage (Safari private mode) must not throw on save

   Run:  npm install jsdom --no-save && node tools/test-critique.js
   Exit: 0 = all assertions pass, 2 = jsdom missing (skipped), 1 = failure.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

let JSDOM;
try {
  ({ JSDOM } = require("jsdom"));
} catch {
  console.log("critique test skipped: jsdom not installed (npm install jsdom --no-save)");
  process.exit(2);
}

const PAGE_URL = "https://marktantongco.github.io/aiskills-photog/";
let failures = 0;
const check = (name, cond, extra = "") => {
  console.log(`  ${cond ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`);
  if (!cond) failures++;
};

function boot() {
  const dom = new JSDOM(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"), {
    url: PAGE_URL,
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const { window } = dom;
  const calls = [];
  const requests = [];
  window.matchMedia = (q) => ({
    matches: false, media: q, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
  });
  window.fetch = async (url, init) => {
    const u = String(url);
    calls.push(u);
    requests.push({ url: u, init: init || {} });
    return { ok: false, status: 404, json: async () => ({}) };   // host serves nothing
  };
  let evalError = null;
  try {
    window.eval(fs.readFileSync(path.join(ROOT, "script.js"), "utf8"));
  } catch (e) {
    evalError = e;
  }
  const click = (id) => {
    try {
      window.document.getElementById(id).dispatchEvent(new window.Event("click", { bubbles: true }));
      return null;
    } catch (e) {
      return e;
    }
  };
  return {
    window,
    calls,
    requests,
    click,
    evalError,
    out: () => window.document.getElementById("critiqueOut").textContent,
    label: () => window.document.getElementById("critiqueEngine").textContent,
    meta: () => window.document.querySelector('meta[name="critique-proxy"]'),
  };
}
const settle = () => new Promise((r) => setTimeout(r, 30));

// Async handlers that reject do so outside any caller's try/catch; surface them
// as assertions instead of letting Node abort the run mid-suite.
process.on("unhandledRejection", (reason) => {
  check("no rejected promise escapes a handler", false, String((reason && reason.message) || reason).slice(0, 70));
});

(async () => {
  console.log("\ncritique drawer — static host, no key saved (GitHub Pages default)");
  {
    const t = boot();
    check("script.js evaluates", t.evalError === null, t.evalError && String(t.evalError).slice(0, 70));
    const thrown = t.click("critiqueBtn");
    await settle();
    check("no handler throws", thrown === null, thrown && String(thrown).slice(0, 70));
    check("zero network requests", t.calls.length === 0, `issued: ${JSON.stringify(t.calls)}`);
    check("visitor gets guidance, not an HTTP error", /No API key saved/.test(t.out()), JSON.stringify(t.out().slice(0, 40)));
    check("engine label does not claim a proxy", /heuristic mode/.test(t.label()), t.label());
  }

  console.log("\ncritique drawer — proxy declared but unreachable on this host");
  {
    const t = boot();
    const meta = t.meta();
    check("host can declare a proxy endpoint", meta !== null, "index.html must ship <meta name=\"critique-proxy\">");
    if (meta) meta.setAttribute("content", "api/critique");
    t.window.localStorage.setItem("aisf.gemini.key", "AIza-TEST");
    t.click("critiqueBtn"); await settle();
    t.click("critiqueBtn"); await settle();
    const proxy = t.calls.filter((u) => u.includes("/api/critique"));
    const direct = t.calls.filter((u) => u.includes("generativelanguage"));
    check("proxy URL is page-relative, not domain-root",
      proxy.every((u) => u === PAGE_URL + "api/critique"), JSON.stringify(proxy));
    check("unreachable proxy probed once, then remembered dead", proxy.length === 1, `probes=${proxy.length}`);
    check("browser key used as fallback on every click", direct.length === 2, `direct=${direct.length}`);
    check("dead flag persisted", t.window.localStorage.getItem("aisf.proxy.dead") === "1");
  }

  console.log("\ncritique drawer — storage blocked (Safari private mode)");
  {
    const t = boot();
    Object.defineProperty(t.window, "localStorage", {
      get() { throw new Error("Storage disabled"); },
    });
    t.window.document.getElementById("geminiKey").value = "AIza-EPHEMERAL";
    const saved = t.click("saveKeyBtn");
    check("saving a key does not throw when storage is unavailable", saved === null, saved && String(saved).slice(0, 60));
    const run = t.click("critiqueBtn");
    await settle();
    check("clicking critique does not throw either", run === null, run && String(run).slice(0, 60));
    check("in-memory key still powers the call", t.calls.some((u) => u.includes("generativelanguage")), `requests=${t.calls.length}`);
    check("browser key is sent in a header, not the URL", t.requests.some((request) =>
      request.url.includes("generativelanguage") && request.init.headers?.["x-goog-api-key"] === "AIza-EPHEMERAL"),
      JSON.stringify(t.requests.map((request) => request.url)));
    check("key is never sent as the literal string 'null'", !t.calls.some((u) => u.includes("key=null")),
      t.calls.map((u) => u.slice(-22)).join(" | "));
  }

  console.log(`\n${failures === 0 ? "critique tests: all passed" : `critique tests: ${failures} failed`}`);
  process.exit(failures === 0 ? 0 : 1);
})();
