/* ============================================================
   patientDashboard.js — Patient home (Fig 3).
   ============================================================ */

window.Screens.patientDashboard = function () {
  var u = window.Auth.current;
  var pid = u.studentId;

  // Find this patient's soonest upcoming appointment.
  var mine = window.DB.appointments
    .filter(function (a) { return a.patientId === pid; })
    .sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); });
  var next = mine[0];

  var nextBanner = next
    ? '<div class="next-appt">' +
        '<div class="lbl">Next appointment</div>' +
        '<div class="when">' + window.UI.esc(next.date) + " · " + window.UI.esc(next.time) + "</div>" +
        '<div class="small" style="margin-top:2px;">' + window.UI.esc(next.reason) + " — " + window.UI.esc(next.nurse) + "</div>" +
      "</div>"
    : '<div class="card"><div class="muted small">No upcoming appointments. Tap “Book Appointment” to schedule one.</div></div>';

  var html =
    '<div class="screen">' +
      '<div class="hero-greet">' +
        '<div class="spread">' +
          '<div class="row">' +
            '<div class="avatar">' + window.UI.initialsFor(u.name) + "</div>" +
            "<div>" +
              "<h2>Hello, " + window.UI.esc(u.name.split(" ")[0]) + "</h2>" +
              '<div class="role-pill">Patient · ' + window.UI.esc(u.studentId) + "</div>" +
            "</div>" +
          "</div>" +
          '<button class="hero-logout" data-action="logout" title="Log out">⏻ Log out</button>' +
        "</div>" +
      "</div>" +

      '<div class="pad stack">' +
        nextBanner +

        '<div class="section-title">Quick actions</div>' +
        '<div class="tiles">' +
          window.UI.tile({ nav: "appointments", ico: "📅", name: "Book Appointment", meta: "Choose a date & reason" }) +
          window.UI.tile({ nav: "appointments", ico: "🗓️", name: "My Appointments", meta: mine.length + " scheduled" }) +
          window.UI.tile({ nav: "diagnosis", ico: "🩺", name: "My Diagnosis", meta: "Latest results", gold: true }) +
          window.UI.tile({ nav: "history", ico: "📖", name: "Medical History", meta: "Past visits", gold: true }) +
        "</div>" +

        '<div class="card">' +
          '<div class="card__title">Emergency</div>' +
          '<div class="muted small" style="margin-bottom:10px;">In an emergency, your record can be opened instantly by clinic staff.</div>' +
          '<button class="btn btn--gold" data-action="emergency">Call Campus Clinic</button>' +
        "</div>" +
      "</div>" +

      window.UI.bottomNav("patientDashboard", "patient") +
    "</div>";

  function mount(root) {
    root.querySelectorAll('[data-action="emergency"]').forEach(function (el) {
      el.addEventListener("click", function () {
        window.UI.toast(root, "Connecting to WPU Campus Clinic…", false);
      });
    });
  }

  return { html: html, mount: mount };
};
