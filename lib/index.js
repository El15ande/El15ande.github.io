
var indexJS = (function () {

  function init() {
    var resumeCH = document.getElementById('resumeCH');
    resumeCH.onclick = function () {
      window.open("lib/CV-N-CN.pdf");
    }

    var resumeEN = document.getElementById('resumeEN');
    resumeEN.onclick = function () {
      alert("Still constructing...");
    }

  }

  return {
    init: init
  }

}) ();
