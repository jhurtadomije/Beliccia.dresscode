// src/utils/animation.js
const animations = ['fadeIn', 'slideInLeft', 'slideInRight', 'zoomIn'];

export function getRandomAnimation() {
  const index = Math.floor(Math.random() * animations.length);
  return animations[index];
}