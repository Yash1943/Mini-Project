// Add a simple fade-in animation for the sections
const sections = document.querySelectorAll("section");

sections.forEach((section) => {
    section.style.opacity = "0";
});

window.addEventListener("load", () => {
    sections.forEach((section) => {
        section.style.transition = "opacity 1s";
        section.style.opacity = "1";
    });
});

// You can add more animations and functionality as needed
