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

    // Horizontal controls + drag
    const carousel = document.getElementById('projectsCarousel');
    const prev = document.querySelector('.ctrl.prev');
    const next = document.querySelector('.ctrl.next');

    const scrollByAmount = () => Math.min(carousel.clientWidth * 0.9, 800);

    prev.addEventListener('click', () => track.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left:  scrollByAmount(), behavior: 'smooth' }));

    // Drag to scroll
    let isDown = false, startX = 0, scrollLeft = 0;
    track.addEventListener('pointerdown', (e) => {
      isDown = true;
      startX = e.clientX;
      scrollLeft = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
      track.style.cursor = 'grabbing';
    });
    track.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      track.scrollLeft = scrollLeft - dx;
    });
    ['pointerup','pointercancel','pointerleave'].forEach(ev => {
      track.addEventListener(ev, () => { isDown = false; track.style.cursor = 'auto'; });
    });

    // Keyboard support
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') track.scrollBy({ left: 300, behavior: 'smooth' });
      if (e.key === 'ArrowLeft')  track.scrollBy({ left: -300, behavior: 'smooth' });
    });
  } catch (e) {
    console.error('Failed to load projects.json', e);
  }
})();