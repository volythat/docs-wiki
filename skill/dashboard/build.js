const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const args = process.argv.slice(2);
const docsArg = args.find(a => a.startsWith('--docs='))?.slice(7) || args[args.indexOf('--docs') + 1];
const outArg  = args.find(a => a.startsWith('--out='))?.slice(6)  || args[args.indexOf('--out')  + 1];

function readDocswiki(cwd) {
  const p = path.join(cwd, '.docswiki.yml');
  if (!fs.existsSync(p)) return null;
  const yml = fs.readFileSync(p, 'utf8');
  const docsDir = yml.match(/^docs_dir:\s*(.+)/m)?.[1]?.trim();
  const name    = yml.match(/^\s+name:\s*(.+)/m)?.[1]?.trim();
  return docsDir ? { docsDir: path.resolve(cwd, docsDir), name } : null;
}

const wiki = !docsArg ? readDocswiki(process.cwd()) : null;
const DOCS_DIR    = docsArg  ? path.resolve(docsArg) : wiki?.docsDir ?? path.join(__dirname, 'docs_v2');
const OUTPUT      = outArg   ? path.resolve(outArg)  : path.join(wiki ? process.cwd() : __dirname, 'dashboard.html');
const PROJECT_NAME = wiki?.name ?? 'Docs';

marked.use({
  renderer: {
    code(code, lang) {
      if (lang === 'mermaid') return `<div class="mermaid">${code}</div>`;
      return false;
    }
  }
});

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  --bg-app: #f8fafc;
  --bg-card: #ffffff;
  --bg-sidebar: #ffffff;
  --bg-topbar: rgba(255, 255, 255, 0.8);
  
  --text-main: #334155;
  --text-muted: #64748b;
  --text-heading: #0f172a;
  
  --border-color: #e2e8f0;
  --border-hover: #cbd5e1;
  
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --primary-light: #e0e7ff;
  
  --badge-get-bg: #d1fae5;
  --badge-get-text: #065f46;
  --badge-post-bg: #dbeafe;
  --badge-post-text: #1e40af;
  --badge-put-bg: #fef3c7;
  --badge-put-text: #92400e;
  --badge-patch-bg: #fce7f3;
  --badge-patch-text: #9d174d;
  --badge-delete-bg: #fee2e2;
  --badge-delete-text: #991b1b;
  
  --code-bg: #f1f5f9;
  --code-block-bg: #0f172a;
  --code-block-text: #f8fafc;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
  --scrollbar-thumb: #cbd5e1;
  --scrollbar-track: transparent;
}

[data-theme="dark"] {
  --bg-app: #090d16;
  --bg-card: #111827;
  --bg-sidebar: #0f172a;
  --bg-topbar: rgba(9, 13, 22, 0.8);
  
  --text-main: #94a3b8;
  --text-muted: #64748b;
  --text-heading: #f8fafc;
  
  --border-color: #1e293b;
  --border-hover: #334155;
  
  --primary: #818cf8;
  --primary-hover: #6366f1;
  --primary-light: #1e1b4b;
  
  --badge-get-bg: rgba(16, 185, 129, 0.15);
  --badge-get-text: #34d399;
  --badge-post-bg: rgba(59, 130, 246, 0.15);
  --badge-post-text: #60a5fa;
  --badge-put-bg: rgba(245, 158, 11, 0.15);
  --badge-put-text: #fbbf24;
  --badge-patch-bg: rgba(236, 72, 153, 0.15);
  --badge-patch-text: #f472b6;
  --badge-delete-bg: rgba(239, 68, 68, 0.15);
  --badge-delete-text: #f87171;
  
  --code-bg: #1e293b;
  --code-block-bg: #030712;
  --code-block-text: #cbd5e1;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  
  --scrollbar-thumb: #1e293b;
  --scrollbar-track: transparent;
}

*{box-sizing:border-box;margin:0;padding:0}
body{
  font-family: var(--font-sans);
  background: var(--bg-app);
  color: var(--text-main);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  transition: background 0.3s, color 0.3s;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}
::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Topbar */
#topbar {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-topbar);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  gap: 16px;
  position: relative;
  z-index: 100;
  flex-shrink: 0;
  transition: border-color 0.3s, background 0.3s;
}
#logo {
  font-weight: 700;
  font-size: 16px;
  white-space: nowrap;
  color: var(--text-heading);
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--primary), #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.search-container {
  position: relative;
  flex: 1;
  max-width: 480px;
  display: flex;
  align-items: center;
}
#search {
  width: 100%;
  padding: 8px 16px 8px 36px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background: var(--bg-app);
  color: var(--text-main);
  outline: none;
  transition: all 0.2s ease;
  font-family: var(--font-sans);
}
#search:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
  background: var(--bg-card);
}
.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  font-size: 14px;
  pointer-events: none;
}
.kbd-shortcut {
  position: absolute;
  right: 12px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--code-bg);
  border: 1px solid var(--border-color);
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
  font-family: var(--font-mono);
}

/* Theme Toggle Button */
.theme-toggle {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-main);
  transition: all 0.2s;
  padding: 0;
}
.theme-toggle:hover {
  background: var(--code-bg);
  border-color: var(--border-hover);
  transform: scale(1.05);
}
.theme-toggle svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

#search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: 360px;
  overflow-y: auto;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  z-index: 200;
  display: none;
}
.sr {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.15s;
}
.sr:last-child { border-bottom: none; }
.sr:hover { background: var(--code-bg); }
.sr-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-heading);
  display: flex;
  align-items: center;
  gap: 8px;
}
.sr-snippet {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
  word-break: break-all;
}

/* Main Layout */
#main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar Styling */
#sidebar {
  width: 280px;
  overflow-y: auto;
  border-right: 1px solid var(--border-color);
  background: var(--bg-sidebar);
  flex-shrink: 0;
  padding: 16px 12px;
  transition: border-color 0.3s, background 0.3s;
}
.ng {
  margin-bottom: 12px;
}
.ng-header {
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: .08em;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: color 0.2s;
}
.ng-header:hover {
  color: var(--text-heading);
}
.ng-header::after {
  content: '▾';
  font-size: 10px;
  transition: transform 0.2s ease;
  opacity: 0.6;
}
.ng-header.collapsed::after {
  transform: rotate(-90deg);
}
.ng-body {
  overflow: hidden;
}
.ng-body.collapsed {
  display: none;
}
.ni {
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 6px;
  margin: 2px 0;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ni:hover {
  background: var(--code-bg);
  color: var(--text-heading);
  padding-left: 16px;
}
.ni.active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}
[data-theme="dark"] .ni.active {
  color: #818cf8;
  background: rgba(129, 140, 248, 0.15);
}
.ni-sub {
  padding-left: 24px;
}
.ni-sub:hover {
  padding-left: 28px;
}

/* Badge classes */
.badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  font-family: var(--font-mono);
}
.GET { background: var(--badge-get-bg); color: var(--badge-get-text); }
.POST { background: var(--badge-post-bg); color: var(--badge-post-text); }
.PUT { background: var(--badge-put-bg); color: var(--badge-put-text); }
.PATCH { background: var(--badge-patch-bg); color: var(--badge-patch-text); }
.DELETE { background: var(--badge-delete-bg); color: var(--badge-delete-text); }

/* Content Wrapper & Area */
#content-wrapper {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  position: relative;
  display: flex;
  justify-content: center;
  background: var(--bg-app);
}
#content {
  width: 100%;
  max-width: 860px;
  padding: 48px 40px;
  box-sizing: border-box;
}

/* Markdown styling inside Content */
#content h1 {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-heading);
  letter-spacing: -0.03em;
}
#content h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 40px 0 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-heading);
  letter-spacing: -0.02em;
}
#content h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 28px 0 12px;
  color: var(--text-heading);
}
#content p {
  line-height: 1.7;
  margin-bottom: 16px;
  color: var(--text-main);
  font-size: 14.5px;
}
#content ul, #content ol {
  margin: 12px 0 16px 24px;
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--text-main);
}
#content li {
  margin-bottom: 6px;
}
#content code {
  background: var(--code-bg);
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 12.5px;
  font-family: var(--font-mono);
  color: var(--primary);
}
[data-theme="dark"] #content code {
  color: #a5b4fc;
}
#content pre {
  background: var(--code-block-bg);
  color: var(--code-block-text);
  padding: 20px;
  border-radius: 10px;
  overflow-x: auto;
  margin: 20px 0;
  font-size: 13px;
  line-height: 1.6;
  font-family: var(--font-mono);
  position: relative;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
#content pre code {
  background: none;
  color: inherit;
  padding: 0;
  font-size: inherit;
  font-family: inherit;
}

/* Copy Button inside pre */
.copy-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  padding: 4px 8px;
  color: #f8fafc;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-sans);
}
.copy-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.25);
}

#content table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 13.5px;
  box-shadow: var(--shadow-sm);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}
#content th, #content td {
  padding: 12px 16px;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid var(--border-color);
}
#content th {
  background: var(--code-bg);
  font-weight: 600;
  font-size: 12.5px;
  color: var(--text-heading);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--border-color);
}
#content tr:last-child td {
  border-bottom: none;
}
#content tr:hover td {
  background: var(--bg-card);
}

/* Premium Alerts & Callouts */
#content blockquote {
  border-left: 4px solid var(--primary);
  padding: 16px 20px;
  background: var(--bg-card);
  margin: 20px 0;
  border-radius: 0 8px 8px 0;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: var(--shadow-sm);
  color: var(--text-main);
  position: relative;
}
#content blockquote.alert-info {
  border-left-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}
#content blockquote.alert-warning {
  border-left-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}
#content blockquote.alert-tip {
  border-left-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

#content a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px dashed transparent;
  transition: all 0.2s;
}
#content a:hover {
  border-bottom-color: var(--primary);
}

/* API Endpoints Styles */
.ep-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.ep-url {
  font-family: var(--font-mono);
  font-size: 13.5px;
  background: var(--code-bg);
  padding: 8px 16px;
  border-radius: 8px;
  color: var(--text-heading);
  font-weight: 500;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

/* Stats Cards Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}
.stat-card {
  padding: 24px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
}
.stat-num {
  font-size: 34px;
  font-weight: 700;
  margin-bottom: 6px;
}
.stat-label {
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Domain Grid */
.domain-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 20px;
}
.domain-card {
  padding: 18px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}
.domain-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
}
.domain-card span {
  font-weight: 600;
  color: var(--text-heading);
}
.domain-badge {
  background: var(--primary-light);
  color: var(--primary);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
[data-theme="dark"] .domain-badge {
  background: rgba(129, 140, 248, 0.15);
  color: #818cf8;
}

/* Right Outline Panel (TOC) */
#outline {
  width: 240px;
  padding: 48px 24px 48px 0;
  overflow-y: auto;
  flex-shrink: 0;
  display: none;
  border-left: 1px solid transparent;
}
@media (max-width: 1100px) {
  #outline {
    display: none !important;
  }
}
.outline-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}
#outline-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.outline-item {
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.15s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-left: 2px solid transparent;
  padding-left: 10px;
}
.outline-item:hover {
  color: var(--text-heading);
  border-left-color: var(--border-hover);
}
.outline-item.h3 {
  padding-left: 20px;
  font-size: 12.5px;
}
.outline-item.active {
  color: var(--primary);
  border-left-color: var(--primary);
  font-weight: 500;
}
[data-theme="dark"] .outline-item.active {
  color: #818cf8;
  border-left-color: #818cf8;
}
`;

function walkDir(dir, base) {
  base = base || dir;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(base, full);
    if (entry.isDirectory()) {
      results.push(...walkDir(full, base));
    } else {
      results.push({ full, rel });
    }
  }
  return results;
}

function encodeHash(p) {
  return p.split(path.sep).join('/').replace(/\s+/g, '-').toLowerCase()
    .replace(/\.md$/, '').replace(/\.bru$/, '');
}

function parseMdFile({ full, rel }) {
  const raw = fs.readFileSync(full, 'utf8');
  const titleMatch = raw.match(/^#\s+(.+)/m);
  const title = titleMatch ? titleMatch[1].trim() : path.basename(rel, '.md');
  const htmlContent = marked(raw);
  const rawText = raw
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_[\]()>|]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { type: 'doc', path: rel, title, htmlContent, rawText };
}

function parseBruFile({ full, rel }) {
  const raw = fs.readFileSync(full, 'utf8');

  // name from "  name: ..." inside meta block
  const nameMatch = raw.match(/^\s+name:\s*(.+)/m);
  const name = nameMatch
    ? nameMatch[1].trim()
    : path.basename(rel, '.bru').replace(/^\d+\s+/, '');

  // method and url — matches "get {\n  url: ..."
  const methodMatch = raw.match(/^(get|post|put|patch|delete)\s*\{[\s\S]*?url:\s*(.+)/im);
  if (!methodMatch) return null;
  const method = methodMatch[1].toUpperCase();
  const url = methodMatch[2].trim().split('\n')[0];

  // docs block — brace counting to handle nested {} in JSON examples
  let docsContent = '';
  const docsIdx = raw.indexOf('\ndocs {');
  if (docsIdx !== -1) {
    const openIdx = raw.indexOf('{', docsIdx + 1) + 1;
    let depth = 1;
    let i = openIdx;
    while (i < raw.length && depth > 0) {
      if (raw[i] === '{') depth++;
      else if (raw[i] === '}') depth--;
      if (depth > 0) i++;
      else break;
    }
    docsContent = raw.slice(openIdx, i).trim();
  }

  // domain from parent folder name, strip leading number
  const parts = rel.split(path.sep);
  const domain = parts.length > 1
    ? parts[parts.length - 2].replace(/^\d+\s+/, '')
    : 'Other';

  // first non-empty, non-heading line as description
  const description = (docsContent
    .split('\n')
    .find(l => l.trim() && !l.trim().startsWith('#')) || '').trim();

  const docsHtml = docsContent ? marked(docsContent) : '';

  return { type: 'endpoint', path: rel, domain, name, method, url, description, docsHtml };
}

function buildNavTree(docs, endpoints) {
  function docsByFolder(folder) {
    return docs.filter(d => {
      const norm = d.path.split(path.sep).join('/');
      return norm.startsWith(folder + '/') && norm.endsWith('.md');
    });
  }

  const rootDocs = docs.filter(d => {
    const norm = d.path.split(path.sep).join('/');
    return !norm.includes('/') && norm.endsWith('.md');
  });

  // Group endpoints by domain, preserving folder order
  const seen = new Set();
  const domains = [];
  for (const ep of endpoints) {
    if (!seen.has(ep.domain)) { seen.add(ep.domain); domains.push(ep.domain); }
  }
  const apiItems = domains.map(domain => ({
    type: 'domain',
    label: domain,
    endpoints: endpoints.filter(e => e.domain === domain),
  }));

  return [
    { id: 'overview', label: '📋 Overview', items: [] },
    { id: 'api', label: '📡 API', items: apiItems },
    { id: 'screens', label: '📱 Screens', items: docsByFolder('screens') },
    { id: 'design', label: '🎨 Design', items: docsByFolder('design') },
    { id: 'content', label: '📦 Content', items: docsByFolder('content') },
    { id: 'integrations', label: '🔗 Integrations', items: docsByFolder('integrations') },
    { id: 'sources', label: '📚 Sources', items: docsByFolder('_sources') },
    { id: 'root', label: '📄 Root', items: rootDocs },
  ];
}

function buildSearchIndex(docs, endpoints) {
  const docEntries = docs.map(d => ({
    type: 'doc',
    title: d.title,
    content: d.rawText.slice(0, 600),
    path: d.path,
  }));
  const epEntries = endpoints.map(e => ({
    type: 'endpoint',
    title: e.name,
    content: (e.url + ' ' + e.description).slice(0, 200),
    path: e.path,
    method: e.method,
  }));
  return [...docEntries, ...epEntries];
}

function generateHtml({ navTree, docsData, searchIndex }) {
  const jsRuntime = buildJsRuntime();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${PROJECT_NAME} Docs</title>
<style>${CSS}</style>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
</head>
<body>
<div id="topbar">
  <span id="logo">${PROJECT_NAME} Docs</span>
  <div class="search-container">
    <span class="search-icon">🔍</span>
    <input id="search" type="text" placeholder="Search docs..." autocomplete="off" spellcheck="false">
    <span class="kbd-shortcut">⌘K</span>
    <div id="search-results"></div>
  </div>
  <div style="flex:1"></div>
  <button class="theme-toggle" id="theme-toggle" title="Toggle theme">
    <svg class="sun" viewBox="0 0 24 24" style="display:none;"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.38.39-1.02 0-1.41zm-12.37 12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.38.39-1.02 0-1.41z"/></svg>
    <svg class="moon" viewBox="0 0 24 24"><path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.8 3.5-8.9 8-9.8.5-.1 1 .3 1.1.8.1.5-.2 1-.7 1.2-3.4 1.1-5.8 4.3-5.8 7.9 0 4.6 3.8 8.4 8.4 8.4 3.6 0 6.8-2.4 7.9-5.8.2-.5.7-.8 1.2-.7.5.1.9.6.8 1.1-.9 4.5-5 8-9.8 8z"/></svg>
  </button>
</div>
<div id="main">
  <div id="sidebar"></div>
  <div id="content-wrapper">
    <div id="content"></div>
  </div>
  <div id="outline">
    <div class="outline-title">On this page</div>
    <div id="outline-list"></div>
  </div>
</div>
<script>
const NAV_TREE=${JSON.stringify(navTree)};
const DOCS_DATA=${JSON.stringify(docsData)};
const SEARCH_INDEX=${JSON.stringify(searchIndex)};
${jsRuntime}
</script>
</body>
</html>`;
}

function buildJsRuntime() {
  return `
function encodeHash(p){
  return p.split('/').join('/').replace(/\\s+/g,'-').toLowerCase()
    .replace(/\\.md$/,'').replace(/\\.bru$/,'');
}

function navigate(hash){
  if(location.hash.slice(1)!==hash) location.hash=hash;
  renderContent(hash);
  document.querySelectorAll('.ni').forEach(el=>el.classList.remove('active'));
  const sel='[data-hash="'+hash+'"]';
  const el=document.querySelector(sel);
  if(el){
    el.classList.add('active');
    el.scrollIntoView({block:'nearest'});
    
    // Automatically expand parent domain group if it's an endpoint
    let parent = el.parentElement;
    if (parent && parent.classList.contains('ng-body') && parent.classList.contains('collapsed')) {
      parent.classList.remove('collapsed');
      const header = parent.previousElementSibling;
      if (header) header.classList.remove('collapsed');
    }
  }
}

function renderContent(hash){
  if(!hash||hash==='overview'){renderOverview(); postRender(); return;}
  const item=DOCS_DATA[hash];
  if(!item){
    document.getElementById('content').innerHTML='<p style="color:#6b7280">Not found: '+hash+'</p>';
    postRender();
    return;
  }
  if(item.type==='doc') renderDoc(item);
  else renderEndpoint(item);
  postRender();
}

function renderDoc(item){
  document.getElementById('content').innerHTML=item.htmlContent;
  if(window.mermaid) mermaid.run();
}

function renderEndpoint(item){
  document.getElementById('content').innerHTML=
    '<div class="ep-header">'+
      '<span class="badge '+item.method+'">'+item.method+'</span>'+
      '<span class="ep-url">'+item.url+'</span>'+
    '</div>'+
    '<h1>'+item.name+'</h1>'+
    '<div>'+item.docsHtml+'</div>';
}

function renderOverview(){
  const entries=Object.values(DOCS_DATA);
  const eps=entries.filter(e=>e.type==='endpoint');
  const docs=entries.filter(e=>e.type==='doc');
  const domains=[...new Set(eps.map(e=>e.domain))];
  const domainCards=domains.map(d=>{
    const count=eps.filter(e=>e.domain===d).length;
    const firstEp=eps.find(e=>e.domain===d);
    const hash=firstEp?encodeHash(firstEp.path):'';
    return '<div class="domain-card" onclick="navigate(\\''+hash+'\\')">'+
      '<span style="font-weight:500">'+d+'</span>'+
      '<span class="domain-badge">'+count+' endpoints</span>'+
    '</div>';
  }).join('');
  document.getElementById('content').innerHTML=
    '<h1 style="margin-bottom:8px">${PROJECT_NAME} Docs</h1>'+
    '<p style="color:var(--text-muted);margin-bottom:28px">Internal documentation dashboard</p>'+
    '<div class="stats-grid">'+
      '<div class="stat-card"><div class="stat-num" style="color:#2563eb">'+eps.length+'</div><div class="stat-label">API Endpoints</div></div>'+
      '<div class="stat-card"><div class="stat-num" style="color:#7c3aed">'+docs.length+'</div><div class="stat-label">Doc Files</div></div>'+
      '<div class="stat-card"><div class="stat-num" style="color:#059669">'+domains.length+'</div><div class="stat-label">API Domains</div></div>'+
    '</div>'+
    '<h2>API Domains</h2>'+
    '<div class="domain-grid">'+domainCards+'</div>';
}

function renderSidebar(){
  const sidebar=document.getElementById('sidebar');
  sidebar.innerHTML=NAV_TREE.map(group=>{
    if(group.id==='overview'){
      return '<div class="ng"><div class="ni" data-hash="overview" onclick="navigate(\\'overview\\')">📋 Overview</div></div>';
    }
    if(!group.items||!group.items.length) return '';
    const bodyId='ng-'+group.id;
    let itemsHtml='';
    if(group.id==='api'){
      itemsHtml=group.items.map(domain=>{
        const domainId='ng-domain-'+domain.label.replace(/\\s+/g,'-');
        const eps=domain.endpoints.map(ep=>{
          const hash=encodeHash(ep.path);
          return '<div class="ni ni-sub" data-hash="'+hash+'" onclick="navigate(\\''+hash+'\\')" title="'+ep.url+'">'+
            '<span class="badge '+ep.method+'">'+ep.method+'</span>'+ep.name+
          '</div>';
        }).join('');
        return '<div class="ng">'+
          '<div class="ng-header" onclick="toggleGroup(\\''+domainId+'\\')">'+domain.label+' ('+domain.endpoints.length+')</div>'+
          '<div class="ng-body" id="'+domainId+'">'+eps+'</div>'+
        '</div>';
      }).join('');
    } else {
      itemsHtml=group.items.map(item=>{
        const hash=encodeHash(item.path);
        return '<div class="ni" data-hash="'+hash+'" onclick="navigate(\\''+hash+'\\')">'+item.title+'</div>';
      }).join('');
    }
    return '<div class="ng">'+
      '<div class="ng-header" onclick="toggleGroup(\\''+bodyId+'\\')">'+group.label+'</div>'+
      '<div class="ng-body" id="'+bodyId+'">'+itemsHtml+'</div>'+
    '</div>';
  }).join('');
}

function toggleGroup(id){
  const body=document.getElementById(id);
  if(body) {
    body.classList.toggle('collapsed');
    const header = body.previousElementSibling;
    if (header) header.classList.toggle('collapsed');
  }
}

window.addEventListener('hashchange',()=>renderContent(location.hash.slice(1)));

document.addEventListener('DOMContentLoaded',()=>{
  try {
    // Set up theme toggle
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      const sunIcon = toggleBtn.querySelector('.sun');
      const moonIcon = toggleBtn.querySelector('.moon');

      function setTheme(theme) {
        if (theme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
          if (sunIcon) sunIcon.style.display = 'block';
          if (moonIcon) moonIcon.style.display = 'none';
        } else {
          document.documentElement.removeAttribute('data-theme');
          if (sunIcon) sunIcon.style.display = 'none';
          if (moonIcon) moonIcon.style.display = 'block';
        }
        try {
          localStorage.setItem('theme', theme);
        } catch(e) {}
        
        if (window.mermaid && document.querySelector('.mermaid')) {
          mermaid.initialize({startOnLoad:false, theme: theme === 'dark' ? 'dark' : 'neutral'});
          try {
            mermaid.run();
          } catch(e) {}
        }
      }

      let savedTheme = null;
      try {
        savedTheme = localStorage.getItem('theme');
      } catch(e) {}
      const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(savedTheme || (systemDark ? 'dark' : 'light'));

      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
      });
    }

    // Keyboard shortcut for search
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        const searchInput = document.getElementById('search');
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }
    });

    renderSidebar();
    renderContent(location.hash.slice(1)||'overview');
    initSearch();
  } catch (err) {
    console.error('Docs initialization failed:', err);
    const content = document.getElementById('content');
    if (content) {
      content.innerHTML = '<h2 style="color:#ef4444">Documentation Load Error</h2>' +
                          '<p style="color:#64748b">An error occurred while initializing the documentation dashboard:</p>' +
                          '<pre style="background:#fee2e2;color:#991b1b;padding:16px;border-radius:8px;border:1px solid #fee2e2;overflow-x:auto;">' + 
                          err.stack + '</pre>';
    }
  }
});

function initSearch(){
  const input=document.getElementById('search');
  const results=document.getElementById('search-results');
  if (!input || !results) return;

  input.addEventListener('input',()=>{
    const q=input.value.trim().toLowerCase();
    if(q.length<2){results.style.display='none';return;}

    const matches=SEARCH_INDEX.filter(item=>{
      return (item.title+' '+item.content).toLowerCase().includes(q);
    }).slice(0,10);

    if(!matches.length){results.style.display='none';return;}

    results.innerHTML=matches.map(item=>{
      const full=(item.title+' '+item.content).toLowerCase();
      const idx=full.indexOf(q);
      const start=Math.max(0,idx-30);
      const snippet=(item.title+' '+item.content).slice(start,start+100)
        .replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const badge=item.method?'<span class="badge '+item.method+'">'+item.method+'</span>':'';
      const hash=encodeHash(item.path);
      return '<div class="sr" onclick="navigate(\\''+hash+'\\');document.getElementById(\\'search\\').value=\\'\\';document.getElementById(\\'search-results\\').style.display=\\'none\\'">'+
        '<div class="sr-title">'+badge+item.title+'</div>'+
        '<div class="sr-snippet">…'+snippet+'…</div>'+
      '</div>';
    }).join('');
    results.style.display='block';
  });

  document.addEventListener('click',e=>{
    if(!e.target.closest('#topbar')) results.style.display='none';
  });
}

function postRender() {
  addCopyButtons();
  formatAlerts();
  updateOutline();
  const contentWrapper = document.getElementById('content-wrapper');
  if (contentWrapper) contentWrapper.scrollTop = 0;
}

function addCopyButtons() {
  const preBlocks = document.querySelectorAll('#content pre');
  preBlocks.forEach((pre) => {
    if (pre.querySelector('.copy-btn')) return;
    
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = 'Copy';
    
    const code = pre.querySelector('code');
    btn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code.textContent).then(() => {
          btn.innerHTML = 'Copied!';
          btn.style.background = '#059669';
          setTimeout(() => {
            btn.innerHTML = 'Copy';
            btn.style.background = '';
          }, 2000);
        });
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          btn.innerHTML = 'Copied!';
          btn.style.background = '#059669';
          setTimeout(() => {
            btn.innerHTML = 'Copy';
            btn.style.background = '';
          }, 2000);
        } catch (err) {
          console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
      }
    });
    
    pre.appendChild(btn);
  });
}

function formatAlerts() {
  const blockquotes = document.querySelectorAll('#content blockquote');
  blockquotes.forEach((bq) => {
    const text = bq.textContent;
    if (text.includes('💡') || text.includes('Ghi chú:') || text.includes('Note:')) {
      bq.classList.add('alert-info');
    } else if (text.includes('⚠️') || text.includes('Cảnh báo:') || text.includes('Warning:')) {
      bq.classList.add('alert-warning');
    } else if (text.includes('✨') || text.includes('Mẹo:') || text.includes('Tip:')) {
      bq.classList.add('alert-tip');
    }
  });
}

function updateOutline() {
  const content = document.getElementById('content');
  const outlineList = document.getElementById('outline-list');
  const outline = document.getElementById('outline');
  if (!outlineList || !outline || !content) return;
  
  outlineList.innerHTML = '';
  
  const headings = content.querySelectorAll('h2, h3');
  if (headings.length === 0) {
    outline.style.display = 'none';
    return;
  }
  
  outline.style.display = 'block';
  
  headings.forEach((h, index) => {
    const id = 'heading-' + index;
    h.id = id;
    
    const a = document.createElement('a');
    a.href = '#' + id;
    a.className = 'outline-item ' + h.tagName.toLowerCase();
    a.textContent = h.textContent;
    a.setAttribute('data-target', id);
    
    a.addEventListener('click', (e) => {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      document.querySelectorAll('.outline-item').forEach(el => el.classList.remove('active'));
      a.classList.add('active');
    });
    
    outlineList.appendChild(a);
  });
  
  const contentWrapper = document.getElementById('content-wrapper');
  if (contentWrapper) {
    contentWrapper.removeEventListener('scroll', handleScrollSpy);
    contentWrapper.addEventListener('scroll', handleScrollSpy);
    handleScrollSpy();
  }
}

function handleScrollSpy() {
  const content = document.getElementById('content');
  const headings = content ? content.querySelectorAll('h2, h3') : [];
  const contentWrapper = document.getElementById('content-wrapper');
  const outlineItems = document.querySelectorAll('.outline-item');
  if (!headings.length || !outlineItems.length || !contentWrapper) return;
  
  let currentActive = null;
  
  for (let i = 0; i < headings.length; i++) {
    const h = headings[i];
    if (h.offsetTop <= contentWrapper.scrollTop + 80) {
      currentActive = h.id;
    } else {
      break;
    }
  }
  
  if (!currentActive && headings.length) {
    currentActive = headings[0].id;
  }
  
  outlineItems.forEach(item => {
    if (item.getAttribute('data-target') === currentActive) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}
`;
}

function main() {
  const allFiles = walkDir(DOCS_DIR);

  const mdFiles = allFiles.filter(f => f.rel.endsWith('.md'));
  const bruFiles = allFiles.filter(f =>
    f.rel.endsWith('.bru') &&
    !f.rel.includes('collection.bru') &&
    !f.rel.includes('environments' + path.sep)
  );

  const docs = mdFiles.map(parseMdFile).filter(Boolean);
  const endpoints = bruFiles.map(parseBruFile).filter(Boolean);

  // DOCS_DATA: hash → item (omit rawText to keep file size small)
  const docsData = {};
  docs.forEach(d => {
    const { rawText, ...rest } = d;
    docsData[encodeHash(d.path)] = rest;
  });
  endpoints.forEach(e => {
    docsData[encodeHash(e.path)] = e;
  });

  const navTree = buildNavTree(docs, endpoints);
  const searchIndex = buildSearchIndex(docs, endpoints);

  const html = generateHtml({ navTree, docsData, searchIndex });
  fs.writeFileSync(OUTPUT, html, 'utf8');

  const sizeKb = Math.round(fs.statSync(OUTPUT).size / 1024);
  console.log(`✅ dashboard.html generated (${sizeKb} KB)`);
  console.log(`   ${docs.length} doc files · ${endpoints.length} endpoints`);
}

if (process.env.TEST !== '1') {
  main();
} else {
  module.exports = { walkDir, encodeHash, parseMdFile, parseBruFile, buildNavTree, buildSearchIndex };
}
