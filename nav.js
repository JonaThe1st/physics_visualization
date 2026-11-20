/* PhysicsVisualizations shared site nav (hamburger drawer).
 * Drop-in for any simulation page AND the landing page:
 *
 *   <script src="../../nav.js"></script>   // from simulations/<slug>/index.html
 *   <script src="nav.js"></script>         // from root index.html
 *
 * Builds a hamburger button (top-left) + slide-out drawer listing
 * "Home" and every active simulation, read live from simulations.json.
 * The bar uses the page's own CSS custom properties (--bg/--fg/--bd/--card/--sph)
 * so it adapts to light/dark theme. If the manifest cannot be fetched
 * (e.g. local file:// preview) a minimal fallback list is used.
 */
(function (window, document) {
  var here = (document.currentScript && document.currentScript.src) || '';
  var root = here ? here.replace(/nav\.js([?#].*)?$/, '') : '';
  var manifest = root + 'simulations.json';
  var FALLBACK = [{ slug: 'ewald-konstruktion', title: 'Ewald Sphere Construction', on: true }];

  // Find the current simulation slug from the URL path .../simulations/<slug>/.
  function currentSlug() {
    var parts = location.pathname.split('/').filter(Boolean);
    for (var i = 0; i + 1 < parts.length; i++) if (parts[i] === 'simulations') return parts[i + 1];
    return null;
  }

  function injectStyles() {
    var css =
      '.pnv-wrap{position:fixed;top:12px;left:12px;z-index:1000}' +
      '.pnv-btn{width:40px;height:40px;border-radius:10px;border:1px solid var(--bd,#d9dee8);' +
      'background:var(--card,#f3f5f9);color:var(--fg,#1d2330);cursor:pointer;' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;' +
      'box-shadow:0 2px 8px rgba(0,0,0,.16)}' +
      '.pnv-btn span{display:block;width:18px;height:2px;background:currentColor;border-radius:2px;transition:transform .25s,opacity .25s}' +
      '.pnv-open .pnv-btn span:nth-child(1){transform:translateY(7px) rotate(45deg)}' +
      '.pnv-open .pnv-btn span:nth-child(2){opacity:0}' +
      '.pnv-open .pnv-btn span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}' +
      '.pnv-overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);opacity:0;pointer-events:none;' +
      'transition:opacity .25s;z-index:998}' +
      '.pnv-open .pnv-overlay{opacity:1;pointer-events:auto}' +
      '.pnv-drawer{position:fixed;top:0;left:0;bottom:0;width:min(80vw,300px);' +
      'background:var(--bg,#ffffff);border-right:1px solid var(--bd,#d9dee8);' +
      'box-shadow:2px 0 20px rgba(0,0,0,.20);transform:translateX(-101%);transition:transform .25s ease;' +
      'z-index:999;padding:64px 12px 12px;overflow:auto}' +
      '.pnv-open .pnv-drawer{transform:translateX(0)}' +
      '.pnv-drawer h3{font-size:11px;letter-spacing:.08em;text-transform:uppercase;' +
      'color:var(--mut,#667085);margin:0 8px 8px;font-weight:600}' +
      '.pnv-drawer a{display:block;padding:9px 10px;border-radius:8px;color:var(--fg,#1d2330);' +
      'text-decoration:none;font-size:13.5px;line-height:1.3}' +
      '.pnv-drawer a:hover{background:var(--card,#f3f5f9)}' +
      '.pnv-drawer a.home{font-weight:700;border-bottom:1px solid var(--bd,#d9dee8);border-radius:8px 8px 0 0;margin-bottom:6px}' +
      '.pnv-drawer a.active{background:var(--sph,#1f6fd1);color:#fff}' +
      '.pnv-drawer a.active:hover{background:var(--sph,#1f6fd1)}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  }

  function build(list) {
    var cur = currentSlug();
    var wrap = document.createElement('div');
    wrap.className = 'pnv-wrap';
    wrap.innerHTML =
      '<button class="pnv-btn" aria-label="Menu" title="Menu"><span></span><span></span><span></span></button>' +
      '<div class="pnv-overlay"></div>' +
      '<div class="pnv-drawer"><div class="pnv-list"></div></div>';
    document.body.appendChild(wrap);

    var btn = wrap.querySelector('.pnv-btn');
    var ov = wrap.querySelector('.pnv-overlay');
    var listEl = wrap.querySelector('.pnv-list');

    function open(v) { wrap.classList.toggle('pnv-open', !!v); }
    btn.onclick = function (e) { e.stopPropagation(); open(!wrap.classList.contains('pnv-open')); };
    ov.onclick = function () { open(false); };

    var items = [{ title: 'Home', href: root, cls: 'home' + (!cur ? ' active' : '') }];
    (list || []).forEach(function (s) {
      if (!s || !s.slug || s.on === false) return;
      items.push({ title: s.title, href: root + 'simulations/' + s.slug + '/', cls: s.slug === cur ? 'active' : '' });
    });
    listEl.innerHTML = items.map(function (it) {
      return '<a class="' + it.cls + '" href="' + it.href + '">' + it.title + '</a>';
    }).join('');
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }

  ready(function () {
    injectStyles();
    fetch(manifest).then(function (r) {
      if (!r.ok) throw new Error('no manifest');
      return r.json();
    }).then(build).catch(function () { build(FALLBACK); });
  });
})(window, document);
