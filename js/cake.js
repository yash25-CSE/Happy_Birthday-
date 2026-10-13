// Candle interaction for page2.html. Navigation only appears after the candle is blown.
(() => {
  const stage = document.querySelector("[data-cake-stage]");
  const blowButton = document.querySelector("[data-blow-button]");
  const continueButton = document.querySelector("[data-continue-button]");
  const message = document.querySelector("[data-wish-message]");
  if (!stage || !blowButton || !continueButton || !message) return;

  let blown = false;
  blowButton.addEventListener("click", () => {
    if (blown) return;
    blown = true;
    stage.classList.add("blown-out");
    blowButton.disabled = true;
    blowButton.textContent = "Wish sent into the universe ✨";
    blowButton.style.opacity = ".72";
    message.textContent = "Your wish deserves to come true! ✨";
    message.classList.add("wish-celebration");

    // Reveal the separate continue button after the smoke animation begins.
    window.setTimeout(() => {
      continueButton.classList.remove("is-hidden");
      continueButton.focus({ preventScroll: true });
    }, 650);
  });
})();
