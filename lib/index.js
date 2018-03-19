
var indexJS = (function () {

  function init() {
    var resume = document.getElementById('resumeCH');
    resume.onclick = function () {
      window.open("CV.pdf")
    }

    var cardTrick = document.getElementById('cardTrick');
    cardTrick.onclick = function () {
      window.open("https://github.com/El15ande/DefaultRepository/blob/master/ReadMyMind.c")
    }

  }

  return {
    init: init
  }

}) ();
