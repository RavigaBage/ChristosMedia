// Header shadow on scroll
const header = document.getElementById('site-header');
const onScroll = () => {
  if(header) header.classList.toggle('scrolled', window.scrollY > 8);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav: lock background scroll while open, close on link click
const navToggle = document.getElementById('nav-toggle');
if (navToggle) {
  navToggle.addEventListener('change', ()=>{
    document.body.style.overflow = navToggle.checked ? 'hidden' : '';
  });
  document.querySelectorAll('.primary-nav a').forEach(a=>{
    a.addEventListener('click', ()=> {
      navToggle.checked = false;
      document.body.style.overflow = '';
    });
  });
}

// Reveal on scroll
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');
if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('in-view'));
} else if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

// Footer year
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Animated Counters
const counters = document.querySelectorAll('.counter');
if (counters.length > 0) {
  const animateCounter = (counter) => {
    if (reduceMotion) {
      counter.innerText = Number(counter.getAttribute('data-target')).toLocaleString();
      return;
    }
    const target = +counter.getAttribute('data-target');
    const duration = 2000;
    const startTime = performance.now();
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuart)
      const ease = 1 - Math.pow(1 - progress, 4);
      
      const current = Math.floor(target * ease);
      counter.innerText = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.innerText = target.toLocaleString();
      }
    };
    requestAnimationFrame(update);
  };

  if ('IntersectionObserver' in window && !reduceMotion) {
    const counterIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    counters.forEach(counter => counterIo.observe(counter));
  } else {
    counters.forEach(counter => animateCounter(counter));
  }
}

