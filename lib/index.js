
var indexJS = (function () {

  function init() {
    var resume = document.getElementById('resumeCN');
    resume.onclick = function () {
      window.open("CV.pdf")
    }

  }

  return {
    init: init
  }

}) ();
