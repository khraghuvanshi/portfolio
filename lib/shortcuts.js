// shortcuts.js
(() => {
  // TODO: set your real resume link:
  const RESUME_URL = "https://your-link.com/Khushi_Raghuvanshi_Resume.pdf";
  // If your section id differs, change this:
  const PROJECTS_SELECTOR = "#projects";

  const isTyping = el =>
    el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;

    if (e.code === "KeyP") {
      document.querySelector(PROJECTS_SELECTOR)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (e.code === "KeyR" && RESUME_URL) {
      window.open(RESUME_URL, "_blank", "noopener");
    }
  });
})();
