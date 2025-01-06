function bounce() {
  $(this).addClass("bouncy");
  setTimeout(() => {
    $(this).removeClass("bouncy");
  }, 300);
}

$.fn.bounceable = function (isBounceable) {
  $(this).off("click", bounce);
  if (isBounceable) {
    $(this).on("click", bounce);
  }
};

$.fn.spin = function (direction) {
  if (direction === "right") {
    $("svg#gear").addClass("spin").removeClass("Ospin");
  } else {
    $("svg#gear").removeClass("spin").addClass("Ospin");
  }
};

$.fn.textTimeout = async function (text, ms, newText) {
  this.text(text);
  await new Promise((resolve) => setTimeout(resolve, ms));
  this.text(newText);
  return this;
};
