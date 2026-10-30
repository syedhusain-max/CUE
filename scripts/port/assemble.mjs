// Builds components/cue/CueApp.jsx from the Claude Design export + converted template.
import fs from 'node:fs';
const [, , srcHtml, bodyJsx, out] = process.argv;
const html = fs.readFileSync(srcHtml, 'utf8');
let body = fs.readFileSync(bodyJsx, 'utf8');

const must = (cond, msg) => { if (!cond) throw new Error('assemble: ' + msg); };
const replaceOnce = (str, from, to, label) => {
  const n = str.split(from).length - 1;
  must(n === 1, `${label}: expected 1 match, got ${n}`);
  return str.replace(from, to);
};

// ---- logic: the class body from the <script type="text/x-dc"> block ----
const s0 = html.indexOf('class Component extends DCLogic {');
const s1 = html.lastIndexOf('</script>');
let code = html.slice(s0, s1).trim();
must(code.endsWith('}'), 'class end');
code = code.slice(0, -1).trimEnd(); // drop the final class brace, render() goes in before it

code = replaceOnce(code, 'class Component extends DCLogic {', 'export default class CueApp extends React.Component {\n  static defaultProps = CUE_CONFIG;', 'class header');
// Data is bundled now instead of imported at runtime.
code = replaceOnce(code, "state = { view:'home', T:[], C:[], A:[],", "state = { view:this.props.view||'home', introOn:(this.props.view||'home')==='home'?undefined:false, T:TEMPLATES, C:COMPONENTS, A:ANIMATIONS,", 'state');
code = replaceOnce(code, "    const u=p=>new URL(p,document.baseURI).href;\n    Promise.all([import(u('library-data.js')),import(u('component-data.js'))]).then(([l,c])=>this.setState({T:l.TEMPLATES,C:c.COMPONENTS,A:c.ANIMATIONS}));\n", '', 'data import');
// Keep the address bar and the view in step (see routes.js).
code = replaceOnce(code, 'componentDidUpdate(pp,ps){', 'componentDidUpdate(pp,ps){this.syncRoute(pp,ps);if(ps.comp!==this.state.comp||ps.animOverride!==this.state.animOverride||ps.view!==this.state.view)this.centerChips();', 'didUpdate');
code = replaceOnce(code, '    this.introInit();\n', '    this.introInit();\n    this.centerChips(true);\n', 'centerChips on mount');
// Phone layout of Components: keep the selected component and animation chips in view.
code = replaceOnce(code, '  hash(s){', `  centerChips(instant){
    if(typeof window==='undefined'||!window.matchMedia('(max-width: 767px)').matches)return;
    requestAnimationFrame(()=>[['.cmp-list','[aria-current="true"]'],['.cmp-anims','[aria-pressed="true"]']].forEach(([box,sel])=>{
      const c=document.querySelector(box),el=c&&c.querySelector(sel);if(!el||c.scrollWidth<=c.clientWidth)return;
      const cr=c.getBoundingClientRect(),er=el.getBoundingClientRect();
      c.scrollTo({left:c.scrollLeft+(er.left-cr.left)-(cr.width-er.width)/2,behavior:instant||this.reduce?'auto':'smooth'});
    }));
  }
  hash(s){`, 'centerChips');
code = replaceOnce(code, '  hash(s){', `  syncRoute(pp,ps){
    const v=this.state.view;
    if(this.props.view!==pp.view&&this.props.view!==v){this.setState({view:this.props.view,open:null});return;}
    if(v!==ps.view&&v!==this.props.view&&this.props.navigate)this.props.navigate(v);
  }
  hash(s){`, 'syncRoute');
// Absolute asset paths, so nested routes resolve them.
code = code.replace(/(['"\`])media\//g, '$1/media/');
code = replaceOnce(code, "dtDemoUrl:dt?'templates/'+dt.id+'/':''", "dtDemoUrl:dt?'/templates/'+dt.id:''", 'demo url');
// Bug in the export: the first half of the Library wall pointed at files that do not exist.
code = replaceOnce(code, ".map(x=>'/media/'+x.slice(-3)+'.jpg').concat(", ".map(x=>'/media/'+(x==='v04p03'?'t-quarry':x)+'.jpg').concat(", 'wall fix');
// Values for the new tab bar.
code = replaceOnce(code, "      tbOn:{", "      tabActive:s.view==='why'?'plans':s.view,\n      tbOn:{", 'tabActive');
// Page titles match the per-route metadata in app/*/page.jsx (brand name still applies).
code = replaceOnce(code, "else document.title=b+'. Animated website blueprints';}", "else document.title=b+'. '+({library:'Library',components:'Components',builder:'Builder',why:'Plans'}[this.state.view]||'Animated website blueprints');}", 'titles');

// ---- template edits ----
const toastStart = body.indexOf('{v.hasToast ? (');
must(toastStart > -1, 'toast');
const toastEnd = body.indexOf(') : null}', toastStart) + ') : null}'.length;
body = body.slice(0, toastStart) + '<CueToast text={v.toast} />' + body.slice(toastEnd);

const navStart = body.indexOf('<nav className="tabbar"');
must(navStart > -1, 'tabbar');
const navEnd = body.indexOf('</nav>', navStart) + '</nav>'.length;
body = body.slice(0, navStart) + '<CueTabBar active={v.tabActive} nav={v.hNav} hidden={!!(v.drawerOpen || v.palOpen || v.paywallOpen)} />' + body.slice(navEnd);

// Home hero stack: five different templates, each with its own poster (the export showed Atlas Rail three
// times and paired videos with other templates' posters). The Paste scene poster now matches its video.
const media = [
  ['src="/media/t-night-shift.mp4" poster="/media/t-atlas-rail-2.jpg"', 'src="/media/t-night-shift.mp4" poster="/media/t-night-shift.jpg"'],
  ['src="/media/t-monsoon.mp4" poster="/media/t-inkwell-3.jpg"', 'src="/media/t-monsoon.mp4" poster="/media/t-monsoon.jpg"'],
  ['src="/media/t-atlas-rail.mp4" poster="/media/t-monsoon-3.jpg"', 'src="/media/t-quarry.mp4" poster="/media/t-quarry.jpg"'],
  ['src="/media/t-atlas-rail.mp4" poster="/media/t-atlas-rail-1.jpg"', 'src="/media/t-inkwell.mp4" poster="/media/t-inkwell.jpg"'],
  ['src="/media/t-atlas-rail.mp4" poster="/media/t-monsoon-2.jpg"', 'src="/media/t-atlas-rail.mp4" poster="/media/t-atlas-rail.jpg"'],
  ['src="/media/t-monsoon.mp4" poster="/media/t-night-shift-3.jpg"', 'src="/media/t-monsoon.mp4" poster="/media/t-monsoon.jpg"'],
];
for (const [a, b] of media) body = replaceOnce(body, a, b, 'media ' + a);

// Components view: hooks for the phone layout in app/globals.css (.cmp-*).
const cmp = [
  ['<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,240px),1fr))","gap":"20px","alignItems":"start"}}>', '<div className="cmp-grid" style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,240px),1fr))","gap":"20px","alignItems":"start"}}>'],
  ['<nav aria-label="Components"', '<nav className="cmp-list" aria-label="Components"'],
  ['<section style={{"gridColumn":"span 2"', '<section className="cmp-main" style={{"gridColumn":"span 2"'],
  ['<div data-tilt="7"', '<div className="cmp-stage" data-tilt="7"'],
  ['<aside aria-label="Animation library"', '<aside className="cmp-anims" aria-label="Animation library"'],
];
for (const [a, b] of cmp) body = replaceOnce(body, a, b, 'cmp ' + a);

const header = `'use client';
// Ported from the Claude Design export (cue.dc.html). The logic below is the original
// component class; the markup in render() was converted from its template.
// Hover and press styles live in app/pseudo.css.
import React from 'react';
import { TEMPLATES } from '../../lib/library-data.js';
import { COMPONENTS, ANIMATIONS } from '../../lib/component-data.js';
import { CUE_CONFIG } from '../../lib/config.js';
import CueTabBar from './CueTabBar';
import CueToast from './CueToast';

`;
const render = `

  render(){
    const v=this.renderVals();
    return (${body});
  }
}
`;
fs.writeFileSync(out, header + code + render);
console.log('wrote', out, (header + code + render).length);
