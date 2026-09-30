document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".custom-nav-links");
    const links = document.querySelectorAll(".custom-nav-links a");

    // Toggle menu visibility
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("open");
    });

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            hamburger.classList.remove("open");
        });
    });
});
