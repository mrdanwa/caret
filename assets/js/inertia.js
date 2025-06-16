function isElementInViewport(el) {
  "use strict";
  if (typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
  }

  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

(function ($) {
  "use strict";
  $.fn.zanimationSplit = function (option) {
    var $this = this,
      controller = $this.data("zanim-text"),
      split = new SplitText($this, { type: "lines, words, chars" });

    controller.delay || (controller.delay = 0.02);
    controller.split || (controller.split = "chars");
    (controller.ease &&
      (controller.to.ease = controller.ease) &&
      controller.to.ease) ||
      (controller.to.ease = "Expo.easeOut");

    function triggerAnimation() {
      if (isElementInViewport($this) && $this.attr("data-zanim-text")) {
        TweenMax.staggerFromTo(
          split[controller.split],
          controller.duration,
          controller.from,
          controller.to,
          controller.delay,
          function () {
            split.revert();
          }
        );
        $this.removeAttr("data-zanim-text");
      }
    }

    triggerAnimation();
    $(window).on("scroll", triggerAnimation);
  };
})(jQuery);

(function ($) {
  "use strict";
  $.fn.inertia = function (controller) {
    var $this = this,
      options = $this.data("inertia"),
      offset = $this.offset().top,
      winHeight = $(window).height(),
      currentPosition = $(window).scrollTop(),
      y = 0,
      previousPosition = 0;

    (options && (controller = options)) || (!controller && (controller = {}));
    controller.weight || (controller.weight = 2);
    controller.duration || (controller.duration = 0.7);
    controller.ease || (controller.ease = "Power3.easeOut");

    $this.css(
      "transform",
      "translateY(" +
        (($this.offset().top - $(window).scrollTop()) * 100) / winHeight +
        "px)"
    );

    $(window).on("resize scroll", function () {
      currentPosition = $(window).scrollTop();
      y = (controller.weight * (offset - currentPosition) * 100) / winHeight;

      currentPosition == previousPosition ||
        TweenMax.to($this, controller.duration, {
          y: y,
          ease: controller.ease,
        });

      previousPosition = currentPosition;
    });
  };
})(jQuery);
