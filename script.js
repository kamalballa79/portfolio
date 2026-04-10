gsap.registerPlugin(ScrollTrigger);

const cursorDot = document.getElementById('cursor-dot');
const crosshairH = document.getElementById('crosshair-h');
const crosshairV = document.getElementById('crosshair-v');
const loaderCount = document.getElementById('loader-count');
const mainNav = document.getElementById('main-nav');
const typewriterEl = document.getElementById('typewriter-text');


let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0;

// --- TextType Engine ---
const targetName = "PORTFOLIO";
let charIndex = 0;
let isDeleting = false;

function type() {
    const typingSpeed = isDeleting ? 50 : 75; 
    if (!isDeleting && charIndex < targetName.length) {
        charIndex++;
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
    }
    const displayed = targetName.substring(0, charIndex);
    typewriterEl.innerHTML = displayed + '<span class="type-cursor">_</span>';
    if (!isDeleting && charIndex === targetName.length) {
        isDeleting = true;
        setTimeout(type, 3000); 
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        setTimeout(type, 500);
    } else {
        setTimeout(type, typingSpeed);
    }
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function renderAnimations() {
    // Smooth Dot Lerp
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;

    // Crosshair Update
    crosshairH.style.transform = `translateY(${mouseY}px)`;
    crosshairV.style.transform = `translateX(${mouseX}px)`;

    // Proximity Effect for Anton Titles
    document.querySelectorAll('.rotate-char').forEach(char => {
        const rect = char.getBoundingClientRect();
        const dx = mouseX - (rect.left + rect.width / 2);
        const dy = mouseY - (rect.top + rect.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 250) {
            const ratio = 1 - (distance / 250);
            char.style.transform = `scale(${1 + (0.2 * ratio)})`;
            char.style.letterSpacing = (0.05 * ratio) + "em";
        } else {
            char.style.transform = `scale(1)`;
            char.style.letterSpacing = "0em";
        }
    });

    requestAnimationFrame(renderAnimations);
}
requestAnimationFrame(renderAnimations);

document.querySelectorAll('.hover-target, a').forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('hovered'));
});

function splitTextIntoChars(target) {
    const text = target.innerText;
    target.innerHTML = '';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.className = 'split-char';
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        target.appendChild(span);
    });
    return target.querySelectorAll('.split-char');
}

document.querySelectorAll('.hero-title').forEach(title => {
    const text = title.getAttribute('data-text');
    if (text) {
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'rotate-char';
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            title.appendChild(span);
        });
    }
});

document.querySelectorAll('.tilted-card').forEach(card => {
    const inner = card.querySelector('.tilted-card-inner');
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.width / 2, centerY = rect.height / 2;
        const rotateX = ((e.clientY - rect.top - centerY) / centerY) * -12;
        const rotateY = ((e.clientX - rect.left - centerX) / centerX) * 12;
        inner.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        inner.style.transition = 'transform 0.5s ease';
        inner.style.transform = `scale(1) rotateX(0deg) rotateY(0deg)`;
    });
    card.addEventListener('mouseenter', () => { inner.style.transition = 'none'; });
});

const tiltCard = document.getElementById('tilt-card');
if(tiltCard) {
    tiltCard.addEventListener('mousemove', (e) => {
        const rect = tiltCard.getBoundingClientRect();
        const centerX = rect.width / 2, centerY = rect.height / 2;
        const rotateX = ((e.clientY - rect.top - centerY) / centerY) * -15; 
        const rotateY = ((e.clientX - rect.left - centerX) / centerX) * 15;
        tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    tiltCard.addEventListener('mouseleave', () => {
        tiltCard.style.transition = 'transform 0.5s ease';
        tiltCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
    tiltCard.addEventListener('mouseenter', () => { tiltCard.style.transition = 'none'; });
}

function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(updateClock, 1000);
updateClock();

const tl = gsap.timeline();
const counter = { value: 0 };

tl.to(counter, {
    value: 100,
    duration: 1.5,
    ease: "power1.inOut",
    onUpdate: () => {
        loaderCount.innerText = Math.round(counter.value);
    }
})
.to('#loader', { yPercent: -100, duration: 1, ease: 'power4.inOut' })
.to(mainNav, { y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.2")
.add(() => type(), "-=0.2")
.from('.fixed-corner', { opacity: 0, duration: 1, stagger: 0.1 }, "-=0.5")
.to('.rotate-char', { y: '0%', duration: 1.2, stagger: 0.015, ease: 'power4.out' }, "-=0.8");

document.querySelectorAll('.fade-up').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" }
    });
});


// Overlay Elements
const bluecrossOverlay = document.getElementById('bluecross-overlay');
const bluecrossTrigger = document.getElementById('trigger-bluecross');
const closeBluecrossBtn = document.getElementById('close-bluecross-btn');

const dotsOverlay = document.getElementById('dots-overlay');
const dotsTrigger = document.getElementById('trigger-dots');
const closeDotsBtn = document.getElementById('close-dots-btn');

const projectOverlay = document.getElementById('project-overlay');
const projectTrigger = document.getElementById('trigger-project');
const closeOverlay = document.getElementById('close-project-btn');
// --- BlueCross OVERLAY FUNCTIONALITY ---
if (bluecrossTrigger && bluecrossOverlay && closeBluecrossBtn) {
    bluecrossTrigger.addEventListener('click', () => {
        document.body.classList.add('no-scroll');
        bluecrossOverlay.style.display = 'block';
        gsap.fromTo(bluecrossOverlay, { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: "power4.inOut" });
    });

    closeBluecrossBtn.addEventListener('click', () => {
        gsap.to(bluecrossOverlay, {
            yPercent: 100,
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => {
                bluecrossOverlay.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && bluecrossOverlay.style.display === 'block') {
            closeBluecrossBtn.click();
        }
    });
}

// --- DOTS OVERLAY FUNCTIONALITY ---
if (dotsTrigger && dotsOverlay && closeDotsBtn) {
    dotsTrigger.addEventListener('click', () => {
        document.body.classList.add('no-scroll');
        dotsOverlay.style.display = 'block';
        gsap.fromTo(dotsOverlay, { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: "power4.inOut" });
    });

    closeDotsBtn.addEventListener('click', () => {
        gsap.to(dotsOverlay, {
            yPercent: 100,
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => {
                dotsOverlay.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && dotsOverlay.style.display === 'block') {
            closeDotsBtn.click();
        }
    });
}

// --- PROJECT OVERLAY FUNCTIONALITY ---
if (projectTrigger && projectOverlay && closeOverlay) {
    projectTrigger.addEventListener('click', () => {
        document.body.classList.add('no-scroll');
        projectOverlay.style.display = 'block';
        gsap.fromTo(projectOverlay, { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: "power4.inOut" });
    });

    closeOverlay.addEventListener('click', () => {
        gsap.to(projectOverlay, {
            yPercent: 100,
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => {
                projectOverlay.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && projectOverlay.style.display === 'block') {
            closeOverlay.click();
        }
    });
}

// --- K FORM STUDIOS OVERLAY ---
const kformOverlay = document.getElementById('kform-overlay');
const kformTrigger = document.getElementById('trigger-kform');
const closeKformBtn = document.getElementById('close-kform-btn');

if (kformTrigger && kformOverlay && closeKformBtn) {
    kformTrigger.addEventListener('click', () => {
        document.body.classList.add('no-scroll');
        kformOverlay.style.display = 'block';
        gsap.fromTo(kformOverlay, { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: "power4.inOut" });
    });

    closeKformBtn.addEventListener('click', () => {
        gsap.to(kformOverlay, {
            yPercent: 100,
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => {
                kformOverlay.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && kformOverlay.style.display === 'block') {
            closeKformBtn.click();
        }
    });
}

// --- Photography Overlay ---
const photographyOverlay = document.getElementById('photography-overlay');
const photographyTrigger = document.getElementById('trigger-photography');
const closePhotographyBtn = document.getElementById('close-photography-btn');

if (photographyTrigger && photographyOverlay && closePhotographyBtn) {
    photographyTrigger.addEventListener('click', () => {
        document.body.classList.add('no-scroll');
        photographyOverlay.style.display = 'block';
        gsap.fromTo(photographyOverlay, { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: "power4.inOut" });
    });

    closePhotographyBtn.addEventListener('click', () => {
        gsap.to(photographyOverlay, {
            yPercent: 100,
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => {
                photographyOverlay.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && photographyOverlay.style.display === 'block') {
            closePhotographyBtn.click();
        }
    });
}

// --- Sensoslide Overlay ---
const sensoslideOverlay = document.getElementById('sensoslide-overlay');
const sensoslideTrigger = document.getElementById('trigger-sensoslide');
const closeSensoslideBtn = document.getElementById('close-sensoslide-btn');

if (sensoslideTrigger && sensoslideOverlay && closeSensoslideBtn) {
    sensoslideTrigger.addEventListener('click', () => {
        document.body.classList.add('no-scroll');
        sensoslideOverlay.style.display = 'block';
        gsap.fromTo(sensoslideOverlay, { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: "power4.inOut" });
    });

    closeSensoslideBtn.addEventListener('click', () => {
        gsap.to(sensoslideOverlay, {
            yPercent: 100,
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => {
                sensoslideOverlay.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && sensoslideOverlay.style.display === 'block') {
            closeSensoslideBtn.click();
        }
    });
}


// --- zerotouch Overlay ---
const zerotouchOverlay = document.getElementById('zerotouch-overlay');
const zerotouchTrigger = document.getElementById('trigger-zerotouch');
const closeZerotouchBtn = document.getElementById('close-zerotouch-btn');

if (zerotouchTrigger && zerotouchOverlay && closeZerotouchBtn) {
    zerotouchTrigger.addEventListener('click', () => {
        document.body.classList.add('no-scroll');
        zerotouchOverlay.style.display = 'block';
        gsap.fromTo(zerotouchOverlay, { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: "power4.inOut" });
    });

    closeZerotouchBtn.addEventListener('click', () => {
        gsap.to(zerotouchOverlay, {
            yPercent: 100,
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => {
                zerotouchOverlay.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && zerotouchOverlay.style.display === 'block') {
            closeZerotouchBtn.click();
        }
    });
}

// --- Architecture Overlay ---
const architectureOverlay = document.getElementById('architecture-overlay');
const architectureTrigger = document.getElementById('trigger-architecture');
const closeArchitectureBtn = document.getElementById('close-architecture-btn');

if (architectureTrigger && architectureOverlay && closeArchitectureBtn) {
    architectureTrigger.addEventListener('click', () => {
        document.body.classList.add('no-scroll');
        architectureOverlay.style.display = 'block';
        gsap.fromTo(architectureOverlay, { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: "power4.inOut" });
    });

    closeArchitectureBtn.addEventListener('click', () => {
        gsap.to(architectureOverlay, {
            yPercent: 100,
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => {
                architectureOverlay.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && architectureOverlay.style.display === 'block') {
            closeArchitectureBtn.click();
        }
    });
}

// --- Re-Booth Overlay ---
const reboothOverlay = document.getElementById('rebooth-overlay');
const reboothTrigger = document.getElementById('trigger-rebooth');
const closeReboothBtn = document.getElementById('close-rebooth-btn');

if (reboothTrigger && reboothOverlay && closeReboothBtn) {
    reboothTrigger.addEventListener('click', () => {
        document.body.classList.add('no-scroll');
        reboothOverlay.style.display = 'block';
        gsap.fromTo(reboothOverlay, { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: "power4.inOut" });
    });

    closeReboothBtn.addEventListener('click', () => {
        gsap.to(reboothOverlay, {
            yPercent: 100,
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => {
                reboothOverlay.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && reboothOverlay.style.display === 'block') {
            closeReboothBtn.click();
        }
    });
}

// --- Download CV Handler ---
const downloadCvBtn = document.getElementById('download-cv-btn');
if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = 'resume_kamal_P1.pdf';
        link.download = 'resume_kamal_P1.pdf';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}