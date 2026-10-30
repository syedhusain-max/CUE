// One-off converter: Claude Design template (sc-if / sc-for / {{ }}) -> JSX.
// Usage: node convert.mjs <cue.dc.html> <outJsxBody> <outPseudoCss>
import fs from 'node:fs';
import crypto from 'node:crypto';

const [, , src, outJsx, outCss] = process.argv;
const html = fs.readFileSync(src, 'utf8');
const start = html.indexOf('</helmet>') + '</helmet>'.length;
const end = html.indexOf('</x-dc>');
const tpl = html.slice(start, end);

// ---------- tokenizer ----------
const tokens = [];
let i = 0;
while (i < tpl.length) {
  if (tpl[i] === '<') {
    if (tpl.startsWith('<!--', i)) { i = tpl.indexOf('-->', i) + 3; continue; }
    let j = i + 1, q = null;
    for (; j < tpl.length; j++) {
      const ch = tpl[j];
      if (q) { if (ch === q) q = null; continue; }
      if (ch === '"' || ch === "'") { q = ch; continue; }
      if (ch === '>') break;
    }
    const raw = tpl.slice(i + 1, j);
    i = j + 1;
    if (raw.startsWith('/')) { tokens.push({ t: 'close', name: raw.slice(1).trim() }); continue; }
    const selfClose = raw.endsWith('/');
    const body = selfClose ? raw.slice(0, -1) : raw;
    const m = body.match(/^([a-zA-Z][a-zA-Z0-9-]*)/);
    const name = m[1];
    const attrs = [];
    const re = /([a-zA-Z_:][a-zA-Z0-9_:.-]*)(?:\s*=\s*"([^"]*)")?/g;
    re.lastIndex = name.length;
    let am;
    while ((am = re.exec(body))) attrs.push([am[1], am[2] ?? null]);
    tokens.push({ t: 'open', name, attrs, selfClose });
  } else {
    const j = tpl.indexOf('<', i);
    const text = tpl.slice(i, j === -1 ? tpl.length : j);
    tokens.push({ t: 'text', text });
    i = j === -1 ? tpl.length : j;
  }
}

// ---------- tree ----------
const VOID = new Set(['input', 'br', 'img', 'meta', 'link', 'hr']);
const root = { name: '#root', children: [] };
const stack = [root];
for (const tk of tokens) {
  const top = stack[stack.length - 1];
  if (tk.t === 'text') top.children.push({ text: tk.text });
  else if (tk.t === 'open') {
    const node = { name: tk.name, attrs: tk.attrs, children: [] };
    top.children.push(node);
    if (!tk.selfClose && !VOID.has(tk.name)) stack.push(node);
  } else {
    if (VOID.has(tk.name)) continue;
    const idx = stack.map(n => n.name).lastIndexOf(tk.name);
    if (idx < 1) throw new Error('Unbalanced close ' + tk.name);
    stack.length = idx;
  }
}
if (stack.length !== 1) throw new Error('Unclosed: ' + stack.map(n => n.name).join('>'));

// ---------- helpers ----------
const scopes = [];
const bindExpr = (path) => {
  const rootId = path.split('.')[0];
  return scopes.includes(rootId) ? path : 'v.' + path;
};
const BIND = /\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}/g;
const onlyBind = (s) => { const m = s.match(/^\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}$/); return m ? bindExpr(m[1]) : null; };
const tplLit = (s) => '`' + s.replace(/[`\\]/g, c => '\\' + c).replace(/\$\{/g, '\\${').replace(BIND, (_, p) => '${' + bindExpr(p) + '}') + '`';
const valueExpr = (s) => { const b = onlyBind(s); if (b) return b; if (BIND.test(s)) { BIND.lastIndex = 0; return tplLit(s); } BIND.lastIndex = 0; return JSON.stringify(decode(s)); };
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const camel = (p) => {
  if (p.startsWith('--')) return p;
  if (p.startsWith('-webkit-')) p = 'Webkit-' + p.slice(8);
  return p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
};
const splitDecls = (s) => {
  const out = []; let depth = 0, cur = '', q = null;
  for (const ch of s) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"') { q = ch; cur += ch; continue; }
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map(d => d.trim()).filter(Boolean);
};
const styleObj = (s) => {
  const parts = splitDecls(decode(s)).map(d => {
    const k = d.indexOf(':');
    const prop = d.slice(0, k).trim(), val = d.slice(k + 1).trim();
    return `${JSON.stringify(camel(prop))}:${valueExpr(val)}`;
  });
  return `{{${parts.join(',')}}}`;
};

const pseudo = new Map();
const pseudoClass = (kind, decls) => {
  const key = kind + '|' + decls;
  if (!pseudo.has(key)) {
    const h = crypto.createHash('sha1').update(key).digest('hex').slice(0, 6);
    pseudo.set(key, { cls: `${kind[0]}x-${h}`, kind, decls });
  }
  return pseudo.get(key).cls;
};

const ROUTES = { '#library': '/library', '#components': '/components', '#builder': '/builder', '#why': '/plans', '#plans': '/plans#plans', '#faq': '/plans#faq' };
const ATTR = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', playsinline: 'playsInline', readonly: 'readOnly', 'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin', 'stroke-dasharray': 'strokeDasharray', 'fill-rule': 'fillRule' };
const BOOL = new Set(['loop', 'playsinline', 'muted', 'autoplay', 'controls']);
const NUM = new Set(['rows', 'cols', 'tabindex']);

const textOut = (t) => {
  if (!t) return '';
  let out = '';
  let last = 0;
  t.replace(BIND, (m, p, off) => {
    out += escText(t.slice(last, off));
    out += '{' + bindExpr(p) + '}';
    last = off + m.length;
  });
  out += escText(t.slice(last));
  return out;
};
const escText = (s) => s.replace(/[{}<>]/g, c => `{${JSON.stringify(c)}}`);

let depth = 0;
const ind = () => '  '.repeat(depth);

function emit(node) {
  if ('text' in node) {
    const t = node.text;
    if (!t.trim()) return t.includes('\n') ? '' : textOut(t);
    return textOut(t.replace(/\s*\n\s*/g, ' '));
  }
  const kids = () => node.children.map(emit).join('');
  if (node.name === 'sc-if') {
    const cond = onlyBind(node.attrs.find(a => a[0] === 'value')[1]);
    return `{${cond} ? (<>${kids()}</>) : null}`;
  }
  if (node.name === 'sc-for') {
    const list = onlyBind(node.attrs.find(a => a[0] === 'list')[1]);
    const as = node.attrs.find(a => a[0] === 'as')[1];
    scopes.push(as);
    const body = kids();
    scopes.pop();
    return `{(${list} || []).map((${as}, ${as}$i) => (<React.Fragment key={${as}$i}>${body}</React.Fragment>))}`;
  }
  const props = [];
  const classes = [];
  const isVideo = node.name === 'video';
  for (const [n, raw] of node.attrs) {
    if (n.startsWith('hint-')) continue;
    if (n === 'style') { props.push(`style=${styleObj(raw)}`); continue; }
    if (n === 'style-hover' || n === 'style-active' || n === 'style-focus') { classes.push(pseudoClass(n.slice(6), raw)); continue; }
    if (n === 'class') { classes.unshift(raw); continue; }
    const name = ATTR[n] || n;
    if (raw === null || (BOOL.has(n) && raw === '')) { props.push(name); continue; }
    if (n === 'href' && ROUTES[raw]) { props.push(`href="${ROUTES[raw]}"`); continue; }
    if ((n === 'src' || n === 'poster') && raw.startsWith('media/')) { props.push(`${name}="/${raw}"`); continue; }
    if (NUM.has(n) && /^-?\d+$/.test(raw)) { props.push(`${name}={${raw}}`); continue; }
    const ve = valueExpr(raw);
    props.push(ve.startsWith('"') && !/[{}]/.test(ve) ? `${name}=${ve}` : `${name}={${ve}}`);
  }
  if (isVideo && !node.attrs.some(a => a[0] === 'muted')) props.push('muted');
  if (classes.length) props.unshift(`className="${classes.join(' ')}"`);
  const open = `<${node.name}${props.length ? ' ' + props.join(' ') : ''}`;
  if (VOID.has(node.name) || (!node.children.length && ['video', 'textarea'].includes(node.name) === false && node.name !== 'span' && node.name !== 'div' && node.name !== 'button' && node.name !== 'a' && node.name !== 'path' && node.name !== 'circle' && node.name !== 'rect' && node.name !== 'g')) {
    if (!node.children.length) return `${open} />`;
  }
  if (!node.children.length) return `${open} />`;
  if (node.name === 'textarea') return `${open} />`;
  if (node.name === 'pre') {
    const b = node.children.map(c => ('text' in c ? c.text.replace(BIND, (_, p) => '\u0000' + p + '\u0000') : '')).join('');
    const m = b.match(/^\u0000(.+)\u0000$/);
    if (m) return `${open}>{${bindExpr(m[1])}}</${node.name}>`;
  }
  depth++;
  const inner = kids();
  depth--;
  return `${open}>${inner}</${node.name}>`;
}

const jsx = root.children.map(emit).join('');
fs.writeFileSync(outJsx, jsx);
let css = '/* Generated from the Claude Design style-hover / style-active / style-focus attributes. */\n';
for (const { cls, kind, decls } of pseudo.values()) {
  const body = splitDecls(decode(decls)).map(d => d + ' !important').join(';');
  css += `.${cls}:${kind}{${body}}\n`;
}
fs.writeFileSync(outCss, css);
console.log('pseudo classes', pseudo.size, 'jsx bytes', jsx.length);
