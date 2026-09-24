# Miami Luxury Clubs

A premium interactive club discovery web demo focused on Miami's most exclusive private clubs.

## Features

* Interactive Mapbox map with smooth navigation
* Featured Miami club listings
* Hover over a club to automatically move the map to its location
* Interactive club markers and details
* Responsive desktop and mobile layouts
* AI Concierge with an interactive action-based interface
* User profile and settings page
* Local data architecture for easy expansion
* Modern luxury-focused UI and animations

## Featured Clubs

* The Bath Club
* The Surf Club
* Fisher Island Club
* Soho Beach House

## Tech Stack

* HTML5
* CSS3
* JavaScript (ES6+)
* Mapbox GL JS
* Lucide Icons
* LocalStorage

## Project Structure

```text
miami-clubs/
├── index.html
├── profile.html
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   ├── main.js
│   ├── profile.js
│   └── agent.js
└── README.md
```

## Running Locally

Clone the repository:

```bash
git clone https://github.com/Anasjadoon26/miami-clubs.git
cd miami-clubs
```

Start a local server:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Mapbox Setup

The interactive map requires a Mapbox access token.

Add your token where the Mapbox map is initialized in `js/main.js`.

## AI Concierge

The AI Concierge is designed as an action-oriented interface rather than a static chatbot.

It can be extended to perform actions such as:

* Navigate to a club
* Select a club
* Filter clubs
* Open club details
* Navigate to the profile
* Open settings

The current implementation is frontend-based and can later be connected to a real AI model and backend tools.

## Future Improvements

* Real AI/LLM integration
* Authentication
* Saved clubs
* Advanced club search and filters
* Database-backed club listings
* Membership information
* Real-time availability
* Voice concierge
* Additional cities and clubs

## License

This project is a demonstration project created for a web development contest.
