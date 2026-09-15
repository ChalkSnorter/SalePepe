// menu-loader.js
// Fetches the restaurant menu from a published Google Sheet (CSV) and
// renders it into the empty <div data-menu-section="..."> containers
// in menu.html. No backend required.

// 1. Replace this with your own "Publish to web" CSV link from Google Sheets.
//    File → Share → Publish to web → select the Menu sheet → CSV → Copy link
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8Sm_QuvnstdldLK5PcCKZJ5zngtEEKUrhShP77Xv7G5XLlqEOPPCHA6FJRZbTfWsruvq6MkZTWFtT/pub?output=csv";

// Matches the site's existing language switcher (data-lang="it" | "en" | "nl-BE")
function currentLang() {
  const stored = localStorage.getItem("lang");
  if (stored) return normalizeLang(stored);
  return normalizeLang(document.documentElement.lang || "it");
}

// Sheet columns are name_it / name_en / name_nl — normalize "nl-BE" -> "nl"
function normalizeLang(lang) {
  return lang.toLowerCase().startsWith("nl") ? "nl" : lang.toLowerCase().startsWith("en") ? "en" : "it";
}

function escapeHtml(str = "") {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderMenu(rows) {
  const lang = currentLang();
  const sections = {};

  rows.forEach((row) => {
    if (!row.section) return;
    const key = row.section.trim();
    (sections[key] ??= []).push(row);
  });

  document.querySelectorAll("[data-menu-section]").forEach((container) => {
    const key = container.getAttribute("data-menu-section");
    const items = sections[key] || [];

    if (items.length === 0) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = items
      .map((item) => {
        const name = escapeHtml(item[`name_${lang}`] || item.name_it || "");
        const desc = escapeHtml(item[`desc_${lang}`] || item.desc_it || "");
        const price = escapeHtml((item.price || "").trim());

        return `
      <div class="menu-item">
        <div>
          <h3>${name}</h3>
          ${desc ? `<p>${desc}</p>` : ""}
        </div>
        <span>€${price}</span>
      </div>`;
      })
      .join("");
  });
}

function showError() {
  document.querySelectorAll("[data-menu-section]").forEach((container) => {
    container.innerHTML = `<p class="menu-error">Menu temporarily unavailable. Please call us or check back shortly.</p>`;
  });
}

let cachedRows = null;

async function loadMenu() {
  try {
    const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);
    const csvText = await res.text();

    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    if (parsed.errors && parsed.errors.length) {
      console.warn("CSV parse warnings:", parsed.errors);
    }

    cachedRows = parsed.data;
    renderMenu(cachedRows);
  } catch (err) {
    console.error("Failed to load menu:", err);
    showError();
  }
}

document.addEventListener("DOMContentLoaded", loadMenu);

// Re-render (no re-fetch) instantly when the user clicks a language button.
// This does NOT assume anything about your existing js/language.js — it just
// watches the same [data-lang] buttons your nav already uses, and re-renders
// the menu items in the newly selected language once the row data is cached.
document.querySelectorAll("[data-lang]").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Give language.js a tick to update document.documentElement.lang / localStorage first
    setTimeout(() => {
      if (cachedRows) renderMenu(cachedRows);
    }, 0);
  });
});