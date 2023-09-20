document.addEventListener("DOMContentLoaded", function () {
    const toggleMenuButton = document.getElementById("toggle-menu");
    const menu = document.querySelector(".menu");

    toggleMenuButton.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent the click event from reaching the document

        menu.classList.toggle("menu-open");
    });

    // Close the menu when a click event occurs anywhere in the document
    document.addEventListener("click", function (e) {
        if (!menu.contains(e.target) && e.target !== toggleMenuButton) {
            menu.classList.remove("menu-open");
        }
    });
});
