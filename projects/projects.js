import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');
const svg = d3.select('svg');
const legend = d3.select('.legend');

let selectedIndex = -1; // No wedge selected initially

renderProjects(projects, projectsContainer, 'h2');
projectsTitle.innerHTML = `Here are my <span>${projects.length}</span> projects`;

function renderPieChart(projectsGiven) {
    // Clear previous pie chart and legend
    svg.selectAll('path').remove();
    legend.selectAll('li').remove();

    // Recalculate rolled data
    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    // Recalculate data
    let data = rolledData.map(([year, count]) => ({
        value: count,
        label: year
    }));

    let total = data.reduce((sum, d) => sum + d.value, 0);

    let sliceGenerator = d3.pie().value(d => d.value);
    let arcData = sliceGenerator(data);
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    // Append paths for pie chart
    svg.selectAll('path')
        .data(arcData)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', (d, idx) => colors(idx))
        .attr('class', (d, idx) => selectedIndex === idx ? 'selected' : '')
        .style('cursor', 'pointer')
        .on('click', (event, d) => {
            selectedIndex = selectedIndex === d.index ? -1 : d.index;

            // Update paths to highlight selection
            svg.selectAll('path')
                .attr('class', (_, idx) => (selectedIndex === idx ? 'selected' : ''));

            // Update legend to highlight selection
            legend.selectAll('li')
                .attr('class', (_, idx) => (selectedIndex === idx ? 'selected' : ''));

            // Filter projects by selected year if one is selected
            if (selectedIndex === -1) {
                renderProjects(projects, projectsContainer, 'h2');
            } else {
                let selectedYear = data[selectedIndex].label;
                let filteredProjects = projects.filter(p => p.year === selectedYear);
                renderProjects(filteredProjects, projectsContainer, 'h2');
            }
        });

    // Update legend
    legend.selectAll('li')
        .data(data)
        .enter()
        .append('li')
        .attr('class', (d, idx) => selectedIndex === idx ? 'selected' : '')
        .attr('style', (d, idx) => `--color:${colors(idx)}`)
        .html(d => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
}

// Initial render of pie chart
renderPieChart(projects);

searchInput.addEventListener('change', (event) => {
    let query = event.target.value.toLowerCase();

    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query);
    });

    // Re-render filtered projects and update pie chart
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});


// import { fetchJSON, renderProjects } from '../global.js';

// const projects = await fetchJSON('../lib/projects.json');

// const projectsContainer = document.querySelector('.projects');
// const projectsTitle = document.querySelector('.projects-title');

// renderProjects(projects, projectsContainer, 'h2');
// projectsTitle.innerHTML = `Here are my <span>${projects.length}</span> projects`;

// // projectsTitle.textContent = `Here are my ${projects.length} projects`;

// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// const svg = d3.select('svg')

// let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

// let rolledData = d3.rollups(
//     projects,
//     (v) => v.length,
//     (d) => d.year,
//   );

// let sliceGenerator = d3.pie().value((d) => d.value);
// let total = 0;//data.reduce((sum, d) => sum + d, 0);

// let data = rolledData.map(([year, count]) => {
//   return { value: count, label: year };
// });

// for (let d of data) {
//   total += d;
// }

// let angle = 0;
// let arcData = sliceGenerator(data);//[];

// for (let d of data) {
//   let endAngle = angle + (d / total) * 2 * Math.PI;
//   arcData.push({ startAngle: angle, endAngle });
//   angle = endAngle;
// }

// let arcs = arcData.map((d) => arcGenerator(d));

// let colors = d3.scaleOrdinal(d3.schemeTableau10);

// arcs.forEach((arc, idx) => {
//     d3.select('svg')
//       .append('path')
//       .attr('d', arc)
//       .attr('fill', colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
// })

// let legend = d3.select('.legend');
// data.forEach((d, idx) => {
//     legend.append('li')
//         .attr('class', 'legend-item')
//         .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
//         .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
// })

// let query = '';
// let searchInput = document.querySelector('.searchBar');
// searchInput.addEventListener('change', (event) => {
//   // update query value
//   query = event.target.value;
//   // filter projects
//   let filteredProjects = projects.filter((project) => {
//     let values = Object.values(project).join('\n').toLowerCase();
//     return values.includes(query.toLowerCase());
//   });
//   // render filtered projects
//   renderProjects(filteredProjects, projectsContainer, 'h2');
// });

