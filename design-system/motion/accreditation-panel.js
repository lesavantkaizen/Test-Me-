
    (function () {
      var root = document.currentScript && document.currentScript.closest(".ltw-wp-acc");
      if (!root) root = document.querySelector(".ltw-wp-acc");
      if (!root) return;

      var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var reveals = root.querySelectorAll(".ltw-reveal");
      var group = root.querySelector(".ltw-accreditation[data-interactive]");
      var legacyGrid = root.querySelector("#ltwregGrid");
      var panel = root.querySelector(".ltw-accreditation__panel");
      var titleEl = panel && panel.querySelector("[data-ltw-acc-title]");
      var bodyEl = panel && panel.querySelector("[data-ltw-acc-body]");
      var linkEl = panel && panel.querySelector("[data-ltw-acc-link]");
      var linkLabel = linkEl && linkEl.querySelector("span");
      var triggers = root.querySelectorAll("button.ltw-mark");

      root.classList.add("is-ready");

      function show(item) { item.classList.add("is-seen"); }

      if (reduceMotion || !("IntersectionObserver" in window)) {
        reveals.forEach(show);
      } else {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            show(entry.target);
            observer.unobserve(entry.target);
          });
        }, { threshold: 0.12 });
        reveals.forEach(function (item) { observer.observe(item); });
      }

      if (!group || !panel || !titleEl || !bodyEl || !linkEl || !triggers.length) return;

      var current = null;
      group.setAttribute("data-enhanced", "true");
      if (legacyGrid) legacyGrid.setAttribute("data-ltw-init", "1");
      panel.hidden = true;

      function close() {
        for (var i = 0; i < triggers.length; i++) {
          triggers[i].setAttribute("aria-expanded", "false");
        }
        panel.hidden = true;
        panel.classList.remove("is-open");
        current = null;
      }

      function placePanel(btn) {
        if (!legacyGrid) return;
        var buttons = [];
        var children = legacyGrid.children;
        for (var i = 0; i < children.length; i++) {
          if (children[i].classList.contains("ltwreg__btn")) buttons.push(children[i]);
        }
        var index = buttons.indexOf(btn);
        if (index < 0) return;
        var perRow = window.matchMedia("(max-width: 820px)").matches ? 2 : 5;
        var rowEnd = Math.min((Math.floor(index / perRow) + 1) * perRow, buttons.length);
        var reference = buttons[rowEnd] || legacyGrid.querySelector(".ltwreg__fallbacks");
        legacyGrid.insertBefore(panel, reference || null);
      }

      function open(btn) {
        titleEl.textContent = btn.getAttribute("data-title") || "";
        bodyEl.textContent = btn.getAttribute("data-body") || "";
        var label = btn.getAttribute("data-link") || "Learn more";
        if (linkLabel) linkLabel.textContent = label;
        else linkEl.textContent = label;
        linkEl.href = btn.getAttribute("data-href") || "#";
        for (var i = 0; i < triggers.length; i++) {
          triggers[i].setAttribute("aria-expanded", triggers[i] === btn ? "true" : "false");
        }
        placePanel(btn);
        panel.hidden = false;
        panel.classList.add("is-open");
        current = btn;
      }

      for (var t = 0; t < triggers.length; t++) {
        (function (btn) {
          btn.setAttribute("aria-controls", panel.id);
          btn.addEventListener("click", function () {
            if (btn === current) close();
            else open(btn);
          });
          btn.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && current) {
              event.preventDefault();
              close();
              btn.focus();
            }
          });
        })(triggers[t]);
      }
    })();
  