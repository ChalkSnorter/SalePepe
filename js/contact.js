document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".dish-slide");
    const dotsContainer = document.querySelector(".dish-dots");

    let current = 0;

    dotsContainer.innerHTML = "";

    slides.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.classList.add("dish-dot");

        if (index === 0) dot.classList.add("active");

        dot.addEventListener("click", () => {
            slides[current].classList.remove("active");
            dots[current].classList.remove("active");

            current = index;

            slides[current].classList.add("active");
            dots[current].classList.add("active");
        });

        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dish-dot");

    if (slides.length > 0) {
        setInterval(() => {
            slides[current].classList.remove("active");
            dots[current].classList.remove("active");

            current = (current + 1) % slides.length;

            slides[current].classList.add("active");
            dots[current].classList.add("active");
        }, 4000);
    }
});

document.getElementById("contact-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);

    await fetch("https://formspree.io/f/mykblopr", {
        method: "POST",
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    });

    form.reset();

    // redirect to homepage
    window.location.href = "index.html";
});