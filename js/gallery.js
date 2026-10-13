// Accessible image lightbox and video viewer for page4.html.
(() => {
  const gallery = document.querySelector("[data-gallery]");
  const viewer = document.querySelector("[data-viewer]");
  const content = document.querySelector("[data-viewer-content]");
  const caption = document.querySelector("[data-viewer-caption]");
  const closeButton = document.querySelector("[data-viewer-close]");
  const backButton = document.querySelector("[data-viewer-back]");
  const prevButton = document.querySelector("[data-viewer-prev]");
  const nextButton = document.querySelector("[data-viewer-next]");
  if (!gallery || !viewer || !content) return;

  const cards = Array.from(gallery.querySelectorAll("[data-kind][data-src]"));
  let currentIndex = 0;
  let lastFocused = null;

  function svgFallback(label) {
    const safeLabel = String(label).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
    }[ch]));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="750" viewBox="0 0 1000 750"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#57375f"/><stop offset=".55" stop-color="#b875a2"/><stop offset="1" stop-color="#e9b8d2"/></linearGradient></defs><rect width="1000" height="750" rx="32" fill="url(#g)"/><circle cx="500" cy="280" r="105" fill="#ffe4b5" opacity=".85"/><path d="M0 600 Q240 400 470 610 T1000 570 V750 H0Z" fill="#30213f" opacity=".5"/><text x="500" y="500" text-anchor="middle" font-family="Georgia,serif" font-size="42" fill="#fff7ff">${safeLabel}</text><text x="500" y="555" text-anchor="middle" font-family="Arial,sans-serif" font-size="23" fill="#fff0f8">Replace this placeholder with your photo</text></svg>`;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  // Missing local photos are replaced with a designed placeholder rather than a broken icon.
  gallery.querySelectorAll("img").forEach((img, index) => {
    img.addEventListener("error", () => {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = "true";
      img.src = svgFallback(`Memory ${index + 1}`);
      img.classList.add("fallback-image");
      img.alt = `Decorative placeholder for memory ${index + 1}; replace with your photo`;
    });
  });

  function showItem(index) {
    currentIndex = (index + cards.length) % cards.length;
    const card = cards[currentIndex];
    const kind = card.dataset.kind;
    const src = card.dataset.src;
    const label = card.dataset.caption || "A little memory";
    content.replaceChildren();
    if (kind === "video") {
      const video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.src = src;
      video.setAttribute("aria-label", label);
      video.addEventListener("error", () => {
        content.replaceChildren();
        const note = document.createElement("div");
        note.className = "video-unavailable";
        note.textContent = "Add your video file to assets/videos/ to play this memory.";
        note.style.cssText = "max-width:500px;padding:2rem;border:1px solid #ffffff35;border-radius:18px;background:#ffffff12;color:#fff;text-align:center;line-height:1.7";
        content.appendChild(note);
      }, { once: true });
      content.appendChild(video);
      // Do not autoplay: let the friend choose to play the memory.
    } else {
      const image = document.createElement("img");
      image.alt = label;
      image.src = src;
      image.addEventListener("error", () => {
        image.src = svgFallback(label);
      }, { once: true });
      content.appendChild(image);
    }
    if (caption) caption.textContent = label;
    const isVideo = kind === "video";
    prevButton.hidden = isVideo;
    nextButton.hidden = isVideo;
  }

  function openViewer(index) {
    lastFocused = document.activeElement;
    viewer.classList.remove("is-hidden");
    document.body.style.overflow = "hidden";
    showItem(index);
    closeButton.focus();
  }

  function closeViewer() {
    const video = content.querySelector("video");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    viewer.classList.add("is-hidden");
    document.body.style.overflow = "";
    content.replaceChildren();
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  cards.forEach((card, index) => card.addEventListener("click", () => openViewer(index)));
  closeButton.addEventListener("click", closeViewer);
  backButton.addEventListener("click", closeViewer);
  prevButton.addEventListener("click", () => showItem(currentIndex - 1));
  nextButton.addEventListener("click", () => showItem(currentIndex + 1));
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) closeViewer();
  });
  document.addEventListener("keydown", (event) => {
    if (viewer.classList.contains("is-hidden")) return;
    if (event.key === "Escape") closeViewer();
    if (event.key === "ArrowLeft" && !prevButton.hidden) showItem(currentIndex - 1);
    if (event.key === "ArrowRight" && !nextButton.hidden) showItem(currentIndex + 1);
  });
})();
