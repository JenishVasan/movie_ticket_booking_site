 
document.addEventListener("DOMContentLoaded", (event) => {

    gsap.registerPlugin(ScrollTrigger);

    // 1. INTRO
    const tl = gsap.timeline();
    tl.to(".loader-text", { y: -50, opacity: 0, duration: 1, ease: "power4.inOut", delay: 0.5 })
        .to(".loader", { y: "-100%", duration: 1.2, ease: "expo.inOut" })
        .from(".hero-title", { y: 100, opacity: 0, duration: 1.5, ease: "power3.out" }, "-=0.5")
        .from(".swiper-slide", { y: 100, opacity: 0, stagger: 0.1, duration: 1.5, ease: "power3.out" }, "-=1");

    // 2. SWIPER
    var swiper = new Swiper(".mySwiper", {
        effect: "coverflow", grabCursor: true, centeredSlides: true, slidesPerView: "auto", speed: 800,
        coverflowEffect: { rotate: 0, stretch: 0, depth: 100, modifier: 2.5, slideShadows: true }
    });

    // 3. SMOOTH SCROLL
    const lenis = new Lenis();
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // 4. MARQUEE & PARALLAX
    gsap.to(".marquee-content", { xPercent: -50, ease: "none", duration: 20, repeat: -1 });
    document.querySelectorAll('.row-img-container').forEach(container => {
        let img = container.querySelector('.row-img');
        if (img) { gsap.to(img, { y: "20%", ease: "none", scrollTrigger: { trigger: container, start: "top bottom", end: "bottom top", scrub: true } }); }
    });

    // 5. REVEALS & CARDS
    document.querySelectorAll('[data-reveal]').forEach(el => {
        gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
    });

    // CARD ANIMATION (Fixed)
    gsap.from("[data-card]", {
        y: 100,
        opacity: 0, // Animate FROM invisible
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".cards-container",
            start: "top 85%"
        }
    });

});
