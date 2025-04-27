document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const menuToggleBtn = document.getElementById('menu-toggle');
    const menuCloseBtn = document.getElementById('menu-close');
    const sideMenu = document.getElementById('side-menu');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const currentYearSpan = document.getElementById('current-year');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    // const lightboxCaption = document.getElementById('lightbox-caption'); // Optional

    // --- Side Menu Toggle ---
    if (menuToggleBtn && sideMenu && menuCloseBtn) {
        menuToggleBtn.addEventListener('click', () => {
            sideMenu.classList.add('open');
            // Optional: Prevent body scroll when menu is open
            // body.style.overflow = 'hidden';
        });

        menuCloseBtn.addEventListener('click', () => {
            closeSideMenu();
        });

        // Close menu when clicking outside of it
        document.addEventListener('click', (event) => {
            if (sideMenu.classList.contains('open') &&
                !sideMenu.contains(event.target) &&
                !menuToggleBtn.contains(event.target)) { // Check if click wasn't on toggle btn either
                closeSideMenu();
            }
        });

        // Close menu when a link is clicked
        sideMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Check if the link is an internal anchor link
                 if (link.getAttribute('href').startsWith('#')) {
                    closeSideMenu();
                    // Optional: smooth scroll to section (HTML already does this, but JS can enhance)
                    // const targetId = link.getAttribute('href');
                    // const targetElement = document.querySelector(targetId);
                    // if(targetElement) {
                    //    e.preventDefault(); // Prevent default jump
                    //    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // }
                 }
                 // If it's an external link, it will navigate away anyway
            });
        });

        function closeSideMenu() {
             sideMenu.classList.remove('open');
             // Optional: Restore body scroll
             // body.style.overflow = '';
        }
    }

    // --- Theme Toggle ---
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeIcon) themeIcon.className = 'fas fa-moon'; // Moon icon for dark
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            if (themeIcon) themeIcon.className = 'fas fa-sun'; // Sun icon for light
            localStorage.setItem('theme', 'light');
        }
    };

    if (themeToggleBtn && themeIcon) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(currentTheme);
        });

        // Apply saved theme on load
        const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
        // Optional: Check system preference if no theme saved
        // const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        applyTheme(savedTheme);

    } else {
        // Fallback or default theme if toggle button isn't found
        applyTheme('light');
    }

    // --- Product Scroll Buttons & Conditional Logic ---
    const scrollContainers = document.querySelectorAll('.product-scroll-container');

    scrollContainers.forEach(container => {
        const scrollArea = container.querySelector('.product-scroll');
        const prevBtn = container.querySelector('.scroll-btn.prev');
        const nextBtn = container.querySelector('.scroll-btn.next');

        if (!scrollArea) return; // Skip if no scroll area found

        // Check if scrolling is necessary
        // Use requestAnimationFrame to ensure layout is calculated
        requestAnimationFrame(() => {
            const isScrollable = scrollArea.scrollWidth > scrollArea.clientWidth + 2; // Add small buffer

            if (!isScrollable) {
                container.classList.add('no-scroll'); // Add class to hide buttons/hint via CSS
            } else {
                // Only add button listeners if scrolling IS needed
                if (prevBtn && nextBtn) {
                    const itemWidth = scrollArea.querySelector('.product-item')?.offsetWidth || 160; // Get item width or default + gap
                    const scrollAmount = itemWidth * 2; // Scroll by approx 2 items

                    prevBtn.addEventListener('click', () => {
                        scrollArea.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                    });

                    nextBtn.addEventListener('click', () => {
                        scrollArea.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    });
                }
            }
        });
    });


    // --- Lightbox Functionality (Added) ---
    const productImages = document.querySelectorAll('.product-item img');

    if (lightbox && lightboxImg && lightboxClose) {
        productImages.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from bubbling up if item itself has listener
                const imgSrc = img.getAttribute('src');
                const imgAlt = img.getAttribute('alt') || "ขยายรูปภาพสินค้า"; // Use alt text for caption
                lightboxImg.setAttribute('src', imgSrc);
                // if (lightboxCaption) lightboxCaption.textContent = imgAlt; // Set caption if element exists
                lightbox.classList.add('active');
                body.style.overflow = 'hidden'; // Prevent body scroll when lightbox is open
            });
        });

        // Close lightbox when close button is clicked
        lightboxClose.addEventListener('click', () => {
            closeLightbox();
        });

        // Close lightbox when clicking on the background overlay
        lightbox.addEventListener('click', (e) => {
            // Close only if the click is directly on the lightbox background (not the image)
            if (e.target === lightbox) {
                 closeLightbox();
            }
        });

        // Close lightbox with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            body.style.overflow = ''; // Restore body scroll
            // Optional: Clear image src to prevent brief display of old image next time
            // lightboxImg.setAttribute('src', '');
        }

    } else {
        console.warn("Lightbox elements not found. Image zooming disabled.");
    }


    // --- Update Copyright Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Smooth scroll adjustment for fixed header ---
    // Re-run on hash change or link click if needed more dynamically
    function adjustScrollForHeader() {
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 70; // Get header height or fallback
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                // Use setTimeout to allow browser default scroll first, then adjust
                setTimeout(() => {
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth" // Can be 'auto' if immediate jump is ok
                    });
                }, 0);
            }
        }
    }
    // Adjust scroll on initial load if there's a hash
    // adjustScrollForHeader();
    // Adjust scroll when hash changes (e.g., clicking internal links)
    // window.addEventListener('hashchange', adjustScrollForHeader);
    // Note: The CSS padding-top/margin-top approach on .content-section is often simpler

});