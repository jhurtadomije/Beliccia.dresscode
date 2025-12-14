export function flyToCartFromEl(el, maxSize = 90) {
  if (!el) {
    window.dispatchEvent(new Event("cart:bump"));
    return;
  }

  const rect = el.getBoundingClientRect();
  const imgSrc = el.currentSrc || el.src;
  if (!imgSrc) {
    window.dispatchEvent(new Event("cart:bump"));
    return;
  }

  const size = Math.min(rect.width, rect.height, maxSize);
  const fromRect = {
    left: rect.left + rect.width / 2 - size / 2,
    top: rect.top + rect.height / 2 - size / 2,
    width: size,
    height: size,
  };

  window.dispatchEvent(
    new CustomEvent("cart:fly", { detail: { imgSrc, fromRect } })
  );
}
