const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const progress = document.querySelector('.progress span');
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const reveals = [...document.querySelectorAll('.reveal')];
if (prefersReduced) {
  reveals.forEach(el => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min((i % 4) * 70, 210)}ms`;
    io.observe(el);
  });
}

const panel = document.querySelector('.today-panel');
const scrim = document.querySelector('.panel-scrim');
const openButton = document.querySelector('[data-panel-trigger]');
const closeButton = document.querySelector('.panel-close');
let lastFocused = null;

function setPanel(open) {
  if (open) lastFocused = document.activeElement;
  panel.setAttribute('aria-hidden', String(!open));
  scrim.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) closeButton.focus();
  else if (lastFocused) lastFocused.focus();
}
openButton.addEventListener('click', () => setPanel(true));
closeButton.addEventListener('click', () => setPanel(false));
scrim.addEventListener('click', () => setPanel(false));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') setPanel(false);
});
