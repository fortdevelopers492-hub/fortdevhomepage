/**
 * Fort Developers - Operational Control Engine
 * Architecture Context Scope Management Layer
 */

// Centralized State Management Store
let appState = {
    isAdminAuthenticated: false,
    activeEditContext: {
        sectionId: null,
        targetFieldId: null,
        displayElementId: null
    },
    // Initial dynamic catalog repository layout array mapping
    extendedWebsites: []
};

/**
 * Fort Mart Preloader and Progress Meter Controller Hook
 */
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById("preloader-container");
    const progressBar = document.getElementById("preloader-progress-bar");
    const progressText = document.getElementById("preloader-percentage-text");

    if (!preloader || !progressBar) return;

    let progress = 0;
    const duration = 3000; // Total loading screen time (3 seconds)
    const intervalTime = 30; // Update step resolution in milliseconds
    const step = (intervalTime / duration) * 100;

    const progressInterval = setInterval(() => {
        progress += step;

        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Turn completely solid blue in its final stage
            progressBar.classList.add("fully-complete");
            progressBar.style.width = "100%";
            progressText.innerText = "Ready!";

            // Smoothly remove preloader after reaching full status
            setTimeout(() => {
                preloader.classList.add("fade-out");
                
                // Let other state machine rendering scripts safely execute after opening
                if (typeof initApplicationState === 'function') {
                    initApplicationState();
                }
            }, 400); // Tiny delay to let the user see the 100% complete state
        } else {
            progressBar.style.width = `${progress}%`;
            progressText.innerText = `Loading ${Math.floor(progress)}%`;

            // Change to complete blue within the last 1-2 seconds of loading 
            if (progress >= 66) { 
                progressBar.classList.add("fully-complete");
            }
        }
    }, intervalTime);
});

/**
 * Advert Display Controller Loop
 * Tracks visits via localStorage, shuffles to show the video every 3rd visit,
 * and automatically switches back to the dynamic image advert after the video plays twice.
 */
document.addEventListener("DOMContentLoaded", () => {
    const adImageWrapper = document.getElementById("ad-image-wrapper");
    const adVideo = document.getElementById("ad-video");

    if (!adImageWrapper || !adVideo) return;

    // Function to safely show the responsive image and hide the video
    function switchToImageAd() {
        adVideo.pause();
        adVideo.classList.add("hidden");
        adImageWrapper.classList.remove("hidden");
    }

    // Retrieve or initialize total website visit count in localStorage
    let visitCount = parseInt(localStorage.getItem("fort_website_visit_count") || "0", 10);
    visitCount += 1;
    localStorage.setItem("fort_website_visit_count", visitCount.toString());

    // Check if it is every 3rd opening (3, 6, 9, 12, etc.)
    if (visitCount % 3 === 0) {
        // Remove 'loop' so the 'ended' event triggers after each playback
        adVideo.removeAttribute("loop");

        // Show video advert and hide responsive image advert
        adImageWrapper.classList.add("hidden");
        adVideo.classList.remove("hidden");

        let playCounter = 0;

        // Listen for when the video reaches the end
        adVideo.addEventListener("ended", () => {
            playCounter += 1;

            if (playCounter < 2) {
                // Replay the video for its second loop
                adVideo.play();
            } else {
                // After playing twice, switch to the image advert
                switchToImageAd();
            }
        });

        // Start video playback
        adVideo.play().catch(() => {
            // Fallback to image if browser blocks autoplay
            switchToImageAd();
        });
    } else {
        // Show responsive image advert and hide video advert
        switchToImageAd();
    }
});
