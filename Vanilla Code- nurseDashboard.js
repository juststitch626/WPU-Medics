/* ============================================================
   nurseDashboard.js — Nurse home (Fig 4).
   Has the extra "System Workflow" tab the patient view lacks.
   ============================================================ */

window.Screens.nurseDashboard = function () {
  var u = window.Auth.current;
  var today = "2026-08-05";
  var todays = window.DB.appointments.filter(function (a) { return a.date === today; });

  var html =
    '<div class="screen">' +
      '<div class="hero-greet">' +
        '<div class="spread">' +
          '<div class="row">' +
            '<div class="avatar">' + window.UI.initialsFor(u.name) + "</div>" +
            "<div>" +
              "<h2>" + window.UI.esc(u.name) + "</h2>" +
              '<div class="role-pill">' + window.UI.esc(u.title) + " · " + window.UI.esc(u.staffId) + "</div>" +
            "</div>" +
          "</div>" +
          '<button class="hero-logout" data-action="logout" title="Log out">⏻ Log out</button>' +
        "</div>" +
      "</div>" +

      '<div class="pad stack">' +
        '<div class="metrics">' +
          '<div class="metric"><div class="metric__n">' + window.DB.patients.length + '</div><div class="metric__l">Patients</div></div>' +
          '<div class="metric"><div class="metric__n">' + todays.length + '</div><div class="metric__l">Today\'s appts</div></div>' +
          '<div class="metric"><div class="metric__n">' + window.DB.workflowMetrics.waiting + '</div><div class="metric__l">Waiting</div></div>' +
        "</div>" +

        '<div class="section-title">Manage</div>' +
        '<div class="tiles">' +
          window.UI.tile({ nav: "records", ico: "🗂️", name: "Patient Records", meta: window.DB.patients.length + " patients" }) +
          window.UI.tile({ nav: "appointments", ico: "📅", name: "Appointments", meta: todays.length + " today" }) +
          window.UI.tile({ nav: "history", ico: "📖", name: "Medical History", meta: "By patient", gold: true }) +
          window.UI.tile({ nav: "workflow", ico: "🔄", name: "System Workflow", meta: "Live clinic status", gold: true }) +
        "</div>" +

        '<div class="card">' +
          '<div class="spread" style="margin-bottom:10px;">' +
            '<div class="card__title">Today’s schedule</div>' +
            '<button class="btn btn--ghost btn--sm" data-nav="appointments">View all</button>' +
          "</div>" +
          '<div class="list">' +
            (todays.length
              ? todays.map(function (a) {
                  return (
                    '<div class="item">' +
                      '<div class="item__ava">' + window.UI.initialsFor(a.patient) + "</div>" +
                      '<div class="grow"><div class="item__name">' + window.UI.esc(a.patient) + "</div>" +
                      '<div class="item__meta">' + window.UI.esc(a.time) + " · " + window.UI.esc(a.reason) + "</div></div>" +
                      window.UI.statusChip(a.status) +
                    "</div>"
                  );
                }).join("")
              : '<div class="empty">No appointments today.</div>') +
          "</div>" +
        "</div>" +
      "</div>" +

      window.UI.bottomNav("nurseDashboard", "nurse") +
    "</div>";

  return { html: html };
};
