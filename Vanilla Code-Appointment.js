
window.Screens.appointments = function () {
  var isNurse = window.Auth.isNurse();
  return isNurse ? nurseView() : patientView();

  /* ---------------- Patient ---------------- */
  function patientView() {
    var u = window.Auth.current;
    function listHtml() {
      var mine = window.DB.appointments
        .filter(function (a) { return a.patientId === u.studentId; })
        .sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); });
      if (!mine.length) return '<div class="empty">You have no appointments yet.</div>';
      return mine
        .map(function (a) {
          return (
            '<div class="item">' +
              '<div class="item__ava">📅</div>' +
              '<div class="grow"><div class="item__name">' + window.UI.esc(a.reason) + "</div>" +
              '<div class="item__meta">' + window.UI.esc(a.date) + " · " + window.UI.esc(a.time) + " · " + window.UI.esc(a.nurse) + "</div></div>" +
              window.UI.statusChip(a.status) +
            "</div>"
          );
        })
        .join("");
    }

    var reasonOpts = window.DB.reasons.map(function (r) { return '<option>' + window.UI.esc(r) + "</option>"; }).join("");
    var timeOpts = window.DB.timeslots.map(function (t) { return '<option>' + window.UI.esc(t) + "</option>"; }).join("");
    var providerOpts = window.DB.nurses.map(function (n) {
      return '<option>' + window.UI.esc(n.name) + " (" + window.UI.esc(n.role) + ")</option>";
    }).join("");

    var html =
      '<div class="screen">' +
        window.UI.appbar({ title: "Appointments", sub: "Book & manage", back: "patientDashboard" }) +
        '<div class="pad stack">' +
          '<div class="card">' +
            '<div class="card__title">Book an appointment</div>' +
            '<div id="apptMsg"></div>' +
            '<div class="field"><label>Select provider (nurse)</label><select class="input" id="provider">' + providerOpts + "</select></div>" +
            '<div class="field"><label>Reason for visit</label><select class="input" id="reason">' + reasonOpts + "</select></div>" +
            '<div class="field"><label>Preferred date</label><input class="input" id="date" type="date" min="2026-08-04" value="2026-08-07" /></div>' +
            '<div class="field"><label>Preferred time</label><select class="input" id="time">' + timeOpts + "</select></div>" +
            '<div style="margin-top:16px;"><button class="btn btn--primary" id="bookBtn">Confirm booking</button></div>' +
          "</div>" +

          '<div class="section-title">My appointments</div>' +
          '<div class="list" id="apptList">' + listHtml() + "</div>" +
        "</div>" +
        window.UI.bottomNav("appointments", "patient") +
      "</div>";

    function mount(root) {
      root.querySelector("#bookBtn").addEventListener("click", function () {
        var provider = root.querySelector("#provider").value;
        var reason = root.querySelector("#reason").value;
        var date = root.querySelector("#date").value;
        var time = root.querySelector("#time").value;
        var msg = root.querySelector("#apptMsg");

        if (!date) {
          msg.innerHTML = '<div class="alert alert--error" style="margin-top:10px;"><span class="alert__icon">!</span>Please choose a date.</div>';
          return;
        }
        // Add the booking to the shared store so the list updates.
        window.DB.appointments.push({
          id: "A-" + (600 + window.DB.appointments.length),
          patientId: u.studentId, patient: u.name,
          date: date, time: time, reason: reason,
          nurse: provider, status: "Pending",
        });
        root.querySelector("#apptList").innerHTML = listHtml();
        msg.innerHTML = "";
        window.UI.toast(root, "Appointment requested — status: Pending", true);
      });
    }

    return { html: html, mount: mount };
  }

  /* ---------------- Nurse ---------------- */
  function nurseView() {
    function rows() {
      return window.DB.appointments
        .slice()
        .sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); })
        .map(function (a) {
          var actions =
            a.status === "Pending"
              ? '<button class="btn btn--gold btn--sm" data-confirm="' + a.id + '">Confirm</button>'
              : window.UI.statusChip(a.status);
          return (
            '<div class="item">' +
              '<div class="item__ava">' + window.UI.initialsFor(a.patient) + "</div>" +
              '<div class="grow"><div class="item__name">' + window.UI.esc(a.patient) + "</div>" +
              '<div class="item__meta">' + window.UI.esc(a.date) + " · " + window.UI.esc(a.time) + " · " + window.UI.esc(a.reason) + "</div></div>" +
              actions +
            "</div>"
          );
        })
        .join("");
    }

    var html =
      '<div class="screen">' +
        window.UI.appbar({ title: "Clinic Schedule", sub: "All appointments", back: "nurseDashboard" }) +
        '<div class="pad stack">' +
          '<div class="metrics">' +
            '<div class="metric"><div class="metric__n">' + window.DB.appointments.filter(function(a){return a.status==="Confirmed";}).length + '</div><div class="metric__l">Confirmed</div></div>' +
            '<div class="metric"><div class="metric__n">' + window.DB.appointments.filter(function(a){return a.status==="Pending";}).length + '</div><div class="metric__l">Pending</div></div>' +
            '<div class="metric"><div class="metric__n">' + window.DB.appointments.length + '</div><div class="metric__l">Total</div></div>' +
          "</div>" +
          '<div class="section-title">Upcoming</div>' +
          '<div class="list" id="apptList">' + rows() + "</div>" +
        "</div>" +
        window.UI.bottomNav("appointments", "nurse") +
      "</div>";

    function mount(root) {
      function bind() {
        root.querySelectorAll("[data-confirm]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var id = btn.getAttribute("data-confirm");
            var appt = window.DB.appointments.find(function (a) { return a.id === id; });
            if (appt) appt.status = "Confirmed";
            root.querySelector("#apptList").innerHTML = rows();
            bind();
            window.UI.toast(root, "Appointment confirmed", true);
          });
        });
      }
      bind();
    }

    return { html: html, mount: mount };
  }
};
