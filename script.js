// Reload page on crossing the mobile breakpoint to reset DOM manipulation and GSAP
let initialIsMobile = window.innerWidth <= 768;
window.addEventListener('resize', () => {
    let currentIsMobile = window.innerWidth <= 768;
    if (initialIsMobile !== currentIsMobile) {
        location.reload();
    }
});

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
    // 1. On mobile, we split text and images into separate slide rows
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        const aboutRowsContainer = document.querySelector('.about-rows');
        const originalRows = Array.from(document.querySelectorAll('.about-row'));
        
        originalRows.forEach(row => {
            const textContent = row.querySelector('.about-text');
            const imageContent = row.querySelector('.about-image-wrapper');
            const twoCol = row.querySelector('.two-column-text');
            
            if (twoCol) {
                // Split the two-column slide into two separate slides on mobile
                const colDivs = Array.from(twoCol.children);
                colDivs.forEach(col => {
                    const textRow = document.createElement('div');
                    textRow.className = 'about-row';
                    const colText = document.createElement('div');
                    colText.className = 'about-text text-left';
                    Array.from(col.children).forEach(p => colText.appendChild(p));
                    textRow.appendChild(colText);
                    aboutRowsContainer.insertBefore(textRow, row);
                });
            } else if (textContent) {
                const textRow = document.createElement('div');
                textRow.className = 'about-row';
                textRow.appendChild(textContent);
                aboutRowsContainer.insertBefore(textRow, row);
            }
            if (imageContent) {
                const imageRow = document.createElement('div');
                imageRow.className = 'about-row';
                imageRow.appendChild(imageContent);
                aboutRowsContainer.insertBefore(imageRow, row);
            }
            row.remove(); // Remove the original combined row
        });
    }

    const aboutRows = gsap.utils.toArray(".about-row");

    // 2. Dynamically set z-index and opacity for any number of rows
    aboutRows.forEach((row, index) => {
        gsap.set(row, { 
            zIndex: aboutRows.length - index, 
            opacity: index === 0 ? 1 : 0 
        });
    });

    // 3. Reveal the About Title smoothly based on scroll position
    gsap.from(".about-title", {
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 90%",
            end: "top 50%",
            scrub: 1
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

    // 4. Pin the entire about section and animate slides
    const scrollDuration = aboutRows.length * 1000; // Dynamically scale scroll length
    const aboutTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".about-section",
            start: "top top",
            end: "+=" + scrollDuration,
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });

    // Loop through all rows and create sliding animation
    for (let i = 0; i < aboutRows.length - 1; i++) {
        // Make the next row visible right before the current one slides out
        aboutTl.to(aboutRows[i + 1], { opacity: 1, duration: 0.01 });

        // Slide the current row out
        aboutTl.to(aboutRows[i], {
            xPercent: -100,
            ease: "power2.inOut",
            duration: 1
        }, "<");
        
        // Add a slight parallax to the image inside the current row if it exists
        const img = aboutRows[i].querySelector(".parallax-img");
        if (img) {
            aboutTl.to(img, { xPercent: 30, duration: 1 }, "<");
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
    galleryTl.to({}, { duration: 1.5 }); // Adds empty time, total timeline is now 3.0

    // --- SCROLL-DRIVEN CONTACT TRANSITION (mirrors the Hero in reverse) ---
    const sBlocks = gsap.utils.toArray(".s-block");

    // Hide contact elements — they appear in Phase 4
    gsap.set(".contact-section .contact-logo", { y: 150, opacity: 0 });
    gsap.set(".contact-section .hero-tab-button", { y: 150, opacity: 0 });
    gsap.set(".contact-section .s-icon", { y: 40, opacity: 0 });
    gsap.set(".contact-section .navbar", { y: -80, opacity: 0 });

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

    galleryTl.fromTo(".contact-section .s-icon", 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, stagger: 0.1, ease: "power2.inOut" }, 
        8.3
    );

    galleryTl.fromTo(".contact-section .navbar", 
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power2.inOut" }, 
        7.5
    );

    galleryTl.to("#fixed-header", {
        y: 0,
        duration: 1.5,
        ease: "power2.inOut"
    }, 7.5);

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
