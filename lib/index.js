
var indexJS = (function () {

  function init() {
    var resumeCH = document.getElementById('resumeCH');
    resumeCH.onclick = function () {
      alert("Still constructing...");
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
