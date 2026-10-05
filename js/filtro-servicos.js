/* =========================================================
   Filtro de serviços por momento da empresa — só em /o-que-fazemos.

   Cada <li> de serviço traz data-momento com um ou dois valores
   ("novo", "funcionamento"). O rótulo visível continua a ser o texto da
   apresentação; o data-momento é que define a semântica do filtro.

   Sem JavaScript a barra fica escondida (ver .of-filtro no CSS) e a
   página mostra os 9 serviços, como antes.

   O estado fica no URL: /o-que-fazemos?momento=novo — assim pode ser
   partilhado, guardado nos favoritos ou linkado de outra página.
========================================================= */
(function () {
  const barra = document.querySelector('[data-filtro]');
  if (!barra) return;

  document.documentElement.classList.add('tem-js');

  const PARAM = 'momento';
  const VALIDOS = ['todos', 'novo', 'funcionamento'];

  const botoes = Array.prototype.slice.call(barra.querySelectorAll('button[data-momento]'));
  const aviso = barra.querySelector('[data-filtro-aviso]');
  const listas = Array.prototype.slice.call(document.querySelectorAll('.of-services'));

  /* lê o momento do URL; qualquer valor desconhecido cai em "todos" */
  function momentoDoURL() {
    let valor = null;
    try {
      valor = new URLSearchParams(location.search).get(PARAM);
    } catch (e) {
      return 'todos';
    }
    return VALIDOS.indexOf(valor) !== -1 ? valor : 'todos';
  }

  /* escreve com replaceState: o URL fica partilhável sem encher o histórico
     de entradas a cada clique — o Voltar sai da página, como se espera.
     "todos" não põe parâmetro nenhum, para o URL ficar limpo. */
  function guardarNoURL(momento) {
    try {
      const url = new URL(location.href);
      if (momento === 'todos') url.searchParams.delete(PARAM);
      else url.searchParams.set(PARAM, momento);
      history.replaceState(null, '', url);
    } catch (e) {
      /* file:// ou browser sem History API: o filtro continua a funcionar */
    }
  }

  /* desliga a regra CSS que faz o último item ocupar a linha toda:
     com filtro, quem é o último muda, e passa a ser o JS a decidir */
  listas.forEach(function (lista) {
    lista.classList.add('is-filtrada');
  });

  function aplicar(momento) {
    let total = 0;

    listas.forEach(function (lista) {
      const visiveis = [];

      Array.prototype.slice.call(lista.children).forEach(function (li) {
        const momentos = (li.dataset.momento || '').split(' ');
        const mostra = momento === 'todos' || momentos.indexOf(momento) !== -1;
        li.hidden = !mostra;
        li.classList.remove('ocupa-linha');
        if (mostra) visiveis.push(li);
      });

      /* em 2 colunas, um número ímpar deixa o último sozinho: ocupa a linha */
      if (visiveis.length % 2 === 1) {
        visiveis[visiveis.length - 1].classList.add('ocupa-linha');
      }

      /* uma solução sem serviços neste momento sai de cena, e a sua âncora também */
      const seccao = lista.closest('.of-sec');
      const vazia = visiveis.length === 0;
      seccao.hidden = vazia;
      const ancora = document.querySelector('.of-anchors a[href="#' + seccao.id + '"]');
      if (ancora) ancora.hidden = vazia;

      total += visiveis.length;
    });

    botoes.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.momento === momento));
    });

    if (aviso) {
      aviso.textContent =
        total + (total === 1 ? ' serviço' : ' serviços') +
        (momento === 'todos' ? '' : ' para este momento');
    }
  }

  botoes.forEach(function (b) {
    b.addEventListener('click', function () {
      aplicar(b.dataset.momento);
      guardarNoURL(b.dataset.momento);
    });
  });

  /* arranque: respeita o que vier no URL. Também escreve, para normalizar
     um valor inválido ou um ?momento=todos deixado à mão. */
  const inicial = momentoDoURL();
  aplicar(inicial);
  guardarNoURL(inicial);
})();
