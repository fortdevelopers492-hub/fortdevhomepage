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

  // --- 2. Mobile Menu Navigation Controller ---
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

  // --- 4. Advert Display Logic (Flyer Rotation) ---
  const sourceDesktop = document.getElementById("ad-source-desktop");
  const sourceMobile = document.getElementById("ad-source-mobile");
  const imageFallback = document.getElementById("ad-image-fallback");

  if (sourceDesktop && sourceMobile && imageFallback) {
    const lastFlyer = localStorage.getItem("fort_last_rendered_flyer") || "flyer2";
    const currentFlyer = lastFlyer === "flyer1" ? "flyer2" : "flyer1";

    if (currentFlyer === "flyer1") {
      sourceDesktop.srcset = "flyer-fort-landscape.png";
      sourceMobile.srcset = "flyer-fort-potrait.png";
      imageFallback.src = "flyer-fort-landscape.png";
    } else {
      sourceDesktop.srcset = "flyer-fort-2_ewnab_landscape.png";
      sourceMobile.srcset = "flyer-fort-2_ewnab_potrait.png";
      imageFallback.src = "flyer-fort-2_ewnab_landscape.png";
    }

    localStorage.setItem("fort_last_rendered_flyer", currentFlyer);
  }

  // --- 5. Article Search Bar ---
  const searchInput = document.getElementById("article-search");
  const blogCards = document.querySelectorAll(".blog-card");
  const noResultsMessage = document.getElementById("no-results-message");

  if (searchInput && blogCards.length > 0) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      let visibleCardsCount = 0;

      blogCards.forEach((card) => {
        const title = card.querySelector(".blog-card-title")?.textContent.toLowerCase() || "";
        const summary = card.querySelector(".blog-card-summary")?.textContent.toLowerCase() || "";
        const badge = card.querySelector(".blog-topic-badge")?.textContent.toLowerCase() || "";

        if (title.includes(searchTerm) || badge.includes(searchTerm) || summary.includes(searchTerm)) {
          card.style.display = "flex";
          visibleCardsCount++;
        } else {
          card.style.display = "none";
        }
      });

      if (noResultsMessage) {
        noResultsMessage.style.display = visibleCardsCount === 0 ? "block" : "none";
      }
    });
  }

  // --- 6. WhatsApp Direct Link Handling ---
  document.querySelectorAll(".wa-direct-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        e.preventDefault();
        const url = new URL(this.href);
        const phone = url.pathname.replace("/", "");
        const text = url.searchParams.get("text") || "";
        window.location.href = `whatsapp://send?phone=${phone}&text=${text}`;
      }
    });
  });

  // --- 7. Theme Switcher Logic ---
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const themeToggleIcon = document.getElementById("theme-toggle-icon");
  const themeToggleText = document.getElementById("theme-toggle-text");

  function updateToggleUI(isDark) {
    if (isDark) {
      if (themeToggleIcon) {
        themeToggleIcon.classList.remove("fa-moon");
        themeToggleIcon.classList.add("fa-sun");
      }
      if (themeToggleText) themeToggleText.textContent = "Light";
    } else {
      if (themeToggleIcon) {
        themeToggleIcon.classList.remove("fa-sun");
        themeToggleIcon.classList.add("fa-moon");
      }
      if (themeToggleText) themeToggleText.textContent = "Dark";
    }
  }

  const isCurrentlyDark = document.documentElement.getAttribute("data-theme") === "dark";
  updateToggleUI(isCurrentlyDark);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";

      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("fort_theme", "light");
        updateToggleUI(false);
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("fort_theme", "dark");
        updateToggleUI(true);
      }
    });
  }

  // --- 8. Monetag Reverse Popunder for Selected Buttons ---
  const MONETAG_SMART_LINK = "https://omg10.com/4/11895105";

  function triggerReversePopunder(adUrl) {
    if (!adUrl) return;

    try {
      const adWindow = window.open(
        adUrl,
        "_blank",
        "toolbar=no,scrollbars=yes,resizable=yes,width=1000,height=700"
      );

      if (adWindow) {
        window.focus();
        try {
          adWindow.blur();
        } catch (err) {
          // Fallback for strict popunder policy blocks
        }
      }
    } catch (e) {
      console.warn("Popunder creation blocked by browser environment.", e);
    }
  }

  const adButtons = document.querySelectorAll(".monetag-ad-btn");
  adButtons.forEach((button) => {
    button.addEventListener("click", () => {
      triggerReversePopunder(MONETAG_SMART_LINK);
    });
  });
});