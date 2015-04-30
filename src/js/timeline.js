/**
 * Scrolling timeline functionality for the front page
 */
$(function () {

  $(document).on("scroll", function () {

    // for simplicity's sake this listeners is attached either way
    // but only really do anything costly when we're on the intro page
    // TODO maybe this could be checked from the sammyjs instance straight instead of reading the DOM class here

    if ($("main").hasClass("page-intro") && $("body").width() > $("#30em").width()) {
      var scrollPercent = ($("body").scrollTop()) / ($("main").height() - $("body").height());

      $("#intro").css('margin-left', scrollPercent * -100 + "%");
      $("#timeline").css('margin-left', scrollPercent * -75 + "%");
      $("#timeline-line").css('margin-left', (1 - scrollPercent) * 20 + "%");

      if (scrollPercent > 0.5) {
        $(".timeline-event").addClass("visible");
      } else {
        $(".timeline-event").removeClass("visible");
      }
    }

  });

});