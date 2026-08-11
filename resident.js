document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 1. HAMBURGER MENU LOGIC (Same as main page)
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

    if (hamburgerBtn) {
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
    }

    // Close menu when a link is clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ==========================================
    // 2. HERO SECTION INITIAL REVEAL
    // ==========================================
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Pop the red circle in
    heroTl.to(".accent-circle", {
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.5)"
    }, 0.2);

    // 2. Slide the resident name letters up
    heroTl.to(".resident-huge-name .char", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05
    }, 0.4);

    // 3. Fade and slide in the cutout image
    heroTl.to(".cutout-image", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
    }, 0.6);

    // 4. Fade in the resident description
    heroTl.to(".resident-desc-wrapper", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
    }, 0.8);

});
