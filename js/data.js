// Coordinates are approximate (street-address level). Edit freely.
window.CLUBS = [
  {
    id: "bath", name: "The Bath Club", short: "Bath",
    address: "5937 Collins Ave, Miami Beach, FL 33140",
    lat: 25.8384, lng: -80.1221,
    tag: "Oceanfront", color: "#1F7A72",
    blurb: "Historic oceanfront social club with pool, beach and dining."
  },
  {
    id: "surf", name: "The Surf Club", short: "Surf",
    address: "9011 Collins Ave, Surfside, FL 33154",
    lat: 25.8797, lng: -80.1224,
    tag: "Landmark", color: "#B08D57",
    blurb: "Storied 1930s beach club reimagined with resort-style amenities."
  },
  {
    id: "fisher", name: "Fisher Island Club", short: "Fisher",
    address: "1 Fisher Island Dr, Miami Beach, FL 33109",
    lat: 25.7615, lng: -80.1446,
    tag: "Private island", color: "#2B5F8A",
    blurb: "Members' club on a private island reached by ferry."
  },
  {
    id: "soho", name: "Soho Beach House", short: "Soho",
    address: "4385 Collins Ave, Miami Beach, FL 33140",
    lat: 25.8146, lng: -80.1221,
    tag: "Members club", color: "#7A3E5C",
    blurb: "Beachfront members' house with rooms, pool, spa and restaurants."
  }
];

// Shared helpers used by every page
window.Store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
document.documentElement.dataset.theme = Store.get("theme", "light");