document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("cookie-popup");
    const acceptBtn = document.getElementById("cookie-accept");
    const declineBtn = document.getElementById("cookie-decline");

    const consent = localStorage.getItem("fb-consent");

    if (!consent) {
        popup.style.display = "flex";
    } else {
        popup.style.display = "none";

        if (consent === "accepted") {
            loadFacebookEmbed();
        }
    }

    acceptBtn.addEventListener("click", () => {
        localStorage.setItem("fb-consent", "accepted");
        popup.style.display = "none";
        loadFacebookEmbed();
    });

    declineBtn.addEventListener("click", () => {
        localStorage.setItem("fb-consent", "declined");
        popup.style.display = "none";
    });
});

window.addEventListener("scroll", () => {
    const nav = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("mobile-menu-toggle");
    const closeBtn = document.getElementById("mobile-menu-close");
    const sidebar = document.getElementById("mobile-sidebar");
    const overlay = document.getElementById("mobile-sidebar-overlay");
    const currentLangBtn = document.getElementById("mobile-lang-current");

    function openSidebar() {
        sidebar.classList.add("open");
        overlay.classList.add("show");
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
    }

    if (toggle) toggle.addEventListener("click", openSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);

    const savedLanguage = localStorage.getItem("siteLanguage") || "it";

    if (currentLangBtn) {
        currentLangBtn.textContent = savedLanguage === "nl-BE" ? "NL" : savedLanguage.toUpperCase();
        currentLangBtn.classList.add("active");
    }

    document.querySelectorAll(".mobile-sidebar-languages button").forEach((button) => {
        const lang = button.getAttribute("data-lang");

        if (lang === savedLanguage) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            localStorage.setItem("siteLanguage", lang);

            if (typeof applyTranslations === "function") {
                applyTranslations(lang);
            }

            if (currentLangBtn) {
                currentLangBtn.textContent = lang === "nl-BE" ? "NL" : lang.toUpperCase();
            }

            document.querySelectorAll(".mobile-sidebar-languages button").forEach((btn) => {
                btn.classList.remove("active");
            });

            button.classList.add("active");
            closeSidebar();
        });
    });
});

const langToggle = document.getElementById("mobile-lang-toggle");
const langMenu = document.getElementById("mobile-lang-menu");
const langCurrent = document.getElementById("mobile-lang-current");

if (langToggle) {
    langToggle.addEventListener("click", () => {
        langMenu.classList.toggle("show");
    });
}

document.querySelectorAll(".mobile-lang-menu button").forEach(btn => {
    btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");

        applyTranslations(lang);

        // Update visible label
        langCurrent.textContent = btn.textContent;

        // Close dropdown
        langMenu.classList.remove("show");
    });
});

const fbBtn = document.getElementById("accept-fb");

if (fbBtn) {
    fbBtn.addEventListener("click", () => {

        // Save consent
        localStorage.setItem("fb-consent", "true");

        loadFacebook();
    });
}

function loadFacebookEmbed() {
    const placeholder = document.getElementById("facebook-placeholder");
    if (!placeholder) return;

    placeholder.innerHTML = `
        <div id="fb-root"></div>
        <div class="fb-page"
            data-href="https://www.facebook.com/salepepebruges"
            data-tabs="timeline"
            data-width="500"
            data-height="760"
            data-adapt-container-width="true">
        </div>
    `;

    if (!document.getElementById("facebook-sdk")) {
        const script = document.createElement("script");
        script.id = "facebook-sdk";
        script.async = true;
        script.defer = true;
        script.crossOrigin = "anonymous";
        script.src = "https://connect.facebook.net/nl_NL/sdk.js#xfbml=1&version=v25.0";
        document.body.appendChild(script);
    } else if (window.FB && window.FB.XFBML) {
        window.FB.XFBML.parse();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("cookie-popup");
    const acceptBtn = document.getElementById("cookie-accept");
    const declineBtn = document.getElementById("cookie-decline");

    const fbConsent = localStorage.getItem("fb-consent");

    if (fbConsent === "accepted") {
        loadFacebookEmbed();
        if (popup) popup.style.display = "none";
    } else if (fbConsent === "declined") {
        if (popup) popup.style.display = "none";
    } else {
        if (popup) popup.style.display = "flex";
    }

    if (acceptBtn) {
        acceptBtn.addEventListener("click", () => {
            localStorage.setItem("fb-consent", "accepted");
            loadFacebookEmbed();
            popup.style.display = "none";
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener("click", () => {
            localStorage.setItem("fb-consent", "declined");
            popup.style.display = "none";
        });
    }
});

function setupFacebookFallbackButton() {
    const btn = document.getElementById("fb-enable-btn");

    if (btn) {
        btn.addEventListener("click", () => {
            localStorage.setItem("fb-consent", "accepted");
            loadFacebookEmbed();
        });
    }
}
