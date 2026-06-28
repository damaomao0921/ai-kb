#!/usr/bin/env node
/*
 * Build a fully self-contained, offline-capable, deployable single-file HTML
 * from the DC source files. Inlines React/ReactDOM (no unpkg), the DC runtime,
 * the data, and the PromptCard child component (served via a fetch() shim so
 * the runtime's location.href + PromptCard.dc.html fetches work on file:// and
 * any static host). No Babel needed (no x-import JSX modules).
 *
 * Output: ../dist/index.html
 */
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8');

const src = read('site.dc.html');
const react = read('vendor/react.production.min.js');
const reactDom = read('vendor/react-dom.production.min.js');
const support = read('support.js');
const data = read('site-data.js');
const promptCard = read('PromptCard.dc.html');

const DATA_TAG = '<script src="./site-data.js"></script>';
const SUPPORT_TAG = '<script src="./support.js"></script>';
if (!src.includes(DATA_TAG) || !src.includes(SUPPORT_TAG)) {
  console.error('ERROR: expected script tags not found in main file'); process.exit(1);
}

// Raw page source the runtime re-fetches via fetch(location.href) for accurate
// attribute casing (onClick, hint-*, style-hover). Strip the helmet data <script>
// so the offline copy never tries to re-load ./pm-ai-data.js.
const pageSrc = src.replace(DATA_TAG, '<!-- data inlined -->');

// Safe embedding of a string as a JS string literal inside an inline <script>.
const U2028 = new RegExp(String.fromCharCode(0x2028), 'g');
const U2029 = new RegExp(String.fromCharCode(0x2029), 'g');
const jsStr = (s) => JSON.stringify(s).replace(/<\//g, '<\\/').replace(U2028, '\\u2028').replace(U2029, '\\u2029');
// Safe inlining of raw JS source (so a literal </script> inside it can't close the tag).
const safeJs = (s) => s.replace(/<\/script/gi, '<\\/script');

const shim = `(function(){
  var PROMPTCARD = ${jsStr(promptCard)};
  var PAGE_SRC = ${jsStr(pageSrc)};
  var _native = (typeof window.fetch === 'function') ? window.fetch.bind(window) : null;
  var clean = function(u){ return String(u || '').split('#')[0]; };
  window.fetch = function(input, init){
    var url = (typeof input === 'string') ? input : (input && input.url) || '';
    try {
      if (/PromptCard\\.dc\\.html(\\?|$)/i.test(url)) {
        return Promise.resolve(new Response(PROMPTCARD, {status:200, headers:{'Content-Type':'text/html'}}));
      }
      if (clean(url) === clean(location.href)) {
        return Promise.resolve(new Response(PAGE_SRC, {status:200, headers:{'Content-Type':'text/html'}}));
      }
    } catch (e) {}
    return _native ? _native(input, init) : Promise.reject(new Error('offline: ' + url));
  };
})();`;

const head = [
  '<script>/* React 18.3.1 UMD (inlined) */\n' + safeJs(react) + '\n</script>',
  '<script>/* ReactDOM 18.3.1 UMD (inlined) */\n' + safeJs(reactDom) + '\n</script>',
  '<script>/* offline asset shim: PromptCard + page source */\n' + shim + '\n</script>',
  '<script>/* SITE_DATA (inlined) */\n' + safeJs(data) + '\n</script>',
  '<script>/* DC runtime support.js (inlined) */\n' + safeJs(support) + '\n</script>',
].join('\n');

// Use function replacements so `$&`/`$'`/`$n` inside inlined JS (e.g. React's
// minified "$&/" key-escape code) are inserted literally, not treated as
// String.replace special patterns.
let out = src.replace(SUPPORT_TAG, () => head).replace(DATA_TAG, () => '<!-- data inlined in <head> -->');

const outPath = path.join(dir, '..', 'index.html');
fs.writeFileSync(outPath, out);
console.log('Built', outPath);
console.log('  size:', (out.length / 1024).toFixed(0), 'KB  (single self-contained file)');
console.log('  inlined: React', (react.length/1024|0)+'KB +', 'ReactDOM', (reactDom.length/1024|0)+'KB +', 'runtime', (support.length/1024|0)+'KB +', 'data', (data.length/1024|0)+'KB + PromptCard');
