document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // --- Mobile Menu Logic ---
    // Start CLOSED (active removed)

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Animate Hamburger
        const bars = hamburger.querySelectorAll('.bar');
        // Simple toggle logic or animation class could be added here
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // --- Theme Toggle Logic ---
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to Dark
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    // --- Smooth Scrolling relative links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll Animations (IntersectionObserver) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // --- Mobile Reviews Toggle ---
    const reviewsContainer = document.querySelector('.reviews-container');
    const loadMoreBtn = document.getElementById('loadMoreReviews');
    const allReviews = document.querySelectorAll('.review-card');

    function handleMobileReviews() {
        if (window.innerWidth <= 768) {
            // Show only first 4
            allReviews.forEach((card, index) => {
                if (index >= 4) {
                    card.classList.add('mobile-hidden');
                } else {
                    card.classList.remove('mobile-hidden');
                }
            });
            // Show button if there are more than 4 reviews
            if (allReviews.length > 4) {
                if (loadMoreBtn && loadMoreBtn.parentElement) {
                    loadMoreBtn.parentElement.style.display = 'block';
                    loadMoreBtn.textContent = 'Mostrar todo';
                    loadMoreBtn.setAttribute('data-expanded', 'false');
                }
            } else {
                if (loadMoreBtn && loadMoreBtn.parentElement) loadMoreBtn.parentElement.style.display = 'none';
            }
        } else {
            // Desktop: Show all
            allReviews.forEach(card => card.classList.remove('mobile-hidden'));
            if (loadMoreBtn && loadMoreBtn.parentElement) loadMoreBtn.parentElement.style.display = 'none';
        }
    }

    // Initial check (delay slightly to ensure DOM is ready if needed, though we are in DOMContentLoaded)
    handleMobileReviews();

    // Toggle Button Click
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const isExpanded = loadMoreBtn.getAttribute('data-expanded') === 'true';

            allReviews.forEach((card, index) => {
                if (index >= 4) {
                    if (isExpanded) {
                        card.classList.add('mobile-hidden');
                    } else {
                        card.classList.remove('mobile-hidden');
                    }
                }
            });

            if (!isExpanded) {
                loadMoreBtn.textContent = 'Ver menos';
                loadMoreBtn.setAttribute('data-expanded', 'true');
            } else {
                loadMoreBtn.textContent = 'Mostrar todo';
                loadMoreBtn.setAttribute('data-expanded', 'false');
                document.getElementById('resenas').scrollIntoView({ behavior: 'smooth' }); // Scroll back to top of reviews
            }
        });
    }

    // --- Business Status (Open/Closed) ---
    function updateBusinessStatus() {
        const statusBadge = document.getElementById('status-badge');
        if (!statusBadge) return;

        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const time = hour + minutes / 60;

        let isOpen = false;

        // Schedule:
        // Domingo (0), Lunes (1): Cerrado
        // Martes (2) - Sabado (6): 09:30 - 12:30 AND 16:00 - 20:30

        if (day >= 2 && day <= 6) {
            // Check Morning Shift: 9:30 (9.5) to 12:30 (12.5)
            if (time >= 9.5 && time < 12.5) {
                isOpen = true;
            }
            // Check Afternoon Shift: 16:00 (16) to 20:30 (20.5)
            else if (time >= 16 && time < 20.5) {
                isOpen = true;
            }
        }

        if (isOpen) {
            statusBadge.textContent = 'Abierto Ahora';
            statusBadge.className = 'badge status-badge status-open';
            statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> Abierto Ahora';
        } else {
            statusBadge.textContent = 'Cerrado Ahora';
            statusBadge.className = 'badge status-badge status-closed';
            statusBadge.innerHTML = '<i class="fas fa-times-circle"></i> Cerrado Ahora';
        }
    }

    updateBusinessStatus();
    setInterval(updateBusinessStatus, 60000); // Update every minute

    // --- Interactive Hero Background ---
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            heroSection.style.backgroundPosition = `${x}% ${y}%`;
        });
    }

    // Listen for resize
    window.addEventListener('resize', handleMobileReviews);
});
