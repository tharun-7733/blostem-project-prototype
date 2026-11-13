/* ═══════════════════════════════════════════════════════════
   CropWise — Main Application Script
   Particle system, form handling, API calls, animations
   ═══════════════════════════════════════════════════════════ */

const API_URL = "http://127.0.0.1:5000";

/* ── Crop enrichment data ── */
const CROP_DB = {
  rice:        { season: "Kharif", water: "High", period: "120–150 days", tip: "Requires standing water and warm, humid conditions." },
  maize:       { season: "Kharif", water: "Medium", period: "80–110 days", tip: "Thrives in well-drained, fertile loam soil." },
  chickpea:    { season: "Rabi", water: "Low", period: "90–120 days", tip: "Grows well in cool, dry climates with minimal irrigation." },
  kidneybeans: { season: "Rabi", water: "Medium", period: "90–120 days", tip: "Prefers slightly acidic soil and moderate rainfall." },
  pigeonpeas:  { season: "Kharif", water: "Low", period: "120–180 days", tip: "Drought-resistant; ideal for semi-arid regions." },
  mothbeans:   { season: "Kharif", water: "Low", period: "60–90 days", tip: "Very drought-tolerant; grows in sandy soils." },
  mungbean:    { season: "Kharif / Zaid", water: "Low", period: "60–75 days", tip: "Short-duration pulse; good for crop rotation." },
  blackgram:   { season: "Kharif / Rabi", water: "Low", period: "80–90 days", tip: "Tolerates shade; grows well as an intercrop." },
  lentil:      { season: "Rabi", water: "Low", period: "100–120 days", tip: "Prefers loamy soil with good drainage." },
  pomegranate: { season: "Kharif / Rabi", water: "Low", period: "150–180 days", tip: "Drought-hardy fruit; prefers hot, dry climate." },
  banana:      { season: "Kharif", water: "High", period: "270–365 days", tip: "Needs rich, well-drained soil and consistent moisture." },
  mango:       { season: "Kharif", water: "Medium", period: "100–150 days", tip: "Deep-rooted tree; flourishes in tropical heat." },
  grapes:      { season: "Rabi", water: "Medium", period: "150–180 days", tip: "Requires trellising and well-drained sandy loam." },
  watermelon:  { season: "Zaid", water: "High", period: "80–110 days", tip: "Needs warm temperatures and sandy, fertile soil." },
  muskmelon:   { season: "Zaid", water: "Medium", period: "70–90 days", tip: "Prefers warm, dry weather with full sunlight." },
  apple:       { season: "Rabi", water: "Medium", period: "150–180 days", tip: "Requires chilling hours; ideal for hilly regions." },
  orange:      { season: "Rabi", water: "Medium", period: "240–365 days", tip: "Prefers well-drained loam and warm subtropical climate." },
  papaya:      { season: "Kharif", water: "Medium", period: "270–330 days", tip: "Fast-growing; needs protection from frost and wind." },
  coconut:     { season: "Kharif", water: "High", period: "365+ days", tip: "Coastal crop; requires consistent warmth and humidity." },
  cotton:      { season: "Kharif", water: "Medium", period: "150–180 days", tip: "Needs black soil and warm, sunny weather." },
  jute:        { season: "Kharif", water: "High", period: "120–150 days", tip: "Thrives in alluvial soil with high humidity." },
  coffee:      { season: "Kharif / Rabi", water: "Medium", period: "365+ days", tip: "Shade-grown; prefers cool highlands and rich soil." },
};

/* ══════════════════════════════════════════════════
   1. PARTICLE SYSTEM
   ══════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, particles = [];
  const COUNT = 60;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * w;
      this.y = init ? Math.random() * h : h + 10;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = -(Math.random() * 0.3 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.35 + 0.05;
      this.hue = Math.random() > 0.8 ? 38 : 152; // amber or green
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.005) * 0.15;
      if (this.y < -10 || this.x < -10 || this.x > w + 10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ══════════════════════════════════════════════════
   2. NAV SCROLL EFFECT
   ══════════════════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById("main-nav");
  const scrollIndicator = document.getElementById("scroll-indicator");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY > 60;
    nav.classList.toggle("scrolled", scrolled);
    if (scrollIndicator) {
      scrollIndicator.style.opacity = scrolled ? "0" : "1";
    }
  }, { passive: true });
})();

/* ══════════════════════════════════════════════════
   3. SCROLL REVEAL
   ══════════════════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("visible"), i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  els.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════════════════
   4. SLIDER VALUE SYNC
   ══════════════════════════════════════════════════ */
(function initSliders() {
  document.querySelectorAll(".custom-slider").forEach(slider => {
    const displayId = slider.dataset.display;
    const display = document.getElementById(displayId);
    if (!display) return;

    function updateTrack() {
      const min = parseFloat(slider.min);
      const max = parseFloat(slider.max);
      const val = parseFloat(slider.value);
      const pct = ((val - min) / (max - min)) * 100;
      slider.style.background = `linear-gradient(90deg, #059669 0%, #34d399 ${pct}%, #112118 ${pct}%)`;
      display.textContent = slider.step % 1 !== 0 ? val.toFixed(1) : val;
    }

    slider.addEventListener("input", updateTrack);
    updateTrack(); // initial
  });
})();

/* ══════════════════════════════════════════════════
   5. SEASON SELECTOR
   ══════════════════════════════════════════════════ */
let selectedSeason = "kharif";
(function initSeason() {
  document.querySelectorAll(".season-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".season-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSeason = btn.dataset.season;
    });
  });
})();

/* ══════════════════════════════════════════════════
   6. FORM SUBMISSION & API CALL
   ══════════════════════════════════════════════════ */
(function initForm() {
  const form = document.getElementById("crop-form");
  const btn = document.getElementById("analyze-btn");
  const btnText = btn?.querySelector(".btn-text");
  const btnLoader = document.getElementById("btn-loader");
  const resultCard = document.getElementById("result-card");
  const placeholder = document.getElementById("result-placeholder");

  if (!form || !btn) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Gather values
    const payload = {
      N: parseFloat(document.getElementById("nitrogen").value),
      P: parseFloat(document.getElementById("phosphorus").value),
      K: parseFloat(document.getElementById("potassium").value),
      ph: parseFloat(document.getElementById("ph").value),
      temperature: parseFloat(document.getElementById("temperature").value),
      humidity: parseFloat(document.getElementById("humidity").value),
      rainfall: parseFloat(document.getElementById("rainfall").value),
    };

    // UI: loading state
    btn.disabled = true;
    if (btnText) btnText.textContent = "Analyzing...";
    if (btnLoader) btnLoader.classList.remove("hidden");

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        showResult(data);
      } else {
        showError(data.error || "Prediction failed.");
      }
    } catch (err) {
      showError("Could not reach the prediction server. Make sure the Flask server is running on port 5000.");
    } finally {
      btn.disabled = false;
      if (btnText) btnText.textContent = "Analyze & Recommend";
      if (btnLoader) btnLoader.classList.add("hidden");
    }
  });

  /* ── Show result ── */
  function showResult(data) {
    const primary = data.primary;
    const info = CROP_DB[primary] || {};

    // Crop name
    const nameEl = document.getElementById("result-crop-name");
    if (nameEl) nameEl.textContent = primary;

    // Details
    setDetail("detail-season", info.season || "—");
    setDetail("detail-water", info.water || "—");
    setDetail("detail-period", info.period || "—");
    setDetail("detail-cluster", `Cluster ${data.cluster}`);

    // Alt crops
    const altSection = document.getElementById("alt-crops");
    const altList = document.getElementById("alt-list");
    const altCrops = data.recommendations.filter(r => r.name !== primary);

    if (altCrops.length > 0 && altSection && altList) {
      altList.innerHTML = "";
      altCrops.forEach((crop, i) => {
        const chip = document.createElement("span");
        chip.className = "alt-chip";
        chip.textContent = crop.name;
        chip.style.animationDelay = `${0.6 + i * 0.1}s`;
        altList.appendChild(chip);
      });
      altSection.classList.remove("hidden");
    } else if (altSection) {
      altSection.classList.add("hidden");
    }

    // Toggle visibility
    if (placeholder) placeholder.classList.add("hidden");
    if (resultCard) {
      resultCard.classList.remove("hidden");
      resultCard.classList.add("visible");
    }

    // Scroll to result on mobile
    if (window.innerWidth < 1024 && resultCard) {
      resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function setDetail(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function showError(msg) {
    const nameEl = document.getElementById("result-crop-name");
    if (nameEl) nameEl.textContent = "Error";

    setDetail("detail-season", "—");
    setDetail("detail-water", "—");
    setDetail("detail-period", "—");
    setDetail("detail-cluster", msg);

    const altSection = document.getElementById("alt-crops");
    if (altSection) altSection.classList.add("hidden");

    if (placeholder) placeholder.classList.add("hidden");
    if (resultCard) {
      resultCard.classList.remove("hidden");
      resultCard.classList.add("visible");
    }
  }

  /* ── Reset button ── */
  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (resultCard) {
        resultCard.classList.add("hidden");
        resultCard.classList.remove("visible");
      }
      if (placeholder) placeholder.classList.remove("hidden");
      const altSection = document.getElementById("alt-crops");
      if (altSection) altSection.classList.add("hidden");
    });
  }
})();

/* ══════════════════════════════════════════════════
   7. SMOOTH ANCHOR SCROLL
   ══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
