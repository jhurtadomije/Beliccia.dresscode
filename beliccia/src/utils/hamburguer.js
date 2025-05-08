export function setupHamburgerAnimation() {
    const toggler = document.querySelector('.navbar-toggler');
    if (!toggler) return;
  
    toggler.addEventListener('click', () => {
      toggler.classList.toggle('open');
    });
  }
  