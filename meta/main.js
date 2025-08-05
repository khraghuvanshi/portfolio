let data = [];
let commits = d3.groups(data, (d) => d.commit);

async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
        ...row,
        line: Number(row.line), // or just +row.line
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime),
      }));
    processCommits();
    displayStats();
    createScatterplot();
}

function processCommits() {
    commits = d3
      .groups(data, (d) => d.commit) // Group data by commit
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
  
        // Construct the commit object with basic and derived information
        let ret = {
          id: commit,
          url: 'https://github.com/YOUR_REPO/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,  // Calculate fractional hour
          totalLines: lines.length,  // Number of lines modified in this commit
        };
  
        // Optionally hide the lines array
        Object.defineProperty(ret, 'lines', {
          value: lines,
          writable: false, // Prevent changes
          enumerable: false, // Hide in normal printing
          configurable: false, // Can't redefine or delete this property
        });
  
        return ret;
      });
    }

function displayStats() {
  processCommits(); // Process commit data

  const dl = d3.select('#stats').append('dl').attr('class', 'stats');

  // Total Lines of Code
  dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
  dl.append('dd').text(data.length);

  // Total Commits
  dl.append('dt').text('Total commits');
  dl.append('dd').text(commits.length);

  // Number of Files
  const numFiles = d3.group(data, (d) => d.file).size;
  dl.append('dt').text('Total files');
  dl.append('dd').text(numFiles);

  // Maximum File Length
  const maxFileLength = d3.max(data, (d) => d.line);
  dl.append('dt').text('Longest file (in lines)');
  dl.append('dd').text(maxFileLength);

  // Average File Length
  const fileLengths = d3.rollups(
    data,
    (v) => d3.max(v, (d) => d.line),
    (d) => d.file
  );
  const avgFileLength = d3.mean(fileLengths, (d) => d[1]);
  dl.append('dt').text('Average file length (in lines)');
  dl.append('dd').text(avgFileLength.toFixed(2));

  // Deepest Line
  const maxDepth = d3.max(data, (d) => d.depth);
  dl.append('dt').text('Maximum depth');
  dl.append('dd').text(maxDepth);
}

let xScale, yScale, brushSelection = null;

function createScatterplot() {
    const width = 1000;
    const height = 600;
    const margin = { top: 10, right: 10, bottom: 30, left: 40 };

    const usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom,
      };

    const svg = d3
        .select('#chart')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('overflow', 'visible');

    // X Scale: Time Scale for Date
    const xScale = d3
        .scaleTime()
        .domain(d3.extent(commits, (d) => d.datetime))
        .range([usableArea.left, usableArea.right])
        .nice();

    // Y Scale: Linear Scale for Hour Fraction
    const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);

    const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);

    // Create a square root scale for the radius
    const rScale = d3
        .scaleSqrt() // Change only this line
        .domain([minLines, maxLines])
        .range([2, 30]);

    const gridlines = svg
        .append('g')
        .attr('class', 'gridlines')
        .attr('transform', `translate(${usableArea.left}, 0)`);

// Create gridlines as an axis with no labels and full-width ticks
    gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

    const sortedCommits = d3.sort(commits, (d) => -d.totalLines);

    // Draw Dots
    const dots = svg.append('g').attr('class', 'dots');

    dots
        .selectAll('circle')
        .data(sortedCommits)
        .join('circle')
        .attr('cx', (d) => xScale(d.datetime))
        .attr('cy', (d) => yScale(d.hourFrac))
        .attr('r', (d) => rScale(d.totalLines))
        .attr('fill', 'steelblue')
        .style('fill-opacity', 0.7)
        .on('mouseenter', (event, commit) => {
            d3.select(event.currentTarget).style('fill-opacity', 1);
            updateTooltipContent(commit);
            updateTooltipVisibility(true);
            updateTooltipPosition(event);
        })
        .on('mouseleave', () => {
            d3.select(event.currentTarget).style('fill-opacity', 0.7);
            updateTooltipContent({});
            updateTooltipVisibility(false);
        })
        .on('mousemove', (event) => {
            updateTooltipPosition(event);
        });

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
        // Add X axis
    svg
        .append('g')
        .attr('transform', `translate(0, ${usableArea.bottom})`)
        .call(xAxis);
    
        // Add Y axis
    svg
        .append('g')
        .attr('transform', `translate(${usableArea.left}, 0)`)
        .call(yAxis);

    brushSelector(svg);
}

function brushSelector(svg) {
    const brush = d3.brush()
        .on('start brush end', brushed);

    svg.call(brush);

    // Raise dots above the brush overlay
    svg.selectAll('.dots, .overlay ~ *').raise();
}

// Brushing event handler
function brushed(event) {
    brushSelection = event.selection;
    updateSelection();
}

// Check if commit is within the brush selection
function isCommitSelected(commit) {
    if (!brushSelection) return false;

    const min = { x: brushSelection[0][0], y: brushSelection[0][1] };
    const max = { x: brushSelection[1][0], y: brushSelection[1][1] };
    const x = xScale(commit.datetime);
    const y = yScale(commit.hourFrac);

    return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
}

// Update selected dots and stats
function updateSelection() {
    d3.selectAll('circle').classed('selected', (d) => isCommitSelected(d));
    updateSelectionCount();
    updateLanguageBreakdown();
}

// Update the selection count
function updateSelectionCount() {
    const selectedCommits = brushSelection ? commits.filter(isCommitSelected) : [];
    const countElement = document.getElementById('selection-count');
    countElement.textContent = `${selectedCommits.length || 'No'} commits selected`;
}

// Update the language breakdown
function updateLanguageBreakdown() {
    const selectedCommits = brushSelection 
    ? commits.filter(isCommitSelected) 
    : [];
    const container = document.getElementById('language-breakdown');

    if (selectedCommits.length === 0) {
        container.innerHTML = '';
        return;
    }

    const requiredCommits = selectedCommits.length ? selectedCommits : commits;
    const lines = requiredCommits.flatMap((d) => d.lines);

    // Count lines per language
    const breakdown = d3.rollup(
        lines,
        (v) => v.length,
        (d) => d.type
    );

    container.innerHTML = '';

    for (const [language, count] of breakdown) {
        const proportion = count / lines.length;
        const formatted = d3.format('.1~%')(proportion);

        container.innerHTML += `
            <dt>${language}</dt>
            <dd>${count} lines (${formatted})</dd>
        `;
    }

    return breakdown
}

function updateTooltipContent(commit) {
    const link = document.getElementById('commit-link');
    const date = document.getElementById('commit-date');

    if (!commit.id) return;

    link.href = commit.url;
    link.textContent = commit.id;
    date.textContent = commit.datetime?.toLocaleString('en', { dateStyle: 'full' });
}

function updateTooltipVisibility(isVisible) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.hidden = !isVisible;
}

function updateTooltipPosition(event) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.style.left = `${event.clientX + 10}px`;
    tooltip.style.top = `${event.clientY + 10}px`;
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
});