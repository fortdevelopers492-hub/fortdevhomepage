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
  const adImageWrapper = document.getElementById("ad-image-wrapper");
  const adVideo = document.getElementById("ad-video");

  if (adImageWrapper && adVideo) {
    const switchToImageAd = () => {
      adVideo.pause();
      adVideo.classList.add("hidden");
      adImageWrapper.classList.remove("hidden");
    };

    let visitCount = parseInt(localStorage.getItem("fort_website_visit_count") || "0", 10);
    visitCount += 1;
    localStorage.setItem("fort_website_visit_count", visitCount.toString());

    if (visitCount % 3 === 0) {
      adVideo.removeAttribute("loop");
      adImageWrapper.classList.add("hidden");
      adVideo.classList.remove("hidden");

      let playCounter = 0;
      adVideo.addEventListener("ended", () => {
        playCounter += 1;
        if (playCounter < 2) {
          adVideo.play();
        } else {
          switchToImageAd();
        }
      });

      adVideo.play().catch(() => switchToImageAd());
    } else {
      switchToImageAd();
    }
  }
});