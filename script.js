/**
 * Disha Nakrani - Portfolio Application Logic
 * Interactive TMS Simulator, Logistics Network Canvas, Live Estimators & UI Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. Interactive Logistics Network Canvas Animation
  // ==========================================================================
  const canvas = document.getElementById('network-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 42;
    const maxDistance = 140;
    let mouse = { x: null, y: null, radius: 120 };

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        const isDark = document.body.classList.contains('dark-theme');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(0, 229, 255, 0.75)' : 'rgba(2, 132, 199, 0.7)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animateCanvas = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.body.classList.contains('dark-theme');
      const lineColor = isDark ? '0, 229, 255' : '2, 132, 199';

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateCanvas);
    };

    animateCanvas();
  }

  // ==========================================================================
  // 2. Dynamic Text Typing Effect (Hero Subtitle)
  // ==========================================================================
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const roles = [
      'Transport Management System (TMS)',
      'ASP.NET MVC & C# Logistics ERP',
      'Cygnus Softech Enterprise Suite',
      'Full-Stack Web & Relational DB'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingDelay = 100;

    const typeRole = () => {
      const currentRole = roles[roleIdx];
      if (isDeleting) {
        typedEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typingDelay = 45;
      } else {
        typedEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typingDelay = 95;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        isDeleting = true;
        typingDelay = 2000; // Pause at full text
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typingDelay = 400; // Pause before typing new text
      }

      setTimeout(typeRole, typingDelay);
    };

    setTimeout(typeRole, 600);
  }

  // ==========================================================================
  // 3. Theme Toggle (Dark / Light with LocalStorage persistence)
  // ==========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('disha_portfolio_theme') || 'dark';

  if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isCurrentlyDark = document.body.classList.contains('dark-theme');
      if (isCurrentlyDark) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('disha_portfolio_theme', 'light');
        showToast('Switched to Light Theme', 'sun');
      } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('disha_portfolio_theme', 'dark');
        showToast('Switched to Dark Enterprise Theme', 'moon');
      }
    });
  }

  // ==========================================================================
  // 4. Mobile Menu Navigation Drawer
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================================================
  // 5. Scroll Header Shadow & Active Navigation Spy
  // ==========================================================================
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
    } else {
      header.style.boxShadow = 'none';
    }

    // Scroll spy
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // 6. Project Filter Tabs
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-tab, .filter-btn');
  const projectCards = document.querySelectorAll('.system-card, .project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // 7. Interactive TMS Simulator: Live Docket & Consignment Tracker
  // ==========================================================================
  const docketDatabase = {
    'SKY-9402': {
      id: 'SKY-9402',
      system: 'Skylark Logistics & Transport ERP',
      url: 'https://skylark.cygnux.in/',
      status: 'In Transit',
      statusClass: 'live-badge',
      progress: 68,
      origin: 'Mumbai Central WH',
      originState: 'Maharashtra',
      destination: 'Delhi NCR Logistics Park',
      destinationState: 'Delhi',
      vehicle: 'MH-04-CD-1234 (14MT Container)',
      driver: 'Ramesh Patel (+91 98251-XXXXX)',
      weight: '8,450 kg',
      cargo: 'Automotive Components & Fasteners',
      lrNumber: 'LR-2026-94021',
      ewayBill: 'EW-8849-0192-3341',
      dispatchDate: '17 Oct 2026, 06:30 AM',
      expectedDelivery: '19 Oct 2026, 02:00 PM',
      milestones: [
        { title: 'Booking Confirmed & LR Generated', meta: 'Mumbai Hub • 16 Oct, 04:15 PM', status: 'completed' },
        { title: 'Vehicle Loaded & Trip Sheet Issued', meta: 'Loading Bay 4 • 17 Oct, 05:45 AM', status: 'completed' },
        { title: 'Dispatched & Checkpoint Surat Passed', meta: 'Surat Checkpost • 17 Oct, 02:30 PM', status: 'completed' },
        { title: 'In Transit - Gujarat/Rajasthan Highway', meta: 'Live GPS Telemetry Active • Current', status: 'active' },
        { title: 'Arrival at Delhi Hub & Digital POD', meta: 'Pending Arrival', status: 'pending' }
      ]
    },
    'BHOR-3180': {
      id: 'BHOR-3180',
      system: 'Bhor Group Transport & Supply Chain ERP',
      url: 'http://bhorgroup.cygnux.in/',
      status: 'Out for Delivery',
      statusClass: 'live-badge',
      progress: 92,
      origin: 'Pune Industrial Area',
      originState: 'Maharashtra',
      destination: 'Ahmedabad Industrial Estate',
      destinationState: 'Gujarat',
      vehicle: 'MH-12-AB-4567 (24MT Multi-Axle)',
      driver: 'Sunil Jadhav (+91 94220-XXXXX)',
      weight: '18,200 kg',
      cargo: 'Industrial Polymers & Raw Film',
      lrNumber: 'BHOR-LR-55018',
      ewayBill: 'EW-9102-4411-7782',
      dispatchDate: '17 Oct 2026, 09:00 PM',
      expectedDelivery: '18 Oct 2026, 08:30 PM (Today)',
      milestones: [
        { title: 'Bulk Order Manifest Approved', meta: 'Pune Plant • 17 Oct, 06:00 PM', status: 'completed' },
        { title: 'Driver Advance Disbursed & Trip Sheet Logged', meta: 'Driver Ledger ID #8841 • 17 Oct, 08:30 PM', status: 'completed' },
        { title: 'Night Transit via Mumbai-Ahmedabad Corridor', meta: 'Toll Plaza Vapi • 18 Oct, 04:10 AM', status: 'completed' },
        { title: 'Arrived at Ahmedabad City Gate', meta: 'Last Mile Vehicle Dispatch • 18 Oct, 06:15 PM', status: 'completed' },
        { title: 'Out for Delivery to Client Warehouse', meta: 'ETA: 45 mins • Current', status: 'active' }
      ]
    },
    'CTS-8814': {
      id: 'CTS-8814',
      system: 'CTS - Cygnux Transport & Docket System',
      url: 'http://cts.cygnux.in/',
      status: 'Delivered (POD Verified)',
      statusClass: 'badge-pill-sm',
      progress: 100,
      origin: 'Surat Textile Market',
      originState: 'Gujarat',
      destination: 'Kolkata Central Cargo Depot',
      destinationState: 'West Bengal',
      vehicle: 'GJ-05-TX-9099 (Express Freight)',
      driver: 'Mahesh Solanki (+91 97241-XXXXX)',
      weight: '4,100 kg',
      cargo: 'High-Value Synthetic Textiles',
      lrNumber: 'CTS-DKT-8814',
      ewayBill: 'EW-6372-8814-1109',
      dispatchDate: '15 Oct 2026, 11:15 AM',
      expectedDelivery: '18 Oct 2026, 10:45 AM (Delivered)',
      milestones: [
        { title: 'Docket Booked & QR Barcode Printed', meta: 'Surat Ring Road WH • 15 Oct, 09:30 AM', status: 'completed' },
        { title: 'Inter-State Cargo Flight/Linehaul Dispatched', meta: 'Transit Manifest #1004 • 15 Oct, 11:45 AM', status: 'completed' },
        { title: 'Transshipment Hub Checkpoint Passed', meta: 'Nagpur Central Hub • 16 Oct, 08:20 PM', status: 'completed' },
        { title: 'Unloaded at Kolkata Depot', meta: 'Kolkata Hub • 18 Oct, 08:00 AM', status: 'completed' },
        { title: 'Consignee Signed & Digital POD Uploaded', meta: 'Verified by Cygnux OCR Engine • 18 Oct, 10:45 AM', status: 'completed' }
      ]
    },
    'RGL-2045': {
      id: 'RGL-2045',
      system: 'RGL Logistics Enterprise Portal',
      url: 'https://rgl.cygnux.in/',
      status: 'Dispatched & Hub Routing',
      statusClass: 'live-badge',
      progress: 35,
      origin: 'Chennai Logistics Park',
      originState: 'Tamil Nadu',
      destination: 'Bangalore Electronic City Hub',
      destinationState: 'Karnataka',
      vehicle: 'TN-01-AB-1234 (E-Commerce Shuttle)',
      driver: 'K. Rajasekaran (+91 98401-XXXXX)',
      weight: '6,750 kg',
      cargo: 'Consumer Electronics & Hardware',
      lrNumber: 'RGL-LR-2045-EXP',
      ewayBill: 'EW-4482-9912-6631',
      dispatchDate: '18 Oct 2026, 01:30 PM',
      expectedDelivery: '19 Oct 2026, 06:00 AM',
      milestones: [
        { title: 'Multi-Hub Booking Initialized', meta: 'Chennai Hub • 18 Oct, 10:00 AM', status: 'completed' },
        { title: 'Consolidation & Barcode Scanning', meta: 'Cross-Dock #2 • 18 Oct, 12:15 PM', status: 'completed' },
        { title: 'Vehicle Departed Chennai Hub', meta: 'Trip Manifest #RGL-TM-771 • 18 Oct, 01:30 PM', status: 'active' },
        { title: 'Hosur Border Checkpoint', meta: 'Pending ETA: 18 Oct, 10:30 PM', status: 'pending' },
        { title: 'Final Unloading at Bangalore Hub', meta: 'Pending ETA: 19 Oct, 06:00 AM', status: 'pending' }
      ]
    }
  };

  const renderDocketResult = (docketId) => {
    const resultContainer = document.getElementById('tracker-result');
    if (!resultContainer) return;

    const data = docketDatabase[docketId] || {
      id: docketId.toUpperCase(),
      system: 'Cygnux Transport Management System',
      url: 'https://skylark.cygnux.in/',
      status: 'In Transit',
      statusClass: 'live-badge',
      progress: 55,
      origin: 'Surat Hub',
      originState: 'Gujarat',
      destination: 'Regional Delivery Hub',
      destinationState: 'India',
      vehicle: 'GJ-05-ZZ-8890 (Heavy Fleet)',
      driver: 'Assigned Driver (+91 98765-XXXXX)',
      weight: '3,200 kg',
      cargo: 'Commercial Goods',
      lrNumber: `LR-GEN-${Math.floor(Math.random() * 89999 + 10000)}`,
      ewayBill: `EW-2026-${Math.floor(Math.random() * 89999 + 10000)}`,
      dispatchDate: 'Today, 08:00 AM',
      expectedDelivery: 'Tomorrow, 06:00 PM',
      milestones: [
        { title: 'Consignment Booked & Lorry Receipt (LR) Created', meta: 'Origin Hub • Confirmed', status: 'completed' },
        { title: 'Vehicle Assigned & Manifest Issued', meta: 'Trip Sheet Logged', status: 'completed' },
        { title: 'Shipment In Transit', meta: 'Live GPS Telemetry Active', status: 'active' },
        { title: 'Destination Unloading & POD Upload', meta: 'Awaiting Delivery', status: 'pending' }
      ]
    };

    let milestonesHtml = data.milestones.map(m => `
      <div class="milestone-item ${m.status}">
        <div class="milestone-icon">
          ${m.status === 'completed' ? '<i class="fa-solid fa-check"></i>' : (m.status === 'active' ? '<i class="fa-solid fa-truck"></i>' : '<i class="fa-solid fa-circle"></i>')}
        </div>
        <div class="milestone-info">
          <span class="milestone-title">${m.title}</span>
          <span class="milestone-meta">${m.meta}</span>
        </div>
      </div>
    `).join('');

    resultContainer.innerHTML = `
      <div class="docket-details-card">
        <div class="docket-header-row">
          <div class="docket-id-box">
            <span class="docket-number">${data.id}</span>
            <div>
              <span class="docket-system-name"><i class="fa-solid fa-server"></i> System: <strong>${data.system}</strong></span>
              <a href="${data.url}" target="_blank" rel="noopener" class="copyable-text" style="font-size: 0.78rem; display: block;">Open Portal ↗</a>
            </div>
          </div>
          <div class="docket-status-badge">
            <span class="badge ${data.statusClass}"><i class="fa-solid fa-circle-dot fa-fade"></i> ${data.status}</span>
          </div>
        </div>

        <div class="tracker-route-progress">
          <div class="route-endpoints">
            <div>
              <span class="route-city"><i class="fa-solid fa-warehouse text-cyan"></i> ${data.origin}</span>
              <span class="route-state">${data.originState}</span>
            </div>
            <div style="text-align: right;">
              <span class="route-city"><i class="fa-solid fa-location-dot" style="color: #f43f5e;"></i> ${data.destination}</span>
              <span class="route-state">${data.destinationState}</span>
            </div>
          </div>

          <div class="progress-track-wrapper">
            <div class="progress-track-fill" style="width: ${data.progress}%">
              <span class="progress-truck-pin"><i class="fa-solid fa-truck-moving"></i></span>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted);">
            <span>Dispatched: ${data.dispatchDate}</span>
            <span>Est. Delivery: <strong>${data.expectedDelivery}</strong></span>
          </div>
        </div>

        <div class="docket-meta-grid">
          <div class="meta-field">
            <span class="meta-label">Vehicle & Type</span>
            <span class="meta-val">${data.vehicle}</span>
          </div>
          <div class="meta-field">
            <span class="meta-label">Assigned Driver</span>
            <span class="meta-val">${data.driver}</span>
          </div>
          <div class="meta-field">
            <span class="meta-label">LR Docket #</span>
            <span class="meta-val" style="font-family: var(--font-mono); color: var(--cyan-primary);">${data.lrNumber}</span>
          </div>
          <div class="meta-field">
            <span class="meta-label">Cargo & Weight</span>
            <span class="meta-val">${data.cargo} (${data.weight})</span>
          </div>
        </div>

        <div class="milestones-section">
          <h4 class="milestones-title"><i class="fa-solid fa-timeline"></i> Operational Transit Milestones</h4>
          <div class="milestones-list">
            ${milestonesHtml}
          </div>
        </div>
      </div>
    `;
  };

  // Initial render with default docket
  renderDocketResult('SKY-9402');

  const docketInput = document.getElementById('docket-input');
  const trackBtn = document.getElementById('track-btn');
  const sampleChips = document.querySelectorAll('.sample-chip');

  if (trackBtn && docketInput) {
    trackBtn.addEventListener('click', () => {
      const val = docketInput.value.trim().toUpperCase();
      if (val) {
        renderDocketResult(val);
        showToast(`Tracking Docket: ${val}`, 'barcode');
      }
    });

    docketInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = docketInput.value.trim().toUpperCase();
        if (val) {
          renderDocketResult(val);
          showToast(`Tracking Docket: ${val}`, 'barcode');
        }
      }
    });
  }

  sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      sampleChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const docket = chip.getAttribute('data-docket');
      if (docketInput) docketInput.value = docket;
      renderDocketResult(docket);
      showToast(`Selected Sample: ${docket}`, 'truck');
    });
  });

  // ==========================================================================
  // 8. Interactive TMS Freight Rate & Transit Estimator
  // ==========================================================================
  const cityDistanceMatrix = {
    'Surat-Delhi': 1180,
    'Surat-Mumbai': 285,
    'Surat-Bangalore': 1250,
    'Surat-Kolkata': 1920,
    'Surat-Chennai': 1480,
    'Mumbai-Delhi': 1420,
    'Mumbai-Surat': 285,
    'Mumbai-Bangalore': 980,
    'Mumbai-Kolkata': 1960,
    'Mumbai-Chennai': 1340,
    'Delhi-Surat': 1180,
    'Delhi-Mumbai': 1420,
    'Delhi-Bangalore': 2180,
    'Delhi-Kolkata': 1530,
    'Delhi-Chennai': 2200,
    'Bangalore-Surat': 1250,
    'Bangalore-Mumbai': 980,
    'Bangalore-Delhi': 2180,
    'Bangalore-Kolkata': 1870,
    'Bangalore-Chennai': 350,
    'Kolkata-Surat': 1920,
    'Kolkata-Mumbai': 1960,
    'Kolkata-Delhi': 1530,
    'Kolkata-Bangalore': 1870,
    'Kolkata-Chennai': 1660
  };

  const calculateFreight = () => {
    const origin = document.getElementById('calc-origin').value;
    const dest = document.getElementById('calc-destination').value;
    const weight = parseFloat(document.getElementById('calc-weight').value) || 1000;
    const vehicle = document.getElementById('calc-vehicle').value;
    const cargo = document.getElementById('calc-cargo').value;
    const resultBox = document.getElementById('calc-result');

    if (origin === dest) {
      resultBox.innerHTML = `
        <div class="calc-result-card" style="text-align: center; color: var(--amber-primary);">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
          <h3>Local Intra-City Transport Selected</h3>
          <p>Please select distinct origin and destination logistics hubs to calculate inter-city freight tariff.</p>
        </div>
      `;
      return;
    }

    const key = `${origin}-${dest}`;
    const distance = cityDistanceMatrix[key] || 950;

    // Vehicle rate multipliers
    let ratePerKmTon = 4.2;
    let vehicleName = '14 MT Multi-Axle Container (FTL)';
    let avgSpeed = 45; // km/h

    if (vehicle === 'FTL_24MT') {
      ratePerKmTon = 5.8;
      vehicleName = '24 MT Heavy Trailer Multi-Axle';
      avgSpeed = 40;
    } else if (vehicle === 'LTL_PART') {
      ratePerKmTon = 6.2;
      vehicleName = 'Part Load / Groupage Cargo (LTL)';
      avgSpeed = 38;
    } else if (vehicle === 'EXP_MINI') {
      ratePerKmTon = 7.5;
      vehicleName = 'Light Commercial Vehicle Express';
      avgSpeed = 55;
    }

    // Cargo surcharge
    let cargoSurchargePct = 0;
    if (cargo === 'TEXTILES') cargoSurchargePct = 0.05;
    if (cargo === 'INDUSTRIAL') cargoSurchargePct = 0.12;
    if (cargo === 'COLD') cargoSurchargePct = 0.25;

    const tons = Math.max(weight / 1000, 0.5);
    const baseFreight = Math.round(distance * ratePerKmTon * tons);
    const cargoExtra = Math.round(baseFreight * cargoSurchargePct);
    const fuelSurcharge = Math.round(baseFreight * 0.12);
    const handlingFee = Math.round(450 + (tons * 120));
    const subtotal = baseFreight + cargoExtra + fuelSurcharge + handlingFee;
    const gstTax = Math.round(subtotal * 0.05); // 5% GST for goods transport
    const totalFreight = subtotal + gstTax;

    const transitHours = Math.round(distance / avgSpeed + 4);
    const transitDays = (transitHours / 24).toFixed(1);

    resultBox.innerHTML = `
      <div class="calc-result-card">
        <div class="calc-summary-grid">
          <div class="quote-total-box">
            <span class="quote-label"><i class="fa-solid fa-receipt"></i> Estimated Freight Tariff</span>
            <span class="quote-amount">₹${totalFreight.toLocaleString('en-IN')}</span>
            <div class="quote-eta">
              <i class="fa-solid fa-clock text-cyan"></i>
              <span>Est. Transit: <strong>${transitHours} hrs (~${transitDays} days)</strong></span>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.4rem;">
              Calculated via Cygnux Rate Contract Master Algorithm
            </div>
          </div>

          <div class="quote-breakdown-box">
            <table class="cost-breakdown-table">
              <tr>
                <td>Route Distance (${origin} → ${dest})</td>
                <td>${distance} km</td>
              </tr>
              <tr>
                <td>Base Freight Tariff (${tons.toFixed(1)} MT)</td>
                <td>₹${baseFreight.toLocaleString('en-IN')}</td>
              </tr>
              ${cargoExtra > 0 ? `
              <tr>
                <td>Cargo Risk Surcharge (${cargo})</td>
                <td>₹${cargoExtra.toLocaleString('en-IN')}</td>
              </tr>` : ''}
              <tr>
                <td>Fuel & Toll Surcharge (12%)</td>
                <td>₹${fuelSurcharge.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Dock Handling & LR Docket Fee</td>
                <td>₹${handlingFee.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>GST on Freight (5% RCM/FCM)</td>
                <td>₹${gstTax.toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
          <div style="font-size: 0.85rem; color: var(--text-secondary);">
            <i class="fa-solid fa-truck-ramp-box text-cyan"></i> Fleet: <strong>${vehicleName}</strong>
          </div>
          <button id="book-quote-btn" class="btn btn-secondary btn-sm">
            <i class="fa-solid fa-file-circle-check"></i> Generate Simulated LR
          </button>
        </div>
      </div>
    `;

    const bookBtn = document.getElementById('book-quote-btn');
    if (bookBtn) {
      bookBtn.addEventListener('click', () => {
        showToast(`Simulated LR Created for ${origin} → ${dest}`, 'file-invoice');
      });
    }
  };

  const calcSubmitBtn = document.getElementById('calc-submit-btn');
  if (calcSubmitBtn) {
    calcSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calculateFreight();
      showToast('Calculated Freight & ETA', 'calculator');
    });
    // Auto-calculate on load
    calculateFreight();
  }

  // Demo Tab Switching (Tracker vs Calculator)
  const demoTabs = document.querySelectorAll('.sim-tab-btn, .demo-tab-btn');
  const demoTabContents = document.querySelectorAll('.sim-tab-panel, .demo-tab-content');

  demoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      demoTabs.forEach(t => t.classList.remove('active'));
      demoTabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      const contentEl = document.getElementById(`tab-${target}`);
      if (contentEl) contentEl.classList.add('active');
    });
  });

  // ==========================================================================
  // 9. Architecture Detail Modal (MERN & ASP.NET E-Commerce)
  // ==========================================================================
  const archModal = document.getElementById('arch-modal');
  const archModalTitle = document.getElementById('arch-modal-title');
  const archModalBody = document.getElementById('arch-modal-body');
  const closeArchBtn = document.getElementById('close-arch-btn');
  const openArchBtns = document.querySelectorAll('.open-project-modal-btn');

  const archContent = {
    mern: {
      title: 'Online Shopping Web Application — MERN Stack Architecture',
      html: `
        <div class="arch-card">
          <div class="arch-header-box">
            <i class="fa-brands fa-react"></i>
            <div>
              <h3>Full-Stack MERN Architecture Overview</h3>
              <p>Dual-portal e-commerce architecture built with MongoDB, Express.js, React.js, and Node.js.</p>
            </div>
          </div>

          <div class="arch-flow-diagram">
            <div class="flow-node">
              <strong>1. React Frontend</strong>
              <p>Responsive customer shop, category filtering, cart state management, checkout UI & admin statistics charts.</p>
            </div>
            <div class="flow-node">
              <strong>2. Node / Express REST API</strong>
              <p>JWT authentication, role-based route guards, product controllers, payment gateway simulation & order pipeline.</p>
            </div>
            <div class="flow-node">
              <strong>3. MongoDB Storage</strong>
              <p>Normalized Mongoose models for Users, Products, Categories, Orders, Cart items, and Wishlists.</p>
            </div>
          </div>

          <div class="cv-two-col mt-2">
            <div>
              <h4 style="color: var(--cyan-primary); margin-bottom: 0.5rem;"><i class="fa-solid fa-user"></i> Customer Side Features</h4>
              <ul style="list-style: disc; padding-left: 1.25rem; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7;">
                <li>User Registration, Login & JWT Session Persistence</li>
                <li>Live Shopping Cart & Persistent Wishlist</li>
                <li>Dynamic Multi-Attribute Product Filtering (Price, Category, Color, Size)</li>
                <li>Order Placement & Payment Gateway Simulation</li>
                <li>Forgot Password with secure token recovery</li>
              </ul>
            </div>
            <div>
              <h4 style="color: var(--cyan-primary); margin-bottom: 0.5rem;"><i class="fa-solid fa-lock"></i> Admin Side Features</h4>
              <ul style="list-style: disc; padding-left: 1.25rem; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7;">
                <li>Product & Category CRUD Management</li>
                <li>Order Status Confirmation & Fulfillment Workflow</li>
                <li>Live Sales Analytics Dashboard with revenue graphs</li>
                <li>Inventory threshold alerts & customer account management</li>
              </ul>
            </div>
          </div>
        </div>
      `
    },
    dotnet: {
      title: 'Online Shopping Web Application — ASP.NET MVC & C# Architecture',
      html: `
        <div class="arch-card">
          <div class="arch-header-box">
            <i class="fa-brands fa-microsoft"></i>
            <div>
              <h3>Enterprise ASP.NET MVC & C# Architecture</h3>
              <p>Multi-tier enterprise application with role-based security, ADO.NET/Entity Framework, and SQL Server.</p>
            </div>
          </div>

          <div class="arch-flow-diagram">
            <div class="flow-node">
              <strong>1. Razor View Engine</strong>
              <p>Bootstrap-powered responsive views, Razor layout pages, partial views, and AJAX client data binding.</p>
            </div>
            <div class="flow-node">
              <strong>2. C# MVC Controllers</strong>
              <p>Enterprise business logic, ASP.NET Identity authentication, custom authorize filters, and transactional services.</p>
            </div>
            <div class="flow-node">
              <strong>3. MS SQL Server</strong>
              <p>Relational database with optimized stored procedures, foreign key cascades, indexing, and sales triggers.</p>
            </div>
          </div>

          <div class="cv-two-col mt-2">
            <div>
              <h4 style="color: var(--cyan-primary); margin-bottom: 0.5rem;"><i class="fa-solid fa-shield-halved"></i> Enterprise Security & Logic</h4>
              <ul style="list-style: disc; padding-left: 1.25rem; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7;">
                <li>ASP.NET Forms / Identity Role-Based Authorization</li>
                <li>CSRF Protection via AntiForgeryTokens on all POST actions</li>
                <li>Session-state shopping cart with concurrency handling</li>
                <li>Automated order invoice generation with printable format</li>
              </ul>
            </div>
            <div>
              <h4 style="color: var(--cyan-primary); margin-bottom: 0.5rem;"><i class="fa-solid fa-database"></i> Database Architecture</h4>
              <ul style="list-style: disc; padding-left: 1.25rem; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7;">
                <li>Normalized 3NF relational schema (Users, Roles, Products, Categories, Orders, OrderItems)</li>
                <li>Parameterized SQL queries preventing SQL Injection</li>
                <li>Stored procedures for high-performance inventory audits</li>
                <li>Sales reporting views for management telemetry</li>
              </ul>
            </div>
          </div>
        </div>
      `
    }
  };

  openArchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalType = btn.getAttribute('data-modal');
      const data = archContent[modalType];
      if (data && archModal && archModalTitle && archModalBody) {
        archModalTitle.innerHTML = `<i class="fa-solid fa-cubes"></i> ${data.title}`;
        archModalBody.innerHTML = data.html;
        archModal.classList.add('open');
        archModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  if (closeArchBtn && archModal) {
    closeArchBtn.addEventListener('click', () => {
      archModal.classList.remove('open');
      archModal.setAttribute('aria-hidden', 'true');
    });

    archModal.addEventListener('click', (e) => {
      if (e.target === archModal) {
        archModal.classList.remove('open');
        archModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // ==========================================================================
  // 10. Resume Modal & Print CV Controls
  // ==========================================================================
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const heroResumeBtn = document.getElementById('hero-resume-btn');
  const mobileResumeBtn = document.getElementById('mobile-resume-btn');
  const closeResumeBtn = document.getElementById('close-resume-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');

  const openResume = () => {
    if (resumeModal) {
      resumeModal.classList.add('open');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeResume = () => {
    if (resumeModal) {
      resumeModal.classList.remove('open');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (openResumeBtn) openResumeBtn.addEventListener('click', openResume);
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResume);
  if (mobileResumeBtn) mobileResumeBtn.addEventListener('click', openResume);
  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResume);

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResume();
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      if (archModal) {
        archModal.classList.remove('open');
        archModal.setAttribute('aria-hidden', 'true');
      }
      const modalBody = document.querySelector('#resume-modal .modal-body');
      if (modalBody) modalBody.scrollTop = 0;
      setTimeout(() => {
        window.print();
      }, 50);
    });
  }

  // Escape key to close any open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (resumeModal && resumeModal.classList.contains('open')) closeResume();
      if (archModal && archModal.classList.contains('open')) {
        archModal.classList.remove('open');
        archModal.setAttribute('aria-hidden', 'true');
      }
    }
  });

  // ==========================================================================
  // 11. Clipboard Copy Helpers & Toast Notifications
  // ==========================================================================
  const copyBtns = document.querySelectorAll('[data-copy]');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`, 'check');
        }).catch(() => {
          fallbackCopy(textToCopy);
        });
      } else {
        fallbackCopy(textToCopy);
      }
    });
  });

  const fallbackCopy = (text) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`Copied: ${text}`, 'check');
  };

  function showToast(message, icon = 'info-circle') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 300);
    }, 3200);
  }

  // ==========================================================================
  // 12. Contact Form Validation & Submission
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');
      const submitBtn = document.getElementById('form-submit-btn');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        nameInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Subject
      if (!subjectInput.value) {
        subjectInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        subjectInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Message
      if (messageInput.value.trim().length < 10) {
        messageInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        messageInput.closest('.form-group').classList.remove('has-error');
      }

      if (!isValid) {
        showToast('Please fix highlighted form errors', 'circle-exclamation');
        return;
      }

      // Submit feedback simulation
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Message...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast('Thank you! Your message has been sent to Disha Nakrani.', 'paper-plane');
      }, 1200);
    });
  }

  // ==========================================================================
  // 13. Dynamic Year in Footer
  // ==========================================================================
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
