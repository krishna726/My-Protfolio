/**
 * SPATIAL UI & LIQUID GLASS INTERACTIVE ENGINE
 * Optimized, high-performance architecture for Desktop & Mobile
 */
document.addEventListener("DOMContentLoaded", () => {
  /* 1. CINEMATIC AUDIO SYNTHESIZER */
  class SpatialAudioEngine {
    constructor() {
      this.ctx = null;
      this.isEnabled = false;
      const toggle = document.getElementById("soundToggle");
      if (toggle) toggle.addEventListener("click", () => this.toggle(toggle));
    }
    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
        this.gain = this.ctx.createGain();
        this.gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        this.gain.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
    }
    toggle(btn) {
      this.init();
      this.isEnabled = !this.isEnabled;
      btn.classList.toggle("active", this.isEnabled);
      const label = btn.querySelector(".sound-label");
      if (label) label.textContent = this.isEnabled ? "SFX: ON" : "SFX: OFF";
      if (this.isEnabled) this.tone(880, 0.08);
    }
    tone(freq, dur = 0.05, type = "sine") {
      if (!this.isEnabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        g.gain.setValueAtTime(0.02, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
        osc.connect(g);
        g.connect(this.gain);
        osc.start();
        osc.stop(this.ctx.currentTime + dur);
      } catch (e) {}
    }
    playClick() { this.tone(300, 0.04, "triangle"); }
    playSuccess() {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        setTimeout(() => this.tone(f, 0.2), i * 70)
      );
    }
  }
  const audio = new SpatialAudioEngine();

  /* 2. CINEMATIC QUANTUM NEBULA & STARDUST CANVAS (NEW BACKGROUND DESIGN) */
  const canvas = document.getElementById("spatialBgCanvas");
  const cursorGlow = document.getElementById("cursorGlow");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = 0, height = 0, dpr = 1;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, tx: window.innerWidth / 2, ty: window.innerHeight / 2 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", resize);
    resize();

    const updatePointer = (x, y) => {
      mouse.tx = x;
      mouse.ty = y;
      if (cursorGlow) {
        cursorGlow.style.left = `${x}px`;
        cursorGlow.style.top = `${y}px`;
        cursorGlow.style.opacity = "0.85";
      }
    };
    window.addEventListener("mousemove", (e) => updatePointer(e.clientX, e.clientY));
    window.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener("deviceorientation", (e) => {
      if (e.gamma !== null && e.beta !== null) {
        mouse.tx = width / 2 + (e.gamma / 35) * (width * 0.25);
        mouse.ty = height / 2 + ((e.beta - 40) / 35) * (height * 0.25);
      }
    }, { passive: true });

    // Stardust Nodes
    const isMobile = width < 768;
    const count = isMobile ? 48 : 88;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
      color: Math.random() > 0.45 ? "139, 92, 246" : "6, 182, 212"
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.015;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // Soft Floating Aurora Waves in Deep Background
      const g1 = ctx.createRadialGradient(
        width * 0.3 + Math.sin(t * 0.6) * 100,
        height * 0.25 + Math.cos(t * 0.5) * 80,
        40,
        width * 0.3,
        height * 0.25,
        width * 0.55
      );
      g1.addColorStop(0, "rgba(139, 92, 246, 0.12)");
      g1.addColorStop(0.6, "rgba(99, 102, 241, 0.04)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(
        width * 0.75 + Math.cos(t * 0.7) * 90,
        height * 0.7 + Math.sin(t * 0.6) * 80,
        30,
        width * 0.75,
        height * 0.7,
        width * 0.5
      );
      g2.addColorStop(0, "rgba(6, 182, 212, 0.1)");
      g2.addColorStop(0.5, "rgba(236, 72, 153, 0.03)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // Stardust Particles & Connecting Filaments
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Interactive mouse & touch repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          const force = (130 - dist) / 130;
          p.x += (dx / dist) * force * 4;
          p.y += (dy / dist) * force * 4;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, 0.75)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.fill();

        // Connect nearby nodes
        const maxDist = isMobile ? 75 : 105;
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - d / maxDist) * 0.22})`;
            ctx.lineWidth = 0.8;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  /* 3. FLUID MAGNETIC CURSOR & HOVER (DESKTOP) */
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");
  let cMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let cRing = { x: cMouse.x, y: cMouse.y };

  window.addEventListener("mousemove", (e) => {
    cMouse.x = e.clientX;
    cMouse.y = e.clientY;
    if (cursorDot) cursorDot.style.transform = `translate(${cMouse.x}px, ${cMouse.y}px)`;
  });

  const renderCursor = () => {
    cRing.x += (cMouse.x - cRing.x) * 0.18;
    cRing.y += (cMouse.y - cRing.y) * 0.18;
    if (cursorRing) cursorRing.style.transform = `translate(${cRing.x}px, ${cRing.y}px)`;
    requestAnimationFrame(renderCursor);
  };
  renderCursor();

  document.querySelectorAll(".magnetic-target").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-hover");
      audio.tone(700, 0.04);
    });
    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-hover");
      el.style.transform = "";
    });
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.2;
      const y = (e.clientY - (r.top + r.height / 2)) * 0.2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    el.addEventListener("click", () => audio.playClick());
  });

  /* 4. SPATIAL 3D CARD TILT & SPECULAR GLARE (TOUCH & MOUSE) */
  const tiltCards = document.querySelectorAll(".spatial-tilt-card, #heroProfileCard");
  const tilt = (card, cx, cy) => {
    const r = card.getBoundingClientRect();
    const x = cx - r.left;
    const y = cy - r.top;
    card.style.setProperty("--mouse-x", `${(x / r.width) * 100}%`);
    card.style.setProperty("--mouse-y", `${(y / r.height) * 100}%`);
    const rotX = -((y - r.height / 2) / (r.height / 2)) * 10;
    const rotY = ((x - r.width / 2) / (r.width / 2)) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
  };
  const untilt = (card) => { card.style.transform = ""; };

  tiltCards.forEach((c) => {
    c.addEventListener("mousemove", (e) => tilt(c, e.clientX, e.clientY));
    c.addEventListener("mouseleave", () => untilt(c));
    c.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) tilt(c, e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    c.addEventListener("touchend", () => setTimeout(() => untilt(c), 350));
  });

  /* 5. KINETIC TYPING EFFECT */
  const roleEl = document.getElementById("roleTyping");
  if (roleEl) {
    const roles = ["Creative Developer", "Frontend Developer", "JavaScript Developer", "Web Developer"];
    let rIdx = 0, cIdx = 0, del = false;
    const type = () => {
      const cur = roles[rIdx];
      roleEl.textContent = del ? cur.slice(0, --cIdx) : cur.slice(0, ++cIdx);
      let spd = del ? 40 : 80;
      if (!del && cIdx === cur.length) { spd = 1800; del = true; }
      else if (del && cIdx === 0) { del = false; rIdx = (rIdx + 1) % roles.length; spd = 400; }
      setTimeout(type, spd);
    };
    type();
  }

  /* 6. GSAP SCROLLTRIGGER ORCHESTRATION (CROSS-DEVICE) */
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const isMob = window.innerWidth <= 820;
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (!isMob && document.querySelector(".hud-bar")) {
      heroTl.from(".hud-bar", { opacity: 0, y: -20, duration: 0.6, delay: 0.1 });
    }
    heroTl
      .from(".hero-badge", { opacity: 0, y: 20, duration: 0.5 }, isMob ? "+=0.1" : "-=0.2")
      .from(".split-line", { opacity: 0, y: 30, stagger: 0.12, duration: 0.7 }, "-=0.3")
      .from(".role-terminal", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3")
      .from(".hero-bio, .hero-ctas, .hero-transmitters", { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 }, "-=0.3")
      .from("#heroProfileCard", { opacity: 0, scale: 0.92, duration: 0.9, ease: "power3.out" }, "-=0.5");

    // Reveal Section Headers & Cards smoothly on both phone & laptop
    gsap.utils.toArray(".section-header, .bento-item, .service-card, .project-spatial-card, .timeline-spatial-item").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        opacity: 0,
        y: 35,
        duration: 0.75,
        ease: "power2.out"
      });
    });

    // Metric Counters
    document.querySelectorAll(".metric-val").forEach((valEl) => {
      const target = parseInt(valEl.getAttribute("data-target")) || 0;
      const suffix = valEl.innerHTML.replace(/[0-9]/g, "");
      ScrollTrigger.create({
        trigger: valEl,
        start: "top 92%",
        once: true,
        onEnter: () => {
          let cur = 0;
          const step = Math.max(1, Math.ceil(target / 35));
          const tm = setInterval(() => {
            cur = Math.min(target, cur + step);
            valEl.innerHTML = `${cur}${suffix}`;
            if (cur >= target) clearInterval(tm);
          }, 35);
        }
      });
    });

    // Skill Progress Meters
    document.querySelectorAll(".skill-meter").forEach((m) => {
      const pct = m.getAttribute("data-percent") || "0";
      const fill = m.querySelector(".meter-fill");
      ScrollTrigger.create({
        trigger: m,
        start: "top 95%",
        once: true,
        onEnter: () => { if (fill) fill.style.width = `${pct}%`; }
      });
    });

    // Timeline Energy Beam
    const beam = document.getElementById("energyBeam");
    if (beam) {
      ScrollTrigger.create({
        trigger: ".spatial-timeline",
        start: "top 75%",
        end: "bottom 75%",
        scrub: 0.3,
        onUpdate: (s) => { beam.style.height = `${s.progress * 100}%`; }
      });
    }

    window.addEventListener("load", () => ScrollTrigger.refresh());
    window.addEventListener("orientationchange", () => setTimeout(() => ScrollTrigger.refresh(), 250));
  }

  /* 7. PROJECTS FILTER */
  const pills = document.querySelectorAll(".filter-pill");
  const pCards = document.querySelectorAll(".project-spatial-card");
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      const f = pill.getAttribute("data-filter");
      pCards.forEach((c) => {
        const match = f === "all" || c.getAttribute("data-category") === f;
        c.classList.toggle("hide", !match);
        if (match) {
          c.style.opacity = "0";
          c.style.transform = "translateY(15px)";
          setTimeout(() => { c.style.opacity = "1"; c.style.transform = "translateY(0)"; }, 40);
        }
      });
    });
  });

  /* 8. COPY SNIPPET */
  const copyBtn = document.getElementById("copyCodeBtn");
  const codeEl = document.getElementById("codeSnippet");
  if (copyBtn && codeEl) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(codeEl.textContent).then(() => {
        const lbl = copyBtn.querySelector(".copy-label");
        if (lbl) lbl.textContent = "Copied!";
        copyBtn.style.color = "var(--green-online)";
        audio.playSuccess();
        setTimeout(() => {
          if (lbl) lbl.textContent = "Copy";
          copyBtn.style.color = "";
        }, 2000);
      });
    });
  }

  /* 9. NAVBAR SCROLL SPY & MOBILE MENU */
  const navbar = document.getElementById("navbar");
  const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
    let curId = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 180) curId = sec.getAttribute("id");
    });
    navItems.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${curId}`);
    });
  });

  const menuBtn = document.getElementById("menuBtn");
  const navMenu = document.getElementById("navMenu");
  const brandLogo = document.querySelector(".brand-logo");
  const closeMenu = () => {
    if (navMenu) navMenu.classList.remove("active");
    if (menuBtn) menuBtn.classList.remove("open");
  };
  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      const open = navMenu.classList.toggle("active");
      menuBtn.classList.toggle("open", open);
      audio.playClick();
    });
    navItems.forEach((l) => l.addEventListener("click", closeMenu));
    if (brandLogo) brandLogo.addEventListener("click", closeMenu);
  }

  /* 10. CONTACT FORM SUBMISSION */
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formMsg = document.getElementById("formMessage");
  const showFeedback = (txt, type) => {
    if (!formMsg) return;
    formMsg.style.display = txt ? "block" : "none";
    formMsg.className = `form-feedback-message ${type}`;
    formMsg.textContent = txt || "";
  };

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = (document.getElementById("name")?.value || "").trim();
      const email = (document.getElementById("email")?.value || "").trim();
      const message = (document.getElementById("message")?.value || "").trim();

      if (!name || !email || !message) {
        return showFeedback("Please complete all required fields.", "error");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return showFeedback("Please provide a valid email address.", "error");
      }

      if (submitBtn) submitBtn.classList.add("loading");
      showFeedback("", "");

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message })
        });
        const data = await res.json();
        if (res.ok) {
          showFeedback(data.message || "Message sent successfully!", "success");
          form.reset();
          audio.playSuccess();
        } else {
          showFeedback(data.message || "Failed to send message.", "error");
        }
      } catch (err) {
        showFeedback("Network error. Unable to reach backend server.", "error");
      } finally {
        if (submitBtn) submitBtn.classList.remove("loading");
      }
    });
  }
});
