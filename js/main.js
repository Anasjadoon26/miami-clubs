(function () {
  const map = L.map("map", { zoomControl: true, scrollWheelZoom: true }).setView([25.82, -80.13], 11);

  const layers = {
    street: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: "&copy; OpenStreetMap contributors"
    }),
    satellite: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19, attribution: "Tiles &copy; Esri"
    })
  };
  let current = "street";
  layers.street.addTo(map);

  const markers = {};
  const list = document.getElementById("clubList");
  let favs = Store.get("favs", []);
  let active = null, timer = null;

  function pinIcon() {
    return L.divIcon({ className: "", html: '<div class="pin"></div>', iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -34] });
  }

  CLUBS.forEach(c => {
    const m = L.marker([c.lat, c.lng], { icon: pinIcon(), title: c.name }).addTo(map);
    m.bindPopup("<strong>" + c.name + "</strong><br>" + c.address);
    m.on("click", () => focus(c.id));
    markers[c.id] = m;

    const li = document.createElement("li");
    li.className = "club";
    li.dataset.id = c.id;
    li.tabIndex = 0;
    li.innerHTML =
      '<div class="thumb" style="background:linear-gradient(135deg,' + c.color + ',#10222B)">' + c.short[0] + "</div>" +
      "<div><h3>" + c.name + '</h3><div class="addr">' + c.address + '</div><p class="blurb">' + c.blurb +
      '</p><span class="tag">' + c.tag + "</span></div>" +
      '<button class="fav" type="button" aria-label="Save ' + c.name + '"></button>';
    li.addEventListener("mouseenter", () => { clearTimeout(timer); timer = setTimeout(() => focus(c.id), 120); });
    li.addEventListener("mouseleave", () => clearTimeout(timer));
    li.addEventListener("click", () => focus(c.id));
    li.addEventListener("keydown", e => { if (e.key === "Enter") focus(c.id); });
    li.querySelector(".fav").addEventListener("click", e => { e.stopPropagation(); toggleFav(c.id); });
    list.appendChild(li);
  });

  function renderFavs() {
    list.querySelectorAll(".club").forEach(li => {
      li.querySelector(".fav").textContent = favs.includes(li.dataset.id) ? "\u2665" : "\u2661";
    });
  }

  function focus(id) {
    const c = CLUBS.find(x => x.id === id);
    if (!c || active === id) { if (c) markers[id].openPopup(); return; }
    active = id;
    list.querySelectorAll(".club").forEach(li => li.classList.toggle("on", li.dataset.id === id));
    Object.entries(markers).forEach(([k, m]) => m.getElement().firstChild.classList.toggle("on", k === id));
    map.flyTo([c.lat, c.lng], 16, { duration: 1.2 });
    map.once("moveend", () => markers[id].openPopup());
  }

  function reset() {
    active = null;
    map.closePopup();
    list.querySelectorAll(".club").forEach(li => li.classList.remove("on"));
    Object.values(markers).forEach(m => m.getElement().firstChild.classList.remove("on"));
    map.flyToBounds(L.latLngBounds(CLUBS.map(c => [c.lat, c.lng])).pad(0.3), { duration: 1.2 });
  }

  function setLayer(name) {
    if (!layers[name] || name === current) return;
    map.removeLayer(layers[current]);
    layers[name].addTo(map);
    current = name;
    document.getElementById("btnLayer").textContent = name === "street" ? "Satellite" : "Street";
  }

  function toggleFav(id) {
    favs = favs.includes(id) ? favs.filter(x => x !== id) : favs.concat(id);
    Store.set("favs", favs);
    renderFavs();
    return favs.includes(id);
  }

  document.getElementById("btnReset").addEventListener("click", reset);
  document.getElementById("btnLayer").addEventListener("click", () => setLayer(current === "street" ? "satellite" : "street"));

  renderFavs();
  reset();

  window.ClubMap = {
    focus, reset, setLayer, toggleFav,
    zoom: d => map.setZoom(map.getZoom() + d)
  };
})();