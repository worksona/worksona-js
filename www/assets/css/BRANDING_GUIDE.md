# Worksona.js Branding Guide

Quick reference for developers working with the unified branding system.

## Getting Started

### Basic Page Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Page Title - Worksona.js</title>
  
  <!-- Required Stylesheets (in this order) -->
  <link rel="stylesheet" href="/assets/css/worksona-branding.css">
  <link rel="stylesheet" href="/assets/css/navigation.css">
</head>
<body>
  <!-- Include navigation header -->
  <!-- Your content here -->
</body>
</html>
```

## CSS Variables Reference

### Colors

```css
/* Primary Colors */
--worksona-primary: #3b82f6;      /* Main blue */
--worksona-primary-dark: #2563eb;
--worksona-primary-light: #60a5fa;

/* Secondary & Accents */
--worksona-secondary: #8b5cf6;    /* Purple */
--worksona-accent: #06b6d4;       /* Cyan */
--worksona-success: #10b981;      /* Green */
--worksona-warning: #f59e0b;      /* Orange */
--worksona-danger: #ef4444;       /* Red */

/* Grays (50 = lightest, 900 = darkest) */
--worksona-gray-50: #f8fafc;
--worksona-gray-100: #f1f5f9;
--worksona-gray-200: #e2e8f0;
--worksona-gray-300: #cbd5e1;
--worksona-gray-400: #94a3b8;
--worksona-gray-500: #64748b;
--worksona-gray-600: #475569;
--worksona-gray-700: #334155;
--worksona-gray-800: #1e293b;
--worksona-gray-900: #0f172a;
```

### Layout Variables

```css
--worksona-border-radius: 0;              /* Sharp corners */
--worksona-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--worksona-shadow-md: 0 2px 8px rgba(0, 0, 0, 0.1);
--worksona-shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.15);
--worksona-shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.2);
--worksona-transition: all 0.2s ease;
```

## Component Examples

### Buttons

```html
<!-- Primary Button -->
<button class="btn btn-primary">Get Started</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Learn More</button>

<!-- Outline Button -->
<button class="btn btn-outline">View Docs</button>

<!-- Success Button -->
<button class="btn btn-success">Save</button>

<!-- Disabled Button -->
<button class="btn btn-primary" disabled>Loading...</button>
```

### Hero Section

```html
<section class="hero">
  <div class="hero-content">
    <h1>Your Amazing Title</h1>
    <p class="subtitle">A compelling subtitle that describes your feature</p>
    <div class="hero-buttons">
      <a href="#" class="btn btn-primary">Get Started</a>
      <a href="#" class="btn btn-outline">Learn More</a>
    </div>
  </div>
</section>
```

### Content Section

```html
<section class="section">
  <div class="container">
    <h2 class="section-title">Features</h2>
    <p class="section-subtitle">Everything you need to build amazing AI agents</p>
    
    <!-- Your content here -->
  </div>
</section>

<!-- Alternate background -->
<section class="section section-alt">
  <!-- Light gray background -->
</section>
```

### Feature Cards

```html
<div class="features-grid">
  <div class="feature-card">
    <div class="feature-icon">🚀</div>
    <h3>Fast Setup</h3>
    <p>Get started in minutes with our simple API</p>
  </div>
  
  <div class="feature-card">
    <div class="feature-icon">🔧</div>
    <h3>Flexible</h3>
    <p>Customize every aspect of your agents</p>
  </div>
  
  <div class="feature-card">
    <div class="feature-icon">📊</div>
    <h3>Analytics</h3>
    <p>Track performance and usage metrics</p>
  </div>
</div>
```

### Cards

```html
<div class="card">
  <div class="card-header">
    Card Title
  </div>
  <div class="card-body">
    <p>Card content goes here...</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### Badges

```html
<span class="badge badge-primary">New</span>
<span class="badge badge-secondary">Beta</span>
<span class="badge badge-success">Active</span>
```

### Code Blocks

```html
<div class="code-block">
  <pre><code class="language-javascript">
const agent = new Agent({
  name: 'Assistant',
  provider: 'openai'
});
  </code></pre>
</div>
```

Inline code: `<code>agent.chat()</code>`

## Typography

### Headings

```html
<h1>Main Page Title</h1>      <!-- 3rem, 48px -->
<h2>Section Heading</h2>       <!-- 2.25rem, 36px -->
<h3>Subsection</h3>            <!-- 1.875rem, 30px -->
<h4>Card Title</h4>            <!-- 1.5rem, 24px -->
<h5>Small Heading</h5>         <!-- 1.25rem, 20px -->
<h6>Smallest Heading</h6>      <!-- 1rem, 16px -->
```

### Text Styles

```html
<p>Regular paragraph text</p>
<p class="text-center">Centered text</p>
<p class="text-left">Left aligned</p>
<p class="text-right">Right aligned</p>
```

## Layout

### Container

```html
<!-- Standard container (1200px max) -->
<div class="container">
  <!-- Content -->
</div>

<!-- Wide container (1400px max) -->
<div class="container-wide">
  <!-- Content -->
</div>
```

## Utility Classes

### Spacing

```html
<!-- Margin Top -->
<div class="mt-1">0.5rem margin top</div>
<div class="mt-2">1rem margin top</div>
<div class="mt-3">1.5rem margin top</div>
<div class="mt-4">2rem margin top</div>

<!-- Margin Bottom -->
<div class="mb-1">0.5rem margin bottom</div>
<div class="mb-2">1rem margin bottom</div>
<div class="mb-3">1.5rem margin bottom</div>
<div class="mb-4">2rem margin bottom</div>
```

### Flexbox

```html
<div class="flex">
  <!-- Display flex -->
</div>

<div class="flex flex-col">
  <!-- Flex column -->
</div>

<div class="flex items-center justify-center">
  <!-- Centered items -->
</div>

<div class="flex gap-2">
  <!-- 1rem gap between items -->
</div>
```

## Responsive Design

The branding system is mobile-first. Breakpoints:

```css
/* Mobile: < 768px (default) */
/* Tablet: 768px - 1024px */
/* Desktop: > 1024px */

@media (max-width: 768px) {
  /* Mobile styles */
}
```

## Best Practices

### 1. Always Use CSS Variables
```css
/* ✅ Good */
.my-element {
  color: var(--worksona-primary);
  background: var(--worksona-gray-50);
}

/* ❌ Bad */
.my-element {
  color: #3b82f6;
  background: #f8fafc;
}
```

### 2. Use Existing Classes First
Before writing custom CSS, check if there's an existing class that meets your needs.

### 3. Maintain Consistency
- Use sharp corners (border-radius: 0)
- Follow the established color palette
- Use consistent spacing (multiples of 0.5rem)
- Apply hover effects with the transition variable

### 4. Accessibility
- Maintain color contrast ratios
- Use semantic HTML elements
- Include ARIA labels where appropriate

## Examples in the Wild

Check these pages for real-world examples:
- `/www/index.html` - Homepage with hero and features
- `/www/demos/index.html` - Demo cards and layouts
- `/www/docs/index.html` - Documentation styling

## Need Help?

- Review the full stylesheet: `/www/assets/css/worksona-branding.css`
- Check existing pages for patterns
- Reference the Studio app for design inspiration

---

**Last Updated**: January 31, 2026  
**Version**: 1.0
