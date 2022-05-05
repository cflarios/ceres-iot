const nav = document.querySelector('nav');

/* change navbar styles on scroll */
window.addEventListener('scroll', () => {
  nav.classList.toggle("window-scroll", window.scrollY > 0);
});