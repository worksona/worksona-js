#!/usr/bin/env python3
"""
Add Worksona header to all HTML files in docs/ and examples/ directories
"""

import os
import re

# Header CSS link to add in <head>
HEADER_CSS = '  <link rel="stylesheet" href="/docs/shared-header.css">\n'

# Header HTML to add after <body>
HEADER_HTML = '''  <!-- Worksona Header -->
  <header class="worksona-header">
    <div class="worksona-header-content">
      <a href="/" class="worksona-logo">
        <div class="worksona-logo-icon">W</div>
        <span class="worksona-logo-text">WORKSONA</span>
      </a>
      <button class="worksona-hamburger" id="worksonaHamburger" aria-label="Toggle navigation">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>

  <nav class="worksona-nav-overlay" id="worksonaNavOverlay">
    <div class="worksona-nav-content">
      <div class="worksona-nav-section">
        <h3>Getting Started</h3>
        <ul class="worksona-nav-links">
          <li><a href="/README.md">README</a></li>
          <li><a href="/QUICK_START.md">Quick Start Guide</a></li>
          <li><a href="/CHANGELOG.md">Changelog</a></li>
          <li><a href="https://www.npmjs.com/package/worksona-js">NPM Package</a></li>
        </ul>
      </div>

      <div class="worksona-nav-section">
        <h3>Documentation</h3>
        <ul class="worksona-nav-links">
          <li><a href="/docs/index.html">Documentation Hub</a></li>
          <li><a href="/docs/api-reference-swagger.html">API Reference</a></li>
          <li><a href="/docs/code-examples-hub.html">Code Examples</a></li>
          <li><a href="/WORKSONA_DOCUMENTATION.md">Complete Documentation</a></li>
        </ul>
      </div>

      <div class="worksona-nav-section">
        <h3>SDK & API</h3>
        <ul class="worksona-nav-links">
          <li><a href="/worksona.js">Library SDK (worksona.js)</a></li>
          <li><a href="/worksona.min.js">Minified Library</a></li>
          <li><a href="/worksona.d.ts">TypeScript Definitions</a></li>
          <li><a href="/worksona-server.js">API Server</a></li>
        </ul>
      </div>

      <div class="worksona-nav-section">
        <h3>Interactive Demos</h3>
        <ul class="worksona-nav-links">
          <li><a href="/docs/endpoint-api-demo.html">Endpoint API Demo</a></li>
          <li><a href="/docs/library-internal-demo.html">Library Demo</a></li>
          <li><a href="/docs/delegation-demo.html">Delegation Workflow Builder</a></li>
          <li><a href="/examples/dual-mode-demo.html">Dual Mode Demo</a></li>
          <li><a href="/examples/frontier-models-demo.html">Frontier Models Demo</a></li>
        </ul>
      </div>

      <div class="worksona-nav-section">
        <h3>Examples & Tutorials</h3>
        <ul class="worksona-nav-links">
          <li><a href="/examples/">Examples Directory</a></li>
          <li><a href="/examples/README.md">Examples Guide</a></li>
          <li><a href="/examples/dual-mode-demo.js">Node.js Demo Script</a></li>
        </ul>
      </div>

      <div class="worksona-nav-section">
        <h3>Community</h3>
        <ul class="worksona-nav-links">
          <li><a href="/marketing/index.html">Marketing Site</a></li>
          <li><a href="https://github.com/worksona/worksona-js">GitHub Repository</a></li>
        </ul>
      </div>
    </div>
  </nav>

'''

# Header JS to add before </body>
HEADER_JS = '  <script src="/docs/shared-header.js"></script>\n'


def add_header_to_file(filepath):
    """Add header to a single HTML file"""
    print(f"Processing: {filepath}")

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if header already exists
        if 'worksona-header' in content:
            print(f"  ✓ Header already exists, skipping")
            return

        modified = False

        # Add CSS link in <head> before </head>
        if HEADER_CSS.strip() not in content:
            content = content.replace('</head>', f'{HEADER_CSS}</head>')
            modified = True
            print(f"  ✓ Added header CSS link")

        # Add header HTML after <body>
        if '<body>' in content and 'worksona-header' not in content:
            content = content.replace('<body>', f'<body>\n{HEADER_HTML}')
            modified = True
            print(f"  ✓ Added header HTML")
        elif '<body class="' in content:
            # Handle <body class="...">
            content = re.sub(r'(<body[^>]*>)', rf'\1\n{HEADER_HTML}', content)
            modified = True
            print(f"  ✓ Added header HTML (body with class)")

        # Add header JS before </body>
        if HEADER_JS.strip() not in content:
            content = content.replace('</body>', f'{HEADER_JS}</body>')
            modified = True
            print(f"  ✓ Added header JS")

        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ File updated successfully")
        else:
            print(f"  ℹ️  No changes needed")

    except Exception as e:
        print(f"  ❌ Error: {e}")


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # Process docs directory
    docs_dir = os.path.join(base_dir, 'docs')
    print(f"\n📁 Processing docs directory: {docs_dir}\n")

    if os.path.exists(docs_dir):
        for filename in os.listdir(docs_dir):
            if filename.endswith('.html') and filename not in ['header-snippet.html']:
                filepath = os.path.join(docs_dir, filename)
                add_header_to_file(filepath)
                print()

    # Process examples directory
    examples_dir = os.path.join(base_dir, 'examples')
    print(f"\n📁 Processing examples directory: {examples_dir}\n")

    if os.path.exists(examples_dir):
        for filename in os.listdir(examples_dir):
            if filename.endswith('.html'):
                filepath = os.path.join(examples_dir, filename)
                add_header_to_file(filepath)
                print()

    print("\n✅ Header addition complete!")
    print("\nNote: This script only adds the header structure.")
    print("You may still need to adjust CSS for light theme if files have dark themes.")


if __name__ == '__main__':
    main()
