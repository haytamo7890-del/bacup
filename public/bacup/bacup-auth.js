/* Bac Up — login for the static pages (onboarding, ambassador funnel).
   Google -> /api/auth/google (round-trip, comes back to `next`)
   Email  -> /api/auth/email (sends a 6-digit code) -> /api/auth/verify
   Apple  -> visible, inactive until the Apple account is set up.
   Exposes window.BacupAuth = { me, google, signOut, mountLogin }. */
(function () {
  "use strict";

  var MSG = {
    invalid_email: "Cette adresse email n'est pas valide.",
    rate_limited: "Trop de tentatives. Réessaie dans quelques minutes.",
    send_failed: "Impossible d'envoyer le code pour l'instant. Réessaie.",
    invalid_code: "Code incorrect ou expiré.",
    network: "Connexion impossible. Vérifie ta connexion internet.",
    google: "La connexion Google n'a pas abouti. Réessaie."
  };

  function api(url, body) {
    return fetch(url, {
      method: body ? "POST" : "GET",
      credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok) { var e = new Error(d.error || "network"); e.code = d.error || "network"; throw e; }
        return d;
      });
    }, function () { var e = new Error("network"); e.code = "network"; throw e; });
  }

  function me() { return api("/api/me").catch(function () { return { user: null, student: null, ambassador: null }; }); }
  function here() { return location.pathname + location.search.replace(/([?&])auth_error=[^&]*&?/, "$1").replace(/[?&]$/, ""); }
  function google(next) { location.href = "/api/auth/google?next=" + encodeURIComponent(next || here()); }
  function signOut() { return api("/api/auth/signout", {}); }
  function saveProfile(data) { return api("/api/me/profile", data); }
  function createOrder(data) { return api("/api/orders", data); }
  function orderStatus(ref) { return api("/api/orders/" + encodeURIComponent(ref)); }
  function checkPromo(code) { return api("/api/promo/" + encodeURIComponent(code)); }

  var LINK = "border:0;background:none;padding:6px 0;color:var(--muted);font:inherit;font-size:13.5px;font-weight:600;cursor:pointer";

  /* Takes over the login screen markup the pages already render:
     .sso > [data-go] (Google), [data-go] (Apple), #mailf > #mail, #mailb */
  function mountLogin(el, opts) {
    opts = opts || {};
    var done = typeof opts.onDone === "function" ? opts.onDone : function () {};
    var go = el.querySelectorAll("[data-go]");
    var gBtn = go[0], aBtn = go[1];
    var box = el.querySelector("#mailf"), mb = el.querySelector("#mailb"), mail = el.querySelector("#mail");
    if (!mb || !box || !mail) return;

    var err = document.createElement("p");
    err.className = "note"; err.setAttribute("role", "alert"); err.hidden = true;
    err.style.cssText = "color:#F87171;margin:2px 0 0";
    mb.insertAdjacentElement("afterend", err);
    function say(code) { err.textContent = code ? (MSG[code] || MSG.network) : ""; err.hidden = !code; }

    var q = new URLSearchParams(location.search);
    if (q.get("auth_error")) say("google");

    if (gBtn) gBtn.onclick = function () { gBtn.disabled = true; google(opts.next); };
    if (aBtn) {
      aBtn.setAttribute("aria-disabled", "true");
      aBtn.title = "Bientôt disponible";
      aBtn.onclick = function (e) { e.preventDefault(); };
    }

    var codeWrap = document.createElement("div");
    codeWrap.hidden = true;
    codeWrap.innerHTML =
      '<p class="note" style="text-align:left;margin:0 0 10px">Code envoyé à <b data-em></b>. Regarde aussi dans tes spams.</p>' +
      '<input type="text" id="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="Code à 6 chiffres" aria-label="Code reçu par email" style="letter-spacing:.35em;text-align:center">' +
      '<div style="display:flex;justify-content:space-between;margin-top:6px">' +
      '<button type="button" data-a="resend" style="' + LINK + '">Renvoyer le code</button>' +
      '<button type="button" data-a="change" style="' + LINK + '">Changer d\'email</button></div>';
    box.appendChild(codeWrap);
    if (!document.getElementById("bacup-auth-css")) {
      var st = document.createElement("style");
      st.id = "bacup-auth-css";
      st.textContent = "#otp::placeholder{letter-spacing:normal}.sbtn[aria-disabled=true]{cursor:default}";
      document.head.appendChild(st);
    }
    var otp = codeWrap.querySelector("#otp"), resend = codeWrap.querySelector('[data-a="resend"]');

    var stage = "email", email = "", busy = false, timer = 0;

    function setBusy(b, label) { busy = b; mb.disabled = b; if (label) mb.textContent = label; }
    function cooldown(s) {
      clearInterval(timer); resend.disabled = true;
      var left = s;
      resend.textContent = "Renvoyer dans " + left + " s";
      timer = setInterval(function () {
        left--;
        if (left <= 0) { clearInterval(timer); resend.disabled = false; resend.textContent = "Renvoyer le code"; }
        else resend.textContent = "Renvoyer dans " + left + " s";
      }, 1000);
    }
    function toEmail() {
      stage = "email"; codeWrap.hidden = true; mail.hidden = false; otp.value = "";
      mb.textContent = "Recevoir mon code"; say(""); mail.focus();
    }
    function toCode() {
      stage = "code"; mail.hidden = true; codeWrap.hidden = false;
      codeWrap.querySelector("[data-em]").textContent = email;
      mb.textContent = "Valider le code"; say(""); otp.focus(); cooldown(30);
    }
    function send() {
      var v = (mail.value || "").trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { say("invalid_email"); mail.focus(); return; }
      email = v; setBusy(true, "Envoi du code…");
      api("/api/auth/email", { email: email })
        .then(function () { setBusy(false); toCode(); })
        .catch(function (e) { setBusy(false, "Recevoir mon code"); say(e.code); });
    }
    function verify() {
      var c = (otp.value || "").replace(/\D/g, "");
      if (c.length !== 6) { say("invalid_code"); otp.focus(); return; }
      setBusy(true, "Vérification…");
      api("/api/auth/verify", { email: email, code: c })
        .then(function (m) { setBusy(false, "Connecté"); done(m); })
        .catch(function (e) { setBusy(false, "Valider le code"); say(e.code); otp.select(); });
    }

    mb.onclick = function () {
      if (busy) return;
      if (box.hidden) { box.hidden = false; mb.textContent = "Recevoir mon code"; mb.classList.add("g"); mail.focus(); return; }
      if (stage === "email") send(); else verify();
    };
    if (!box.hidden) mb.textContent = "Recevoir mon code";
    mail.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); mb.click(); } });
    otp.addEventListener("input", function () {
      otp.value = otp.value.replace(/\D/g, "").slice(0, 6);
      if (otp.value.length === 6 && !busy) verify();
    });
    otp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); mb.click(); } });
    resend.onclick = function () {
      if (busy || resend.disabled) return;
      api("/api/auth/email", { email: email }).then(function () { cooldown(30); say(""); }).catch(function (e) { say(e.code); });
    };
    codeWrap.querySelector('[data-a="change"]').onclick = toEmail;
  }

  window.BacupAuth = { me: me, google: google, signOut: signOut, saveProfile: saveProfile, createOrder: createOrder, orderStatus: orderStatus, checkPromo: checkPromo, mountLogin: mountLogin };
})();
