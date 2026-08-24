// Scroll-based navbar background
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Theme preference: default to dark navy and remember the visitor's choice.
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme');
const setTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  const isLight = theme === 'light';
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to bright theme');
  themeToggle.setAttribute('title', isLight ? 'Switch to dark theme' : 'Switch to bright theme');
};

setTheme(savedTheme === 'light' ? 'light' : 'dark');
themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  setTheme(nextTheme);
  localStorage.setItem('portfolio-theme', nextTheme);
});

// Intersection Observer for fade-up animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Keep a single muted-gold glow beneath the cursor instead of creating many elements.
const cursorGlow = document.getElementById('cursor-glow');
let cursorFrame;
let cursorPosition;
let lastTrailTime = 0;
document.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'touch') return;
  cursorPosition = { x: event.clientX, y: event.clientY };
  cursorGlow.classList.add('visible');
  if (event.timeStamp - lastTrailTime > 45) {
    const trail = document.createElement('span');
    trail.className = 'cursor-trail';
    trail.style.left = `${event.clientX}px`;
    trail.style.top = `${event.clientY}px`;
    document.body.appendChild(trail);
    trail.addEventListener('animationend', () => trail.remove(), { once: true });
    window.setTimeout(() => trail.remove(), 2000);
    const trails = document.querySelectorAll('.cursor-trail');
    if (trails.length > 24) trails[0].remove();
    lastTrailTime = event.timeStamp;
  }
  if (cursorFrame) return;
  cursorFrame = window.requestAnimationFrame(() => {
    cursorGlow.style.left = `${cursorPosition.x}px`;
    cursorGlow.style.top = `${cursorPosition.y}px`;
    cursorFrame = null;
  });
});
document.addEventListener('mouseleave', () => cursorGlow.classList.remove('visible'));

// Leave a brief muted-gold shade at the point of contact.
document.addEventListener('pointerdown', (event) => {
  const shade = document.createElement('span');
  shade.className = 'touch-shade';
  shade.style.left = `${event.clientX}px`;
  shade.style.top = `${event.clientY}px`;
  document.body.appendChild(shade);
  shade.addEventListener('animationend', () => shade.remove(), { once: true });
  window.setTimeout(() => shade.remove(), 2400);
});
