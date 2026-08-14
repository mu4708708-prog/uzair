'use strict';

// ============================================================
// SCREEN MANAGEMENT
// ============================================================
const screens = document.querySelectorAll('.screen');
let currentScreen = 0;

function goTo(index) {
    if (index === currentScreen || index < 0 || index >= screens.length) return;
    screens[currentScreen].classList.remove('active');
    currentScreen = index;
    screens[currentScreen].classList.add('active');
    onScreenEnter(index);
}

function onScreenEnter(index) {
    switch (index) {
        case 1: animCard(); break;
        case 5: initCake(); break;
        case 6: initLetter(); break;
        case 7: initMemories(); break;
        case 8: initBalloons(); break;
        case 9: initFinal(); break;
    }
}

// ============================================================
// BUTTON WIRING
// ============================================================
const $ = id => document.getElementById(id);

$('btn1').addEventListener('click', () => goTo(1));
$('btn2').addEventListener('click', () => goTo(2));
$('btn3yes').addEventListener('click', () => goTo(3));
$('btn3no').addEventListener('click', () => {
    const q = $('choiceQ');
    q.classList.remove('shake');
    void q.offsetWidth; // reflow to restart animation
    q.classList.add('shake');
});
$('btn4').addEventListener('click', () => goTo(4));
$('btn5').addEventListener('click', () => goTo(5));
$('btn6').addEventListener('click', blowCandles);
$('btn7').addEventListener('click', () => goTo(7));
$('btn8').addEventListener('click', () => goTo(8));


// ============================================================
// MUSIC — handled by YouTube IFrame API in index.html
// ============================================================


// ============================================================
// STARS CANVAS  (twinkling, shown on dark screens)
// ============================================================
const starsCanvas = $('starsCanvas');
const sCtx = starsCanvas.getContext('2d');
let stars = [];

function resizeStars() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
    buildStars();
}

function buildStars() {
    stars = [];
    for (let i = 0; i < 220; i++) {
        stars.push({
            x: Math.random() * starsCanvas.width,
            y: Math.random() * starsCanvas.height,
            r: Math.random() * 1.5 + 0.2,
            a: Math.random(),
            spd: (Math.random() * 0.012 + 0.004) * (Math.random() > 0.5 ? 1 : -1)
        });
    }
}

function animStars() {
    sCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    const isDark = screens[currentScreen]?.classList.contains('dark-screen');
    if (isDark) {
        for (const s of stars) {
            s.a += s.spd;
            if (s.a >= 1) s.spd = -Math.abs(s.spd);
            if (s.a <= 0) s.spd = Math.abs(s.spd);
            sCtx.beginPath();
            sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            sCtx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, s.a))})`;
            sCtx.fill();
        }
    }
    requestAnimationFrame(animStars);
}

resizeStars();
animStars();
window.addEventListener('resize', resizeStars);

// ============================================================
// CONFETTI CANVAS
// ============================================================
const confCanvas = $('confettiCanvas');
const cCtx = confCanvas.getContext('2d');
let pieces = [];
let confRunning = false;

function resizeConf() {
    confCanvas.width = window.innerWidth;
    confCanvas.height = window.innerHeight;
}
resizeConf();
window.addEventListener('resize', resizeConf);

function launchConfetti() {
    const cols = ['#ff6baa', '#c44fff', '#ffd740', '#ff8e42', '#42c5ff', '#a5d6a7', '#ffffff'];
    pieces = [];
    for (let i = 0; i < 200; i++) {
        pieces.push({
            x: Math.random() * confCanvas.width,
            y: -20 - Math.random() * confCanvas.height * 0.6,
            w: Math.random() * 11 + 5,
            h: Math.random() * 5 + 3,
            col: cols[Math.floor(Math.random() * cols.length)],
            vy: Math.random() * 4 + 2,
            vx: (Math.random() - 0.5) * 4,
            rot: Math.random() * 360,
            rspd: (Math.random() - 0.5) * 8
        });
    }
    if (!confRunning) { confRunning = true; animConf(); }
}

function animConf() {
    if (!confRunning) return;
    cCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
    let alive = false;
    for (const p of pieces) {
        p.y += p.vy; p.x += p.vx; p.rot += p.rspd;
        if (p.y < confCanvas.height + 30) alive = true;
        cCtx.save();
        cCtx.translate(p.x, p.y);
        cCtx.rotate(p.rot * Math.PI / 180);
        cCtx.fillStyle = p.col;
        cCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        cCtx.restore();
    }
    if (alive) requestAnimationFrame(animConf);
    else { confRunning = false; cCtx.clearRect(0, 0, confCanvas.width, confCanvas.height); }
}

// ============================================================
// SCREEN 2 — CARD ANIMATION
// ============================================================
function animCard() {
    const card = document.querySelector('.glass-card');
    if (!card) return;
    card.classList.remove('pop-in');
    void card.offsetWidth;
    card.classList.add('pop-in');
}

// ============================================================
// SCREEN 6 — CAKE + BUNTING
// ============================================================
function initCake() {
    buildBunting();
    // Reset candles
    ['f1', 'f2', 'f3'].forEach(id => {
        const el = $(id);
        if (el) el.classList.remove('blown');
    });
    const btn = $('btn6');
    btn.disabled = false;
    btn.textContent = 'Blow the Candles 🕯️';
}

function buildBunting() {
    const b = $('bunting');
    if (!b) return;
    b.innerHTML = '';
    const cols = ['#ff6baa', '#ffd740', '#c44fff', '#ff8e42', '#42c5ff', '#a5d6a7', '#ff4444', '#fff'];
    for (let i = 0; i < 16; i++) {
        const f = document.createElement('div');
        f.className = 'bflag';
        f.style.borderTopColor = cols[i % cols.length];
        b.appendChild(f);
    }
}

function blowCandles() {
    const btn = $('btn6');
    btn.disabled = true;
    btn.textContent = '💨 Blowing...';

    ['f1', 'f2', 'f3'].forEach((id, i) => {
        setTimeout(() => {
            const el = $(id);
            if (el) el.classList.add('blown');
        }, i * 380);
    });

    setTimeout(() => {
        launchConfetti();
        setTimeout(() => goTo(6), 1800);
    }, 1500);
}

// ============================================================
// SCREEN 7 — LETTER CURTAIN
// ============================================================
function initLetter() {
    const L = $('curtL'), R = $('curtR');
    if (!L || !R) return;
    L.classList.remove('open');
    R.classList.remove('open');
    setTimeout(() => {
        L.classList.add('open');
        R.classList.add('open');
    }, 700);
}

// ============================================================
// SCREEN 8 — MEMORIES GALLERY (all photos at once)
// ============================================================
const PHOTOS = [
    { src: 'photo1.jpg', caption: 'Always so elegant 💜' },
    { src: 'photo2.jpg', caption: 'Casually stunning 💙' },
    { src: 'photo3.jpg', caption: 'That thoughtful look 🌿' },
    { src: 'photo4.jpg', caption: 'Graceful & beautiful 🖤' },
    { src: 'photo5.jpg', caption: 'Smiling as always 💙' },
    { src: 'photo6.jpg', caption: 'Beautiful as a garden 🌸' },
];

function initMemories() {
    const grid = $('galleryGrid');
    if (!grid) return;

    // Re-trigger animations by rebuilding the grid
    grid.innerHTML = '';

    PHOTOS.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'gal-card';

        const img = document.createElement('img');
        img.className = 'gal-photo';
        img.alt = `Memory ${i + 1}`;
        img.src = p.src;
        img.onerror = function () {
            // Replace with styled placeholder
            const ph = document.createElement('div');
            ph.className = 'gal-placeholder';
            ph.innerHTML = `<span>🌸</span><span class="ph-num">photo${i + 1}.jpg</span>`;
            card.replaceChild(ph, this);
        };

        const cap = document.createElement('p');
        cap.className = 'gal-caption';
        cap.textContent = p.caption;

        card.appendChild(img);
        card.appendChild(cap);
        grid.appendChild(card);
    });
}

// ============================================================
// SCREEN 9 — BALLOON POP
// ============================================================
const BALLOON_EMOJIS = ['🎈', '🎈', '🎈', '🎀', '🎀', '💗', '💗', '🌸', '🌸', '✨', '⭐', '🎊'];
const TOTAL_B = 12;
let bPopped = 0;

function initBalloons() {
    const field = $('balloonField');
    if (!field) return;
    field.innerHTML = '';
    bPopped = 0;

    const msg = $('balloonMsg');
    if (msg) msg.classList.add('hidden');

    for (let i = 0; i < TOTAL_B; i++) {
        const el = document.createElement('div');
        el.className = 'balloon';
        el.textContent = BALLOON_EMOJIS[i % BALLOON_EMOJIS.length];

        const left = 4 + Math.random() * 88;
        const top = 6 + Math.random() * 75;
        const dur = 2 + Math.random() * 2.5;
        const delay = Math.random() * 2;
        const rot = (Math.random() * 20 - 10).toFixed(1);
        const size = (2.2 + Math.random() * 1.6).toFixed(1);

        el.style.left = left + '%';
        el.style.top = top + '%';
        el.style.setProperty('--dur', dur + 's');
        el.style.setProperty('--delay', delay + 's');
        el.style.setProperty('--rot', rot + 'deg');
        el.style.setProperty('--size', size + 'rem');
        el.style.fontSize = size + 'rem';

        el.addEventListener('click', () => popBalloon(el));
        el.addEventListener('touchstart', (e) => { e.preventDefault(); popBalloon(el); },
            { passive: false });

        field.appendChild(el);
    }
}

function popBalloon(el) {
    if (el.dataset.popped) return;
    el.dataset.popped = '1';
    el.style.animation = 'bPop 0.35s ease forwards';
    spawnPopParticles(el);
    setTimeout(() => el.remove(), 360);

    bPopped++;
    if (bPopped >= TOTAL_B) {
        const msg = $('balloonMsg');
        if (msg) {
            msg.classList.remove('hidden');
            launchConfetti();
            setTimeout(() => goTo(9), 3600);
        }
    }
}

function spawnPopParticles(el) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const emojis = ['💥', '✨', '⭐', '💫', '🌟', '🎊'];

    for (let i = 0; i < 7; i++) {
        const p = document.createElement('div');
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.cssText = `
            position:fixed;
            left:${cx}px;top:${cy}px;
            font-size:${0.9 + Math.random() * 0.8}rem;
            pointer-events:none;z-index:999;
            transform:translate(-50%,-50%);
            transition:transform 0.55s ease,opacity 0.55s ease;
            opacity:1;
        `;
        document.body.appendChild(p);

        // Trigger after paint
        requestAnimationFrame(() => {
            const angle = (i / 7) * Math.PI * 2;
            const dist = 45 + Math.random() * 65;
            p.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(0)`;
            p.style.opacity = '0';
        });

        setTimeout(() => p.remove(), 600);
    }
}

// ============================================================
// SCREEN 10 — FINAL FLOATING HEARTS
// ============================================================
let heartTimer = null;

function initFinal() {
    const container = $('floatingHearts');
    if (!container) return;
    container.innerHTML = '';
    if (heartTimer) clearInterval(heartTimer);

    const emojis = ['💗', '💖', '💕', '💝', '✨', '🌸', '⭐', '🌟', '💫'];

    function spawnHeart() {
        if (currentScreen !== 9) { clearInterval(heartTimer); return; }
        const h = document.createElement('div');
        h.className = 'heart-p';
        h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        h.style.left = Math.random() * 100 + '%';
        h.style.setProperty('--dur', (3.5 + Math.random() * 4) + 's');
        h.style.setProperty('--fz', (0.8 + Math.random() * 1.4) + 'rem');
        container.appendChild(h);
        setTimeout(() => h.remove(), 8000);
    }

    // Burst on enter
    for (let i = 0; i < 10; i++) setTimeout(spawnHeart, i * 120);
    heartTimer = setInterval(spawnHeart, 450);
}

// ============================================================
// FLOATING SPARKLES (intro dark screen)
// ============================================================
(function initIntroSparkles() {
    const c = $('sparklesIntro');
    if (!c) return;
    for (let i = 0; i < 30; i++) {
        const s = document.createElement('div');
        s.className = 'sp-dot';
        const sz = 2 + Math.random() * 4;
        s.style.cssText = `
            left:${Math.random() * 100}%;
            top:${Math.random() * 100}%;
            width:${sz}px;height:${sz}px;
            --dur:${2 + Math.random() * 3}s;
            --delay:${Math.random() * 4}s;
        `;
        c.appendChild(s);
    }
})();

// ============================================================
// PINK PARTICLES (pink screens)
// ============================================================
['pinkP4', 'pinkP5', 'pinkP7', 'pinkP8'].forEach(id => {
    const c = $(id);
    if (!c) return;
    for (let i = 0; i < 22; i++) {
        const s = document.createElement('div');
        s.className = 'pk-dot';
        const sz = 3 + Math.random() * 6;
        s.style.cssText = `
            left:${Math.random() * 100}%;
            top:${Math.random() * 100}%;
            width:${sz}px;height:${sz}px;
            --dur:${2.5 + Math.random() * 3}s;
            --delay:${Math.random() * 5}s;
        `;
        c.appendChild(s);
    }
});