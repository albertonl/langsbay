document.addEventListener('DOMContentLoaded', () => {
  $('.burger, .overlay').click(function () {
    $('.burger').toggleClass('clicked');
    if (document.querySelector('.burger').classList.contains('clicked')) {
      document.querySelector('.burger').style.background = "transparent";
    } else {
      setTimeout(() => {
        document.querySelector('.burger').style.background = "#9fc2cc";
      }, 400);
    }
    $('.overlay').toggleClass('show');
    $('nav').toggleClass('show');
    $('body').toggleClass('overflow');

    setTimeout(() => {
      let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
      if (width <= 700) $('.logo-top').toggle();
    }, 250);
  });
});
