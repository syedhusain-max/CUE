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
code = replaceOnce(code, 'componentDidUpdate(pp,ps){', 'componentDidUpdate(pp,ps){this.syncRoute(pp,ps);', 'didUpdate');
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
body = body.slice(0, navStart) + '<CueTabBar active={v.tabActive} nav={v.hNav} />' + body.slice(navEnd);

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
