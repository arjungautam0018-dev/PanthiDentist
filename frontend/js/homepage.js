/**
 * Panthi Clinic - Homepage Interactive Script
 * 
 * This script powers rich visual micro-animations on the homepage.
 * Specifically, it handles the 3D hover parallax effect on glass cards, 
 * adding physical weight and premium feedback as the user's mouse moves over them.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Select all glass card components on the homepage
    const glassCards = document.querySelectorAll('.glass-card');

    glassCards.forEach(card => {
        // Track mouse movement inside the card to calculate angles
        card.addEventListener('mousemove', (e) => {
            // Get the card's dimensions and screen coordinates
            const rect = card.getBoundingClientRect();
            
            // Calculate absolute cursor coordinates relative to the card's top-left corner
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Map coordinate offsets to percentages relative to the center of the card
            // Center will be 0, left/top edges will be -0.5, right/bottom edges will be 0.5
            const xPercent = (x / rect.width - 0.5);
            const yPercent = (y / rect.height - 0.5);
            
            // Define maximum tilt angles (5 degrees max rotation on X and Y)
            const maxTilt = 5;
            const rotateX = -yPercent * maxTilt;
            const rotateY = xPercent * maxTilt;
            
            // Apply 3D perspective, tilt rotations, and a slight vertical lift (-8px)
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            
            // Smoothly ease in ambient shadows to reinforce the hover-lift
            card.style.boxShadow = `
                0 ${20 + yPercent * 10}px 50px -10px rgba(0, 77, 77, 0.22),
                0 ${10 + yPercent * 5}px 10px -5px rgba(0, 77, 77, 0.08)
            `;
        });
        
        // Reset card transformations when the mouse leaves
        card.addEventListener('mouseleave', () => {
            // Smoothly animate back to neutral position (0 rotation, 0 displacement)
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
            
            // Restore original ambient shadows
            card.style.boxShadow = '';
        });
    });

    // ----------------------------------------------------
    // 2. Scroll Spy Navigation Highlight
    // Dynamically highlights the active section in the header as the user scrolls
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('header nav a');

    function scrollSpy() {
        const navHeight = 80;
        const scrollPosition = window.scrollY + navHeight + 10;
        const nearBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50;

        let activeId = null;

        if (nearBottom) {
            activeId = 'about';
        } else {
            sections.forEach(section => {
                if (scrollPosition >= section.offsetTop) {
                    activeId = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove('text-primary', 'font-bold', 'border-electric-cyan');
            link.classList.add('text-on-surface-variant', 'border-transparent');
            if (activeId && link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('text-primary', 'font-bold', 'border-electric-cyan');
                link.classList.remove('text-on-surface-variant', 'border-transparent');
            }
        });
    }

    // Attach scroll spy event listeners to scroll and page load
    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // run once initially to capture current view state
});
