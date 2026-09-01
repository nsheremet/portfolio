(() => {
  const links = [...document.querySelectorAll("[data-lightbox]")];
  const dialog = document.querySelector("[data-viewer]");
  if (!links.length || !dialog?.showModal) return;

  const image = dialog.querySelector("[data-viewer-image]");
  const caption = dialog.querySelector("[data-viewer-caption]");
  const count = dialog.querySelector("[data-viewer-count]");
  const previous = dialog.querySelector("[data-previous]");
  const next = dialog.querySelector("[data-next]");
  let current = 0;
  let opener;

  const show = (index) => {
    current = (index + links.length) % links.length;
    const link = links[current];
    const thumbnail = link.querySelector("img");
    const text = link.closest("figure")?.querySelector("figcaption")?.textContent.trim() || "";

    image.src = link.href;
    image.alt = thumbnail?.alt || "";
    count.textContent = `${current + 1} / ${links.length}`;
    caption.textContent = text;
    caption.hidden = !text;
  };

  links.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      show(index);
      dialog.showModal();
    });
  });

  previous.hidden = next.hidden = links.length < 2;
  previous.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => show(current + 1));
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(current - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      show(current + 1);
    } else if (event.key === "Escape") {
      dialog.close();
    }
  });
  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
    opener?.focus();
  });
})();
