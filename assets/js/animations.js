// Scroll animations for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Create an intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Function to add animation classes to elements
    function initializeAnimations() {
        // Animate service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.classList.add('fade-in');
            card.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(card);
        });

        // Animate step cards
        const stepCards = document.querySelectorAll('.step-card');
        stepCards.forEach((card, index) => {
            card.classList.add('slide-in-left');
            card.style.transitionDelay = `${index * 0.15}s`;
            observer.observe(card);
        });

        // Animate dashboard sections
        const dashboardSections = document.querySelectorAll('.dashboard-section');
        dashboardSections.forEach((section, index) => {
            section.classList.add('fade-in');
            section.style.transitionDelay = `${index * 0.3}s`;
            observer.observe(section);
        });

        // Animate expertise items
        const expertiseItems = document.querySelectorAll('.expertise-item');
        expertiseItems.forEach((item, index) => {
            const animationClass = index % 2 === 0 ? 'slide-in-left' : 'slide-in-right';
            item.classList.add(animationClass);
            item.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(item);
        });

        // Animate value cards
        const valueCards = document.querySelectorAll('.value-card');
        valueCards.forEach((card, index) => {
            card.classList.add('scale-in');
            card.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(card);
        });

        // Animate form elements
        const formElements = document.querySelectorAll('.form-group, .contact-form');
        formElements.forEach((element, index) => {
            element.classList.add('fade-in');
            element.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(element);
        });

        // Animate book cover
        const bookCover = document.querySelector('.book-cover-container');
        if (bookCover) {
            bookCover.classList.add('bounce-in');
            observer.observe(bookCover);
        }

        // Animate hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('fade-in');
            observer.observe(heroContent);
        }

        // Animate welcome text
        const welcomeText = document.querySelector('.welcome-text');
        if (welcomeText) {
            welcomeText.classList.add('fade-in');
            observer.observe(welcomeText);
        }

        // Animate section titles
        const sectionTitles = document.querySelectorAll('.section-title, .page-title');
        sectionTitles.forEach(title => {
            title.classList.add('fade-in');
            observer.observe(title);
        });

        // Animate transaction items as they appear
        const transactionItems = document.querySelectorAll('.transaction-item');
        transactionItems.forEach((item, index) => {
            item.classList.add('slide-in-right');
            item.style.transitionDelay = `${index * 0.05}s`;
            observer.observe(item);
        });

        // Animate summary cards
        const summaryCards = document.querySelectorAll('.summary-card');
        summaryCards.forEach((card, index) => {
            card.classList.add('scale-in');
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }

    // Initialize animations
    initializeAnimations();

    // Re-initialize animations for dynamically added content (like dashboard transactions)
    const reinitializeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if it's a transaction item
                        if (node.classList && node.classList.contains('transaction-item')) {
                            node.classList.add('slide-in-right');
                            observer.observe(node);
                        }
                        // Check for any child elements that need animation
                        const animatableElements = node.querySelectorAll && node.querySelectorAll('.service-card, .step-card, .value-card, .transaction-item');
                        if (animatableElements) {
                            animatableElements.forEach((element, index) => {
                                if (element.classList.contains('service-card')) {
                                    element.classList.add('fade-in');
                                } else if (element.classList.contains('step-card')) {
                                    element.classList.add('slide-in-left');
                                } else if (element.classList.contains('value-card')) {
                                    element.classList.add('scale-in');
                                } else if (element.classList.contains('transaction-item')) {
                                    element.classList.add('slide-in-right');
                                }
                                element.style.transitionDelay = `${index * 0.1}s`;
                                observer.observe(element);
                            });
                        }
                    }
                });
            }
        });
    });

    // Observe the document for dynamic content changes
    reinitializeObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Add navbar animation on scroll
    let lastScrollTop = 0;
    const navbar = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});