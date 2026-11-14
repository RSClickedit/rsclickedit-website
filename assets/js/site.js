/* RS Clicked It — site behavior. No libraries; works without JS for reading. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Header shadow once the page scrolls ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Dialog helpers (menu, film player, lightbox) ---------- */
  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
  }
  function closeDialog(dialog) {
    if (dialog && dialog.open) dialog.close();
  }
  document.querySelectorAll("dialog").forEach(function (dialog) {
    dialog.addEventListener("close", function () {
      document.documentElement.style.overflow = "";
      dialog.querySelectorAll("video").forEach(function (v) { v.pause(); });
    });
    // Click on the backdrop closes the dialog
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog && !dialog.classList.contains("menu-panel")) closeDialog(dialog);
    });
    dialog.querySelectorAll("[data-dialog-close]").forEach(function (btn) {
      btn.addEventListener("click", function () { closeDialog(dialog); });
    });
  });
  document.querySelectorAll("[data-dialog-open]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var dialog = document.getElementById(trigger.getAttribute("data-dialog-open"));
      openDialog(dialog);
      var video = dialog && dialog.querySelector("video");
      if (video) video.play().catch(function () {});
    });
  });

  /* Mobile menu: links close the panel so in-page anchors scroll normally */
  var menu = document.getElementById("menu-panel");
  if (menu) {
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { closeDialog(menu); });
    });
  }

  /* ---------- Video: one plays at a time ---------- */
  document.addEventListener("play", function (event) {
    var playing = event.target;
    if (!(playing instanceof HTMLVideoElement) || playing.muted) return;
    document.querySelectorAll("video").forEach(function (v) {
      if (v !== playing && !v.muted) v.pause();
    });
  }, true);

  /* ---------- YouTube films: load the player only when someone presses play ---------- */
  document.addEventListener("click", function (event) {
    var link = event.target.closest("[data-yt]");
    if (!link) return;
    event.preventDefault();
    var frame = document.createElement("iframe");
    frame.className = "yt-frame";
    frame.src = "https://www.youtube-nocookie.com/embed/" + link.getAttribute("data-yt") + "?autoplay=1&rel=0";
    frame.title = link.getAttribute("data-title") || "Film";
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    document.querySelectorAll("video").forEach(function (v) { if (!v.muted) v.pause(); });
    link.replaceWith(frame);
    frame.focus();
  });

  /* ---------- Hero reel: silent loop only when motion is welcome ---------- */
  var reel = document.querySelector(".reel-video");
  if (reel) {
    var startReel = function () {
      if (reduceMotion.matches) { reel.pause(); return; }
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !reduceMotion.matches) reel.play().catch(function () {});
            else reel.pause();
          });
        }, { threshold: 0.2 }).observe(reel);
      } else {
        reel.play().catch(function () {});
      }
    };
    startReel();
    reduceMotion.addEventListener("change", function () {
      if (reduceMotion.matches) reel.pause(); else reel.play().catch(function () {});
    });
  }

  /* ---------- Portfolio filters ---------- */
  var filterGroup = document.querySelector("[data-filters]");
  if (filterGroup) {
    var items = document.querySelectorAll("[data-cat]");
    var status = document.getElementById("filter-status");
    filterGroup.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-filter]");
      if (!btn) return;
      var value = btn.getAttribute("data-filter");
      filterGroup.querySelectorAll("[data-filter]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      var shown = 0;
      items.forEach(function (item) {
        var match = value === "all" || item.getAttribute("data-cat") === value;
        item.hidden = !match;
        if (match) shown += 1;
      });
      // Hide a whole section (and its heading) when none of its photos match
      document.querySelectorAll("[data-group]").forEach(function (group) {
        group.hidden = !group.querySelector("[data-cat]:not([hidden])");
      });
      if (status) status.textContent = "Showing " + shown + " photographs";
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector(".lightbox-figure img");
    var lbCaption = lightbox.querySelector(".lightbox-caption");
    var lbCount = lightbox.querySelector(".lightbox-count");
    var set = [];
    var index = 0;

    var visibleTiles = function () {
      return Array.prototype.filter.call(document.querySelectorAll("[data-full]"), function (tile) {
        return !tile.closest("[hidden]");
      });
    };
    var show = function (i) {
      index = (i + set.length) % set.length;
      var tile = set[index];
      var thumb = tile.querySelector("img");
      lbImg.src = tile.getAttribute("data-full");
      lbImg.alt = thumb ? thumb.alt : "";
      lbCaption.textContent = tile.getAttribute("data-caption") || "";
      lbCount.textContent = (index + 1) + " of " + set.length;
    };

    document.addEventListener("click", function (event) {
      var tile = event.target.closest("[data-full]");
      if (!tile) return;
      set = visibleTiles();
      show(set.indexOf(tile));
      openDialog(lightbox);
    });
    lightbox.querySelectorAll("[data-lightbox-prev]").forEach(function (b) {
      b.addEventListener("click", function () { show(index - 1); });
    });
    lightbox.querySelectorAll("[data-lightbox-next]").forEach(function (b) {
      b.addEventListener("click", function () { show(index + 1); });
    });
    lightbox.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") { event.preventDefault(); show(index - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); show(index + 1); }
    });
  }

  /* ---------- Inquiry form ---------- */
  var form = document.getElementById("inquiry-form");
  if (form) {
    var summary = form.querySelector(".form-summary");
    var formStatus = form.querySelector(".form-status");
    var submit = form.querySelector('button[type="submit"]');
    var contactEmail = form.getAttribute("data-contact-email");

    var rules = {
      name: function (v) { return v ? "" : "Enter your name."; },
      email: function (v) {
        if (!v) return "Enter your email address.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter an email address like name@example.com.";
      },
      service: function (v) { return v ? "" : "Choose the service you need."; },
      message: function (v) { return v ? "" : "Tell us a little about your project."; }
    };

    var setError = function (field, message) {
      var error = document.getElementById(field.id + "-error");
      field.setAttribute("aria-invalid", message ? "true" : "false");
      if (error) error.textContent = message;
    };
    var check = function (field) {
      var rule = rules[field.name];
      if (!rule) return "";
      var message = rule(field.value.trim());
      setError(field, message);
      return message;
    };

    // Validate when a person leaves a field, and re-check while they fix an error
    form.addEventListener("focusout", function (event) {
      if (rules[event.target.name] && event.target.value.trim()) check(event.target);
    });
    form.addEventListener("input", function (event) {
      if (event.target.getAttribute("aria-invalid") === "true") check(event.target);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      formStatus.textContent = "";
      var problems = [];
      Object.keys(rules).forEach(function (name) {
        var field = form.elements[name];
        var message = check(field);
        if (message) problems.push({ id: field.id, message: message });
      });

      if (problems.length) {
        summary.innerHTML = "<p>Fix " + (problems.length === 1 ? "this field" : "these " + problems.length + " fields") +
          " to send your inquiry:</p><ul>" + problems.map(function (p) {
            return '<li><a href="#' + p.id + '">' + p.message + "</a></li>";
          }).join("") + "</ul>";
        summary.hidden = false;
        summary.focus();
        return;
      }
      summary.hidden = true;

      var endpoint = form.getAttribute("action") || "";
      if (endpoint.indexOf("YOUR_FORM_ID") !== -1) {
        formStatus.textContent = "This form isn't connected yet. Email " + contactEmail + " and we'll reply there.";
        return;
      }

      submit.disabled = true;
      submit.textContent = "Sending…";
      fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (response) {
          if (!response.ok) throw new Error("Request failed");
          form.reset();
          formStatus.textContent = "Inquiry sent. We'll reply within 1 business day.";
        })
        .catch(function () {
          formStatus.textContent = "Your inquiry didn't send. Check your connection and try again, or email " + contactEmail + ".";
        })
        .finally(function () {
          submit.disabled = false;
          submit.textContent = "Send inquiry";
        });
    });

    // Arriving from the For Schools page (index.html?quote=...#contact) pre-fills the form
    var requested = new URLSearchParams(window.location.search).get("quote");
    if (requested) {
      form.elements.service.value = "School package";
      if (!form.elements.message.value.trim()) {
        form.elements.message.value = requested === "School"
          ? "I'm reaching out about a project for our school."
          : "I'm interested in the " + requested + " package.";
      }
    }

    // "Request a quote" on an event kit pre-fills the service and names the kit
    document.querySelectorAll("[data-quote]").forEach(function (link) {
      link.addEventListener("click", function () {
        var service = form.elements.service;
        service.value = "Event branding kit";
        setError(service, "");
        var message = form.elements.message;
        if (!message.value.trim()) message.value = "I'm interested in the " + link.getAttribute("data-quote") + ".";
        // After the jump to #contact, put the cursor in the first field
        setTimeout(function () { form.elements.name.focus({ preventScroll: true }); }, 0);
      });
    });

    summary.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (!link) return;
      event.preventDefault();
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (target) target.focus();
    });
  }
})();
