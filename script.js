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

  const vibeDayColors = {
    Adventure: { bg: "from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20", dot: "bg-blue-500 dark:bg-blue-400", text: "text-blue-600 dark:text-blue-300", border: "day-accent-adventure" },
    Relaxation: { bg: "from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20", dot: "bg-purple-500 dark:bg-purple-400", text: "text-purple-600 dark:text-purple-300", border: "day-accent-relaxation" },
    Cultural: { bg: "from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20", dot: "bg-emerald-500 dark:bg-emerald-400", text: "text-emerald-600 dark:text-emerald-300", border: "day-accent-cultural" },
    Romantic: { bg: "from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-800/20", dot: "bg-pink-500 dark:bg-pink-400", text: "text-pink-600 dark:text-pink-300", border: "day-accent-romantic" },
    Party: { bg: "from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20", dot: "bg-orange-500 dark:bg-orange-400", text: "text-orange-600 dark:text-orange-300", border: "day-accent-party" },
  };

  const timePillColors = {
    Morning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    Afternoon: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    Evening: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    Night: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
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

  // Render itinerary
  function renderItinerary(data) {
    results.classList.remove("hidden");
    results.innerHTML = "";

    const vibeColors = vibeDayColors[data.vibe] || vibeDayColors.Cultural;

    // Summary banner
    const summary = document.createElement("div");
    summary.className =
      "bg-gradient-to-br from-white to-gray-50 dark:from-slate-800/60 dark:to-slate-800/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-8 border border-gray-100 dark:border-slate-700/50 animate-fade-in-up shadow-lg shadow-gray-100/50 dark:shadow-black/10 card-lift";
    summary.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br ${vibeColors.bg} flex items-center justify-center text-2xl shadow-inner">🌍</div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white">${data.destination}</h2>
            <p class="text-gray-500 dark:text-slate-400 mt-0.5 text-sm sm:text-base">
              ${data.total_days} day${data.total_days > 1 ? "s" : ""} &middot; ${data.budget} &middot; ${data.vibe}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-700/40 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-slate-700 w-fit">
          <span>🗓️</span>
          <span class="font-medium">${data.itinerary.length} day${data.itinerary.length > 1 ? "s" : ""} planned</span>
        </div>
      </div>
    `;
    results.appendChild(summary);

    // Scrollable wrapper
    const scrollWrapper = document.createElement("div");
    scrollWrapper.className = "itinerary-scroll space-y-6 pr-1";
    results.appendChild(scrollWrapper);

    data.itinerary.forEach((day, idx) => {
      const colors = vibeDayColors[data.vibe] || vibeDayColors.Cultural;

      const card = document.createElement("div");
      card.className =
        `bg-white dark:glass-dark dark:bg-slate-800/40 rounded-2xl sm:rounded-3xl shadow-lg dark:shadow-black/10 border border-gray-100 dark:border-slate-700/50 overflow-hidden opacity-0 translate-y-4 card-lift ${colors.border}`;
      card.style.animation = `fadeInUp 0.5s ease-out ${idx * 0.15}s forwards`;

      card.innerHTML = `
        <div class="p-5 sm:p-6">
          <div class="flex items-center gap-4 mb-5">
            <div class="relative timeline-dot">
              <div class="w-11 h-11 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center font-extrabold text-lg ${colors.text} shadow-sm">${day.day}</div>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-xl text-gray-800 dark:text-white">Day ${day.day}</h3>
              <p class="text-sm ${colors.text} font-medium truncate">${day.theme}</p>
            </div>
          </div>
          <div class="space-y-4">
            ${day.activities
              .map(
                (act, actIdx) => `
              <div class="relative pl-14">
                ${actIdx < day.activities.length - 1 ? '<div class="absolute left-[22px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-gray-100 dark:from-slate-600 dark:to-slate-700"></div>' : ""}
                <div class="absolute left-[14px] top-1.5 w-[18px] h-[18px] rounded-full ${colors.dot} border-2 border-white dark:border-slate-800 shadow-sm"></div>
                <div class="bg-gray-50 dark:bg-slate-700/20 rounded-xl sm:rounded-2xl p-4 hover:bg-white dark:hover:bg-slate-700/40 transition-all duration-200 border border-gray-100 dark:border-slate-700/30">
                  <div class="flex items-center gap-2 mb-2 flex-wrap">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${timePillColors[act.time] || "bg-gray-100 text-gray-600"}">
                      ${timeIcons[act.time] || "📍"} ${act.time}
                    </span>
                    <span class="text-xs text-gray-400 dark:text-slate-500">${categoryIcons[act.category] || categoryIcons.default} ${act.category}</span>
                  </div>
                  <p class="font-bold text-gray-800 dark:text-white text-sm sm:text-base">${act.title}</p>
                  <p class="text-sm text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">${act.description}</p>
                  <div class="flex items-center gap-4 mt-3 text-xs text-gray-400 dark:text-slate-500">
                    <span class="inline-flex items-center gap-1">📍 ${act.location}</span>
                    <span class="inline-flex items-center gap-1">💰 ${act.cost}</span>
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
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

  destinationInput.focus();
})();