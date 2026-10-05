/* =========================================================
   Menu principal — partilhado por todas as páginas.
   Carregado com <script src="/js/menu.js" defer>.
========================================================= */
(function () {
  const burger = document.getElementById('burgerBtn');
  const panel = document.getElementById('menuPanel');
  if (!burger || !panel) return;

  function fechar() {
    panel.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', function () {
    const aberto = panel.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(aberto));
  });

  panel.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', fechar);
  });

  /* fecha com Esc e devolve o foco ao botão, como se espera de um painel
     sobreposto; sem isto quem navega por teclado fica preso no menu aberto */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      fechar();
      burger.focus();
    }
  });
})();
