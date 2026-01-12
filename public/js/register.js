 
    // Animations
    gsap.from(".auth-card", { y: 50, opacity: 0, duration: 1, ease: "power3.out" });

    gsap.from(".logo", { y: -20, opacity: 0, duration: 1, delay: 0.5 });

    // Background Parallax
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX) / 50;
        const y = (window.innerHeight - e.pageY) / 50;
        gsap.to(".bg-image", { x: x, y: y, duration: 1 });
    });

    // Password Validation Logic
    const form = document.getElementById('regForm');
    const pass = document.getElementById('password');
    const confirmPass = document.getElementById('confirmPassword');
    const errorText = document.getElementById('errorText');

    // form.addEventListener('submit', (e) => {
    //     e.preventDefault(); // Stop form from submitting immediately

    //     if (pass.value !== confirmPass.value) {
    //         // Show Error
    //         errorText.style.display = 'block';
    //         gsap.from(errorText, { x: -10, duration: 0.1, yoyo: true, repeat: 5 });
    //     } else {
    //         // Success - Redirect or Submit
    //         errorText.style.display = 'none';
    //         // alert("Account Created Successfully! Redirecting...");
    //         // window.location.href = 'index.html';
    //     }
    // });
    