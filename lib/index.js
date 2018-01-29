
var indexJS = (function () {

  function init() {
    var button = document.getElementById('button');
    button.onclick = function () {
      if(button.textContent == 'click') {
        button.textContent = 'clicked';
      } else {
        button.textContent = 'click';
      }
    }

  }

  return {
    init: init
  }

}) ();
