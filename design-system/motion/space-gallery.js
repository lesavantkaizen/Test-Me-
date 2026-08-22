
(function () {
  "use strict";

  function initSpaceGallery(root) {
    if (
      !root ||
      root.getAttribute("data-ltw-initialized") === "true"
    ) {
      return;
    }

    var items = Array.prototype.slice.call(
      root.querySelectorAll(".ltw-space-gallery__item")
    );

    var links = Array.prototype.slice.call(
      root.querySelectorAll(".ltw-space-gallery__link")
    );

    var dialog = root.querySelector(".ltw-space-gallery__viewer");
    var viewerImage = root.querySelector(".ltw-space-gallery__viewer-image");
    var viewerTitle = root.querySelector(".ltw-space-gallery__viewer-title");
    var viewerDescription = root.querySelector(
      ".ltw-space-gallery__viewer-description"
    );
    var viewerStatus = root.querySelector(
      ".ltw-space-gallery__viewer-status"
    );
    var closeButton = root.querySelector("[data-ltw-space-close]");
    var previousButton = root.querySelector("[data-ltw-space-prev]");
    var nextButton = root.querySelector("[data-ltw-space-next]");

    if (!items.length || items.length !== links.length) {
      return;
    }

    var selectedIndex = 0;
    var returnFocus = null;

    function select(index, moveFocus) {
      selectedIndex = (index + items.length) % items.length;

      for (
        var itemIndex = 0;
        itemIndex < items.length;
        itemIndex++
      ) {
        var active = itemIndex === selectedIndex;

        items[itemIndex].setAttribute(
          "data-state",
          active ? "active" : "resting"
        );

        if (active) {
          links[itemIndex].setAttribute("aria-current", "true");
        } else {
          links[itemIndex].removeAttribute("aria-current");
        }
      }

      if (moveFocus) {
        links[selectedIndex].focus();
      }
    }

    function getItemContent(index) {
      var item = items[index];
      var image = item.querySelector(".ltw-space-gallery__image");
      var title = item.querySelector(
        ".ltw-space-gallery__caption-title"
      );
      var description = item.querySelector(
        ".ltw-space-gallery__caption-detail"
      );

      return {
        src: image.currentSrc || image.src,
        alt: image.alt,
        width: image.getAttribute("width"),
        height: image.getAttribute("height"),
        title: title.textContent.trim(),
        description: description.textContent.trim()
      };
    }

    function updateViewer(index) {
      var content = getItemContent(index);

      viewerImage.src = content.src;
      viewerImage.alt = content.alt;
      viewerImage.setAttribute("width", content.width);
      viewerImage.setAttribute("height", content.height);
      viewerTitle.textContent = content.title;
      viewerDescription.textContent = content.description;
      viewerStatus.textContent =
        "Image " + (index + 1) + " of " + items.length;
    }

    function openViewer(index, trigger) {
      if (
        !dialog ||
        typeof dialog.showModal !== "function"
      ) {
        return false;
      }

      select(index, false);
      updateViewer(selectedIndex);
      returnFocus = trigger;
      dialog.showModal();
      closeButton.focus();

      return true;
    }

    function closeViewer() {
      if (dialog && dialog.open) {
        dialog.close();
      }
    }

    for (var index = 0; index < links.length; index++) {
      (function (itemIndex) {
        links[itemIndex].addEventListener(
          "pointerenter",
          function () {
            select(itemIndex, false);
          }
        );

        links[itemIndex].addEventListener(
          "focus",
          function () {
            select(itemIndex, false);
          }
        );

        links[itemIndex].addEventListener(
          "click",
          function (event) {
            if (openViewer(itemIndex, links[itemIndex])) {
              event.preventDefault();
            }
          }
        );

        links[itemIndex].addEventListener(
          "keydown",
          function (event) {
            var target = selectedIndex;

            if (
              event.key === "ArrowRight" ||
              event.key === "ArrowDown"
            ) {
              target += 1;
            } else if (
              event.key === "ArrowLeft" ||
              event.key === "ArrowUp"
            ) {
              target -= 1;
            } else if (event.key === "Home") {
              target = 0;
            } else if (event.key === "End") {
              target = items.length - 1;
            } else {
              return;
            }

            event.preventDefault();
            select(target, true);
          }
        );
      })(index);
    }

    if (closeButton) {
      closeButton.addEventListener("click", closeViewer);
    }

    if (previousButton) {
      previousButton.addEventListener("click", function () {
        select(selectedIndex - 1, false);
        updateViewer(selectedIndex);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        select(selectedIndex + 1, false);
        updateViewer(selectedIndex);
      });
    }

    if (dialog) {
      dialog.addEventListener("click", function (event) {
        if (event.target === dialog) {
          closeViewer();
        }
      });

      dialog.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          select(selectedIndex + 1, false);
          updateViewer(selectedIndex);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          select(selectedIndex - 1, false);
          updateViewer(selectedIndex);
        }
      });

      dialog.addEventListener("close", function () {
        if (returnFocus) {
          returnFocus.focus();
        }
      });
    }

    root.setAttribute("data-ltw-initialized", "true");
    root.setAttribute("data-enhanced", "true");
    select(0, false);
  }

  function startSpaceGalleries() {
    var galleries = document.querySelectorAll(
      "[data-ltw-space-gallery]"
    );

    for (
      var index = 0;
      index < galleries.length;
      index++
    ) {
      initSpaceGallery(galleries[index]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      startSpaceGalleries,
      { once: true }
    );
  } else {
    startSpaceGalleries();
  }
})();
