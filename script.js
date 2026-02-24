document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const progressBar = document.getElementById('progressBar');
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const dots = document.querySelectorAll('.dot');
    const sections = document.querySelectorAll('.snap-section');
    const codeBlocks = document.querySelectorAll('.code-mini');
    const menuLinks = document.querySelectorAll('.menu-content a');

    // Touch handling for swipe navigation
    let touchStartY = 0;
    let touchEndY = 0;
    const MIN_SWIPE = 50;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeDistance = touchStartY - touchEndY;
        
        if (Math.abs(swipeDistance) < MIN_SWIPE) return;
        
        const currentSection = getCurrentSection();
        const sectionIndex = parseInt(currentSection.dataset.index);
        
        if (swipeDistance > 0 && sectionIndex < sections.length - 1) {
            // Swipe up - go to next section
            goToSection(sectionIndex + 1);
        } else if (swipeDistance < 0 && sectionIndex > 0) {
            // Swipe down - go to previous section
            goToSection(sectionIndex - 1);
        }
    }

    function getCurrentSection() {
        let current = sections[0];
        const scrollPos = window.scrollY + window.innerHeight / 2;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                current = section;
            }
        });
        
        return current;
    }

    function goToSection(index) {
        const target = sections[index];
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Progress bar
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Active section detection
    function updateActiveSection() {
        const current = getCurrentSection();
        const index = parseInt(current.dataset.index);
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Scroll handler with throttling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgress();
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Mobile menu toggle
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (mobileMenu.classList.contains('open')) {
            if (e.key === 'Escape') {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            }
            return;
        }
        
        const currentIndex = parseInt(getCurrentSection().dataset.index);
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentIndex < sections.length - 1) {
                goToSection(currentIndex + 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                goToSection(currentIndex - 1);
            }
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSection(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSection(sections.length - 1);
        }
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSection(index);
        });
    });

    // Copy code blocks
    codeBlocks.forEach(block => {
        block.addEventListener('click', async () => {
            const code = block.textContent;
            try {
                await navigator.clipboard.writeText(code);
                block.style.color = 'var(--accent)';
                setTimeout(() => {
                    block.style.color = '';
                }, 1000);
            } catch (err) {
                console.error('Copy failed:', err);
            }
        });
    });

    // Initialize
    updateProgress();
    updateActiveSection();

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateActiveSection();
        }, 100);
    });
});
