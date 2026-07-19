// Wires CONFIG (js/config.js) into the page. No framework — the page is small
// enough that plain DOM code stays readable.

function isTodo(value) {
  return !value || String(value).trim().startsWith("TODO");
}

function setAll(selector, fn) {
  document.querySelectorAll(selector).forEach(fn);
}

document.addEventListener("DOMContentLoaded", () => {
  const C = window.CONFIG || CONFIG;

  /* ---------- Socials + email (clickable everywhere they appear) ---------- */
  setAll('[data-social="instagram"]', (a) => { a.href = C.instagram.url; });
  setAll('[data-social="tiktok"]', (a) => { a.href = C.tiktok.url; });
  setAll('[data-bind="ig-handle"]', (el) => { el.textContent = C.instagram.handle; });
  setAll('[data-bind="tt-handle"]', (el) => { el.textContent = C.tiktok.handle; });

  const emailLive = !isTodo(C.email);
  setAll('[data-social="email"]', (a) => {
    if (emailLive) {
      a.href = "mailto:" + C.email;
    } else {
      // No public email yet — route the click to the application form instead.
      a.href = "#apply";
    }
  });
  setAll('[data-bind="email-text"]', (el) => {
    el.textContent = emailLive ? C.email : "Email coming soon";
  });

  /* ---------- Consult call ---------- */
  setAll('[data-bind="consult-price"]', (el) => { el.textContent = C.consulting.price; });
  setAll('[data-bind="consult-duration"]', (el) => { el.textContent = C.consulting.duration; });

  const consultBtn = document.querySelector('[data-cta="consult"]');
  if (consultBtn) {
    if (isTodo(C.consulting.bookingUrl)) {
      markComingSoon(consultBtn, "Booking link goes live soon. DM me in the meantime.");
    } else {
      consultBtn.href = C.consulting.bookingUrl;
      consultBtn.target = "_blank";
      consultBtn.rel = "noopener";
    }
  }

  /* ---------- Blueprint ---------- */
  setAll('[data-bind="blueprint-name"]', (el) => { el.textContent = C.blueprint.name; });
  const priceEl = document.querySelector('[data-bind="blueprint-price"]');
  // No price yet → leave the line empty; the disabled CTA already says "Coming Soon".
  if (priceEl) priceEl.textContent = isTodo(C.blueprint.price) ? "" : C.blueprint.price;

  const bpBtn = document.querySelector('[data-cta="blueprint"]');
  if (bpBtn) {
    if (isTodo(C.blueprint.url)) {
      markComingSoon(bpBtn, "Almost ready. Follow me on TikTok for the drop.");
    } else {
      bpBtn.href = C.blueprint.url;
      bpBtn.target = "_blank";
      bpBtn.rel = "noopener";
    }
  }

  /* ---------- Biohackr ---------- */
  setAll('[data-bind="bh-discount"]', (el) => { el.textContent = C.biohackr.discount; });
  const codeLive = !isTodo(C.biohackr.code);
  setAll('[data-bind="bh-code"]', (el) => {
    el.textContent = codeLive ? C.biohackr.code : "Code coming soon";
  });

  const bhBtn = document.querySelector('[data-cta="biohackr"]');
  if (bhBtn) bhBtn.href = C.biohackr.url;

  const copyBtn = document.querySelector('[data-cta="copy-code"]');
  if (copyBtn) {
    if (!codeLive) {
      copyBtn.hidden = true;
    } else {
      const copyLabel = copyBtn.querySelector(".voucher-hint-text") || copyBtn.querySelector(".voucher-hint") || copyBtn;
      const copyIdle = copyLabel.textContent;
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(C.biohackr.code);
          copyLabel.textContent = "Copied!";
        } catch {
          copyLabel.textContent = "Code: " + C.biohackr.code;
        }
        setTimeout(() => { copyLabel.textContent = copyIdle; }, 2000);
      });
    }
  }

  /* ---------- Case studies ---------- */
  renderCaseStudies(C);

  /* ---------- Application modal + form ---------- */
  const modal = document.getElementById("apply-modal");
  if (modal) {
    setAll('a[href="#apply"]', (a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        modal.showModal();
      });
    });
    modal.querySelector("[data-close-apply]").addEventListener("click", () => modal.close());
    // Close on backdrop click (clicks outside the dialog's own box)
    modal.addEventListener("click", (e) => {
      if (e.target !== modal) return;
      const r = modal.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right &&
                     e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) modal.close();
    });
  }

  const form = document.getElementById("apply-form");
  if (form) setupForm(form, C);

  /* ---------- Footer year ---------- */
  setAll('[data-bind="year"]', (el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Header shadow on scroll ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  }
});

/*
  Case studies. The section only appears once real content exists in
  CONFIG.caseStudies — no invented client results. Open the site with
  ?proof-preview to see the layout filled with clearly-marked sample text.
*/
const SAMPLE_CASES = [
  {
    sample: true,
    name: "Client One",
    headline: "Result headline goes here",
    timeframe: "X months",
    stats: [
      { value: "-00 lbs", label: "total change" },
      { value: "0 mo", label: "to goal" },
      { value: "0 mo+", label: "maintained" }
    ],
    story: [
      "Paragraph one: where they started. Age, job, what they'd tried before, what kept getting in the way.",
      "Paragraph two: what we changed. The food setup, the training, the habit work, and how we adjusted when life pushed back.",
      "Paragraph three: the result in plain numbers, and what they keep doing on their own now."
    ],
    quote: "One sentence from the client, in their own words."
  },
  {
    sample: true,
    name: "Client Two",
    headline: "Second result headline here",
    timeframe: "X months",
    stats: [
      { value: "-00 lbs", label: "total change" },
      { value: "0 mo", label: "to goal" },
      { value: "0 mo+", label: "maintained" }
    ],
    story: [
      "Same structure as the first: starting point, the plan, the outcome.",
      "Depth beats volume here. Give the reader the whole arc, and let the two stories carry the section."
    ],
    quote: "A second client quote goes here."
  }
];

function caseComplete(cs) {
  return cs && !isTodo(cs.name) && !isTodo(cs.headline) &&
    Array.isArray(cs.story) && cs.story.some((p) => !isTodo(p));
}

function renderCaseStudies(C) {
  const section = document.getElementById("proof");
  if (!section) return;
  const list = section.querySelector(".cs-list");

  let entries = (C.caseStudies || []).filter(caseComplete);
  const previewMode = new URLSearchParams(location.search).has("proof-preview");
  if (!entries.length) {
    if (!previewMode) { section.hidden = true; return; }
    entries = SAMPLE_CASES;
  }

  section.hidden = false;
  list.innerHTML = "";
  entries.forEach((cs) => list.appendChild(buildCaseStudy(cs)));
}

function buildCaseStudy(cs) {
  const el = document.createElement("article");
  el.className = "case-study reveal in";

  const stats = (cs.stats || [])
    .filter((s) => s && !isTodo(s.value) && !isTodo(s.label) && s.value !== "TODO")
    .map((s) => '<div class="cs-stat"><b>' + escapeHtml(s.value) + "</b><span>" + escapeHtml(s.label) + "</span></div>")
    .join("");

  const story = (cs.story || [])
    .filter((p) => !isTodo(p))
    .map((p) => "<p>" + escapeHtml(p) + "</p>")
    .join("");

  const hasImages = !isTodo(cs.beforeImage) && !isTodo(cs.afterImage);
  const media = hasImages
    ? '<div class="ba-pair">' +
        '<figure class="ba-fig"><img src="' + escapeHtml(cs.beforeImage) + '" alt="' + escapeHtml(cs.name) + ' before" loading="lazy"><figcaption class="ba-label">Before</figcaption></figure>' +
        '<figure class="ba-fig"><img src="' + escapeHtml(cs.afterImage) + '" alt="' + escapeHtml(cs.name) + ' after" loading="lazy"><figcaption class="ba-label ba-label-after">After</figcaption></figure>' +
      "</div>"
    : '<div class="cs-monogram" aria-hidden="true">' + escapeHtml((cs.name || "?").charAt(0)) + "</div>";

  el.innerHTML =
    '<div class="cs-media">' + media + "</div>" +
    '<div class="cs-body">' +
      (cs.sample ? '<p class="sample-flag">Sample layout. Real case study goes in js/config.js</p>' : "") +
      '<p class="cs-name">' + escapeHtml(cs.name) +
        (!isTodo(cs.timeframe) ? '<span class="cs-time">' + escapeHtml(cs.timeframe) + "</span>" : "") + "</p>" +
      '<h3 class="cs-headline">' + escapeHtml(cs.headline) + "</h3>" +
      (stats ? '<div class="cs-stats">' + stats + "</div>" : "") +
      '<div class="cs-story">' + story + "</div>" +
      (!isTodo(cs.quote) ? '<blockquote class="cs-quote">&ldquo;' + escapeHtml(cs.quote) + "&rdquo;</blockquote>" : "") +
    "</div>";
  return el;
}

/* Disable a CTA whose real link isn't provided yet, with a short note under it. */
function markComingSoon(btn, note) {
  btn.removeAttribute("href");
  btn.setAttribute("aria-disabled", "true");
  btn.textContent = "Coming Soon";
  btn.closest(".offer-card")?.classList.add("is-soon");
  const p = document.createElement("p");
  p.className = "soon-note";
  p.textContent = note;
  btn.insertAdjacentElement("afterend", p);
}

function setupForm(form, C) {
  const endpointLive = !isTodo(C.coaching.formAction);
  const emailLive = !isTodo(C.email);
  const status = form.querySelector(".form-status");
  const submitBtn = form.querySelector('[data-cta="submit"]');

  if (endpointLive) form.action = C.coaching.formAction;

  const requiredMsg = {
    name: "Tell me your name.",
    email: "I need a real email to reply to.",
    age: "I need your age.",
    phone: "I need a number for the call if we're a fit.",
    work: "Just a few words — it helps me build around your schedule.",
    goal: "Pick whichever is closest.",
    change: "This one matters. Be honest.",
    why: "This is your pitch. Don't waste it.",
    investment: "Pick whichever is true today."
  };

  function validateField(input) {
    if (input.type === "hidden" || input.name === "_honey") return true;
    const field = input.closest(".field");
    if (!field) return true;
    const errEl = field.querySelector(".field-error");
    let msg = "";
    if (input.required && !input.value.trim()) {
      msg = requiredMsg[input.name] || "This one's required.";
    } else if (input.type === "email" && input.value && !/^\S+@\S+\.\S+$/.test(input.value)) {
      msg = "That email doesn't look right.";
    } else if (input.type === "tel" && input.value && !/^[+()\d\s.-]{7,}$/.test(input.value.trim())) {
      msg = "That phone number doesn't look right.";
    } else if (input.name === "age" && input.value && (+input.value < 16 || +input.value > 100)) {
      msg = "That age doesn't look right.";
    }
    field.classList.toggle("has-error", !!msg);
    errEl.textContent = msg;
    return !msg;
  }

  // Validate on blur, clear as the user fixes things
  form.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("blur", () => { if (input.value || input.required) validateField(input); });
    input.addEventListener("input", () => {
      const field = input.closest(".field");
      if (field.classList.contains("has-error")) validateField(input);
    });
  });

  /* ---------- Multi-step wiring: easy questions first, contact last ---------- */
  const steps = [...form.querySelectorAll(".form-step")];
  const nextBtn = form.querySelector("[data-step-next]");
  const backBtn = form.querySelector("[data-step-back]");
  const progressText = document.querySelector("[data-progress-text]");
  const progressFill = document.querySelector("[data-progress-fill]");
  let stepIdx = 0;

  function showStep(i) {
    stepIdx = i;
    steps.forEach((s, n) => { s.hidden = n !== i; });
    const last = i === steps.length - 1;
    backBtn.hidden = i === 0;
    nextBtn.hidden = last;
    submitBtn.hidden = !last;
    if (progressText) progressText.textContent = "Step " + (i + 1) + " of " + steps.length;
    if (progressFill) progressFill.style.width = ((i + 1) / steps.length) * 100 + "%";
    const first = steps[i].querySelector("input, select, textarea");
    if (first) first.focus({ preventScroll: true });
  }

  function validateStep(i) {
    const bad = [...steps[i].querySelectorAll("input, select, textarea")].filter((el) => !validateField(el));
    if (bad.length) bad[0].focus();
    return !bad.length;
  }

  if (steps.length) {
    nextBtn.addEventListener("click", () => {
      if (validateStep(stepIdx)) showStep(stepIdx + 1);
    });
    backBtn.addEventListener("click", () => showStep(Math.max(0, stepIdx - 1)));

    // One question at a time: answering a dropdown brings up the next question
    steps.forEach((step, i) => {
      const selects = step.querySelectorAll("select");
      const others = step.querySelectorAll("input:not([type='hidden']), textarea");
      if (selects.length === 1 && others.length === 0 && i < steps.length - 1) {
        selects[0].addEventListener("change", () => {
          if (validateStep(i)) setTimeout(() => showStep(i + 1), 200);
        });
      }
    });

    showStep(0);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    const inputs = [...form.querySelectorAll("input, select, textarea")];
    const bad = inputs.filter((i) => !validateField(i));
    if (bad.length) {
      const badStep = steps.indexOf(bad[0].closest(".form-step"));
      if (badStep > -1 && badStep !== stepIdx) showStep(badStep);
      bad[0].focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());

    // No endpoint wired yet → hand off to the visitor's email app (or DMs).
    if (!endpointLive) {
      if (emailLive) {
        const body = [
          "Name: " + data.name,
          "Email: " + data.email,
          "Age: " + (data.age || "-"),
          "Phone: " + (data.phone || "-"),
          "Handle: " + (data.handle || "-"),
          "Goal: " + (data.goal || "-"),
          "Investment: " + (data.investment || "-"),
          "",
          "Why they want to change: " + (data.change || "-"),
          "",
          "Their pitch: " + (data.why || "-")
        ].join("\n");
        location.href = "mailto:" + C.email +
          "?subject=" + encodeURIComponent("Coaching application from " + data.name) +
          "&body=" + encodeURIComponent(body);
        status.textContent = "Opening your email app. Hit send and it's on its way.";
        status.classList.add("is-ok");
      } else {
        status.innerHTML =
          'Applications open shortly. For now, DM me on ' +
          '<a href="' + C.tiktok.url + '" target="_blank" rel="noopener">TikTok</a> or ' +
          '<a href="' + C.instagram.url + '" target="_blank" rel="noopener">Instagram</a>. I answer those myself.';
        status.classList.add("is-ok");
      }
      return;
    }

    // Formspree-style JSON POST
    submitBtn.disabled = true;
    const prevLabel = submitBtn.textContent;
    submitBtn.textContent = "Sending…";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      form.innerHTML =
        '<div class="form-success">' +
        "<h3>Application sent</h3>" +
        "<p>I read these myself. If it looks like a fit, you'll hear from me at <strong>" +
        escapeHtml(data.email) + "</strong>.</p>" +
        "</div>";
      form.scrollIntoView({ block: "center", behavior: "smooth" });
    } catch {
      status.textContent = "That didn't send. Give it another try in a minute.";
      status.classList.add("is-error");
      submitBtn.disabled = false;
      submitBtn.textContent = prevLabel;
    }
  });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
