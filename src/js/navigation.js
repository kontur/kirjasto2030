/**
 * navigation components
 */
$(function () {
  var $nav = $("#page-navigation"),
      //$pages = $nav.find("#pages"),
      $button = $(".button-menu");

  $button.on("click", toggleNav);

  function toggleNav() {
    $nav.toggleClass("open");
  }
});