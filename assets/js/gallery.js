(() => {
  const gallery = document.querySelector(".gallery");
  if (gallery && !CSS.supports("display", "grid-lanes")) {
    const items = [...gallery.querySelectorAll(".gallery-item")];
    let layoutFrame;
    const layout = () => {
      gallery.removeAttribute("data-masonry");
      items.forEach((item) => item.style.removeProperty("grid-row-end"));
      const gap = Number.parseFloat(getComputedStyle(gallery).rowGap) || 0;
      const spans = items.map((item) => Math.ceil((item.getBoundingClientRect().height + gap) / 8));
      gallery.dataset.masonry = "";
      items.forEach((item, index) => {
        item.style.gridRowEnd = `span ${spans[index]}`;
      });
    };
    const queueLayout = () => {
      cancelAnimationFrame(layoutFrame);
      layoutFrame = requestAnimationFrame(layout);
    };
    addEventListener("resize", queueLayout, { passive: true });
    document.fonts?.ready.then(queueLayout);
    queueLayout();
  }

  const links = [...document.querySelectorAll("[data-lightbox]")];
  const dialog = document.querySelector("[data-viewer]");
  if (!links.length || !dialog?.showModal) return;

  const stage = dialog.querySelector("[data-viewer-stage]");
  const figure = dialog.querySelector(".viewer-figure");
  const image = dialog.querySelector("[data-viewer-image]");
  const status = dialog.querySelector("[data-viewer-status]");
  const caption = dialog.querySelector("[data-viewer-caption]");
  const count = dialog.querySelector("[data-viewer-count]");
  const previous = dialog.querySelector("[data-previous]");
  const next = dialog.querySelector("[data-next]");
  const fullscreen = dialog.querySelector("[data-fullscreen]");
  let preload;
  let current = 0;
  let loadId = 0;
  let opener;
  let swipeStart;

  const setState = (state, message = "") => {
    dialog.dataset.state = state;
    image.setAttribute("aria-busy", String(state === "loading"));
    status.textContent = message;
    status.hidden = !message;
  };

  const setSource = (target, link) => {
    const viewerWidth = link.dataset.viewerWidth;
    const thumbnailSrcset = link.querySelector("img")?.srcset;
    if (viewerWidth && thumbnailSrcset) {
      target.srcset = `${thumbnailSrcset}, ${link.href} ${viewerWidth}w`;
      target.sizes = "(max-width: 720px) calc(100vw - 2rem), calc(100vw - clamp(7rem, 16vw, 16rem))";
    } else {
      target.removeAttribute("srcset");
      target.removeAttribute("sizes");
    }
    target.src = link.href;
  };

  const preloadNext = () => {
    if (links.length < 2 || navigator.connection?.saveData) return;
    preload = new Image();
    setSource(preload, links[(current + 1) % links.length]);
  };

  const show = (index) => {
    current = (index + links.length) % links.length;
    const requestedLoad = ++loadId;
    const link = links[current];
    const thumbnail = link.querySelector("img");
    const text = link.closest("figure")?.querySelector("figcaption")?.textContent.trim() || "";

    setState("loading", "Loading photograph...");
    image.alt = thumbnail?.alt || "";
    image.onload = () => {
      if (requestedLoad !== loadId) return;
      setState("ready");
      preloadNext();
    };
    image.onerror = () => {
      if (requestedLoad !== loadId) return;
      setState("error", "Photograph could not be loaded.");
    };
    setSource(image, link);
    count.textContent = `${current + 1} / ${links.length}`;
    caption.textContent = text;
    caption.hidden = !text;
  };

  links.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      dialog.showModal();
      show(index);
    });
  });

  previous.hidden = next.hidden = links.length < 2;
  previous.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => show(current + 1));

  figure.addEventListener("pointerdown", (event) => {
    if (event.isPrimary && event.pointerType !== "mouse") swipeStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  figure.addEventListener("pointerup", (event) => {
    if (!swipeStart || event.pointerId !== swipeStart.id) return;
    const distanceX = event.clientX - swipeStart.x;
    const distanceY = event.clientY - swipeStart.y;
    swipeStart = undefined;
    if (links.length < 2) return;
    if (Math.abs(distanceX) >= 50 && Math.abs(distanceX) > Math.abs(distanceY) * 1.5) show(current + (distanceX < 0 ? 1 : -1));
  });
  figure.addEventListener("pointercancel", (event) => {
    if (event.pointerId === swipeStart?.id) swipeStart = undefined;
  });

  const syncFullscreen = () => {
    const active = document.fullscreenElement === stage;
    fullscreen.setAttribute("aria-pressed", String(active));
    fullscreen.setAttribute("aria-label", active ? "Exit full screen" : "Enter full screen");
  };

  if (document.fullscreenEnabled && stage.requestFullscreen) {
    fullscreen.hidden = false;
    fullscreen.addEventListener("click", async () => {
      try {
        if (document.fullscreenElement === stage) await document.exitFullscreen();
        else await stage.requestFullscreen();
      } catch {
        fullscreen.hidden = true;
      }
    });
    document.addEventListener("fullscreenchange", syncFullscreen);
  }

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(current - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      show(current + 1);
    } else if (event.key === "Escape" && !document.fullscreenElement) {
      dialog.close();
    }
  });
  dialog.addEventListener("cancel", (event) => {
    if (document.fullscreenElement === stage) {
      event.preventDefault();
      document.exitFullscreen().catch(() => {});
    }
  });
  dialog.addEventListener("close", () => {
    loadId += 1;
    image.onload = image.onerror = null;
    image.removeAttribute("src");
    image.removeAttribute("srcset");
    image.removeAttribute("sizes");
    preload = undefined;
    setState("ready");
    if (document.fullscreenElement === stage) document.exitFullscreen().catch(() => {});
    opener?.focus();
  });

  setState("ready");
})();
