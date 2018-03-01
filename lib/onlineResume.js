
var onlineCVJS = (function () {

  function init() {
    //Hide or display content in each title;
    $(".title").click(function() {
      if($(this).next().is(":hidden")) {
        $(this).next().show();
        $(this).children(".further").text("▼");
      } else {
        $(this).next().hide();
        $(this).children(".further").text("▶");
      }
    });

    //View all;
    $("#viewAll").click(function() {
      $(".title").trigger("click");
      if($(this).text() == "View All") {
        $(this).text("Close All");
      } else {
        $(this).text("View All");
      }
    });

  }

  return {
    init: init
  }

}) ();
