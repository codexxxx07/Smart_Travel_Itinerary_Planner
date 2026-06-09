(function () {
  const form = document.getElementById("travelForm");
  const destinationInput = document.getElementById("destination");
  const daysInput = document.getElementById("days");
  const budgetSelect = document.getElementById("budget");
  const vibeSelect = document.getElementById("vibe");
  const generateBtn = document.getElementById("generateBtn");
  const resetBtn = document.getElementById("resetBtn");
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const results = document.getElementById("results");
  const themeToggle = document.getElementById("themeToggle");
  const sunIcon = document.getElementById("sunIcon");
  const moonIcon = document.getElementById("moonIcon");

  const categoryIcons = {
    sightseeing: "🏛️",
    food: "🍽️",
    adventure: "🧗",
    culture: "🎭",
    relaxation: "🧘",
    nightlife: "🌙",
    shopping: "🛍️",
    nature: "🌿",
    transport: "🚕",
    default: "📍",
  };

  const timeIcons = {
    Morning: "🌅",
    Afternoon: "☀️",
    Evening: "🌆",
    Night: "🌙",
  };

  // Theme
  const stored = localStorage.getItem("theme");
  if (stored === "dark") {
    document.documentElement.classList.add("dark");
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  }

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    sunIcon.classList.toggle("hidden", isDark);
    moonIcon.classList.toggle("hidden", !isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // Mock data generator
  function generateMockItinerary(destination, days, budget, vibe) {
    const themes = {
      Adventure: [
        "Arrival & Adrenaline Rush",
        "Nature Trail Exploration",
        "Extreme Sports Day",
        "Wildlife Safari",
        "Water Sports Adventure",
        "Mountain Trekking",
        "Canyoning & Rappelling",
        "Off-road Expedition",
      ],
      Relaxation: [
        "Arrival & Spa Welcome",
        "Beach Serenity",
        "Wellness Retreat",
        "Yoga & Meditation",
        "Poolside Luxury",
        "Sunset Cruise",
        "Quiet Exploration",
        "Mindful Morning",
      ],
      Cultural: [
        "Arrival & Heritage Walk",
        "Museum & Gallery Tour",
        "Temple & Monument Visit",
        "Local Art Workshop",
        "Cooking Class",
        "Historical Landmarks",
        "Traditional Performance",
        "Market & Bazaar",
      ],
      Romantic: [
        "Arrival & Candlelight Dinner",
        "Sunrise Couple Walk",
        "Wine Tasting Tour",
        "Private Beach Picnic",
        "Sunset Boat Ride",
        "Couples Spa",
        "Stargazing Night",
        "Farewell Brunch",
      ],
      Party: [
        "Arrival & Club Night",
        "Pool Party",
        "Bar Hopping",
        "Beach Party",
        "Festival Day",
        "Rooftop Night",
        "Karaoke & Fun",
        "Farewell Bash",
      ],
    };

    const activitiesByVibe = {
      Adventure: [
        { time: "Morning", title: "Skydiving Experience", desc: "Tandem skydive over stunning landscapes", loc: "Adventure Zone", cost: "$199", cat: "adventure" },
        { time: "Afternoon", title: "White Water Rafting", desc: "Navigate thrilling rapids with expert guides", loc: "River Rapids", cost: "$89", cat: "adventure" },
        { time: "Evening", title: "Campfire Dinner", desc: "Cook under the stars with fellow adventurers", loc: "Campsite", cost: "$35", cat: "food" },
        { time: "Morning", title: "Hiking Expedition", desc: "Guided trek through scenic mountain trails", loc: "National Park", cost: "$55", cat: "nature" },
        { time: "Afternoon", title: "Zip-lining", desc: "Soar through the canopy on a zip-line course", loc: "Forest Canopy", cost: "$65", cat: "adventure" },
        { time: "Evening", title: "Local Street Food", desc: "Sample authentic local flavors", loc: "City Center", cost: "$20", cat: "food" },
      ],
      Relaxation: [
        { time: "Morning", title: "Beach Yoga", desc: "Sunrise yoga session on the sand", loc: "Beachfront", cost: "$25", cat: "relaxation" },
        { time: "Afternoon", title: "Spa Treatment", desc: "Full body massage and aromatherapy", loc: "Serenity Spa", cost: "$120", cat: "relaxation" },
        { time: "Evening", title: "Sunset Cocktails", desc: "Handcrafted cocktails with ocean views", loc: "Beach Bar", cost: "$45", cat: "relaxation" },
        { time: "Morning", title: "Poolside Reading", desc: "Relax by the infinity pool", loc: "Hotel Pool", cost: "$0", cat: "relaxation" },
        { time: "Afternoon", title: "Afternoon Tea", desc: "Elegant tea service with pastries", loc: "Garden Lounge", cost: "$35", cat: "food" },
        { time: "Evening", title: "Beachside Dinner", desc: "Fresh seafood with ocean breeze", loc: "The Shore Restaurant", cost: "$75", cat: "food" },
      ],
      Cultural: [
        { time: "Morning", title: "Guided Museum Tour", desc: "Expert-led tour of the city's top museum", loc: "City Museum", cost: "$30", cat: "culture" },
        { time: "Afternoon", title: "Heritage Walk", desc: "Explore ancient streets and architecture", loc: "Old Town", cost: "$20", cat: "culture" },
        { time: "Evening", title: "Traditional Show", desc: "Live folk music and dance performance", loc: "Cultural Hall", cost: "$50", cat: "culture" },
        { time: "Morning", title: "Cooking Workshop", desc: "Learn to cook traditional dishes", loc: "Local Kitchen", cost: "$60", cat: "food" },
        { time: "Afternoon", title: "Temple Visit", desc: "Guided tour of historic temples", loc: "Temple Complex", cost: "$15", cat: "culture" },
        { time: "Evening", title: "Night Market", desc: "Browse local crafts and street food", loc: "Night Bazaar", cost: "$25", cat: "shopping" },
      ],
      Romantic: [
        { time: "Morning", title: "Sunrise Hot Air Balloon", desc: "Float above the landscape at dawn", loc: "Balloon Launch Site", cost: "$250", cat: "adventure" },
        { time: "Afternoon", title: "Couples Spa", desc: "Side-by-side massage treatment", loc: "Luxury Spa", cost: "$180", cat: "relaxation" },
        { time: "Evening", title: "Candlelight Dinner", desc: "Private dinner under the stars", loc: "Rooftop Terrace", cost: "$120", cat: "food" },
        { time: "Morning", title: "Beach Walk", desc: "Hand-in-hand stroll along the shore", loc: "Private Beach", cost: "$0", cat: "nature" },
        { time: "Afternoon", title: "Wine Tasting", desc: "Sample premium local wines", loc: "Vineyard Estate", cost: "$70", cat: "culture" },
        { time: "Evening", title: "Sunset Cruise", desc: "Private boat ride at golden hour", loc: "Harbor", cost: "$150", cat: "relaxation" },
      ],
      Party: [
        { time: "Morning", title: "Brunch Club", desc: "Bottomless brunch at a trendy spot", loc: "The Brunch Club", cost: "$40", cat: "food" },
        { time: "Afternoon", title: "Pool Party", desc: "DJ sets and cocktails by the pool", loc: "Rooftop Pool", cost: "$30", cat: "nightlife" },
        { time: "Evening", title: "Club Night", desc: "VIP entry to hottest nightclub", loc: "Neon Club", cost: "$80", cat: "nightlife" },
        { time: "Morning", title: "Beach Volleyball", desc: "Fun beach sports with music", loc: "Beach Court", cost: "$10", cat: "adventure" },
        { time: "Afternoon", title: "Shopping Spree", desc: "Hit the best boutiques and malls", loc: "Fashion District", cost: "$200", cat: "shopping" },
        { time: "Evening", title: "Karaoke Night", desc: "Sing your heart out with friends", loc: "K Box Lounge", cost: "$35", cat: "nightlife" },
      ],
    };

    const selectedThemes = themes[vibe] || themes.Cultural;
    const selectedActivities = activitiesByVibe[vibe] || activitiesByVibe.Cultural;
    const budgetMultiplier = budget === "Budget" ? 0.6 : budget === "Luxury" ? 2.5 : 1;

    const itinerary = [];
    for (let i = 0; i < Math.min(days, 8); i++) {
      const dayActivities = [];
      const activitiesCount = budget === "Budget" ? 2 : 3;

      for (let a = 0; a < activitiesCount; a++) {
        const base = selectedActivities[(i * 3 + a) % selectedActivities.length];
        const costVal = parseFloat(base.cost.replace("$", ""));
        const adjustedCost = Math.round(costVal * budgetMultiplier);
        dayActivities.push({
          time: a === 0 ? "Morning" : a === 1 ? "Afternoon" : "Evening",
          title: base.title,
          description: base.desc,
          location: base.loc,
          cost: `$${adjustedCost}`,
          category: base.cat,
          icon_hint: base.cat,
        });
      }

      itinerary.push({
        day: i + 1,
        theme: selectedThemes[i % selectedThemes.length],
        activities: dayActivities,
      });
    }

    return {
      destination,
      total_days: days,
      budget,
      vibe,
      itinerary,
    };
  }

  // Render itinierary
  function renderItinerary(data) {
    results.classList.remove("hidden");
    results.innerHTML = "";

    const summary = document.createElement("div");
    summary.className =
      "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl p-6 mb-6 border border-blue-100 dark:border-slate-700 animate-fade-in";
    summary.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">${data.destination}</h2>
          <p class="text-gray-500 dark:text-slate-400 mt-1">
            ${data.total_days} day${data.total_days > 1 ? "s" : ""} · ${data.budget} · ${data.vibe}
          </p>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 bg-white/60 dark:bg-slate-700/40 px-4 py-2 rounded-xl">
          <span>🗓️</span>
          <span>${data.itinerary.length} day${data.itinerary.length > 1 ? "s" : ""} planned</span>
        </div>
      </div>
    `;
    results.appendChild(summary);

    const scrollWrapper = document.createElement("div");
    scrollWrapper.className = "itinerary-scroll space-y-5 pr-1";
    results.appendChild(scrollWrapper);

    data.itinerary.forEach((day, idx) => {
      const card = document.createElement("div");
      card.className =
        "bg-white dark:glass-dark dark:bg-slate-800/40 rounded-2xl shadow-lg dark:shadow-cyan-900/5 border border-gray-100 dark:border-slate-700/50 p-6 opacity-0 translate-y-4";
      card.style.animation = `fadeIn 0.5s ease-out ${idx * 0.15}s forwards`;

      card.innerHTML = `
        <div class="flex items-center gap-3 mb-4">
          <span class="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 dark:bg-cyan-900/30 text-blue-600 dark:text-cyan-400 font-bold text-sm">${day.day}</span>
          <div>
            <h3 class="font-bold text-lg text-gray-800 dark:text-white">Day ${day.day}</h3>
            <p class="text-sm text-blue-600 dark:text-cyan-400 font-medium">${day.theme}</p>
          </div>
        </div>
        <div class="space-y-3">
          ${day.activities
            .map(
              (act) => `
            <div class="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700/30 hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors duration-200">
              <span class="text-2xl flex-shrink-0 mt-0.5">${timeIcons[act.time] || "📍"}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">${act.time}</span>
                  <span class="text-xs text-gray-300 dark:text-slate-600">·</span>
                  <span class="text-xs text-gray-400 dark:text-slate-500">${categoryIcons[act.category] || categoryIcons.default} ${act.category}</span>
                </div>
                <p class="font-semibold text-gray-800 dark:text-white truncate">${act.title}</p>
                <p class="text-sm text-gray-500 dark:text-slate-400 mt-0.5">${act.description}</p>
                <div class="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-slate-500">
                  <span>📍 ${act.location}</span>
                  <span>💰 ${act.cost}</span>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;

      scrollWrapper.appendChild(card);
    });

    results.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Generate
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    error.classList.add("hidden");
    results.classList.add("hidden");

    const destination = destinationInput.value.trim();
    const days = parseInt(daysInput.value);
    const budget = budgetSelect.value;
    const vibe = vibeSelect.value;

    if (!destination) {
      showError("Please enter a destination.");
      return;
    }
    if (isNaN(days) || days < 1 || days > 30) {
      showError("Please enter a valid number of days (1–30).");
      return;
    }

    loading.classList.remove("hidden");
    generateBtn.disabled = true;

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1800 + Math.random() * 1200));

    try {
      const data = generateMockItinerary(destination, days, budget, vibe);
      renderItinerary(data);
    } catch (err) {
      showError("Something went wrong. Please try again.");
    } finally {
      loading.classList.add("hidden");
      generateBtn.disabled = false;
    }
  });

  // Reset
  resetBtn.addEventListener("click", () => {
    form.reset();
    results.classList.add("hidden");
    error.classList.add("hidden");
    results.innerHTML = "";
    daysInput.value = 3;
    destinationInput.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function showError(msg) {
    error.textContent = "⚠️ " + msg;
    error.classList.remove("hidden");
  }

  // Initial focus
  destinationInput.focus();
})();
