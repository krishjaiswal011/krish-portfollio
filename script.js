/**
 * KRISH KUMAR JAISWAL - PERSONAL PORTFOLIO INTERACTIVE LOGIC
 * High-performance, zero external framework JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initBackgroundCanvas();
  initTypewriter();
  initScrollProgressAndNav();
  initStatsCounters();
  initSkillsFilter();
  initEcgSimulator();
  initAiFocusDemo();
  initProjectModals();
  initResumeModal();
  initContactForm();
  initCopyButtons();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Check stored preference or system preference
  const savedTheme = localStorage.getItem('krish_theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  
  html.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('krish_theme', newTheme);
      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  }
}

/* --------------------------------------------------------------------------
   2. Background Particles & Constellation Canvas
   -------------------------------------------------------------------------- */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 18000), 70);
  const maxDistance = 120;
  
  let mouse = { x: null, y: null };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.8 + 0.8;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.45)' : 'rgba(99, 102, 241, 0.3)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * (isDark ? 0.22 : 0.12);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isDark ? `rgba(6, 182, 212, ${alpha})` : `rgba(79, 70, 229, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   3. Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const roles = [
    'Computer Science & Engineering Student',
    'AI & Behavioral Risk Model Developer',
    'Embedded Biomedical Systems Builder',
    'LeetCode 100-Day Streak Achiever',
    'Competitive Coder (200+ Solved)'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2200; // Pause at end of word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before typing new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   4. Scroll Progress, Navbar Tracking & Mobile Toggle
   -------------------------------------------------------------------------- */
function initScrollProgressAndNav() {
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll handler
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPos = window.scrollY;

    // Progress Bar
    if (progressBar && totalHeight > 0) {
      const progress = (scrollPos / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active link highlighting
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Back to top click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile navigation hamburger toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('open');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   5. Key Stats Counter Animation
   -------------------------------------------------------------------------- */
function initStatsCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          animateCount(el, target);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((num) => observer.observe(num));

  function animateCount(el, target) {
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out expo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeOut * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }
}

/* --------------------------------------------------------------------------
   6. Skills Filtering System
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Live ECG Waveform Simulator
   -------------------------------------------------------------------------- */
function initEcgSimulator() {
  const canvas = document.getElementById('ecg-canvas');
  const liveBpmEl = document.getElementById('live-bpm');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.clientWidth || 380);
  let height = (canvas.height = 120);

  window.addEventListener('resize', () => {
    if (canvas.parentElement) {
      width = canvas.width = canvas.parentElement.clientWidth;
    }
  });

  const points = [];
  const maxPoints = Math.floor(width / 2);
  let step = 0;

  // ECG P-Q-R-S-T mathematical curve generator
  function getEcgY(t) {
    const cycle = t % 65; // cycle length
    const baseline = height / 2;

    if (cycle === 10) return baseline - 8; // P wave
    if (cycle === 12) return baseline;
    if (cycle === 18) return baseline + 6; // Q dip
    if (cycle === 20) return baseline - 45; // R peak
    if (cycle === 23) return baseline + 18; // S dip
    if (cycle === 25) return baseline;
    if (cycle === 34) return baseline - 14; // T wave
    if (cycle === 38) return baseline;
    return baseline + (Math.random() - 0.5) * 1.5; // slight physiological noise
  }

  // Pre-fill points
  for (let i = 0; i < maxPoints; i++) {
    points.push(height / 2);
  }

  let lastBpmUpdate = Date.now();

  function drawEcg() {
    step++;
    const newY = getEcgY(step);
    points.push(newY);
    if (points.length > maxPoints) {
      points.shift();
    }

    // Clear Canvas
    ctx.fillStyle = '#060b13';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines (Medical Monitor Style)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw ECG Signal Line
    ctx.beginPath();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 8;

    const dx = width / maxPoints;
    for (let i = 0; i < points.length; i++) {
      const x = i * dx;
      const y = points[i];
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0; // reset glow for other drawings

    // Draw Lead Sweep Point
    const leadX = (points.length - 1) * dx;
    const leadY = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(leadX, leadY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#34d399';
    ctx.fill();

    // Occasional subtle realistic BPM variance
    if (Date.now() - lastBpmUpdate > 2500 && liveBpmEl) {
      const randomBpm = 72 + Math.floor((Math.random() - 0.5) * 6);
      liveBpmEl.textContent = randomBpm;
      lastBpmUpdate = Date.now();
    }

    requestAnimationFrame(drawEcg);
  }

  drawEcg();
}

/* --------------------------------------------------------------------------
   8. AI Academic Focus & Addiction Risk Calculator Demo
   -------------------------------------------------------------------------- */
function initAiFocusDemo() {
  const sliderScreen = document.getElementById('slider-screen');
  const sliderStudy = document.getElementById('slider-study');
  const valScreen = document.getElementById('val-screen');
  const valStudy = document.getElementById('val-study');
  const riskBadge = document.getElementById('risk-score-badge');
  const focusScoreVal = document.getElementById('focus-score-val');

  if (!sliderScreen || !sliderStudy) return;

  function calculateRisk() {
    const screenHrs = parseFloat(sliderScreen.value);
    const studyHrs = parseFloat(sliderStudy.value);

    valScreen.textContent = screenHrs;
    valStudy.textContent = studyHrs;

    // AI Behavioral heuristic algorithm simulation
    // Higher screen time + lower study time -> higher digital addiction risk & lower focus
    const screenFactor = (screenHrs / 14) * 65;
    const studyFactor = ((10 - studyHrs) / 10) * 35;
    const totalRisk = Math.min(Math.max(Math.round(screenFactor + studyFactor), 5), 98);

    // Focus Score calculation (inverse with balance compensation)
    const focusScore = Math.min(Math.max(Math.round((studyHrs * 12) + (14 - screenHrs) * 3), 10), 100);

    // Update Focus score text
    if (focusScoreVal) {
      focusScoreVal.textContent = `${focusScore}/100`;
    }

    // Update Risk Badge
    if (riskBadge) {
      riskBadge.className = 'risk-score-badge';
      if (totalRisk < 35) {
        riskBadge.classList.add('low');
        riskBadge.textContent = `Low (${totalRisk}%)`;
      } else if (totalRisk <= 65) {
        riskBadge.classList.add('medium');
        riskBadge.textContent = `Moderate (${totalRisk}%)`;
      } else {
        riskBadge.classList.add('high');
        riskBadge.textContent = `Elevated Risk (${totalRisk}%)`;
      }
    }
  }

  sliderScreen.addEventListener('input', calculateRisk);
  sliderStudy.addEventListener('input', calculateRisk);
  calculateRisk();
}

/* --------------------------------------------------------------------------
   9. Project Deep Dive Modals
   -------------------------------------------------------------------------- */
function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const closeBtn = document.getElementById('close-project-modal');
  const headerContainer = document.getElementById('modal-project-header');
  const bodyContainer = document.getElementById('modal-project-body');
  const openButtons = document.querySelectorAll('.open-project-modal');

  if (!modalOverlay || !closeBtn) return;

  const projectDetails = {
    'ecg': {
      title: 'ECG Heart Monitoring System',
      icon: 'fa-solid fa-heart-pulse',
      date: 'Aug 2025',
      type: 'Hardware & Biomedical Embedded System',
      content: `
        <h4>Project Architecture & Overview</h4>
        <p>A comprehensive hardware-software pipeline designed to acquire weak biopotential electrical signals produced during cardiac muscle contraction, amplify/filter them, and deliver continuous diagnostic telemetry.</p>
        
        <div class="deep-dive-diagram">
[Bio-Electrodes (RA, LA, RL)] ➔ [Analog Front-End / AD8232 ECG Amplifier] ➔ [Bandpass & Notch Filtering (50/60Hz Noise Removal)] ➔ [ADC Signal Quantization] ➔ [Microcontroller Telemetry] ➔ [Real-Time Waveform Dashboard]
        </div>

        <h4 style="margin-top: 1.25rem;">Key Technical Achievements</h4>
        <ul style="padding-left: 1.25rem; margin: 0.5rem 0 1rem; color: var(--text-secondary); line-height: 1.7;">
          <li><strong>Electrode Interfacing:</strong> 3-lead placement configuration (Right Arm, Left Arm, Right Leg ground) capturing lead I/II electrical potential.</li>
          <li><strong>Signal Acquisition & Filtering:</strong> Attenuated muscle artifact noise and baseline wandering using multi-stage analog filtration and digital smoothing.</li>
          <li><strong>Peak Detection Algorithm:</strong> Pan-Tompkins inspired QRS complex detection logic for accurate R-peak timing and real-time instantaneous Heart Rate (BPM) computing.</li>
          <li><strong>Diagnostic Telemetry UI:</strong> Visualized continuous real-time waveforms with threshold alarms for tachycardia (>100 BPM) or bradycardia (<60 BPM).</li>
        </ul>

        <h4>Technologies & Hardware Used</h4>
        <p style="color: var(--text-secondary);">ECG Sensor Module, Biomedical Electrodes, Embedded C/C++, Python Real-time Plotting, Serial Communication Protocols, Circuit Breadboarding.</p>
      `
    },
    'ai-monitor': {
      title: 'AI Academic Focus & Digital Addiction Risk Monitor',
      icon: 'fa-solid fa-brain',
      date: 'Sep 2025 - Oct 2025',
      type: 'AI / Behavioral Analytics & Web Platform',
      content: `
        <h4>Project Architecture & Overview</h4>
        <p>An intelligent behavioral telemetry and predictive risk evaluation engine that correlates students' multi-window screen activity, continuous study blocks, application distraction indices, and idle periods to quantify focus health.</p>

        <div class="deep-dive-diagram">
[Activity Telemetry Collector] ➔ [Data Normalization & Cleaning Engine] ➔ [AI Behavioral Risk Model & Scoring Rules] ➔ [MySQL Relational Storage] ➔ [Interactive Student Analytics Dashboard & Alerts]
        </div>

        <h4 style="margin-top: 1.25rem;">Key Technical Achievements</h4>
        <ul style="padding-left: 1.25rem; margin: 0.5rem 0 1rem; color: var(--text-secondary); line-height: 1.7;">
          <li><strong>Behavioral Feature Engineering:</strong> Extracted time-series features: session length, context switching frequency, social media vs. academic app ratios, and circadian usage spikes.</li>
          <li><strong>Risk Classification Pipeline:</strong> Multi-tiered risk classification categorizing digital habit risk into Low, Moderate, and Critical Addiction levels with actionable advice.</li>
          <li><strong>Modular System Architecture:</strong> Decoupled backend data collection services from the frontend analytical dashboard using clean RESTful endpoints.</li>
          <li><strong>Personalized Insight Reports:</strong> Automated generation of weekly study efficacy summaries to help students improve study discipline.</li>
        </ul>

        <h4>Technologies & Frameworks Used</h4>
        <p style="color: var(--text-secondary);">Python (Data Processing & AI Analysis), JavaScript ES6+, MySQL Database, HTML5/CSS3 Dashboard, REST APIs.</p>
      `
    }
  };

  openButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const data = projectDetails[projKey];
      if (!data) return;

      headerContainer.innerHTML = `
        <i class="${data.icon}"></i>
        <div>
          <h3 style="font-size: 1.2rem;">${data.title}</h3>
          <span style="font-size: 0.8rem; color: var(--accent-cyan);">${data.type} • ${data.date}</span>
        </div>
      `;
      bodyContainer.innerHTML = data.content;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   10. Resume Modal Handler
   -------------------------------------------------------------------------- */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-modal');
  const closeResumeBtn = document.getElementById('close-resume-modal');

  if (!resumeModal || !openResumeBtn || !closeResumeBtn) return;

  openResumeBtn.addEventListener('click', () => {
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  function closeResume() {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeResumeBtn.addEventListener('click', closeResume);
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
      closeResume();
    }
  });
}

/* --------------------------------------------------------------------------
   11. Contact Form & Client Validation
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  if (!form || !submitBtn) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  function clearErrors() {
    nameError.textContent = '';
    emailError.textContent = '';
    subjectError.textContent = '';
    messageError.textContent = '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;
    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const subjectVal = subjectInput.value.trim();
    const messageVal = messageInput.value.trim();

    if (!nameVal) {
      nameError.textContent = 'Please enter your name.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!subjectVal) {
      subjectError.textContent = 'Please enter a subject.';
      isValid = false;
    }

    if (!messageVal || messageVal.length < 10) {
      messageError.textContent = 'Message should be at least 10 characters.';
      isValid = false;
    }

    if (!isValid) return;

    // Simulate sending state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Message Sent!</span> <i class="fa-solid fa-check"></i>`;
      showToast('Thank you! Your message has been prepared.', 'success');

      // Create prefilled mailto draft
      const mailtoUrl = `mailto:krishjaiswal1314@gmail.com?subject=${encodeURIComponent(
        subjectVal
      )}&body=${encodeURIComponent(
        `Name: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}`
      )}`;

      window.location.href = mailtoUrl;
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;
      }, 4000);
    }, 800);
  });
}

/* --------------------------------------------------------------------------
   12. Direct Copy to Clipboard Buttons
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  const heroCopyEmailBtn = document.getElementById('quick-copy-email-hero');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      copyToClipboard(textToCopy, `Copied "${textToCopy}" to clipboard!`);
    });
  });

  if (heroCopyEmailBtn) {
    heroCopyEmailBtn.addEventListener('click', () => {
      copyToClipboard('krishjaiswal1314@gmail.com', 'Email copied: krishjaiswal1314@gmail.com');
    });
  }
}

function copyToClipboard(text, message) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message, 'success');
    });
  } else {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(message, 'success');
  }
}

/* --------------------------------------------------------------------------
   13. Toast Notification Generator
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info';
  toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-30px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
