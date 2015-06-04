/**
 * Scrolling timeline functionality for the front page
 */
$(function () {

  $(document).on("scroll", function () {

    // for simplicity's sake this listeners is attached either way
    // but only really do anything costly when we're on the intro page
    // TODO maybe this could be checked from the sammyjs instance straight instead of reading the DOM class here

    if ($("main").hasClass("page-etusivu") && $("body").width() > $("#width-30em").width()) {
      var scrollPercent = ($("body").scrollTop()) / ($("main").height() - $("body").height());
      $("#intro").css('margin-left', scrollPercent * -100 + "%");
      $("#timeline").css('margin-left', scrollPercent * -75 + "%");
      $("#timeline-line").css('margin-left', (1 - scrollPercent) * 5 + "%");

      if (scrollPercent > 0.5) {
        $("#timeline").removeClass("collapsed");
        $(".timeline-event").addClass("visible");
        setLeftButton("#/etusivu", "Etusivu");
      } else {
        $("#timeline").addClass("collapsed");
        $(".timeline-event").removeClass("visible");
        setLeftButton(false);
      }
    }

  });

  $("main").on("click", "#timeline", function () {
    if (parseInt($("#timeline").css("margin-left")) < 50) {
      $("body").animate({
        "scrollTop": $(document).height()
      }, 1500, function () {
        setLeftButton("#/etusivu", "Etusivu");
        $("#timeline").removeClass("collapsed");
      });
    }
  });


  function setLeftButton(href, label) {
    try {
      if (href === false || label === "undefined") {
        throw new Error("Hide button");
      }
      $(".button-left-bottom").attr('href', href).fadeIn()
        .find("span").html(label);
    } catch (e) {
      $(".button-left-bottom").fadeOut();
    }
  }

});