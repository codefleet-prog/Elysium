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
