document.addEventListener("DOMContentLoaded", () => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 1. MARQUEE SETUP
    // ==========================================
    const marquees = document.querySelectorAll('.marquee');
    marquees.forEach(marquee => {
        const span = marquee.querySelector('span');
        const clone = span.cloneNode(true);
        marquee.appendChild(clone);
    });

    gsap.set(".marquee-bold span", { xPercent: 0 });
    gsap.set(".marquee-red span", { xPercent: -50 });
    gsap.set(".centered-logo", { xPercent: -50, yPercent: -50, y: 150, opacity: 0 });

    gsap.to(".marquee-bold span", {
        xPercent: -50, repeat: -1, duration: 15, ease: "none"
    });
    gsap.to(".marquee-red span", {
        xPercent: 0, repeat: -1, duration: 15, ease: "none"
    });

    // ==========================================
    // 2. MAIN SCROLL TIMELINE (teljes kepernyos hero -> logo felcsuszas -> kartya racsuszas)
    // ==========================================
    const shapeState = { smooth: 0 };
    function buildHeroPath(smooth) {
        const el = document.querySelector(".hero-bg-layer");
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const r = 5 * (1 - smooth);
        const cx = w / 2;
        const narrow = window.innerWidth <= 1200;
        const baseT = narrow ? { o: 120, i: 90, d: 40 } : { o: 500, i: 440, d: 70 };
        const baseB = narrow ? { h: 70, o: 180, i: 140 } : { h: 100, o: 220, i: 160 };
        const k = 1 - smooth;
        const t = { o: baseT.o, i: baseT.i, d: baseT.d * k };
        const b = { h: baseB.h * k, o: baseB.o, i: baseB.i };
        const yb = h - b.h;
        return `path('M 0 ${r} A ${r} ${r} 0 0 1 ${r} 0 ` +
            `L ${cx - t.o} 0 L ${cx - t.i} ${t.d} L ${cx + t.i} ${t.d} L ${cx + t.o} 0 ` +
            `L ${w - r} 0 A ${r} ${r} 0 0 1 ${w} ${r} ` +
            `L ${w} ${yb - r} A ${r} ${r} 0 0 1 ${w - r} ${yb} ` +
            `L ${cx + b.o} ${yb} L ${cx + b.i} ${h} L ${cx - b.i} ${h} L ${cx - b.o} ${yb} ` +
            `L ${r} ${yb} A ${r} ${r} 0 0 1 0 ${yb - r} Z')`;
    }
    function applyHeroShape() {
        const el = document.querySelector(".hero-bg-layer");
        if (!el) return;
        const p = buildHeroPath(shapeState.smooth);
        el.style.clipPath = p;
        el.style.webkitClipPath = p;
    }
    applyHeroShape();
    window.addEventListener("resize", applyHeroShape);

    const heroSpacer = document.querySelector(".hero-card-spacer");

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: () => "+=" + ((heroSpacer ? heroSpacer.offsetHeight : 0) + window.innerHeight),
            scrub: 1,
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });

    tl.to(".hero-section .hero-content, .hero-tab-button, .navbar", {
        y: -100, opacity: 0, duration: 0.10, ease: "power2.inOut", stagger: 0.03
    }, 0);

    tl.to("#fixed-header", { y: -20, duration: 0.08, ease: "power2.out" }, 0);

    tl.to(".hero-container", {
        top: 0, left: 0, right: 0, bottom: 0, duration: 0.20, ease: "power2.inOut"
    }, 0.07);
    tl.to(shapeState, { smooth: 1, duration: 0.20, ease: "power2.inOut", onUpdate: applyHeroShape }, 0.07);

    tl.to(".centered-logo", { y: 0, opacity: 1, duration: 0.22, ease: "power2.out" }, 0.25);

    // HOLD - amig ezt gorgetjuk, a logo mar nyugalmi allapotban van, mielott a kovetkezo szekcio racsuszna
    tl.to({}, { duration: 0.455 }, 0.545);

    // ==========================================
    // 3. CONTACT SECTION ANIMATIONS
    // ==========================================
    gsap.from(".contact-title", {
        scrollTrigger: {
            trigger: ".contact-section",
            start: "top 90%",
            end: "top 50%",
            scrub: 1
        },
        y: 80, opacity: 0, scale: 0.95, ease: "none"
    });

    gsap.from(".contact-tabs", {
        scrollTrigger: {
            trigger: ".contact-section",
            start: "top 80%",
        },
        y: 40, opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.2
    });

    gsap.from(".contact-form.active", {
        scrollTrigger: {
            trigger: ".contact-section",
            start: "top 70%",
        },
        y: 40, opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.4
    });

    // ==========================================
    // 4. HAMBURGER MENU LOGIC
    // ==========================================
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const menuLinks = document.querySelectorAll('.menu-nav-links a');
    
    function closeMenu() {
        if (!document.body.classList.contains('menu-open')) return;
        document.body.classList.add('menu-closing');
        document.body.classList.remove('menu-open');
        gsap.to(menuLinks, {
            x: -50, opacity: 0, duration: 0.3, stagger: -0.05, ease: "power2.in"
        });
        setTimeout(() => {
            document.body.classList.remove('menu-closing');
        }, 420);
    }

    hamburgerBtn.addEventListener('click', () => {
        const isOpen = document.body.classList.contains('menu-open');
        if (!isOpen) {
            document.body.classList.remove('menu-closing');
            document.body.classList.add('menu-open');
            gsap.to(menuLinks, {
                x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.1
            });
        } else {
            closeMenu();
        }
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ==========================================
    // 5. CONTACT FORM TAB SWITCHING
    // ==========================================
    const tabs = document.querySelectorAll('.contact-tab');
    const forms = document.querySelectorAll('.contact-form');
    const successMsg = document.getElementById('form-success');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Hide success message if shown
            successMsg.style.display = 'none';

            // Deactivate all tabs & forms
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));

            // Activate clicked tab & corresponding form
            tab.classList.add('active');
            const targetForm = document.getElementById(`form-${targetTab}`);
            targetForm.classList.add('active');

            // Re-trigger animation
            targetForm.style.animation = 'none';
            targetForm.offsetHeight; // force reflow
            targetForm.style.animation = '';

            // Recalculate scroll bounds for new content height
            ScrollTrigger.refresh();
        });
    });

    // ==========================================
    // 5b. WORK POSITION CONDITIONAL FIELDS
    // ==========================================
    const workPosSelect = document.getElementById('work-position');
    const workSocialFields = document.getElementById('work-social-fields');
    const workFileFields = document.getElementById('work-file-fields');
    const workFacebookInput = document.getElementById('work-facebook');
    const workInstagramInput = document.getElementById('work-instagram');

    function updateWorkFields() {
        if (!workPosSelect) return;
        const val = workPosSelect.value;
        if (val === 'promoter') {
            if (workSocialFields) workSocialFields.style.display = 'block';
            if (workFileFields) workFileFields.style.display = 'none';
            if (workFacebookInput) workFacebookInput.setAttribute('required', 'required');
            if (workInstagramInput) workInstagramInput.setAttribute('required', 'required');
        } else if (val === 'artist-care' || val === 'asszisztens') {
            if (workSocialFields) workSocialFields.style.display = 'none';
            if (workFileFields) workFileFields.style.display = 'block';
            if (workFacebookInput) {
                workFacebookInput.removeAttribute('required');
                workFacebookInput.style.borderColor = '';
            }
            if (workInstagramInput) {
                workInstagramInput.removeAttribute('required');
                workInstagramInput.style.borderColor = '';
            }
        } else {
            if (workSocialFields) workSocialFields.style.display = 'none';
            if (workFileFields) workFileFields.style.display = 'none';
            if (workFacebookInput) {
                workFacebookInput.removeAttribute('required');
                workFacebookInput.style.borderColor = '';
            }
            if (workInstagramInput) {
                workInstagramInput.removeAttribute('required');
                workInstagramInput.style.borderColor = '';
            }
        }
        ScrollTrigger.refresh();
    }

    if (workPosSelect) {
        workPosSelect.addEventListener('change', updateWorkFields);
    }

    // ==========================================
    // 6. FILE UPLOAD HANDLING
    // ==========================================
    const fileInputs = document.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        const area = input.closest('.file-upload-area');
        const content = area.querySelector('.file-upload-content');
        const selected = area.querySelector('.file-upload-selected');
        const fileName = area.querySelector('.file-name');
        const removeBtn = area.querySelector('.file-remove');

        input.addEventListener('change', () => {
            if (input.files.length > 0) {
                const file = input.files[0];
                // Check 10MB limit
                if (file.size > 10 * 1024 * 1024) {
                    alert('A fájl mérete nem lehet nagyobb mint 10MB.');
                    input.value = '';
                    return;
                }
                content.style.display = 'none';
                selected.style.display = 'flex';
                fileName.textContent = file.name;
                area.classList.add('has-file');
                ScrollTrigger.refresh();
            }
        });

        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                input.value = '';
                content.style.display = '';
                selected.style.display = 'none';
                area.classList.remove('has-file');
                ScrollTrigger.refresh();
            });
        }
    });

    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

    // ==========================================
    // 7. FORM SUBMISSION
    // ==========================================
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'var(--accent-red)';
                    field.addEventListener('input', () => {
                        field.style.borderColor = '';
                    }, { once: true });
                }
            });

            if (!isValid) return;

            // Show success message with animation
            forms.forEach(f => f.classList.remove('active'));
            tabs.forEach(t => t.style.opacity = '0.5');
            
            successMsg.style.display = 'block';
            gsap.fromTo(successMsg, 
                { opacity: 0, y: 30, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
            );

            // Reset after 4 seconds
            setTimeout(() => {
                successMsg.style.display = 'none';
                tabs.forEach(t => t.style.opacity = '');
                // Re-show the active tab's form
                const activeTab = document.querySelector('.contact-tab.active');
                const targetForm = document.getElementById(`form-${activeTab.dataset.tab}`);
                targetForm.classList.add('active');
                targetForm.reset();
                if (targetForm.id === 'form-work') {
                    updateWorkFields();
                }
            }, 4000);
        });
    });

});
