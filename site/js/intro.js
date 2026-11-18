// Reveal the message in place; never make visitors wait for navigation or the demo.
export function playIntro() {
  const root = document.documentElement;
  const animate = root.classList.contains('intro');
  root.classList.remove('intro');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!animate || motion.matches) return { gallery: Promise.resolve(), done: Promise.resolve() };
  const animations = [...document.querySelectorAll('.hero .copy > *')].map((element, i) => element.animate(
    [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
    { duration: 500, delay: i * 65, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' },
  ));
  const cancel = () => animations.forEach(animation => animation.cancel());
  motion.addEventListener('change', cancel, { once: true });
  window.addEventListener('pagehide', cancel, { once: true });
  const done = Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
    motion.removeEventListener('change', cancel);
    window.removeEventListener('pagehide', cancel);
  });
  return { gallery: Promise.resolve(), done };
}
