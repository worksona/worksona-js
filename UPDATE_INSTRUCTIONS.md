# HTML Files Update Instructions

## Files to Update
1. /docs/index.html
2. /docs/endpoint-api-demo.html
3. /docs/library-internal-demo.html
4. /docs/delegation-demo.html
5. /docs/code-examples-hub.html
6. /docs/api-reference-swagger.html

## Changes for Each File

### Step 1: Add Shared Header CSS
Add this as the FIRST line in `<head>`:
```html
<link rel="stylesheet" href="/docs/shared-header.css">
```

### Step 2: Add Shared Header HTML
Add immediately after `<body>` tag (from /docs/header-snippet.html lines 5-79):
```html
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
  <!-- Full nav content from header-snippet.html -->
</nav>
```

### Step 3: Add Shared Header JS
Add before `</body>` tag:
```html
<script src="/docs/shared-header.js"></script>
```

### Step 4: Update CSS Variables
Replace dark theme variables in `:root` with:
```css
--primary: #2563eb;
--secondary: #7c3aed;
--success: #10b981;
--gray-50: #f8fafc;
--gray-100: #f1f5f9;
--gray-200: #e2e8f0;
--gray-500: #64748b;
--gray-600: #475569;
--gray-700: #334155;
--gray-800: #1e293b;
--gray-900: #0f172a;
```

### Step 5: Update Body Styles
```css
body {
  background: white;
  color: var(--gray-900);
}
```

### Step 6: Update Component Styles
- Cards/Panels: `background: white; border: 2px solid var(--gray-200);`
- Headers: `color: var(--primary);` or `var(--gray-900)`
- Text: `color: var(--gray-700);` for secondary
- Remove ALL gradients (replace with flat colors)
- Buttons: `background: var(--primary);` (flat, no gradients)
- Border radius: max 4px or 0px
- Remove shimmer animations
- Remove emojis from HTML content

### Step 7: Specific Element Updates

**Headers:**
```css
.header, .page-header {
  background: white;
  border-bottom: 2px solid var(--gray-200);
  color: var(--gray-900);
}
```

**Sections/Cards:**
```css
.section, .card, .panel {
  background: white;
  border: 2px solid var(--gray-200);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
```

**Buttons:**
```css
.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--secondary);
}
```

**Forms:**
```css
input, select, textarea {
  background: white;
  color: var(--gray-900);
  border: 2px solid var(--gray-200);
}
```

### Emojis to Remove
Search for and remove these from HTML content (keep in variable names/code):
- 🤖 🔌 📚 📁 💬 🎨 🔧 📊 🚀 🔄 🎯
- Replace with text or remove entirely

## Color Mapping Reference
| Old Dark Theme | New Light Theme |
|----------------|-----------------|
| `--bg-dark: #0a0e27` | `background: white` |
| `--bg-card: #131829` | `background: white` |
| `--text-primary: #e2e8f0` | `color: var(--gray-900)` |
| `--text-secondary: #94a3b8` | `color: var(--gray-700)` |
| `--accent-blue: #3b82f6` | `--primary: #2563eb` |
| Gradients | Flat colors |
