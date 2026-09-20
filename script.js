const screens = {
  dashboard: {
    title: "Dashboard",
    description: "Start from a clear product home base that routes each user to the right level of analysis and support.",
    points: ["Quick and full analysis entry points", "Direct access to sourcing, legal review and renovation", "Guided tour, pricing and usage visibility"],
    image: "assets/screens/dashboard.jpg",
    alt: "BoaTenure Dashboard showing the main product entry points and feature groups",
    href: "https://app.dbpropertiesinvestments.co.uk/dashboard",
  },
  deal: {
    title: "Full Deal Analyser",
    description: "Build a complete investment case with visible assumptions, live metrics and a strategy-specific verdict.",
    points: ["Purchase, finance, income, costs, tax and exit", "Personal versus limited-company comparison", "Listing photos, area evidence and PDF reporting"],
    image: "assets/screens/deal-analyser.jpg",
    alt: "BoaTenure Deal Analyser showing a real property example, financial inputs, verdict and metrics",
    href: "https://app.dbpropertiesinvestments.co.uk/deals",
  },
  feed: {
    title: "Deal Feed",
    description: "Define an investment area and criteria, then discover and manage sourced opportunities in one pipeline.",
    points: ["Rightmove, OnTheMarket and Auction House UK scanning", "Map-based search, filters and saved-search alerts", "Price changes, listing checks and follow-up reminders"],
    image: "assets/screens/feed.jpg",
    alt: "BoaTenure Deal Feed with map-based search and sourcing controls",
    href: "https://app.dbpropertiesinvestments.co.uk/sourcing",
  },
  clause: {
    title: "ClauseCheck",
    description: "Turn a multi-document auction legal pack into a structured review with traceable findings and actions.",
    points: ["Priority, attention and information findings", "Source citations, deal fit and cost impact", "Before-you-bid actions, checklist and PDF export"],
    image: "assets/screens/clausecheck.jpg",
    alt: "Real BoaTenure ClauseCheck sample report showing legal-pack findings",
    href: "https://app.dbpropertiesinvestments.co.uk/clausecheck/sample",
  },
  scenarios: {
    title: "Scenario Modelling",
    description: "Understand how returns change when rates, rents, voids, costs and capital growth move away from the base case.",
    points: ["Best, base and worst-case comparison", "Interest-rate and sensitivity analysis", "Monte Carlo ranges and year-by-year projections"],
    image: "assets/screens/scenarios.jpg",
    alt: "BoaTenure Scenario Modelling screen comparing worst, base and best cases",
    href: "https://app.dbpropertiesinvestments.co.uk/scenarios",
  },
  renovation: {
    title: "Renovation Planner",
    description: "Connect physical-property work to the numbers using floorplans, viewing photos and value-uplift estimates.",
    points: ["AI floorplan and room analysis", "Multi-photo condition survey", "Combined scope, cost and post-renovation metrics"],
    image: "assets/screens/renovation.jpg",
    alt: "BoaTenure Renovation Planner with floorplan upload and condition-survey tabs",
    href: "https://app.dbpropertiesinvestments.co.uk/renovation-planner",
  },
  calculators: {
    title: "Specialist Calculators",
    description: "Use a model designed around the structure of the transaction rather than forcing every opportunity into one template.",
    points: ["13 tax, strategy and control-method tools", "Shared, consistent financial logic", "Direct handoff to and from the Deal Analyser"],
    image: "assets/screens/calculators.jpg",
    alt: "BoaTenure Calculators hub showing its grouped property strategy tools",
    href: "https://app.dbpropertiesinvestments.co.uk/calculator",
  },
  areas: {
    title: "Area Research",
    description: "Start with a city or enrich a specific deal with real local market, property, access and risk evidence.",
    points: ["Land Registry-backed price and yield context", "Rent, demographics, schools and transport", "EPC, planning, flood, crime and policy intelligence"],
    image: "assets/screens/areas.jpg",
    alt: "BoaTenure UK Buy-to-Let Areas screen",
    href: "https://app.dbpropertiesinvestments.co.uk/areas",
  },
};

const tourImage = document.querySelector("[data-tour-image]");
const tourTitle = document.querySelector("[data-tour-title]");
const tourDescription = document.querySelector("[data-tour-description]");
const tourPoints = document.querySelector("[data-tour-points]");
const tourLink = document.querySelector("[data-tour-link]");
const screenFrame = document.querySelector(".screen-frame");
const imageDialog = document.querySelector("[data-image-dialog]");

function chooseScreen(button) {
  const screen = screens[button.dataset.screen];
  document.querySelectorAll(".tour-tab").forEach((tab) => {
    const selected = tab === button;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
  screenFrame.classList.add("is-changing");
  const preload = new Image();
  const updateContent = () => {
    tourImage.src = screen.image;
    tourImage.alt = screen.alt;
    tourTitle.textContent = screen.title;
    tourDescription.textContent = screen.description;
    tourPoints.replaceChildren(...screen.points.map((point) => {
      const item = document.createElement("li");
      item.textContent = point;
      return item;
    }));
    tourLink.href = screen.href;
    screenFrame.setAttribute("aria-label", `Enlarge ${screen.title} screenshot`);
    screenFrame.classList.remove("is-changing");
  };
  preload.onload = updateContent;
  preload.onerror = updateContent;
  preload.src = screen.image;
}

document.querySelectorAll(".tour-tab").forEach((button) => {
  button.addEventListener("click", () => chooseScreen(button));
});

screenFrame.addEventListener("click", () => {
  imageDialog.querySelector("img").src = tourImage.src;
  imageDialog.querySelector("img").alt = tourImage.alt;
  imageDialog.querySelector("p").textContent = tourTitle.textContent;
  imageDialog.showModal();
});
document.querySelector("[data-close-image]").addEventListener("click", () => imageDialog.close());
imageDialog.addEventListener("click", (event) => {
  if (event.target === imageDialog) imageDialog.close();
});

const menuButton = document.querySelector(".menu-button");
const primaryNav = document.querySelector("#primary-nav");
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  primaryNav.classList.toggle("is-open", !open);
  document.body.classList.toggle("menu-open", !open);
});
primaryNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuButton.setAttribute("aria-expanded", "false");
  primaryNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}));

const navLinks = [...primaryNav.querySelectorAll("a")];
const observedSections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver((entries) => {
  const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!active) return;
  navLinks.forEach((link) => link.classList.toggle("is-active", link.hash === `#${active.target.id}`));
}, { rootMargin: "-35% 0px -55%", threshold: [0, .2, .5] });
observedSections.forEach((section) => sectionObserver.observe(section));

document.querySelector("[data-year]").textContent = new Date().getFullYear();
