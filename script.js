(function () {
  "use strict";

  var page = document.body.getAttribute("data-page") || "home";
  var pageLinks = [
    ["problem", "Problem", "problem/"],
    ["platform", "Platform", "platform/"],
    ["experiences", "Experiences", "experiences/"],
    ["modules", "Modules", "modules/"],
    ["roadmap", "Roadmap", "roadmap/"],
    ["impact", "Impact", "impact/"],
    ["business", "Business Model", "business/"],
    ["growth", "Growth", "growth/"],
    ["investment", "Investment", "investment/"],
    ["contact", "Contact", "contact/"]
  ];

  function renderSharedChrome() {
    var headerSlot = document.getElementById("siteHeaderSlot");
    var footerSlot = document.getElementById("siteFooterSlot");
    var base = page === "home" ? "" : "../";
    if (headerSlot) {
      headerSlot.outerHTML = '<header class="site-header" id="siteHeader"><nav class="nav" aria-label="Primary"><a href="' + base + '" class="nav__brand"><img class="brand-mark" src="' + base + 'assets/dairyfed.jpeg" alt="" width="34" height="34">DairyFed</a><button class="nav__toggle" id="navToggle" aria-expanded="false" aria-controls="navMenu" aria-label="Toggle navigation menu"><span></span><span></span><span></span></button><ul class="nav__menu" id="navMenu">' + pageLinks.map(function (link) { return '<li><a href="' + base + link[2] + '" data-page-link="' + link[0] + '">' + link[1] + '</a></li>'; }).join("") + '</ul><a href="' + base + 'contact/" class="btn btn--primary nav__cta">Partner With Us</a></nav></header>';
    }
    if (footerSlot) {
      footerSlot.outerHTML = '<footer class="footer"><div class="container footer__grid"><div class="footer__brand"><a href="' + base + '" class="nav__brand"><img class="brand-mark" src="' + base + 'assets/dairyfed.jpeg" alt="" width="30" height="30">DairyFed</a><p>The Digital Infrastructure for India\'s Cooperative Dairy Ecosystem</p></div><nav class="footer__links" aria-label="Footer">' + pageLinks.map(function (link) { return '<a href="' + base + link[2] + '">' + link[1] + '</a>'; }).join("") + '</nav><div class="footer__contact"><p>13, Institutional Area, Lodhi Road,<br>New Delhi 110003</p><p><a href="mailto:globalexpressgroup@gmail.com">globalexpressgroup@gmail.com</a></p><p>96505 60277 / 99101 96123</p></div></div><div class="container footer__bottom"><p>&copy; 2026 DairyFed. All rights reserved.</p></div></footer>';
    }
    document.querySelectorAll('[data-page-link="' + page + '"]').forEach(function (link) { link.classList.add("is-current"); });
  }

  renderSharedChrome();

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     Mobile navigation
     ============================================================ */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ============================================================
     Generic tab groups: [data-tabs] containing .tabs__btn / .tabs__panel
     ============================================================ */
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var btns = group.querySelectorAll(".tabs__btn");
    var panels = group.querySelectorAll(".tabs__panel");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-tab");
        btns.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });
        panels.forEach(function (p) {
          var match = p.getAttribute("data-panel") === target;
          p.classList.toggle("is-active", match);
          if (match) { p.removeAttribute("hidden"); } else { p.setAttribute("hidden", ""); }
        });
      });
    });
  });

  /* ============================================================
     Roadmap phase tabs
     ============================================================ */
  var roadmapBtns = document.querySelectorAll(".roadmap__btn");
  var roadmapPanels = document.querySelectorAll(".roadmap__panel");
  roadmapBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var phase = btn.getAttribute("data-phase");
      roadmapBtns.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      roadmapPanels.forEach(function (p) {
        var match = p.getAttribute("data-phase-panel") === phase;
        p.classList.toggle("is-active", match);
        if (match) { p.removeAttribute("hidden"); } else { p.setAttribute("hidden", ""); }
      });
    });
  });

  /* ============================================================
     Before / After toggle
     ============================================================ */
  var baBtns = document.querySelectorAll(".ba-btn");
  var baPanels = document.querySelectorAll(".ba-panel");
  baBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-ba");
      baBtns.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      baPanels.forEach(function (p) {
        var match = p.getAttribute("data-ba-panel") === target;
        p.classList.toggle("is-active", match);
        if (match) { p.removeAttribute("hidden"); } else { p.setAttribute("hidden", ""); }
      });
    });
  });

  /* ============================================================
     Ecosystem diagram: position nodes radially + draw connector lines
     ============================================================ */
  function layoutEcosystem() {
    var wrap = document.getElementById("ecosystem");
    if (!wrap) return;
    var nodes = wrap.querySelectorAll(".ecosystem__node");
    var svg = wrap.querySelector(".ecosystem__lines");
    var size = wrap.clientWidth;
    if (!size) return;
    var radius = size * 0.37;
    var center = size / 2;
    svg.setAttribute("viewBox", "0 0 " + size + " " + size);
    svg.innerHTML = "";

    nodes.forEach(function (node) {
      var angle = parseFloat(node.getAttribute("data-angle")) - 90;
      var rad = (angle * Math.PI) / 180;
      node.style.setProperty("--rot", angle + "deg");
      node.style.setProperty("--rad", radius + "px");

      var x = center + radius * Math.cos(rad);
      var y = center + radius * Math.sin(rad);
      var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", center);
      line.setAttribute("y1", center);
      line.setAttribute("x2", x);
      line.setAttribute("y2", y);
      svg.appendChild(line);
    });
  }
  layoutEcosystem();
  window.addEventListener("resize", debounce(layoutEcosystem, 150));

  /* ============================================================
     Scroll reveal (journey steps + generic .reveal elements)
     ============================================================ */
  var revealTargets = document.querySelectorAll(".journey__step");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.25 }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ============================================================
     Journey progress bar (desktop track, tied to scroll within section)
     ============================================================ */
  var journey = document.getElementById("journey");
  var journeyProgress = document.getElementById("journeyProgress");
  if (journey && journeyProgress) {
    window.addEventListener("scroll", debounce(function () {
      var rect = journey.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = rect.height - vh * 0.5;
      var traveled = vh * 0.8 - rect.top;
      var pct = total > 0 ? Math.min(100, Math.max(0, (traveled / total) * 100)) : 0;
      journeyProgress.style.width = pct + "%";
    }, 10), { passive: true });
  }

  /* ============================================================
     Number counters (growth stats)
     ============================================================ */
  var counters = document.querySelectorAll(".counter");
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-target"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var duration = reduceMotion ? 0 : 1400;
    var start = null;

    if (duration === 0) {
      el.textContent = target.toFixed(decimals);
      return;
    }
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = value.toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var counterIo = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { counterIo.observe(c); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ============================================================
     Growth bar charts
     ============================================================ */
  var bars = document.querySelectorAll(".growth-chart .bar");
  function fillBar(bar) {
    var value = parseFloat(bar.getAttribute("data-value"));
    var max = parseFloat(bar.getAttribute("data-max"));
    var pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    var fill = bar.querySelector(".bar__fill");
    if (fill) fill.style.height = Math.max(pct, 3) + "%";
  }
  if ("IntersectionObserver" in window) {
    var barIo = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          fillBar(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { barIo.observe(b); });
  } else {
    bars.forEach(fillBar);
  }

  /* ============================================================
     Revenue projection chart (built from the table, so figures stay in sync)
     ============================================================ */
  (function buildRevChart() {
    var chartEl = document.getElementById("revChart");
    var table = document.getElementById("revTable");
    if (!chartEl || !table) return;
    var footRow = table.querySelector("tfoot tr");
    if (!footRow) return;
    var cells = footRow.querySelectorAll("td");
    var raw = ["2.23", "7.3", "22.9", "58", "140"]; // $M totals, mirrors table
    var max = 140;
    raw.forEach(function (val, i) {
      var bar = document.createElement("div");
      bar.className = "rc-bar";
      bar.setAttribute("data-value", val);
      var span = document.createElement("span");
      span.textContent = "Y" + (i + 1) + " · $" + val + "M";
      bar.appendChild(span);
      chartEl.appendChild(bar);
    });
    var rcBars = chartEl.querySelectorAll(".rc-bar");
    function fillRc(bar) {
      var v = parseFloat(bar.getAttribute("data-value"));
      bar.style.height = Math.min(100, (v / max) * 100) + "%";
    }
    if ("IntersectionObserver" in window) {
      var rcIo = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { fillRc(entry.target); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.4 });
      rcBars.forEach(function (b) { rcIo.observe(b); });
    } else {
      rcBars.forEach(fillRc);
    }
  })();

  /* ============================================================
     Modal
     ============================================================ */
  var modal = document.getElementById("formModal");
  function openModal(message) {
    if (!modal) return;
    var body = document.getElementById("modalBody");
    if (message && body) body.textContent = message;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var closeBtn = modal.querySelector(".modal__close");
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }
  document.querySelectorAll("[data-close-modal]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
  });

  /* ============================================================
     Form validation (lead capture — no auto submission)
     Architecture: validate -> (would open) pre-filled Google Form -> user submits manually
     ============================================================ */
  function validateForm(form) {
    var valid = true;
    form.querySelectorAll("[required]").forEach(function (input) {
      var field = input.closest(".field");
      var errorEl = field ? field.querySelector(".field__error") : null;
      var value = input.value.trim();
      var normalizedValue = input.type === "tel" ? value.replace(/\s+/g, "") : value;
      var isPhoneField = form.id === "contactForm" && input.id === "c_phone";
      var fieldValid = value.length > 0;

      if (fieldValid && input.type === "email") {
        fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }
      if (fieldValid && isPhoneField) {
        fieldValid = /^[6-9]\d{9}$/.test(normalizedValue);
      }

      if (field) field.classList.toggle("has-error", !fieldValid);
      if (errorEl) {
        errorEl.textContent = fieldValid
          ? ""
          : isPhoneField
            ? "Enter a valid 10-digit Indian mobile number."
            : "Please complete this field.";
      }
      if (!fieldValid) valid = false;
    });
    return valid;
  }

  ["partnerForm", "contactForm"].forEach(function (id) {
    var form = document.getElementById(id);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (validateForm(form)) {
        if (form.id === "contactForm") {
          var googleFormBaseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdog0ipHcYW4woJ4xJ1-PjVcVRZmFDRUfa7-atEvXQxX60R5Q/viewform?usp=pp_url";
          var googleFormUrl = googleFormBaseUrl
            + "&entry.2005620554=" + encodeURIComponent(document.getElementById("c_name").value.trim())
            + "&entry.1045781291=" + encodeURIComponent(document.getElementById("c_email").value.trim())
            + "&entry.1065046570=" + encodeURIComponent(document.getElementById("c_phone").value.trim().replace(/\s+/g, ""))
            + "&entry.1166974658=" + encodeURIComponent(document.getElementById("c_role").value.trim())
            + "&entry.839337160=" + encodeURIComponent(document.getElementById("c_msg").value.trim());
          window.open(googleFormUrl, "_blank");
          openModal("Your information has been prepared. Please review and submit the Google Form in the new tab.");
          form.reset();
        } else {
          openModal();
          form.reset();
        }
      }
    });
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field) field.classList.remove("has-error");
      });
    });
  });

  /* ============================================================
     Sticky header shadow on scroll (subtle)
     ============================================================ */
  var header = document.getElementById("siteHeader");
  if (header) {
    window.addEventListener("scroll", debounce(function () {
      header.style.boxShadow = window.scrollY > 8 ? "0 4px 20px rgba(0,0,0,0.2)" : "none";
    }, 20), { passive: true });
  }

  /* ============================================================
     Utility: debounce
     ============================================================ */
  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }
})();
