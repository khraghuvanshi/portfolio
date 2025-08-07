import { fetchJSON, renderProjects } from './global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

(async () => {
  const projects = await fetchJSON('./lib/projects.json');
  const container = document.querySelector('.projects');
  const title = document.querySelector('.projects-title');
  const searchInput = document.querySelector('.searchBar');
  const svg = d3.select('svg');
  const legend = d3.select('.legend');
  let selectedIndex = -1;

  function update(projectsList) {
    renderProjects(projectsList, container, 'h3');
    title.innerHTML = `Here are my <span>${projectsList.length}</span> projects`;
  }

  function renderPie(list) {
    svg.selectAll('*').remove();
    legend.selectAll('*').remove();
    const roll = d3.rollups(list, v => v.length, d => d.year)
      .map(([year, count]) => ({ label: year, value: count }));
    const pie = d3.pie().value(d => d.value)(roll);
    const arc = d3.arc().innerRadius(0).outerRadius(50);
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    svg.selectAll('path')
      .data(pie)
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', (d,i) => color(i))
      .style('cursor','pointer')
      .on('click', (e,d) => {
        selectedIndex = selectedIndex === d.index ? -1 : d.index;
        const filtered = selectedIndex === -1
          ? projects
          : projects.filter(p => p.year === roll[selectedIndex].label);
        update(filtered);
      });

    legend.selectAll('li')
      .data(roll)
      .enter().append('li')
      .html(d => `<span class="swatch"></span>${d.label} (${d.value})`);
  }

  update(projects);
  renderPie(projects);

  searchInput.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const filtered = projects.filter(p => Object.values(p).join(' ').toLowerCase().includes(q));
    update(filtered);
    renderPie(filtered);
  });
})();
