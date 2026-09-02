/* ============================================================
   records.js — patient records & diagnosis.
   Screens.records      : nurse's searchable roster (Fig 7)
   Screens.patientDetail: nurse's view of one patient's record
   Screens.diagnosis    : patient's own diagnosis view (Fig 8)
   ============================================================ */

/* ---- Nurse: all patient records (Fig 7) ---- */
window.Screens.records = function () {
  function rows(filter) {
    filter = (filter || "").toLowerCase();
    var list = window.DB.patients.filter(function (p) {
      return !filter || p.name.toLowerCase().indexOf(filter) > -1 || p.id.toLowerCase().indexOf(filter) > -1;
    });
    if (!list.length) return '<div class="empty">No patients match “' + window.UI.esc(filter) + "”.</div>";
    return list
      .map(function (p) {
        return (
          '<div class="item clickable" data-patient="' + p.id + '">' +
            '<div class="item__ava">' + window.UI.initialsFor(p.name) + "</div>" +
            '<div class="grow"><div class="item__name">' + window.UI.esc(p.name) + "</div>" +
            '<div class="item__meta">' + window.UI.esc(p.id) + " · " + p.age + window.UI.esc(p.sex) + " · " + window.UI.esc(p.program) + "</div></div>" +
            window.UI.statusChip(p.status) +
            '<span class="item__chev">›</span>' +
          "</div>"
        );
      })
      .join("");
  }

  var html =
    '<div class="screen">' +
      window.UI.appbar({ title: "Patient Records", sub: window.DB.patients.length + " patients", back: "nurseDashboard" }) +
      '<div class="pad stack">' +
        '<div class="search"><span>🔍</span><input id="q" placeholder="Search name or student ID" /></div>' +
        '<div class="list" id="rows">' + rows("") + "</div>" +
      "</div>" +
      window.UI.bottomNav("records", "nurse") +
    "</div>";

  function mount(root) {
    function bind() {
      root.querySelectorAll("[data-patient]").forEach(function (el) {
        el.addEventListener("click", function () {
          window.Router.go("patientDetail", { id: el.getAttribute("data-patient") });
        });
      });
    }
    bind();
    root.querySelector("#q").addEventListener("input", function (e) {
      root.querySelector("#rows").innerHTML = rows(e.target.value);
      bind();
    });
  }

  return { html: html, mount: mount };
};

/* ---- Nurse: one patient's record ---- */
window.Screens.patientDetail = function (params) {
  var p = window.DB.patients.find(function (x) { return x.id === params.id; }) || window.DB.patients[0];
  var dx = window.DB.diagnosis[p.id];
  var hist = window.DB.history[p.id] || [];

  var html =
    '<div class="screen">' +
      window.UI.appbar({ title: p.name, sub: p.id, back: "records" }) +
      '<div class="pad stack">' +
        '<div class="card">' +
          '<div class="kv"><span class="k">Age / Sex</span><span class="v">' + p.age + " · " + window.UI.esc(p.sex) + "</span></div>" +
          '<div class="kv"><span class="k">Program</span><span class="v">' + window.UI.esc(p.program) + "</span></div>" +
          '<div class="kv"><span class="k">Blood group</span><span class="v">' + window.UI.esc(p.blood) + "</span></div>" +
          '<div class="kv"><span class="k">Status</span><span class="v">' + window.UI.statusChip(p.status) + "</span></div>" +
        "</div>" +

        (dx
          ? '<div class="card">' +
              '<div class="card__title">Latest diagnosis</div>' +
              '<div class="row" style="justify-content:space-between;">' +
                '<div style="font-weight:700;">' + window.UI.esc(dx.condition) + "</div>" +
                '<span class="chip chip--gold">' + window.UI.esc(dx.date) + "</span>" +
              "</div>" +
              '<div class="muted small" style="margin-top:8px;">' + window.UI.esc(dx.notes) + "</div>" +
            "</div>"
          : '<div class="card"><div class="muted small">No active diagnosis on record.</div></div>') +

        '<button class="btn btn--ghost" data-history="' + p.id + '">View full medical history (' + hist.length + ")</button>" +
      "</div>" +
      window.UI.bottomNav("records", "nurse") +
    "</div>";

  function mount(root) {
    root.querySelectorAll("[data-history]").forEach(function (el) {
      el.addEventListener("click", function () {
        window.Router.go("history", { id: el.getAttribute("data-history") });
      });
    });
  }

  return { html: html, mount: mount };
};

/* ---- Patient: own diagnosis (Fig 8) ---- */
window.Screens.diagnosis = function () {
  var u = window.Auth.current;
  var dx = window.DB.diagnosis[u.studentId];

  var body = dx
    ? '<div class="card">' +
        '<div class="spread"><div class="card__title">' + window.UI.esc(dx.condition) + "</div>" +
          '<span class="chip chip--gold">' + window.UI.esc(dx.date) + "</span></div>" +
        '<div class="muted small" style="margin-top:6px;">Seen by ' + window.UI.esc(dx.nurse) + "</div>" +
      "</div>" +

      '<div class="card">' +
        '<div class="card__title">Vitals</div>' +
        '<div class="kv"><span class="k">Blood pressure</span><span class="v">' + window.UI.esc(dx.vitals.bp) + "</span></div>" +
        '<div class="kv"><span class="k">Temperature</span><span class="v">' + window.UI.esc(dx.vitals.temp) + "</span></div>" +
        '<div class="kv"><span class="k">Pulse</span><span class="v">' + window.UI.esc(dx.vitals.pulse) + "</span></div>" +
        '<div class="kv"><span class="k">Weight</span><span class="v">' + window.UI.esc(dx.vitals.weight) + "</span></div>" +
      "</div>" +

      '<div class="card">' +
        '<div class="card__title">Prescription</div>' +
        dx.prescriptions.map(function (m) {
          return '<div class="kv"><span class="k">' + window.UI.esc(m.drug) + "<br/><span class='small'>" + window.UI.esc(m.dose) + "</span></span>" +
            '<span class="v">' + window.UI.esc(m.days) + "</span></div>";
        }).join("") +
      "</div>" +

      '<div class="card">' +
        '<div class="card__title">Nurse’s notes</div>' +
        '<div class="muted small">' + window.UI.esc(dx.notes) + "</div>" +
      "</div>" +

      '<div class="alert alert--ok"><span class="alert__icon">ℹ</span>' +
        "Take medication as prescribed. Contact the clinic if symptoms worsen.</div>"
    : '<div class="empty">You have no active diagnosis on record.</div>';

  var html =
    '<div class="screen">' +
      window.UI.appbar({ title: "My Diagnosis", sub: "Latest results", back: "patientDashboard" }) +
      '<div class="pad stack">' + body + "</div>" +
      window.UI.bottomNav("diagnosis", "patient") +
    "</div>";

  return { html: html };
};
