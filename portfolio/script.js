// Mobile nav toggle
const navToggle = document.querySelector('.nav__toggle');
const navList = document.querySelector('.nav__list');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Intersection Observer for reveal animations
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const delay = parseFloat(entry.target.getAttribute('data-delay') || '0');
      if (delay) entry.target.style.transitionDelay = `${delay}s`;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  }
}, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });

revealEls.forEach(el => io.observe(el));

// Animate skill bars based on data-level attribute
function animateSkillBars() {
  const skillItems = document.querySelectorAll('.skills li');
  skillItems.forEach((li) => {
    const level = parseInt(li.getAttribute('data-level') || '0', 10);
    const bar = document.createElement('div');
    bar.style.position = 'absolute';
    bar.style.left = '0';
    bar.style.bottom = '0';
    bar.style.height = '4px';
    bar.style.width = '0%';
    bar.style.background = 'linear-gradient(90deg, var(--accent), var(--accent-2))';
    bar.style.transition = 'width 900ms ease';
    li.appendChild(bar);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          bar.style.width = `${Math.max(0, Math.min(100, level))}%`;
          li.classList.add('is-visible');
          observer.unobserve(li);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(li);
  });
}
animateSkillBars();

// Parallax subtle effect for hero background
const heroBg = document.querySelector('.hero__bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.15;
    heroBg.style.transform = `translateY(${y}px)`;
  }, { passive: true });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile menu after navigation
      if (navList && navList.classList.contains('is-open')) {
        navList.classList.remove('is-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Scroll progress bar
const progressBar = document.querySelector('.scroll-progress__bar');
if (progressBar) {
  const update = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// Enhanced 3D tilt interaction for project cards
document.querySelectorAll('.project-card[data-tilt]').forEach(card => {
  const strength = 12; // degrees
  let isHovering = false;
  
  function onMove(e) {
    if (!isHovering) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1
    const rx = (0.5 - y) * strength;
    const ry = (x - 0.5) * strength;
    const rz = (x - 0.5) * 2; // slight Z rotation
    card.style.transform = `translateY(-8px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
  }
  
  function onEnter() { 
    isHovering = true; 
    card.style.transition = 'none';
  }
  
  function onLeave() { 
    isHovering = false; 
    card.style.transition = 'all .3s cubic-bezier(0.4, 0, 0.2, 1)';
    card.style.transform = 'translateY(-8px) rotateX(5deg) rotateY(5deg)';
  }
  
  card.addEventListener('mouseenter', onEnter);
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', onLeave);
  card.addEventListener('touchmove', (e) => {
    if (!e.touches[0]) return; 
    onMove(e.touches[0]);
  }, { passive: true });
  card.addEventListener('touchend', onLeave);
});

// 3D floating animation for skills
document.querySelectorAll('.skills li').forEach((skill, index) => {
  skill.style.animationDelay = `${index * 0.1}s`;
});

// 3D floating animation for cards
document.querySelectorAll('.card').forEach((card, index) => {
  card.style.animationDelay = `${index * 0.2}s`;
});


