document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       THEME MANAGER (Light / Dark)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check saved theme or system preference
    const getPreferredTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    // Initialize theme
    setTheme(getPreferredTheme());

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    /* ==========================================================================
       LANGUAGE MANAGER (EN / VI)
       ========================================================================== */
    const langToggleBtn = document.getElementById('lang-toggle');
    let currentLang = localStorage.getItem('lang') || 'vi';

    const updateTranslations = (lang) => {
        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem('lang', lang);

        // Update inline text attributes
        const translatableElements = document.querySelectorAll('[data-vi][data-en]');
        translatableElements.forEach(el => {
            el.textContent = lang === 'vi' ? el.getAttribute('data-vi') : el.getAttribute('data-en');
        });

        // Update input placeholders
        const translatablePlaceholders = document.querySelectorAll('[data-vi-placeholder][data-en-placeholder]');
        translatablePlaceholders.forEach(el => {
            el.placeholder = lang === 'vi' ? el.getAttribute('data-vi-placeholder') : el.getAttribute('data-en-placeholder');
        });

        // Reset and trigger typing effect with new language
        initTypingAnimation(lang);
    };

    // Initialize Language
    updateTranslations(currentLang);

    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'vi' ? 'en' : 'vi';
        updateTranslations(currentLang);
    });

    /* ==========================================================================
       TYPING ANIMATION (Bilingual)
       ========================================================================== */
    const typingSpan = document.getElementById('typing-text');
    let typingTimeout;
    let eraseTimeout;
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const titles = {
        vi: [
            "Digital Marketing Leader",
            "Chuyên Gia Performance Marketing",
            "Nhà Quản Trị Tăng Trưởng Dựa Trên Dữ Liệu",
            "Trưởng Nhóm Chiến Dịch Sáng Tạo"
        ],
        en: [
            "Digital Marketing Leader",
            "Performance Marketing Specialist",
            "Data-Driven Growth Manager",
            "Creative Campaign Strategist"
        ]
    };

    function initTypingAnimation(lang) {
        // Clear active timeouts to prevent conflicts during language change
        clearTimeout(typingTimeout);
        clearTimeout(eraseTimeout);
        
        typingSpan.textContent = '';
        wordIndex = 0;
        charIndex = 0;
        isDeleting = false;
        
        typeEffect(lang);
    }

    function typeEffect(lang) {
        const currentWords = titles[lang];
        const currentWord = currentWords[wordIndex];
        
        if (isDeleting) {
            // Erase characters
            typingSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Type characters
            typingSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = isDeleting ? 30 : 80;

        if (!isDeleting && charIndex === currentWord.length) {
            // Pause at the end of the word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to the next word
            wordIndex = (wordIndex + 1) % currentWords.length;
            typingSpeed = 500;
        }

        typingTimeout = setTimeout(() => typeEffect(lang), typingSpeed);
    }

    /* ==========================================================================
       SCROLL REVEAL & INTERACTIVE SKILL BARS
       ========================================================================== */
    // Store original skill bar widths and set to 0% for animation
    const skillProgresses = document.querySelectorAll('.skill-progress');
    skillProgresses.forEach(progress => {
        const targetWidth = progress.style.width;
        progress.setAttribute('data-target-width', targetWidth);
        progress.style.width = '0%';
    });

    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's the skills section, animate the progress bars
                if (entry.target.id === 'skills' || entry.target.querySelector('.skill-progress')) {
                    animateSkillBars();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    function animateSkillBars() {
        skillProgresses.forEach(progress => {
            const targetWidth = progress.getAttribute('data-target-width');
            setTimeout(() => {
                progress.style.width = targetWidth;
            }, 100);
        });
    }

    // Active navigation highlight on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       MOBILE NAVIGATION DRAWER
       ========================================================================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        mobileMenuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });

    /* ==========================================================================
       CONTACT FORM SUBMISSION WITH SIMULATED FEEDBACK
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formAlert = document.getElementById('form-alert');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnContent = submitBtn.innerHTML;
        
        // Disable button & show spinner/sending state
        submitBtn.disabled = true;
        submitBtn.innerHTML = currentLang === 'vi' 
            ? '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...' 
            : '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        // Simulate network latency (1.5 seconds)
        setTimeout(() => {
            // Clear inputs
            contactForm.reset();
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;

            // Display success alert
            formAlert.className = 'form-alert success';
            formAlert.innerHTML = currentLang === 'vi'
                ? '<i class="fa-solid fa-circle-check"></i> Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công. Tôi sẽ liên hệ lại sớm nhất.'
                : '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully. I will get back to you shortly.';
            
            // Hide alert after 5 seconds
            setTimeout(() => {
                formAlert.className = 'form-alert hidden';
            }, 6000);
            
        }, 1500);
    });

    /* ==========================================================================
       PRINT CV / PDF HELPER
       ========================================================================== */
    const downloadCvBtn = document.getElementById('download-cv');
    downloadCvBtn.addEventListener('click', () => {
        // Trigger default print command. Custom @media print CSS will format this beautifully to A4.
        window.print();
    });
});
