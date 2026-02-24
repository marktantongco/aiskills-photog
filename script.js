document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const topnav = document.getElementById('topnav');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const sections = document.querySelectorAll('.section');
    const codeBlocks = document.querySelectorAll('.code-block');
    const navLinkItems = document.querySelectorAll('.nav-links a');

    // Scroll handling for nav
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            topnav.classList.add('scrolled');
        } else {
            topnav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // Active nav link on scroll
    const sectionObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Reveal animations
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, revealOptions);

    sections.forEach(section => {
        revealObserver.observe(section);
    });

    // Copy code blocks
    codeBlocks.forEach(block => {
        block.addEventListener('click', async () => {
            const code = block.textContent;
            try {
                await navigator.clipboard.writeText(code);
                block.style.borderColor = 'var(--accent)';
                setTimeout(() => {
                    block.style.borderColor = 'var(--code-border)';
                }, 1000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax effect for hero orbs
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const orbs = document.querySelectorAll('.glow-orb');
                
                orbs.forEach((orb, index) => {
                    const speed = (index + 1) * 0.05;
                    orb.style.transform = `translateY(${scrolled * speed}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });

    // Add keyboard navigation for sections
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const currentSection = [...sections].find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top <= 150 && rect.bottom > 150;
            });
            
            if (currentSection) {
                const sectionIndex = [...sections].indexOf(currentSection);
                let targetIndex;
                
                if (e.key === 'ArrowDown') {
                    targetIndex = Math.min(sectionIndex + 1, sections.length - 1);
                } else {
                    targetIndex = Math.max(sectionIndex - 1, 0);
                }
                
                const targetId = sections[targetIndex].getAttribute('id');
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });

    // Add visible class to hero immediately
    document.querySelector('.hero').classList.add('visible');
});
