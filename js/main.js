// Shared page effects: twinkling star field, confetti, and optional music.
(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".star-field").forEach((field) => {
    if (reducedMotion || field.dataset.ready) return;
    field.dataset.ready = "true";
    // A few decorative star glyphs; CSS handles their gentle movement.
    for (let i = 0; i < 12; i++) {
      const star = document.createElement("span");
      star.textContent = i % 3 === 0 ? "✦" : "·";
      star.setAttribute("aria-hidden", "true");
      star.style.position = "absolute";
      star.style.left = `${(i * 37 + 9) % 96}%`;
      star.style.top = `${(i * 23 + 8) % 94}%`;
      star.style.color = i % 2 ? "#f9d8eb" : "#f7d994";
      star.style.opacity = `${0.2 + (i % 5) * 0.12}`;
      star.style.fontSize = `${8 + (i % 4) * 5}px`;
      star.style.animation = `twinkle ${2 + (i % 3)}s ease-in-out ${i * 0.13}s infinite`;
      field.appendChild(star);
    }
  });

  const confettiLayer = document.querySelector("[data-confetti]");
  if (confettiLayer && !reducedMotion) {
    const colors = ["#ffc0dd", "#f7d994", "#c8b1ff", "#fff3d2", "#f78bb9"];
    for (let i = 0; i < 55; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.setProperty("--fall-time", `${3.2 + Math.random() * 3}s`);
      piece.style.setProperty("--delay", `${Math.random() * 2.4}s`);
      piece.style.setProperty("--drift", `${Math.round(Math.random() * 160 - 80)}px`);
      confettiLayer.appendChild(piece);
    }
  }

  const music = document.querySelector("[data-background-music]");
  const toggle = document.querySelector("[data-music-toggle]");
  const label = document.querySelector("[data-music-label]");
  if (music && toggle) {
    toggle.addEventListener("click", async () => {
      if (music.paused) {
        try {
          await music.play();
          toggle.setAttribute("aria-pressed", "true");
          if (label) label.textContent = "Pause the birthday soundtrack";
        } catch {
          if (label) label.textContent = "Add assets/music/birthday.mp3 to enable music";
        }
      } else {
        music.pause();
        toggle.setAttribute("aria-pressed", "false");
        if (label) label.textContent = "Turn on the birthday soundtrack";
      }
    });
    music.addEventListener("error", () => {
      if (label && music.paused) label.textContent = "Add your soundtrack in assets/music/";
    });
  }
})();
