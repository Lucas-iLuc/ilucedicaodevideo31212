(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animatedItems = document.querySelectorAll(
    '.luc-benefit, .luc-video-card, .luc-price-card, .luc-negotiation, .luc-contact'
  );

  if (reduceMotion || !('IntersectionObserver' in window)) {
    animatedItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    animatedItems.forEach((item, index) => {
      item.classList.add('luc-reveal');
      item.style.setProperty('--luc-reveal-delay', `${(index % 3) * 80}ms`);
      revealObserver.observe(item);
    });
  }

  const progressBar = document.querySelector('.luc-progress span');
  let progressQueued = false;
  const updateProgress = () => {
    if (!progressBar || progressQueued) return;
    progressQueued = true;
    window.requestAnimationFrame(() => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, amount))})`;
      progressQueued = false;
    });
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  const navLinks = [...document.querySelectorAll('.luc-nav a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-24% 0px -62% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }
})();
