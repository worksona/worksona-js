# Worksona.js Documentation Site - Deployment Guide

This guide covers deploying the Worksona.js documentation site to various hosting platforms.

## Overview

The documentation site (`docs/www-api/`) is a **standalone static site** that requires no build process or server-side code. It can be deployed to any static hosting service.

## Directory Structure

```
docs/www-api/
├── index.html                    # Landing page
├── overview.html                 # Project overview
├── netlify.toml                  # Netlify configuration
├── assets/                       # Shared resources
│   ├── css/navigation.css
│   └── js/navigation.js
├── docs/                         # Documentation
├── demos/                        # Interactive demos
├── vibe-coding/                  # AI coding support
├── marketing/                    # Marketing pages
├── downloads/                    # Downloadable files
├── img/                          # Images
└── agents/                       # Agent configurations
```

## Deployment Options

### Option 1: Netlify (Recommended)

**Why Netlify?**
- Easy deployment from Git repository
- Automatic deployments on push
- Custom domain support
- Built-in CDN
- Free tier available

**Deploy Steps:**

1. **From Git Repository** (Recommended)
   ```bash
   # Connect your repository to Netlify
   # Set build settings:
   Base directory: docs/www-api
   Build command: (leave empty)
   Publish directory: .
   ```

2. **Using Netlify CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login to Netlify
   netlify login

   # Deploy from repository root
   netlify deploy --dir=docs/www-api --prod

   # Or from www-api directory
   cd docs/www-api
   netlify deploy --prod
   ```

3. **Drag & Drop**
   - Go to https://app.netlify.com/drop
   - Drag the `docs/www-api` folder
   - Your site is live!

**Configuration:**
The included `netlify.toml` provides:
- Custom headers for security and caching
- Redirects for old URLs
- Pretty URLs without `.html` extension
- 404 handling

---

### Option 2: Vercel

**Deploy Steps:**

1. **From Git Repository**
   ```bash
   # Connect repository to Vercel
   # Set build settings:
   Root Directory: docs/www-api
   Build Command: (leave empty)
   Output Directory: .
   ```

2. **Using Vercel CLI**
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy
   cd docs/www-api
   vercel --prod
   ```

**Configuration:**
Create `vercel.json` in `docs/www-api/`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home.html",
      "destination": "/index.html",
      "permanent": true
    }
  ]
}
```

---

### Option 3: GitHub Pages

**Deploy Steps:**

1. **Using gh-pages branch**
   ```bash
   # From repository root
   git subtree push --prefix docs/www-api origin gh-pages
   ```

2. **GitHub Actions** (Automated)
   Create `.github/workflows/deploy-docs.yml`:
   ```yaml
   name: Deploy Documentation

   on:
     push:
       branches: [main]
       paths:
         - 'docs/www-api/**'

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3

         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./docs/www-api
             publish_branch: gh-pages
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: gh-pages
   - Folder: / (root)

---

### Option 4: Cloudflare Pages

**Deploy Steps:**

1. **From Git Repository**
   - Connect repository to Cloudflare Pages
   - Build settings:
     - Build command: (leave empty)
     - Build output directory: `docs/www-api`

2. **Using Wrangler CLI**
   ```bash
   # Install Wrangler
   npm install -g wrangler

   # Deploy
   cd docs/www-api
   wrangler pages publish . --project-name=worksona-docs
   ```

---

### Option 5: AWS S3 + CloudFront

**Deploy Steps:**

1. **Create S3 Bucket**
   ```bash
   # Create bucket
   aws s3 mb s3://worksona-docs

   # Configure for static website hosting
   aws s3 website s3://worksona-docs \
     --index-document index.html \
     --error-document index.html
   ```

2. **Upload Files**
   ```bash
   # Sync files
   cd docs/www-api
   aws s3 sync . s3://worksona-docs \
     --delete \
     --cache-control "public, max-age=31536000" \
     --exclude "*.html" \
     --exclude "*.json"

   # Upload HTML with different cache
   aws s3 sync . s3://worksona-docs \
     --cache-control "public, max-age=0, must-revalidate" \
     --content-type "text/html" \
     --include "*.html"
   ```

3. **Set Up CloudFront** (Optional but recommended)
   - Create CloudFront distribution
   - Point origin to S3 bucket
   - Configure caching and compression

---

### Option 6: Azure Static Web Apps

**Deploy Steps:**

1. **From Git Repository**
   - Create Static Web App in Azure Portal
   - Connect to GitHub repository
   - Set build configuration:
     ```yaml
     app_location: "docs/www-api"
     output_location: ""
     ```

2. **Using Azure CLI**
   ```bash
   # Deploy
   az staticwebapp create \
     --name worksona-docs \
     --resource-group myResourceGroup \
     --source ./docs/www-api
   ```

---

### Option 7: Any Web Server

**Deploy Steps:**

Simply upload the contents of `docs/www-api/` to your web server:

1. **Via FTP/SFTP**
   ```bash
   # Upload all files to web root
   scp -r docs/www-api/* user@server:/var/www/html/
   ```

2. **Apache Configuration**
   Add to `.htaccess` in `docs/www-api/`:
   ```apache
   # Enable mod_rewrite
   RewriteEngine On

   # Remove .html extension
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^([^\.]+)$ $1.html [NC,L]

   # Custom error pages
   ErrorDocument 404 /index.html

   # Caching
   <FilesMatch "\.(css|js|jpg|jpeg|png|gif|svg|woff|woff2)$">
     Header set Cache-Control "public, max-age=31536000, immutable"
   </FilesMatch>

   <FilesMatch "\.(html|json|xml)$">
     Header set Cache-Control "public, max-age=0, must-revalidate"
   </FilesMatch>
   ```

3. **Nginx Configuration**
   Add to nginx.conf:
   ```nginx
   server {
     listen 80;
     server_name worksona-docs.example.com;
     root /var/www/worksona-docs;
     index index.html;

     # Try files, fall back to index.html
     location / {
       try_files $uri $uri.html $uri/ /index.html;
     }

     # Cache static assets
     location ~* \.(css|js|jpg|jpeg|png|gif|svg|woff|woff2)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
     }

     # Don't cache HTML
     location ~* \.html$ {
       expires 0;
       add_header Cache-Control "public, max-age=0, must-revalidate";
     }
   }
   ```

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] **Landing page** loads at root URL
- [ ] **Navigation** works (left rail on desktop, hamburger on mobile)
- [ ] **All sections** are accessible:
  - [ ] Docs (`/docs/`)
  - [ ] Demos (`/demos/`)
  - [ ] Vibe Coding (`/vibe-coding/`)
  - [ ] Marketing (`/marketing/`)
  - [ ] Downloads (`/downloads/`)
- [ ] **Downloads work** - All files in `/downloads/` are downloadable
- [ ] **External links** work (GitHub, NPM)
- [ ] **Mobile responsive** - Test on phone/tablet
- [ ] **Interactive demos** function correctly
- [ ] **Images** load properly
- [ ] **No 404 errors** in browser console

---

## Custom Domain Setup

### Netlify
```bash
# Add custom domain
netlify domains:add yourdomain.com

# Configure DNS
# Add CNAME record: www.yourdomain.com → your-site.netlify.app
# Add A record: yourdomain.com → Netlify IP
```

### Vercel
```bash
# Add custom domain
vercel domains add yourdomain.com

# Configure DNS
# Add CNAME record: www.yourdomain.com → cname.vercel-dns.com
```

### Cloudflare Pages
- Add domain in Cloudflare Pages dashboard
- Cloudflare automatically configures DNS

---

## SSL/HTTPS

All recommended platforms (Netlify, Vercel, Cloudflare Pages) provide **free automatic SSL certificates** via Let's Encrypt.

For self-hosted options:
- Use [Let's Encrypt](https://letsencrypt.org/) with Certbot
- Or use your hosting provider's SSL service

---

## Performance Optimization

The site is already optimized with:
- ✅ Minified JavaScript (worksona.min.js - 51KB)
- ✅ Optimized images
- ✅ Proper caching headers
- ✅ CDN-friendly structure

**Additional optimizations:**
1. Enable Brotli compression on your CDN
2. Use CDN edge caching for static assets
3. Enable HTTP/2 or HTTP/3
4. Consider a CDN like Cloudflare for additional performance

---

## Monitoring & Analytics

### Add Google Analytics
Add to all HTML pages before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Netlify Analytics
Enable in Netlify dashboard (paid feature, provides server-side analytics)

---

## Troubleshooting

**Issue: 404 errors on page refresh**
- **Solution:** Configure your hosting to serve `index.html` for all routes
- See server configuration examples above

**Issue: CSS/JS not loading**
- **Solution:** Check file paths are correct (should start with `./` or `/`)
- Verify all files were uploaded

**Issue: Navigation not working**
- **Solution:** Ensure `assets/js/navigation.js` is loaded on all pages
- Check browser console for JavaScript errors

**Issue: Downloads not working**
- **Solution:** Verify MIME types are correct
- Check `Content-Disposition` headers

---

## Support

For deployment issues:
- GitHub Issues: https://github.com/worksona/worksona-js/issues
- NPM Package: https://www.npmjs.com/package/worksona-js

---

## License

MIT License - See LICENSE file for details
