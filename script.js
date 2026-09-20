const menuButton = document.querySelector(".menu-button");
const primaryNav = document.querySelector("#primary-nav");
const imageDialog = document.querySelector("[data-image-dialog]");
const dialogImage = imageDialog.querySelector("img");
const dialogCaption = imageDialog.querySelector("p");

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  primaryNav.classList.toggle("is-open", !open);
  document.body.classList.toggle("menu-open", !open);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  });
});

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    const source = button.dataset.lightbox;
    const image = button.querySelector("img");
    dialogImage.src = source;
    dialogImage.alt = image?.alt || "";
    dialogCaption.textContent = button.dataset.caption || "";
    imageDialog.showModal();
  });
});

document.querySelector("[data-close-image]").addEventListener("click", () => imageDialog.close());
imageDialog.addEventListener("click", (event) => {
  if (event.target === imageDialog) imageDialog.close();
});

const navLinks = [...primaryNav.querySelectorAll("a")];
const observedSections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver((entries) => {
  const active = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!active) return;
  navLinks.forEach((link) => link.classList.toggle("is-active", link.hash === `#${active.target.id}`));
}, { rootMargin: "-35% 0px -55%", threshold: [0, .2, .5] });

observedSections.forEach((section) => sectionObserver.observe(section));
document.querySelector("[data-year]").textContent = new Date().getFullYear();
