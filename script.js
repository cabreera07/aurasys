const DEFAULT_THEME = "light";
const form = document.getElementById("diagnosticForm");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const header = document.getElementById("siteHeader");
const backToTop = document.getElementById("backToTop");
const scrollProgress = document.getElementById("scrollProgress");
const themeToggle = document.getElementById("themeToggle");
const waFloat = document.getElementById("waFloat");
const faqButtons = document.querySelectorAll(".faq-question");
const animatedElements = document.querySelectorAll("[data-animate]");
const submitBtn = document.getElementById("submitBtn");
const formMessage = document.getElementById("formMessage");
const medioContactoHelp = document.getElementById("medioContactoHelp");

// Throttle helper for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function setTheme(theme) {
  const resolvedTheme = theme || DEFAULT_THEME;
  document.body.setAttribute("data-theme", resolvedTheme);
  localStorage.setItem("aurasys-theme", resolvedTheme);
  if (themeToggle) {
    themeToggle.textContent = resolvedTheme === "dark" ? "☀️" : "🌙";
  }
}

function applySharedConfig() {
  const config = window.AURASYS_CONFIG || {};
  const logo = config.logoPath || "assets/logo/logo-placeholder.svg";
  const whatsapp = config.whatsappUrl || "https://wa.me/502XXXXXXXX";
  const email = config.email || "tucorreo@ejemplo.com";
  const tiktok = config.tiktokUrl || "https://www.tiktok.com/@tuusuario";

  // Batch DOM updates - query once, update multiple targets
  const logoElements = document.querySelectorAll("#siteLogo, #footerLogo");
  logoElements.forEach((img) => {
    img.src = logo;
  });

  // Cache whatsapp links
  const waLinks = document.querySelectorAll("#waFloat, #footerWhatsApp, #contactWhatsApp");
  waLinks.forEach((a) => {
    a.href = whatsapp;
  });

  // Cache email links
  const emailLinks = document.querySelectorAll("#footerEmail, #contactEmail");
  emailLinks.forEach((a) => {
    a.href = `mailto:${email}`;
    a.textContent = email;
  });

  // Cache tiktok links
  const tikTokLinks = document.querySelectorAll("#footerTikTok, #contactTikTok");
  tikTokLinks.forEach((a) => {
    a.href = tiktok;
  });
}

function setHeaderState() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 12);
}

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = max > 0 ? (scrollTop / max) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = `${Math.min(percentage, 100)}%`;
  if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 320);
}

// Throttle scroll events (50ms)
const handleScroll = throttle(() => {
  setHeaderState();
  updateScrollProgress();
}, 50);

function toggleMenu() {
  if (!siteNav || !menuToggle) return;
  const isOpen = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function closeMenu() {
  if (!siteNav || !menuToggle) return;
  siteNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function setActiveNav() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === page) link.classList.add("active");
  });
}

function observeAnimations() {
  if (!animatedElements.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedElements.forEach((element) => observer.observe(element));
}

function setupFaq() {
  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isExpanded));
      // Use data attribute to avoid recalculating scrollHeight
      if (!isExpanded) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      } else {
        answer.style.maxHeight = "0px";
      }
    });
  });
}

function updateContactHelp() {
  if (!form || !medioContactoHelp) return;
  const selected = form.querySelector('input[name="medioContacto"]:checked')?.value;
  const whatsappValue = document.getElementById("whatsapp")?.value.trim() || "";
  const tiktokValue = document.getElementById("tiktok")?.value.trim() || "";

  if (selected === "whatsapp" && !whatsappValue) {
    medioContactoHelp.textContent = "Para elegir WhatsApp como medio de contacto, agrega tu número.";
  } else if (selected === "tiktok" && !tiktokValue) {
    medioContactoHelp.textContent = "Para elegir TikTok como medio de contacto, agrega tu usuario.";
  } else {
    medioContactoHelp.textContent = "Correo electrónico recomendado para recibir la propuesta formal.";
  }
}

function captureUtm() {
  const params = new URLSearchParams(window.location.search);
  ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach((key) => {
    const element = document.getElementById(key);
    if (element) element.value = params.get(key) || "";
  });
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showMessage(text, type) {
  if (!formMessage) return;
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
}

function validateForm() {
  if (!form) return true;
  const fullName = document.getElementById("nombreCompleto")?.value.trim();
  const email = document.getElementById("correo")?.value.trim();
  const description = document.getElementById("descripcion")?.value.trim();
  const selected = form.querySelector('input[name="medioContacto"]:checked')?.value;
  const whatsapp = document.getElementById("whatsapp")?.value.trim();
  const tiktok = document.getElementById("tiktok")?.value.trim();

  if (!fullName || !email || !description) {
    showMessage("Completa los campos obligatorios para continuar.", "error");
    return false;
  }
  if (!validateEmail(email)) {
    showMessage("Ingresa un correo electrónico válido.", "error");
    return false;
  }
  if (selected === "whatsapp" && !whatsapp) {
    showMessage("Para elegir WhatsApp como medio de contacto, agrega tu número.", "error");
    return false;
  }
  if (selected === "tiktok" && !tiktok) {
    showMessage("Para elegir TikTok como medio de contacto, agrega tu usuario.", "error");
    return false;
  }
  return true;
}

function buildPayload() {
  const data = new FormData(form);
  const payload = Object.fromEntries(data.entries());
  payload.fechaHoraEnvio = new Date().toISOString();
  payload.fuente = "Sitio web Aurasys";
  return payload;
}

async function sendRequest(payload) {
  const config = window.AURASYS_CONFIG || {};
  const googleScriptUrl = config.googleScriptUrl || "";

  if (!googleScriptUrl || googleScriptUrl.includes("PEGA_AQUI")) {
    console.info("Google Apps Script no configurado. Simulando envío exitoso localmente.");
    return Promise.resolve({ ok: true });
  }

  // Add 10 second timeout for fetch request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) throw new Error("Fallo al enviar la solicitud.");
    return response.json().catch(() => ({ ok: true }));
  } finally {
    clearTimeout(timeoutId);
  }
}

function resetForm() {
  if (!form) return;
  form.reset();
  const correoOption = form.querySelector('input[name="medioContacto"][value="correo"]');
  if (correoOption) correoOption.checked = true;
  captureUtm();
  updateContactHelp();
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!validateForm()) return;
  if (!submitBtn) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  try {
    const payload = buildPayload();
    await sendRequest(payload);
    showMessage(
      "Gracias por contactarnos. Hemos recibido tu solicitud. En Aurasys revisaremos la información y te contactaremos en 2 a 3 días hábiles. La propuesta formal será enviada por correo.",
      "success"
    );
    resetForm();
  } catch (error) {
    console.error(error);
    showMessage("No pudimos enviar tu solicitud en este momento. Inténtalo nuevamente más tarde.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar solicitud";
  }
}

// Use throttled scroll handler
window.addEventListener("scroll", handleScroll);

window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("aurasys-theme") || DEFAULT_THEME;
  setTheme(savedTheme);
  applySharedConfig();
  setHeaderState();
  updateScrollProgress();
  setActiveNav();
  captureUtm();
  updateContactHelp();
  observeAnimations();
  setupFaq();
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(currentTheme);
  });
}

if (menuToggle) menuToggle.addEventListener("click", toggleMenu);
if (siteNav) siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
if (backToTop) backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
if (form) form.addEventListener("submit", handleSubmit);
if (form) {
  document.querySelectorAll('input[name="medioContacto"]').forEach((radio) => {
    radio.addEventListener("change", updateContactHelp);
  });
}
window.addEventListener("resize", () => {
  if (window.innerWidth > 960) closeMenu();
});