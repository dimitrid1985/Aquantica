/* =========================================================
   Filtro de artigos por categoria — só em /artigos.

   Mesmo padrão do filtro de serviços: cada <li> da lista traz data-cat,
   o estado fica no URL (?categoria=...) e sem JavaScript a barra não
   aparece e a lista mostra tudo.
========================================================= */
(function () {
  const barra = document.querySelector('[data-filtro-artigos]');
  if (!barra) return;

  document.documentElement.classList.add('tem-js');

  const PARAM = 'categoria';
  const botoes = Array.prototype.slice.call(barra.querySelectorAll('button[data-cat]'));
  const validas = botoes.map(function (b) { return b.dataset.cat; });
  const aviso = barra.querySelector('[data-filtro-aviso]');
  const itens = Array.prototype.slice.call(document.querySelectorAll('.ar-lista > li'));

  function doURL() {
    let v = null;
    try { v = new URLSearchParams(location.search).get(PARAM); } catch (e) { return 'todas'; }
    return validas.indexOf(v) !== -1 ? v : 'todas';
  }

  function guardarNoURL(cat) {
    try {
      const url = new URL(location.href);
      if (cat === 'todas') url.searchParams.delete(PARAM);
      else url.searchParams.set(PARAM, cat);
      history.replaceState(null, '', url);
    } catch (e) { /* file:// — o filtro funciona na mesma */ }
  }

  function aplicar(cat) {
    let visiveis = 0;

    itens.forEach(function (li) {
      const mostra = cat === 'todas' || li.dataset.cat === cat;
      li.hidden = !mostra;
      if (mostra) visiveis++;
    });

    botoes.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.cat === cat));
    });

    if (aviso) {
      aviso.textContent = visiveis === 0
        ? 'Ainda não há artigos nesta categoria.'
        : visiveis + (visiveis === 1 ? ' artigo' : ' artigos');
    }
  }

  botoes.forEach(function (b) {
    b.addEventListener('click', function () {
      aplicar(b.dataset.cat);
      guardarNoURL(b.dataset.cat);
    });
  });

  const inicial = doURL();
  aplicar(inicial);
  guardarNoURL(inicial);
})();
