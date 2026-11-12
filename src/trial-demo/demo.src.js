/*! Ecanvasser trial demo | built from src/trial-demo | loaded by loader/trial-demo-embed.html */
(function () {
  'use strict';
  var root = document.getElementById('ec-demo');
  if (!root || root.getAttribute('data-ready') === '1') return;
  // where this file was loaded from, so images load from the same versioned folder
  var me = document.currentScript && document.currentScript.src;
  var ASSETS = window.EC_DEMO_ASSETS || (me ? me.slice(0, me.lastIndexOf('/') + 1) : '');
  root.innerHTML = __MARKUP__;
  root.setAttribute('data-ready', '1');
  root.classList.remove('is-loading');
  var cta = root.querySelector('#d-cta');
  if (cta && root.getAttribute('data-signup-anchor')) cta.setAttribute('href', root.getAttribute('data-signup-anchor'));
  var NS = 'http://www.w3.org/2000/svg';
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function track(event, data) {
    window.dataLayer = window.dataLayer || [];
    var p = { event: event }; for (var k in data) p[k] = data[k];
    window.dataLayer.push(p);
  }

  // ---------- Visitor answers (same source as the trial page) ----------
  var SIZE_REPS = { '0-10': 6, '11-20': 15, '21-50': 35, '51-250': 100, '251+': 250 };
  var PV = null; // prototype preview override (works even where sessionStorage is blocked)
  function answers() {
    if (PV) return PV;
    var a = {};
    try { a = JSON.parse(sessionStorage.getItem('ec_trial') || '{}') || {}; } catch (e) {}
    try {
      var p = new URLSearchParams(location.search);
      if (p.get('preview')) { if (p.get('name')) a.firstname = p.get('name'); if (p.get('size')) a.teamSize = p.get('size'); if (p.get('email')) a.email = p.get('email'); }
    } catch (e) {}
    return a;
  }
  var A = answers();

  // ---------- Company logo on the phone (Brandfetch Logo API) ----------
  // Only runs when the loader sets data-brandfetch-id. Uses the domain of a work
  // email; personal providers are skipped. No logo found = keep the Ecanvasser mark.
  var BF_ID = root.getAttribute('data-brandfetch-id');
  var FREE_MAIL = /^(gmail|googlemail|yahoo|ymail|rocketmail|hotmail|outlook|live|msn|icloud|me|mac|aol|proton|protonmail|pm|gmx|mail|email|yandex|zoho|tutanota|fastmail|hey|btinternet|btopenworld|sky|virginmedia|talktalk|ntlworld|blueyonder|tiscali|eircom|comcast|verizon|att|sbcglobal|bellsouth|cox|charter|shaw|rogers|sympatico|bigpond|optusnet|orange|wanadoo|free|laposte|web|t-online|libero|qq|163|126|naver)\./i;
  function companyDomain(email) {
    var m = String(email || '').trim().toLowerCase().match(/@([a-z0-9.-]+\.[a-z]{2,})$/);
    if (!m) return '';
    var parts = m[1].split('.');
    var n = /\.(co|com|org|net|ac|gov|ltd|plc|me|edu)\.[a-z]{2}$/.test(m[1]) ? 3 : 2;
    var dom = parts.slice(-n).join('.');
    return FREE_MAIL.test(dom) ? '' : dom;
  }
  function paintLogo() {
    var hi = root.querySelector('.m-hi'), old = root.querySelector('.m-logo-co');
    if (old) old.parentNode.removeChild(old);
    hi.classList.remove('has-co');
    var dom = BF_ID && companyDomain(A.email);
    if (!dom) return;
    var img = new Image();
    img.className = 'm-logo-co'; img.alt = ''; img.decoding = 'async';
    img.onload = function () { hi.classList.add('has-co'); };
    img.onerror = function () { if (img.parentNode) img.parentNode.removeChild(img); };
    img.src = 'https://cdn.brandfetch.io/domain/' + encodeURIComponent(dom) + '/fallback/404/icon?c=' + encodeURIComponent(BF_ID);
    hi.appendChild(img);
  }
  function firstName() {
    var n = String(A.firstname || '').trim().split(/\s+/)[0];
    return n ? n.charAt(0).toUpperCase() + n.slice(1) : '';
  }

  // ---------- Icons (inline SVG, Material paths; no icon font needed) ----------
  var ICONS = {"dashboard": "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z", "swap_vert": "M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z", "database": "M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.59 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm6 14c0 .5-2.13 2-6 2s-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V17zm0-4.55c-1.3.95-3.58 1.55-6 1.55s-4.7-.6-6-1.55V9.64c1.47.83 3.61 1.36 6 1.36s4.53-.53 6-1.36v2.81zM12 9C8.13 9 6 7.5 6 7s2.13-2 6-2 6 1.5 6 2-2.13 2-6 2z", "map": "M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z", "tune": "M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z", "group": "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z", "calendar_month": "M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z", "my_location": "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z", "support_agent": "M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z", "notifications": "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z", "filter_alt": "M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A.998.998 0 0018.95 4H5.04c-.83 0-1.3.95-.79 1.61z", "polyline": "M15 16v1.26l-6-3v-3.17L11.7 8H16V2h-6v4.9L7.3 10H3v6h5l7 3.5V22h6v-6z", "info": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z", "flag": "M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z", "layers": "M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z", "search": "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z", "auto_fix_high": "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z", "directions_walk": "M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7", "signal_cellular_alt": "M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z", "wifi": "M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z", "battery_full": "M2 8.33C2 7.6 2.6 7 3.33 7h15.34C19.4 7 20 7.6 20 8.33V10h2v4h-2v1.67c0 .73-.6 1.33-1.33 1.33H3.33C2.6 17 2 16.4 2 15.67z", "home": "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", "format_list_bulleted": "M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z", "person": "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", "person_add": "M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", "arrow_back": "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z", "route": "M19 15.18V7c0-2.21-1.79-4-4-4s-4 1.79-4 4v10c0 1.1-.9 2-2 2s-2-.9-2-2V8.82C8.16 8.4 9 7.3 9 6c0-1.66-1.34-3-3-3S3 4.34 3 6c0 1.3.84 2.4 2 2.82V17c0 2.21 1.79 4 4 4s4-1.79 4-4V7c0-1.1.9-2 2-2s2 .9 2 2v8.18c-1.16.41-2 1.51-2 2.82 0 1.66 1.34 3 3 3s3-1.34 3-3c0-1.3-.84-2.4-2-2.82z", "chevron_right": "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z", "more_horiz": "M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z", "calendar_today": "M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z", "bar_chart": "M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z", "apartment": "M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z", "draw": "M18.85 10.39l1.06-1.06c.78-.78.78-2.05 0-2.83L18.5 5.09c-.78-.78-2.05-.78-2.83 0l-1.06 1.06 4.24 4.24zm-5.66-2.83L4 16.76V21h4.24l9.19-9.19-4.24-4.25zM19 17.5c0 2.19-2.54 3.5-5 3.5-.55 0-1-.45-1-1s.45-1 1-1c1.54 0 3-.73 3-1.5 0-.47-.48-.87-1.23-1.2l1.48-1.48c1.07.63 1.75 1.47 1.75 2.68zM4.58 13.35C3.61 12.79 3 12.06 3 11c0-1.8 1.89-2.63 3.56-3.36C7.59 7.18 9 6.56 9 6c0-.41-.78-1-2-1-1.26 0-1.8.61-1.83.64-.35.41-.98.46-1.4.12a.998.998 0 01-.15-1.38C3.73 4.24 4.76 3 7 3s4 1.32 4 3c0 1.87-1.93 2.72-3.64 3.47C6.42 9.88 5 10.5 5 11c0 .31.43.6 1.07.86l-1.49 1.49z", "add": "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z", "notifications_none": "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z", "sort_box": "M3 4h7v7H3zM3 13h7v7H3zM17 3v13.17l-2.59-2.58L13 15l5 5 5-5-1.41-1.41L19 16.17V3z", "group_outline": "M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z", "home_outline": "M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z", "arrow_right": "M10 17l5-5-5-5v10z", "check": "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z", "place": "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5 0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9c0-2.76 2.24-5 5-5zm0 2.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z", "flag_outline": "M14 6l-1-2H5v17h2v-7h5l1 2h7V6h-6zm4 8h-4l-1-2H7V6h5l1 2h5v6z", "settings": "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z", "map_filled": "M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z", "navigation": "M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z", "close": "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z", "pin_drop": "M12 2C8.69 2 6 4.69 6 8c0 4.5 6 11 6 11s6-6.5 6-11c0-3.31-2.69-6-6-6zm0 8a2 2 0 110-4 2 2 0 010 4zM5 20v2h14v-2H5z", "delete": "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z", "drag_handle": "M20 9H4v2h16V9zM4 15h16v-2H4v2z", "assignment": "M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z", "person_outline": "M12 5.9a2.1 2.1 0 110 4.2 2.1 2.1 0 010-4.2m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z", "arrow_drop_down": "M7 10l5 5 5-5z", "call": "M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z", "work": "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z", "mail": "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z", "chevron_left": "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z", "swipe": "M18.89 6.32L20.3 4.9C18.12 2.79 15.17 1.5 12 1.5S5.88 2.79 3.7 4.9l1.41 1.42C6.98 4.5 9.4 3.5 12 3.5s5.02 1 6.89 2.82zM7.7 8.89l1.41 1.42C9.86 9.8 10.89 9.5 12 9.5s2.14.3 2.89.81l1.41-1.42C15.1 8.02 13.59 7.5 12 7.5s-3.1.52-4.3 1.39zM16 19.5a2.5 2.5 0 01-2.5 2.5H9.4c-.72 0-1.39-.38-1.75-1L4.6 15.8l.55-.5c.4-.38 1.02-.4 1.43-.04L8 16.5V12c0-.83.67-1.5 1.5-1.5S11 11.17 11 12v2.5h2.6c1.33 0 2.4 1.07 2.4 2.4v2.6z", "nav_dash": "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h6v14H5zm14 0h-6v-7h6v7zm0-9h-6V5h6v5z", "nav_ie": "M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z", "nav_db": "M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z", "nav_layers": "M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16zm0-11.47L17.74 9 12 13.47 6.26 9 12 4.53z", "nav_build": "M22.61 18.99l-9.08-9.08c.93-2.34.45-5.1-1.44-7C9.79.61 6.21.4 3.66 2.26L7.5 6.11 6.08 7.52 2.25 3.69C.39 6.23.6 9.82 2.9 12.11c1.86 1.86 4.57 2.35 6.89 1.48l9.11 9.11c.39.39 1.02.39 1.41 0l2.3-2.3c.4-.38.4-1.01 0-1.41zm-3 1.6l-9.46-9.46c-.61.45-1.29.72-2 .82-1.36.2-2.79-.21-3.83-1.25C3.37 9.76 2.93 8.5 3 7.26l3.09 3.09 4.24-4.24-3.09-3.09c1.24-.07 2.49.37 3.44 1.31 1.08 1.08 1.49 2.57 1.24 3.96-.12.71-.42 1.37-.88 1.96l9.45 9.45-.88.89z", "nav_event": "M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z", "nav_check": "M3 6h12v2H3zm0 4h12v2H3zm0 4h8v2H3zm11.41 3.59L13 16.17l-1.41 1.42L14.41 20.4 20 14.82l-1.41-1.42z", "nav_forum": "M15 4v7H5.17L4 12.17V4h11m1-2H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm5 4h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1z", "nav_help": "M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z", "nav_money": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z", "mail_outline": "M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"};
  function icons(scope) {
    (scope || root).querySelectorAll('.mi').forEach(function (m) {
      var k = m.getAttribute('data-i') || m.textContent.trim();
      if (!ICONS[k]) return;
      m.setAttribute('data-i', k); m.setAttribute('aria-hidden', 'true');
      m.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + ICONS[k] + '"/></svg>';
    });
  }

  // ---------- Illustrated avatars (show where profile pictures appear) ----------
  var PHOTO = { rep: '' + ASSETS + 'img/rep.jpg' };
  var PEEPS = { rep: 'rep' };
  function peep(p) { return '<img src="' + PHOTO[p] + '" alt="" style="display:block;width:100%;height:100%;border-radius:999px;object-fit:cover">'; }
  function paintAvatars() {
    root.querySelectorAll('.m-me, .d-livecard .d-av').forEach(function (e) { e.innerHTML = peep(PEEPS.rep); e.classList.add('is-photo'); });
    // The visitor: their initial, or a plain person icon if we don't know their name
    var me = $('d-meav'), n = firstName();
    me.classList.remove('is-photo'); me.classList.toggle('is-initial', !!n);
    me.innerHTML = n ? n.charAt(0).toUpperCase() : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONS.person + '"/></svg>';
  }

  // ---------- Outcomes (names and codes as in the app) ----------
  var OUT = [
    { k: 'Answered', a: 'ANSW', c: '#34a853', win: true },
    { k: 'Not Interested', a: 'NOIN', c: '#d93025' },
    { k: 'Call Back', a: 'CABA', c: '#1a73e8' },
    { k: 'Not Home', a: 'NOHO', c: '#8e44c9' },
    { k: 'Inaccessible', a: 'INAC', c: '#f28b18' }
  ];
  function randCol() { return OUT[Math.floor(rnd() * OUT.length)].c; }
  var PIN = '#1f5674', TURF = '#a23cb4';

  // ---------- Seeded random so the map is the same every time ----------
  var seed = 11;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function text(parent, x, y, str, attrs) {
    var a = { x: x, y: y, 'font-family': 'Inter, Roboto, Arial, sans-serif', 'font-size': 11, fill: '#5f6368', stroke: '#f3f3f1', 'stroke-width': 3, 'paint-order': 'stroke', 'stroke-linejoin': 'round' };
    for (var k in attrs) a[k] = attrs[k];
    var t = el('text', a, parent); t.textContent = str; return t;
  }
  // smooth organic blob for parks
  function blob(cx, cy, r, n) {
    var pts = [];
    for (var i = 0; i < n; i++) { var ang = i / n * Math.PI * 2, rr = r * (.65 + rnd() * .55); pts.push([cx + Math.cos(ang) * rr * 1.25, cy + Math.sin(ang) * rr]); }
    var d = '';
    for (var j = 0; j < n; j++) {
      var p = pts[j], q = pts[(j + 1) % n], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      d += (j === 0 ? 'M' + ((pts[n - 1][0] + p[0]) / 2) + ' ' + ((pts[n - 1][1] + p[1]) / 2) : '') + ' Q' + p[0] + ' ' + p[1] + ' ' + m[0] + ' ' + m[1];
    }
    return d + 'Z';
  }

  // ---------- Build the map (Google light style) ----------
  var map = $('d-map');
  var W = 760, H = 560, HOMES_PER_PIN = 41;
  var STREETS = ['Elm Road', 'Oak Lane', 'Mill Street', 'Park Avenue', 'Church Road', 'Station Road', 'Willow Way', 'Kings Road', 'Orchard Close'];
  var houses = [], gPoly, gPins, gTop, repPin;
  function buildMap() {
    map.innerHTML = ''; seed = 11; houses = [];
    el('rect', { x: 0, y: 0, width: W, height: H, fill: '#f3f3f1' }, map);
    var base = el('g', {}, map);
    // faint built-up areas
    el('path', { d: blob(400, 300, 170, 9), fill: '#efeee9' }, base);
    el('path', { d: blob(380, 520, 120, 8), fill: '#f6efdc', opacity: .7 }, base);
    // parks
    [[90, 90, 60], [660, 80, 50], [700, 300, 70], [80, 330, 45], [560, 545, 36], [150, 520, 55], [330, 60, 28], [470, 250, 18], [300, 330, 16], [690, 500, 40]].forEach(function (p, i) {
      el('path', { d: blob(p[0], p[1], p[2], 8), fill: i % 3 === 0 ? '#c8ecd2' : '#d6f1dd' }, base);
    });
    // water: river + reservoir
    el('path', { d: 'M-10 500 C120 480 190 508 290 494 S470 462 560 474 S700 505 780 486', fill: 'none', stroke: '#9fd3f0', 'stroke-width': 13, 'stroke-linecap': 'round' }, base);
    el('path', { d: blob(55, 200, 26, 7), fill: '#9fd3f0' }, base);
    // residential streets in the core (slightly rotated grid)
    // clip the street grid to the two main roads so every street ends at a junction
    var defs = el('defs', {}, base), cp = el('clipPath', { id: 'ec-grid-clip' }, defs);
    el('path', { d: 'M184 100 C186 200 178 300 186 470 L652 470 C656 330 650 200 662 100 Z' }, cp);
    var clip = el('g', { 'clip-path': 'url(#ec-grid-clip)' }, base);
    var res = el('g', { transform: 'rotate(-6 400 290)' }, clip);
    var rc = el('g', { stroke: '#e1e2e5', 'stroke-width': 5, 'stroke-linecap': 'round' }, res);
    var rw = el('g', { stroke: '#fff', 'stroke-width': 3.2, 'stroke-linecap': 'round' }, res);
    var ROWS = [150, 195, 240, 285, 330, 375, 418], COLS = [215, 285, 355, 425, 495, 565, 625];
    ROWS.forEach(function (y) { [rc, rw].forEach(function (g) { el('line', { x1: 120, y1: y, x2: 720, y2: y + (y % 4 - 1.5) * 2 }, g); }); });
    COLS.forEach(function (x) { [rc, rw].forEach(function (g) { el('line', { x1: x, y1: 125, x2: x + (x % 5 - 2) * 3, y2: 422 }, g); }); });
    // arterials
    var art = [
      'M-10 120 C150 110 260 140 380 118 S600 100 780 130',
      'M-10 300 C120 290 180 300 230 296',
      'M640 300 C700 300 740 290 780 295',
      'M180 -10 C190 120 170 300 200 570',
      'M670 -10 C650 140 660 330 640 570',
      'M-10 560 L300 535 L420 570'
    ];
    art.forEach(function (d) { el('path', { d: d, fill: 'none', stroke: '#dadce0', 'stroke-width': 8, 'stroke-linecap': 'round' }, base); });
    art.forEach(function (d) { el('path', { d: d, fill: 'none', stroke: '#fff', 'stroke-width': 5.5, 'stroke-linecap': 'round' }, base); });
    // motorways (grey-violet like the app)
    ['M420 -10 C430 150 400 260 440 360 S470 500 455 570', 'M-10 40 C200 70 330 20 520 60 S700 30 780 60'].forEach(function (d) {
      el('path', { d: d, fill: 'none', stroke: '#fff', 'stroke-width': 7 }, base);
      el('path', { d: d, fill: 'none', stroke: '#a7acc9', 'stroke-width': 3.6 }, base);
    });
    [[427, 120, 'M4'], [512, 58, 'A1'], [452, 470, 'M4']].forEach(function (b) {
      el('rect', { x: b[0] - 10, y: b[1] - 7, width: 20, height: 13, rx: 3, fill: '#fff', stroke: '#8d93b3', 'stroke-width': 1 }, base);
      text(base, b[0], b[1] + 3, b[2], { 'font-size': 8, 'font-weight': 700, fill: '#4b5170', 'text-anchor': 'middle', stroke: 'none' });
    });
    // labels
    var lab = el('g', {}, base);
    text(lab, 40, 150, 'Westbrook'); text(lab, 600, 165, 'Ashby Green'); text(lab, 250, 95, 'Northfield');
    text(lab, 690, 230, 'Kingsmoor'); text(lab, 35, 400, 'Millbrook'); text(lab, 615, 552, 'Hollins Park');
    text(lab, 270, 230, 'OLD TOWN', { 'font-size': 8.5, 'font-weight': 600, 'letter-spacing': 1.2, fill: '#6b6f76' });
    text(lab, 520, 350, 'THE COVES', { 'font-size': 8.5, 'font-weight': 600, 'letter-spacing': 1.2, fill: '#6b6f76' });
    text(lab, 70, 548, 'Riverside', { 'font-size': 26, 'font-weight': 700, fill: '#202124', 'stroke-width': 4 });
    text(lab, 695, 320, 'Victoria Park', { 'font-size': 9.5, fill: '#1e8e3e', 'text-anchor': 'middle' });

    gPoly = el('g', {}, map);
    gPins = el('g', {}, map);
    // house pins along the residential streets (positions follow the rotated grid)
    var ang = -6 * Math.PI / 180, cx = 400, cy = 290;
    function rot(x, y) { var dx = x - cx, dy = y - cy; return [cx + dx * Math.cos(ang) - dy * Math.sin(ang), cy + dx * Math.sin(ang) + dy * Math.cos(ang)]; }
    var n = 0;
    ROWS.forEach(function (y, ri) {
      for (var x = 205; x < 640; x += 30 + rnd() * 18) {
        if (COLS.some(function (c) { return Math.abs(c - x) < 10; })) continue;
        if (rnd() < .3) continue;
        var off = rnd() < .5 ? -9 : 9, p = rot(x + rnd() * 4, y + off);
        addPin(p[0], p[1], randCol(), STREETS[ri % STREETS.length], 2 + (n++ % 60) * 2);
      }
    });
    // already-worked houses further out, as in a live account
    [[90, 250], [140, 440], [700, 400], [60, 60], [730, 180], [260, 540], [600, 535], [720, 520]].forEach(function (q) {
      addPin(q[0], q[1], randCol(), 'x', 0, true);
    });
    // clusters
    [[120, 190, 6], [700, 120, 4], [60, 480, 5], [720, 440, 2], [330, 30, 3], [740, 260, 2]].forEach(function (c) {
      el('circle', { cx: c[0], cy: c[1], r: 15, fill: '#4a6cf7', stroke: '#fff', 'stroke-width': 2 }, gPins);
      text(gPins, c[0], c[1] + 5, String(c[2]), { 'font-size': 14, 'font-weight': 600, fill: '#fff', 'text-anchor': 'middle', stroke: 'none' });
    });
    gTop = el('g', {}, map);
    repPin = el('g', { visibility: 'hidden' }, map);
    var defs = el('defs', {}, repPin), cp = el('clipPath', { id: 'ec-rep-clip' }, defs);
    el('circle', { cx: 0, cy: 0, r: 11 }, cp);
    el('circle', { cx: 0, cy: 0, r: 11, fill: '#fff' }, repPin);
    var face = el('image', { x: -11, y: -11, width: 22, height: 22, 'clip-path': 'url(#ec-rep-clip)', preserveAspectRatio: 'xMidYMid slice' }, repPin);
    face.setAttribute('href', PHOTO.rep); face.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', PHOTO.rep);
    el('circle', { cx: 0, cy: 0, r: 11, fill: 'none', stroke: '#fff', 'stroke-width': 2.5 }, repPin);
  }
  function addPin(x, y, col, street, num, fixed) {
    var g = el('g', { 'class': 'd-pin', transform: 'translate(' + x + ',' + y + ')' }, gPins);
    var body = el('path', { d: 'M0 0 C-1.6 -4 -8 -7.5 -8 -13.5 A8 8 0 1 1 8 -13.5 C8 -7.5 1.6 -4 0 0Z', fill: col, stroke: '#fff', 'stroke-width': 1.2 }, g);
    el('path', { d: 'M-4.2 -12.6 L0 -16.8 L4.2 -12.6 V-9 H1.3 V-11.4 H-1.3 V-9 H-4.2 Z', fill: '#fff' }, g);
    if (!fixed) houses.push({ x: x, y: y, g: g, body: body, col: col, street: street, num: num, sel: false });
  }
  function pinScale(h, s) { h.g.setAttribute('transform', 'translate(' + h.x + ',' + h.y + ') scale(' + s + ')'); }

  // ---------- Steps ----------
  var COPY = [
    ['Draw your first turf', 'Draw around the houses you want worked. Ecanvasser counts them before you commit.'],
    ['Your rep just got the list', 'Tap the new list on their phone to open it.'],
    ['Let the route plan itself', 'Switch on Optimize Route, then tap Start route.'],
    ['Knock some doors', 'Pick an outcome and hit Save. Watch the pin change on your map.']
  ];
  var fast = false, gen = 0, curStep = 0, savedPts = null;
  // ---------- Fit to container: scale the devices, or show one at a time when narrow ----------
  var stage = $('d-stage'), canvas = $('d-canvas'), narrow = false, view = 'web';
  var NARROW_AT = 900;
  function fit() {
    var W = stage.clientWidth; if (!W) return;
    var n = W < NARROW_AT;
    if (n !== narrow) { narrow = n; root.classList.toggle('is-narrow', n); viewHint(); }
    var w = canvas.offsetWidth, h = canvas.offsetHeight;
    var s = Math.min(narrow ? (view === 'phone' ? 1.25 : 1.35) : 1, W / w);
    canvas.style.transform = 'translate(' + Math.max(0, (W - w * s) / 2) + 'px,0) scale(' + s + ')';
    stage.style.height = Math.ceil(h * s) + 'px';
  }
  function setView(v, user) {
    view = v; root.setAttribute('data-show', v);
    root.querySelectorAll('#d-views button').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-show') === v ? 'true' : 'false'); });
    var badge = $('d-vb-' + v); badge.classList.remove('on'); badge.textContent = '';
    viewHint();
    if (user) track('trial_demo_view', { demo_view: v });
    fit();
  }
  // When the visitor switches to the device that has nothing to do yet, tell them where the next step is
  function viewHint() {
    var step = typeof curStep === 'number' ? curStep : 0;
    var active = step === 0 ? 'web' : step <= 3 ? 'phone' : null;
    var off = narrow && active && view !== active;
    // pulse the tab where the next step is, the same way other prompts pulse
    root.querySelectorAll('#d-views button').forEach(function (b) { b.classList.toggle('is-next', !!off && b.getAttribute('data-show') === active); });
  }
  function nudgeView(v) { if (!narrow || view === v) return; var b = $('d-vb-' + v); b.textContent = String((parseInt(b.textContent, 10) || 0) + 1); b.classList.add('on'); }
  root.querySelectorAll('#d-views button').forEach(function (b) { b.addEventListener('click', function () { setView(b.getAttribute('data-show'), true); }); });
  if (window.ResizeObserver) new ResizeObserver(fit).observe(stage); else window.addEventListener('resize', fit);

  function setStep(n) {
    setView(n === 0 ? 'web' : 'phone');
    curStep = n; $('d-back').hidden = n === 0; viewHint();
    $('d-num').textContent = n + 1;
    var t = $('d-t'), s = $('d-s');
    var nm = firstName();
    t.textContent = n === 0 && nm ? COPY[0][0] + ', ' + nm : COPY[n][0]; s.textContent = COPY[n][1];
    var box = t.parentNode; box.classList.remove('d-instr-anim'); void box.offsetWidth; box.classList.add('d-instr-anim');
    root.querySelectorAll('.d-dot').forEach(function (d, i) { d.classList.toggle('on', i <= n); });
    if (!fast) track('trial_demo_step', { demo_step: n + 1 });
  }
  function phone(view) {
    root.querySelectorAll('.d-view').forEach(function (v) { v.classList.toggle('on', v.getAttribute('data-view') === view); });
  }
  function say(msg) { $('d-sr').textContent = msg; }
  function hint(t, solo, alt) { var h = $('d-hint'); $('d-hint-t').textContent = t; h.classList.toggle('hide', !t); h.classList.toggle('solo', !!solo && !alt); h.classList.toggle('alt', !!alt); $('d-alt').textContent = alt || ''; }
  var mode = 'poly';
  var START = { poly: 'Click around the houses to draw your turf', free: 'Hold and drag around the houses' };
  function setMode(m) {
    if (!drawEnabled || closed) return;
    mode = m; pts = []; drawPoly();
    root.querySelector('.d-mapwrap').classList.toggle('is-free', m === 'free');
    root.querySelectorAll('.d-mode').forEach(function (b) { var on = b.getAttribute('data-mode') === m; b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); });
    hint(START[m]);
  }
  root.querySelectorAll('.d-mode').forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); }); });

  // ---------- Step 1: draw a polygon turf ----------
  var pts = [], closed = false, drawEnabled = true, selected = [], polyEl, previewEl;
  function svgPoint(evt) {
    var pt = map.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(map.getScreenCTM().inverse());
  }
  function inside(p, poly) {
    var c = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      if (((poly[i][1] > p[1]) !== (poly[j][1] > p[1])) && (p[0] < (poly[j][0] - poly[i][0]) * (p[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])) c = !c;
    }
    return c;
  }
  function drawPoly(cursor) {
    gPoly.innerHTML = ''; gTop.innerHTML = '';
    if (!pts.length) return;
    var all = cursor && !closed ? pts.concat([cursor]) : pts;
    if (closed || (all.length >= 3 && mode === 'poly')) el('polygon', { points: all.map(function (p) { return p.join(','); }).join(' '), fill: 'rgba(190,80,210,.42)', stroke: TURF, 'stroke-width': 2, 'stroke-linejoin': 'round' }, gPoly);
    else el('polyline', { points: all.map(function (p) { return p.join(','); }).join(' '), fill: 'none', stroke: TURF, 'stroke-width': 2 }, gPoly);
    if (mode === 'free') return;
    pts.forEach(function (p, i) { el('circle', { cx: p[0], cy: p[1], r: !closed && i === 0 && pts.length >= 3 ? 8 : 6.5, fill: '#fff', stroke: TURF, 'stroke-width': 1.5 }, gTop); });
  }
  function select() {
    selected = [];
    houses.forEach(function (h) { h.sel = inside([h.x, h.y - 10], pts); pinScale(h, h.sel ? 1.15 : 1); if (h.sel) selected.push(h); });
  }
  function addPoint(p) {
    if (closed || !drawEnabled) return;
    if (pts.length >= 3 && Math.hypot(p[0] - pts[0][0], p[1] - pts[0][1]) < 20) return closePoly();
    var last = pts[pts.length - 1];
    if (last && Math.hypot(p[0] - last[0], p[1] - last[1]) < 6) return; // second click of a double-click
    pts.push(p);
    if (pts.length >= 3) hint('Click the first point', false, 'Double-click to finish'); else hint('Keep clicking around the houses', true);
    drawPoly();
    if (pts.length >= 14) closePoly();
  }
  // Step one: until the visitor starts, a looping "ghost" shows a polygon being
  // clicked out on the map, and "Draw it for me" pulses.
  var TRACE = [[300, 205], [470, 182], [545, 290], [455, 382], [300, 352]];
  function buildTrace() {
    var wrap = root.querySelector('.d-mapwrap'), NS = 'http://www.w3.org/2000/svg';
    var g = document.createElementNS(NS, 'svg');
    g.setAttribute('class', 'd-trace'); g.setAttribute('viewBox', '0 0 760 560');
    g.setAttribute('preserveAspectRatio', 'xMidYMid slice'); g.setAttribute('aria-hidden', 'true');
    var d = 'M' + TRACE.map(function (p) { return p.join(' '); }).join(' L') + ' Z';
    var css = '', html = '<g class="t-poly"><path class="d-trace-line" pathLength="100" d="' + d + '"/>';
    TRACE.forEach(function (p, i) {
      var t = Math.round(i * 60 / TRACE.length); // the line reaches each point at t% of the loop
      css += '@keyframes dTracePt' + i + '{0%,' + t + '%{opacity:0;transform:scale(.3)}' + (t + 4) + '%{opacity:1;transform:scale(1)}88%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1)}}' +
        '@keyframes dTraceTap' + i + '{0%,' + t + '%{opacity:0;transform:scale(.6)}' + (t + 1) + '%{opacity:.8;transform:scale(.6)}' + (t + 14) + '%,100%{opacity:0;transform:scale(2.6)}}' +
        '#ec-demo .d-trace .p' + i + ' .d{animation-name:dTracePt' + i + '}#ec-demo .d-trace .p' + i + ' .r{animation-name:dTraceTap' + i + '}';
      html += '<g class="p' + i + '" transform="translate(' + p[0] + ' ' + p[1] + ')"><circle class="r" r="9"/><circle class="d" r="6.5"/></g>';
    });
    html += '</g>' + freeTrace();
    g.innerHTML = html;
    var st = document.createElement('style'); st.textContent = css;
    wrap.appendChild(st); wrap.insertBefore(g, $('d-modes'));
  }
  // Free draw version: press, drag a loose loop, let go. SMIL so the dot can
  // follow the line; skipped (shape shown still) for reduced motion.
  function freeTrace() {
    var F = 'M318 212 C380 168 492 166 536 236 C572 296 528 380 446 388 C368 396 296 360 286 296 C280 258 296 228 318 212';
    var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var T = 'dur="4.5s" repeatCount="indefinite"';
    if (still) return '<g class="t-free"><path class="t-line" d="' + F + '"/></g>';
    return '<g class="t-free">' +
      '<path class="t-line" pathLength="100" d="' + F + '" stroke-dasharray="100">' +
        '<animate attributeName="stroke-dashoffset" values="100;100;0;0" keyTimes="0;.06;.65;1" ' + T + '/>' +
        '<animate attributeName="fill-opacity" values="0;0;.14;.14" keyTimes="0;.65;.75;1" ' + T + '/>' +
        '<animate attributeName="opacity" values="1;1;0" keyTimes="0;.88;1" ' + T + '/></path>' +
      '<circle class="r" cx="318" cy="212" r="9" opacity="0">' +
        '<animate attributeName="r" values="9;9;24;24" keyTimes="0;.01;.14;1" ' + T + '/>' +
        '<animate attributeName="opacity" values="0;.8;0;0" keyTimes="0;.01;.14;1" ' + T + '/></circle>' +
      '<circle class="d" r="7.5" opacity="0">' +
        '<animateMotion path="' + F + '" keyPoints="0;0;1;1" keyTimes="0;.06;.65;1" calcMode="linear" ' + T + '/>' +
        '<animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.03;.65;.7;1" ' + T + '/></circle>' +
      '</g>';
  }
  buildTrace();
  function prompt(on) { root.querySelector('.d-mapwrap').classList.toggle('is-prompt', on); }
  function closePoly() {
    prompt(false);
    closed = true; drawPoly(); select(); hint(''); $('d-modes').classList.add('locked');
    if (selected.length < 6) {
      say('That turf has too few houses. Try a bigger area.');
      hint('Too few houses. Cancel and try a bigger area', true);
      $('d-count').classList.add('show'); $('d-create').disabled = true;
    } else { $('d-create').disabled = false; $('d-count').classList.add('show'); }
    var homes = selected.length * HOMES_PER_PIN;
    animateCount($('d-homes'), homes, 600);
    animateCount($('d-contacts'), Math.round(homes * .59), 600);
    say('Turf drawn with ' + homes + ' houses. Press Create.');
    $('d-create').focus({ preventScroll: true });
  }
  map.addEventListener('click', function (e) { if (mode !== 'poly') return; var p = svgPoint(e); addPoint([p.x, p.y]); });
  map.addEventListener('dblclick', function (e) { e.preventDefault(); if (mode === 'poly' && drawEnabled && !closed && pts.length >= 3) closePoly(); });
  // Free draw: hold and drag a loop, release to close it
  var freeing = false;
  map.addEventListener('pointerdown', function () { if (drawEnabled) prompt(false); });
  map.addEventListener('pointerdown', function (e) {
    if (mode !== 'free' || !drawEnabled || closed) return;
    freeing = true; map.setPointerCapture(e.pointerId);
    var p = svgPoint(e); pts = [[p.x, p.y]]; hint('Keep going, then let go to close it', true);
  });
  map.addEventListener('pointermove', function (e) {
    if (!drawEnabled || closed || !pts.length) return;
    var p = svgPoint(e);
    if (mode === 'poly') return drawPoly([p.x, p.y]);
    if (!freeing) return;
    var last = pts[pts.length - 1];
    if (Math.hypot(p.x - last[0], p.y - last[1]) > 6) { pts.push([p.x, p.y]); drawPoly(); }
  });
  function endFree() {
    if (!freeing) return; freeing = false;
    if (pts.length >= 8) closePoly(); else { pts = []; drawPoly(); hint(START.free); }
  }
  map.addEventListener('pointerup', endFree);
  map.addEventListener('pointercancel', endFree);
  $('d-cancel').addEventListener('click', function () {
    pts = []; closed = false; selected = []; drawPoly(); $('d-modes').classList.remove('locked');
    houses.forEach(function (h) { pinScale(h, 1); });
    $('d-count').classList.remove('show');
    hint(START[mode]); prompt(true);
  });

  function animateCount(elm, to, ms, suffix) {
    suffix = suffix || '';
    var from = parseInt(String(elm.textContent).replace(/\D/g, ''), 10) || 0;
    if (reduce || fast) { elm.textContent = to.toLocaleString() + suffix; return; }
    var t0 = performance.now();
    (function tick(t) {
      var k = Math.min(1, (t - t0) / ms), v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      elm.textContent = v.toLocaleString() + suffix;
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }

  $('d-auto').addEventListener('click', function (e) {
    e.stopPropagation(); prompt(false);
    if (closed) return;
    setMode('poly');
    var AUTO = [[255, 150], [470, 128], [610, 185], [590, 375], [410, 425], [235, 355]];
    var i = 0;
    (function next() {
      if (i < AUTO.length) { addPoint(AUTO[i++]); setTimeout(next, reduce ? 0 : 200); }
      else closePoly();
    })();
  });

  // ---------- Fly a dot between devices ----------
  function fly(fromEl, toEl, cb) {
    var dot = $('d-sync'), st = $('d-stage').getBoundingClientRect();
    var a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    if (reduce || fast || narrow || !dot.animate) return cb && cb();
    var ax = a.left + a.width / 2 - st.left, ay = a.top + a.height / 2 - st.top;
    var bx = b.left + b.width / 2 - st.left, by = b.top + b.height / 2 - st.top;
    dot.style.opacity = 1;
    var anim = dot.animate([
      { transform: 'translate(' + (ax - st.width / 2) + 'px,' + (ay - st.height / 2) + 'px) scale(.6)' },
      { transform: 'translate(' + ((ax + bx) / 2 - st.width / 2) + 'px,' + (Math.min(ay, by) - 80 - st.height / 2) + 'px) scale(1.2)' },
      { transform: 'translate(' + (bx - st.width / 2) + 'px,' + (by - st.height / 2) + 'px) scale(.6)' }
    ], { duration: 650, easing: 'ease-in-out' });
    anim.onfinish = function () { dot.style.opacity = 0; cb && cb(); };
  }

  function ring(pct) {
    var r = 15, c = 2 * Math.PI * r;
    return '<svg viewBox="0 0 38 38" aria-hidden="true"><circle cx="19" cy="19" r="' + r + '" fill="none" stroke="#eceef0" stroke-width="3.5"/>' +
      '<circle cx="19" cy="19" r="' + r + '" fill="none" stroke="#0f7a52" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="' + (c * pct / 100) + ' ' + c + '" transform="rotate(-90 19 19)"/>' +
      '<text x="19" y="22" text-anchor="middle" font-size="9" font-weight="700" fill="#0d1329" font-family="Inter, sans-serif">' + pct + '%</text></svg>';
  }

  // ---------- Mobile list card (as on the app dashboard) ----------
  function thumb() {
    var t = '<svg class="m-thumb" viewBox="0 0 220 60" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="220" height="60" fill="#cfe3d6"/>';
    [8, 22, 37, 51].forEach(function (y) { t += '<line x1="0" y1="' + y + '" x2="220" y2="' + (y + 3) + '" stroke="#e8f1ea" stroke-width="2.2"/>'; });
    [18, 52, 90, 128, 160, 196].forEach(function (x) { t += '<line x1="' + x + '" y1="0" x2="' + (x - 4) + '" y2="60" stroke="#e8f1ea" stroke-width="2"/>'; });
    t += '<path d="M130 0 C140 20 150 35 175 60" stroke="#b9c4e0" stroke-width="3" fill="none"/><rect x="60" y="24" width="24" height="12" fill="#b5dcc2"/></svg>';
    return t;
  }
  function listCard(name, contacts, houses, empty) {
    var card = document.createElement(empty ? 'div' : 'button');
    if (!empty) card.type = 'button';
    card.className = 'm-card m-list' + (empty ? ' is-empty' : ' is-new');
    card.innerHTML = '<div class="m-card-img">' + thumb() + '<span class="m-badge"><span class="mi">map_filled</span></span>' + (empty ? '' : '<span class="d-new">NEW</span>') + '</div>' +
      '<div class="m-card-body"><div><b></b>' + (empty ? '<span class="m-meta">Your manager will send one</span>' :
      '<span class="m-meta"><span class="mi">group_outline</span>' + contacts.toLocaleString() + '</span><span class="m-meta"><span class="mi">home_outline</span>' + houses.toLocaleString() + '</span>') +
      '</div>' + (empty ? '' : '<span class="m-ring">' + ring(0) + '</span><span class="mi m-caret">arrow_right</span>') + '</div>' + (empty ? '' : '<i class="d-ring"></i>');
    card.querySelector('b').textContent = name;
    icons(card);
    return card;
  }

  // ---------- Step 2: list lands on the phone ----------
  var turfName = '';
  $('d-create').addEventListener('click', createTurf);
  function createTurf() {
    if (selected.length < 6) return;
    savedPts = pts.slice();
    drawEnabled = false; map.classList.remove('drawable');
    gTop.innerHTML = '';
    houses.forEach(function (h) { pinScale(h, 1); });
    var homes = selected.length * HOMES_PER_PIN;
    var name = firstName();
    turfName = name ? name + "'s first turf" : 'Your first turf';
    if (!fast) track('trial_demo_turf', { demo_homes: homes });
    var from = $('d-create');
    fly(from, $('d-lists'), function () {
      $('d-count').classList.remove('show');
      root.classList.add('is-live');
      $('d-lists').innerHTML = '';
      var card = listCard(turfName, Math.round(homes * .59), homes, false);
      card.setAttribute('aria-label', 'Open list ' + turfName);
      card.addEventListener('click', openRoute);
      $('d-lists').appendChild(card);
      $('d-nlists').textContent = '(1)';
      setStep(1);
      say('The list arrived on your rep\'s phone. Open it.');
      if (!fast) card.focus({ preventScroll: true });
    });
  }

  // ---------- Step 3: optimise the route ----------
  var stops = [], pdots = [], routePct = 0;
  function moveRep(s) { repPin.setAttribute('transform', 'translate(' + (s.x + 12) + ',' + (s.y - 24) + ')'); }
  var AREAS = ['Old Town', 'The Coves', 'Ashby Green'];
  function renderStops(anim) {
    var box = $('d-stops'); box.innerHTML = '';
    box.classList.toggle('shuffle', !!anim && !reduce && !fast);
    stops.slice(0, 6).forEach(function (s, i) {
      var r = document.createElement('div'); r.className = 'r-row'; r.style.animationDelay = (i * 60) + 'ms';
      r.innerHTML = '<span class="r-num">' + (i + 1) + '</span><div><b></b><small></small></div><span class="mi">delete</span><span class="mi">drag_handle</span>';
      r.querySelector('b').textContent = s.num + ' ' + s.street;
      r.querySelector('small').textContent = AREAS[s.num % 3] + ', Riverside';
      box.appendChild(r);
    });
    icons(box);
  }
  function phonePin(parent, x, y, col, sc) {
    var g = el('g', { transform: 'translate(' + x + ',' + y + ') scale(' + sc + ')' }, parent);
    var body = el('path', { d: 'M0 0 C-1.6 -4 -8 -7.5 -8 -13.5 A8 8 0 1 1 8 -13.5 C8 -7.5 1.6 -4 0 0Z', fill: col, stroke: '#fff', 'stroke-width': 1.4 }, g);
    el('path', { d: 'M-4.2 -12.6 L0 -16.8 L4.2 -12.6 V-9 H1.3 V-11.4 H-1.3 V-9 H-4.2 Z', fill: '#fff' }, g);
    return body;
  }
  function openRoute() {
    phone('route');
    var all = selected;
    var minX = Math.min.apply(null, all.map(function (s) { return s.x; })), maxX = Math.max.apply(null, all.map(function (s) { return s.x; }));
    var minY = Math.min.apply(null, all.map(function (s) { return s.y; })), maxY = Math.max.apply(null, all.map(function (s) { return s.y; }));
    var pm = $('d-pmap'); pm.innerHTML = '';
    var sc = Math.min(165 / Math.max(1, maxX - minX), 132 / Math.max(1, maxY - minY));
    var ox = 10 + (240 - (maxX - minX) * sc) / 2, oy = 60 + (132 - (maxY - minY) * sc) / 2;
    function P(h) { return [ox + (h.x - minX) * sc, oy + (h.y - minY) * sc]; }
    // light base map like the app
    el('rect', { x: 0, y: 0, width: 240, height: 215, fill: '#f4f2f3' }, pm);
    el('path', { d: 'M150 90 q30 -10 50 10 l-10 30 q-30 10 -45 -10z', fill: '#d4efdb' }, pm);
    ['M-5 60 L250 72', 'M-5 160 L250 148', 'M40 -5 L52 220', 'M120 -5 L112 220', 'M195 -5 L205 220', 'M-5 112 C60 100 150 125 250 110', 'M-5 195 L250 188'].forEach(function (d, i) {
      el('path', { d: d, fill: 'none', stroke: i === 5 ? '#d7dbe4' : '#dfe2e8', 'stroke-width': i === 5 ? 4 : 2.2 }, pm);
    });
    el('path', { d: 'M-5 44 C60 58 120 34 250 54', fill: 'none', stroke: '#a8d8ee', 'stroke-width': 4 }, pm);
    var lab = el('text', { x: 196, y: 205, 'font-size': 7, fill: '#555', 'font-family': 'Inter, sans-serif', transform: 'rotate(-3 196 205)' }, pm); lab.textContent = 'Mill St';
    // pick stops that are spaced out on the phone map, so every pin (and the line to it) stays visible
    var pick = [];
    all.forEach(function (h) { var p = P(h); h.px = p[0]; h.py = p[1]; });
    all.slice().sort(function (a, b) { return (a.num * 7919 % 97) - (b.num * 7919 % 97); }).forEach(function (h) {
      if (pick.length < 14 && pick.every(function (q) { return Math.hypot(q.px - h.px, q.py - h.py) > 24; })) pick.push(h);
    });
    stops = pick;
    $('d-nstops').textContent = stops.length;
    var routeG = el('g', {}, pm);
    var messy = el('polyline', { points: stops.map(function (s) { return s.px + ',' + s.py; }).join(' '), fill: 'none', stroke: 'rgba(229,72,77,.7)', 'stroke-width': 1.8, 'stroke-dasharray': '4 3', 'stroke-linejoin': 'round' }, routeG);
    messy.id = 'd-messy';
    stops.forEach(function (s) { el('circle', { cx: s.px, cy: s.py, r: 2.2, fill: '#fff', stroke: '#2f7a57', 'stroke-width': 1.2 }, routeG); });
    pdots = stops.map(function (s) { s.pdot = phonePin(pm, s.px, s.py, '#77777b', .95); return s.pdot; });
    renderStops(false);
    moveRep(stops[0]); repPin.setAttribute('visibility', 'visible');
    setStep(2);
    say('Route opened. Switch on Optimize Route.');
    $('d-opt').focus({ preventScroll: true });
  }
  function dist(a, b) { return Math.hypot(a.px - b.px, a.py - b.py); }
  function routeLen(r) { var L = 0; for (var i = 1; i < r.length; i++) L += dist(r[i - 1], r[i]); return L; }
  $('d-opt').addEventListener('click', optimise);
  function optimise() {
    var btn = $('d-opt'); if (btn.classList.contains('on')) return;
    btn.classList.add('on'); btn.setAttribute('aria-pressed', 'true');
    var before = routeLen(stops);
    var left = stops.slice(), cur = left.reduce(function (a, b) { return (a.px + a.py < b.px + b.py) ? a : b; }), order = [cur];
    left.splice(left.indexOf(cur), 1);
    while (left.length) {
      var best = 0; for (var i = 1; i < left.length; i++) if (dist(cur, left[i]) < dist(cur, left[best])) best = i;
      cur = left.splice(best, 1)[0]; order.push(cur);
    }
    // tidy the order with 2-opt so the path never doubles back on itself
    for (var pass = 0, improved = true; improved && pass < 30; pass++) {
      improved = false;
      for (var x = 0; x < order.length - 2; x++) for (var y = x + 2; y < order.length - 1; y++) {
        if (dist(order[x], order[y]) + dist(order[x + 1], order[y + 1]) < dist(order[x], order[x + 1]) + dist(order[y], order[y + 1]) - .01) {
          var seg = order.slice(x + 1, y + 1).reverse(); order.splice.apply(order, [x + 1, seg.length].concat(seg)); improved = true;
        }
      }
    }
    stops = order;
    renderStops(true);
    moveRep(stops[0]);
    var after = routeLen(stops), pct = Math.max(25, Math.round((1 - after / before) * 100));
    routePct = pct;
    var messy = $('d-messy');
    if (messy) { messy.style.transition = reduce || fast ? 'none' : 'opacity .3s'; messy.style.opacity = 0; }
    var line = el('polyline', { points: stops.map(function (s) { return s.px + ',' + s.py; }).join(' '), fill: 'none', stroke: '#2f7a57', 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, messy.parentNode);
    var L = line.getTotalLength ? line.getTotalLength() : 600;
    line.style.strokeDasharray = L; line.style.strokeDashoffset = L;
    line.getBoundingClientRect();
    line.style.transition = reduce || fast ? 'none' : 'stroke-dashoffset 1.2s ease-in-out';
    line.style.strokeDashoffset = 0;
    var mins = Math.round(stops.length * 6.3 * pct / 100);
    var saved = pct + '% less walking · about ' + mins + ' minutes saved';
    function done() { $('d-saved').textContent = saved; $('d-start').disabled = false; }
    if (fast) return done();
    var g = gen;
    setTimeout(function () {
      if (g !== gen) return;
      done();
      say('Route optimised. ' + pct + ' percent less walking. Tap Start route.');
      track('trial_demo_route', { demo_saving: pct });
      $('d-start').focus({ preventScroll: true });
    }, reduce ? 0 : 1250);
  }
  $('d-start').addEventListener('click', function () { if (!this.disabled) openDoor(); });
  $('d-rback').addEventListener('click', function () { track('trial_demo_back', { demo_step: 2 }); goTo(1); });

  // ---------- Step 4: knock doors ----------
  var DOORS = 3, logged = 0, wins = 0, choice = null;
  var TILE_ORDER = [3, 2, 0, 1, 4]; // NOHO, CABA, ANSW, NOIN, INAC (as in the app carousel)
  var PEOPLE = [['Sarah Harrison', '26 years old', 'Female', '07700 900 123'], ['Tom Doyle', '41 years old', 'Male', '07700 900 456'], ['Aisha Khan', '33 years old', 'Female', '07700 900 789']];
  function tint(hex, a) { var n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
  var TW = 5.5, curTile = 2;
  function centreTile(i) {
    $('d-outs').style.transform = 'translateX(' + (-(i + .5) * TW) + 'rem)';
    [].forEach.call($('d-outs').children, function (x, j) { x.classList.toggle('nb', Math.abs(j - i) === 1); });
  }
  function shiftTile(d) { var n = Math.max(0, Math.min(TILE_ORDER.length - 1, curTile + d)); if (n !== curTile) $('d-outs').children[n].click(); }
  // swipe the carousel like the app
  (function () {
    var car = $('d-car'), x0 = null;
    car.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    car.addEventListener('pointerup', function (e) { if (x0 === null) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 24) shiftTile(dx < 0 ? 1 : -1); });
    car.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); shiftTile(1); $('d-outs').children[curTile].focus(); } if (e.key === 'ArrowLeft') { e.preventDefault(); shiftTile(-1); $('d-outs').children[curTile].focus(); } });
  })();
  function nudge() {
    if (reduce || fast) return;
    var car = $('d-car'); car.classList.remove('nudge'); void car.offsetWidth; car.classList.add('nudge');
  }
  function openDoor() {
    phone('door'); setStep(3);
    var outs = $('d-outs'); outs.innerHTML = '';
    TILE_ORDER.forEach(function (oi, ti) {
      var o = OUT[oi], b = document.createElement('button');
      b.type = 'button'; b.className = 'o-tile'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false'); b.setAttribute('aria-label', o.k);
      b.innerHTML = '<span class="o-ico"><span class="mi">assignment</span></span><span class="o-lab"></span>';
      var ico = b.firstChild; ico.style.background = tint(o.c, .16); ico.style.color = o.c;
      b.lastChild.textContent = o.k;
      b.addEventListener('click', function () {
        curTile = ti;
        choice = o;
        outs.querySelectorAll('.o-tile').forEach(function (x) { x.classList.remove('sel'); x.setAttribute('aria-checked', 'false'); x.firstChild.style.background = tint(OUT[TILE_ORDER[[].indexOf.call(outs.children, x)]].c, .16); });
        b.classList.add('sel'); b.setAttribute('aria-checked', 'true'); ico.style.background = o.c;
        root.querySelector('[data-view="door"]').style.setProperty('--ic', o.c);
        $('d-car').classList.add('picked');
        centreTile(ti);
        $('d-save').disabled = false;
      });
      outs.appendChild(b);
    });
    icons(outs);
    showDoor();
    outs.children[2].focus({ preventScroll: true });
  }
  function showDoor() {
    var s = stops[logged], who = PEOPLE[logged % PEOPLE.length];
    choice = null; $('d-save').disabled = true;
    var outs = $('d-outs');
    [].forEach.call(outs.children, function (x, i) { x.classList.remove('sel'); x.setAttribute('aria-checked', 'false'); x.firstChild.style.background = tint(OUT[TILE_ORDER[i]].c, .16); });
    // start with Answered selected, as in the app; tapping another tile switches it
    outs.children[2].click();
    nudge();
    $('d-addr').textContent = s.num + ' ' + s.street;
    $('d-addr2').textContent = AREAS[s.num % 3] + ', Riverside';
    $('d-stop').textContent = 'Door ' + (logged + 1) + ' of ' + DOORS;
    [].forEach.call($('d-dots').children, function (d, i) { d.className = i < logged ? 'done' : i === logged ? 'now' : ''; });
    $('d-save').textContent = logged === DOORS - 1 ? 'Save & finish' : 'Save';
    $('d-cname').textContent = who[0]; $('d-cage').textContent = who[1]; $('d-cgen').textContent = who[2]; $('d-cphone').textContent = who[3];
    moveRep(s);
  }
  $('d-save').addEventListener('click', function () {
    if (!choice || logged >= DOORS) return;
    var o = choice, s = stops[logged], btn = this;
    s.body.setAttribute('fill', o.c);
    gPins.appendChild(s.g); pinScale(s, 1.35);
    setTimeout(function () { pinScale(s, 1.1); }, 350);
    if (s.pdot) s.pdot.setAttribute('fill', o.c);
    if (!reduce && map.animate) {
      var ping = el('circle', { cx: s.x, cy: s.y - 12, r: 6, fill: 'none', stroke: o.c, 'stroke-width': 3 }, map);
      ping.animate([{ r: 6, opacity: 1 }, { r: 30, opacity: 0 }], { duration: 900, easing: 'ease-out' }).onfinish = function () { ping.remove(); };
      ping.setAttribute('r', 30); ping.style.opacity = 0;
    }
    var feed = $('d-feed'), t = document.createElement('div');
    t.className = 'd-toast';
    t.innerHTML = '<span class="d-av is-photo">' + peep(PEEPS.rep) + '</span><span></span><span class="d-oc"></span><em>now</em>';
    t.children[1].textContent = s.num + ' ' + s.street;
    t.children[2].textContent = o.k; t.children[2].style.background = o.c;
    feed.insertBefore(t, feed.firstChild);
    while (feed.children.length > 3) feed.removeChild(feed.lastChild);
    fly(btn, s.g, null);
    nudgeView('web');
    logged++;
    if (o.win) wins++;
    $('d-t2').textContent = logged; $('d-t3').textContent = Math.round(wins / logged * 100) + '%';
    $('d-progt').textContent = logged + ' of ' + DOORS + ' logged';
    $('d-progb').style.width = (logged / DOORS * 100) + '%';
    track('trial_demo_door', { demo_outcome: o.k, demo_door: logged });
    say(o.k + ' saved and synced to the map.');
    if (logged < DOORS) { showDoor(); $('d-outs').children[2].focus({ preventScroll: true }); }
    else { $('d-save').disabled = true; var g = gen; setTimeout(function () { if (g === gen) finish(); }, reduce ? 200 : 1100); }
  });

  // ---------- Payoff ----------
  function finish() {
    var reps = SIZE_REPS[A.teamSize] || 6;
    var name = firstName();
    $('d-done-h').textContent = name ? 'Nice work, ' + name + '. That\'s a day in the field.' : 'That\'s a day in the field.';
    $('d-done-p').textContent = 'Turf drawn, route planned, doors logged, all on your live map as it happened. Here\'s what that looks like for your team:';
    $('d-b2').textContent = '0'; $('d-b1').textContent = '0'; $('d-b3').textContent = '0';
    $('d-done').classList.add('on'); curStep = 4; viewHint();
    $('d-num').textContent = '✓'; $('d-t').textContent = 'Demo complete'; $('d-s').textContent = 'Now try it with your own area and team.';
    animateCount($('d-b1'), reps * 90 * 5, 1200);
    animateCount($('d-b2'), reps, 900);
    $('d-b3').textContent = routePct + '%';
    confetti();
    track('trial_demo_complete', { demo_reps: reps });
    say('Demo complete.');
    $('d-cta').focus({ preventScroll: true });
  }
  function confetti() {
    if (reduce) return;
    var box = $('d-confetti'), cols = ['#169265', '#52BED6', '#0d1329', '#f2a900'];
    for (var i = 0; i < 40; i++) {
      var c = document.createElement('i');
      c.style.left = (Math.random() * 100) + '%'; c.style.background = cols[i % 4];
      c.style.animationDelay = (Math.random() * .4) + 's';
      box.appendChild(c);
    }
    setTimeout(function () { box.innerHTML = ''; }, 2400);
  }
  $('d-cta').addEventListener('click', function () { track('trial_demo_cta', {}); });

  // ---------- Reset ----------
  function reset() {
    gen++;
    A = answers();
    var me = firstName(); $('d-me').textContent = me || 'You'; paintAvatars(); paintLogo();
    buildMap();
    pts = []; closed = false; selected = []; stops = []; pdots = []; logged = 0; wins = 0; drawEnabled = true; choice = null;
    map.classList.add('drawable'); root.classList.remove('is-live'); prompt(true);
    $('d-modes').classList.remove('locked'); setMode('poly');
    $('d-count').classList.remove('show'); $('d-homes').textContent = '0'; $('d-contacts').textContent = '0';
    $('d-t2').textContent = '0'; $('d-t3').textContent = '0%';
    $('d-feed').innerHTML = ''; $('d-saved').textContent = '';
    $('d-opt').classList.remove('on'); $('d-opt').setAttribute('aria-pressed', 'false');
    $('d-progb').style.width = '0'; $('d-progt').textContent = '0 of ' + DOORS + ' logged';
    $('d-lists').innerHTML = ''; $('d-lists').appendChild(listCard('No lists yet', 0, 0, true)); $('d-nlists').textContent = '(0)';
    $('d-pmap').innerHTML = ''; $('d-stops').innerHTML = ''; $('d-start').disabled = true;
    $('d-done').classList.remove('on'); $('d-confetti').innerHTML = '';
    phone('home'); setStep(0);
  }
  // ---------- Back a step: rebuild the state at the previous step instantly ----------
  function goTo(n) {
    fast = true;
    try {
      reset();
      if (n >= 1 && savedPts) {
        pts = savedPts.slice(); closePoly(); createTurf();
        if (n >= 2) openRoute();
        if (n >= 3) { optimise(); openDoor(); }
      }
    } finally { fast = false; }
  }
  $('d-back').addEventListener('click', function () {
    var to = Math.max(0, curStep - 1);
    track('trial_demo_back', { demo_step: to + 1 });
    goTo(to);
    say('Back to step ' + (to + 1) + '.');
  });
  $('d-replay').addEventListener('click', function () { track('trial_demo_replay', {}); reset(); });

  // Prototype-only preview switcher
  document.querySelectorAll('[data-pv]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-pv').split('|');
      PV = { firstname: v[0], teamSize: v[1] };
      try { sessionStorage.setItem('ec_trial', JSON.stringify(PV)); } catch (e) {}
      document.querySelectorAll('[data-pv]').forEach(function (x) { x.classList.toggle('on', x === b); });
      reset();
    });
  });

  icons();
  reset();
  fit();
})();
