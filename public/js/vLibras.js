(function () {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('vw', '');
  wrapper.className = 'enabled';
  wrapper.innerHTML = `
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper>
      <div class="vw-plugin-top-wrapper"></div>
    </div>`;
  document.body.appendChild(wrapper);

  const script = document.createElement('script');
  script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
  script.onload = () => new window.VLibras.Widget('https://vlibras.gov.br/app');
  document.body.appendChild(script);
})();