var indexJS = (function () {
  function init() {
    var resumeCH = document.getElementById('resume_CH');
    resumeCH.onclick = function () {
      window.open("lib/En_Resume_CompSci.pdf");
    }
  }

  return {
    init: init
  }
}) ();
