document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Preserved Preloader & Progress Meter Controller ---
  const preloader = document.getElementById("preloader-container");
  const progressBar = document.getElementById("preloader-progress-bar");
  const progressText = document.getElementById("preloader-percentage-text");

  if (preloader && progressBar) {
    let progress = 0;
    const duration = 2500;
    const intervalTime = 30;
    const step = (intervalTime / duration) * 100;

    const progressInterval = setInterval(() => {
      progress += step;

      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);

        progressBar.classList.add("fully-complete");
        progressBar.style.width = "100%";
        if (progressText) progressText.innerText = "Ready!";

        setTimeout(() => {
          preloader.classList.add("fade-out");
        }, 300);
      } else {
        progressBar.style.width = `${progress}%`;
        if (progressText) progressText.innerText = `Loading ${Math.floor(progress)}%`;

        if (progress >= 66) {
          progressBar.classList.add("fully-complete");
        }
      }
    }, intervalTime);
  }

  // --- 2. Mobile Menu Navigation Navigation Controller ---
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }

  // --- 3. Intersection Observer (Scroll Reveal Animations) ---
  const sections = document.querySelectorAll(".scroll-section");
  const observerOptions = {
    root: null,
    threshold: 0.12,
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // --- 4. Advert Display Logic (Visit Counter & Video Rotation) ---
  const sourceDesktop = document.getElementById("ad-source-desktop") 
  const sourceMobile = document.getElementById("ad-source-mobile")
  const imageFallback = document.getElementById("ad-image-fallback")

  if (sourceDesktop && sourceMobile && sourceDesktop) {
    // Retrieve last display state (defaults to 'flyer1' if missing)
    const lastFlyer = localStorage.getItem("fort_last_rendered_flyer") || "flyer2"

    // Determine the next flyer vairant to show
    const currentFlyer = lastFlyer === "flyer1" ? "flyer2" : "flyer1"

    if (currentFlyer === "flyer1") {
      sourceDesktop.srcset = "flyer-fort-landscape.png"
      sourceMobile.srcset = "flyer-fort-potrait.png"
      imageFallback.src = "flyer-fort-landscape.png"
    } else {
      sourceDesktop.srcset = "flyer-fort-2_ewnab_landscape.png"
      sourceMobile.srcset = "flyer-fort-2_ewnab_potrait.png"
      imageFallback.src = "flyer-fort-2_ewnab_landscape.png"      
    }

    // Overwrite history with the current active layout
    localStorage.setItem("fort_last_rendered_flyer", currentFlyer);
  }

  // -- Article Search Bar -- //
  const searchInput = document.getElementById("article-search");
  const blogCards = document.querySelectorAll(".blog-card");
  const noResultsMessage = document.getElementById("no-results-message");

  if (searchInput && blogCards.length > 0) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      let visibleCardsCount = 0;

      blogCards.forEach(card => {
        const title = card.querySelector(".blog-card-title").textContent.toLowerCase();
        const summary = card.querySelector(".blog-card-summary").textContent.toLowerCase();
        const badge = card.querySelector(".blog-topic-badge").textContent.toLowerCase();

        // Show item if search string exists in details
        if (title.includes(searchTerm) || badge.includes(searchTerm) || summary.includes(searchTerm)) {
          card.style.display = "flex";
          visibleCardsCount++; 
        } else {
          card.style.display = "none";
        }
      });

      // Toggle the Fallback Message
      if (visibleCardsCount === 0) {
        noResultsMessage.style.display ="block"
      } else {
        noResultsMessage.style.display ="none"
      }

    })
  }
  
});