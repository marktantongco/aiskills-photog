/* ============================================================
   AI Practitioner Skills Framework — v5.0
   Interaction layer: theme, navigation, reveal, copy, search,
   scroll progress, back-to-top, scaffold builder, scoring,
   AI critique. Defensive + a11y-first.
   ============================================================ */
(() => {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasIO = 'IntersectionObserver' in window;

    /* Safe storage (private mode / disabled cookies can throw) */
    const store = {
        get(key) { try { return localStorage.getItem(key); } catch { return null; } },
        set(key, val) { try { localStorage.setItem(key, val); } catch { /* noop */ } }
    };

    /* --------------------------------------------------------
       1. Theme system (system-preference aware, FOUC-safe —
          the bootstrap snippet in <head> applies the attribute
          before first paint; this wires up the toggle).
    -------------------------------------------------------- */
    const themeToggle = $('#themeToggle');
    const metaTheme = $('meta[name="theme-color"]');

    const THEME_BG = { dark: '#0c0a09', light: '#fafaf9' };

    function syncThemeChrome() {
        if (!metaTheme) return;
        const dark = document.documentElement.getAttribute('data-theme') === 'dark';
        metaTheme.setAttribute('content', dark ? THEME_BG.dark : THEME_BG.light);
    }

    if (themeToggle) {
        const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
        themeToggle.setAttribute('aria-pressed', String(isDark()));

        themeToggle.addEventListener('click', () => {
            const next = isDark() ? 'light' : 'dark';
            if (next === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
            else document.documentElement.removeAttribute('data-theme');
            store.set('theme', next);
            themeToggle.setAttribute('aria-pressed', String(next === 'dark'));
            syncThemeChrome();
            toast(next === 'dark' ? 'Dark mode' : 'Light mode');
        });
    }
    syncThemeChrome();

    /* --------------------------------------------------------
       2. Mobile menu — animated hamburger, scroll lock,
          Escape to close, focus containment, cleanup on resize.
    -------------------------------------------------------- */
    const hamburger = $('#hamburger');
    const mobileMenu = $('#mobileMenu');

    const menuIsOpen = () => !!mobileMenu && mobileMenu.classList.contains('open');

    function setMenu(open) {
        if (!hamburger || !mobileMenu) return;
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        mobileMenu.classList.toggle('open', open);
        mobileMenu.setAttribute('aria-hidden', String(!open));
        document.body.classList.toggle('menu-open', open);
        if (!open) hamburger.focus({ preventScroll: true });
    }

    if (hamburger && mobileMenu) {
        hamburger.setAttribute('aria-controls', 'mobileMenu');
        mobileMenu.setAttribute('aria-hidden', 'true');

        hamburger.addEventListener('click', () => setMenu(!menuIsOpen()));

        // Close after choosing a destination
        $$('a', mobileMenu).forEach((link) =>
            link.addEventListener('click', () => setMenu(false))
        );

        // Focus trap while open
        mobileMenu.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab' || !menuIsOpen()) return;
            const focusables = $$('a[href], button:not([disabled]), input', mobileMenu)
                .filter((el) => el.offsetParent !== null);
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        });

        // Auto-close if viewport grows past the mobile breakpoint
        let wasCompact = window.matchMedia('(max-width: 1020px)').matches;
        window.matchMedia('(max-width: 1020px)').addEventListener('change', (e) => {
            if (wasCompact && !e.matches && menuIsOpen()) setMenu(false);
            wasCompact = e.matches;
        });
    }

    /* --------------------------------------------------------
       3. Scroll progress bar + back-to-top (one rAF-throttled
          passive scroll listener, no layout thrash).
    -------------------------------------------------------- */
    const progressBar = $('#progressBar');
    const backToTop = $('#backToTop');
    let scrollTicking = false;

    function onScrollFrame() {
        scrollTicking = false;
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const ratio = max > 0 ? Math.min(doc.scrollTop / max, 1) : 0;
        if (progressBar) progressBar.style.transform = `scaleX(${ratio})`;
        if (backToTop) backToTop.classList.toggle('show', doc.scrollTop > 600);
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) { scrollTicking = true; requestAnimationFrame(onScrollFrame); }
    }, { passive: true });
    onScrollFrame();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        });
    }

    /* --------------------------------------------------------
       4. Reveal-on-scroll (unobserves after firing; instantly
          visible for reduced motion / no-IO environments).
    -------------------------------------------------------- */
    const revealEls = $$('.reveal');

    if (reducedMotion || !hasIO) {
        revealEls.forEach((el) => el.classList.add('visible'));
    } else {
        const revealObs = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach((el) => revealObs.observe(el));
    }

    /* --------------------------------------------------------
       5. Active-section highlight — "middle line" technique.
          (threshold 0 + rootMargin band never misses tall
          sections, unlike the old threshold: 0.3 approach.)
    -------------------------------------------------------- */
    const navLinks = $$('.nav-link');
    const mobileLinks = $$('.mobile-link');
    const spySections = $$('main section[id]');

    function setActiveSection(id) {
        navLinks.forEach((l) => {
            const on = l.dataset.section === id;
            l.classList.toggle('active', on);
            if (on) l.setAttribute('aria-current', 'true');
            else l.removeAttribute('aria-current');
        });
        mobileLinks.forEach((l) => l.classList.toggle('active', l.dataset.section === id));
    }

    if (hasIO && spySections.length) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActiveSection(entry.target.id);
            });
        }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
        spySections.forEach((s) => spy.observe(s));
    }

    /* --------------------------------------------------------
       6. Smooth scrolling with header offset, deep-linkable
          hashes, and focus management for a11y.
          Fixes the old crash: querySelector('#') on the brand
          link threw a SyntaxError and killed the handler.
    -------------------------------------------------------- */
    const nav = $('.nav');
    const headerOffset = () => (nav ? nav.offsetHeight + 8 : 72);

    function scrollToTarget(target) {
        const y = target === document.body
            ? 0
            : target.getBoundingClientRect().top + window.scrollY - headerOffset();
        window.scrollTo({ top: Math.max(y, 0), behavior: reducedMotion ? 'auto' : 'smooth' });
    }

    $$('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href') || '#';
            e.preventDefault();

            // Brand / "back to top" style links
            if (href === '#' || href === '#top') {
                history.pushState(null, '', '#top');
                scrollToTarget(document.body);
                return;
            }

            let target = null;
            try { target = $(href); } catch { /* malformed selector — bail quietly */ }
            if (!target) return;

            history.pushState(null, '', href);
            scrollToTarget(target);
            // Move focus for keyboard / screen-reader users
            try {
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            } catch { /* noop */ }
        });
    });

    /* --------------------------------------------------------
       7. Clipboard — async API with execCommand fallback for
          non-secure contexts, keyboard-operable, with toast +
          inline state feedback (template <pre>s now styled too).
    -------------------------------------------------------- */
    const toastEl = $('#toast');
    let toastTimer;

    function toast(message, isError = false) {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.classList.toggle('error', isError);
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
    }

    async function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            try { await navigator.clipboard.writeText(text); return true; } catch { /* fall through */ }
        }
        // Legacy fallback (http, older browsers)
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        let ok = false;
        try { ok = document.execCommand('copy'); } catch { ok = false; }
        ta.remove();
        return ok;
    }

    function flashCopied(el) {
        el.classList.add('copied');
        clearTimeout(el._copyTimer);
        el._copyTimer = setTimeout(() => el.classList.remove('copied'), 1800);
    }

    function doCopy(el) {
        const text = (el.dataset.copy || el.textContent || '').trim();
        copyText(text).then((ok) => {
            if (ok) { flashCopied(el); toast('Copied to clipboard'); }
            else toast('Copy failed — please select the text manually', true);
        });
    }

    $$('.card-code, .template-body pre').forEach((el) => {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', 'Copy example to clipboard');
        el.title = 'Click to copy';
        el.addEventListener('click', () => doCopy(el));
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doCopy(el); }
        });
    });

    /* --------------------------------------------------------
       8. Live search / filter across every skill section.
          Debounced, hides non-matching cards + empty sections,
          highlights matches in-place, announces result counts,
          "/" shortcut to focus.
    -------------------------------------------------------- */
    const searchInputs = ['#navSearch', '#mobileSearch'].map((s) => $(s)).filter(Boolean);
    const searchStatus = $('#searchStatus');
    const FILTERABLE_SELECTORS = '.card, .level-card, .template, .synergy-node, .platforms, .matrix-row';
    const HIGHLIGHT_SCOPES = '.card-title, .card-desc, .card-code, .level-title, .level-desc, .level-tools, .template-name, .platform-tag, .synergy-text, .template-body pre';
    let filterTimer;

    /* --- Search-result highlighting (DOM-safe: text nodes only,
          data-copy attributes are never modified) --- */
    function clearHighlights(root = document) {
        $$('mark.hl', root).forEach((mark) => {
            const parent = mark.parentNode;
            if (!parent) return;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        });
    }

    function highlightWithin(el, query) {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => (node.nodeValue.toLowerCase().includes(query)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT)
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach((node) => {
            const text = node.nodeValue;
            const lower = text.toLowerCase();
            const frag = document.createDocumentFragment();
            let i = 0;
            for (;;) {
                const idx = lower.indexOf(query, i);
                if (idx === -1) { frag.appendChild(document.createTextNode(text.slice(i))); break; }
                frag.appendChild(document.createTextNode(text.slice(i, idx)));
                const mark = document.createElement('mark');
                mark.className = 'hl';
                mark.textContent = text.slice(idx, idx + query.length);
                frag.appendChild(mark);
                i = idx + query.length;
            }
            node.parentNode.replaceChild(frag, node);
        });
    }

    function applyFilter(rawQuery) {
        const query = rawQuery.trim().toLowerCase();

        // Keep both inputs in sync
        searchInputs.forEach((input) => { if (input.value !== rawQuery) input.value = rawQuery; });
        searchInputs.forEach((input) => {
            const clear = input.parentElement.querySelector('.search-clear');
            if (clear) clear.classList.toggle('show', rawQuery.length > 0);
        });

        let total = 0;
        const main = $('#main');
        if (main) clearHighlights(main);

        $$('main section[id]').forEach((section) => {
            const items = $$(FILTERABLE_SELECTORS, section);
            if (!items.length) return;
            let shown = 0;
            items.forEach((item) => {
                const match = !query || item.textContent.toLowerCase().includes(query);
                item.hidden = !match;
                if (match) {
                    shown++;
                    if (query) {
                        const scopes = $$(HIGHLIGHT_SCOPES, item);
                        if (item.matches(HIGHLIGHT_SCOPES + ', .matrix-row')) scopes.push(item);
                        scopes.forEach((scope) => { try { highlightWithin(scope, query); } catch { /* noop */ } });
                    }
                }
            });
            section.hidden = query.length > 0 && shown === 0;
            total += shown;
        });

        document.body.classList.toggle('searching', query.length > 0);

        if (searchStatus) {
            searchStatus.textContent = query
                ? `${total} result${total === 1 ? '' : 's'} for “${rawQuery.trim()}”`
                : '';
        }
    }

    searchInputs.forEach((input) => {
        input.addEventListener('input', () => {
            clearTimeout(filterTimer);
            filterTimer = setTimeout(() => applyFilter(input.value), 120);
        });
        const clear = input.parentElement.querySelector('.search-clear');
        if (clear) {
            clear.addEventListener('click', () => {
                input.value = '';
                applyFilter('');
                input.focus();
            });
        }
    });

    /* --------------------------------------------------------
       9. Global keyboard shortcuts.
    -------------------------------------------------------- */
    document.addEventListener('keydown', (e) => {
        const inField = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');

        // "/" focuses search (like GitHub et al.)
        if (e.key === '/' && !inField && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const visible = searchInputs.find((i) => i.offsetParent !== null) || searchInputs[0];
            if (visible) { e.preventDefault(); visible.focus(); visible.select(); }
            return;
        }

        if (e.key === 'Escape') {
            if (menuIsOpen()) { setMenu(false); return; }
            // Clear active search
            searchInputs.forEach((input) => {
                if (document.activeElement === input && input.value) {
                    input.value = '';
                    applyFilter('');
                }
            });
        }
    });

    /* --------------------------------------------------------
       10. Prompt Scaffold Builder (demo section) — assembles a
           copy-ready prompt from the six scaffold slots.
    -------------------------------------------------------- */
    const builderForm = $('#builderForm');
    const builderOutput = $('#builderOutput');

    if (builderForm && builderOutput) {
        /* ----------------------------------------------------
           Shared helpers — single source of truth for positives/
           negatives so assemble, scoring, and report stay in sync.
        ---------------------------------------------------- */
        const getBuilderPositives = () =>
            $$('.builder-select', builderForm)
                .filter((sel) => !sel.dataset.role)
                .map((sel) => sel.value)
                .filter(Boolean)
                .join(', ');

        const getBuilderNegative = () =>
            $('[data-role="negative"]', builderForm)?.value || '';

        const assemble = () => {
            const positives = getBuilderPositives();
            const negative = getBuilderNegative();
            const assembled = negative
                ? positives + ' + negatives: ' + negative
                : positives;
            builderOutput.dataset.copy = assembled;
            builderOutput.textContent = assembled;
        };

        builderForm.addEventListener('change', assemble);
        builderForm.addEventListener('submit', (e) => e.preventDefault());

        /* ----------------------------------------------------
           v5: Heuristic prompt scoring (offline, deterministic).
           Each dimension mirrors a framework doctrine:
           named lighting > vague, lens specs > buzzwords,
           specific style anchors, native quality tiers,
           weighted negation present.
        ---------------------------------------------------- */
        const DIMS = [
            { key: 'lighting', label: 'Lighting',
              strong: ['rembrandt', 'butterfly', 'split', 'loop', 'rim', 'golden hour', 'window light'],
              weak: [] },
            { key: 'lens', label: 'Lens / DOF',
              strong: ['mm', 'f/'], weak: [] },
            { key: 'style', label: 'Style anchor',
              strong: ['quiet luxury', 'editorial', 'documentary', 'noir', 'anamorphic', 'cinematic still'],
              weak: ['photorealistic', 'hyperrealistic'] },
            { key: 'quality', label: 'Quality tier',
              strong: ['8k', 'native', 'subsurface'], weak: ['1080p'] },
            { key: 'negation', label: 'Negation', special: 'negative' },
        ];

        function dimScore(dim, positives, negative) {
            if (dim.special === 'negative') return negative ? 100 : 15;
            const t = positives.toLowerCase();
            if (dim.strong.some((k) => t.includes(k))) return 100;
            if (dim.weak.some((k) => t.includes(k))) return 45;
            if (dim.key === 'lens' && t.includes('mm')) return 60;
            return 30;
        }

        const scoreGrid = $('#scoreGrid');
        const scoreOverall = $('#scoreOverall');

        let lastScores = {}; // store per-dimension for the copy-report feature

        function renderScore() {
            if (!scoreGrid || !scoreOverall) return;
            const negative = getBuilderNegative();
            const positives = getBuilderPositives();
            lastScores = {};
            let total = 0;
            scoreGrid.replaceChildren(...DIMS.map((dim) => {
                const pct = dimScore(dim, positives, negative);
                lastScores[dim.label] = pct;
                total += pct;
                const meter = document.createElement('div');
                meter.className = 'score-meter';
                const top = document.createElement('div');
                top.className = 'score-meter-top';
                const name = document.createElement('span');
                name.textContent = dim.label;
                const val = document.createElement('span');
                val.textContent = String(pct);
                top.append(name, val);
                const bar = document.createElement('div');
                bar.className = 'score-bar';
                const fill = document.createElement('div');
                fill.className = 'score-fill' + (pct >= 85 ? ' high' : '');
                fill.style.width = pct + '%';
                bar.append(fill);
                meter.append(top, bar);
                return meter;
            }));
            const overall = Math.round(total / DIMS.length);
            scoreOverall.textContent = overall + ' / 100';
            scoreOverall.classList.toggle('good', overall >= 80);
            scoreOverall.classList.toggle('mid', overall >= 55 && overall < 80);
        }

        /* v5 — Copy score report */
        $('#copyScoreBtn')?.addEventListener('click', async () => {
            const neg = getBuilderNegative();
            const pos = getBuilderPositives();
            const overall = scoreOverall?.textContent || '—';
            const lines = ['AI Practitioner Skills Framework — Prompt Score Report', '---', 'Prompt: ' + (builderOutput.dataset.copy || ''), '', 'Overall: ' + overall, ''];
            DIMS.forEach((dim) => { lines.push(dim.label + ': ' + (lastScores[dim.label] ?? '—')); });
            lines.push('', 'Scoring doctrine: named lighting > vague, real lens specs > buzzwords, specific style anchors, native resolution tiers, weighted negation.', 'Generated by the Scaffold Builder (v5)', 'https://marktantongco.github.io/aiskills-photog/');
            try {
                await copyText(lines.join('\n'));
                toast('Score report copied');
            } catch {
                toast('Copy failed — check browser permissions', true);
            }
        });

        /* ----------------------------------------------------
           v5: Optional LLM critique via Google AI (Gemini).
           Production path: serverless proxy at /api/critique
           (keeps key server-side). Local fallback: direct call
           with key from localStorage. Heuristic fallback when
           no key or any failure.
        ---------------------------------------------------- */
        const KEY_STORE = 'aisf.gemini.key';
        const keyInput = $('#geminiKey');
        const engineLabel = $('#critiqueEngine');
        const critiqueOut = $('#critiqueOut');

        function syncEngineLabel() {
            if (!engineLabel) return;
            const has = !!localStorage.getItem(KEY_STORE);
            const isProd = location.protocol === 'https:' && location.pathname.startsWith('/api') === false;
            // In production (HTTPS, deployed), prefer proxy; localStorage key is a dev fallback.
            engineLabel.textContent = isProd
                ? '(server proxy)' + (has ? ' + local key' : '')
                : has ? '(Gemini connected)' : '(heuristic mode — add a key below)';
        }

        const CRITIQUE_SYSTEM = 'You are an expert critic of AI image-generation prompts. Judge this prompt against professional doctrine: structured scaffold order, named lighting patterns, real lens vocabulary, specific style anchors, native resolution tiers, and weighted negative prompting. Be concise.\n\nReply exactly in this format:\nScore: X/10\nStrengths: …\nImprove: …';

        async function callGeminiDirect(text, key) {
            const res = await fetch(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(key),
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: CRITIQUE_SYSTEM + '\n\nPROMPT: ' + text }] }] }),
                }
            );
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('').trim();
            if (!reply) throw new Error('empty response');
            return reply;
        }

        async function callProxy(text) {
            const res = await fetch('/api/critique', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text }),
            });
            if (!res.ok) throw new Error('proxy HTTP ' + res.status);
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            return data.reply || '';
        }

        async function runCritique() {
            const text = builderOutput.dataset.copy || builderOutput.textContent || '';
            const key = localStorage.getItem(KEY_STORE);
            if (!critiqueOut) return;
            critiqueOut.textContent = 'Analyzing…';
            try {
                let reply;
                const isProd = location.protocol === 'https:';
                // Prefer serverless proxy in production (key stays server-side);
                // fall back to direct call in local dev (no proxy needed).
                if (isProd) {
                    try { reply = await callProxy(text); } catch { reply = await callGeminiDirect(text, key); }
                } else {
                    reply = await callGeminiDirect(text, key);
                }
                critiqueOut.textContent = reply;
            } catch (err) {
                critiqueOut.textContent = 'LLM critique unavailable (' + err.message + '). The offline heuristic score above remains your baseline.';
            }
        }

        function initCritique() {
            if (!keyInput || !engineLabel || !critiqueOut) return;
            syncEngineLabel();
            $('#saveKeyBtn')?.addEventListener('click', () => {
                const k = keyInput.value.trim();
                if (!k) { toast('Paste a key first', true); return; }
                localStorage.setItem(KEY_STORE, k);
                keyInput.value = '';
                syncEngineLabel();
                toast('API key saved to this browser');
            });
            $('#clearKeyBtn')?.addEventListener('click', () => {
                localStorage.removeItem(KEY_STORE);
                syncEngineLabel();
                toast('API key removed');
            });
            $('#critiqueBtn')?.addEventListener('click', async () => {
                const key = localStorage.getItem(KEY_STORE);
                if (!key && location.protocol !== 'https:') {
                    critiqueOut.textContent = 'No API key saved — the live heuristic score above is your baseline. Add a free Gemini key below to enable the LLM second opinion.';
                    keyInput?.focus();
                    return;
                }
                await runCritique();
            });
        }
        initCritique();

        const randomBtn = $('#builderRandom');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                $$('.builder-select', builderForm).forEach((sel) => {
                    const opts = $$('option', sel);
                    if (opts.length) sel.value = opts[Math.floor(Math.random() * opts.length)].value;
                });
                assemble();
                renderScore();
            });
        }

        builderForm.addEventListener('change', renderScore);
        assemble(); // initial render
        renderScore(); // initial score
    }
})();
