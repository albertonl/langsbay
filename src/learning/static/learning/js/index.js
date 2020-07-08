document.addEventListener('DOMContentLoaded', () => {
  var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  if (((vh*3588)/1842) <= vw)
    document.getElementById('backgroundimg').style.backgroundSize = 'cover';
  else
    document.getElementById('backgroundimg').style.backgroundSize = 'cover'; // `auto ${vh}px`;
  document.querySelector('.main-content-index').style.marginTop = `${vh+50}px`;
  document.querySelector('.intro-text').style.paddingTop = `${vw > 768 ? vh/3 : vh/4.5}px`;
});
