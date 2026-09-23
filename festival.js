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

    // Initial marquee and logo positions
    gsap.set(".marquee-bold span", { xPercent: 0 });
    gsap.set(".marquee-red span", { xPercent: -50 });
    gsap.set(".centered-logo", { xPercent: -50, yPercent: -50, y: 150, opacity: 0 });

    // Endless marquee loops (independent of scroll)
    gsap.to(".marquee-bold span", {
        xPercent: -50,
        repeat: -1,
        duration: 15,
        ease: "none"
    });

    gsap.to(".marquee-red span", {
        xPercent: 0,
        repeat: -1,
        duration: 15,
        ease: "none"
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

    // Step 1: Slide out hero elements (text, buttons, and nav links)
    tl.to(".hero-section .hero-content, .hero-tab-button, .navbar", {
        y: -100, opacity: 0, duration: 0.10, ease: "power2.inOut", stagger: 0.03
    }, 0);

    // Step 1b: Fixed header slides into flush position
    tl.to("#fixed-header", { y: -20, duration: 0.08, ease: "power2.out" }, 0);

    // Step 2: A hero-container teljes kepernyossé no, a polygon egyszerre elsimul
    tl.to(".hero-container", {
        top: 0, left: 0, right: 0, bottom: 0, duration: 0.20, ease: "power2.inOut"
    }, 0.07);
    tl.to(shapeState, { smooth: 1, duration: 0.20, ease: "power2.inOut", onUpdate: applyHeroShape }, 0.07);

    // Step 3: A logo felcsuszik a helyere
    tl.to(".centered-logo", { y: 0, opacity: 1, duration: 0.22, ease: "power2.out" }, 0.25);

    // HOLD - amig ezt gorgetjuk, a logo mar nyugalmi allapotban van, mielott a kovetkezo szekcio racsuszna
    tl.to({}, { duration: 0.455 }, 0.545);



    // ==========================================
    // 5. HAMBURGER MENU LOGIC (identical to main page)
    // ==========================================
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const menuLinks = document.querySelectorAll('.menu-nav-links a');
    
    function closeMenu() {
        if (!document.body.classList.contains('menu-open')) return;
        
        document.body.classList.add('menu-closing');
        document.body.classList.remove('menu-open');
        gsap.to(menuLinks, {
            x: -50,
            opacity: 0,
            duration: 0.3,
            stagger: -0.05,
            ease: "power2.in"
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
                x: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.1
            });
        } else {
            closeMenu();
        }
    });

    // Close menu when a link is clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- GALLERY ANIMATION ---
    const galleryTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".gallery-section",
            start: "top top",
            end: "+=2500",
            pin: true,
            scrub: 1,
            anticipatePin: 1
        }
    });

    const isMobile = window.innerWidth <= 768;

    // 1. Shrink hero image to center and fade out the top overlay title
    galleryTl.to(".gallery-center", {
        width: isMobile ? "86vw" : "35vw",
        height: isMobile ? "24vh" : "80vh",
        y: isMobile ? "-26vh" : "0",
        borderRadius: "20px",
        duration: 1,
        ease: "power2.inOut"
    }, 0);

    galleryTl.to(".gallery-overlay-top", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
    }, 0);

    if (isMobile) {
        // Mobile: slide in left column (containing 2 images) from below
        galleryTl.fromTo(".col-left", {
            y: "50vh", // Start offscreen from bottom
            opacity: 0
        }, {
            y: "-12vh", // Shift up to sit exactly below the top image
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, 0.5);
    } else {
        // Desktop: Slide in left column from left
        galleryTl.fromTo(".col-left", {
            x: -300,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, 0.5);

        // Desktop: Slide in right column from right
        galleryTl.fromTo(".col-right", {
            x: 300,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, 0.5);
    }

    // 4. Fade in CTA button
    galleryTl.to(".gallery-cta-wrapper", {
        opacity: 1,
        y: -20,
        duration: 0.5
    }, 1.0);

    // Pause for a bit so the user can enjoy the gallery layout
    galleryTl.to({}, { duration: 1.5 });

});

// Ensure ScrollTrigger recalculates after all images are loaded
window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});

// --- COUNTDOWN TIMER ---
document.addEventListener("DOMContentLoaded", () => {
    const targetDate = new Date("2027-05-15T00:00:00").getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            document.getElementById("countdown-timer").innerHTML = "ELKEZDŐDÖTT!";
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById("days").innerText = days.toString().padStart(3, "0");
        document.getElementById("hours").innerText = hours.toString().padStart(2, "0");
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, "0");
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, "0");
    }
    
    setInterval(updateCountdown, 1000);
    updateCountdown();
});
