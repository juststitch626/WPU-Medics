/* Screen registry — created here (before any screen file loads)
   so each screen can safely do window.Screens.<name> = ... */
window.Screens = window.Screens || {};

/* ============================================================
   ui.js — small reusable HTML builders shared by all screens.
   Kept as pure string-returning functions so each screen file
   stays short and consistent.
   ============================================================ */

window.UI = {
  esc: function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  },

  /* Top app bar. opts: { title, sub, back, action } */
  appbar: function (opts) {
    opts = opts || {};
    var back = opts.back
      ? '<button class="appbar__back" data-nav="' + opts.back + '" aria-label="Back">‹</button>'
      : '<img class="appbar__logo" src="wpu-logo.png" alt="WPU logo" />';
    var action = opts.action
      ? '<button class="appbar__icon" data-action="logout" title="Log out">⏻</button>'
      : "";
    return (
      '<div class="appbar">' +
      back +
      '<div><div class="appbar__title">' + this.esc(opts.title || "WPU Clinic Book") + "</div>" +
      (opts.sub ? '<div class="appbar__sub">' + this.esc(opts.sub) + "</div>" : "") +
      "</div>" +
      action +
      "</div>"
    );
  },

  /* Bottom navigation. Highlights `active`, adapts to role. */
  bottomNav: function (active, role) {
    var items =
      role === "nurse"
        ? [
            { key: "nurseDashboard", ico: "🏠", label: "Home" },
            { key: "records", ico: "🗂️", label: "Records" },
            { key: "appointments", ico: "📅", label: "Appts" },
            { key: "workflow", ico: "🔄", label: "Workflow" },
          ]
        : [
            { key: "patientDashboard", ico: "🏠", label: "Home" },
            { key: "appointments", ico: "📅", label: "Appts" },
            { key: "diagnosis", ico: "🩺", label: "Diagnosis" },
            { key: "history", ico: "📖", label: "History" },
          ];
    return (
      '<nav class="bottomnav">' +
      items
        .map(function (it) {
          return (
            '<button class="' + (active === it.key ? "active" : "") + '" data-nav="' + it.key + '">' +
            '<span class="ico">' + it.ico + "</span>" + it.label +
            "</button>"
          );
        })
        .join("") +
      "</nav>"
    );
  },

  tile: function (o) {
    return (
      '<button class="tile ' + (o.gold ? "tile--gold" : "") + '" data-nav="' + o.nav + '">' +
      '<div class="tile__ico">' + o.ico + "</div>" +
      '<div class="tile__name">' + this.esc(o.name) + "</div>" +
      '<div class="tile__meta">' + this.esc(o.meta || "") + "</div>" +
      "</button>"
    );
  },

  initialsFor: function (name) {
    return window.Auth.initials(name);
  },

  statusChip: function (status) {
    var map = {
      Confirmed: "chip--ok", Active: "chip--ok", Pending: "chip--warn",
      Review: "chip--warn", Discharged: "chip--danger",
    };
    return '<span class="chip ' + (map[status] || "chip--blue") + '">' + this.esc(status) + "</span>";
  },

  toast: function (root, msg, ok) {
    var old = root.querySelector(".toast");
    if (old) old.remove();
    var t = document.createElement("div");
    t.className = "toast" + (ok ? " ok" : "");
    t.innerHTML = (ok ? "✓ " : "") + this.esc(msg);
    root.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.remove(); }, 2600);
  },

  /* Wire up any element with data-nav to route there. */
  bindNav: function (root) {
    root.querySelectorAll("[data-nav]").forEach(function (el) {
      el.addEventListener("click", function () {
        window.Router.go(el.getAttribute("data-nav"));
      });
    });
    root.querySelectorAll('[data-action="logout"]').forEach(function (el) {
      el.addEventListener("click", function () {
        window.Auth.logout();
        window.Router.go("login");
      });
    });
  },
};
