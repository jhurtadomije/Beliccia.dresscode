// src/utils/animation.js
const ANIMATIONS = Object.freeze([
  "fadeIn",
  "slideInLeft",
  "slideInRight",
  "zoomIn",
]);

export function getRandomAnimation(list = ANIMATIONS) {
  // Por si algún día llamas con una lista vacía o algo raro
  if (!Array.isArray(list) || list.length === 0) return "fadeIn";

  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export const animations = ANIMATIONS;
