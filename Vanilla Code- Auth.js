

window.Auth = {
  current: null,

  /**
   * Attempt a login.
   * @returns {{ok:boolean, error?:string, user?:object}}
   */
  login: function (email, password, role) {
    email = (email || "").trim().toLowerCase();
    password = password || "";

    if (!email || !password) {
      return { ok: false, error: "Please enter both your email and password." };
    }

    var user = window.DB.users.find(function (u) {
      return u.email === email;
    });

    // Do not reveal which field was wrong (good security practice).
    if (!user || user.password !== password) {
      return { ok: false, error: "Invalid email or password. Please try again." };
    }

    if (user.role !== role) {
      return {
        ok: false,
        error:
          "This account is registered as a " +
          user.role +
          ". Switch the role above and try again.",
      };
    }

    this.current = user;
    return { ok: true, user: user };
  },

  logout: function () {
    this.current = null;
  },

  isPatient: function () {
    return this.current && this.current.role === "patient";
  },

  isNurse: function () {
    return this.current && this.current.role === "nurse";
  },

  /** First initial(s) for avatars. */
  initials: function (name) {
    if (!name) return "?";
    var parts = name.replace(/(Sr\.|Dr\.|Mr\.|Mrs\.|Ms\.)/g, "").trim().split(/\s+/);
    var a = parts[0] ? parts[0][0] : "";
    var b = parts[1] ? parts[1][0] : "";
    return (a + b).toUpperCase();
  },
};
