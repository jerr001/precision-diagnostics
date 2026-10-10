const tests = [
  {name:"Full Blood Count", category:"Blood Tests", sample:"Blood sample", description:"A common blood investigation that measures several components of blood.", prep:"Preparation requirements may vary. Please contact the laboratory for specific instructions.", turnaround:"Typical turnaround varies by test."},
  {name:"Lipid Profile", category:"Wellness", sample:"Blood sample", description:"A laboratory assessment of selected blood lipids.", prep:"Preparation requirements may vary. Confirm instructions with the laboratory.", turnaround:"Typical turnaround varies by test."},
  {name:"Fasting Blood Glucose", category:"Blood Tests", sample:"Blood sample", description:"A blood glucose investigation commonly used in health assessment.", prep:"Preparation requirements may vary. Confirm specific instructions before your appointment.", turnaround:"Typical turnaround varies by test."},
  {name:"HbA1c", category:"Blood Tests", sample:"Blood sample", description:"A laboratory measurement related to longer-term blood glucose levels.", prep:"Preparation requirements may vary. Contact the laboratory for instructions.", turnaround:"Typical turnaround varies by test."},
  {name:"Malaria Test", category:"Infection Screening", sample:"Blood sample", description:"Laboratory testing that can support investigation for malaria infection.", prep:"Preparation requirements may vary. Please contact the laboratory.", turnaround:"Typical turnaround varies by test."},
  {name:"Thyroid Function Test", category:"Hormonal Tests", sample:"Blood sample", description:"Selected laboratory measurements related to thyroid function.", prep:"Preparation requirements may vary. Confirm with the laboratory team.", turnaround:"Typical turnaround varies by test."},
  {name:"Liver Function Test", category:"Wellness", sample:"Blood sample", description:"A group of laboratory measurements used in the assessment of liver-related health.", prep:"Preparation requirements vary by the requested panel.", turnaround:"Typical turnaround varies by test."},
  {name:"Kidney Function Test", category:"Wellness", sample:"Blood sample", description:"Selected laboratory measurements supporting assessment of kidney-related health.", prep:"Preparation requirements may vary. Confirm with the laboratory.", turnaround:"Typical turnaround varies by test."},
  {name:"Vitamin D", category:"Wellness", sample:"Blood sample", description:"A laboratory measurement of vitamin D status.", prep:"Preparation requirements may vary. Contact the laboratory for specific instructions.", turnaround:"Typical turnaround varies by test."},
  {name:"Hepatitis Screening", category:"Infection Screening", sample:"Blood sample", description:"Laboratory screening for selected hepatitis markers.", prep:"Preparation requirements may vary. Confirm with the laboratory.", turnaround:"Typical turnaround varies by test."},
  {name:"Pregnancy Test", category:"Women's Health", sample:"Urine or blood sample", description:"Laboratory testing for pregnancy-related markers.", prep:"Sample requirements depend on the selected test.", turnaround:"Typical turnaround varies by test."},
  {name:"PSA", category:"Men's Health", sample:"Blood sample", description:"A laboratory measurement used as part of selected prostate health assessments.", prep:"Preparation requirements may vary. Confirm with the laboratory.", turnaround:"Typical turnaround varies by test."},
  {name:"Pre-employment Screening", category:"Corporate Screening", sample:"Varies by package", description:"A configurable screening service for organizational onboarding processes.", prep:"Requirements vary by employer and package.", turnaround:"Typical turnaround varies by service."},
  {name:"Executive Wellness Panel", category:"Corporate Screening", sample:"Varies by package", description:"A demonstration corporate screening option for organizational enquiries.", prep:"Requirements vary by package.", turnaround:"Typical turnaround varies by service."}
];

const articles = [
  {category:"LABORATORY", title:"Understanding Your Full Blood Count", body:"A full blood count is a laboratory investigation that reports several measurements related to blood cells. Different components can provide different pieces of information, and interpretation depends on the individual's clinical context. A laboratory result should therefore be discussed with an appropriate healthcare professional rather than interpreted in isolation."},
  {category:"WELLNESS", title:"Why Routine Health Screening Matters", body:"Routine health screening can help people and healthcare professionals keep track of selected health measures and identify when further assessment may be appropriate. The most suitable screening depends on factors such as age, history, symptoms and professional guidance."},
  {category:"PREPARATION", title:"How to Prepare for a Laboratory Test", body:"Preparation requirements vary significantly between laboratory tests. Some tests may have specific timing or sample requirements while others may not. Always confirm the preparation instructions for your particular test with the laboratory team before attending."},
  {category:"RESULTS", title:"Understanding Your Laboratory Results", body:"Laboratory results are best interpreted alongside clinical history, symptoms, examination findings and other investigations when appropriate. A result outside a reference range does not automatically establish a diagnosis, and a healthcare professional can help explain what a result means in context."}
];

const $ = (selector, parent=document) => parent.querySelector(selector);
const $$ = (selector, parent=document) => [...parent.querySelectorAll(selector)];

const header = $("#site-header");
const menuToggle = $(".menu-toggle");
const nav = $("#primary-nav");
const backTop = $("#back-to-top");
const toast = $("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function closeMobileMenu() {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});

$$(".nav-link").forEach(link => link.addEventListener("click", closeMobileMenu));

function onScroll() {
  header.classList.toggle("scrolled", window.scrollY > 10);
  backTop.classList.toggle("visible", window.scrollY > 650);
}
window.addEventListener("scroll", onScroll, {passive:true});
onScroll();

backTop.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

const sectionLinks = $$(".nav-link");
const sections = sectionLinks.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
const observerNav = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      sectionLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, {rootMargin:"-35% 0px -55% 0px"});
sections.forEach(section => observerNav.observe(section));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:.08});
$$(".reveal").forEach(el => revealObserver.observe(el));

const testGrid = $("#test-grid");
const testCount = $("#test-count");
const testSearch = $("#test-search");
const clearSearch = $("#clear-search");
const testEmpty = $("#test-empty");
let selectedCategory = "All";

function renderTests() {
  const query = testSearch.value.trim().toLowerCase();
  const filtered = tests.filter(test => {
    const matchesCategory = selectedCategory === "All" || test.category === selectedCategory;
    const haystack = `${test.name} ${test.category} ${test.description}`.toLowerCase();
    return matchesCategory && haystack.includes(query);
  });

  testGrid.innerHTML = filtered.map((test, index) => `
    <article class="test-card reveal visible">
      <span class="test-category">${test.category}</span>
      <h3>${test.name}</h3>
      <p>${test.description}</p>
      <button class="text-button view-test" type="button" data-index="${tests.indexOf(test)}">View Details →</button>
    </article>
  `).join("");

  testCount.textContent = `Showing ${filtered.length} available test${filtered.length === 1 ? "" : "s"}`;
  testEmpty.classList.toggle("hidden", filtered.length !== 0);
  $$(".view-test").forEach(button => button.addEventListener("click", () => openTestModal(tests[Number(button.dataset.index)])));
}

$$(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    $$(".filter-btn").forEach(btn => btn.classList.toggle("active", btn === button));
    renderTests();
  });
});
testSearch.addEventListener("input", renderTests);
clearSearch.addEventListener("click", () => { testSearch.value = ""; selectedCategory = "All"; $$(".filter-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.category === "All")); renderTests(); testSearch.focus(); });
renderTests();

const testModal = $("#test-modal");
const testModalTitle = $("#test-modal-title");
const testModalBody = $("#test-modal-body");
const modalBook = $("#modal-book");
let lastFocusedElement = null;
let currentTest = null;

function openTestModal(test) {
  currentTest = test;
  lastFocusedElement = document.activeElement;
  testModalTitle.textContent = test.name;
  testModalBody.innerHTML = `
    <div class="modal-detail"><strong>What the test is</strong><span>${test.description}</span></div>
    <div class="modal-detail"><strong>Sample Type</strong><span>${test.sample}</span></div>
    <div class="modal-detail"><strong>Preparation</strong><span>${test.prep}</span></div>
    <div class="modal-detail"><strong>Turnaround</strong><span>${test.turnaround}</span></div>
    <div class="modal-detail"><strong>Important</strong><span>Please confirm preparation requirements with our laboratory team before your appointment.</span></div>
  `;
  testModal.hidden = false;
  document.body.classList.add("modal-open");
  $(".modal-close", testModal).focus();
}

function closeTestModal() {
  testModal.hidden = true;
  document.body.classList.remove("modal-open");
  if (lastFocusedElement) lastFocusedElement.focus();
}
$$("[data-close-modal]").forEach(el => el.addEventListener("click", closeTestModal));
modalBook.addEventListener("click", () => {
  closeTestModal();
  if (currentTest) {
    const select = $('select[name="service"]', $("#booking-form"));
    if ([...select.options].some(option => option.textContent === currentTest.name)) select.value = currentTest.name;
  }
  $("#booking").scrollIntoView({behavior:"smooth"});
});

const articleModal = $("#article-modal");
const articleTitle = $("#article-modal-title");
const articleCategory = $("#article-modal-category");
const articleBody = $("#article-modal-body");

function openArticle(index) {
  const article = articles[index];
  lastFocusedElement = document.activeElement;
  articleCategory.textContent = article.category;
  articleTitle.textContent = article.title;
  articleBody.innerHTML = `<p>${article.body}</p><p>For specific questions about your own health or results, speak with a qualified healthcare professional.</p>`;
  articleModal.hidden = false;
  document.body.classList.add("modal-open");
  $(".modal-close", articleModal).focus();
}
function closeArticle() {
  articleModal.hidden = true;
  document.body.classList.remove("modal-open");
  if (lastFocusedElement) lastFocusedElement.focus();
}
$$("[data-close-article]").forEach(el => el.addEventListener("click", closeArticle));
$$(".article-btn").forEach(button => button.addEventListener("click", () => openArticle(Number(button.dataset.article))));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (!testModal.hidden) closeTestModal();
    if (!articleModal.hidden) closeArticle();
  }
});

function attachDemoForm(form, message, isError=false) {
  const feedback = $(".form-feedback", form);
  feedback.textContent = message;
  feedback.classList.toggle("success", !isError);
  feedback.classList.toggle("error", isError);
}

function demoSubmit(form, successMessage) {
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      attachDemoForm(form, "Please complete the required fields.", true);
      return;
    }
    attachDemoForm(form, successMessage);
    form.reset();
  });
}

demoSubmit($("#home-form"), "Thank you. Your request has been received. Our team will contact you to confirm availability.");
demoSubmit($("#booking-form"), "Thank you. Your appointment request has been received. Our team will contact you to confirm the details.");
demoSubmit($("#contact-form"), "Thank you. Your message has been received. Our team will get back to you.");
$$(".package-btn").forEach(button => button.addEventListener("click", () => {
  const select = $('select[name="subject"]', $("#contact-form"));
  if (select) select.value = "General Enquiry";
  $("#contact-form").scrollIntoView({behavior:"smooth"});
  setTimeout(() => {
    const message = $('textarea[name="message"]', $("#contact-form"));
    message.value = `I would like to enquire about the ${button.dataset.package} package.`;
    message.focus();
  }, 500);
}));

$("#results-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const message = $("#portal-message");
  message.className = "portal-message success";
  message.textContent = "For this demonstration, the results portal is not connected to a live laboratory information system.";
});

let testimonialIndex = 0;
const track = $("#testimonial-track");
const dots = $("#carousel-dots");
const totalTestimonials = $$(".testimonial", track).length;
for (let i=0;i<totalTestimonials;i++) {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Show testimonial ${i+1}`);
  dot.addEventListener("click", () => setTestimonial(i));
  dots.appendChild(dot);
}
function setTestimonial(index) {
  testimonialIndex = (index + totalTestimonials) % totalTestimonials;
  track.style.transform = `translateX(-${testimonialIndex * 100}%)`;
  $$("#carousel-dots button").forEach((dot, i) => dot.classList.toggle("active", i === testimonialIndex));
}
$("#prev-testimonial").addEventListener("click", () => setTestimonial(testimonialIndex - 1));
$("#next-testimonial").addEventListener("click", () => setTestimonial(testimonialIndex + 1));
setTestimonial(0);

document.querySelectorAll("a[href^='#']").forEach(anchor => {
  anchor.addEventListener("click", event => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({behavior:"smooth", block:"start"});
  });
});
