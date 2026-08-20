// ===== aira landing page =====

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- header scroll elevation ---------- */
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
    let ticking = false;
    const applyScrollState = () => {
        siteHeader.classList.toggle('scrolled', window.scrollY > 8);
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(applyScrollState);
            ticking = true;
        }
    }, { passive: true });
    applyScrollState();
}

/* ---------- orchestrated hero demo loop ---------- */
const demoOrbWrap = document.getElementById('demoOrbWrap');
const demoDot = document.getElementById('demoDot');
const demoStatus = document.getElementById('demoStatus');
const demoTranscript = document.getElementById('demoTranscript');
const demoAnswer = document.getElementById('demoAnswer');
const demoMeta = document.getElementById('demoMeta');
const demoSources = document.getElementById('demoSources');

const DEMO_QUERY = 'What is RAG?';
const DEMO_ANSWER = 'Retrieval-Augmented Generation combines search with a language model — it retrieves verified passages, then grounds its answer in exactly what it found.';
const DEMO_SOURCES = ['FAISS Vector Index', 'MSMARCO-XI Dataset'];
const SKELETON_HTML = '<span class="demo-skel-line" style="width:100%"></span><span class="demo-skel-line" style="width:91%"></span><span class="demo-skel-line" style="width:74%"></span>';

function setDemoState(s) {
    demoDot.className = 'demo-dot ' + s;
    demoOrbWrap.classList.toggle('listening', s === 'listening');
    demoStatus.textContent = s;
}

function typeInto(el, text, speed = 34) {
    return new Promise((resolve) => {
        el.innerHTML = '';
        let i = 0;
        const tick = () => {
            el.textContent = text.slice(0, i);
            i++;
            if (i <= text.length) setTimeout(tick, speed);
            else resolve();
        };
        tick();
    });
}

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function runDemoLoop() {
    // reset
    setDemoState('idle');
    demoTranscript.innerHTML = '<span class="placeholder">·</span>';
    demoAnswer.innerHTML = '';
    demoMeta.innerHTML = '';
    demoSources.innerHTML = '';

    await wait(1400);

    // listening
    setDemoState('listening');
    await wait(1500);

    // retrieving
    setDemoState('retrieving');
    await wait(500);

    // transcript
    await typeInto(demoTranscript, DEMO_QUERY);

    // brief shimmer skeleton while the "answer" is being generated
    demoAnswer.innerHTML = SKELETON_HTML;
    await wait(420);
    demoAnswer.innerHTML = '';

    // answer
    demoAnswer.style.opacity = '0';
    await typeInto(demoAnswer, DEMO_ANSWER, 10);
    demoAnswer.style.transition = 'opacity 300ms';
    demoAnswer.style.opacity = '1';

    // meta
    setDemoState('complete');
    demoMeta.innerHTML = '<span class="demo-pill">Success</span><span class="demo-pill">178ms total</span>';

    // sources
    DEMO_SOURCES.forEach((s, i) => {
        const row = document.createElement('div');
        row.className = 'demo-source-row';
        row.innerHTML = `<span class="demo-source-num mono">0${i + 1}</span><span>${s}</span>`;
        demoSources.appendChild(row);
        setTimeout(() => row.classList.add('show'), 120 * i);
    });

    await wait(3600);
    await runDemoLoop();
}

if (demoOrbWrap) {
    if (reduceMotion) {
        // show a single static "complete" frame instead of looping
        setDemoState('complete');
        demoTranscript.textContent = DEMO_QUERY;
        demoAnswer.textContent = DEMO_ANSWER;
        demoMeta.innerHTML = '<span class="demo-pill">Success</span><span class="demo-pill">178ms total</span>';
        DEMO_SOURCES.forEach((s, i) => {
            const row = document.createElement('div');
            row.className = 'demo-source-row show';
            row.innerHTML = `<span class="demo-source-num mono">0${i + 1}</span><span>${s}</span>`;
            demoSources.appendChild(row);
        });
    } else {
        runDemoLoop();
    }
}

/* ---------- scroll reveal for how-it-works cards ---------- */
/* Progressive enhancement: cards are visible by default in CSS. JS adds
   'pre-reveal' synchronously (hiding them) only if it successfully runs,
   then reveals on scroll — so a script failure or missing API never
   leaves the content permanently invisible. */
const howCards = document.querySelectorAll('.how-card');
if (howCards.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
        howCards.forEach((c) => c.classList.add('reveal'));
    } else {
        howCards.forEach((c) => c.classList.add('pre-reveal'));
        try {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const card = entry.target;
                        const i = Array.from(howCards).indexOf(card);
                        setTimeout(() => card.classList.add('reveal'), i * 90);
                        io.unobserve(card);
                    }
                });
            }, { threshold: 0.2 });
            howCards.forEach((c) => io.observe(c));
        } catch (e) {
            howCards.forEach((c) => c.classList.add('reveal'));
        }
        // hard fallback: if something stalls the observer, don't leave cards hidden forever
        setTimeout(() => howCards.forEach((c) => c.classList.add('reveal')), 4000);
    }
}
