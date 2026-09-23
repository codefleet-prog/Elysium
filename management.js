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

    // ==========================================
    // 6. RESIDENT DETAIL OVERLAY
    // ==========================================
    const residentsData = [
        {
            name: "ALVKARD",
            highlight: "SCHRANZ ARTIST & PRODUCER",
            image: "assets/New-Alvkard.jpg",
            imagePosition: "center center",
            description: {
                hu: [
                    "ALVKARD schranz előadó és producer, az Elysium egyik karakteres rezidense. Hangzását a gyors tempó, a súlyos groove-ok és a direkt, energikus schranz világ határozza meg.",
                    "Producerként saját zenékkel is folyamatosan építi a projektjét, miközben az elmúlt időszakban számos fellépést tudhat maga mögött Magyarországon és külföldön, több meghatározó klub és esemény színpadán."
                ],
                en: [
                    "ALVKARD is a schranz artist and producer, and one of Elysium's defining residents. His signature sound is driven by relentless tempos, heavy grooves, and an intense, direct schranz aesthetic.",
                    "As a producer, he consistently develops his sonic identity with original releases, having performed across prominent club stages and underground gatherings both in Hungary and abroad."
                ]
            },
            socials: [
                { name: "Facebook", url: "https://www.facebook.com/alvkard.techno" },
                { name: "Instagram", url: "https://www.instagram.com/alvkard_?igsh=MW5lNWJqNGFqbmFxeQ%3D%3D" },
                { name: "SoundCloud", url: "https://soundcloud.com/alvkard" }
            ]
        },
        {
            name: "H9X",
            highlight: "GROOVY INDUSTRIAL WITH A TWIST",
            image: "assets/H9X.jpg",
            imagePosition: "center center",
            description: {
                hu: [
                    "H9X az Elysium egyik legegyedibb karakterű rezidense, akinek hangzásában a groove-os industrial alapok bolondosabb, váratlan és játékos dallamokkal találkoznak.",
                    "Szettjeiben a súly és az energia mellett mindig jelen van egy kis kiszámíthatatlanság is, ami külön karaktert ad a produkcióinak. Az elmúlt időszakban több hazai és külföldi fellépésen is megmutatta ezt a hangzást, rangos klubokban és underground eseményeken egyaránt."
                ],
                en: [
                    "H9X is one of Elysium's most distinct residents, fusing driving industrial foundations with eccentric, unpredictable, and playful melodic hooks.",
                    "His sets balance raw weight and intense drive with a touch of unpredictability, lending a sharp, idiosyncratic character to his performances across leading clubs and underground circuits at home and internationally."
                ]
            },
            socials: [
                { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61558412468177" },
                { name: "Instagram", url: "https://www.instagram.com/harkaly_9x?igsh=YWZpaWdrdjFxbjJs" },
                { name: "TikTok", url: "https://www.tiktok.com/@harkaly_9x?_r=1&_t=ZN-98olUzL5EDm" },
                { name: "SoundCloud", url: "https://soundcloud.com/levente-harkaly" }
            ]
        },
        {
            name: "MIGUEL",
            highlight: "BOCHKA / INDUSTRIAL ENERGY FROM THE UNDERGROUND",
            image: "assets/MIGUEL.jpg",
            imagePosition: "center center",
            description: {
                hu: [
                    "Miguel az Elysium egyik meghatározó rezidense, producerként pedig több megjelenéssel is építi saját hangzását.",
                    "Szettjeiben a bochka és az industrial keménysége találkozik a sötétebb, nyersebb energiákkal, és folyamatos feszültséggel. Az elmúlt időszakban számos alkalommal lépett fel Magyarországon és külföldön is, több rangos klubban és underground eseményen."
                ],
                en: [
                    "Miguel is a core resident of Elysium, actively carving out his sonic identity as a producer with multiple releases.",
                    "His performances channel the raw force of bochka and industrial weight, converging into dark, gritty energy and continuous tension on dancefloors across Hungary and beyond."
                ]
            },
            socials: [
                { name: "Facebook", url: "https://www.facebook.com/migulhardtechno" },
                { name: "Instagram", url: "https://www.instagram.com/miguelnoredflag" },
                { name: "TikTok", url: "https://www.tiktok.com/@miguelnoredflag" },
                { name: "SoundCloud", url: "https://soundcloud.com/miguelnoredflag" }
            ]
        },
        {
            name: "SATELLITE84",
            highlight: "PROPER / GROOVE TECHNO DUO",
            image: "assets/New-Sattelite.jpg",
            imagePosition: "center top",
            description: {
                hu: [
                    "A SATELLITE84 egy magyar proper/groove techno formáció, amelyet SPI3GEL és Franzis Mate alapított 2023-ban. A páros kezdetben online rádióműsorban mutatkozott be, majd Elysium rezidensként egyre több pécsi és budapesti helyszínen lépett fel, köztük az A38 Hajón és az Arzenálban is.",
                    "Szettjeik középpontjában a groove-központú építkezés, a feszes ritmusok és a proper techno tudatosan felépített flow-ja áll. Az elmúlt években számos hazai és külföldi fellépésen bizonyítottak, Magyarország meghatározó klubjai és nemzetközi underground események színpadain egyaránt."
                ],
                en: [
                    "SATELLITE84 is a Hungarian proper/groove techno project founded in 2023 by SPI3GEL and Franzis Mate. Debuting on online radio before joining Elysium as residents, the duo has played key venues across Pécs and Budapest, including A38 and Arzenál.",
                    "Their sound centers on groove-driven architecture, taut rhythms, and the calculated flow of proper techno, honed through appearances at premier clubs and underground gatherings across the country and abroad."
                ]
            },
            socials: [
                { name: "Facebook", url: "https://www.facebook.com/profile.php?id=100063469275063" },
                { name: "YouTube", url: "https://www.youtube.com/@Satellitemusic84" },
                { name: "Instagram", url: "https://www.instagram.com/satellite84_official" },
                { name: "SoundCloud", url: "https://soundcloud.com/SATELLITE84" }
            ]
        }
    ];

    const overlay = document.getElementById('resident-overlay');
    const overlayImage = document.getElementById('overlay-dj-image');
    const overlayName = document.getElementById('overlay-dj-name');
    const overlayHighlight = document.getElementById('overlay-dj-highlight');
    const overlayDescription = document.getElementById('overlay-dj-description');
    const overlaySocials = document.getElementById('overlay-dj-socials');
    const overlayPagination = document.getElementById('overlay-pagination');
    let currentResidentIndex = 0;

    // Build pagination dots
    residentsData.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'overlay-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => navigateToResident(i));
        overlayPagination.appendChild(dot);
    });

    function loadResident(index, direction) {
        const data = residentsData[index];
        currentResidentIndex = index;

        // Determine active language
        const currentLang = (window.ElysiumLang && window.ElysiumLang.getLanguage) ? window.ElysiumLang.getLanguage() : 'hu';
        const descArray = Array.isArray(data.description) 
            ? data.description 
            : (data.description[currentLang] || data.description.hu);

        // Update content
        overlayImage.src = data.image;
        overlayImage.alt = data.name;
        overlayImage.style.objectPosition = data.imagePosition;
        overlayName.textContent = data.name;
        overlayHighlight.textContent = data.highlight;
        overlayDescription.innerHTML = descArray.map(p => `<p>${p}</p>`).join('');
        overlaySocials.innerHTML = data.socials.map(s =>
            `<a href="${s.url}" target="_blank">${s.name}</a>`
        ).join('');

        // Update pagination dots
        overlayPagination.querySelectorAll('.overlay-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Re-render overlay if language changes while open
    window.addEventListener('elysium:langchange', () => {
        if (overlay && overlay.classList.contains('active')) {
            loadResident(currentResidentIndex, 0);
        }
    });

    function openOverlay(index) {
        loadResident(index, 0);
        overlay.classList.add('active');
        document.body.classList.add('overlay-open');

        // Reset any leftover opacity from previous close animation
        gsap.set('.overlay-content, .overlay-close, .overlay-nav, .overlay-pagination', { opacity: 1 });
        gsap.set('.overlay-image-side, .overlay-info-side', { x: 0, opacity: 1 });

        // GSAP entrance animation
        const tl = gsap.timeline();
        tl.fromTo('.overlay-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0);
        tl.fromTo('.overlay-image-side', { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.15);
        tl.fromTo('.overlay-dj-name', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 0.3);
        tl.fromTo('.overlay-red-line', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, 0.4);
        tl.fromTo('.overlay-dj-highlight', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.45);
        tl.fromTo('.overlay-dj-description', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.5);
        tl.fromTo('.overlay-dj-socials', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.55);
        tl.fromTo('.overlay-close', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' }, 0.3);
        tl.fromTo('.overlay-nav', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.5);
        tl.fromTo('.overlay-pagination', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 0.6);
    }

    function closeOverlay() {
        const tl = gsap.timeline({
            onComplete: () => {
                overlay.classList.remove('active');
                document.body.classList.remove('overlay-open');
            }
        });
        tl.to('.overlay-content, .overlay-close, .overlay-nav, .overlay-pagination', { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0);
        tl.to('.overlay-backdrop', { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0.1);
    }

    function navigateToResident(index) {
        if (index === currentResidentIndex) return;
        const direction = index > currentResidentIndex ? 1 : -1;

        // Quick fade out content, swap, fade back in
        const contentTl = gsap.timeline();
        contentTl.to('.overlay-image-side, .overlay-info-side', {
            opacity: 0,
            x: direction * -30,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
                loadResident(index, direction);
                gsap.set('.overlay-image-side, .overlay-info-side', { x: direction * 30 });
                gsap.to('.overlay-image-side, .overlay-info-side', {
                    opacity: 1,
                    x: 0,
                    duration: 0.35,
                    ease: 'power2.out'
                });
            }
        });
    }

    // Card click handlers
    document.querySelectorAll('.resident-card[data-resident-index]').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open overlay if clicking on social links
            if (e.target.closest('.resident-card-socials a')) return;
            const index = parseInt(card.dataset.residentIndex);
            openOverlay(index);
        });
    });

    // Close button
    document.querySelector('.overlay-close').addEventListener('click', closeOverlay);

    // Backdrop click
    document.querySelector('.overlay-backdrop').addEventListener('click', closeOverlay);

    // Navigation arrows
    document.querySelector('.overlay-nav-prev').addEventListener('click', () => {
        const prev = (currentResidentIndex - 1 + residentsData.length) % residentsData.length;
        navigateToResident(prev);
    });

    document.querySelector('.overlay-nav-next').addEventListener('click', () => {
        const next = (currentResidentIndex + 1) % residentsData.length;
        navigateToResident(next);
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeOverlay();
        }
        if (e.key === 'ArrowLeft' && overlay.classList.contains('active')) {
            const prev = (currentResidentIndex - 1 + residentsData.length) % residentsData.length;
            navigateToResident(prev);
        }
        if (e.key === 'ArrowRight' && overlay.classList.contains('active')) {
            const next = (currentResidentIndex + 1) % residentsData.length;
            navigateToResident(next);
        }
    });

});
