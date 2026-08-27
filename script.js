/* ============================================================
   AI Practitioner Skills Framework — v5.2
   Interaction layer: theme, navigation, reveal, copy, search,
   scroll progress, prompt builder, scoring, and optional critique.
   Defensive, progressively enhanced, keyboard-first, zero-build JS.
   ============================================================ */
(() => {
    'use strict';

    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
    const root = document.documentElement;
    const doc = document;
    const body = document.body;
    const raf = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 16));

    const makeMediaQuery = (query) => {
        if (window.matchMedia) return window.matchMedia(query);
        return {
            matches: false,
            addEventListener() {},
            removeEventListener() {},
            addListener() {},
            removeListener() {},
        };
    };
    const reducedMotionQuery = makeMediaQuery('(prefers-reduced-motion: reduce)');
    const reducedMotion = () => reducedMotionQuery.matches;
    const hasIO = 'IntersectionObserver' in window;

    /* Safe storage: private browsing and strict privacy settings can throw. */
    const store = {
        get(key) { try { return window.localStorage.getItem(key); } catch { return null; } },
        set(key, value) { try { window.localStorage.setItem(key, value); return true; } catch { return false; } },
        del(key) { try { window.localStorage.removeItem(key); } catch { /* noop */ } },
    };

    /* --------------------------------------------------------
       Shared feedback
    -------------------------------------------------------- */
    const toastEl = $('#toast');
    let toastTimer;

    function toast(message, isError = false) {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.classList.toggle('error', isError);
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toastEl.classList.remove('show'), 2600);
    }

    /* --------------------------------------------------------
       1. Theme system
       The small bootstrap in <head> applies the first-paint theme. This
       layer adds persistence, system changes, accessible state, and chrome.
    -------------------------------------------------------- */
    const themeToggle = $('#themeToggle');
    const metaTheme = $('meta[name="theme-color"]');
    const THEME_BG = { dark: '#0c0a09', light: '#fafaf9' };
    const systemTheme = makeMediaQuery('(prefers-color-scheme: dark)');

    function isDark() {
        return root.getAttribute('data-theme') === 'dark';
    }

    function syncThemeChrome() {
        if (metaTheme) metaTheme.setAttribute('content', isDark() ? THEME_BG.dark : THEME_BG.light);
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', String(isDark()));
            themeToggle.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
            themeToggle.title = isDark() ? 'Switch to light mode' : 'Switch to dark mode';
        }
    }

    function setTheme(theme, persist = true) {
        const next = theme === 'dark' ? 'dark' : 'light';
        if (next === 'dark') root.setAttribute('data-theme', 'dark');
        else root.removeAttribute('data-theme');
        if (persist) store.set('theme', next);
        syncThemeChrome();
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTheme(isDark() ? 'light' : 'dark');
            toast(isDark() ? 'Dark mode enabled' : 'Light mode enabled');
        });
    }

    // If the visitor has not chosen a theme, keep following the OS preference.
    const syncSystemTheme = () => {
        if (!store.get('theme')) setTheme(systemTheme.matches ? 'dark' : 'light', false);
    };
    if (typeof systemTheme.addEventListener === 'function') systemTheme.addEventListener('change', syncSystemTheme);
    else if (typeof systemTheme.addListener === 'function') systemTheme.addListener(syncSystemTheme);
    syncThemeChrome();

    /* --------------------------------------------------------
       2. Navigation height + mobile menu
    -------------------------------------------------------- */
    const nav = $('.nav');
    const hamburger = $('#hamburger');
    const mobileMenu = $('#mobileMenu');
    const mobileSearch = $('#mobileSearch');
    const mainContent = $('#main');
    let menuReturnFocus = null;

    function syncNavHeight() {
        if (nav && nav.offsetHeight) root.style.setProperty('--nav-h', `${nav.offsetHeight}px`);
    }
    syncNavHeight();
    window.addEventListener('resize', syncNavHeight, { passive: true });
    if (window.ResizeObserver && nav) new ResizeObserver(syncNavHeight).observe(nav);

    const menuIsOpen = () => !!mobileMenu && mobileMenu.classList.contains('open');
    const isVisible = (element) => {
        if (!element) return false;
        let current = element;
        while (current && current !== doc.documentElement) {
            if (current.hidden) return false;
            const style = window.getComputedStyle ? window.getComputedStyle(current) : null;
            if (style && (style.display === 'none' || style.visibility === 'hidden')) return false;
            current = current.parentElement;
        }
        return true;
    };

    function setMainInert(inert) {
        if (!mainContent) return;
        // inert is supported by current browsers; aria-hidden keeps the intent
        // clear for assistive technology that does not implement inert yet.
        mainContent.inert = inert;
        if (inert) mainContent.setAttribute('aria-hidden', 'true');
        else mainContent.removeAttribute('aria-hidden');
    }

    function setMenu(open) {
        if (!hamburger || !mobileMenu) return;
        if (open) {
            menuReturnFocus = doc.activeElement instanceof HTMLElement && !mobileMenu.contains(doc.activeElement)
                ? doc.activeElement
                : hamburger;
        }
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        mobileMenu.classList.toggle('open', open);
        mobileMenu.setAttribute('aria-hidden', String(!open));
        body.classList.toggle('menu-open', open);
        setMainInert(open);

        if (open) {
            raf(() => {
                if (menuIsOpen()) mobileSearch?.focus({ preventScroll: true });
            });
        } else {
            const restore = menuReturnFocus && menuReturnFocus.isConnected ? menuReturnFocus : hamburger;
            restore?.focus({ preventScroll: true });
            menuReturnFocus = null;
        }
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => setMenu(!menuIsOpen()));
        mobileMenu.setAttribute('aria-hidden', 'true');

        $$('a', mobileMenu).forEach((link) => {
            link.addEventListener('click', () => setMenu(false));
        });

        mobileMenu.addEventListener('keydown', (event) => {
            if (event.key !== 'Tab' || !menuIsOpen()) return;
            const focusables = $$('a[href], button:not([disabled]), input, textarea, select', mobileMenu)
                .filter((element) => isVisible(element) || element === doc.activeElement);
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (event.shiftKey && doc.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && doc.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        const compactQuery = makeMediaQuery('(max-width: 1020px)');
        let wasCompact = compactQuery.matches;
        const handleCompactChange = (event) => {
            if (wasCompact && !event.matches && menuIsOpen()) setMenu(false);
            wasCompact = event.matches;
            syncNavHeight();
        };
        if (typeof compactQuery.addEventListener === 'function') compactQuery.addEventListener('change', handleCompactChange);
        else if (typeof compactQuery.addListener === 'function') compactQuery.addListener(handleCompactChange);
    }

    /* --------------------------------------------------------
       3. Scroll progress, active section, and back-to-top
    -------------------------------------------------------- */
    const progressBar = $('#progressBar');
    const backToTop = $('#backToTop');
    const spySections = $$('main section[id]');
    const navLinks = $$('.nav-link');
    const mobileLinks = $$('.mobile-link');
    let scrollTicking = false;
    let activeSection = '';

    const getScrollTop = () => window.scrollY || doc.documentElement.scrollTop || body.scrollTop || 0;
    const headerOffset = () => (nav?.offsetHeight || 64) + 8;

    function setActiveSection(id) {
        if (!id || id === activeSection) return;
        activeSection = id;
        navLinks.forEach((link) => {
            const active = link.dataset.section === id;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
        mobileLinks.forEach((link) => {
            const active = link.dataset.section === id;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }

    function updateActiveSection() {
        if (!spySections.length) return;
        const scrollTop = getScrollTop();
        const marker = scrollTop + headerOffset() + Math.max(24, window.innerHeight * 0.28);
        let current = spySections[0]?.id || '';
        spySections.forEach((section) => {
            if (section.hidden) return;
            const top = section.getBoundingClientRect().top + scrollTop;
            if (top <= marker) current = section.id;
        });
        setActiveSection(current);
    }

    function onScrollFrame() {
        scrollTicking = false;
        const scrollTop = getScrollTop();
        const maximum = Math.max(doc.documentElement.scrollHeight - doc.documentElement.clientHeight, 0);
        const ratio = maximum ? Math.min(scrollTop / maximum, 1) : 0;
        if (progressBar) progressBar.style.transform = `scaleX(${ratio})`;
        if (backToTop) backToTop.classList.toggle('show', scrollTop > 600);
        updateActiveSection();
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            scrollTicking = true;
            raf(onScrollFrame);
        }
    }, { passive: true });
    window.addEventListener('resize', () => raf(onScrollFrame), { passive: true });
    onScrollFrame();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
            history.replaceState(null, '', '#top');
        });
    }

    /* --------------------------------------------------------
       4. Reveal-on-scroll
    -------------------------------------------------------- */
    const revealEls = $$('.reveal');
    if (reducedMotion() || !hasIO) {
        revealEls.forEach((element) => element.classList.add('visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
        revealEls.forEach((element) => revealObserver.observe(element));
    }
    const revealOnMotionChange = (event) => {
        if (event.matches) revealEls.forEach((element) => element.classList.add('visible'));
    };
    if (typeof reducedMotionQuery.addEventListener === 'function') reducedMotionQuery.addEventListener('change', revealOnMotionChange);
    else if (typeof reducedMotionQuery.addListener === 'function') reducedMotionQuery.addListener(revealOnMotionChange);

    /* --------------------------------------------------------
       5. Hash navigation
       Handles malformed hashes, deep links, browser back/forward, and the
       fixed header without relying on querySelector('#...') selectors.
    -------------------------------------------------------- */
    function targetForHash(hash) {
        if (!hash || hash === '#') return doc.body;
        const id = hash.slice(1);
        try { return doc.getElementById(decodeURIComponent(id)); } catch { return null; }
    }

    function scrollToTarget(target) {
        if (!target || target === doc.body) {
            window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
            return;
        }
        const y = target.getBoundingClientRect().top + getScrollTop() - headerOffset();
        window.scrollTo({ top: Math.max(0, y), behavior: reducedMotion() ? 'auto' : 'smooth' });
    }

    function goToHash(hash, { push = false, focus = true } = {}) {
        const normalized = hash && hash !== '#' ? hash : '#top';
        const target = targetForHash(normalized);
        if (!target) return false;
        if (push) {
            try { history.pushState(null, '', normalized); } catch { /* file:// or restricted history */ }
        }
        scrollToTarget(target);
        if (focus && target !== doc.body) {
            const hadTabIndex = target.hasAttribute('tabindex');
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
            if (!hadTabIndex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }
        raf(updateActiveSection);
        return true;
    }

    $$('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href') || '#top';
            if (!targetForHash(href)) return;
            event.preventDefault();
            if (menuIsOpen()) setMenu(false);
            goToHash(href, { push: true, focus: href !== '#top' && href !== '#' });
        });
    });

    window.addEventListener('popstate', () => {
        if (location.hash) goToHash(location.hash, { focus: false });
        else goToHash('#top', { focus: false });
    });
    if (location.hash) window.setTimeout(() => goToHash(location.hash, { focus: false }), 0);

    /* --------------------------------------------------------
       6. Clipboard
    -------------------------------------------------------- */
    async function copyText(text) {
        if (!text) return false;
        if (navigator.clipboard?.writeText && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch { /* use the compatibility path */ }
        }
        const textarea = doc.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;';
        body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, text.length);
        let copied = false;
        try { copied = doc.execCommand('copy'); } catch { copied = false; }
        textarea.remove();
        return copied;
    }

    function flashCopied(element) {
        const originalLabel = element.getAttribute('aria-label');
        element.classList.add('copied');
        element.setAttribute('aria-label', 'Copied to clipboard');
        clearTimeout(element._copyTimer);
        element._copyTimer = window.setTimeout(() => {
            element.classList.remove('copied');
            if (originalLabel) element.setAttribute('aria-label', originalLabel);
            else element.removeAttribute('aria-label');
        }, 1800);
    }

    function doCopy(element) {
        const text = (element.dataset.copy || element.textContent || '').trim();
        copyText(text).then((copied) => {
            if (copied) {
                flashCopied(element);
                toast('Copied to clipboard');
            } else {
                toast('Copy failed — select the text manually', true);
            }
        }).catch(() => toast('Copy failed — select the text manually', true));
    }

    $$('.card-code, .template-body pre, .mermaid-src pre').forEach((element) => {
        if (element.tagName !== 'BUTTON') {
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
        }
        if (!element.getAttribute('aria-label')) element.setAttribute('aria-label', 'Copy example to clipboard');
        element.title = 'Click to copy';
        element.addEventListener('click', () => doCopy(element));
        element.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                doCopy(element);
            }
        });
    });

    /* --------------------------------------------------------
       7. Global search
       Search is section-aware: a match in a section heading keeps that whole
       section available, while matches in cards/rows filter to the item.
    -------------------------------------------------------- */
    const searchInputs = ['#navSearch', '#mobileSearch'].map((selector) => $(selector)).filter(Boolean);
    const searchStatus = $('#searchStatus');
    const searchFeedback = $('#searchFeedback');
    const searchFeedbackText = $('#searchFeedbackText');
    const clearSearchFeedback = $('#clearSearchFeedback');
    const FILTERABLE_SELECTORS = '.card, .level-card, .template, .synergy-node, .platforms, .matrix-row';
    const HIGHLIGHT_SCOPES = '.section-header, .card-title, .card-desc, .card-code, .level-title, .level-desc, .level-tools, .template-name, .platform-tag, .synergy-text, .template-body pre, .matrix-row';
    let filterTimer;

    function clearHighlights(context = doc) {
        $$('mark.hl', context).forEach((mark) => {
            const parent = mark.parentNode;
            if (!parent) return;
            parent.replaceChild(doc.createTextNode(mark.textContent), mark);
            parent.normalize();
        });
    }

    function highlightWithin(element, query) {
        if (!query || !element) return;
        const walker = doc.createTreeWalker(element, window.NodeFilter?.SHOW_TEXT || 4, {
            acceptNode: (node) => {
                if (node.parentElement?.closest('mark.hl')) return window.NodeFilter?.FILTER_REJECT || 2;
                return node.nodeValue.toLowerCase().includes(query)
                    ? (window.NodeFilter?.FILTER_ACCEPT || 1)
                    : (window.NodeFilter?.FILTER_REJECT || 2);
            },
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach((node) => {
            const text = node.nodeValue;
            const lower = text.toLowerCase();
            const fragment = doc.createDocumentFragment();
            let cursor = 0;
            while (cursor < text.length) {
                const index = lower.indexOf(query, cursor);
                if (index === -1) {
                    fragment.appendChild(doc.createTextNode(text.slice(cursor)));
                    break;
                }
                fragment.appendChild(doc.createTextNode(text.slice(cursor, index)));
                const mark = doc.createElement('mark');
                mark.className = 'hl';
                mark.textContent = text.slice(index, index + query.length);
                fragment.appendChild(mark);
                cursor = index + query.length;
            }
            node.parentNode?.replaceChild(fragment, node);
        });
    }

    function updateSearchFeedback(query, total) {
        if (!searchFeedback) return;
        const active = Boolean(query);
        searchFeedback.hidden = !active;
        if (!active) return;
        if (searchFeedbackText) {
            searchFeedbackText.textContent = total
                ? `${total} matching ${total === 1 ? 'item' : 'items'} for “${query}”`
                : `No matches for “${query}”. Try lens, lighting, LoRA, agent, or seed.`;
        }
    }

    function applyFilter(rawQuery = '') {
        const raw = String(rawQuery);
        const query = raw.trim().toLowerCase();
        searchInputs.forEach((input) => {
            if (input.value !== raw) input.value = raw;
            const clear = input.parentElement?.querySelector('.search-clear');
            clear?.classList.toggle('show', Boolean(raw));
        });

        const main = $('#main');
        if (main) clearHighlights(main);
        let total = 0;

        $$('main section[id]').forEach((section) => {
            const items = $$(FILTERABLE_SELECTORS, section);
            if (!items.length) return;
            const sectionHeader = $('.section-header', section);
            const headerMatch = Boolean(query && sectionHeader?.textContent.toLowerCase().includes(query));
            if (headerMatch) highlightWithin(sectionHeader, query);

            let shown = 0;
            items.forEach((item) => {
                const match = !query || headerMatch || item.textContent.toLowerCase().includes(query);
                item.hidden = !match;
                if (match) {
                    item.removeAttribute('aria-hidden');
                    shown += 1;
                    if (query && !headerMatch) {
                        const scopes = $$(HIGHLIGHT_SCOPES, item);
                        if (item.matches('.matrix-row, .platforms')) scopes.push(item);
                        scopes.forEach((scope) => highlightWithin(scope, query));
                    }
                } else {
                    item.setAttribute('aria-hidden', 'true');
                }
            });
            section.hidden = Boolean(query && shown === 0);
            if (section.hidden) section.setAttribute('aria-hidden', 'true');
            else section.removeAttribute('aria-hidden');
            total += shown;
        });

        body.classList.toggle('searching', Boolean(query));
        updateSearchFeedback(query, total);
        if (searchStatus) {
            searchStatus.textContent = query
                ? `${total} result${total === 1 ? '' : 's'} for “${raw.trim()}”`
                : '';
        }
        raf(onScrollFrame);
    }

    function clearSearch(focusInput = null) {
        clearTimeout(filterTimer);
        applyFilter('');
        (focusInput || searchInputs.find(isVisible))?.focus();
    }

    searchInputs.forEach((input) => {
        input.addEventListener('input', () => {
            clearTimeout(filterTimer);
            filterTimer = window.setTimeout(() => applyFilter(input.value), 120);
        });
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') applyFilter(input.value);
        });
        input.parentElement?.querySelector('.search-clear')?.addEventListener('click', () => clearSearch(input));
    });
    clearSearchFeedback?.addEventListener('click', () => clearSearch());

    /* --------------------------------------------------------
       8. Keyboard shortcuts
    -------------------------------------------------------- */
    document.addEventListener('keydown', (event) => {
        const active = doc.activeElement;
        const inField = /^(INPUT|TEXTAREA|SELECT)$/.test(active?.tagName || '');
        if ((event.key === '/' || (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)))
            && !inField && !event.altKey) {
            const visible = searchInputs.find(isVisible);
            event.preventDefault();
            if (visible) {
                visible.focus();
                visible.select();
            } else if (hamburger && mobileMenu) {
                setMenu(true);
                raf(() => mobileSearch?.select());
            }
            return;
        }
        if (event.key === 'Escape') {
            if (menuIsOpen()) {
                setMenu(false);
                return;
            }
            if (inField && active?.value) clearSearch(active);
        }
    });

    /* --------------------------------------------------------
       9. Prompt Scaffold Builder
    -------------------------------------------------------- */
    const builderForm = $('#builderForm');
    const builderOutput = $('#builderOutput');

    if (builderForm && builderOutput) {
        const builderSelects = $$('.builder-select', builderForm);
        const notesInput = $('#bNotes');
        const notesCount = $('#notesCount');
        const saveStatus = $('#builderSaveStatus');
        const BUILDER_STORE = 'aisf.builder.v2';
        let saveTimer;

        function restoreBuilderState() {
            let saved = null;
            try { saved = JSON.parse(store.get(BUILDER_STORE) || 'null'); } catch { saved = null; }
            if (!saved || typeof saved !== 'object') return;
            builderSelects.forEach((select) => {
                const value = saved[select.id];
                if (typeof value === 'string' && Array.from(select.options).some((option) => option.value === value)) {
                    select.value = value;
                }
            });
            if (notesInput && typeof saved.notes === 'string') notesInput.value = saved.notes.slice(0, 240);
        }

        function saveBuilderState() {
            const state = { notes: notesInput?.value.slice(0, 240) || '' };
            builderSelects.forEach((select) => { state[select.id] = select.value; });
            const persisted = store.set(BUILDER_STORE, JSON.stringify(state));
            if (saveStatus) saveStatus.textContent = persisted ? 'Saved in this browser' : 'Session only';
        }

        function scheduleSave() {
            clearTimeout(saveTimer);
            saveTimer = window.setTimeout(saveBuilderState, 120);
        }

        const getBuilderPositives = () => builderSelects
            .filter((select) => !select.dataset.role)
            .map((select) => select.value.trim())
            .filter(Boolean)
            .join(', ');
        const getBuilderNegative = () => $('[data-role="negative"]', builderForm)?.value.trim() || '';
        const getBuilderNotes = () => notesInput?.value.trim() || '';

        function updateNotesCount() {
            if (notesCount && notesInput) notesCount.textContent = `${notesInput.value.length} / ${notesInput.maxLength}`;
        }

        function assemble() {
            const parts = [getBuilderPositives()];
            const notes = getBuilderNotes();
            const negative = getBuilderNegative();
            if (notes) parts.push('intent / constraints: ' + notes);
            if (negative) parts.push('negative: ' + negative);
            const assembled = parts.filter(Boolean).join(' + ');
            builderOutput.dataset.copy = assembled;
            builderOutput.textContent = assembled;
            updateNotesCount();
            return assembled;
        }

        restoreBuilderState();
        assemble();
        if (store.get(BUILDER_STORE) && saveStatus) saveStatus.textContent = 'Saved in this browser';
        else if (saveStatus) saveStatus.textContent = 'Local-only builder';

        builderForm.addEventListener('change', () => {
            assemble();
            renderScore();
            scheduleSave();
        });
        notesInput?.addEventListener('input', () => {
            assemble();
            renderScore();
            scheduleSave();
        });
        builderForm.addEventListener('submit', (event) => event.preventDefault());

        const DIMS = [
            { key: 'subject', label: 'Subject / action' },
            { key: 'lighting', label: 'Lighting' },
            { key: 'lens', label: 'Lens / DOF' },
            { key: 'style', label: 'Style anchor' },
            { key: 'quality', label: 'Quality tier' },
            { key: 'negation', label: 'Negation' },
        ];
        const scoreGrid = $('#scoreGrid');
        const scoreOverall = $('#scoreOverall');
        const scoreRecommendation = $('#scoreRecommendation');
        let lastScores = {};

        function dimScore(dimension, positives, negative) {
            const text = positives.toLowerCase();
            if (dimension.key === 'subject') {
                const selected = $('#bSubject')?.value.trim() || '';
                return selected.length >= 18 ? 100 : selected.length ? 60 : 20;
            }
            if (dimension.key === 'lighting') {
                if (/(rembrandt|butterfly|split|loop|rim|golden hour|window light)/.test(text)) return 100;
                return text.includes('light') ? 60 : 30;
            }
            if (dimension.key === 'lens') {
                const focal = /\b\d{2,3}mm\b/.test(text);
                const aperture = /f\/\d/.test(text);
                return focal && aperture ? 100 : focal || aperture ? 60 : 25;
            }
            if (dimension.key === 'style') {
                if (/(quiet luxury|editorial|documentary|noir|anamorphic|cinematic still)/.test(text)) return 100;
                return /(photorealistic|hyperrealistic)/.test(text) ? 45 : 30;
            }
            if (dimension.key === 'quality') {
                if (/(8k|4k|native|subsurface)/.test(text)) return 100;
                return text.includes('1080p') ? 55 : 30;
            }
            if (dimension.key === 'negation') {
                if (!negative) return 15;
                return /:\s*(?:1\.[2-9]|[2-9](?:\.\d+)?)/.test(negative) ? 100 : 70;
            }
            return 30;
        }

        function renderScore() {
            if (!scoreGrid || !scoreOverall) return;
            const positives = getBuilderPositives();
            const negative = getBuilderNegative();
            lastScores = {};
            let total = 0;
            scoreGrid.replaceChildren(...DIMS.map((dimension) => {
                const score = dimScore(dimension, positives, negative);
                lastScores[dimension.label] = score;
                total += score;

                const meter = doc.createElement('div');
                meter.className = 'score-meter';
                const top = doc.createElement('div');
                top.className = 'score-meter-top';
                const name = doc.createElement('span');
                name.textContent = dimension.label;
                const value = doc.createElement('span');
                value.textContent = String(score);
                top.append(name, value);
                const bar = doc.createElement('div');
                bar.className = 'score-bar';
                const fill = doc.createElement('div');
                fill.className = 'score-fill' + (score >= 85 ? ' high' : '');
                fill.style.width = score + '%';
                fill.setAttribute('role', 'progressbar');
                fill.setAttribute('aria-valuemin', '0');
                fill.setAttribute('aria-valuemax', '100');
                fill.setAttribute('aria-valuenow', String(score));
                fill.setAttribute('aria-label', `${dimension.label}: ${score} out of 100`);
                bar.append(fill);
                meter.append(top, bar);
                return meter;
            }));
            const overall = Math.round(total / DIMS.length);
            scoreOverall.textContent = `${overall} / 100`;
            scoreOverall.setAttribute('aria-label', `Overall prompt score: ${overall} out of 100`);
            scoreOverall.classList.toggle('good', overall >= 80);
            scoreOverall.classList.toggle('mid', overall >= 55 && overall < 80);
            const missing = DIMS.filter((dimension) => lastScores[dimension.label] < 70).map((dimension) => dimension.label);
            if (scoreRecommendation) {
                scoreRecommendation.textContent = overall >= 85
                    ? 'Strong scaffold. Keep the negative list targeted and validate the output at the intended native resolution.'
                    : `Improve next: ${missing.join(', ') || 'add a clear delivery constraint'}.`;
            }
        }

        function resetBuilder() {
            builderForm.reset();
            if (notesInput) notesInput.value = '';
            assemble();
            renderScore();
            scheduleSave();
            $('#critiqueOut')?.replaceChildren();
            toast('Builder reset');
        }

        $('#copyPromptBtn')?.addEventListener('click', () => doCopy(builderOutput));
        $('#builderRandom')?.addEventListener('click', () => {
            builderSelects.forEach((select) => {
                const options = Array.from(select.options);
                if (options.length) select.value = options[Math.floor(Math.random() * options.length)].value;
            });
            assemble();
            renderScore();
            scheduleSave();
            toast('New prompt variation');
        });
        $('#builderReset')?.addEventListener('click', resetBuilder);

        $('#copyScoreBtn')?.addEventListener('click', async () => {
            const lines = [
                'AI Practitioner Skills Framework — Prompt Score Report',
                '---',
                'Prompt: ' + (builderOutput.dataset.copy || ''),
                '',
                'Overall: ' + (scoreOverall?.textContent || '—'),
                '',
            ];
            DIMS.forEach((dimension) => lines.push(`${dimension.label}: ${lastScores[dimension.label] ?? '—'}`));
            lines.push('', 'Scoring doctrine: named lighting, real lens specifications, specific style anchors, native resolution, and targeted weighted negation.', 'Generated by the Scaffold Builder (v5.2)', 'https://marktantongco.github.io/aiskills-photog/');
            try {
                if (await copyText(lines.join('\n'))) toast('Score report copied');
                else toast('Copy failed — select the report manually', true);
            } catch { toast('Copy failed — select the report manually', true); }
        });

        /* ----------------------------------------------------
           Optional LLM critique via Google AI (Gemini).
           A server proxy is opt-in through <meta name="critique-proxy">.
           Static hosts never probe an undeclared endpoint.
        ---------------------------------------------------- */
        const KEY_STORE = 'aisf.gemini.key';
        const PROXY_DEAD = 'aisf.proxy.dead';
        let pendingKey = '';
        let critiqueRun = 0;
        let critiqueController = null;
        const keyInput = $('#geminiKey');
        const engineLabel = $('#critiqueEngine');
        const critiqueOut = $('#critiqueOut');
        const critiqueButton = $('#critiqueBtn');

        function proxyUrl() {
            const declared = ($('meta[name="critique-proxy"]')?.getAttribute('content') || '').trim();
            if (!declared || store.get(PROXY_DEAD) === '1') return '';
            try {
                const url = new URL(declared, location.href);
                return /^https?:$/.test(url.protocol) ? url.href : '';
            } catch { return ''; }
        }

        function savedKey() { return store.get(KEY_STORE) || pendingKey; }

        function syncEngineLabel() {
            if (!engineLabel) return;
            if (proxyUrl()) engineLabel.textContent = '(server proxy)';
            else if (savedKey()) engineLabel.textContent = '(Gemini connected — browser key)';
            else engineLabel.textContent = '(heuristic mode — add a key below)';
        }

        const CRITIQUE_SYSTEM = 'You are an expert critic of AI image-generation prompts. Judge this prompt against professional doctrine: structured scaffold order, named lighting patterns, real lens vocabulary, specific style anchors, native resolution tiers, and weighted negative prompting. Be concise.\n\nReply exactly in this format:\nScore: X/10\nStrengths: …\nImprove: …';

        async function fetchWithTimeout(url, options = {}) {
            const controller = window.AbortController ? new window.AbortController() : null;
            const init = { ...options };
            if (controller) {
                init.signal = controller.signal;
                critiqueController = controller;
            }
            const timer = window.setTimeout(() => controller?.abort(), 20000);
            try { return await window.fetch(url, init); }
            finally {
                window.clearTimeout(timer);
                if (critiqueController === controller) critiqueController = null;
            }
        }

        async function callGeminiDirect(text, key) {
            if (!key) throw new Error('no Gemini key saved for this browser');
            const response = await fetchWithTimeout(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
                {
                    method: 'POST',
                    referrerPolicy: 'no-referrer',
                    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
                    body: JSON.stringify({ contents: [{ parts: [{ text: CRITIQUE_SYSTEM + '\n\nPROMPT: ' + text }] }] }),
                },
            );
            if (!response.ok) throw new Error('Google returned HTTP ' + response.status);
            const data = await response.json();
            const reply = data?.candidates?.[0]?.content?.parts?.map((part) => part?.text || '').join('').trim();
            if (!reply) throw new Error('Google returned an empty response');
            return reply;
        }

        async function callProxy(text) {
            const url = proxyUrl();
            if (!url) throw new Error('no proxy declared for this host');
            const response = await fetchWithTimeout(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text }),
            });
            if (response.status === 404 || response.status === 405) {
                store.set(PROXY_DEAD, '1');
                syncEngineLabel();
                throw new Error('proxy is not available on this host');
            }
            if (!response.ok) throw new Error('proxy returned HTTP ' + response.status);
            const data = await response.json();
            if (data?.error) throw new Error(String(data.error));
            if (typeof data?.reply !== 'string' || !data.reply.trim()) throw new Error('proxy returned an empty response');
            return data.reply.trim();
        }

        async function runCritique() {
            if (!critiqueOut) return;
            const text = (builderOutput.dataset.copy || builderOutput.textContent || '').trim().slice(0, 6000);
            if (!text) {
                critiqueOut.textContent = 'Build a prompt first, then run the critique.';
                return;
            }
            const runId = ++critiqueRun;
            critiqueController?.abort();
            critiqueOut.textContent = 'Analyzing prompt…';
            if (critiqueButton) {
                critiqueButton.disabled = true;
                critiqueButton.textContent = 'Analyzing…';
            }
            try {
                let reply = '';
                let proxyError = null;
                if (proxyUrl()) {
                    try { reply = await callProxy(text); } catch (error) { proxyError = error; }
                }
                if (!reply) {
                    const key = savedKey();
                    if (!key) throw proxyError || new Error('no Gemini key saved for this browser');
                    reply = await callGeminiDirect(text, key);
                }
                if (runId === critiqueRun) critiqueOut.textContent = reply;
            } catch (error) {
                if (runId !== critiqueRun) return;
                const message = error?.name === 'AbortError'
                    ? 'The critique timed out. The offline score above remains available.'
                    : `LLM critique unavailable. ${error?.message || 'Try again later'} The offline score above remains available.`;
                critiqueOut.textContent = message;
            } finally {
                if (runId === critiqueRun && critiqueButton) {
                    critiqueButton.disabled = false;
                    critiqueButton.textContent = 'Run AI Critique';
                }
            }
        }

        function saveKey() {
            const key = keyInput?.value.trim() || '';
            if (!key) { toast('Paste a key first', true); return; }
            if (key.length > 256) { toast('That key is too long', true); return; }
            const persisted = store.set(KEY_STORE, key);
            if (!persisted) pendingKey = key;
            else pendingKey = '';
            if (keyInput) keyInput.value = '';
            syncEngineLabel();
            toast(persisted ? 'API key saved to this browser' : 'Storage unavailable — key kept for this page only');
        }

        function initCritique() {
            if (!keyInput || !engineLabel || !critiqueOut) return;
            syncEngineLabel();
            $('#saveKeyBtn')?.addEventListener('click', saveKey);
            keyInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    saveKey();
                }
            });
            $('#clearKeyBtn')?.addEventListener('click', () => {
                critiqueController?.abort();
                store.del(KEY_STORE);
                store.del(PROXY_DEAD);
                pendingKey = '';
                if (keyInput) keyInput.value = '';
                syncEngineLabel();
                toast('API key removed');
            });
            critiqueButton?.addEventListener('click', async () => {
                if (!savedKey() && !proxyUrl()) {
                    critiqueOut.textContent = 'No API key saved — the live heuristic score above is your baseline. Add a Gemini key below to enable the LLM second opinion.';
                    $('#critiqueBox')?.setAttribute('open', '');
                    keyInput.focus();
                    return;
                }
                await runCritique();
            });
        }
        initCritique();

        renderScore();
    }
})();
