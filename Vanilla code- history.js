

window.Screens.history = function (params) {
  var isNurse = window.Auth.isNurse();

  // Whose history are we showing?
  var pid, backTo, subtitle;
  if (isNurse) {
    pid = (params && params.id) || window.DB.patients[0].id;
    backTo = "nurseDashboard";
    var p = window.DB.patients.find(function (x) { return x.id === pid; });
    subtitle = p ? p.name : pid;
  } else {
    pid = window.Auth.current.studentId;
    backTo = "patientDashboard";
    subtitle = "Your visits";
  }

  function timeline(id) {
    var items = window.DB.history[id] || [];
    if (!items.length) return '<div class="empty">No medical history recorded.</div>';
    return (
      '<div class="timeline">' +
      items
        .map(function (h) {
          return (
            '<div class="tl-item">' +
              '<div class="tl-date">' + window.UI.esc(h.date) + "</div>" +
              '<div class="tl-card">' +
                '<div style="font-weight:700;font-size:14px;">' + window.UI.esc(h.title) + "</div>" +
                '<div class="muted small" style="margin:4px 0 6px;">' + window.UI.esc(h.detail) + "</div>" +
                '<div class="small" style="color:var(--blue);">👩‍⚕️ ' + window.UI.esc(h.by) + "</div>" +
              "</div>" +
            "</div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  // Nurse gets a dropdown to switch patients.
  var picker = "";
  if (isNurse) {
    picker =
      '<div class="field" style="margin-top:0;">' +
        "<label>Select patient</label>" +
        '<select class="input" id="patientPick">' +
          window.DB.patients
            .map(function (p) {
              return '<option value="' + p.id + '"' + (p.id === pid ? " selected" : "") + ">" + window.UI.esc(p.name) + " · " + window.UI.esc(p.id) + "</option>";
            })
            .join("") +
        "</select>" +
      "</div>";
  }

  var html =
    '<div class="screen">' +
      window.UI.appbar({ title: "Medical History", sub: subtitle, back: backTo }) +
      '<div class="pad stack">' +
        picker +
        '<div id="tl">' + timeline(pid) + "</div>" +
      "</div>" +
      window.UI.bottomNav("history", isNurse ? "nurse" : "patient") +
    "</div>";

  function mount(root) {
    var pick = root.querySelector("#patientPick");
    if (pick) {
      pick.addEventListener("change", function () {
        root.querySelector("#tl").innerHTML = timeline(pick.value);
      });
    }
  }

  return { html: html, mount: mount };
};
