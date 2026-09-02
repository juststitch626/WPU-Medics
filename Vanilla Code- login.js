/* ============================================================
   login.js — Unified login for patients & nurses (Fig 1 & 2).
   Validates against Auth.login and routes to the right dashboard.
   When the Nurse role is selected, the nurse also picks which
   clinic nurse they are signing in as.
   ============================================================ */

window.Screens.login = function () {
  // Preserve selections across re-renders within this session.
  var selectedRole = window.Screens.login._role || "patient";

  var nurseOpts = window.DB.nurses
    .map(function (n, i) {
      return '<option value="' + i + '">' + window.UI.esc(n.name) + " (" + window.UI.esc(n.role) + ")</option>";
    })
    .join("");

  var html =
    '<div class="login">' +
      '<div class="login__hero">' +
        '<img class="login__logo" src="wpu-logo.png" alt="Western Pacific University" />' +
        '<div class="login__title">Digital <span>Clinic Book</span></div>' +
        '<div class="login__tag">Western Pacific University — Campus Clinic, Ialibu</div>' +
      "</div>" +

      '<div class="login__body">' +
        '<div class="segment" role="tablist" aria-label="Select role">' +
          '<button type="button" data-role="patient" class="' + (selectedRole === "patient" ? "active" : "") + '">Patient</button>' +
          '<button type="button" data-role="nurse" class="' + (selectedRole === "nurse" ? "active" : "") + '">Nurse</button>' +
        "</div>" +

        '<div id="loginError" style="margin-top:14px;"></div>' +

        // Nurse-only identity picker (hidden for patients)
        '<div class="field" id="nurseField" style="display:' + (selectedRole === "nurse" ? "block" : "none") + ';">' +
          "<label>Signing in as</label>" +
          '<select class="input" id="nurse">' + nurseOpts + "</select>" +
        "</div>" +

        '<div class="field">' +
          "<label>Email</label>" +
          '<input class="input" id="email" type="email" autocomplete="username" placeholder="name@wpu.ac.pg" />' +
        "</div>" +

        '<div class="field">' +
          "<label>Password</label>" +
          '<input class="input" id="password" type="password" autocomplete="current-password" placeholder="••••••••" />' +
        "</div>" +

        '<div class="linkish" data-noop>Forgot password?</div>' +

        '<div style="margin-top:18px;">' +
          '<button class="btn btn--primary" id="loginBtn">Login</button>' +
        "</div>" +
      "</div>" +
    "</div>";

  function mount(root) {
    var errBox = root.querySelector("#loginError");
    var emailEl = root.querySelector("#email");
    var passEl = root.querySelector("#password");
    var nurseField = root.querySelector("#nurseField");
    var nurseSel = root.querySelector("#nurse");

    // Role toggle — also shows/hides the nurse picker.
    root.querySelectorAll("[data-role]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var role = btn.getAttribute("data-role");
        window.Screens.login._role = role;
        root.querySelectorAll("[data-role]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        nurseField.style.display = role === "nurse" ? "block" : "none";
        errBox.innerHTML = "";
        emailEl.classList.remove("input--error");
        passEl.classList.remove("input--error");
      });
    });

    root.querySelectorAll("[data-noop]").forEach(function (el) {
      el.addEventListener("click", function () {
        errBox.innerHTML =
          '<div class="alert alert--ok"><span class="alert__icon">ℹ</span>' +
          "Please see the campus nurse to reset your password.</div>";
      });
    });

    function attempt() {
      var role = window.Screens.login._role || "patient";
      var res = window.Auth.login(emailEl.value, passEl.value, role);
      if (!res.ok) {
        errBox.innerHTML =
          '<div class="alert alert--error"><span class="alert__icon">!</span>' +
          window.UI.esc(res.error) + "</div>";
        emailEl.classList.add("input--error");
        passEl.classList.add("input--error");
        return;
      }
      // For a nurse, apply the chosen identity (name + role title).
      if (res.user.role === "nurse") {
        var pick = window.DB.nurses[parseInt(nurseSel.value, 10)] || window.DB.nurses[0];
        window.Auth.current = Object.assign({}, res.user, { name: pick.name, title: pick.role });
      }
      window.Router.go(res.user.role === "nurse" ? "nurseDashboard" : "patientDashboard");
    }

    root.querySelector("#loginBtn").addEventListener("click", attempt);
    passEl.addEventListener("keydown", function (e) { if (e.key === "Enter") attempt(); });
    emailEl.addEventListener("keydown", function (e) { if (e.key === "Enter") passEl.focus(); });
    emailEl.focus();
  }

  return { html: html, mount: mount };
};
