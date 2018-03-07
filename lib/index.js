
var indexJS = (function () {

  function init() {
    var resume = document.getElementById('resumeCH');
    resume.onclick = function () {
      window.open("CV.pdf")
    }

  }

  return {
    init: init
  }

}) ();
