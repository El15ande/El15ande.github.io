var indexJS = (function () {
  function init() {
    var resumeCH = document.getElementById('resume_CH');
    resumeCH.onclick = function () {
      window.open("lib/CV-N-CN.pdf");
    }
  }

  return {
    init: init
  }
}) ();
