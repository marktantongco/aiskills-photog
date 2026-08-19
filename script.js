
        // Theme
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next === 'light' ? '' : next);
            localStorage.setItem('theme', next === 'light' ? '' : next);
        });

        // Mobile Menu
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });

        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
            });
        });

        // Reveal Animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // Active Nav
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        const updateActive = (id) => {
            navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
            mobileLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
        };

        const sectionObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) updateActive(entry.target.id);
            });
        }, { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' });

        sections.forEach(s => sectionObs.observe(s));

        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
            });
        });

        // LoRA Studio
        const loraKey = 'loraStack';
        let loraStack = [];
        let loraSeq = 0;

        const loraBase = document.getElementById('loraBase');
        const loraNeg = document.getElementById('loraNeg');
        const loraList = document.getElementById('loraList');
        const loraOutWebui = document.getElementById('loraOutWebui');
        const loraOutComfy = document.getElementById('loraOutComfy');
        const loraOutPrompt = document.getElementById('loraOutPrompt');

        function loraLoad() {
            try {
                const saved = JSON.parse(localStorage.getItem(loraKey));
                if (Array.isArray(saved) && saved.length) { loraStack = saved; return; }
            } catch (e) {}
            loraStack = [{ id: ++loraSeq, name: 'analogFilm', cat: 'style', strength: 0.7, trigger: 'filmGrain', enabled: true }];
        }

        function loraSave() {
            try { localStorage.setItem(loraKey, JSON.stringify(loraStack)); } catch (e) {}
        }

        function loraAdd(preset) {
            const p = preset || { name: '', cat: 'style', strength: 0.8, trigger: '' };
            loraStack.push({ id: ++loraSeq, name: p.name, cat: p.cat, strength: p.strength, trigger: p.trigger || '', enabled: true });
            renderLoraList();
            loraSave();
        }

        function loraRemove(id) {
            loraStack = loraStack.filter(l => l.id !== id);
            renderLoraList();
            loraSave();
        }

        function escapeAttr(s) {
            return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
        }

        function renderLoraList() {
            loraList.innerHTML = '';
            if (!loraStack.length) {
                loraList.innerHTML = '<p class="lora-empty">No LoRAs added. Use a preset or + Add LoRA.</p>';
            }
            loraStack.forEach(l => {
                const cats = ['style', 'character', 'concept', 'aesthetic'];
                const slot = document.createElement('div');
                slot.className = 'lora-slot';
                slot.innerHTML =
                    '<div class="lora-slot-top">' +
                        '<input class="lora-name" placeholder="LoRA name (e.g. filmGrain)" value="' + escapeAttr(l.name) + '">' +
                        '<input class="lora-trigger" placeholder="trigger" value="' + escapeAttr(l.trigger || '') + '">' +
                        '<select class="lora-cat">' +
                            cats.map(c => '<option value="' + c + '"' + (c === l.cat ? ' selected' : '') + '>' + c.charAt(0).toUpperCase() + c.slice(1) + '</option>').join('') +
                        '</select>' +
                        '<button class="lora-remove" title="Remove">&times;</button>' +
                    '</div>' +
                    '<div class="lora-slot-bottom">' +
                        '<input type="range" class="lora-strength" min="0" max="1.5" step="0.05" value="' + l.strength + '">' +
                        '<span class="lora-strength-val">' + Number(l.strength).toFixed(2) + '</span>' +
                        '<label class="lora-toggle"><input type="checkbox" class="lora-enabled"' + (l.enabled ? ' checked' : '') + '> on</label>' +
                    '</div>';

                const nameInput = slot.querySelector('.lora-name');
                const triggerInput = slot.querySelector('.lora-trigger');
                const catSel = slot.querySelector('.lora-cat');
                const range = slot.querySelector('.lora-strength');
                const valSpan = slot.querySelector('.lora-strength-val');
                const enabled = slot.querySelector('.lora-enabled');

                nameInput.addEventListener('input', () => { l.name = nameInput.value; updateLoraOutput(); loraSave(); });
                triggerInput.addEventListener('input', () => { l.trigger = triggerInput.value; updateLoraOutput(); loraSave(); });
                catSel.addEventListener('change', () => { l.cat = catSel.value; loraSave(); });
                range.addEventListener('input', () => { l.strength = parseFloat(range.value); valSpan.textContent = l.strength.toFixed(2); updateLoraOutput(); loraSave(); });
                enabled.addEventListener('change', () => { l.enabled = enabled.checked; updateLoraOutput(); loraSave(); });
                slot.querySelector('.lora-remove').addEventListener('click', () => loraRemove(l.id));

                loraList.appendChild(slot);
            });
            updateLoraOutput();
        }

        function updateLoraOutput() {
            const active = loraStack.filter(l => l.enabled && l.name.trim());
            const webui = active.map(l => '<lora:' + l.name.trim() + ':' + l.strength.toFixed(2) + '>').join('');
            const comfy = active.map(l => '  {"type": "lora", "name": "' + l.name.trim() + '", "strength": ' + l.strength.toFixed(2) + '}').join(',\n');
            const triggers = active.filter(l => l.trigger && l.trigger.trim()).map(l => l.trigger.trim()).join(', ');
            const base = loraBase.value.trim();
            const neg = (typeof loraNeg !== 'undefined' && loraNeg) ? loraNeg.value.trim() : '';
            loraOutWebui.textContent = webui || '(no active LoRAs)';
            loraOutComfy.textContent = active.length ? '[\n' + comfy + '\n]' : '[ ]';
            let full = base;
            if (triggers) full += (full ? ' + ' : '') + triggers;
            if (webui) full += (full ? ' ' : '') + webui;
            if (!full.trim()) full = '(enter a base prompt)';
            if (neg) full += '\nNegative: ' + neg;
            loraOutPrompt.textContent = full;
        }

        loraLoad();
        loraBase.addEventListener('input', updateLoraOutput);
        if (typeof loraNeg !== 'undefined' && loraNeg) loraNeg.addEventListener('input', updateLoraOutput);
        document.getElementById('loraAdd').addEventListener('click', () => loraAdd());
        document.querySelectorAll('.lora-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const parts = chip.dataset.preset.split(':');
                const name = parts[0], cat = parts[1], strength = parseFloat(parts[2]);
                const trigger = parts[3] || '';
                loraAdd({ name, cat, strength, trigger });
            });
        });
        renderLoraList();

        document.querySelectorAll('.lora-copy').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = document.getElementById(btn.dataset.target);
                if (!target) return;
                navigator.clipboard.writeText(target.textContent).then(() => {
                    btn.classList.add('copied');
                    btn.textContent = 'COPIED';
                    setTimeout(() => { btn.classList.remove('copied'); btn.textContent = 'COPY'; }, 1500);
                });
            });
        });

        // Copy
        function copyToClipboard(text, el) {
            navigator.clipboard.writeText(text).then(() => {
                el.classList.add('copied');
                setTimeout(() => el.classList.remove('copied'), 1800);
            });
        }

        document.querySelectorAll('.card-code').forEach(el => {
            el.addEventListener('click', () => copyToClipboard(el.dataset.copy || el.textContent, el));
        });

        document.querySelectorAll('.template-body pre').forEach(el => {
            el.addEventListener('click', () => copyToClipboard(el.dataset.copy || el.textContent, el));
        });
