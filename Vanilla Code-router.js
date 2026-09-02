/* ============================================================
   router.js — tiny screen router.
   Screens register themselves on window.Screens[name] as a
   function(params) -> { html, mount(root) }.
   ============================================================ */

window.Screens = window.Screens || {};

window.Router = {
  state: { name: "login", params: {} },

  // Screens that require an authenticated session
  guarded: {
    patientDashboard: "patient",
    nurseDashboard: "nurse",
    appointments: "any",
    diagnosis: "patient",
    records: "nurse",
    history: "any",
    patientDetail: "nurse",
    workflow: "nurse",
  },

  go: function (name, params) {
    // Route guard: bounce to login (or the correct dashboard) if needed.
    var need = this.guarded[name];
    if (need) {
      if (!window.Auth.current) {
        name = "login";
        params = {};
      } else if (need !== "any" && window.Auth.current.role !== need) {
        name = window.Auth.isNurse() ? "nurseDashboard" : "patientDashboard";
        params = {};
      }
    }
    this.state = { name: name, params: params || {} };
    this.render();
    var screen = document.getElementById("app");
    if (screen) screen.scrollTop = 0;
  },

  render: function () {
    var root = document.getElementById("app");
    var builder = window.Screens[this.state.name];
    if (!builder) {
      root.innerHTML = '<div class="empty">Screen not found: ' + this.state.name + "</div>";
      return;
    }
    var view = builder(this.state.params);
    root.innerHTML = view.html;
    window.UI.bindNav(root);
    if (view.mount) view.mount(root);
  },
};
