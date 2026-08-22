
  (function () {
    function init() {
      var root = document.getElementById("ltw-home-intro");
      if (!root) return;
      if (root.dataset.ltwHiInit === "1") return;

      root.dataset.ltwHiInit = "1";
      root.dataset.ltwHiEnhanced = "true";

      var revealItems = root.querySelectorAll(".ltw-hi-rv");

      if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries, activeObserver) {
          for (var index = 0; index < entries.length; index += 1) {
            if (entries[index].isIntersecting) {
              entries[index].target.classList.add("is-in");
              activeObserver.unobserve(entries[index].target);
            }
          }
        }, {
          threshold: .14,
          rootMargin: "0px 0px -40px 0px"
        });

        for (var itemIndex = 0; itemIndex < revealItems.length; itemIndex += 1) {
          observer.observe(revealItems[itemIndex]);
        }
      } else {
        for (var fallbackIndex = 0; fallbackIndex < revealItems.length; fallbackIndex += 1) {
          revealItems[fallbackIndex].classList.add("is-in");
        }
      }

      var frame = root.querySelector("[data-ltw-frame]");
      var play = root.querySelector("[data-ltw-play]");

      if (!frame) return;
      if (!play) return;

      play.addEventListener("click", function () {
        if (frame.classList.contains("is-playing")) return;

        var embed = document.createElement("iframe");
        embed.className = "ltw-hi-embed";
        embed.setAttribute(
          "allow",
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        );
        embed.setAttribute("allowfullscreen", "");
        embed.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        embed.setAttribute("title", "A message from the Launch To Wellness team");
        embed.setAttribute("tabindex", "0");
        embed.src = "https://www.youtube-nocookie.com/embed/pHIBaMqHp2A?autoplay=1&rel=0&modestbranding=1&playsinline=1";

        embed.addEventListener("load", function () {
          embed.focus();
        }, { once: true });

        frame.appendChild(embed);
        frame.classList.add("is-playing");
      }, { passive: true });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
      init();
    }

    window.addEventListener("load", init, { once: true });
  }());
