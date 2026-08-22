
    (() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const roots = document.querySelectorAll(".ltw-wp-spine");

      roots.forEach((root) => {
        if (root.dataset.ltwSpineInit === "1") return;
        root.dataset.ltwSpineInit = "1";

        const intro = root.querySelector(".ltw-audience-spine__intro");
        const list = root.querySelector(".ltw-audience-spine__list");
        const items = [...root.querySelectorAll(".ltw-audience-spine__item")];
        const footer = root.querySelector(".ltw-section__footer");
        const total = items.length;
        const crossed = (node) => node.getBoundingClientRect().top < window.innerHeight * 0.88;

        const setProgress = (count) => {
          if (!list) return;
          const progress = total > 1 ? Math.max(0, (count - 1) / (total - 1)) : count ? 1 : 0;
          list.style.setProperty("--ltw-spine-progress", String(progress));
        };

        const showAll = () => {
          if (intro) intro.classList.add("is-seen");
          items.forEach((item) => item.classList.add("is-seen"));
          if (footer) footer.classList.add("is-seen");
          setProgress(total);
        };

        root.classList.add("is-ready");

        if (reduceMotion || !("IntersectionObserver" in window)) {
          showAll();
          return;
        }

        let nextIndex = 0;
        const pending = new Set();
        let queued = false;

        const finish = () => {
          if (footer) footer.classList.add("is-seen");
        };

        const revealNext = () => {
          queued = false;
          if (nextIndex >= items.length) {
            finish();
            return;
          }
          if (!pending.has(nextIndex)) return;
          items[nextIndex].classList.add("is-seen");
          pending.delete(nextIndex);
          nextIndex += 1;
          setProgress(nextIndex);
          if (pending.has(nextIndex)) {
            queued = true;
            window.setTimeout(revealNext, 180);
            return;
          }
          if (nextIndex >= items.length) finish();
        };

        if (intro && crossed(intro)) intro.classList.add("is-seen");
        items.forEach((item, index) => {
          if (crossed(item)) pending.add(index);
        });
        revealNext();

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            if (entry.target === intro) {
              entry.target.classList.add("is-seen");
              return;
            }
            const index = items.indexOf(entry.target);
            if (index < 0 || pending.has(index) || index < nextIndex) return;
            pending.add(index);
            if (!queued) revealNext();
          });
        }, { threshold: 0.28, rootMargin: "0px 0px -12% 0px" });

        if (intro && !intro.classList.contains("is-seen")) observer.observe(intro);
        items.forEach((item, index) => {
          if (index >= nextIndex) observer.observe(item);
        });
      });
    })();
  