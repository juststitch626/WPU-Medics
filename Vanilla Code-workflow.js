/* ============================================================
   workflow.js — Nurse's extra "System Workflow" tab (Fig 11).
   Shows live clinic status and the patient-visit process flow.
   ============================================================ */

window.Screens.workflow = function () {
  var m = window.DB.workflowMetrics;

  var steps = window.DB.workflow
    .map(function (s, i) {
      var cls = s.state === "done" ? "st-done" : s.state === "active" ? "st-active" : "st-todo";
      var mark = s.state === "done" ? "✓" : String(i + 1);
      var last = i === window.DB.workflow.length - 1;
      return (
        '<div class="flow-step">' +
          '<div class="flow-step__rail">' +
            '<div class="flow-step__dot ' + cls + '">' + mark + "</div>" +
            (last ? "" : '<div class="flow-step__line"></div>') +
          "</div>" +
          '<div class="flow-step__body">' +
            '<div class="flow-step__title">' + window.UI.esc(s.title) +
              (s.state === "active" ? ' <span class="chip chip--gold" style="margin-left:6px;">In progress</span>' : "") +
            "</div>" +
            '<div class="flow-step__desc">' + window.UI.esc(s.desc) + "</div>" +
          "</div>" +
        "</div>"
      );
    })
    .join("");

  var html =
    '<div class="screen">' +
      window.UI.appbar({ title: "System Workflow", sub: "Live clinic status", back: "nurseDashboard" }) +
      '<div class="pad stack">' +
        '<div class="metrics">' +
          '<div class="metric"><div class="metric__n">' + m.waiting + '</div><div class="metric__l">Waiting</div></div>' +
          '<div class="metric"><div class="metric__n">' + m.inProgress + '</div><div class="metric__l">In progress</div></div>' +
          '<div class="metric"><div class="metric__n">' + m.completedToday + '</div><div class="metric__l">Done today</div></div>' +
        "</div>" +

        '<div class="card">' +
          '<div class="card__title">Patient visit flow</div>' +
          '<div class="muted small" style="margin-bottom:14px;">How each visit moves through the digital clinic book.</div>' +
          '<div class="flow">' + steps + "</div>" +
        "</div>" +

        '<div class="card">' +
          '<div class="card__title">System health</div>' +
          '<div class="kv"><span class="k">Records database</span><span class="v"><span class="chip chip--ok">Online</span></span></div>' +
          '<div class="kv"><span class="k">Offline sync</span><span class="v"><span class="chip chip--ok">Up to date</span></span></div>' +
          '<div class="kv"><span class="k">Last backup</span><span class="v">2026-08-05 08:00</span></div>' +
        "</div>" +
      "</div>" +
      window.UI.bottomNav("workflow", "nurse") +
    "</div>";

  return { html: html };
};
