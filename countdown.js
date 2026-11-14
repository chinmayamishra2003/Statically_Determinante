/* Statically Determinate — exam countdowns
 * Each element with [data-countdown] carries its own ISO-8601 target in
 * data-target. Timezone offset is pinned to +05:30 so dates are exact
 * regardless of the visitor's local time.
 *
 * Prelims : 2027-01-31
 * Mains   : 2027-06-18
 */
(function () {
  "use strict";

  var blocks = document.querySelectorAll("[data-countdown]");
  if (!blocks.length) return;

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function targetTime(el) {
    return new Date(el.getAttribute("data-target")).getTime();
  }

  Array.prototype.forEach.call(blocks, function (root) {
    var t = targetTime(root);
    if (isNaN(t)) return; // malformed date — skip silently

    var daysEl  = root.querySelector('[data-cd="days"]');
    var hoursEl = root.querySelector('[data-cd="hours"]');
    var minsEl  = root.querySelector('[data-cd="mins"]');
    var secsEl  = root.querySelector('[data-cd="secs"]');
    var grid    = root.querySelector(".countdown-grid");
    var label   = root.querySelector(".countdown-label");
    var done    = root.querySelector(".countdown-done");
    var timer   = null;

    function finish() {
      if (grid)  grid.hidden = true;
      if (label) label.hidden = true;
      if (done)  done.hidden = false;
      root.classList.remove("urgent");
      if (timer) clearInterval(timer);
    }

    function tick() {
      var diff = t - Date.now();

      if (diff <= 0) { finish(); return; }

      var total = Math.floor(diff / 1000);
      var d = Math.floor(total / 86400);
      var h = Math.floor((total % 86400) / 3600);
      var m = Math.floor((total % 3600) / 60);
      var s = total % 60;

      daysEl.textContent  = d;
      hoursEl.textContent = pad(h);
      minsEl.textContent  = pad(m);
      secsEl.textContent  = pad(s);

      // Turn the numbers warm-red in the final 30 days
      root.classList.toggle("urgent", d < 30);
    }

    timer = setInterval(tick, 1000);
    tick();
  });

  /* --- Highlight the nearest upcoming exam, mute the ones already done --- */
  var now = Date.now();

  Array.prototype.forEach.call(blocks, function (el) {
    var t = targetTime(el);
    if (!isNaN(t) && t <= now) el.classList.add("is-past");
  });

  var upcoming = Array.prototype.filter.call(blocks, function (el) {
    var t = targetTime(el);
    return !isNaN(t) && t > now;
  }).sort(function (a, b) {
    return targetTime(a) - targetTime(b);
  });

  if (upcoming.length) upcoming[0].classList.add("is-next");
})();
