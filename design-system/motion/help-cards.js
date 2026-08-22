
    (() => {
      const script = document.currentScript;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const roots = script && script.closest(".ltw-wp-help")
        ? [script.closest(".ltw-wp-help")]
        : Array.from(document.querySelectorAll(".ltw-wp-help"));

      const wrapIndex = (value, total) => ((value % total) + total) % total;

      roots.forEach((root) => {
        if (root.dataset.ltwHelpInit === "1") return;
        root.dataset.ltwHelpInit = "1";
        root.classList.add("is-ready");

        const reveals = root.querySelectorAll(".ltw-reveal");
        if (!reduceMotion && "IntersectionObserver" in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-seen");
              observer.unobserve(entry.target);
            });
          }, { threshold: 0.15 });
          reveals.forEach((item) => observer.observe(item));
        } else {
          reveals.forEach((item) => item.classList.add("is-seen"));
        }

        const cardsRoot = root.querySelector(".ltw-help__cards");
        const cards = Array.from(root.querySelectorAll(".ltw-help-card"));
        const status = root.querySelector("[data-ltw-help-status]");
        const prev = root.querySelector("[data-ltw-help-prev]");
        const next = root.querySelector("[data-ltw-help-next]");
        const gotos = Array.from(root.querySelectorAll("[data-ltw-help-goto]"));
        if (!cardsRoot || cards.length < 2 || reduceMotion) return;

        let current = 0;
        let offset = 0;
        let drag = null;
        let suppressClick = false;

        const spacing = () => Math.max(148, Math.round(cardsRoot.clientHeight * 0.32));

        const render = () => {
          const space = spacing();
          const position = current + offset;
          const total = cards.length;
          const activeIndex = wrapIndex(Math.round(position), total);

          cards.forEach((card, index) => {
            let delta = index - position;
            while (delta > total / 2) delta -= total;
            while (delta < -total / 2) delta += total;

            const abs = Math.abs(delta);
            const active = abs < 0.5 && activeIndex === index;
            const detail = card.querySelector(".ltw-help-card__detail");
            const link = card.querySelector(".ltw-help-card__link");

            card.style.setProperty("--ltw-y", `${delta * space}px`);
            card.style.setProperty("--ltw-scale", String(Math.max(0.78, 1 - abs * 0.11)));
            card.style.setProperty("--ltw-opacity", String(abs > 1.6 ? 0 : Math.max(0.22, 1 - abs * 0.42)));
            card.style.setProperty("--ltw-z", String(Math.round(20 - abs * 8)));
            card.classList.toggle("is-active", active);
            card.setAttribute("aria-hidden", active ? "false" : "true");
            if (detail) detail.inert = !active;
            if (link) {
              if (active) link.removeAttribute("tabindex");
              else link.setAttribute("tabindex", "-1");
            }
          });

          gotos.forEach((button, index) => {
            if (index === activeIndex) button.setAttribute("aria-current", "true");
            else button.removeAttribute("aria-current");
          });

          const activeCard = cards[activeIndex];
          if (activeCard && activeCard.id) {
            cardsRoot.setAttribute("aria-activedescendant", activeCard.id);
          }
          if (status) status.textContent = `Category ${activeIndex + 1} of ${cards.length}`;
        };

        const goTo = (index) => {
          current = wrapIndex(index, cards.length);
          offset = 0;
          render();
        };

        prev.addEventListener("click", () => goTo(current - 1));
        next.addEventListener("click", () => goTo(current + 1));
        gotos.forEach((button) => {
          button.addEventListener("click", () => goTo(Number(button.dataset.ltwHelpGoto)));
        });

        cards.forEach((card, index) => {
          card.addEventListener("click", (event) => {
            if (suppressClick || card.classList.contains("is-active")) return;
            if (event.target.closest("a, button")) return;
            goTo(index);
          });
        });

        cardsRoot.addEventListener("keydown", (event) => {
          if (event.key === "ArrowDown" || event.key === "PageDown") {
            event.preventDefault();
            goTo(current + 1);
          } else if (event.key === "ArrowUp" || event.key === "PageUp") {
            event.preventDefault();
            goTo(current - 1);
          } else if (event.key === "Home") {
            event.preventDefault();
            goTo(0);
          } else if (event.key === "End") {
            event.preventDefault();
            goTo(cards.length - 1);
          }
        });

        cardsRoot.addEventListener("pointerdown", (event) => {
          if (event.button && event.button !== 0) return;
          if (event.target.closest("a, button")) return;
          drag = {
            id: event.pointerId,
            startY: event.clientY,
            lastY: event.clientY,
            lastT: performance.now(),
            origin: current + offset,
            velocity: 0,
            moved: false
          };
          cardsRoot.classList.add("is-dragging");
          cardsRoot.setPointerCapture(event.pointerId);
        });

        cardsRoot.addEventListener("pointermove", (event) => {
          if (!drag || event.pointerId !== drag.id) return;
          const now = performance.now();
          const deltaY = event.clientY - drag.startY;
          const frameDt = now - drag.lastT;
          if (frameDt > 0) drag.velocity = (event.clientY - drag.lastY) / frameDt;
          drag.lastY = event.clientY;
          drag.lastT = now;
          if (Math.abs(deltaY) > 6) drag.moved = true;
          offset = drag.origin + (-deltaY / spacing()) - current;
          render();
        });

        const endDrag = (event) => {
          if (!drag || event.pointerId !== drag.id) return;
          let nextIndex = Math.round(current + offset);
          if (Math.abs(drag.velocity) > 0.45) {
            nextIndex += drag.velocity < 0 ? 1 : -1;
          }
          suppressClick = drag.moved;
          drag = null;
          cardsRoot.classList.remove("is-dragging");
          goTo(nextIndex);
        };

        cardsRoot.addEventListener("pointerup", endDrag);
        cardsRoot.addEventListener("pointercancel", endDrag);
        cardsRoot.addEventListener("click", (event) => {
          if (!suppressClick) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClick = false;
        }, true);

        window.addEventListener("resize", render);
        goTo(0);
      });
    })();
  