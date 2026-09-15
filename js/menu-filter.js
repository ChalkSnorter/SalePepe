document.addEventListener("DOMContentLoaded", () => {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const categories = document.querySelectorAll(".menu-category");
    const subnavBtns = document.querySelectorAll(".drinks-subnav button");
    const drinksBlocks = document.querySelectorAll(".drinks-content .menu-section");

    function showCategory(category) {
        categories.forEach((cat) => {
            cat.classList.toggle("active", cat.getAttribute("data-category") === category);
        });
        filterBtns.forEach((btn) => {
            btn.classList.toggle("active", btn.getAttribute("data-category") === category);
        });
    }

    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => showCategory(btn.getAttribute("data-category")));
    });

    subnavBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = document.getElementById(btn.getAttribute("data-target"));
            if (!target) return;

            subnavBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const headerOffset = 160; // adjust if your sticky nav height differs
            const y = target.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        });
    });

    // Highlight the correct subnav button as the user scrolls through drinks
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    subnavBtns.forEach((b) =>
                        b.classList.toggle("active", b.getAttribute("data-target") === entry.target.id)
                    );
                }
            });
        },
        { rootMargin: "-40% 0px -50% 0px" }
    );
    drinksBlocks.forEach((block) => observer.observe(block));

    // Default view on load
    showCategory("drinks");


    const backToTopBtn = document.getElementById("back-to-top");

if (backToTopBtn) {
    window.addEventListener("scroll", () => {
        backToTopBtn.classList.toggle("show", window.scrollY > 400);
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
});