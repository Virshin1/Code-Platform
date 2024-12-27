document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    let isAnimating = false;
    let currentIndex = 0;

    // Get index of section in navigation
    function getSectionIndex(sectionId) {
        return Array.from(navLinks).findIndex(link => link.getAttribute('href') === '#' + sectionId);
    }

    function hideAllSections() {
        sections.forEach(section => {
            section.classList.add('hidden');
        });
    }

    function switchSection(targetId) {
        if (isAnimating) return;
        isAnimating = true;

        // Get current and target sections
        const currentSection = document.querySelector('.section:not(.hidden)');
        const targetSection = document.getElementById(targetId);

        if (!targetSection || currentSection === targetSection) {
            isAnimating = false;
            return;
        }

        // Determine animation direction
        const currentSectionIndex = getSectionIndex(currentSection.id);
        const targetSectionIndex = getSectionIndex(targetId);
        const isMovingLeft = targetSectionIndex < currentSectionIndex;

        // Update navigation
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector(`a[href="#${targetId}"]`).classList.add('active');

        // Set initial position for target section
        targetSection.style.transform = `translateX(${isMovingLeft ? '-100%' : '100%'})`;
        targetSection.style.opacity = '0';
        targetSection.classList.remove('hidden');

        // Force reflow
        void targetSection.offsetWidth;

        // Animate current section out
        currentSection.style.transform = `translateX(${isMovingLeft ? '100%' : '-100%'})`;
        currentSection.style.opacity = '0';
        
        // Animate target section in
        targetSection.style.transform = 'translateX(0)';
        targetSection.style.opacity = '1';

        setTimeout(() => {
            currentSection.classList.add('hidden');
            currentSection.style.transform = '';
            currentSection.style.opacity = '';
            targetSection.style.transform = '';
            targetSection.style.opacity = '';
            isAnimating = false;
        }, 500);
    }

    // Set up click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            switchSection(targetId);
        });
    });

    // Initialize first section
    hideAllSections();
    const firstSection = document.getElementById('hero');
    firstSection.classList.remove('hidden');
    document.querySelector('a[href="#hero"]').classList.add('active');

    // Add this new code for pricing toggle
    const billingToggle = document.getElementById('billing-toggle');
    const prices = document.querySelectorAll('.price');
    const originalPrices = {
        free: 0,
        pro: 19,
        team: 49
    };

    billingToggle.addEventListener('change', () => {
        prices.forEach(priceElement => {
            const currentPrice = parseFloat(priceElement.textContent.replace('$', ''));
            let newPrice;

            if (billingToggle.checked) {
                // Yearly pricing (20% discount)
                newPrice = currentPrice === 0 ? 0 : Math.round(currentPrice * 12 * 0.8);
                priceElement.innerHTML = `$${newPrice}<span>/year</span>`;
            } else {
                // Monthly pricing
                if (priceElement.closest('.pricing-card').querySelector('h3').textContent === 'Free') {
                    newPrice = 0;
                } else if (priceElement.closest('.pricing-card').querySelector('h3').textContent === 'Pro') {
                    newPrice = originalPrices.pro;
                } else {
                    newPrice = originalPrices.team;
                }
                priceElement.innerHTML = `$${newPrice}<span>/month</span>`;
            }

            // Add animation classes
            priceElement.classList.add('price-updated');
            setTimeout(() => {
                priceElement.classList.remove('price-updated');
            }, 300);
        });
    });
});
