(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  const body = document.body;
  const menuTrigger = document.querySelector("[data-menu-trigger]");
  const menuClose = document.querySelector("[data-menu-close]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const mobileBackdrop = document.querySelector("[data-menu-backdrop]");

  const closeMenu = () => {
    if (!menuTrigger || !mobileMenu || !mobileBackdrop) return;
    menuTrigger.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
    mobileBackdrop.hidden = true;
    body.classList.remove("menu-open");
  };

  const openMenu = () => {
    if (!menuTrigger || !mobileMenu || !mobileBackdrop) return;
    menuTrigger.setAttribute("aria-expanded", "true");
    mobileMenu.hidden = false;
    mobileBackdrop.hidden = false;
    body.classList.add("menu-open");
    const firstLink = mobileMenu.querySelector("a");
    if (firstLink) firstLink.focus();
  };

  if (menuTrigger && mobileMenu && mobileBackdrop) {
    menuTrigger.addEventListener("click", () => {
      const expanded = menuTrigger.getAttribute("aria-expanded") === "true";
      if (expanded) closeMenu();
      else openMenu();
    });

    mobileBackdrop.addEventListener("click", closeMenu);
    menuClose?.addEventListener("click", closeMenu);
    mobileMenu.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 767) closeMenu();
    });
  }

  document.querySelectorAll("[data-placeholder-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const message = link.closest("section, div")?.querySelector("[data-placeholder-message]");
      if (message) {
        message.hidden = false;
        message.textContent = "External ordering destination not supplied. This is a static preview only.";
      }
    });
  });

  document.querySelectorAll("[data-menu-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll("[data-menu-tab]").forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      const target = document.getElementById(tab.dataset.menuTab);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll("[data-add-order]").forEach((button) => {
    button.addEventListener("click", () => {
      button.textContent = "Added to Preview";
      button.setAttribute("aria-pressed", "true");
    });
  });

  const siteHeader = document.querySelector(".site-header");
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll("[data-hero-slideshow]").forEach((slideshow) => {
    const slides = Array.from(slideshow.querySelectorAll(".hero__slide"));
    if (slides.length < 2) return;

    const interval = Number(slideshow.dataset.heroInterval) || 7000;
    let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    let slideshowTimer = null;
    let isTransitioning = false;

    slides.forEach((slide) => {
      slide.style.setProperty("--hero-slide-zoom-duration", `${interval}ms`);
    });

    const getImageUrl = (slide) => {
      const source = slide.dataset.heroImage;
      return source ? new URL(source, window.location.href).href : "";
    };

    const preloadSlide = (index) => {
      const slide = slides[index];
      const source = getImageUrl(slide);
      if (!slide || !source || slide.dataset.heroPreloaded === "true") return;

      slide.style.backgroundImage = `url("${source}")`;
      const image = new Image();
      image.decoding = "async";
      image.src = source;
      image.decode?.().catch(() => {});
      slide.dataset.heroPreloaded = "true";
    };

    const advanceSlide = () => {
      if (motionPreference.matches || isTransitioning) return;

      const nextIndex = (activeIndex + 1) % slides.length;
      isTransitioning = true;
      preloadSlide(nextIndex);
      slides[activeIndex].classList.remove("is-active");
      slides[nextIndex].classList.add("is-active");
      activeIndex = nextIndex;
      preloadSlide((activeIndex + 1) % slides.length);

      window.setTimeout(() => {
        isTransitioning = false;
      }, 1900);
    };

    const stopSlideshow = () => {
      if (slideshowTimer) window.clearInterval(slideshowTimer);
      slideshowTimer = null;
    };

    const startSlideshow = () => {
      stopSlideshow();
      if (motionPreference.matches || document.hidden) return;
      slideshowTimer = window.setInterval(advanceSlide, interval);
    };

    preloadSlide(activeIndex);
    preloadSlide((activeIndex + 1) % slides.length);
    startSlideshow();
    motionPreference.addEventListener?.("change", startSlideshow);
    document.addEventListener("visibilitychange", startSlideshow);
  });

  const revealSelector = [
    ".hero__content",
    ".subpage-hero__content",
    ".intro-home__copy",
    ".featured-home__mark",
    ".featured-home__heading",
    ".dish-card",
    ".category-card",
    ".spotlight-home__image",
    ".spotlight-home__content",
    ".heritage-home",
    ".testimonial-card",
    ".location-home__content",
    ".location-home .map-mock",
    ".photo-cta__content",
    ".split-section__content",
    ".split-section__media",
    ".value-card",
    ".chef-feature__content",
    ".chef-feature__media",
    ".gallery-grid__item",
    ".menu-intro",
    ".menu-notice",
    ".spice-scale",
    ".menu-tabs",
    ".menu-item",
    ".stir-fried-section__intro",
    ".stir-fried-item",
    ".pricing-guide",
    ".accordion",
    ".menu-cta",
    ".reservation-intro",
    ".reservation-form-card",
    ".reservation-confirm",
    ".arrival-notes",
    ".reservation-cta .content-container",
    ".contact-info .section-heading",
    ".contact-detail",
    ".map-section .map-mock",
    ".map-section__actions",
    ".contact-form-card",
    ".order-setup .section-heading",
    ".order-mode",
    ".order-location",
    ".order-featured .section-heading",
    ".order-dish",
    ".order-checkout__copy",
    ".order-checkout__art",
    ".order-state",
    ".site-footer__brand",
    ".site-footer__links > div",
    ".page-home .reveal"
  ].join(",");

  const revealTargets = Array.from(document.querySelectorAll(revealSelector)).filter((element) => !element.closest(".reveal") || element.classList.contains("reveal"));
  const staggerSelectors = [
    ".dish-grid",
    ".category-grid",
    ".testimonial-grid",
    ".value-grid",
    ".gallery-grid",
    ".menu-grid",
    ".stir-fried-section__items",
    ".order-mode-grid",
    ".order-dish-grid",
    ".order-states",
    ".contact-info__grid"
  ].join(",");

  revealTargets.forEach((element) => element.classList.add("reveal"));
  document.querySelectorAll(staggerSelectors).forEach((group) => {
    group.classList.add("reveal-stagger");
    Array.from(group.children).forEach((child, index) => {
      if (child.classList.contains("reveal")) child.style.setProperty("--reveal-index", index);
    });
  });

  const showAllRevealTargets = () => revealTargets.forEach((element) => element.classList.add("is-visible"));

  let revealObserver = null;
  const observeRevealTargets = () => {
    if (!("IntersectionObserver" in window)) {
      showAllRevealTargets();
      return;
    }

    revealObserver?.disconnect();
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealTargets.forEach((element) => {
      if (!element.classList.contains("is-visible")) revealObserver.observe(element);
    });
  };

  if (motionPreference.matches || !("IntersectionObserver" in window)) {
    showAllRevealTargets();
  } else {
    observeRevealTargets();
  }

  const updateHeaderState = () => {
    if (siteHeader) siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  const parallaxSections = Array.from(document.querySelectorAll(".hero, .photo-cta"));
  const parallaxImages = Array.from(document.querySelectorAll(".spotlight-home__image img, .chef-feature__media img, .order-checkout__art img"));

  parallaxSections.forEach((element) => element.setAttribute("data-parallax", ""));
  parallaxImages.forEach((element) => element.setAttribute("data-parallax-image", ""));

  let parallaxFrame = 0;
  const updateParallax = () => {
    parallaxFrame = 0;
    if (motionPreference.matches) return;

    const viewportCenter = window.innerHeight * 0.5;
    const viewportHeight = Math.max(window.innerHeight, 1);

    parallaxSections.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;
      const progress = (viewportCenter - (rect.top + rect.height * 0.5)) / viewportHeight;
      const offset = Math.max(-34, Math.min(34, progress * 44));
      element.style.setProperty("--parallax-offset", `${offset.toFixed(2)}px`);
    });

    parallaxImages.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;
      const progress = (viewportCenter - (rect.top + rect.height * 0.5)) / viewportHeight;
      const offset = Math.max(-16, Math.min(16, progress * 22));
      element.style.setProperty("--parallax-image-offset", `${offset.toFixed(2)}px`);
    });
  };

  const requestParallaxUpdate = () => {
    if (parallaxFrame) return;
    parallaxFrame = window.requestAnimationFrame(updateParallax);
  };

  requestParallaxUpdate();
  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestParallaxUpdate);

  motionPreference.addEventListener?.("change", () => {
    if (motionPreference.matches) {
      showAllRevealTargets();
      revealObserver?.disconnect();
      revealObserver = null;
      parallaxSections.forEach((element) => element.style.removeProperty("--parallax-offset"));
      parallaxImages.forEach((element) => element.style.removeProperty("--parallax-image-offset"));
    } else {
      revealTargets.forEach((element) => element.classList.remove("is-visible"));
      observeRevealTargets();
      requestParallaxUpdate();
    }
  });
})();
