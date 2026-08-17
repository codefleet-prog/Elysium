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
    tl.to(".hero-section .hero-content, .hero-tab-button, .bottom-bar, .navbar", {
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

    // Reveal the About Title and the First Row smoothly based on scroll position
    gsap.from(".about-title", {
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 90%", // Triggers when the section is 90% down the viewport
            end: "top 50%",   // Finishes when section is 50% down
            scrub: 1          // Smooth scroll-driven animation
        },
        y: 80,
        opacity: 0,
        scale: 0.95,
        ease: "none"
    });

    if (aboutRows.length > 0) {
        gsap.from(aboutRows[0], {
            scrollTrigger: {
                trigger: ".about-section",
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
        // Make Row 2 visible instantly right before Row 1 starts sliding out
        aboutTl.to(aboutRows[1], { opacity: 1, duration: 0.01 });

        aboutTl.to(aboutRows[0], {
            xPercent: -100, // Slide completely out of view
            ease: "power2.inOut",
            duration: 1
        }, "<"); // Run at the same time as the opacity toggle
        
        // Add a slight parallax to the image inside Row 1 as it leaves
        const img1 = aboutRows[0].querySelector(".parallax-img");
        if (img1) {
            aboutTl.to(img1, { xPercent: 30, duration: 1 }, "<");
        }
    }

    // Phase 2: Slide Row 2 out to the left to reveal Row 3
    if (aboutRows.length > 2) {
        // Make Row 3 visible right before Row 2 slides out
        aboutTl.to(aboutRows[2], { opacity: 1, duration: 0.01 });

        aboutTl.to(aboutRows[1], {
            xPercent: -100,
            ease: "power2.inOut",
            duration: 1
        }, "<");

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

    // --- GALLERY ANIMATION ---
    const galleryTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".gallery-section",
            start: "top top",
            end: "+=6500", // 2500px for gallery + 4000px for contact transition
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onEnter: () => {
                gsap.set(".contact-section", {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    marginTop: 0,
                    pointerEvents: "none"
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
                    marginTop: 0,
                    pointerEvents: "none"
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

    // 1. Shrink hero image to center and fade out the top overlay title
    galleryTl.to(".gallery-center", {
        width: "35vw",
        height: "80vh",
        borderRadius: "20px",
        duration: 1,
        ease: "power2.inOut"
    }, 0);

    galleryTl.to(".gallery-overlay-top", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
    }, 0);

    // 2. Slide in left column from left
    galleryTl.fromTo(".col-left", {
        x: -300,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
    }, 0.5);

    // 3. Slide in right column from right
    galleryTl.fromTo(".col-right", {
        x: 300,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
    }, 0.5);

    // 4. Fade in CTA button
    galleryTl.to(".gallery-cta-wrapper", {
        opacity: 1,
        y: -20,
        duration: 0.5
    }, 1.0);

    // Pause for a bit so the user can enjoy the gallery layout
    galleryTl.to({}, { duration: 1.5 }); // Adds empty time, total timeline is now 3.0

    // --- SCROLL-DRIVEN CONTACT TRANSITION (mirrors the Hero in reverse) ---
    const sBlocks = gsap.utils.toArray(".s-block");

    // Hide contact elements — they appear in Phase 4
    gsap.set(".contact-section .contact-logo", { y: 150, opacity: 0 });
    gsap.set(".contact-section .hero-tab-button", { y: 150, opacity: 0 });
    gsap.set(".contact-section .c-item", { y: 80, opacity: 0 });
    gsap.set(".contact-section .s-icon", { y: 40, opacity: 0 });

    // Start the container small and shifted completely off-screen to the right
    gsap.set(".contact-container", {
        scale: 0.35,
        xPercent: 150,
        borderRadius: "20px"
    });

    gsap.set(".contact-section", {
        position: "fixed",
        top: 0,
        left: 0,
        marginTop: 0,
        opacity: 0,
        pointerEvents: "none"
    });

    // Phase 1 (3.0 → 4.5): Black blocks slide up as visual curtain OVER the gallery
    galleryTl.fromTo(sBlocks, 
        { y: "100%" },
        { y: "0%", duration: 1.0, stagger: 0.08, ease: "none" }, 
        3.0
    );

    // Show the contact section ONLY when the blocks have fully covered the screen (4.5)
    galleryTl.fromTo(".contact-section", 
        { opacity: 0, pointerEvents: "none" },
        { opacity: 1, pointerEvents: "auto", duration: 0.01, ease: "none" }, 
        4.5
    );

    // Phase 2 (4.5 → 6.0): Contact container slides from right to center
    galleryTl.fromTo(".contact-container", 
        { xPercent: 150 },
        { xPercent: 0, duration: 1.5, ease: "power2.inOut" }, 
        4.5
    );

    // Reveal Sponsor Title and Marquee
    galleryTl.fromTo(".sponsor-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" },
        4.5
    );
    galleryTl.fromTo(".sponsor-marquee-track",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" },
        4.7
    );

    // Phase 3 (6.0 → 7.5): Container scales up from card to full screen
    galleryTl.fromTo(".contact-container", 
        { scale: 0.35, borderRadius: "20px" },
        { scale: 1, borderRadius: "0px", duration: 1.5, ease: "power2.inOut" }, 
        6.0
    );

    // Fade out Sponsor Marquee as the container scales up to hide it at the bottom
    galleryTl.to(".sponsor-marquee-container",
        { opacity: 0, duration: 0.5, ease: "power2.inOut" },
        6.8
    );

    // Phase 4 (7.5 → 9.3): Elements slide up into view — same style as hero section
    galleryTl.fromTo(".contact-section .contact-logo", 
        { y: 150, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power2.inOut" }, 
        7.5
    );

    galleryTl.fromTo(".contact-section .hero-tab-button", 
        { y: 150, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power2.inOut" }, 
        7.7
    );

    galleryTl.fromTo(".contact-section .c-item", 
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power2.inOut" }, 
        8.0
    );

    galleryTl.fromTo(".contact-section .s-icon", 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, stagger: 0.1, ease: "power2.inOut" }, 
        8.3
    );

    // --- HAMBURGER MENU LOGIC ---
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const menuLinks = document.querySelectorAll('.menu-nav-links a');
    
    function closeMenu() {
        if (!document.body.classList.contains('menu-open')) return;
        
        // CLOSING — add menu-closing first so retract animation plays
        document.body.classList.add('menu-closing');
        document.body.classList.remove('menu-open');
        gsap.to(menuLinks, {
            x: -50,
            opacity: 0,
            duration: 0.3,
            stagger: -0.05,
            ease: "power2.in"
        });
        // Remove menu-closing after retract animation finishes (~420ms)
        setTimeout(() => {
            document.body.classList.remove('menu-closing');
        }, 420);
    }

    hamburgerBtn.addEventListener('click', () => {
        const isOpen = document.body.classList.contains('menu-open');

        if (!isOpen) {
            // OPENING
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
