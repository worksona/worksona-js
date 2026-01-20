#!/usr/bin/env python3
"""
Convert all HTML files to light theme with flat design
"""

import os
import re

def convert_css_to_light_theme(content):
    """Convert dark theme CSS to light theme"""

    # Replace dark theme color variables with light theme
    replacements = [
        # Dark backgrounds to light
        (r'--bg-dark:\s*#[0-9a-fA-F]{6};', '--bg-light: #ffffff;'),
        (r'--bg-card:\s*#[0-9a-fA-F]{6};', '--bg-card: #ffffff;'),
        (r'--bg-card-hover:\s*#[0-9a-fA-F]{6};', '--bg-card-hover: #f8fafc;'),

        # Text colors - light text to dark
        (r'--text-primary:\s*#e2e8f0;', '--text-primary: #0f172a;'),
        (r'--text-secondary:\s*#94a3b8;', '--text-secondary: #64748b;'),

        # Update accent colors to match our palette
        (r'--accent-blue:\s*#3b82f6;', '--accent-blue: #2563eb;'),
        (r'--accent-purple:\s*#8b5cf6;', '--accent-purple: #7c3aed;'),
        (r'--accent-pink:\s*#ec4899;', '--accent-pink: #10b981;'),

        # Border colors
        (r'--border-color:\s*rgba\([0-9,\s\.]+\);', '--border-color: #e2e8f0;'),

        # Body background
        (r'background:\s*var\(--bg-dark\)', 'background: white'),
        (r'background:\s*#0a0e27', 'background: white'),
        (r'background:\s*#131829', 'background: white'),

        # Text colors in properties
        (r'color:\s*var\(--text-primary\)', 'color: var(--gray-900)'),
        (r'color:\s*var\(--text-secondary\)', 'color: var(--gray-600)'),
        (r'color:\s*#e2e8f0', 'color: #0f172a'),
        (r'color:\s*#94a3b8', 'color: #64748b'),

        # Card backgrounds
        (r'background:\s*var\(--bg-card\)', 'background: white'),

        # Remove or simplify gradients
        (r'background:\s*linear-gradient\([^;]+\);', 'background: var(--primary);'),

        # Border radius - make more square
        (r'border-radius:\s*12px', 'border-radius: 4px'),
        (r'border-radius:\s*16px', 'border-radius: 4px'),
        (r'border-radius:\s*20px', 'border-radius: 4px'),
        (r'border-radius:\s*24px', 'border-radius: 4px'),

        # Box shadows - lighten them
        (r'box-shadow:\s*0\s+[0-9]+px\s+[0-9]+px\s+rgba\(0,\s*0,\s*0,\s*[0-9\.]+\)',
         'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)'),
    ]

    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)

    # Add standard light theme variables if not present
    if ':root {' in content and '--gray-50' not in content:
        vars_to_add = '''
  --primary: #2563eb;
  --secondary: #7c3aed;
  --success: #10b981;
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;
'''
        content = content.replace(':root {', ':root {' + vars_to_add)

    return content


def remove_emojis(content):
    """Remove emojis from HTML content"""
    # Common emojis used in docs
    emojis = ['📁', '📚', '🎮', '💻', '📊', '🚀', '⚡', '⚙️', '📖', '🔬', '🔗', '🌟', '📝']
    for emoji in emojis:
        content = content.replace(emoji + ' ', '')
        content = content.replace(emoji, '')
    return content


def process_file(filepath):
    """Process a single HTML file"""
    print(f"Processing: {filepath}")

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Convert CSS to light theme
        content = convert_css_to_light_theme(content)

        # Remove emojis
        content = remove_emojis(content)

        # Only write if changes were made
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ Updated successfully")
        else:
            print(f"  ℹ️  No changes needed")

    except Exception as e:
        print(f"  ❌ Error: {e}")


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # Process docs directory
    docs_dir = os.path.join(base_dir, 'docs')
    print(f"\n📄 Converting docs files to light theme\n")

    if os.path.exists(docs_dir):
        for filename in os.listdir(docs_dir):
            if filename.endswith('.html') and filename not in ['header-snippet.html']:
                filepath = os.path.join(docs_dir, filename)
                process_file(filepath)
                print()

    # Process examples directory
    examples_dir = os.path.join(base_dir, 'examples')
    print(f"\n📄 Converting examples files to light theme\n")

    if os.path.exists(examples_dir):
        for filename in os.listdir(examples_dir):
            if filename.endswith('.html'):
                filepath = os.path.join(examples_dir, filename)
                process_file(filepath)
                print()

    print("\n✅ Light theme conversion complete!")


if __name__ == '__main__':
    main()
