export async function fetchJSON(path) {
  const res = await fetch(path);
  return res.json();
}

 export function renderProjects(projects, container, tag) {
   container.innerHTML = '';
   projects.forEach(p => {
     const div = document.createElement('div');
     div.className = 'project';
+    // enable scroll animation on each card
+    div.setAttribute('data-aos', 'fade-up');
+    div.setAttribute('data-aos-delay', '100');

     const h = document.createElement(tag);
     h.textContent = p.title;

     const img = document.createElement('img');
     img.src = p.image;
     img.alt = p.title;

     const pDesc = document.createElement('p');
     pDesc.textContent = p.description;

     const a = document.createElement('a');
     a.href = p.link;
     a.textContent = 'View';
     a.target = '_blank';

     div.append(h, img, pDesc, a);
     container.append(div);
   });
 }

