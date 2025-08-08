// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.question');
  q.addEventListener('click', () => {
    const ans = item.querySelector('.answer');
    const toggle = item.querySelector('.toggle');
    ans.style.display = ans.style.display === 'block' ? 'none' : 'block';
    if (toggle) toggle.textContent = toggle.textContent === '+' ? '-' : '+';
  });
});

// Projects carousel (Stripe-like) - dynamic from JSON
// Projects carousel (Stripe-like) - dynamic from JSON
(async function initProjects() {
  const track = document.getElementById('projectsTrack');
  if (!track) return;

  try {
    const res = await fetch('./lib/projects.json');
    const projects = await res.json();

    // Render cards
    projects.forEach((p, i) => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', String((i % 6) * 50));

      const img = document.createElement('img');
      img.className = 'project-media';
      img.src = p.image || '';
      img.alt = p.title;

      const body = document.createElement('div');
      body.className = 'project-body';

      const title = document.createElement('h3');
      title.className = 'project-title';
      title.textContent = p.title;

      const desc = document.createElement('p');
      desc.className = 'project-desc';
      desc.textContent = p.description || '';

      const meta = document.createElement('div');
      meta.className = 'project-meta';
      meta.innerHTML = `<span>${p.year || ''}</span>`;

      const link = document.createElement('a');
      link.className = 'btn project-link';
      link.href = p.link || '#';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Learn more';

      body.append(title, desc, meta, link);
      card.append(img, body);
      track.append(card);
    });

    if (window.AOS) AOS.refresh();

    // Controls
    const carousel = document.getElementById('projectsCarousel');
    const prev = document.querySelector('.ctrl.prev');
    const next = document.querySelector('.ctrl.next');
    const scrollByAmount = () => Math.min(carousel.clientWidth * 0.9, 800);

    if (prev) prev.addEventListener('click', () => {
      track.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' });
    });
    if (next) next.addEventListener('click', () => {
      track.scrollBy({ left:  scrollByAmount(), behavior: 'smooth' });
    });

    // Drag to scroll — but DO NOT hijack clicks on links
    let isDown = false, startX = 0, startScroll = 0;

    track.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a')) return; // don't start drag when clicking a link
      isDown = true;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
      track.style.cursor = 'grabbing';
    });

    track.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      track.scrollLeft = startScroll - dx;
    });

    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => {
      track.addEventListener(ev, () => {
        isDown = false;
        track.style.cursor = 'auto';
      });
    });

    // Safety: ensure clicking the button always opens a new tab
    track.addEventListener('click', (e) => {
      const a = e.target.closest('a.project-link');
      if (!a) return;
      // Some browsers may still treat this as a drag-end; force open:
      e.preventDefault();
      window.open(a.href, '_blank', 'noopener');
    });

  } catch (err) {
    console.error('Failed to load projects.json', err);
  }
})();


// Let's Chat email redirect
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      const mailtoLink = `mailto:khraghuvanshi13@gmail.com?subject=Message from ${encodeURIComponent(name)} (${encodeURIComponent(email)})&body=${encodeURIComponent(message)}`;
      window.location.href = mailtoLink;
    });
  }
});
