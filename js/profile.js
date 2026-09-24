(function () {
  const form = document.getElementById("profileForm");
  const favList = document.getElementById("favList");
  const saved = document.getElementById("saved");

  function load() {
    const p = Store.get("profile", {});
    ["name", "email", "city", "interest"].forEach(k => { if (p[k]) form.elements[k].value = p[k]; });
    form.elements.notify.checked = !!p.notify;
    form.elements.theme.value = Store.get("theme", "light");
    header(p.name);
  }

  function header(name) {
    document.getElementById("hello").textContent = name ? "Welcome, " + name.split(" ")[0] : "Your profile";
    document.getElementById("avatar").textContent = name ? name.trim()[0].toUpperCase() : "?";
  }

  function renderFavs() {
    const favs = Store.get("favs", []);
    favList.innerHTML = "";
    if (!favs.length) {
      favList.innerHTML = '<li>No saved clubs yet. Tap the heart on a club to save it.</li>';
      return;
    }
    favs.forEach(id => {
      const c = CLUBS.find(x => x.id === id);
      if (!c) return;
      const li = document.createElement("li");
      li.innerHTML = "<span><b>" + c.name + "</b><br><small>" + c.address + "</small></span>";
      const b = document.createElement("button");
      b.textContent = "Remove";
      b.onclick = () => { Store.set("favs", Store.get("favs", []).filter(x => x !== id)); renderFavs(); };
      li.appendChild(b);
      favList.appendChild(li);
    });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const f = form.elements;
    const p = { name: f.name.value, email: f.email.value, city: f.city.value, interest: f.interest.value, notify: f.notify.checked };
    Store.set("profile", p);
    Store.set("theme", f.theme.value);
    document.documentElement.dataset.theme = f.theme.value;
    header(p.name);
    saved.textContent = "Saved";
    setTimeout(() => (saved.textContent = ""), 2000);
  });

  load();
  renderFavs();
})();