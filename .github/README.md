# GitHub Configuration

This directory contains GitHub-related configuration files for the Worksona.js project.

## Files

### pre-commit-hook

A Git pre-commit hook that prevents accidentally committing API keys or secrets.

#### Features

- ✅ Detects Railway API keys (`wsk_live_`, `wsk_test_`)
- ✅ Detects OpenAI API keys (`sk-`, `sk-proj-`)
- ✅ Detects Anthropic API keys (`sk-ant-api03-`)
- ✅ Detects Google API keys (`AIza...`)
- ✅ Detects generic secret patterns
- ✅ Excludes safe files (`.env.example`, documentation)
- ✅ Provides helpful error messages

#### Installation

**Automatic (Recommended):**
```bash
# Run from project root
npm run install:hooks
```

**Manual:**
```bash
# Copy to git hooks directory
cp .github/pre-commit-hook .git/hooks/pre-commit

# Make executable
chmod +x .git/hooks/pre-commit
```

#### Testing

```bash
# Test the hook without committing
.github/pre-commit-hook

# Should output: ✅ No API keys or secrets detected
```

#### Usage

Once installed, the hook runs automatically before each commit:

```bash
git add .
git commit -m "Update documentation"

# Hook runs automatically:
# 🔍 Checking for API keys and secrets...
# ✅ No API keys or secrets detected
```

If a secret is detected:

```bash
❌ ERROR: Potential API key or secret found!
   File: config.js
   Pattern: wsk_live_[A-Za-z0-9=]{40,}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 COMMIT BLOCKED: API keys detected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

To fix this issue:
  1. Remove the API key from the file
  2. Use placeholder values (e.g., 'wsk_live_YOUR_KEY_HERE')
  3. Store real keys in environment variables or .env files
```

#### Bypassing (Not Recommended)

In rare cases where you need to bypass the hook:

```bash
git commit --no-verify -m "Message"
```

⚠️ **Warning:** Only use `--no-verify` if you're absolutely certain no secrets are in the commit.

#### Customization

Edit `.github/pre-commit-hook` to:

**Add new patterns:**
```bash
PATTERNS=(
    "custom_key_pattern"
    # ... existing patterns
)
```

**Exclude additional files:**
```bash
EXCLUDE_PATTERNS=(
    "your-safe-file.md"
    # ... existing patterns
)
```

#### Troubleshooting

**Hook not running:**
```bash
# Verify installation
ls -la .git/hooks/pre-commit

# Should show executable permissions
# -rwxr-xr-x ... pre-commit
```

**False positives:**
- Add file to `EXCLUDE_PATTERNS` in the hook script
- Use placeholder values that don't match patterns
- Commit with `--no-verify` (last resort)

**Hook fails unexpectedly:**
```bash
# Run manually to see full output
.github/pre-commit-hook

# Check bash version (requires bash 3.2+)
bash --version
```

## NETLIFY_DEPLOYMENT.md

Complete guide for deploying to Netlify with Railway API integration.

See: [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)

## Workflows

### test.yml

GitHub Actions workflow for automated testing.

- Runs on: Push, Pull Requests
- Tests: Jest test suite
- Node versions: 14.x, 16.x, 18.x

## Security

### Secret Management

This repository follows these security practices:

1. ✅ No secrets in source code
2. ✅ Use environment variables for API keys
3. ✅ `.gitignore` excludes `.env` files
4. ✅ Pre-commit hook prevents accidental commits
5. ✅ Documentation uses placeholders only

See: [SECURITY_AUDIT.md](../SECURITY_AUDIT.md)

## Contributing

When contributing to this repository:

1. **Install pre-commit hook** (first time setup)
   ```bash
   cp .github/pre-commit-hook .git/hooks/pre-commit
   chmod +x .git/hooks/pre-commit
   ```

2. **Never commit real API keys**
   - Use `.env` for local development
   - Use placeholders in examples
   - Use Netlify environment variables for deployment

3. **Test your changes**
   ```bash
   npm test
   npm run validate
   ```

4. **Follow documentation standards**
   - Use placeholder values: `wsk_live_YOUR_KEY_HERE`
   - Mark sensitive fields clearly
   - Include security warnings

## Resources

- [SECURITY_AUDIT.md](../SECURITY_AUDIT.md) - Security audit report
- [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) - Deployment guide
- [.env.example](../.env.example) - Environment variables template
- [RAILWAY_API_QUICK_REFERENCE.md](../RAILWAY_API_QUICK_REFERENCE.md) - API reference

---

**Questions?** Open an issue or contact the maintainers.
