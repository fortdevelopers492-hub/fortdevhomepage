document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Logo Orbit Preloader (Disappears after exactly 3s) ---
  const preloader = document.getElementById("preloader-container");

  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("fade-out");
    }, 2000);
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

  // --- 4. Article Search Bar ---
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

  // --- 5. WhatsApp Direct Link Handling ---
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

  // --- 6. Theme Switcher Logic ---
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
});

// --- 7. Animated Code Showcase (Slower typing + Replay on scroll back) ---
  const codeOutput = document.getElementById("animated-code-output");
  const replayBtn = document.getElementById("replay-code-btn");
  const codeTabs = document.querySelectorAll(".code-tab");

  if (codeOutput) {
    const snippets = {
      web: `// Fort Developers — Custom Web Build
const brand = {
  name: "Your Business",
  speed: "Fast & Mobile-First",
  features: ["Custom UI", "SEO Ready", "WhatsApp Lead Funnel"]
};
launchPlatform(brand);`,
      store: `// Fort Mart — Marketplace & Checkout
async function addToCart(item) {
  cart.push(item);
  updateBadge(cart.length);
  openLiveSellerChat(item.sellerId);
}`,
      chat: `// Real-Time Buyer & Seller Messaging
channel.on("message", (msg) => {
  renderBubble(msg.sender, msg.text);
  playNotificationTone();
});`
    };

    let activeKey = "web";
    let typingTimer = null;
    let currentRunId = 0;

    function stopTyping() {
      currentRunId++;
      clearTimeout(typingTimer);
    }

    function runCodeTypewriter(key) {
      stopTyping();
      const runId = currentRunId;
      const text = snippets[key] || snippets.web;
      codeOutput.textContent = "";
      let i = 0;

      function step() {
        if (runId !== currentRunId) return;

        const nextChar = text[i] || "";
        codeOutput.textContent = text.slice(0, i);
        i++;

        if (i <= text.length) {
          // Slower pace (~50ms per char) + brief pause at newlines
          const delay = nextChar === "\n" ? 160 : 50;
          typingTimer = setTimeout(step, delay);
        }
      }

      step();
    }

    const codeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCodeTypewriter(activeKey);
          } else {
            stopTyping();
            codeOutput.textContent = "";
          }
        });
      },
      { threshold: 0.25 }
    );

    codeObserver.observe(codeOutput);

    codeTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        codeTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        activeKey = tab.dataset.sn.ippet;
        runCodeTypewriter(activeKey);
      });
    });

    if (replayBtn) {
      replayBtn.addEventListener("click", () => runCodeTypewriter(activeKey));
    }
  }
  
// <-- Make sure this closing bracket of DOMContentLoaded is AFTER the code above!

// --- Giveaway Countdown Timer Logic ---
const timerDays = document.getElementById("timer-days");
const timerHours = document.getElementById("timer-hours");
const timerMinutes = document.getElementById("timer-minutes");
const timerSeconds = document.getElementById("timer-seconds");

if (timerDays && timerHours && timerMinutes && timerSeconds) {
  const giveawayTargetDate = new Date();
  giveawayTargetDate.setDate(giveawayTargetDate.getDate() + 7);

  function updateTimer() {
    const currentTime = new Date().getTime();
    const difference = giveawayTargetDate.getTime() - currentTime;

    if (difference <= 0) {
      document.getElementById("giveaway-timer").innerHTML = "<p><strong>Giveaway Ended!</strong></p>";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    timerDays.textContent = String(days).padStart(2, "0");
    timerHours.textContent = String(hours).padStart(2, "0");
    timerMinutes.textContent = String(minutes).padStart(2, "0");
    timerSeconds.textContent = String(seconds).padStart(2, "0");
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}
