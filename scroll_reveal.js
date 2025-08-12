
// === scroll_reveal.js — professional, library-free scroll animations ===
// How it works:
// 1) Auto-tags common elements with .reveal for you (no HTML edits needed)
// 2) Uses IntersectionObserver to add the .in class once visible
// 3) Supports direction via data-reveal="left|right|down|zoom" (optional)
// 4) Supports stagger via data-reveal-stagger on a container (optional)

(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return; // CSS already handles the static state

  const AUTO_TARGETS = [
    'section',
    '.project-card',
    '.certificate-card',
    '.faq-item',
    '.hero',
    '.top-picks',
    '.projects-section',
    'header',
    'footer'
  ];

  // 1) Auto-apply .reveal to elements if not already tagged
  const autoNodes = document.querySelectorAll(AUTO_TARGETS.join(','));
  autoNodes.forEach(node => {
    // If container has children, stagger them for a nicer flow
    const children = node.children;
    if (children && children.length > 0) {
      node.setAttribute('data-reveal-stagger', '1'); // mark for stagger
      Array.from(children).forEach((child) => child.classList.add('reveal'));
    } else {
      node.classList.add('reveal');
    }
  });

  // Also reveal any explicitly tagged [data-reveal] elements
  document.querySelectorAll('[data-reveal]').forEach(el => {
    el.classList.add('reveal');
    const dir = el.getAttribute('data-reveal');
    if (dir) el.classList.add(dir);
  });

  // 2) IntersectionObserver to trigger
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;

        // Stagger if parent marked
        const parent = el.parentElement;
        const staggered = parent && parent.getAttribute('data-reveal-stagger') === '1';
        if (staggered) {
          const index = Array.prototype.indexOf.call(parent.children, el);
          el.style.transitionDelay = (index * 60) + 'ms';
        }

        el.classList.add('in');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
