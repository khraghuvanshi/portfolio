import {fetchJSON,renderProjects} from './global.js';import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
(async()=>{const projects=await fetchJSON('./lib/projects.json');
const cont=document.querySelector('.projects'),title=document.querySelector('.projects-title');
const input=document.querySelector('.searchBar'),svg=d3.select('svg'),legend=d3.select('.legend');
let idx=-1;
renderProjects(projects,cont,'h2');
title.innerHTML=`Here are my <span>${projects.length}</span> projects`;
function renderPie(ps){svg.selectAll('*').remove();legend.selectAll('*').remove();
let rolled=d3.rollups(ps,v=>v.length,d=>d.year),data=rolled.map(([y,c])=>({value:c,label:y}));
let pie=d3.pie().value(d=>d.value)(data),arc=d3.arc().innerRadius(0).outerRadius(50);
let color=d3.scaleOrdinal(d3.schemeTableau10);
svg.selectAll('path').data(pie).enter().append('path').attr('d',arc).attr('fill',(d,i)=>color(i))
.style('cursor','pointer').on('click',(e,d)=>{idx= idx===d.index?-1:d.index;svg.selectAll('path').attr('opacity',(_,i)=>idx===-1?1:idx===i?1:0.3);
legend.selectAll('li').attr('opacity',(_,i)=>idx===-1?1:idx===i?1:0.3);
let filtered= idx===-1?projects:projects.filter(p=>p.year===data[idx].label);
renderProjects(filtered,cont,'h2');});
legend.selectAll('li').data(data).enter().append('li').attr('style',(d,i)=>`--color:${color(i)}`)
.html(d=>`<span class="swatch"></span>${d.label}(${d.value})`);}
renderPie(projects);
input.addEventListener('change',e=>{let f=projects.filter(p=>Object.values(p).join('').toLowerCase().includes(e.target.value.toLowerCase()));
renderProjects(f,cont,'h2');renderPie(f);});})();