# Worksona-js Package Information

**Last Updated:** January 6, 2026

## 📦 Package Details

**Package Name:** `worksona-js`  
**Version:** 0.2.0  
**NPM Registry:** https://www.npmjs.com/package/worksona-js  
**GitHub Repository:** https://github.com/worksona/worksona-js

---

## 🚀 Installation

### Via NPM
```bash
npm i worksona-js
```

### Via Yarn
```bash
yarn add worksona-js
```

---

## 🌐 CDN Usage

### unpkg CDN
```html
<script src="https://unpkg.com/worksona-js@latest/worksona.min.js"></script>
```

### jsDelivr CDN
```html
<script src="https://cdn.jsdelivr.net/npm/worksona-js@latest/worksona.min.js"></script>
```

---

## 💻 Basic Usage

### CommonJS
```javascript
const Worksona = require('worksona-js');

const worksona = new Worksona({
  apiKeys: {
    openai: 'your-openai-api-key',
    anthropic: 'your-anthropic-api-key',
    google: 'your-google-api-key'
  }
});
```

### ES Modules
```javascript
import Worksona from 'worksona-js';

const worksona = new Worksona({
  apiKeys: {
    openai: 'your-openai-api-key'
  }
});
```

### Browser (via CDN)
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/worksona-js@latest/worksona.min.js"></script>
</head>
<body>
  <script>
    const worksona = new Worksona({
      apiKeys: {
        openai: 'your-openai-api-key'
      }
    });
    
    // Use worksona...
  </script>
</body>
</html>
```

---

## 📚 Documentation

- **Full Documentation:** [WORKSONA_DOCUMENTATION.md](./WORKSONA_DOCUMENTATION.md)
- **API Reference:** [docs/api-reference.md](./docs/api-reference.md)
- **Getting Started:** [docs/getting-started.md](./docs/getting-started.md)
- **README:** [README.md](./README.md)

---

## 🔗 Quick Links

- 📦 NPM: https://www.npmjs.com/package/worksona-js
- 💻 GitHub: https://github.com/worksona/worksona-js
- 📖 Documentation: https://worksona.dev/docs
- 🎯 Examples: https://worksona.dev/examples

---

## ✨ Features

- 🤖 Multi-Provider LLM Support (OpenAI, Anthropic, Google)
- 🖼️ Complete Image Pipeline (Analysis, generation, editing, variations)
- 👥 Agent Personality System
- 📊 Real-time Control Panel
- ⚡ Event-Driven Architecture
- 📦 Single File Deployment
- 🎯 Production Ready

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Last Updated:** January 6, 2026  
**Package Author:** Worksona Team <hello@worksona.com>  
**Maintainer:** sodanovels <david@atomic47.co>

