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
    // 2. MAIN SCROLL TIMELINE (Smooth Shrink & Reveal)
    // ==========================================
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "+=2000",
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });

    // Step 1: Slide out hero elements (text, buttons, bottom bar, and nav links)
    tl.to(".hero-section .hero-content, .hero-tab-button, .bottom-bar, .navbar", {
        y: -150,
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
        stagger: 0.1
    }, 0);

    // Step 1b: Fixed header slides into flush position
    tl.to("#fixed-header", {
        y: -20,
        duration: 1.0,
        ease: "power2.out"
    }, 0);

    // Step 2: Fade in the marquees container behind ONLY when shrinking starts
    tl.to(".marquee-container", {
        opacity: 1,
        duration: 1.0,
        ease: "none"
    }, 1.0);

    // Step 3: Scale down the background picture layer to a "little screen"
    tl.to(".hero-bg-layer", {
        scale: 0.35,
        borderRadius: "20px",
        duration: 2,
        ease: "power2.inOut"
    }, 1.0);

    // Step 4: Slide up the centered logo
    tl.to(".centered-logo", {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out"
    }, 2.0);

    // ==========================================
    // 4. RESIDENT DJ SECTION ANIMATIONS
    // ==========================================
    const residentRows = gsap.utils.toArray(".resident-row");

    // Reveal the Resident Title and the First DJ smoothly based on scroll position
    gsap.from(".resident-title", {
        scrollTrigger: {
            trigger: ".resident-section",
            start: "top 90%", // Triggers when the section is 90% down the viewport
            end: "top 50%",   // Finishes when section is 50% down
            scrub: 1          // Smooth scroll-driven animation
        },
        y: 80,
        opacity: 0,
        scale: 0.95,
        ease: "none"
    });

    // ==========================================
    // 4. RESIDENT DJ SECTION ANIMATIONS
    // ==========================================
    const residentCards = gsap.utils.toArray(".resident-card");

    // Reveal the Resident Title smoothly based on scroll position
    gsap.from(".resident-title", {
        scrollTrigger: {
            trigger: ".resident-section",
            start: "top 90%",
            end: "top 50%",
            scrub: 1
        },
        y: 80,
        opacity: 0,
        scale: 0.95,
        ease: "none"
    });

    // Stagger fade-up the resident cards
    if (residentCards.length > 0) {
        gsap.from(residentCards, {
            scrollTrigger: {
                trigger: ".resident-grid",
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        });
    }

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

});
