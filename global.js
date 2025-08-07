export async function fetchJSON(path){const res=await fetch(path);return res.json();}
export function renderProjects(projects,container,tag){container.innerHTML='';projects.forEach(p=>{let d=document.createElement('div');d.className='project';
let h=document.createElement(tag);h.textContent=p.title;
let pd=document.createElement('p');pd.textContent=p.description;
let a=document.createElement('a');a.href=p.link;a.textContent='View';a.target='_blank';
d.append(h,pd,a);container.append(d);});}