let isMenuOpen = false;

function toggleMenu() {
    const overlay = document.getElementById('menuOverlay');
    const trigger = document.querySelector('.menu-trigger');
    
    if(!isMenuOpen) {
        overlay.style.transform = 'translateY(0%)';
        trigger.textContent = "Close";
        // Animate Links
        gsap.fromTo(".menu-link", 
            {y: 50, opacity: 0},
            {y: 0, opacity: 1, stagger: 0.1, duration: 0.8, delay: 0.3}
        );
    } else {
        overlay.style.transform = 'translateY(-100%)';
        trigger.textContent = "Menu";
    }
    isMenuOpen = !isMenuOpen;
}
 