// "Concierge" agent: a rule-based assistant in a suit and tie.
// To connect a real LLM later, replace handle() with a call to your backend.
(function () {
  const AVATAR =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<rect width="64" height="64" fill="#E9EEF0"/>' +
    '<path d="M6 64c2-14 12-18 26-18s24 4 26 18z" fill="#14232C"/>' +               // suit jacket
    '<path d="M24 46l8 10 8-10-3-3H27z" fill="#fff"/>' +                             // shirt
    '<path d="M28 44l4 3 4-3-1 4 2 14-5 2-5-2 2-14z" fill="#B3262E"/>' +              // tie
    '<path d="M22 47l10 17-14 0z M42 47L32 64h14z" fill="#0D1A21"/>' +               // lapels
    '<rect x="28" y="36" width="8" height="9" rx="3" fill="#E0B592"/>' +             // neck
    '<ellipse cx="32" cy="26" rx="11" ry="13" fill="#EBC3A0"/>' +                    // head
    '<path d="M20 24c0-10 7-14 13-14 7 0 11 5 11 13-3-5-8-7-13-6-5 0-9 2-11 7z" fill="#2A211C"/>' + // hair
    '<circle cx="27.5" cy="27" r="1.4" fill="#222"/><circle cx="36.5" cy="27" r="1.4" fill="#222"/>' +
    '<path d="M28 33q4 3 8 0" stroke="#8A4B3A" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
    "</svg>";

  const fab = document.createElement("button");
  fab.className = "agent-fab";
  fab.setAttribute("aria-label", "Open concierge assistant");
  fab.innerHTML = AVATAR;

  const panel = document.createElement("div");
  panel.className = "agent-panel";
  panel.innerHTML =
    '<div class="agent-head">' + AVATAR + "<div><b>Concierge</b><small>Ask me to do things for you</small></div></div>" +
    '<div class="agent-log" aria-live="polite"></div>' +
    '<div class="chips"></div>' +
    '<form class="agent-form"><input placeholder="Try: take me to Soho Beach House" aria-label="Message"><button>Send</button></form>';
  document.body.append(panel, fab);

  const log = panel.querySelector(".agent-log");
  const input = panel.querySelector("input");
  const chips = panel.querySelector(".chips");
  const hasMap = () => !!window.ClubMap;

  function say(text, who) {
    const d = document.createElement("div");
    d.className = "msg " + (who || "bot");
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }

  function findClub(t) {
    return CLUBS.find(c => t.includes(c.short.toLowerCase()) || t.includes(c.name.toLowerCase()));
  }

  function needMap(fn) {
    if (hasMap()) return fn();
    say("That works on the map page. Taking you there.");
    setTimeout(() => (location.href = "index.html"), 900);
  }

  function handle(raw) {
    const t = raw.toLowerCase();
    const club = findClub(t);

    if (/dark|night/.test(t)) return setTheme("dark");
    if (/light|day mode/.test(t)) return setTheme("light");
    if (/profile|settings|account/.test(t)) { say("Opening your profile."); return go("profile.html"); }
    if (/^(home|explore)|back to (the )?map|go home/.test(t)) { say("Back to the map."); return go("index.html"); }

    if (/satellite|aerial/.test(t)) return needMap(() => { ClubMap.setLayer("satellite"); say("Satellite view on."); });
    if (/street|default map/.test(t)) return needMap(() => { ClubMap.setLayer("street"); say("Street view on."); });
    if (/zoom in/.test(t)) return needMap(() => { ClubMap.zoom(1); say("Zoomed in."); });
    if (/zoom out/.test(t)) return needMap(() => { ClubMap.zoom(-1); say("Zoomed out."); });
    if (/reset|show all|overview|all clubs/.test(t)) return needMap(() => { ClubMap.reset(); say("Showing all four clubs."); });

    if (/list|which clubs|what clubs/.test(t)) return say("Featured: " + CLUBS.map(c => c.name).join(", ") + ".");

    if (club && /direction|route|navigate/.test(t)) {
      say("Opening directions to " + club.name + ".");
      return window.open("https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(club.address), "_blank");
    }
    if (club && /save|favou?rite|heart/.test(t)) {
      const favs = Store.get("favs", []);
      const on = hasMap() ? ClubMap.toggleFav(club.id) : (Store.set("favs", favs.includes(club.id) ? favs : favs.concat(club.id)), true);
      return say(on ? "Saved " + club.name + " to your profile." : "Removed " + club.name + " from your saved clubs.");
    }
    if (club) return needMap(() => { ClubMap.focus(club.id); say("Flying to " + club.name + "."); });

    say("I can fly to a club, show satellite or street view, zoom, save favorites, get directions, switch dark mode, or open your profile.");
  }

  function go(url) { setTimeout(() => (location.href = url), 700); }
  function setTheme(v) {
    Store.set("theme", v);
    document.documentElement.dataset.theme = v;
    say(v === "dark" ? "Dark mode on." : "Light mode on.");
  }

  ["Take me to Soho Beach House", "Satellite view", "Save The Surf Club", "Open my profile"].forEach(s => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = s;
    b.onclick = () => { say(s, "me"); handle(s); };
    chips.appendChild(b);
  });

  panel.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    say(v, "me");
    input.value = "";
    handle(v);
  });

  fab.addEventListener("click", () => {
    panel.classList.toggle("open");
    if (panel.classList.contains("open") && !log.children.length) {
      const n = (Store.get("profile", {}).name || "").split(" ")[0];
      say("Good day" + (n ? ", " + n : "") + ". How may I assist?");
    }
    if (panel.classList.contains("open")) input.focus();
  });
})();