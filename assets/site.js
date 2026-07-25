(function () {
  document.documentElement.classList.add("has-js");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

    if (toggle && nav) {
    const setNavState = function (isOpen) {
      nav.dataset.open = String(isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      toggle.textContent = isOpen ? "×" : "☰";
    };

    toggle.addEventListener("click", function () {
      const isOpen = nav.dataset.open === "true";
      setNavState(!isOpen);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setNavState(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.dataset.open === "true") {
        setNavState(false);
        toggle.focus();
      }
      });
    }

      const requestedHero = new URLSearchParams(window.location.search).get("hero");
      const clinicianHero = requestedHero === "clinician";
      if (clinicianHero) document.body.classList.add("hero-variant-clinician");

      const heroVideo = document.querySelector("[data-hero-video]");
      const heroVideoToggle = document.querySelector("[data-hero-video-toggle]");
      if (heroVideo && heroVideoToggle) {
        heroVideo.controls = false;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const syncVideoControl = function () {
        heroVideoToggle.textContent = heroVideo.paused ? "Play motion" : "Pause motion";
        heroVideoToggle.setAttribute("aria-label", heroVideo.paused ? "Play lake motion" : "Pause lake motion");
      };
        const applyMotionPreference = function () {
          if (clinicianHero || reducedMotion.matches) {
            heroVideo.pause();
            heroVideoToggle.hidden = true;
          } else {
          heroVideoToggle.hidden = false;
          heroVideo.play().catch(syncVideoControl);
        }
        syncVideoControl();
      };

      heroVideo.addEventListener("play", syncVideoControl);
      heroVideo.addEventListener("pause", syncVideoControl);
      heroVideoToggle.addEventListener("click", function () {
        if (heroVideo.paused) heroVideo.play().catch(syncVideoControl);
        else heroVideo.pause();
      });
        reducedMotion.addEventListener("change", applyMotionPreference);
        applyMotionPreference();
      }

    document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  const ownerContent = window.NABIA_OWNER_CONTENT || { previewMode: false, fields: {} };
  const ownerFields = ownerContent.fields || {};

  function ownerFieldValue(key) {
    const field = ownerFields[key];
    if (!field) return "Contact the practice to confirm this information.";
    return field.verified && field.value.trim() ? field.value.trim() : field.fallback;
  }

  function ownerFieldReviewValue(field) {
    if (field.verified && field.value.trim()) return field.value.trim();
    if (field.draftValue && field.draftValue.trim()) return field.draftValue.trim();
    return field.fallback;
  }

  function phoneHref(phone) {
    const digits = phone.replace(/\D/g, "");
    return "tel:+" + (digits.length === 10 ? "1" + digits : digits);
  }

  const publicPhone = ownerFieldValue("publicPhone");
  const publicEmail = ownerFieldValue("publicEmail");

  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.href = phoneHref(publicPhone);
    link.textContent = link.textContent.replace(/202-810-4598/g, publicPhone);
  });

    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
      const original = link.getAttribute("href") || "";
      const query = original.includes("?") ? original.slice(original.indexOf("?")) : "";
      link.href = "mailto:" + publicEmail + query;
      if (link.textContent.includes("@")) link.textContent = publicEmail;
    });

  function buildOwnerField(key, headingLevel) {
    const field = ownerFields[key];
    if (!field) return null;

    const item = document.createElement("article");
    item.className = "owner-field" + (field.verified ? " owner-field-verified" : " owner-field-pending");
    item.dataset.ownerKey = key;

    const heading = document.createElement(headingLevel || "h3");
    heading.textContent = field.label;
    item.appendChild(heading);

    const value = document.createElement("p");
    value.className = "owner-field-value";
    value.textContent = ownerFieldReviewValue(field);
    item.appendChild(value);

    if (ownerContent.previewMode) {
      const status = document.createElement("span");
      status.className = "owner-field-status";
      status.textContent = field.verified
        ? "Owner verified"
        : field.draftValue && field.draftValue.trim()
          ? "Owner supplied — verification needed"
          : "Owner answer needed";
      item.appendChild(status);
    }

    return item;
  }

  document.querySelectorAll("[data-owner-field]").forEach(function (node) {
    const key = node.dataset.ownerField;
    const field = ownerFields[key];
    if (!field) return;
    node.textContent = ownerFieldValue(key);
    node.classList.toggle("owner-copy-pending", ownerContent.previewMode && !field.verified);
  });

  if (ownerContent.previewMode) {
    document.documentElement.classList.add("owner-preview-mode");
    const previewBar = document.createElement("aside");
    previewBar.className = "owner-preview-bar";
    previewBar.setAttribute("aria-label", "Website preview status");
      previewBar.innerHTML = "<strong>Working preview</strong><span>Owner-verified facts are mixed with amber operational questions. Production publication is still gated.</span>" +
      '<a href="owner-preview.html">Review owner fields</a>';
    const header = document.querySelector(".site-header");
    if (header) header.before(previewBar);
  }

  const pageName = window.location.pathname.split("/").pop() || "index.html";
  const pageOwnerFields = {
    "index.html": ["acceptingPatients", "serviceArea", "paymentModel", "firstAppointment", "leadClinicianCredentials", "securePatientRoute"],
    "services.html": ["primaryService", "careModel", "paymentModel", "privatePay"],
    "who-we-serve.html": ["fitCriteria", "exclusions", "replacesPcp", "serviceArea"],
    "about.html": ["leadClinicianBio", "languages", "affiliations", "testimonials", "outcomes"],
      "our-team.html": ["leadClinicianName", "leadClinicianCredentials", "leadClinicianBio", "additionalClinicians", "clinicianPhotography"],
      "referrals.html": ["serviceArea", "secureReferralRoute", "referralContact", "responseTime"],
      "careers.html": ["careerHiringStatus", "careerRoles", "careerApplicationRoute", "administrativeSupport"],
      "contact.html": ["publicPhone", "publicEmail", "officeHours", "acceptingPatients", "responseTime", "locations", "paymentModel", "securePatientRoute", "afterHours"],
    "privacy.html": ["legalReview", "productionPlatform", "afterHours"]
  };

  const currentPageFields = pageOwnerFields[pageName];
  const main = document.querySelector("main");
  if (main && currentPageFields) {
    const section = document.createElement("section");
    section.className = "section owner-details-section";
    section.setAttribute("aria-labelledby", "owner-details-title");

    const container = document.createElement("div");
    container.className = "container";
    container.innerHTML = '<div class="section-heading"><div><p class="eyebrow">' +
      (ownerContent.previewMode ? "Working owner fields" : "Before care begins") +
      '</p><h2 id="owner-details-title">What the practice will confirm.</h2>' +
      '<p>These details protect patients from making decisions based on assumptions.</p></div></div>';

    const grid = document.createElement("div");
    grid.className = "owner-field-grid";
    currentPageFields.forEach(function (key) {
      const field = buildOwnerField(key, "h3");
      if (field) grid.appendChild(field);
    });
    container.appendChild(grid);

    if (ownerContent.previewMode) {
      section.classList.add("owner-details-collapsible");
      section.removeAttribute("aria-labelledby");
      section.setAttribute("aria-label", "Owner confirmation details");
      const disclosure = document.createElement("details");
      disclosure.className = "owner-details-disclosure";
      const summary = document.createElement("summary");
      summary.className = "owner-details-summary";
      const summaryCopy = document.createElement("span");
      const summaryTitle = document.createElement("strong");
      const suppliedCount = currentPageFields.filter(function (key) {
        const field = ownerFields[key];
        return field && !field.verified && field.draftValue && field.draftValue.trim();
      }).length;
      const unansweredCount = currentPageFields.filter(function (key) {
        const field = ownerFields[key];
        return field && !field.verified && !(field.draftValue && field.draftValue.trim());
      }).length;
      summaryTitle.textContent = unansweredCount + " owner answers remain · " + suppliedCount + " supplied for verification";
      const summaryNote = document.createElement("small");
      summaryNote.textContent = "Open the working layer without interrupting the public-page preview.";
      summaryCopy.append(summaryTitle, summaryNote);
      const summaryAction = document.createElement("span");
      summaryAction.className = "owner-details-summary-action";
      summaryAction.textContent = "Review fields";
      summary.append(summaryCopy, summaryAction);
      disclosure.append(summary, container);
      section.appendChild(disclosure);
    } else {
      section.appendChild(container);
    }

    const bands = main.querySelectorAll(".band");
    const finalBand = bands.length ? bands[bands.length - 1] : null;
    if (finalBand) finalBand.before(section);
    else main.appendChild(section);
  }

    const ownerDashboard = document.querySelector("[data-owner-dashboard]");
    if (ownerDashboard) {
    const fields = Object.entries(ownerFields);
    const verifiedCount = fields.filter(function (entry) { return entry[1].verified; }).length;
    const suppliedCount = fields.filter(function (entry) {
      const field = entry[1];
      return !field.verified && field.draftValue && field.draftValue.trim();
    }).length;
    const unansweredCount = fields.length - verifiedCount - suppliedCount;
    const summary = document.querySelector("[data-owner-summary]");
    if (summary) {
      summary.textContent = unansweredCount + " owner answers needed · " + suppliedCount + " supplied for verification · " + verifiedCount + " verified · " + fields.length + " total fields";
    }

    const categories = new Map();
    fields.forEach(function (entry) {
      const key = entry[0];
      const field = entry[1];
      if (!categories.has(field.category)) categories.set(field.category, []);
      categories.get(field.category).push([key, field]);
    });

    categories.forEach(function (entries, category) {
      const section = document.createElement("section");
      section.className = "owner-dashboard-group";
      const heading = document.createElement("h2");
      heading.textContent = category;
      section.appendChild(heading);

      const list = document.createElement("div");
      list.className = "owner-dashboard-list";
      entries.forEach(function (entry) {
        const key = entry[0];
        const field = entry[1];
        const item = buildOwnerField(key, "h3");
        const question = document.createElement("p");
        question.className = "owner-field-question";
        question.textContent = field.question;
        item.insertBefore(question, item.querySelector(".owner-field-value"));
        const code = document.createElement("code");
        code.textContent = key;
        item.appendChild(code);
        list.appendChild(item);
      });
      section.appendChild(list);
      ownerDashboard.appendChild(section);
    });
  }

  if (!ownerDashboard) {
      const mobileActions = document.createElement("nav");
      mobileActions.className = "mobile-action-dock";
      mobileActions.setAttribute("aria-label", "Contact options");
      mobileActions.setAttribute("aria-hidden", "true");
      mobileActions.inert = true;
      mobileActions.dataset.visible = "false";
      mobileActions.innerHTML = '<a class="button button-secondary" href="' + phoneHref(publicPhone) + '">Call</a>' +
        '<a class="button" href="contact.html#consultation">Request care</a>';
      document.body.appendChild(mobileActions);

      let dockFrame = 0;
      function updateMobileDock() {
        const isMobile = window.matchMedia("(max-width: 620px)").matches;
        const footer = document.querySelector(".site-footer");
        const pastHeaderActions = window.scrollY > Math.min(320, window.innerHeight * 0.4);
        const beforeFooter = !footer || footer.getBoundingClientRect().top > window.innerHeight - 24;
        const shouldShow = isMobile && pastHeaderActions && beforeFooter;
        mobileActions.dataset.visible = String(shouldShow);
        mobileActions.setAttribute("aria-hidden", String(!shouldShow));
        mobileActions.inert = !shouldShow;
      }

      function scheduleMobileDockUpdate() {
        if (dockFrame) return;
        dockFrame = window.requestAnimationFrame(function () {
          dockFrame = 0;
          updateMobileDock();
        });
      }

      window.addEventListener("scroll", scheduleMobileDockUpdate, { passive: true });
      window.addEventListener("resize", scheduleMobileDockUpdate);
      updateMobileDock();
    }

  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const subject = "Website consultation request from " + (data.get("name") || "visitor");
      const lines = [
        "Name: " + (data.get("name") || ""),
        "Phone: " + (data.get("phone") || ""),
        "Email: " + (data.get("email") || ""),
        "Preferred contact: " + (data.get("contact_method") || ""),
        "Service interest: " + (data.get("service") || ""),
        "Best time: " + (data.get("best_time") || "")
      ];
        window.location.href = "mailto:" + publicEmail + "?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
    });
  }
})();
