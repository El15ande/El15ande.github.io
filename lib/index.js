var indexJS = (function () {
  function init() {
    var resume1 = document.getElementById('EN_resume_CompSci');
    resume1.onclick = function () {
      window.open("lib/En_Resume_CompSci.pdf");
    }
  }

  return {
    init: init
  }
}) ();
