/* =========================================================
   FOUR TWENTY CARTEL — main.js
   GSAP + ScrollTrigger + Lenis (vendored in /vendor)
   ========================================================= */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeIn = t => t * t * t;
  const html = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) html.classList.add('reduced');

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
  };

  $('#year').textContent = new Date().getFullYear();

  /* ---------- image slots: use a real photo when the file exists, keep the styled stand-in otherwise ---------- */
  $$('[data-img]').forEach(el => {
    const src = el.dataset.img;
    const img = new Image();
    img.onload = () => { el.style.backgroundImage = `url("${src}")`; el.classList.add('has-img'); };
    img.src = src;
  });

  /* ---------- smooth scroll ---------- */
  gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.08 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = $(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(target, { duration: 1.6 }) : target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }));

  /* ---------- age gate ---------- */
  const gate = $('#agegate');
  if (store.get('ll_age_ok') !== '1') {
    gate.classList.add('open');
    html.classList.add('locked');
    lenis && lenis.stop();
    $('#ageYes').focus();
  }
  $('#ageYes').addEventListener('click', () => {
    store.set('ll_age_ok', '1');
    gate.classList.remove('open');
    html.classList.remove('locked');
    lenis && lenis.start();
  });
  $('#ageNo').addEventListener('click', () => {
    $('#ageMsg').textContent = 'Come back when you’re 21. We’ll keep the lights on.';
  });

  /* ---------- top bar ---------- */
  ScrollTrigger.create({
    trigger: '#hero', start: 'bottom 95%',
    onEnter: () => $('#topbar').classList.add('visible'),
    onLeaveBack: () => $('#topbar').classList.remove('visible'),
  });

  /* =========================================================
     1. HERO — scroll-scrubbed scene
     ========================================================= */
  const hero = {
    p: 0,
    el: $('#hero'), scene: $('#scene'), street: $('#street'), canvas: $('#aurora'),
    mascot: $('#mascot'), puffs: $$('#smoke i'), wordmark: $('#heroWordmark'),
    fade: $('#heroFade'), cue: $('#scrollCue'), dusk: $('#dusk'),
  };
  const actx = hero.canvas.getContext('2d');
  const AS = 0.5;                 // aurora renders at half resolution — soft by design, cheap to draw
  let cw = 0, ch = 0, aw = 0, ah = 0;
  function sizeAurora() {
    cw = hero.canvas.clientWidth; ch = hero.canvas.clientHeight;
    aw = hero.canvas.width = Math.max(1, Math.round(cw * AS));
    ah = hero.canvas.height = Math.max(1, Math.round(ch * AS));
  }
  const RIB = ['#e23cff', '#8b2cff', '#2b5bff', '#19e27a', '#38c8ff', '#b14dff', '#19e27a', '#1238c9'];
  const ribbons = Array.from({ length: 16 }, (_, i) => ({
    c: RIB[i % RIB.length], y: 0.1 + 0.8 * ((i * 0.618) % 1),
    amp: 0.02 + Math.random() * 0.06, f: 0.8 + Math.random() * 1.6,
    sp: 0.4 + Math.random() * 0.8, w: 1 + Math.random() * 5, ph: Math.random() * 6.28,
  }));
  const PORTAL = ['#19e27a', '#2b5bff', '#8b2cff', '#38c8ff', '#e23cff'];

  // portal horizontal radius in CSS px: opens 14–34%, then blows past the screen edges 36–58%
  function portalR(p) {
    const base = Math.min(cw, ch) * 0.36;
    return base * smooth(0.14, 0.34, p) + smooth(0.36, 0.58, p) * Math.hypot(cw, ch) * 0.9;
  }

  function drawAurora(t) {
    const p = hero.p;
    actx.clearRect(0, 0, aw, ah);
    actx.globalCompositeOperation = 'lighter';
    actx.lineCap = 'round';

    const s1 = 1 - smooth(0.12, 0.32, p);            // horizontal light streaks
    if (s1 > 0.01) {
      for (const r of ribbons) {
        const by = r.y * ah, drift = t * r.sp + p * 10;
        actx.beginPath();
        for (let x = 0; x <= aw + 8; x += 8) {
          const u = x / aw;
          const y = by + Math.sin(u * r.f * 6.28 - drift + r.ph) * r.amp * ah
                       + Math.sin(u * 3.1 + drift * 1.3) * r.amp * 0.5 * ah;
          x ? actx.lineTo(x, y) : actx.moveTo(x, y);
        }
        actx.strokeStyle = r.c; actx.globalAlpha = 0.6 * s1;
        actx.lineWidth = r.w * AS * 2; actx.shadowBlur = 16; actx.shadowColor = r.c;
        actx.stroke();
      }
    }

    const s2 = smooth(0.12, 0.26, p) * (1 - smooth(0.5, 0.62, p));   // swirling portal ring
    if (s2 > 0.01) {
      const rx = portalR(p) * AS, ry = rx * 0.72, cx = aw / 2, cy = ah / 2;
      const thick = 1 + smooth(0.35, 0.58, p) * 2.5;
      for (let k = 0; k < 28; k++) {
        const col = PORTAL[k % 5];
        const a0 = t * 0.5 * (k % 2 ? 1 : -1) + k * 0.9;
        const jr = 1 + 0.1 * Math.sin(t * 1.3 + k);
        actx.beginPath();
        actx.ellipse(cx, cy, Math.max(1, rx * jr), Math.max(1, ry * jr), 0, a0, a0 + 1.1 + (k % 4) * 0.5);
        actx.strokeStyle = col; actx.globalAlpha = 0.32 * s2;
        actx.lineWidth = (5 + (k % 5) * 6) * thick; actx.shadowBlur = 26; actx.shadowColor = col;
        actx.stroke();
      }
    }
    actx.globalAlpha = 1; actx.shadowBlur = 0;
    actx.globalCompositeOperation = 'source-over';
  }

  function renderHero() {
    const p = hero.p;
    const rx = portalR(p);
    hero.street.style.clipPath = `ellipse(${rx.toFixed(1)}px ${(rx * 0.72).toFixed(1)}px at 50% 50%)`;

    // dusk + neon + dolly-in
    const dusk = smooth(0.64, 0.82, p);
    hero.dusk.style.opacity = (dusk * 0.85).toFixed(3);
    hero.street.style.setProperty('--neon', (0.35 + 0.65 * dusk).toFixed(3));
    hero.scene.style.transform = `scale(${(1 + 1.6 * smooth(0.7, 1, p)).toFixed(4)})`;

    // mascot walks toward the door and shrinks into the distance
    const walk = smooth(0.3, 0.95, p);
    hero.mascot.style.transform = `translate(-50%, ${lerp(0, -12, walk).toFixed(2)}vh) scale(${lerp(1, 0.3, walk).toFixed(4)})`;
    hero.mascot.style.opacity = (1 - smooth(0.88, 0.96, p)).toFixed(3);

    // smoke exhale 54–76%
    const sp = clamp((p - 0.54) / 0.22);
    hero.puffs.forEach((el, i) => {
      const lp = clamp(sp * 1.4 - i * 0.07);
      el.style.opacity = lp <= 0 ? 0 : (Math.sin(lp * Math.PI) * 0.9).toFixed(3);
      el.style.transform = `translate(${(lp * (90 + i * 45)).toFixed(1)}%, ${(-lp * (20 + i * 18)).toFixed(1)}%) scale(${(0.2 + lp * (2 + i * 0.25)).toFixed(3)})`;
    });

    hero.wordmark.style.opacity = (1 - smooth(0, 0.6, p)).toFixed(3);
    hero.cue.style.opacity = (1 - smooth(0, 0.04, p)).toFixed(3);
    hero.fade.style.opacity = smooth(0.88, 1, p).toFixed(3);
  }

  let walkTimer = 0;
  function setWalking() {
    hero.mascot.classList.add('walking');
    clearTimeout(walkTimer);
    walkTimer = setTimeout(() => hero.mascot.classList.remove('walking'), 200);
  }

  /* =========================================================
     2. "YOU HIGH?" — particles assemble into text
     ========================================================= */
  const high = { el: $('#high'), c: $('#particles'), p: 0, parts: [], w: 0, h: 0 };
  const hctx = high.c.getContext('2d');
  const PCOL = ['#e6fff1', '#bfffd9', '#9dffc8', '#19e27a', '#6fe3ff'];

  function buildParticles() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = high.c.clientWidth, h = high.c.clientHeight;
    if (!w || !h) return;
    high.w = w; high.h = h;
    high.c.width = Math.round(w * dpr); high.c.height = Math.round(h * dpr);
    hctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const o = off.getContext('2d', { willReadFrequently: true });
    const TEXT = 'YOU HIGH?';
    let fs = Math.min(w * 0.15, h * 0.3);
    const font = s => `400 ${s}px "Archivo Black", Impact, "Arial Black", sans-serif`;
    o.font = font(fs);
    const mw = o.measureText(TEXT).width;
    if (mw > w * 0.9) { fs *= (w * 0.9) / mw; o.font = font(fs); }
    o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillStyle = '#fff';
    o.fillText(TEXT, w / 2, h * 0.54);

    const data = o.getImageData(0, 0, w, h).data;
    const step = Math.max(2, Math.round(fs / 48));
    let pts = [];
    for (let y = 0; y < h; y += step)
      for (let x = 0; x < w; x += step)
        if (data[(y * w + x) * 4 + 3] > 128) pts.push([x, y]);
    const max = w < 700 ? 2600 : 6500;
    if (pts.length > max) { const keep = max / pts.length; pts = pts.filter(() => Math.random() < keep); }

    high.parts = pts.map(([tx, ty]) => ({
      tx, ty,
      sx: w * 0.15 + Math.random() * w * 1.5,
      sy: h * 0.54 + (Math.random() - 0.5) * h * 0.16,
      ex: tx - w * (0.4 + Math.random() * 0.8),
      ey: ty + (Math.random() - 0.5) * h * 0.35,
      d: tx / w, ph: Math.random() * 6.28,
      c: PCOL[Math.random() < 0.55 ? (Math.random() * 3) | 0 : 3 + ((Math.random() * 2) | 0)],
    })).sort((a, b) => (a.c < b.c ? -1 : 1));      // grouped by colour = fewer fillStyle switches
  }

  function drawParticles(t) {
    const { w, h, p } = high;
    hctx.clearRect(0, 0, w, h);
    const A = clamp(p / 0.58);            // assemble
    const D = smooth(0.78, 1, p);         // dissolve
    hctx.globalCompositeOperation = 'lighter';
    let cur = '';
    for (const q of high.parts) {
      const a = easeOut(clamp(A * 1.4 - q.d * 0.4));
      const b = easeIn(clamp(D * 1.4 - (1 - q.d) * 0.4));
      let x = lerp(q.sx, q.tx, a), y = lerp(q.sy, q.ty, a);
      if (a < 1) x += Math.sin(t * 0.8 + q.ph) * 8 * (1 - a);
      else { x += Math.sin(t * 2 + q.ph) * 0.6; y += Math.cos(t * 1.7 + q.ph) * 0.6; }
      x = lerp(x, q.ex, b); y = lerp(y, q.ey, b);
      const formed = a * (1 - b);
      if (q.c !== cur) { hctx.fillStyle = q.c; cur = q.c; }
      hctx.globalAlpha = 0.3 + 0.7 * formed;
      const len = 1.6 + (1 - formed) * 4.5;          // grass-blade strands until they settle
      hctx.fillRect(x, y - len / 2, 1.6, len);
    }
    hctx.globalAlpha = 1;
    hctx.globalCompositeOperation = 'source-over';
  }

  /* =========================================================
     3. ELEVATE — 3D coverflow
     ========================================================= */
  const ev = { track: $('#track'), cards: $$('#track .card'), stage: $('.cover-stage'), p: 0 };
  let coverBlur = 0, coverBlurTarget = 0;

  function layoutCover() {
    const sw = ev.stage.clientWidth;
    const first = ev.cards[0], last = ev.cards[ev.cards.length - 1];
    const c0 = first.offsetLeft + first.offsetWidth / 2;
    const cN = last.offsetLeft + last.offsetWidth / 2;
    const x = sw / 2 - lerp(c0, cN, ev.p);
    ev.track.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    const spacing = ev.cards[1].offsetLeft - first.offsetLeft;
    ev.cards.forEach(card => {
      const d = (card.offsetLeft + card.offsetWidth / 2 + x - sw / 2) / spacing;
      const ad = Math.min(Math.abs(d), 1.8);
      card.style.transform =
        `translateZ(${(-ad * 140).toFixed(1)}px) rotateY(${(clamp(-d, -1.6, 1.6) * 25).toFixed(2)}deg) scale(${(1 - Math.min(ad, 1) * 0.15).toFixed(3)})`;
      card._dim = Math.min(ad, 1.5) * 0.4;
    });
    applyCardFilters();
  }
  function applyCardFilters() {
    ev.cards.forEach(card => {
      const b = coverBlur > 0.05 ? ` blur(${coverBlur.toFixed(2)}px)` : '';
      card.style.filter = `brightness(${(1 - (card._dim || 0)).toFixed(3)})${b}`;
    });
  }

  /* =========================================================
     REDUCED MOTION: render calm static states and stop here
     ========================================================= */
  function sizeAll() { sizeAurora(); buildParticles(); }

  if (reduced) {
    hero.p = 0.6; sizeAll(); renderHero(); drawAurora(0);
    hero.fade.style.opacity = 0;
    high.p = 0.65; drawParticles(0);
    ev.cards.forEach(c => { c.style.transform = 'none'; });
    addEventListener('resize', () => { sizeAll(); renderHero(); drawAurora(0); drawParticles(0); });
    document.fonts && document.fonts.ready.then(() => { buildParticles(); drawParticles(0); });
    return;
  }

  /* ---------- scroll wiring ---------- */
  ScrollTrigger.create({
    trigger: hero.el, start: 'top top', end: 'bottom bottom',
    onUpdate: self => {
      hero.p = self.progress; renderHero();
      if (Math.abs(self.getVelocity()) > 20) setWalking();
    },
  });
  ScrollTrigger.create({
    trigger: high.el, start: 'top top', end: 'bottom bottom',
    onUpdate: self => { high.p = self.progress; },
  });
  ScrollTrigger.create({
    trigger: '#elevate', start: 'top top', end: 'bottom bottom',
    onUpdate: self => {
      ev.p = self.progress;
      coverBlurTarget = Math.min(3, Math.abs(self.getVelocity()) / 1200);
      layoutCover();
    },
  });

  // elevate header reveal
  gsap.from('.elevate-head > *', {
    y: 24, opacity: 0, filter: 'blur(8px)', stagger: 0.12, duration: 1.2, ease: 'power2.out',
    scrollTrigger: { trigger: '#elevate', start: 'top 70%' },
  });

  // collection: diagonal fly-in / fly-out sequence
  const shows = $$('#collection .show');
  const tl = gsap.timeline({ scrollTrigger: { trigger: '#collection', start: 'top 70%', end: 'bottom bottom', scrub: true } });
  shows.forEach((s, i) => {
    const side = s.classList.contains('alt') ? 1 : -1;       // image right → enters from the right
    const media = $('.media', s), bits = $$('.copy > *', s);
    tl.fromTo(media,
      { y: '40vh', x: `${side * 15}vw`, rotate: side * 4, filter: 'blur(10px)', opacity: 0 },
      { y: 0, x: 0, rotate: 0, filter: 'blur(0px)', opacity: 1, duration: 0.5, ease: 'power2.out' }, i)
      .fromTo(bits,
        { y: 30, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.15, duration: 0.35, ease: 'power2.out' }, i + 0.15);
    if (i < shows.length - 1) {
      tl.to(media, { y: '-35vh', x: `${-side * 12}vw`, rotate: -side * 3, filter: 'blur(10px)', opacity: 0, duration: 0.45, ease: 'power2.in' }, i + 0.85)
        .to(bits, { y: -30, opacity: 0, filter: 'blur(6px)', stagger: 0.05, duration: 0.3, ease: 'power2.in' }, i + 0.85);
    }
  });
  tl.to({}, { duration: 0.5 });                                   // hold the last product
  const dur = tl.duration();
  tl.to('#collection .glow-a', { xPercent: 35, yPercent: 15, duration: dur, ease: 'none' }, 0)
    .to('#collection .glow-b', { xPercent: 40, yPercent: -12, duration: dur, ease: 'none' }, 0);

  // visit: background un-blurs in, heading writes on, details rise
  gsap.fromTo('.visit-bg',
    { filter: 'blur(18px) saturate(.5)', scale: 1.12, opacity: 0 },
    { filter: 'blur(0px) saturate(1)', scale: 1, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: '#visit', start: 'top 90%', end: 'top 15%', scrub: true } });
  gsap.fromTo('.visit h2', { clipPath: 'inset(-10% 100% -20% 0)' },
    { clipPath: 'inset(-10% 0% -20% 0)', duration: 1.8, ease: 'power2.inOut', scrollTrigger: { trigger: '.visit h2', start: 'top 80%' } });
  gsap.from('.visit .reveal', {
    y: 24, opacity: 0, stagger: 0.1, duration: 1, ease: 'power2.out',
    scrollTrigger: { trigger: '.visit-copy', start: 'top 70%' },
  });
  gsap.from('.foot > *', {
    y: 16, opacity: 0, stagger: 0.1, duration: 1, ease: 'power2.out',
    scrollTrigger: { trigger: '.foot', start: 'top 90%' },
  });

  /* ---------- render loops (only while their section is on screen) ---------- */
  const visible = new Set();
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
  io.observe(hero.el); io.observe(high.el);

  gsap.ticker.add(time => {
    if (visible.has(hero.el)) drawAurora(time);
    if (visible.has(high.el)) drawParticles(time);
    coverBlurTarget *= 0.9;
    const nb = coverBlur + (coverBlurTarget - coverBlur) * 0.2;
    if (Math.abs(nb - coverBlur) > 0.01) { coverBlur = nb; applyCardFilters(); }
  });

  /* ---------- sizing ---------- */
  sizeAll(); renderHero(); layoutCover();
  let rz = 0;
  addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => { sizeAll(); renderHero(); layoutCover(); ScrollTrigger.refresh(); }, 150);
  });
  document.fonts && document.fonts.ready.then(() => { buildParticles(); ScrollTrigger.refresh(); });
})();
