/*! kirjasto2030 - v0.0.0 - 2015-04-01
* Copyright (c) 2015 ;*/
$(function () {
  var $nav = $("#page-navigation"),
      //$pages = $nav.find("#pages"),
      $button = $(".button-menu");

  $button.on("click", toggleNav);

  function toggleNav() {
    $nav.toggleClass("open");
  }
});