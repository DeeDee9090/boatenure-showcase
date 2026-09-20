const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const workspaceTitles = {
  analyser: "Deal Analyser",
  area: "Area Intelligence",
  clause: "ClauseCheck",
  renovation: "Renovation Planner",
};

const calculatorData = {
  brrr: {
    count: "01 / 06",
    kicker: "BUY · REFURBISH · REFINANCE · RENT",
    title: "BRRR calculator",
    copy: "Model refurbishment, post-works value, refinance proceeds, capital left in and the return on retained cash.",
    path: "brrr",
    metrics: [["Capital recycled", "£72,400"], ["Cash left in", "£18,650"], ["Return on cash", "21.8%"]],
  },
  hmo: {
    count: "02 / 06",
    kicker: "ROOM-BY-ROOM PERFORMANCE",
    title: "HMO calculator",
    copy: "Build income by room, allow for occupancy and utilities, then assess licensing, management and operating costs.",
    path: "hmo",
    metrics: [["Gross monthly rent", "£4,150"], ["Operating costs", "£1,240"], ["Net yield", "9.4%"]],
  },
  sa: {
    count: "03 / 06",
    kicker: "NIGHTLY RATE · OCCUPANCY · COSTS",
    title: "Serviced accommodation",
    copy: "Stress-test nightly rates and occupancy against cleaning, platform fees, utilities, management and seasonality.",
    path: "serviced-accommodation",
    metrics: [["Occupancy", "68%"], ["Average nightly rate", "£142"], ["Monthly net", "£1,675"]],
  },
  split: {
    count: "04 / 06",
    kicker: "VALUE CREATION THROUGH SEPARATION",
    title: "Title split calculator",
    copy: "Compare acquisition and works costs against the combined end value of separately titled units.",
    path: "title-split",
    metrics: [["Combined GDV", "£615k"], ["Project cost", "£481k"], ["Profit on cost", "27.9%"]],
  },
  lease: {
    count: "05 / 06",
    kicker: "LEASE EXTENSION & MARRIAGE VALUE",
    title: "Short lease calculator",
    copy: "Estimate lease-extension cost, fees, post-extension value and the potential value unlocked by the transaction.",
    path: "short-lease",
    metrics: [["Lease remaining", "72 yrs"], ["Extension estimate", "£31,500"], ["Potential uplift", "£54,000"]],
  },
  commercial: {
    count: "06 / 06",
    kicker: "CONVERSION FEASIBILITY",
    title: "Commercial-to-residential",
    copy: "Model acquisition, planning and build costs against residential GDV, finance, contingency and target margin.",
    path: "commercial-to-resi",
    metrics: [["Residential GDV", "£920k"], ["Total project cost", "£731k"], ["Profit on cost", "25.9%"]],
  },
};

function setRangeProgress(input) {
  const progress = ((input.value - input.min) / (input.max - input.min)) * 100;
  input.style.setProperty("--range-progress", `${progress}%`);
}

function updateAnalysis() {
  const purchase = Number(document.querySelector("#purchase-price").value);
  const rent = Number(document.querySelector("#monthly-rent").value);
  const depositRate = Number(document.querySelector("#deposit").value) / 100;
  const mortgage = purchase * (1 - depositRate);
  const annualRent = rent * 12;
  const grossYield = (annualRent / purchase) * 100;
  const annualInterest = mortgage * 0.0525;
  const operatingCosts = annualRent * 0.1 + 1200;
  const preTaxProfit = Math.max(annualRent - annualInterest - operatingCosts, 0);
  const companyTax = preTaxProfit * 0.19;
  const companyMonthly = (preTaxProfit - companyTax) / 12;
  const personalTaxableProfit = Math.max(annualRent - operatingCosts, 0);
  const personalTax = Math.max(personalTaxableProfit * 0.4 - annualInterest * 0.2, 0);
  const personalMonthly = (preTaxProfit - personalTax) / 12;
  const estimatedSdlt = purchase <= 125000
    ? purchase * 0.05
    : 6250 + Math.max(Math.min(purchase, 250000) - 125000, 0) * 0.07
      + Math.max(purchase - 250000, 0) * 0.10;
  const cashInvested = purchase * depositRate + estimatedSdlt;
  const score = Math.max(32, Math.min(94, Math.round(45 + (grossYield - 4) * 7 + (companyMonthly > 0 ? 8 : -8))));

  document.querySelector("#purchase-output").textContent = currency.format(purchase);
  document.querySelector("#rent-output").textContent = currency.format(rent);
  document.querySelector("#deposit-output").textContent = `${Math.round(depositRate * 100)}%`;
  document.querySelector("[data-gross-yield]").textContent = `${grossYield.toFixed(2)}%`;
  document.querySelector("[data-cash-flow]").textContent = currency.format(companyMonthly);
  document.querySelector("[data-cash-invested]").textContent = currency.format(cashInvested);
  document.querySelector("[data-tax-difference]").textContent = `+${currency.format(Math.max(companyMonthly - personalMonthly, 0))} / month`;
  document.querySelector("[data-score]").textContent = score;
  document.querySelector("[data-score-bar]").style.width = `${score}%`;

  const verdict = score >= 80
    ? ["Strong potential", "Attractive headline returns. Validate the assumptions, condition and local evidence before proceeding."]
    : score >= 65
      ? ["Promising deal", "Healthy yield with positive after-tax cash flow. Review local rental demand before proceeding."]
      : score >= 50
        ? ["Proceed with care", "The margin is workable but sensitive. Test rates, voids and maintenance before committing."]
        : ["Returns are tight", "Current assumptions leave limited headroom. Consider price, rent or finance changes."];
  document.querySelector("[data-verdict]").textContent = verdict[0];
  document.querySelector("[data-verdict-copy]").textContent = verdict[1];
}

function selectWorkspace(button) {
  document.querySelectorAll(".workspace-tab").forEach((tab) => {
    const selected = tab === button;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", selected);
  });
  document.querySelectorAll(".workspace-panel").forEach((panel) => {
    const selected = panel.id === `panel-${button.dataset.workspace}`;
    panel.hidden = !selected;
    panel.classList.toggle("is-active", selected);
  });
  document.querySelector("[data-workspace-title]").textContent = workspaceTitles[button.dataset.workspace];
}

function selectCalculator(button) {
  const item = calculatorData[button.dataset.calculator];
  document.querySelectorAll(".calculator-chip").forEach((chip) => {
    const selected = chip === button;
    chip.classList.toggle("is-active", selected);
    chip.setAttribute("aria-selected", selected);
  });
  document.querySelector("[data-calculator-count]").textContent = item.count;
  document.querySelector("[data-calculator-kicker]").textContent = item.kicker;
  document.querySelector("[data-calculator-title]").textContent = item.title;
  document.querySelector("[data-calculator-copy]").textContent = item.copy;
  document.querySelector("[data-calculator-link]").href = `https://app.dbpropertiesinvestments.co.uk/calculator/${item.path}`;
  item.metrics.forEach(([label, value], index) => {
    const name = ["one", "two", "three"][index];
    document.querySelector(`[data-metric-${name}-label]`).textContent = label;
    document.querySelector(`[data-metric-${name}]`).textContent = value;
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  });
});

document.querySelectorAll(".workspace-tab").forEach((button) => {
  button.addEventListener("click", () => selectWorkspace(button));
});

document.querySelectorAll(".calculator-chip").forEach((button) => {
  button.addEventListener("click", () => selectCalculator(button));
});

document.querySelectorAll('input[type="range"]').forEach((input) => {
  setRangeProgress(input);
  input.addEventListener("input", () => {
    setRangeProgress(input);
    updateAnalysis();
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...navigation.querySelectorAll("a")];
const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
  });
}, { rootMargin: "-35% 0px -55%", threshold: [0, .25, .5] });
sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener("scroll", () => {
  document.querySelector("[data-header]").classList.toggle("is-scrolled", window.scrollY > 20);
}, { passive: true });

document.querySelector("[data-year]").textContent = new Date().getFullYear();
updateAnalysis();
