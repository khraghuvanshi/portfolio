console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
//   );

// if (currentLink) {
//     // or if (currentLink !== undefined)
// currentLink.classList.add('current');
// }

let pages = [
    { url: 'index.html', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'contact/', title: 'Contact' },
    { url: 'meta/', title: 'Meta' },
    { url: 'https://github.com/khraghuvanshi', title: 'GitHub' },
  ];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }
  
  if (a.host !== location.host) {
    a.target = '_blank';
  }

  nav.append(a);

}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
    <label class="color-scheme">
      Theme:
      <select>
        <option value="light dark" selected>Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  `
);

let select = document.querySelector(".color-scheme select");

if ("colorScheme" in localStorage) {
  let savedTheme = localStorage.colorScheme;
  document.documentElement.style.setProperty('color-scheme', savedTheme);
  select.value = savedTheme; // Update the dropdown to match
}

select.addEventListener('input', function (event) {
  let theme = event.target.value;
  console.log('color scheme changed to', theme);
  document.documentElement.style.setProperty('color-scheme', theme);
  localStorage.colorScheme = theme;
});


export async function fetchJSON(url) {
  try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

      const data = await response.json();
      return data; 


  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {

  if (!containerElement) {
    console.error("Invalid container element.");
    return;
  }

  containerElement.innerHTML = '';
  if (!Array.isArray(projects) || projects.length === 0) {
    containerElement.innerHTML = '<p>No projects available.</p>';
    return;
  }

  projects.forEach(project => {
    const article = document.createElement('article');

    // Ensuring missing data doesn't break rendering
    const title = project.title || 'Untitled Project';
    const image = project.image ? `<img src="${project.image}" alt="${title}">` : '';
    const description = project.description || 'No description available.';
    const year = project.year ? `<span class="project-year">${project.year}</span>` : '';
    const link = project.link 
      ? `<a href="${project.link}" class="view-button" target="_blank" rel="noopener noreferrer">View Project</a>` 
      : '';

    article.innerHTML = `
      <${headingLevel}>${title}</${headingLevel}>
      ${image}
      <div class = "project-info">
        ${year}
        <p>${description}</p>
        ${link}
      </div>
    `;

    containerElement.appendChild(article);
  });

  // projects.forEach(project => {
  //   const article = document.createElement('article');

  //   article.innerHTML = `
  //   <h3>${project.title}</h3>
  //   <img src="${project.image}" alt="${project.title}">
  //   <p>${project.description}</p>`;
  // });

  // containerElement.appendChild(article);
  
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/khraghuvanshi`);
}




