// shortcuts.js — robust P/R shortcuts

(() => {
  // 1) SET THESE:
  const RESUME_URL = "https://khraghuvanshi.github.io/portfolio/resume.pdf";
  // Try multiple common IDs in case your projects section isn't exactly "#projects"
  const PROJECTS_SELECTOR = "#projects, #projects-section, section#projects, [data-section='projects']";

  // 2) Helpers
  const isTyping = el =>
    el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);

  const openInNewTab = (url) => {
    // Safer than window.open for some popup blockers
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // 3) Bind once
  if (window.__shortcutsBound) return;
  window.__shortcutsBound = true;
  console.debug("[shortcuts] ready");

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;

    const key = (e.key || "").toLowerCase(); // more robust than e.code on some layouts

    if (key === "p") {
      // Scroll to projects
      const target = document.querySelector(PROJECTS_SELECTOR);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // Fallback to hash; won’t break if no element
        location.hash = "#projects";
      }
    } else if (key === "r") {
      // Open resume
      if (RESUME_URL) {
        openInNewTab(RESUME_URL);
      } else {
        console.warn("[shortcuts] Set RESUME_URL in shortcuts.js");
      }
    }
  });
})();
