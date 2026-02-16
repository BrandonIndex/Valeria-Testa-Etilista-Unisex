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

    // Listen for resize
    window.addEventListener('resize', handleMobileReviews);
});
