/* Statically Determinate — exam countdowns (IST, days only)
 *
 * Each [data-countdown] element carries data-target="YYYY-MM-DD",
 * interpreted as a calendar date in Indian Standard Time (Asia/Kolkata).
 *
 *   Prelims : 2027-01-31
 *   Mains   : 2027-06-18
 */
(function () {
  "use strict";

  var blocks = document.querySelectorAll("[data-countdown]");
  if (!blocks.length) return;

  /* Returns YYYY-MM-DD for a Date, as seen in IST. */
  function istDateStr(d) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(d); // en-CA gives YYYY-MM-DD
  }

  /* Whole days between "today in IST" and the target date (IST). */
  function daysUntilIST(targetISO) {
    var todayIST = istDateStr(new Date());
    var a = Date.parse(todayIST + "T00:00:00Z");
    var b = Date.parse(targetISO + "T00:00:00Z");
    return Math.round((b - a) / 86400000);
  }

  function render(root) {
    var daysEl = root.querySelector('[data-cd="days"]');
    var grid   = root.querySelector(".countdown-grid");
    var label  = root.querySelector(".countdown-label");
    var done   = root.querySelector(".countdown-done");

    var d = daysUntilIST(root.getAttribute("data-target"));

    if (d <= 0) {
      if (grid)  grid.hidden = true;
      if (label) label.hidden = true;
      if (done)  done.hidden = false;
      root.classList.remove("urgent");
      return;
    }

    if (daysEl) daysEl.textContent = d;
    root.classList.toggle("urgent", d < 30);
  }

  Array.prototype.forEach.call(blocks, function (root) {
    render(root);
    // A day-count doesn't need per-second ticks.
    setInterval(function () { render(root); }, 60000);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) render(root);
    });
  });

  /* Highlight the nearest upcoming exam; fade any already reached. */
  var upcoming = [];
  Array.prototype.forEach.call(blocks, function (el) {
    var d = daysUntilIST(el.getAttribute("data-target"));
    if (d <= 0) el.classList.add("is-past");
    else upcoming.push({ el: el, d: d });
  });
  if (upcoming.length) {
    upcoming.sort(function (a, b) { return a.d - b.d; });
    upcoming[0].el.classList.add("is-next");
  }
})();
