document.querySelectorAll('.faq-item').forEach(item=>{const q=item.querySelector('.question');
q.addEventListener('click',()=>{const a=item.querySelector('.answer'),t=item.querySelector('.toggle');
a.style.display=a.style.display==='block'?'none':'block';t.textContent=t.textContent==='+'?'-':'+';});});