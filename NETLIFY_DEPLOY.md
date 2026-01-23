# Netlify Deployment Guide

Quick reference for deploying Worksona.js documentation to Netlify.

## Quick Deploy

### Option 1: Connect Git Repository (Recommended)

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub/GitLab/Bitbucket repository
4. Netlify will auto-detect settings from `netlify.toml`:
   - **Publish directory:** `www`
   - **Build command:** (none - static site)
5. Click "Deploy site"

That's it! Netlify will automatically deploy on every push to your main branch.

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy from repository root
netlify deploy --dir=www --prod

# Or initialize and link
netlify init
# Follow prompts, select www as publish directory
```

### Option 3: Drag & Drop

1. Go to https://app.netlify.com/drop
2. Drag the `www/` folder
3. Your site is live!

## Configuration

The `netlify.toml` in the repository root includes:

✅ **Security Headers**
- XSS Protection
- Content Type Options
- Frame Options
- Referrer Policy

✅ **Performance Optimization**
- Long-term caching for static assets (JS, CSS, images)
- No cache for HTML (always fresh)
- Proper MIME types

✅ **URL Redirects**
- Pretty URLs (no .html extension)
- Old path redirects
- 404 handling

✅ **Context-Specific Settings**
- Production (main branch)
- Deploy previews (pull requests)
- Branch deploys

## Custom Domain

1. In Netlify dashboard: Site settings → Domain management
2. Add custom domain
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

## Environment Variables

If you need environment variables (for API keys in demos):

1. Site settings → Environment variables
2. Add variables (e.g., `OPENAI_API_KEY`)
3. Redeploy site

**Note:** For security, don't commit API keys to the repository. Use Netlify's environment variables instead.

## Continuous Deployment

Netlify automatically deploys when you:
- Push to main branch
- Merge pull requests
- Create new branches (deploy previews)

## Build Settings

**Base directory:** (empty - deploy from root)  
**Build command:** (empty - static site)  
**Publish directory:** `www`

These are automatically configured via `netlify.toml`.

## Troubleshooting

**Issue: 404 errors on page refresh**
- ✅ Already handled by `netlify.toml` redirects

**Issue: CSS/JS not loading**
- Check file paths in HTML (should use relative paths)
- Verify all files are in `www/` directory

**Issue: Changes not appearing**
- Clear Netlify cache: Site settings → Build & deploy → Clear cache
- Or trigger a new deploy

**Issue: Build fails**
- Check Netlify build logs
- Verify `netlify.toml` syntax is correct
- Ensure `www/` directory exists

## Post-Deployment Checklist

- [ ] Landing page loads correctly
- [ ] Navigation works (desktop and mobile)
- [ ] All sections accessible:
  - [ ] `/docs/` - Documentation
  - [ ] `/demos/` - Interactive demos
  - [ ] `/vibe-coding/` - AI coding support
  - [ ] `/marketing/` - Marketing pages
- [ ] Downloads work (`/downloads/`)
- [ ] Images load properly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SSL certificate active (HTTPS)

## Performance

Netlify provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ HTTP/2 support
- ✅ Image optimization (via Netlify Image CDN - paid)
- ✅ Form handling (via Netlify Forms - free tier available)

## Support

- Netlify Docs: https://docs.netlify.com
- Netlify Community: https://community.netlify.com
- Worksona Issues: https://github.com/worksona/worksona-js/issues

---

**Ready to deploy?** Just connect your repository and Netlify handles the rest! 🚀
