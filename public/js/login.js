gsap.from(".auth-card", { y: 50, opacity: 0, duration: 1, ease: "power3.out" });

gsap.from(".logo", { y: -20, opacity: 0, duration: 1, delay: 0.5 });

// Mouse Parallax
document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth - e.pageX) / 50;
    const y = (window.innerHeight - e.pageY) / 50;
    gsap.to(".bg-image", { x: x, y: y, duration: 1 });
});
