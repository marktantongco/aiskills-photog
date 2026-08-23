/* ============================================================
   AI Practitioner Skills Framework — v3.1
   Interaction layer: theme, navigation, reveal, copy, search,
   scroll progress, back-to-top. Defensive + a11y-first.
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
        const assemble = () => {
            const parts = $$('.builder-select', builderForm)
                .map((sel) => sel.value)
                .filter(Boolean);
            const positives = parts.slice(0, 5).join(', ');
            const negative = $('[data-role="negative"]', builderForm)?.value || '';
            const prompt = negatives => negatives ? `${positives} + negatives: ${negatives}` : positives;
            builderOutput.dataset.copy = prompt(negative);
            builderOutput.textContent = prompt(negative);
        };

        builderForm.addEventListener('change', assemble);
        builderForm.addEventListener('submit', (e) => e.preventDefault());

        const randomBtn = $('#builderRandom');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                $$('.builder-select', builderForm).forEach((sel) => {
                    const opts = $$('option', sel);
                    if (opts.length) sel.value = opts[Math.floor(Math.random() * opts.length)].value;
                });
                assemble();
            });
        }

        assemble(); // initial render
    }
})();
