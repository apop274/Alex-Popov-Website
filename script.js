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

  // Close on link click (mobile)
  links.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    setOpen(false);
  });

  // Close on escape
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
      window.scrollY > 8 ? "0 10px 30px rgba(0,0,0,0.35)" : "none";
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
    { threshold: 0.12 }
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

function setupIpBadge() {
  const badge = document.querySelector("[data-ip-badge]");
  const valueEl = document.querySelector("[data-ip-value]");
  const revealBtn = document.querySelector("[data-ip-reveal]");
  if (!badge || !valueEl || !revealBtn) return;

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReduced) {
    badge.style.display = "none";
    return;
  }

  const fmt = (label, ip) => `${label}: ${ip}`;

  // Try to show a LAN/local IP (may be unavailable on modern browsers).
  const getLocalIp = async () => {
    try {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel("x");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const ips = new Set();
      const ipRegex =
        /([0-9]{1,3}(?:\.[0-9]{1,3}){3})|([a-f0-9]{0,4}(?::[a-f0-9]{0,4}){2,7})/gi;

      await new Promise((resolve) => {
        const t = setTimeout(resolve, 850);
        pc.onicecandidate = (e) => {
          const cand = e?.candidate?.candidate;
          if (!cand) return;
          const matches = cand.match(ipRegex) || [];
          matches.forEach((m) => ips.add(m));
          // resolve early if we found a private IPv4
          if ([...ips].some((ip) => /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])\./.test(ip))) {
            clearTimeout(t);
            resolve();
          }
        };
      });

      pc.close();

      const localV4 = [...ips].find((ip) =>
        /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
      );

      return localV4 || null;
    } catch {
      return null;
    }
  };

  // Public IP requires calling an external service.
  const getPublicIp = async () => {
    const res = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
    if (!res.ok) throw new Error("ipify failed");
    const data = await res.json();
    return data?.ip || null;
  };

  (async () => {
    const local = await getLocalIp();
    valueEl.textContent = local ? fmt("Local", local) : "Local: unavailable";
  })();

  revealBtn.addEventListener("click", async () => {
    revealBtn.disabled = true;
    const prior = valueEl.textContent;
    valueEl.textContent = "Public: loading…";
    try {
      const ip = await getPublicIp();
      valueEl.textContent = ip ? fmt("Public", ip) : "Public: unavailable";
    } catch {
      valueEl.textContent = "Public: blocked";
      setTimeout(() => {
        valueEl.textContent = prior;
      }, 1500);
    } finally {
      revealBtn.disabled = false;
    }
  });
}

function setupScrollFX() {
  const bar = document.querySelector("[data-scroll-progress]");

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const bg = document.querySelector(".bg-orbs");

  const onScroll = () => {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / max));

    if (bar) bar.style.width = `${p * 100}%`;
    if (!prefersReduced && bg) bg.style.setProperty("--p", String(p));
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
}

setupMobileNav();
setupHeaderShadow();
setupRevealOnScroll();
setupPlaceholderLinks();
setupIpBadge();
setupScrollFX();

