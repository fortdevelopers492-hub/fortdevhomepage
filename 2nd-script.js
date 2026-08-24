/**
 * Fort Developers - JavaScript Preloader and State Logic
 */

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------------------------
    // PRELOADER METER LOGIC
    // ----------------------------------------------------------------------
    const preloader = document.getElementById("preloader-container");
    const progressBar = document.getElementById("preloader-progress-bar");
    const progressText = document.getElementById("preloader-percentage-text");

    if (preloader && progressBar) {
        let progress = 0;
        const duration = 2500;
        const intervalTime = 25;
        const step = (intervalTime / duration) * 100;

        const progressInterval = setInterval(() => {
            progress += step;

            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                progressBar.classList.add("fully-complete");
                progressBar.style.width = "100%";
                progressText.innerText = "Ready!";

                setTimeout(() => {
                    preloader.classList.add("fade-out");
                }, 300);
            } else {
                progressBar.style.width = `${progress}%`;
                progressText.innerText = `Loading ${Math.floor(progress)}%`;

                if (progress >= 70) { 
                    progressBar.classList.add("fully-complete");
                }
            }
        }, intervalTime);
    }

    // ----------------------------------------------------------------------
    // INTERSECTION OBSERVER - SCROLL BLEND-IN ANIMATIONS
    // ----------------------------------------------------------------------
    const blendTargets = document.querySelectorAll('.scroll-blend');
    const scrollContainer = document.querySelector('.scrollable-container');

    const blendObserverOptions = {
        root: scrollContainer || null, // Targets scroll container or window viewport
        rootMargin: '0px 0px -60px 0px', // Triggers slightly before element enters view
        threshold: 0.15 // Triggers when 15% of element is visible
    };

    const blendObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('blend-visible');
                observer.unobserve(entry.target); // Unobserves after initial trigger for smooth performance
            }
        });
    }, blendObserverOptions);

    blendTargets.forEach(target => blendObserver.observe(target));
});