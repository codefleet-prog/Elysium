document.addEventListener("DOMContentLoaded", () => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Clone marquee spans to allow seamless scrolling
    const marquees = document.querySelectorAll('.marquee');
    marquees.forEach(marquee => {
        const span = marquee.querySelector('span');
        const clone = span.cloneNode(true);
        marquee.appendChild(clone);
    });

    // Set initial states for elements that GSAP will control
    gsap.set(".centered-logo", { xPercent: -50, yPercent: -50, y: 150, opacity: 0 });
    gsap.set(".marquee-bold span", { xPercent: 0 });
    gsap.set(".marquee-red span", { xPercent: -50 });

    // Create the main scroll timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "+=2000", // The scroll distance to complete the animation (2000px makes it very smooth)
            scrub: 1,      // Smooth scrubbing (takes 1 sec to catch up to scroll)
            pin: true,     // Pin the hero section while scrolling
            anticipatePin: 1 // Prevents visual snapping/jumping when the pin starts and ends
        }
    });

    // Step 1: Slide out hero elements (text, buttons, bottom bar, and nav links)
    tl.to(".hero-section .hero-content, .hero-section .hero-tab-button, .hero-section .bottom-bar, .hero-section .navbar", {
        y: -150,
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
        stagger: 0.1
    }, 0);

    // Step 1.5: Slide the fixed header upwards into its permanent flush position
    tl.to("#fixed-header", {
        y: -20, // Starts at 20px down, sliding -20px makes it perfectly flush with the top
        duration: 1.0,
        ease: "power2.out"
    }, 0);

    // Step 2: Fade in the marquees container behind ONLY when shrinking starts
    tl.to(".marquee-container", {
        opacity: 1,
        duration: 1
    }, 1.0);

    // Endless marquee loops (independent of scroll position, moving on their own)
    gsap.to(".marquee-bold span", {
        xPercent: -50, // Move left
        repeat: -1,
        duration: 15,
        ease: "none"
    });

    gsap.to(".marquee-red span", {
        xPercent: 0, // Move right (from -50 to 0)
        repeat: -1,
        duration: 15,
        ease: "none"
    });

    // Step 4: Scale down the background picture layer to a "little screen"
    tl.to(".hero-bg-layer", {
        scale: 0.35, // Shrink to 35% size
        borderRadius: "20px",
        duration: 2,
        ease: "power2.inOut"
    }, 1.0); // Starts when the marquee fades in

    // Step 5: Slide up the Elysium logo
    tl.to(".centered-logo", {
        y: 0, // Move exactly into the center
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out"
    }, 2.0); // Starts after picture scaling has progressed

    // --- ABOUT SECTION SCROLL ANIMATIONS (PINNED DECK) ---
    const aboutRows = gsap.utils.toArray(".about-row");

    // Pin the entire about section for 2000px of scrolling
    const aboutTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".about-section",
            start: "top top", // Pin when the top of the section hits the top of viewport
            end: "+=2000",    // Pin duration
            scrub: 1,         // Smooth scrubbing
            pin: true,        // Pin the section
            anticipatePin: 1  // Prevent snapping
        }
    });

    // Phase 1: Slide Row 1 out to the left to reveal Row 2
    if (aboutRows.length > 1) {
        aboutTl.to(aboutRows[0], {
            xPercent: -100, // Slide completely out of view
            ease: "power2.inOut",
            duration: 1
        });
        
        // Add a slight parallax to the image inside Row 1 as it leaves
        const img1 = aboutRows[0].querySelector(".parallax-img");
        if (img1) {
            aboutTl.to(img1, { xPercent: 30, duration: 1 }, "<");
        }
    }

    // Phase 2: Slide Row 2 out to the left to reveal Row 3
    if (aboutRows.length > 2) {
        aboutTl.to(aboutRows[1], {
            xPercent: -100,
            ease: "power2.inOut",
            duration: 1
        });

        // Add a slight parallax to the image inside Row 2 as it leaves
        const img2 = aboutRows[1].querySelector(".parallax-img");
        if (img2) {
            aboutTl.to(img2, { xPercent: 30, duration: 1 }, "<");
        }
    }

    // --- SLIDING SHAPE TRANSITION ---
    // Animates the black geometric shape to slide horizontally across the screen
    gsap.to(".about-slider-shape", {
        scrollTrigger: {
            trigger: ".events-section",
            start: "top bottom", // Starts when events section just enters viewport
            end: "top top",      // Ends when events section hits the top
            scrub: 1,
            invalidateOnRefresh: true // Recalculate on resize
        },
        x: () => (window.innerWidth * 0.35) + 200, // Calculates the exact distance to the right edge
        ease: "none"
    });

    // --- EVENTS REVEAL ANIMATION ---
    const eventCards = gsap.utils.toArray(".event-card");
    
    eventCards.forEach((card, i) => {
        // Alternate entrance directions based on index (even = from left, odd = from right)
        const startX = i % 2 === 0 ? -150 : 150;
        const skewAngle = i % 2 === 0 ? -15 : 15;

        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%", // Trigger when card is 85% down the viewport
                toggleActions: "play none none reverse" // Play on scroll down, reverse on scroll up
            },
            y: 200,
            x: startX,
            skewX: skewAngle,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out"
        });
    });

    // --- SCROLL-DRIVEN CONTACT TRANSITION (mirrors the Hero in reverse) ---
    // Hero:    full-screen → elements slide out → bg shrinks to card → logo appears
    // Contact: black blocks → small card slides in from right → scales up to full → elements slide in
    const sBlocks = gsap.utils.toArray(".s-block");

    // Hide contact elements — they appear in Phase 4
    gsap.set(".contact-section .contact-logo", { y: 150, opacity: 0 });
    gsap.set(".contact-section .hero-tab-button", { y: 150, opacity: 0 });
    gsap.set(".contact-section .c-item", { y: 80, opacity: 0 });
    gsap.set(".contact-section .s-icon", { y: 40, opacity: 0 });

    // Start the container small and shifted completely off-screen to the right
    gsap.set(".contact-container", {
        scale: 0.35,
        xPercent: 150, // 150% pushes it completely out of the right side of the viewport
        borderRadius: "20px"
    });

    // FIX: Make contact section position:fixed so it stays in viewport during the pin.
    // Without this, it scrolls out of view during the 4000px pin and nothing is visible.
    gsap.set(".contact-section", {
        position: "fixed",
        top: 0,
        left: 0,
        marginTop: 0,
        opacity: 0   // Invisible until Phase 1 fades it in
    });

    const loaderTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".events-section",
            start: "bottom bottom",
            end: "+=4000",
            pin: true,
            scrub: 1, // Restored 1-second smoothing for buttery feel
            anticipatePin: 1,
            onEnter: () => {
                gsap.set(".contact-section", {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    marginTop: 0
                });
            },
            onLeave: () => {
                gsap.set(".contact-section", {
                    position: "relative",
                    top: "auto",
                    left: "auto",
                    marginTop: "-100vh"
                });
            },
            onEnterBack: () => {
                gsap.set(".contact-section", {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    marginTop: 0
                });
            },
            onLeaveBack: () => {
                gsap.set(".contact-section", {
                    position: "relative",
                    top: "auto",
                    left: "auto",
                    marginTop: "-100vh"
                });
            }
        }
    });

    // Phase 1 (0 → 1.48): Black blocks slide up as visual curtain
    // 7 blocks * 0.08 stagger = 0.48 added to 1.0 duration = 1.48 total
    loaderTl.fromTo(sBlocks, 
        { y: "100%" },
        { y: "0%", duration: 1.0, stagger: 0.08, ease: "none" }, 
        0
    );

    // Show the contact section ONLY when the blocks have fully covered the screen (1.5)
    loaderTl.fromTo(".contact-section", 
        { opacity: 0 },
        { opacity: 1, duration: 0.01, ease: "none" }, 
        1.5
    );

    // Phase 2 (1.5 → 3.0): Contact container slides from right to center
    loaderTl.fromTo(".contact-container", 
        { xPercent: 150 },
        { xPercent: 0, duration: 1.5, ease: "power2.inOut" }, 
        1.5
    );

    // Phase 3 (3.0 → 4.5): Container scales up from card to full screen
    loaderTl.fromTo(".contact-container", 
        { scale: 0.35, borderRadius: "20px" },
        { scale: 1, borderRadius: "0px", duration: 1.5, ease: "power2.inOut" }, 
        3.0
    );

    // Phase 4 (4.5 → 6.3): Elements slide up into view — same style as hero section
    loaderTl.fromTo(".contact-section .contact-logo", 
        { y: 150, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power2.inOut" }, 
        4.5
    );

    loaderTl.fromTo(".contact-section .hero-tab-button", 
        { y: 150, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power2.inOut" }, 
        4.7
    );

    loaderTl.fromTo(".contact-section .c-item", 
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power2.inOut" }, 
        5.0
    );

    loaderTl.fromTo(".contact-section .s-icon", 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, stagger: 0.1, ease: "power2.inOut" }, 
        5.3
    );

    // --- HAMBURGER MENU LOGIC ---
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const menuLinks = document.querySelectorAll('.menu-nav-links a');
    
    hamburgerBtn.addEventListener('click', () => {
        document.body.classList.toggle('menu-open');
        
        if (document.body.classList.contains('menu-open')) {
            // Animate links in (slide from left)
            gsap.to(menuLinks, {
                x: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.1
            });
        } else {
            // Animate links out (slide back left)
            gsap.to(menuLinks, {
                x: -50,
                opacity: 0,
                duration: 0.3,
                stagger: -0.05,
                ease: "power2.in"
            });
        }
    });

});
