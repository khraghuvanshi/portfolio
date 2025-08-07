// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.question');
  q.addEventListener('click', () => {
    const ans = item.querySelector('.answer');
    const toggle = item.querySelector('.toggle');
    ans.style.display = ans.style.display === 'block' ? 'none' : 'block';
    toggle.textContent = toggle.textContent === '+' ? '-' : '+';
  });
});
