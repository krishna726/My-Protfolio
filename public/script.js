/**
 * SPATIAL UI & LIQUID GLASS INTERACTIVE ENGINE
 * Architecture: Pure JavaScript (ES6+), CSS 3D Math, GSAP & ScrollTrigger
 * Zero Three.js / WebGL overhead.
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================================
     1. WEB AUDIO API SYNTHESIZER (CINEMATIC SFX)
     ========================================================================== */
  class SpatialAudioEngine {
    constructor() {
      this.ctx = null;
      this.isEnabled = false;
      this.masterGain = null;
      this.toggleBtn = document.getElementById("soundToggle");
      this.label = this.toggleBtn ? this.toggleBtn.querySelector(".sound-label") : null;

      if (this.toggleBtn) {
        this.toggleBtn.addEventListener("click", () => this.toggleSound());
      }
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.04, this.ctx.currentTime); // Soft volume
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }

    toggleSound() {
      this.init();
      this.isEnabled = !this.isEnabled;

      if (this.toggleBtn) {
        if (this.isEnabled) {
          this.toggleBtn.classList.add("active");
          if (this.label) this.label.textContent = "SFX: ON";
          this.playChirp(880, 0.08, "sine");
        } else {
          this.toggleBtn.classList.remove("active");
          if (this.label) this.label.textContent = "SFX: OFF";
        }
      }
    }

    playChirp(freq = 600, duration = 0.05, type = "sine") {
      if (!this.isEnabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    playClick() {
      if (!this.isEnabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {}
    }

    playSuccess() {
      if (!this.isEnabled || !this.ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
        notes.forEach((freq, idx) => {
          setTimeout(() => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.25);
          }, idx * 70);
        });
      } catch (e) {}
    }
  }

  const audio = new SpatialAudioEngine();

  /* ==========================================================================
     2. FLUID MAGNETIC CURSOR & MAGNETIC BUTTON SNAPPING
     ========================================================================== */
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");
  let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let ringPos = { x: mousePos.x, y: mousePos.y };

  window.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;

    if (cursorDot) {
      cursorDot.style.transform = `translate(${mousePos.x}px, ${mousePos.y}px)`;
    }
  });

  // Smooth lerp loop for outer cursor ring
  function renderCursor() {
    ringPos.x += (mousePos.x - ringPos.x) * 0.18;
    ringPos.y += (mousePos.y - ringPos.y) * 0.18;

    if (cursorRing) {
      cursorRing.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
    }
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Magnetic Pull on Interactive Elements
  const magneticTargets = document.querySelectorAll(".magnetic-target");
  magneticTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-hover");
      audio.playChirp(700, 0.04);
    });

    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-hover");
      el.style.transform = "";
    });

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      // Subtle magnetic attraction
      el.style.transform = `translate3d(${x * 0.22}px, ${y * 0.22}px, 0)`;
    });

    el.addEventListener("click", () => {
      audio.playClick();
    });
  });

  /* ==========================================================================
     3. SPATIAL 3D CARD TILT & SPECULAR GLARE (PURE CSS/JS MATH)
     ========================================================================== */
  const tiltCards = document.querySelectorAll(".spatial-tilt-card, #heroProfileCard");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Cursor position in percentage for radial spotlight
      const xPct = (x / rect.width) * 100;
      const yPct = (y / rect.height) * 100;
      card.style.setProperty("--mouse-x", `${xPct}%`);
      card.style.setProperty("--mouse-y", `${yPct}%`);

      // 3D Gyroscopic tilt calculation
      const xCenter = rect.width / 2;
      const yCenter = rect.height / 2;
      const rotateX = -((y - yCenter) / yCenter) * 12; // max 12 deg
      const rotateY = ((x - xCenter) / xCenter) * 12;  // max 12 deg

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

      // Parallax effect on floating chips inside the hero card
      const floatingChips = card.querySelectorAll(".floating-chip");
      floatingChips.forEach((chip) => {
        const depth = parseFloat(chip.getAttribute("data-depth")) || 30;
        const chipMoveX = ((x - xCenter) / xCenter) * 15;
        const chipMoveY = ((y - yCenter) / yCenter) * 15;
        chip.style.transform = `translateZ(${depth}px) translate3d(${chipMoveX}px, ${chipMoveY}px, 0)`;
      });
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
      const floatingChips = card.querySelectorAll(".floating-chip");
      floatingChips.forEach((chip) => {
        const depth = parseFloat(chip.getAttribute("data-depth")) || 30;
        chip.style.transform = `translateZ(${depth}px)`;
      });
    });
  });

  /* ==========================================================================
     4. KINETIC TYPING EFFECT
     ========================================================================== */
  const roleTyping = document.getElementById("roleTyping");
  if (roleTyping) {
    const roles = [
      "Creative Developer",
      "Frontend Developer",
      "JavaScript Developer",
      "Web Developer"
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        roleTyping.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
      } else {
        roleTyping.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIdx === currentRole.length) {
        speed = 1800; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        speed = 400; // Pause before new word
      }

      setTimeout(typeLoop, speed);
    }
    typeLoop();
  }

  /* ==========================================================================
     5. GSAP SCROLLTRIGGER ORCHESTRATION
     ========================================================================== */
  if (typeof gsap !== "undefined") {
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Staggered Entrance
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl
      .from(".hud-bar", { opacity: 0, y: -20, duration: 0.8, delay: 0.2 })
      .from(".hero-badge", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
      .from(".split-line", { opacity: 0, y: 40, stagger: 0.15, duration: 0.8 }, "-=0.3")
      .from(".role-terminal", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
      .from(".hero-bio", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
      .from(".hero-ctas", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
      .from(".hero-transmitters", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
      .from("#heroProfileCard", { opacity: 0, scale: 0.9, rotationY: -15, duration: 1 }, "-=0.8");

    // Section Titles Reveal
    gsap.utils.toArray(".section-header").forEach((header) => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out"
      });
    });

    // Bento-Grid Cards Stagger
    gsap.from(".bento-item", {
      scrollTrigger: {
        trigger: ".bento-grid",
        start: "top 80%"
      },
      opacity: 0,
      y: 50,
      stagger: 0.15,
      duration: 0.9,
      ease: "power3.out"
    });

    // Metric Counters Animation
    const metricVals = document.querySelectorAll(".metric-val");
    metricVals.forEach((valEl) => {
      const target = parseInt(valEl.getAttribute("data-target")) || 0;
      const suffix = valEl.innerHTML.replace(/[0-9]/g, "");

      ScrollTrigger.create({
        trigger: valEl,
        start: "top 85%",
        once: true,
        onEnter: () => {
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 40));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            valEl.innerHTML = `${current}${suffix}`;
          }, 35);
        }
      });
    });

    // Skill Progress Bars on Scroll
    const skillMeters = document.querySelectorAll(".skill-meter");
    skillMeters.forEach((meter) => {
      const percent = meter.getAttribute("data-percent") || "0";
      const fill = meter.querySelector(".meter-fill");

      ScrollTrigger.create({
        trigger: meter,
        start: "top 90%",
        once: true,
        onEnter: () => {
          if (fill) fill.style.width = `${percent}%`;
        }
      });
    });

    // Projects Grid Stagger
    gsap.from(".project-spatial-card", {
      scrollTrigger: {
        trigger: ".projects-spatial-grid",
        start: "top 80%"
      },
      opacity: 0,
      y: 60,
      stagger: 0.15,
      duration: 0.9,
      ease: "power3.out"
    });

    // Timeline Scroll-Driven Glowing Energy Beam
    const energyBeam = document.getElementById("energyBeam");
    if (energyBeam) {
      ScrollTrigger.create({
        trigger: ".spatial-timeline",
        start: "top 70%",
        end: "bottom 70%",
        scrub: 0.3,
        onUpdate: (self) => {
          energyBeam.style.height = `${self.progress * 100}%`;
        }
      });
    }

    // Timeline Items Fade In
    gsap.utils.toArray(".timeline-spatial-item").forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 85%"
        },
        opacity: 0,
        x: -40,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  }

  /* ==========================================================================
     6. PROJECTS FILTER ENGINE
     ========================================================================== */
  const filterPills = document.querySelectorAll(".filter-pill");
  const projectCards = document.querySelectorAll(".project-spatial-card");

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      const filter = pill.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.classList.remove("hide");
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        } else {
          card.classList.add("hide");
        }
      });
    });
  });

  /* ==========================================================================
     7. COPY CODE SNIPPET (krishna.config.js)
     ========================================================================== */
  const copyBtn = document.getElementById("copyCodeBtn");
  const codeSnippet = document.getElementById("codeSnippet");

  if (copyBtn && codeSnippet) {
    copyBtn.addEventListener("click", () => {
      const codeText = codeSnippet.innerText;
      navigator.clipboard.writeText(codeText).then(() => {
        const label = copyBtn.querySelector(".copy-label");
        const originalText = label ? label.textContent : "Copy";
        if (label) label.textContent = "Copied!";
        copyBtn.style.color = "var(--green-online)";
        audio.playSuccess();

        setTimeout(() => {
          if (label) label.textContent = originalText;
          copyBtn.style.color = "";
        }, 2000);
      }).catch(() => {
        console.warn("Clipboard access denied.");
      });
    });
  }

  /* ==========================================================================
     8. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTER
     ========================================================================== */
  const navbar = document.getElementById("navbar");
  const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active Section Detection
    let currentId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 180;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute("id");
      }
    });

    navItems.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  });

  /* ==========================================================================
     9. MOBILE NAVIGATION MENU
     ========================================================================== */
  const menuBtn = document.getElementById("menuBtn");
  const navMenu = document.getElementById("navMenu");

  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      menuBtn.classList.toggle("open", isOpen);
      audio.playClick();
    });

    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuBtn.classList.remove("open");
      });
    });
  }

  /* ==========================================================================
     10. PRESERVED CONTACT FORM TRANSMISSION (POST /api/contact)
     ========================================================================== */
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formMessage = document.getElementById("formMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      // Client-side validation
      if (!name || !email || !message) {
        showFeedback("Please complete all required transmission fields.", "error");
        return;
      }

      // Email format sanity check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFeedback("Please provide a valid email transmission address.", "error");
        return;
      }

      // Enter loading state
      if (submitBtn) submitBtn.classList.add("loading");
      showFeedback("", ""); // Clear previous message

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (response.ok) {
          showFeedback(data.message || "Transmission established! Message successfully recorded.", "success");
          contactForm.reset();
          audio.playSuccess();
        } else {
          showFeedback(data.message || "Failed to establish transmission. Please verify credentials.", "error");
        }
      } catch (err) {
        console.error("Transmission error:", err);
        showFeedback("Network error. Unable to reach backend server.", "error");
      } finally {
        if (submitBtn) submitBtn.classList.remove("loading");
      }
    });
  }

  function showFeedback(text, type) {
    if (!formMessage) return;
    if (!text) {
      formMessage.style.display = "none";
      formMessage.className = "form-feedback-message";
      formMessage.textContent = "";
      return;
    }
    formMessage.textContent = text;
    formMessage.className = `form-feedback-message ${type}`;
    formMessage.style.display = "block";
  }

});
