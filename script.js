(function () {
  "use strict";

  // ─── API CONFIG (replace with your keys) ──────────────────────────────────────
  const PLACES_API_KEY  = "AIzaSyAH9HQlTUKk5_YD-H70NTcN5He2hKHl0GM";
  const WEATHER_API_KEY = "b8fa402c14ea441994e195421260906";
  const MAPS_API_KEY    = "AIzaSyCde1vz95yFlnZn1l6fqt3JCPyjgv6jixI";

  // ─── Skeleton Loader Logic ─────────────────────────────────────────────────────
  const skeletonLoader  = document.getElementById("skeleton-loader");
  const mainContent     = document.getElementById("main-content");
  const loaderStartTime = Date.now();
  const MIN_LOAD_TIME   = 1000;

  function hideSkeletonAndShowContent() {
    const elapsed   = Date.now() - loaderStartTime;
    const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);
    setTimeout(() => {
      skeletonLoader.style.transition = "opacity 0.5s ease-out";
      skeletonLoader.style.opacity    = "0";
      mainContent.classList.remove("hidden");
      setTimeout(() => {
        mainContent.style.transition = "opacity 0.5s ease-out";
        mainContent.style.opacity    = "1";
      }, 50);
      setTimeout(() => { skeletonLoader.style.display = "none"; }, 500);
    }, remaining);
  }

  if (document.readyState === "complete") {
    hideSkeletonAndShowContent();
  } else {
    window.addEventListener("load", hideSkeletonAndShowContent);
  }

  // ─── DOM refs ────────────────────────────────────────────────────────────────
  const form             = document.getElementById("travelForm");
  const destinationInput = document.getElementById("destination");
  const daysInput        = document.getElementById("days");
  const budgetSelect     = document.getElementById("budget");
  const vibeSelect       = document.getElementById("vibe");
  const generateBtn      = document.getElementById("generateBtn");
  const resetBtn         = document.getElementById("resetBtn");
  const loading          = document.getElementById("loading");
  const errorEl          = document.getElementById("error");
  const results          = document.getElementById("results");
  const themeToggle      = document.getElementById("themeToggle");
  const sunIcon          = document.getElementById("sunIcon");
  const moonIcon         = document.getElementById("moonIcon");

  // ─── Constants ───────────────────────────────────────────────────────────────
  const categoryIcons = {
    sightseeing: "🏛️", food: "🍽️", adventure: "🧗", culture: "🎭",
    relaxation: "🧘", nightlife: "🌙", shopping: "🛍️", nature: "🌿",
    transport: "🚕", default: "📍",
  };

  const timeIcons = { Morning: "🌅", Afternoon: "☀️", Evening: "🌆", Night: "🌙" };

  const vibeDayColors = {
    Adventure:  { bg: "from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20",         dot: "bg-blue-500 dark:bg-blue-400",     text: "text-blue-600 dark:text-blue-300",    border: "day-accent-adventure" },
    Relaxation: { bg: "from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20", dot: "bg-purple-500 dark:bg-purple-400", text: "text-purple-600 dark:text-purple-300", border: "day-accent-relaxation" },
    Cultural:   { bg: "from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20", dot: "bg-emerald-500 dark:bg-emerald-400", text: "text-emerald-600 dark:text-emerald-300", border: "day-accent-cultural" },
    Romantic:   { bg: "from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-800/20",         dot: "bg-pink-500 dark:bg-pink-400",     text: "text-pink-600 dark:text-pink-300",    border: "day-accent-romantic" },
    Party:      { bg: "from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20", dot: "bg-orange-500 dark:bg-orange-400", text: "text-orange-600 dark:text-orange-300", border: "day-accent-party" },
  };

  const timePillColors = {
    Morning:   "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 dark:from-amber-900/40 dark:to-amber-800/30 dark:text-amber-300",
    Afternoon: "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 dark:from-orange-900/40 dark:to-orange-800/30 dark:text-orange-300",
    Evening:   "bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 dark:from-indigo-900/40 dark:to-indigo-800/30 dark:text-indigo-300",
    Night:     "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 dark:from-slate-700 dark:to-slate-600 dark:text-slate-300",
  };

  // ─── Security: sanitize strings ──────────────────────────────────────────────
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ─── Rate limiting ───────────────────────────────────────────────────────────
  let lastSubmitTime = 0;
  const SUBMIT_COOLDOWN_MS = 1000;

  // ─── Theme ───────────────────────────────────────────────────────────────────
  (function initTheme() {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    }
  })();

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    sunIcon.classList.toggle("hidden", isDark);
    moonIcon.classList.toggle("hidden", !isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // ─── Loading state helpers ────────────────────────────────────────────────────
  function showLoading() {
    loading.classList.remove("hidden");
    loading.classList.add("is-visible");
  }

  function hideLoading() {
    loading.classList.add("hidden");
    loading.classList.remove("is-visible");
  }

  // ─── LOCAL STORAGE ────────────────────────────────────────────────────────────
  const LS_KEY = "travelPlan";

  function saveToLocalStorage(destination, days, budget, vibe) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ destination, days, budget, vibe }));
    } catch (_) {}
  }

  function restoreFromLocalStorage() {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (!saved) return;
      const { destination, days, budget, vibe } = JSON.parse(saved);
      if (destination) destinationInput.value = destination;
      if (days)        daysInput.value        = days;
      if (budget)      budgetSelect.value     = budget;
      if (vibe)        vibeSelect.value       = vibe;
    } catch (_) {}
  }

  restoreFromLocalStorage();

  // ─── GOOGLE MAPS LOADER ───────────────────────────────────────────────────────
  let mapsLoaded = false;
  let mapsLoadingPromise = null;

  function loadGoogleMapsAPI() {
    if (mapsLoaded) return Promise.resolve();
    if (mapsLoadingPromise) return mapsLoadingPromise;

    mapsLoadingPromise = new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google && window.google.maps) {
        mapsLoaded = true;
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => { mapsLoaded = true; resolve(); };
      script.onerror = () => reject(new Error("Failed to load Google Maps API"));
      document.head.appendChild(script);
    });

    return mapsLoadingPromise;
  }

  // ─── FETCH PLACES (via Places JS SDK to avoid CORS) ──────────────────────────
  async function fetchPlaces(city) {
    await loadGoogleMapsAPI();

    return new Promise((resolve) => {
      const dummyDiv = document.createElement("div");
      const service  = new window.google.maps.places.PlacesService(dummyDiv);

      service.textSearch(
        { query: `top tourist attractions in ${city}` },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            const places = results.slice(0, 12).map((p) => ({
              name:     p.name || "Unknown Place",
              rating:   p.rating || null,
              address:  p.formatted_address || p.vicinity || "",
              placeId:  p.place_id || "",
              location: p.geometry?.location
                ? { lat: p.geometry.location.lat(), lng: p.geometry.location.lng() }
                : null,
            }));
            resolve(places);
          } else {
            console.warn("Places API status:", status);
            resolve([]); // Graceful fallback — don't block itinerary
          }
        }
      );
    });
  }

  // ─── FETCH WEATHER ────────────────────────────────────────────────────────────
  async function fetchWeather(city) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    const data = await res.json();
    return {
      temp_c:    data.current.temp_c,
      temp_f:    data.current.temp_f,
      condition: data.current.condition.text,
      icon:      "https:" + data.current.condition.icon,
      humidity:  data.current.humidity,
      wind_kph:  data.current.wind_kph,
      feelslike_c: data.current.feelslike_c,
    };
  }

  // ─── GOOGLE MAP RENDERER ──────────────────────────────────────────────────────
  async function renderMap(city, places) {
    await loadGoogleMapsAPI();

    // Find or create map container inside #results
    let mapContainer = document.getElementById("api-map-container");
    if (!mapContainer) return;

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: city }, (geoResults, status) => {
      if (status !== "OK" || !geoResults.length) {
        mapContainer.style.display = "none";
        return;
      }

      const center = geoResults[0].geometry.location;
      const map    = new window.google.maps.Map(mapContainer, {
        center,
        zoom:             13,
        mapTypeControl:   false,
        fullscreenControl: false,
        streetViewControl: false,
        styles: document.documentElement.classList.contains("dark") ? darkMapStyles : [],
      });

      // Add markers for each real place
      places.forEach((place) => {
        if (!place.location) return;
        const marker = new window.google.maps.Marker({
          position: place.location,
          map,
          title: place.name,
          animation: window.google.maps.Animation.DROP,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="font-family:Poppins,sans-serif;padding:4px 2px;max-width:200px;">
              <strong style="font-size:13px;">${escapeHtml(place.name)}</strong>
              ${place.rating ? `<div style="color:#f59e0b;font-size:12px;margin-top:2px;">⭐ ${place.rating}</div>` : ""}
              ${place.address ? `<div style="color:#6b7280;font-size:11px;margin-top:2px;">${escapeHtml(place.address)}</div>` : ""}
            </div>`,
        });

        marker.addListener("click", () => infoWindow.open(map, marker));
      });
    });
  }

  // ─── Dark map styles ──────────────────────────────────────────────────────────
  const darkMapStyles = [
    { elementType: "geometry",   stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill",   stylers: [{ color: "#746855" }] },
    { featureType: "road",        elementType: "geometry",           stylers: [{ color: "#38414e" }] },
    { featureType: "road",        elementType: "geometry.stroke",    stylers: [{ color: "#212a37" }] },
    { featureType: "road",        elementType: "labels.text.fill",   stylers: [{ color: "#9ca5b3" }] },
    { featureType: "water",       elementType: "geometry",           stylers: [{ color: "#17263c" }] },
    { featureType: "poi.park",    elementType: "geometry",           stylers: [{ color: "#263c3f" }] },
  ];

  // ─── BUILD ITINERARY from real places ────────────────────────────────────────
  function buildItineraryFromPlaces(destination, days, budget, vibe, places) {
    const themes = {
      Adventure:  ["Arrival & Adrenaline Rush","Nature Trail Exploration","Extreme Sports Day","Wildlife Safari","Water Sports Adventure","Mountain Trekking","Canyoning & Rappelling","Off-road Expedition"],
      Relaxation: ["Arrival & Spa Welcome","Beach Serenity","Wellness Retreat","Yoga & Meditation","Poolside Luxury","Sunset Cruise","Quiet Exploration","Mindful Morning"],
      Cultural:   ["Arrival & Heritage Walk","Museum & Gallery Tour","Temple & Monument Visit","Local Art Workshop","Cooking Class","Historical Landmarks","Traditional Performance","Market & Bazaar"],
      Romantic:   ["Arrival & Candlelight Dinner","Sunrise Couple Walk","Wine Tasting Tour","Private Beach Picnic","Sunset Boat Ride","Couples Spa","Stargazing Night","Farewell Brunch"],
      Party:      ["Arrival & Club Night","Pool Party","Bar Hopping","Beach Party","Festival Day","Rooftop Night","Karaoke & Fun","Farewell Bash"],
    };

    const timeSlots  = ["Morning", "Afternoon", "Evening"];
    const budgetMultiplier = budget === "Budget" ? 0.6 : budget === "Luxury" ? 2.5 : 1;
    const baseCost   = budget === "Budget" ? 15 : budget === "Luxury" ? 80 : 35;
    const selectedThemes = themes[vibe] || themes.Cultural;

    const itinerary = [];
    const placesPerDay = 3;

    for (let i = 0; i < Math.min(days, 8); i++) {
      const dayActivities = [];
      for (let slot = 0; slot < placesPerDay; slot++) {
        const placeIdx = (i * placesPerDay + slot) % Math.max(places.length, 1);
        const place    = places[placeIdx];
        const cost     = Math.round(baseCost * budgetMultiplier * (0.8 + Math.random() * 0.4));

        if (place) {
          dayActivities.push({
            time:        timeSlots[slot],
            title:       place.name,
            description: place.address
              ? `Visit this popular attraction in ${destination}. ${place.address}`
              : `Explore one of ${destination}'s top attractions.`,
            location:    place.address || destination,
            cost:        `$${cost}`,
            category:    "sightseeing",
            rating:      place.rating,
          });
        }
      }

      itinerary.push({
        day:        i + 1,
        theme:      selectedThemes[i % selectedThemes.length],
        activities: dayActivities,
      });
    }

    return { destination, total_days: days, budget, vibe, itinerary };
  }

  // ─── Mock data fallback ───────────────────────────────────────────────────────
  function generateMockItinerary(destination, days, budget, vibe) {
    const themes = {
      Adventure:  ["Arrival & Adrenaline Rush","Nature Trail Exploration","Extreme Sports Day","Wildlife Safari","Water Sports Adventure","Mountain Trekking","Canyoning & Rappelling","Off-road Expedition"],
      Relaxation: ["Arrival & Spa Welcome","Beach Serenity","Wellness Retreat","Yoga & Meditation","Poolside Luxury","Sunset Cruise","Quiet Exploration","Mindful Morning"],
      Cultural:   ["Arrival & Heritage Walk","Museum & Gallery Tour","Temple & Monument Visit","Local Art Workshop","Cooking Class","Historical Landmarks","Traditional Performance","Market & Bazaar"],
      Romantic:   ["Arrival & Candlelight Dinner","Sunrise Couple Walk","Wine Tasting Tour","Private Beach Picnic","Sunset Boat Ride","Couples Spa","Stargazing Night","Farewell Brunch"],
      Party:      ["Arrival & Club Night","Pool Party","Bar Hopping","Beach Party","Festival Day","Rooftop Night","Karaoke & Fun","Farewell Bash"],
    };

    const activitiesByVibe = {
      Adventure: [
        { time: "Morning",   title: "Skydiving Experience",  desc: "Tandem skydive over stunning landscapes",       loc: "Adventure Zone",   cost: "$199", cat: "adventure" },
        { time: "Afternoon", title: "White Water Rafting",   desc: "Navigate thrilling rapids with expert guides",  loc: "River Rapids",     cost: "$89",  cat: "adventure" },
        { time: "Evening",   title: "Campfire Dinner",       desc: "Cook under the stars with fellow adventurers",  loc: "Campsite",         cost: "$35",  cat: "food" },
        { time: "Morning",   title: "Hiking Expedition",     desc: "Guided trek through scenic mountain trails",    loc: "National Park",    cost: "$55",  cat: "nature" },
        { time: "Afternoon", title: "Zip-lining",            desc: "Soar through the canopy on a zip-line course",  loc: "Forest Canopy",    cost: "$65",  cat: "adventure" },
        { time: "Evening",   title: "Local Street Food",     desc: "Sample authentic local flavors",                loc: "City Center",      cost: "$20",  cat: "food" },
      ],
      Relaxation: [
        { time: "Morning",   title: "Beach Yoga",            desc: "Sunrise yoga session on the sand",              loc: "Beachfront",       cost: "$25",  cat: "relaxation" },
        { time: "Afternoon", title: "Spa Treatment",         desc: "Full body massage and aromatherapy",            loc: "Serenity Spa",     cost: "$120", cat: "relaxation" },
        { time: "Evening",   title: "Sunset Cocktails",      desc: "Handcrafted cocktails with ocean views",        loc: "Beach Bar",        cost: "$45",  cat: "relaxation" },
        { time: "Morning",   title: "Poolside Reading",      desc: "Relax by the infinity pool",                    loc: "Hotel Pool",       cost: "$0",   cat: "relaxation" },
        { time: "Afternoon", title: "Afternoon Tea",         desc: "Elegant tea service with pastries",             loc: "Garden Lounge",    cost: "$35",  cat: "food" },
        { time: "Evening",   title: "Beachside Dinner",      desc: "Fresh seafood with ocean breeze",               loc: "The Shore Restaurant", cost: "$75", cat: "food" },
      ],
      Cultural: [
        { time: "Morning",   title: "Guided Museum Tour",    desc: "Expert-led tour of the city's top museum",      loc: "City Museum",      cost: "$30",  cat: "culture" },
        { time: "Afternoon", title: "Heritage Walk",         desc: "Explore ancient streets and architecture",      loc: "Old Town",         cost: "$20",  cat: "culture" },
        { time: "Evening",   title: "Traditional Show",      desc: "Live folk music and dance performance",         loc: "Cultural Hall",    cost: "$50",  cat: "culture" },
        { time: "Morning",   title: "Cooking Workshop",      desc: "Learn to cook traditional dishes",              loc: "Local Kitchen",    cost: "$60",  cat: "food" },
        { time: "Afternoon", title: "Temple Visit",          desc: "Guided tour of historic temples",               loc: "Temple Complex",   cost: "$15",  cat: "culture" },
        { time: "Evening",   title: "Night Market",          desc: "Browse local crafts and street food",           loc: "Night Bazaar",     cost: "$25",  cat: "shopping" },
      ],
      Romantic: [
        { time: "Morning",   title: "Sunrise Hot Air Balloon", desc: "Float above the landscape at dawn",          loc: "Balloon Launch Site", cost: "$250", cat: "adventure" },
        { time: "Afternoon", title: "Couples Spa",           desc: "Side-by-side massage treatment",               loc: "Luxury Spa",       cost: "$180", cat: "relaxation" },
        { time: "Evening",   title: "Candlelight Dinner",    desc: "Private dinner under the stars",               loc: "Rooftop Terrace",  cost: "$120", cat: "food" },
        { time: "Morning",   title: "Beach Walk",            desc: "Hand-in-hand stroll along the shore",          loc: "Private Beach",    cost: "$0",   cat: "nature" },
        { time: "Afternoon", title: "Wine Tasting",          desc: "Sample premium local wines",                   loc: "Vineyard Estate",  cost: "$70",  cat: "culture" },
        { time: "Evening",   title: "Sunset Cruise",         desc: "Private boat ride at golden hour",             loc: "Harbor",           cost: "$150", cat: "relaxation" },
      ],
      Party: [
        { time: "Morning",   title: "Brunch Club",           desc: "Bottomless brunch at a trendy spot",           loc: "The Brunch Club",  cost: "$40",  cat: "food" },
        { time: "Afternoon", title: "Pool Party",            desc: "DJ sets and cocktails by the pool",            loc: "Rooftop Pool",     cost: "$30",  cat: "nightlife" },
        { time: "Evening",   title: "Club Night",            desc: "VIP entry to hottest nightclub",               loc: "Neon Club",        cost: "$80",  cat: "nightlife" },
        { time: "Morning",   title: "Beach Volleyball",      desc: "Fun beach sports with music",                  loc: "Beach Court",      cost: "$10",  cat: "adventure" },
        { time: "Afternoon", title: "Shopping Spree",        desc: "Hit the best boutiques and malls",             loc: "Fashion District", cost: "$200", cat: "shopping" },
        { time: "Evening",   title: "Karaoke Night",         desc: "Sing your heart out with friends",             loc: "K Box Lounge",     cost: "$35",  cat: "nightlife" },
      ],
    };

    const selectedThemes     = themes[vibe]           || themes.Cultural;
    const selectedActivities = activitiesByVibe[vibe] || activitiesByVibe.Cultural;
    const budgetMultiplier   = budget === "Budget" ? 0.6 : budget === "Luxury" ? 2.5 : 1;

    const itinerary = [];
    for (let i = 0; i < Math.min(days, 8); i++) {
      const activitiesCount = budget === "Budget" ? 2 : 3;
      const dayActivities   = [];
      for (let a = 0; a < activitiesCount; a++) {
        const base    = selectedActivities[(i * 3 + a) % selectedActivities.length];
        const costVal = parseFloat(base.cost.replace("$", ""));
        dayActivities.push({
          time:        a === 0 ? "Morning" : a === 1 ? "Afternoon" : "Evening",
          title:       base.title,
          description: base.desc,
          location:    base.loc,
          cost:        `$${Math.round(costVal * budgetMultiplier)}`,
          category:    base.cat,
        });
      }
      itinerary.push({ day: i + 1, theme: selectedThemes[i % selectedThemes.length], activities: dayActivities });
    }

    return { destination, total_days: days, budget, vibe, itinerary };
  }

  // ─── WEATHER CARD HTML ────────────────────────────────────────────────────────
  function buildWeatherHTML(weather, city) {
    return `
      <div id="api-weather-card"
           class="bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/20
                  rounded-2xl p-5 mb-6 flex items-center gap-5 card-lift"
           style="animation:fadeInUp 0.3s ease-out both;">
        <img src="${escapeHtml(weather.icon)}" alt="${escapeHtml(weather.condition)}" class="w-14 h-14" />
        <div class="flex-1 min-w-0">
          <p class="font-bold text-gray-800 dark:text-white text-lg">
            ${escapeHtml(city)} — Live Weather
          </p>
          <p class="text-sky-600 dark:text-sky-300 font-semibold text-sm">${escapeHtml(weather.condition)}</p>
        </div>
        <div class="text-right shrink-0">
          <p class="text-3xl font-extrabold text-gray-800 dark:text-white">${weather.temp_c}°C</p>
          <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">
            💧 ${weather.humidity}% &nbsp;|&nbsp; 💨 ${weather.wind_kph} km/h
          </p>
          <p class="text-xs text-gray-400 dark:text-slate-500">Feels like ${weather.feelslike_c}°C</p>
        </div>
      </div>`;
  }

  // ─── MAP CONTAINER HTML ───────────────────────────────────────────────────────
  function buildMapHTML() {
    return `
      <div id="api-map-container"
           class="w-full rounded-2xl overflow-hidden mb-8 card-lift"
           style="height:320px; animation:fadeInUp 0.3s ease-out 0.1s both;">
      </div>`;
  }

  // ─── RENDER ITINERARY ─────────────────────────────────────────────────────────
  function renderItinerary(data, weather) {
    const vibeColors = vibeDayColors[data.vibe] || vibeDayColors.Cultural;
    const dest       = escapeHtml(data.destination);
    const budget     = escapeHtml(data.budget);
    const vibe       = escapeHtml(data.vibe);
    const dayWord    = (n) => `${n} day${n > 1 ? "s" : ""}`;

    let html = "";

    // Weather card (real data if available)
    if (weather) html += buildWeatherHTML(weather, data.destination);

    // Map container
    html += buildMapHTML();

    // Trip header
    html += `
      <div class="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800/60 dark:to-slate-800/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-8 card-lift">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-gradient-to-br ${vibeColors.bg} flex items-center justify-center text-3xl" aria-hidden="true">🌍</div>
            <div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white">${dest}</h2>
              <p class="text-gray-600 dark:text-slate-400 mt-1 text-sm sm:text-base">
                ${dayWord(data.total_days)} &middot; ${budget} &middot; ${vibe}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-400
                      bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700
                      px-5 py-3 rounded-xl w-fit">
            <span aria-hidden="true">🗓️</span>
            <span class="font-semibold">${dayWord(data.itinerary.length)} planned</span>
          </div>
        </div>
      </div>
      <div class="itinerary-scroll space-y-6 pr-2">`;

    data.itinerary.forEach((day, idx) => {
      const colors   = vibeDayColors[data.vibe] || vibeDayColors.Cultural;
      const dayTheme = escapeHtml(day.theme);

      html += `
        <div class="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800/60 dark:to-slate-800/30
                    rounded-2xl sm:rounded-3xl overflow-hidden card-lift ${colors.border}"
             style="animation:fadeInUp 0.3s ease-out ${idx * 0.08}s both;">
          <div class="p-6 sm:p-7">
            <div class="flex items-center gap-5 mb-6">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center
                          justify-center font-extrabold text-xl ${colors.text}"
                   aria-label="Day ${day.day}">${day.day}</div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-xl sm:text-2xl text-gray-800 dark:text-white">Day ${day.day}</h3>
                <p class="text-sm ${colors.text} font-semibold truncate">${dayTheme}</p>
              </div>
            </div>
            <div class="space-y-5">
              ${day.activities.map((act, actIdx) => {
                const title   = escapeHtml(act.title);
                const desc    = escapeHtml(act.description);
                const loc     = escapeHtml(act.location);
                const cost    = escapeHtml(act.cost);
                const cat     = escapeHtml(act.category || "sightseeing");
                const catIcon = categoryIcons[act.category] || categoryIcons.default;
                const tIcon   = timeIcons[act.time] || "📍";
                const tPill   = timePillColors[act.time] || "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 dark:from-slate-700 dark:to-slate-600 dark:text-slate-300";
                const ratingBadge = act.rating
                  ? `<span class="text-xs text-amber-500 font-bold ml-2">⭐ ${act.rating}</span>`
                  : "";
                return `
                <div class="relative pl-16">
                  ${actIdx < day.activities.length - 1
                    ? `<div class="absolute left-[26px] top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700" aria-hidden="true"></div>`
                    : ""}
                  <div class="absolute left-[16px] top-2 w-[20px] h-[20px] rounded-full ${colors.dot}
                              border-2 border-white dark:border-slate-800" aria-hidden="true"></div>
                  <div class="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 rounded-xl p-5">
                    <div class="flex items-center gap-3 mb-3 flex-wrap">
                      <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${tPill}">
                        <span aria-hidden="true">${tIcon}</span> ${escapeHtml(act.time)}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-slate-500 font-medium">
                        <span aria-hidden="true">${catIcon}</span> ${cat}
                      </span>
                    </div>
                    <p class="font-bold text-gray-800 dark:text-white text-base sm:text-lg">
                      ${title}${ratingBadge}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-slate-400 mt-2 leading-relaxed">${desc}</p>
                    <div class="flex items-center gap-5 mt-4 text-sm text-gray-500 dark:text-slate-500 font-medium">
                      <span class="inline-flex items-center gap-2"><span aria-hidden="true">📍</span> ${loc}</span>
                      <span class="inline-flex items-center gap-2"><span aria-hidden="true">💰</span> ${cost}</span>
                    </div>
                  </div>
                </div>`;
              }).join("")}
            </div>
          </div>
        </div>`;
    });

    html += `</div>`;

    requestAnimationFrame(() => {
      results.innerHTML = html;
      results.classList.remove("hidden");
      results.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // ─── FORM SUBMIT ──────────────────────────────────────────────────────────────
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) return;
    lastSubmitTime = now;

    errorEl.classList.add("hidden");
    results.classList.add("hidden");
    results.innerHTML = "";

    const destination = destinationInput.value.trim();
    const days        = parseInt(daysInput.value, 10);
    const budget      = budgetSelect.value;
    const vibe        = vibeSelect.value;

    const allowedBudgets = ["Budget", "Mid-range", "Luxury"];
    const allowedVibes   = ["Adventure", "Relaxation", "Cultural", "Romantic", "Party"];

    if (!destination || destination.length > 200) {
      showError("Please enter a valid destination (max 200 characters).");
      return;
    }
    if (isNaN(days) || days < 1 || days > 30) {
      showError("Please enter a valid number of days (1–30).");
      return;
    }
    if (!allowedBudgets.includes(budget) || !allowedVibes.includes(vibe)) {
      showError("Invalid form values. Please refresh and try again.");
      return;
    }

    // Save to localStorage
    saveToLocalStorage(destination, days, budget, vibe);

    showLoading();
    generateBtn.disabled = true;

    try {
      // Load Maps API early (non-blocking for other fetches)
      loadGoogleMapsAPI().catch(() => {});

      // Fetch weather + places in parallel
      const [weather, places] = await Promise.allSettled([
        fetchWeather(destination),
        fetchPlaces(destination),
      ]);

      const weatherData = weather.status === "fulfilled" ? weather.value : null;
      const placesData  = places.status  === "fulfilled" ? places.value  : [];

      if (weather.status === "rejected") console.warn("Weather fetch failed:", weather.reason);
      if (places.status  === "rejected") console.warn("Places fetch failed:",  places.reason);

      // Build itinerary — use real places if available, fallback to mock
      const itineraryData = placesData.length > 0
        ? buildItineraryFromPlaces(destination, days, budget, vibe, placesData)
        : generateMockItinerary(destination, days, budget, vibe);

      hideLoading();
      renderItinerary(itineraryData, weatherData);

      // Render map after DOM is ready
      if (placesData.length > 0) {
        setTimeout(() => renderMap(destination, placesData), 300);
      } else {
        // Hide empty map container if no places data
        setTimeout(() => {
          const mapEl = document.getElementById("api-map-container");
          if (mapEl) mapEl.style.display = "none";
        }, 300);
      }

    } catch (err) {
      console.error("Itinerary generation failed:", err);
      hideLoading();
      showError("Failed to load data. Please try again.");

      // Fallback to mock
      try {
        const mockData = generateMockItinerary(destination, days, budget, vibe);
        renderItinerary(mockData, null);
      } catch (_) {}
    } finally {
      generateBtn.disabled = false;
    }
  });

  // ─── RESET ────────────────────────────────────────────────────────────────────
  resetBtn.addEventListener("click", () => {
    form.reset();
    results.classList.add("hidden");
    errorEl.classList.add("hidden");
    results.innerHTML = "";
    daysInput.value = 3;
    destinationInput.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
    try { localStorage.removeItem(LS_KEY); } catch (_) {}
  });

  // ─── ERROR HELPER ─────────────────────────────────────────────────────────────
  function showError(msg) {
    errorEl.textContent = "⚠️ " + msg;
    errorEl.classList.remove("hidden");
  }

  // ─── DEBOUNCE UTILITY ─────────────────────────────────────────────────────────
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // ─── INITIAL FOCUS ────────────────────────────────────────────────────────────
  destinationInput.focus();
})();