import { copySl } from './copy-sl.js';
import { demosSl } from './demos-sl.js';
import { roadmapSl } from './roadmap-sl.js';

export const LOCALE_KEY = 'nodesk.site.language';
export const messages = { ...roadmapSl, ...copySl, ...demosSl };
export function readLocale(storage) {
  try { return storage.getItem(LOCALE_KEY) === 'en' ? 'en' : 'sl'; }
  catch { return 'sl'; }
}
export let locale = 'sl';
export function translate(text, language = locale) {
  if (language !== 'sl') return text;
  const key = text.trim();
  let value = messages[key];
  if (value === undefined) {
    const rules = [
      [/^(\d+) of (\d+) items done$/, (_, a, b) => `${a} od ${b} nalog dokončanih`],
      [/^(\d+) of (\d+) done$/, (_, a, b) => `${a} od ${b} dokončanih`],
      [/^of (\d+)$/, (_, n) => `od ${n}`],
      [/^(.+) \((\d+) of (\d+)\)$/, (_, name, a, b) => `${translate(name)} (${a} od ${b})`],
      [/^Current build (.+)$/, (_, v) => `Trenutna različica ${v}`],
      [/^Release (.+)$/, (_, v) => `Izdaja ${v}`],
      [/^Phase (.+)$/, (_, v) => `Faza ${v}`],
      [/^(.+) in the roadmap$/, (_, id) => `${id} v načrtu razvoja`],
      [/^(\[.+\]) moved$/, (_, time) => `${time} premaknjene`],
      [/^(\[.+\]) undone ·$/, (_, time) => `${time} razveljavljeno ·`],
      [/^Download (.+)$/, (_, v) => `Prenesi ${v === 'installer' ? 'namestitveni program' : v}`],
    ];
    for (const [pattern, replace] of rules) if (pattern.test(key)) { value = key.replace(pattern, replace); break; }
  }
  return value === undefined ? text : text.replace(key, value);
}

// Translate text nodes, never HTML: links, listeners, filenames and generated roadmap data stay intact.
export function initLocale() {
  try { locale = readLocale(window.localStorage); } catch { locale = 'sl'; }
  const originals = new WeakMap();
  const attributes = ['aria-label', 'aria-roledescription', 'title', 'placeholder', 'content'];
  const ignored = 'script, style, code, kbd, option, [translate="no"]';
  function update(node, key, value, write) {
    let saved = originals.get(node);
    if (!saved) { saved = {}; originals.set(node, saved); }
    if (!saved[key] || saved[key].output !== value) saved[key] = { source: (!saved[key] && node.parentElement?.dataset.en && key === 'text') ? node.parentElement.dataset.en : (!saved[key] && node.getAttribute?.(`data-en-${key}`)) || value };
    const output = translate(saved[key].source);
    saved[key].output = output;
    if (value !== output) write(output);
  }
  function visit(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.parentElement && !node.parentElement.closest(ignored)) update(node, 'text', node.data, (v) => { node.data = v; });
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_NODE) return;
    if (node.matches?.(ignored)) return;
    if (node.nodeType === Node.ELEMENT_NODE) for (const key of attributes) {
      if (node.hasAttribute(key) && (key !== 'content' || node.matches('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]'))) {
        update(node, key, node.getAttribute(key), (v) => node.setAttribute(key, v));
      }
    }
    node.childNodes.forEach(visit);
  }
  const observer = new MutationObserver((records) => {
    observer.disconnect();
    for (const record of records) {
      if (record.type === 'childList') record.addedNodes.forEach(visit);
      else visit(record.target);
    }
    observe();
  });
  const observe = () => observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: attributes });
  const select = document.getElementById('language');
  function apply() {
    observer.disconnect();
    document.documentElement.lang = locale;
    if (select) select.value = locale;
    visit(document);
    observe();
  }
  select?.addEventListener('change', () => {
    locale = select.value === 'en' ? 'en' : 'sl';
    try { localStorage.setItem(LOCALE_KEY, locale); } catch { /* The choice still works for this visit. */ }
    apply();
    dispatchEvent(new Event('nd:locale'));
  });
  apply();
}
