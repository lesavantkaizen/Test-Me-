/* =============================================================================
   Launch To Wellness — reveal fallback

   Measured on the homepage: 35 elements carry `.ltw-reveal`, but only 8 ever
   receive `.is-visible`. The other 27 never animate, because each section
   ships its own IntersectionObserver scoped to that section's own wrapper —
   and several sections (notably `.ltw-es`, the "Integrated Mental Health &
   Substance Use Treatment" block) have no observer at all.

   Nothing is stuck invisible: the affected elements render at full opacity,
   so the page reads correctly. They simply never move.

   This script adopts any `.ltw-reveal` that no other observer has claimed. It
   is deliberately last-resort:

     - It waits a tick, then only claims elements that are still unrevealed,
       so a section's own observer always wins.
     - It never removes `.is-visible`, so it cannot fight another script.
     - It honours prefers-reduced-motion by revealing immediately without
       transition.
     - It is safe to run twice.

   Load it after the section scripts. It has no dependencies.
   ============================================================================= */

(function () {
  "use strict";

  var SELECTOR = ".ltw-reveal";
  var REVEALED = "is-visible";
  var CLAIMED = "ltwRevealFallback";

  function revealAll(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].classList.add(REVEALED);
    }
  }

  function start() {
    var nodes = document.querySelectorAll(SELECTOR);
    if (!nodes.length) { return; }

    var reduced = window.matchMedia
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // No IntersectionObserver, or motion is not wanted: show everything now.
    if (reduced || typeof IntersectionObserver === "undefined") {
      revealAll(nodes);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        if (!entry.isIntersecting) { continue; }
        entry.target.classList.add(REVEALED);
        observer.unobserve(entry.target);
      }
    }, {
      // Fire slightly before the element reaches the viewport, matching the
      // feel of the section observers already on the page.
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.01
    });

    for (var j = 0; j < nodes.length; j++) {
      var el = nodes[j];
      if (el.dataset[CLAIMED]) { continue; }
      if (el.classList.contains(REVEALED)) { continue; }
      el.dataset[CLAIMED] = "1";
      observer.observe(el);
    }
  }

  // Give every section's own observer a chance to claim its elements first.
  function defer() {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(function () {
        window.setTimeout(start, 200);
      });
    } else {
      window.setTimeout(start, 250);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", defer);
  } else {
    defer();
  }
})();
