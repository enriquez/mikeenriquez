$(document).ready(function() {
  var isTouchDevice() = function() {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  }

  if (isTouchDevice()) {
    // if #about is fixed, make it absolute
    alert('touchable');
  } else {
    alert('dont touch me');
  }
});
