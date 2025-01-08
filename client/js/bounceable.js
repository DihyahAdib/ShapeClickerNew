function bounce() {
  $(this).addClass("bouncy");
  setTimeout(() => {
    $(this).removeClass("bouncy");
  }, 300);
}

export function setupBounceablePlugin() {
  $.fn.bounceable = function (isBounceable) {
    $(this).off("click", bounce);
    if (isBounceable) {
      $(this).on("click", bounce);
    }
    return this;
  };
}
