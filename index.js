// import { fetchJSON, renderProjects, fetchGitHubData } from 'global.js';

// const projectsContainer = document.querySelector('.projects');

// const projects = await fetchJSON('./lib/projects.json');
// const latestProjects = projects.slice(0, 3);

// renderProjects(latestProjects, projectsContainer, 'h2');

// const profileStats = document.querySelector('#profile-stats');

// const githubData = await fetchGitHubData('khraghuvanshi');

// if (profileStats) {
//     profileStats.innerHTML = `
//           <dl>
//             <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
//             <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
//             <dt>Followers:</dt><dd>${githubData.followers}</dd>
//             <dt>Following:</dt><dd>${githubData.following}</dd>
//           </dl>
//       `;
//   }

import { fetchJSON, renderProjects, fetchGitHubData } from './global.js'; // Fix import path

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch and render the latest 3 projects
        const projectsContainer = document.querySelector('.projects');
        if (projectsContainer) {
            const projects = await fetchJSON('./lib/projects.json');
            const latestProjects = projects.slice(0, 3);
            renderProjects(latestProjects, projectsContainer, 'h2');
        } else {
            console.error("Error: '.projects' container not found.");
        }

        // Fetch and display GitHub profile stats
        const profileStats = document.querySelector('#profile-stats');
        if (profileStats) {
            const githubData = await fetchGitHubData('khraghuvanshi'); // Replace with your GitHub username

            profileStats.innerHTML = `
                <dl>
                    <dt>Public Repos:</dt> <dd>${githubData.public_repos}</dd>
                    <dt>Public Gists:</dt> <dd>${githubData.public_gists}</dd>
                    <dt>Followers:</dt> <dd>${githubData.followers}</dd>
                    <dt>Following:</dt> <dd>${githubData.following}</dd>
                </dl>
            `;
        } else {
            console.error("Error: '#profile-stats' container not found.");
        }

    } catch (error) {
        console.error("Failed to load data:", error);
    }
});
