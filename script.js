document.addEventListener('DOMContentLoaded', () => {
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const mainContainer = document.querySelector('.main-container'); // If pushing content

    if (menuToggleBtn && sidebar && overlay) {
        // Function to toggle the sidebar
        const toggleSidebar = () => {
            sidebar.classList.toggle('is-open');
            overlay.classList.toggle('is-visible');
            // Optional: Add class to body if you need it for other styles (like pushing content)
            // document.body.classList.toggle('sidebar-open');
        };

        // Event listener for the button
        menuToggleBtn.addEventListener('click', toggleSidebar);

        // Event listener for the overlay (to close when clicking outside)
        overlay.addEventListener('click', toggleSidebar);

        // Optional: Close sidebar when a navigation link is clicked
        const sidebarLinks = sidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (sidebar.classList.contains('is-open')) {
                    // Check if it's an anchor link for the current page
                    if (link.getAttribute('href').startsWith('#')) {
                         toggleSidebar();
                         // Smooth scroll to section
                         const targetId = link.getAttribute('href');
                         const targetElement = document.querySelector(targetId);
                         if(targetElement) {
                            // Account for header height if fixed/sticky
                             const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                             const elementPosition = targetElement.getBoundingClientRect().top;
                             const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20; // Extra offset

                             window.scrollTo({
                                 top: offsetPosition,
                                 behavior: "smooth"
                             });
                         }
                    } else {
                        // If it's a link to another page, just close sidebar
                         toggleSidebar();
                    }
                }
            });
        });
    } else {
        console.error("Sidebar toggle button, sidebar, or overlay element not found!");
    }
});