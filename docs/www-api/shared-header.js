// Shared Header JavaScript for Worksona.js Documentation

function initWorksonaHeader() {
  // Create backdrop element
  let backdrop = document.querySelector('.worksona-nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'worksona-nav-backdrop';
    backdrop.id = 'worksonaNavBackdrop';
    document.body.appendChild(backdrop);
  }

  // Hamburger Menu Toggle
  const hamburger = document.getElementById('worksonaHamburger');
  const navOverlay = document.getElementById('worksonaNavOverlay');

  if (hamburger && navOverlay) {
    const closeMenu = () => {
      hamburger.classList.remove('active');
      navOverlay.classList.remove('active');
      backdrop.classList.remove('active');
    };

    const openMenu = () => {
      hamburger.classList.add('active');
      navOverlay.classList.add('active');
      backdrop.classList.add('active');
    };

    hamburger.addEventListener('click', () => {
      if (navOverlay.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.worksona-nav-links a');
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking backdrop
    backdrop.addEventListener('click', closeMenu);

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
        closeMenu();
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWorksonaHeader);
} else {
  initWorksonaHeader();
}
