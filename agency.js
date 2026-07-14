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
    // 2. GLITCH SLICES GENERATION
    // ==========================================
    const SLICE_COUNT = 12;
    const glitchOverlay = document.getElementById('glitch-overlay');
    const heroBgLayer = document.querySelector('.hero-bg-layer');
    const slices = [];

    // Get the background image source from the hero
    const heroImg = document.querySelector('.hero-bg-img');
    const imgSrc = heroImg ? heroImg.src : 'assets/hero_rave.jpg';

    for (let i = 0; i < SLICE_COUNT; i++) {
        const slice = document.createElement('div');
        slice.classList.add('glitch-slice');

        const sliceHeight = 100 / SLICE_COUNT;
        slice.style.top = `${i * sliceHeight}%`;
        slice.style.height = `${sliceHeight}%`;
        
        const innerImg = document.createElement('img');
        innerImg.src = imgSrc;
        innerImg.classList.add('glitch-slice-img');
        innerImg.style.top = `-${i * 100}%`;
        
        slice.appendChild(innerImg);
        glitchOverlay.appendChild(slice);
        slices.push(slice);
    }

    // ==========================================
    // 3. MAIN SCROLL TIMELINE (Glitch Dissolve)
    // ==========================================
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "+=2500",
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });

    // --- Phase 1: Hero elements distorted exit (0 → 1.5) ---
    // Unlike the main page's clean slide-up, these elements SKEW and COMPRESS as they vanish
    tl.to(".hero-section .hero-content", {
        opacity: 0,
        skewX: -8,
        scaleY: 0.7,
        x: -50,
        duration: 1.2,
        ease: "power2.in"
    }, 0);

    tl.to(".hero-section .hero-tab-button", {
        opacity: 0,
        skewX: 5,
        scaleY: 0.8,
        y: 80,
        duration: 1.0,
        ease: "power2.in"
    }, 0.2);

    tl.to(".hero-section .bottom-bar", {
        opacity: 0,
        skewX: -6,
        x: -80,
        duration: 1.0,
        ease: "power2.in"
    }, 0.3);

    tl.to(".navbar", {
        opacity: 0,
        skewX: 8,
        x: 60,
        duration: 0.8,
        ease: "power2.in"
    }, 0.4);

    // Phase 1b: Fixed header slides into flush position
    tl.to("#fixed-header", {
        y: -20,
        duration: 1.0,
        ease: "power2.out"
    }, 0);

    // --- Phase 2: Activate glitch overlay (1.5 → 1.6) ---
    // Show the slices, hide the original bg layer
    tl.to(".glitch-overlay", {
        opacity: 1,
        duration: 0.1,
        ease: "none"
    }, 1.5);

    tl.to(".hero-bg-img", { // Fade out just the image, not the layer (preserves the red overlay and clip-path for slices)
        opacity: 0,
        duration: 0.1,
        ease: "none"
    }, 1.5);

    // --- Phase 3: Glitch movement (1.5 → 3.5) ---
    // Each slice shifts randomly on the x-axis with stagger
    slices.forEach((slice, i) => {
        const randomX = gsap.utils.random(-100, 100);
        const randomDelay = 1.5 + (i * 0.05);

        tl.to(slice, {
            x: randomX,
            duration: 2.0,
            ease: "power1.inOut"
        }, randomDelay);
    });

    // --- Phase 3b: Glitch brightness shift on alternating slices (2.0 → 3.0) ---
    slices.forEach((slice, i) => {
        if (i % 2 === 0) {
            tl.to(slice, {
                filter: "brightness(1.4) contrast(1.2)", // Bright
                duration: 1.0,
                ease: "none"
            }, 2.0);
        } else {
            tl.to(slice, {
                filter: "brightness(0.6) contrast(1.2)", // Dark
                duration: 1.0,
                ease: "none"
            }, 2.0);
        }
    });

    // --- Phase 3c: Marquee fade-in behind the gaps (2.0 → 3.0) ---
    tl.to(".marquee-container", {
        opacity: 1,
        duration: 1.0,
        ease: "none"
    }, 2.0);

    // --- Phase 3d: Logo slides up (2.5 → 4.0) ---
    tl.to(".centered-logo", {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out"
    }, 2.5);

    // --- Phase 4: Slices scatter and vanish (3.5 → 5.0) ---
    slices.forEach((slice, i) => {
        const scatterX = gsap.utils.random(-500, 500);
        const scatterY = gsap.utils.random(-200, 200);
        const scatterRotation = gsap.utils.random(-45, 45);
        const scatterDelay = 3.5 + (i * 0.04);

        tl.to(slice, {
            x: scatterX,
            y: scatterY,
            rotation: scatterRotation,
            scaleY: 0.2,
            opacity: 0,
            duration: 1.5,
            ease: "power2.in"
        }, scatterDelay);
    });

    // Fade out the entire background layer to remove the ::after dark red tint polygon
    tl.to(".hero-bg-layer", {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut"
    }, 4.0);

    // --- Phase 5: Next section content reveal (5.0 → 6.5) ---
    // These are triggered by the about section coming into view after unpin

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

    if (residentRows.length > 0) {
        gsap.from(residentRows[0], {
            scrollTrigger: {
                trigger: ".resident-section",
                start: "top 85%", 
                end: "top 40%",   
                scrub: 1          
            },
            y: 120,
            opacity: 0,
            scale: 0.95,
            ease: "none"
        });
    }

    // Pin the entire resident section for 1500px of scrolling
    const residentTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".resident-section",
            start: "top top", // Pin when the top of the section hits the top of viewport
            end: "+=1500",    // Pin duration
            scrub: 1,         // Smooth scrubbing
            pin: true,        // Pin the section
            anticipatePin: 1  // Prevent snapping
        }
    });

    // Phase 1: Slide DJ 1 out to the left to reveal DJ 2
    if (residentRows.length > 1) {
        // Make Row 2 visible instantly right before Row 1 starts sliding out
        residentTl.to(residentRows[1], { opacity: 1, duration: 0.01 });

        residentTl.to(residentRows[0], {
            xPercent: -100, // Slide completely out of view
            ease: "power2.inOut",
            duration: 1
        }, "<");
        
        // Add a slight parallax to the image inside Row 1 as it leaves
        const img1 = residentRows[0].querySelector(".parallax-img");
        if (img1) {
            residentTl.to(img1, { xPercent: 30, duration: 1 }, "<");
        }
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
