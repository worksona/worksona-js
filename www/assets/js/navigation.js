// Worksona.js Unified Navigation System

(function() {
  'use strict';

  // Navigation configuration
  const NAV_CONFIG = {
    sections: [
      {
        title: 'Overview',
        links: [
          { label: 'Home', href: '/index.html' },
          { label: 'Project Overview', href: '/overview.html' },
          { label: 'GitHub Repository', href: 'https://github.com/worksona/worksona-js', external: true },
          { label: 'NPM Package', href: 'https://www.npmjs.com/package/worksona-js', external: true }
        ]
      },
      {
        title: 'Documentation',
        links: [
          { label: 'Documentation Hub', href: '/docs/index.html' },
          { label: 'API Reference', href: '/docs/api-reference-swagger.html' },
          { label: 'Code Examples', href: '/docs/code-examples-hub.html' }
        ]
      },
      {
        title: 'Interactive Demos',
        links: [
          { label: 'Demos Home', href: '/demos/index.html' },
          { label: 'Endpoint API Demo', href: '/demos/endpoint-api-demo.html' },
          { label: 'Library Demo', href: '/demos/library-internal-demo.html' },
          { label: 'Delegation Workflow', href: '/demos/delegation-demo.html' },
          { label: 'Dual Mode Demo', href: '/demos/examples/dual-mode-demo.html' },
          { label: 'Frontier Models', href: '/demos/examples/frontier-models-demo.html' }
        ]
      },
      {
        title: 'Vibe Coding',
        links: [
          { label: 'Vibe Coding Home', href: '/vibe-coding/index.html' },
          { label: 'LLM.txt', href: '/llm.txt' },
          { label: 'AI Coding Prompt', href: '/vibe-coding/AI_CODING_PROMPT.md' },
          { label: 'Example Chatbot', href: '/vibe-coding/examples/example-1-chatbot.html' },
          { label: 'Content Pipeline', href: '/vibe-coding/examples/example-2-content-pipeline.html' },
          { label: 'Workflow Builder', href: '/vibe-coding/examples/example-3-workflow-builder.html' }
        ]
      },
      {
        title: 'Marketing',
        links: [
          { label: 'Marketing Site', href: '/marketing/index.html' }
        ]
      },
      {
        title: 'Downloads',
        links: [
          { label: 'worksona.min.js', href: '/downloads/worksona.min.js', download: true },
          { label: 'worksona.min.js.zip', href: '/downloads/worksona.min.js.zip', download: true },
          { label: 'worksona.js', href: '/downloads/worksona.js', download: true },
          { label: 'worksona-server.js', href: '/downloads/worksona-server.js', download: true },
          { label: 'Type Definitions', href: '/downloads/worksona.d.ts', download: true }
        ]
      }
    ]
  };

  // Get base path for navigation
  function getBasePath() {
    // Detect if we're in the www-api directory structure
    const path = window.location.pathname;
    if (path.includes('/www-api/')) {
      // Find the base - everything before /www-api/ plus /www-api
      const match = path.match(/(.*\/www-api)/);
      return match ? match[1] : '';
    }
    return '';
  }

  // Build navigation HTML
  function buildNavHTML() {
    const basePath = getBasePath();
    let html = '';

    NAV_CONFIG.sections.forEach(section => {
      html += `
        <div class="worksona-nav-section">
          <h3>${section.title}</h3>
          <ul class="worksona-nav-links">`;

      section.links.forEach(link => {
        const href = link.external ? link.href : basePath + link.href;
        const target = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
        const download = link.download ? ' download' : '';
        const active = isLinkActive(link.href) ? ' class="active"' : '';

        html += `
            <li>
              <a href="${href}"${target}${download}${active}>
                ${link.label}
              </a>
            </li>`;
      });

      html += `
          </ul>
        </div>`;
    });

    return html;
  }

  // Check if link is active
  function isLinkActive(href) {
    const currentPath = window.location.pathname;
    const basePath = getBasePath();
    const fullHref = basePath + href;

    // Exact match
    if (currentPath === fullHref) return true;

    // Index file match
    if (currentPath.endsWith('/') && fullHref === currentPath + 'index.html') return true;
    if (currentPath.endsWith('/index.html') && fullHref === currentPath) return true;

    return false;
  }

  // Create header HTML
  function createHeaderHTML() {
    const basePath = getBasePath();
    return `
      <div class="worksona-header-content">
        <a href="${basePath}/index.html" class="worksona-logo">
          <div class="worksona-logo-icon">W</div>
          <span class="worksona-logo-text">WORKSONA</span>
        </a>
        <div class="worksona-header-links">
          <a href="${basePath}/docs/index.html">Docs</a>
          <a href="${basePath}/demos/index.html">Demos</a>
          <a href="${basePath}/vibe-coding/index.html">Vibe Coding</a>
          <a href="https://github.com/worksona/worksona-js" target="_blank" rel="noopener noreferrer" class="btn-primary">GitHub</a>
        </div>
        <button class="worksona-hamburger" id="worksonaHamburger" aria-label="Toggle navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>`;
  }

  // Initialize navigation
  function initNavigation() {
    // Create header
    let header = document.querySelector('.worksona-header');
    if (!header) {
      header = document.createElement('header');
      header.className = 'worksona-header';
      document.body.insertBefore(header, document.body.firstChild);
    }
    header.innerHTML = createHeaderHTML();

    // Create navigation
    let nav = document.querySelector('.worksona-nav');
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'worksona-nav';
      nav.id = 'worksonaNav';
      // Insert nav as second child of body (right after header)
      if (document.body.children.length > 1) {
        document.body.insertBefore(nav, document.body.children[1]);
      } else {
        document.body.appendChild(nav);
      }
    }
    nav.innerHTML = buildNavHTML();

    // Create backdrop for mobile
    let backdrop = document.querySelector('.worksona-nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'worksona-nav-backdrop';
      backdrop.id = 'worksonaNavBackdrop';
      document.body.appendChild(backdrop);
    }

    // Setup event listeners
    setupEventListeners();

    // Ensure content has proper class
    ensureContentWrapper();
  }

  // Setup event listeners for mobile menu
  function setupEventListeners() {
    const hamburger = document.getElementById('worksonaHamburger');
    const nav = document.getElementById('worksonaNav');
    const backdrop = document.getElementById('worksonaNavBackdrop');

    if (!hamburger || !nav || !backdrop) return;

    const closeMenu = () => {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    };

    const openMenu = () => {
      hamburger.classList.add('active');
      nav.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (nav.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when clicking a link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close menu when clicking backdrop
    backdrop.addEventListener('click', closeMenu);

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close menu on window resize to desktop size
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) {
        closeMenu();
      }
    });
  }

  // Ensure main content has proper wrapper class
  function ensureContentWrapper() {
    const main = document.querySelector('main');
    if (main && !main.classList.contains('worksona-content')) {
      main.classList.add('worksona-content');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }

  // Export for programmatic access
  window.WorksonaNav = {
    init: initNavigation,
    config: NAV_CONFIG
  };
})();
