var indexJS = (function () {
  function init() {
    var resumeCH = document.getElementById('resumeCH');
    resumeCH.onclick = function () {
      window.open("lib/CV-N-CN.pdf");
    }
  }

  return {
    init: init
  }
}) ();
