(function () {
  var player = document.getElementById('player'), frame = document.getElementById('pframe'),
      closeBtn = document.getElementById('pclose'), ytLink = document.getElementById('pyt'), last = null;
  function openPlayer(id, vertical, trigger) {
    last = trigger;
    frame.className = vertical ? 'v' : 'w';
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
    f.title = 'Player de vídeo do YouTube';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    f.allowFullscreen = true;
    frame.innerHTML = '';
    frame.appendChild(f);
    ytLink.href = (vertical ? 'https://www.youtube.com/shorts/' : 'https://www.youtube.com/watch?v=') + id;
    player.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function shut() {
    player.hidden = true;
    frame.innerHTML = '';
    document.body.style.overflow = '';
    if (last) last.focus();
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a.yt') : null;
    if (a) { e.preventDefault(); openPlayer(a.dataset.id, a.dataset.v === '1', a); }
  });
  closeBtn.addEventListener('click', shut);
  player.addEventListener('click', function (e) { if (e.target === player) shut(); });
  document.addEventListener('keydown', function (e) {
    if (player.hidden) return;
    if (e.key === 'Escape') shut();
    if (e.key === 'Tab' && !player.contains(document.activeElement)) { e.preventDefault(); closeBtn.focus(); }
  });

  var tabs = document.querySelectorAll('.tab'), cards = document.querySelectorAll('[data-kind]');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); });
      cards.forEach(function (c) { c.hidden = !(t.dataset.f === 'todos' || c.dataset.kind === t.dataset.f); });
    });
  });

  document.querySelectorAll('a.yt').forEach(function (a) {
    var cover = a.parentElement, id = a.dataset.id, vertical = a.dataset.v === '1';
    var inner = cover.querySelector('[style*="aspect-ratio:9/16"]');
    var url = 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
    var im = new Image();
    im.onload = function () {
      var t = inner || cover;
      if (vertical && !inner) {
        t.style.backgroundColor = '#0a0a0a';
        t.style.backgroundImage = 'url("' + url + '")';
        t.style.backgroundSize = 'contain';
        t.style.backgroundRepeat = 'no-repeat';
        t.style.backgroundPosition = 'center';
      } else {
        t.style.backgroundImage = 'url("' + url + '")';
        t.style.backgroundSize = 'cover';
        t.style.backgroundPosition = 'center';
      }
    };
    im.src = url;
  });

  document.querySelectorAll('.vt').forEach(function (el) {
    if (!/^Vídeo longo/.test(el.textContent)) return;
    var id = el.dataset.id;
    fetch('https://www.youtube.com/oembed?url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id) + '&format=json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d && d.title) {
          document.querySelectorAll('.vt[data-id="' + id + '"]').forEach(function (n) { n.textContent = d.title; });
          document.querySelectorAll('a.yt[data-id="' + id + '"]').forEach(function (n) { n.setAttribute('aria-label', 'Assistir: ' + d.title); });
        }
      })
      .catch(function () {});
  });
})();
