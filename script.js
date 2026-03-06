// ============================================
// Mobile Menu Toggle
// ============================================
const menuToggle = document.querySelectorAll('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

function toggleMenu() {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
}

menuToggle.forEach(btn => btn.addEventListener('click', toggleMenu));

// ============================================
// Reveal Animations on Scroll
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

// Apply animation styles initially
document.querySelectorAll('.project-card, .skill-category, .timeline-item, .hero-text, .terminal-card, .stat-card').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)';
    revealObserver.observe(el);
});

// ============================================
// Active Navigation Highlighting on Scroll
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
});

sections.forEach(section => {
    navObserver.observe(section);
});

// ============================================
// Dynamic Copyright Year
// ============================================
const yearEl = document.getElementById('copyright-year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ============================================
// Animated Counter for Stat Cards
// ============================================
function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 40;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 30);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            const target = parseInt(entry.target.dataset.target);
            const suffix = entry.target.dataset.suffix || '';
            animateCounter(entry.target, target, suffix);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
    statObserver.observe(el);
});

// ============================================
// Enhanced Form Submission (FormSubmit.co)
// ============================================
document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formStatus = document.getElementById('formStatus');
    const submitBtn = e.target.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('span');
    const btnIcon = submitBtn.querySelector('i');

    // 1. Get Data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const honey = document.getElementsByName('_honey')[0].value;

    // 2. Honeypot Check (Spam Prevention)
    if (honey) return;

    // 3. UI Loading State
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    btnIcon.className = 'fa-solid fa-circle-notch fa-spin';
    formStatus.style.display = 'none';

    // 4. Construct Data Payload
    const formData = {
        Name: name,
        Email: email,
        Subject: subject,
        Message: message,
        _subject: `Portfolio Contact: ${subject} (from ${name})`,
        _template: "table",
        _captcha: "false",
        _replyto: email
    };

    try {
        const response = await fetch('https://formsubmit.co/ajax/nairakash128@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            formStatus.innerHTML = '<i class="fa-solid fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.';
            formStatus.className = 'status-msg success';
            formStatus.style.display = 'block';
            e.target.reset();
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        formStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Failed to send. Please email me directly at nairakash128@gmail.com';
        formStatus.className = 'status-msg error';
        formStatus.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
        btnIcon.className = 'fa-solid fa-paper-plane';

        setTimeout(() => {
            if (formStatus.classList.contains('success')) {
                formStatus.style.display = 'none';
            }
        }, 8000);
    }
});
