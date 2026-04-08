const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function setupMobileNav() {
  const toggle = $("[data-nav-toggle]");
  const links = $("[data-nav-links]");
  if (!toggle || !links) return;

  const setOpen = (open) => {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(!links.classList.contains("is-open")));

  links.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    setOpen(false);
  });
}

function setupHeaderShadow() {
  const header = $("[data-header]");
  if (!header) return;

  const onScroll = () => {
    header.style.boxShadow =
      window.scrollY > 6 ? "0 1px 0 rgba(0,0,0,0.06)" : "none";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function setupRevealOnScroll() {
  const items = $$(".reveal");
  if (!items.length) return;

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReduced) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => io.observe(el));
}

function setupPlaceholderLinks() {
  $$("[data-placeholder-link]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      alert("This is a placeholder link. Replace it with your URL in index.html.");
    });
  });
}

setupMobileNav();
setupHeaderShadow();
setupRevealOnScroll();
setupPlaceholderLinks();
