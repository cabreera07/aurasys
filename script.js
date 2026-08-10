const DEFAULT_THEME = "dark";
const form = document.getElementById("diagnosticForm");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const header = document.getElementById("siteHeader");
const backToTop = document.getElementById("backToTop");
const scrollProgress = document.getElementById("scrollProgress");
const themeToggle = document.getElementById("themeToggle");
const waFloat = document.getElementById("waFloat");
const faqButtons = document.querySelectorAll(".faq-question");
const animatedElements = document.querySelectorAll("[data-animate], .service-card, .timeline-step");
const submitBtn = document.getElementById("submitBtn");
const formMessage = document.getElementById("formMessage");
let navBackdrop = null;

function setTheme(theme) {
  const resolvedTheme = theme || DEFAULT_THEME;
  document.body.setAttribute("data-theme", resolvedTheme);
  localStorage.setItem("aurasys-theme", resolvedTheme);
  if (themeToggle) {
    themeToggle.textContent = resolvedTheme === "dark" ? "☀️" : "🌙";
  }
  updateLogoForTheme(resolvedTheme);
}

function updateLogoForTheme(theme) {
  const config = window.AURASYS_CONFIG || {};
  const darkLogo = config.logoDarkPath || config.logoPath || "assets/logo/logo-placeholder.svg";
  const selectedLogo = darkLogo;

  document.querySelectorAll("#siteLogo, #footerLogo").forEach((img) => {
    img.src = selectedLogo;
  });
}

function applySharedConfig() {
  const config = window.AURASYS_CONFIG || {};
  const whatsapp = config.whatsappUrl || "https://wa.me/50258798301";
  const email = config.email || "CABREERA07WALTER@gmail.com";
  const tiktok = config.tiktokUrl || "https://www.tiktok.com/@tuusuario";

  if (waFloat) waFloat.href = whatsapp;
  document.querySelectorAll("#footerWhatsApp, #contactWhatsApp").forEach((a) => {
    a.href = whatsapp;
  });
  document.querySelectorAll("#footerEmail, #contactEmail").forEach((a) => {
    a.href = `mailto:${email}`;
    a.textContent = email;
  });
  document.querySelectorAll("#footerTikTok, #contactTikTok").forEach((a) => {
    a.href = tiktok;
  });
}

function animateCounters() {
  document.querySelectorAll("[data-stat]").forEach((counter) => {
    const target = Number(counter.dataset.stat || 0);
    const suffix = counter.dataset.suffix || "";
    const startValue = 0;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (target - startValue) * eased;
      const rawValue = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
      counter.textContent = `${rawValue}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
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

function toggleMenu() {
  if (!siteNav || !menuToggle) return;
  const isOpen = siteNav.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
  if (navBackdrop) navBackdrop.classList.toggle("open", isOpen);
}

function closeMenu() {
  if (!siteNav || !menuToggle) return;
  siteNav.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
  if (navBackdrop) navBackdrop.classList.remove("open");
}

function ensureMenuBackdrop() {
  if (!siteNav || !menuToggle || navBackdrop) return;
  navBackdrop = document.createElement("button");
  navBackdrop.type = "button";
  navBackdrop.className = "nav-backdrop";
  navBackdrop.setAttribute("aria-label", "Cerrar menu");
  navBackdrop.addEventListener("click", closeMenu);
  document.body.appendChild(navBackdrop);
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
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

  animatedElements.forEach((element, index) => {
    const delay = Math.min(index * 60, 300);
    element.style.transitionDelay = `${delay}ms`;
    observer.observe(element);
  });
}

function setupFaq() {
  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isExpanded));
      answer.style.maxHeight = isExpanded ? "0px" : `${answer.scrollHeight}px`;
    });
  });
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateContact(value) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return false;
  if (trimmedValue.includes("@")) {
    return validateEmail(trimmedValue);
  }

  const digitsOnly = trimmedValue.replace(/\D/g, "");
  return digitsOnly.length >= 8;
}

function showMessage(text, type) {
  if (!formMessage) return;
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
}

function clearMessage() {
  if (!formMessage) return;
  formMessage.textContent = "";
  formMessage.className = "form-message";
}

function validateForm() {
  if (!form) return true;

  const fullName = document.getElementById("nombreCompleto")?.value.trim();
  const contactMethod = document.getElementById("medioContacto")?.value.trim();
  const problem = document.getElementById("descripcion")?.value.trim();
  const requirement = form.querySelector('input[name="requerimiento"]:checked')?.value;

  if (!fullName || !contactMethod || !problem || !requirement) {
    showMessage("Completa los campos obligatorios para continuar.", "error");
    return false;
  }

  if (!validateContact(contactMethod)) {
    showMessage("Ingresa un correo válido o un número de WhatsApp con al menos 8 dígitos.", "error");
    return false;
  }

  return true;
}

function buildPayload() {
  return {
    nombreCompleto: document.getElementById("nombreCompleto")?.value.trim() || "",
    medioContacto: document.getElementById("medioContacto")?.value.trim() || "",
    descripcion: document.getElementById("descripcion")?.value.trim() || "",
    requerimiento: form.querySelector('input[name="requerimiento"]:checked')?.value || "",
  };
}

async function sendRequest(payload) {
  const config = window.AURASYS_CONFIG || {};
  const googleScriptUrl = config.googleScriptUrl || "";

  if (!googleScriptUrl || googleScriptUrl.includes("PEGA_AQUI")) {
    console.info("Google Apps Script no configurado. Simulando envío exitoso localmente.");
    return Promise.resolve({ ok: true });
  }

  await fetch(googleScriptUrl, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: new URLSearchParams(payload).toString(),
  });

  return { ok: true };
}

function resetForm() {
  if (!form) return;
  form.reset();
  const defaultRequirement = form.querySelector('input[name="requerimiento"][value="Estructurar un nuevo proyecto"]');
  if (defaultRequirement) defaultRequirement.checked = true;
}

async function handleSubmit(event) {
  event.preventDefault();
  clearMessage();
  if (!validateForm()) return;
  if (!submitBtn) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  try {
    const payload = buildPayload();
    await sendRequest(payload);
    resetForm();
    showMessage("Gracias por completar el formulario. Nos contactaremos pronto.", "success");
  } catch (error) {
    console.error(error);
    showMessage("No pudimos enviar el formulario en este momento. Inténtalo de nuevo en unos minutos o contáctanos por WhatsApp o correo.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar solicitud";
  }
}

window.addEventListener("scroll", () => {
  setHeaderState();
  updateScrollProgress();
});

window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("aurasys-theme") || DEFAULT_THEME;
  setTheme(savedTheme);
  ensureMenuBackdrop();
  applySharedConfig();
  animateCounters();
  setHeaderState();
  updateScrollProgress();
  setActiveNav();
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

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 960) closeMenu();
});

if (form) form.addEventListener("submit", handleSubmit);
if (form) {
  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", clearMessage);
    field.addEventListener("change", clearMessage);
  });
}