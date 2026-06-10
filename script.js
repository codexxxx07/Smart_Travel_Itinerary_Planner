(function () {
  "use strict";

  // ─── DOM refs ────────────────────────────────────────────────────────────────
  const form            = document.getElementById("travelForm");
  const destinationInput = document.getElementById("destination");
  const daysInput       = document.getElementById("days");
  const budgetSelect    = document.getElementById("budget");
  const vibeSelect      = document.getElementById("vibe");
  const generateBtn     = document.getElementById("generateBtn");
  const resetBtn        = document.getElementById("resetBtn");
  const loading         = document.getElementById("loading");
  const errorEl         = document.getElementById("error");
  const results         = document.getElementById("results");
  const themeToggle     = document.getElementById("themeToggle");
  const sunIcon         = document.getElementById("sunIcon");
  const moonIcon        = document.getElementById("moonIcon");

  // ─── Constants ───────────────────────────────────────────────────────────────
  const categoryIcons = {
    sightseeing: "🏛️", food: "🍽️", adventure: "🧗", culture: "🎭",
    relaxation: "🧘", nightlife: "🌙", shopping: "🛍️", nature: "🌿",
    transport: "🚕", default: "📍",
  };

  const timeIcons = { Morning: "🌅", Afternoon: "☀️", Evening: "🌆", Night: "🌙" };

  const vibeDayColors = {
    Adventure:  { bg: "from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20",     dot: "bg-blue-500 dark:bg-blue-400",     text: "text-blue-600 dark:text-blue-300",    border: "day-accent-adventure" },
    Relaxation: { bg: "from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20", dot: "bg-purple-500 dark:bg-purple-400", text: "text-purple-600 dark:text-purple-300", border: "day-accent-relaxation" },
    Cultural:   { bg: "from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20", dot: "bg-emerald-500 dark:bg-emerald-400", text: "text-emerald-600 dark:text-emerald-300", border: "day-accent-cultural" },
    Romantic:   { bg: "from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-800/20",     dot: "bg-pink-500 dark:bg-pink-400",     text: "text-pink-600 dark:text-pink-300",    border: "day-accent-romantic" },
    Party:      { bg: "from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20", dot: "bg-orange-500 dark:bg-orange-400", text: "text-orange-600 dark:text-orange-300", border: "day-accent-party" },
  };

  const timePillColors = {
    Morning:   "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 dark:from-amber-900/40 dark:to-amber-800/30 dark:text-amber-300",
    Afternoon: "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 dark:from-orange-900/40 dark:to-orange-800/30 dark:text-orange-300",
    Evening:   "bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 dark:from-indigo-900/40 dark:to-indigo-800/30 dark:text-indigo-300",
    Night:     "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 dark:from-slate-700 dark:to-slate-600 dark:text-slate-300",
  };

  // ─── Security: sanitize strings before inserting into DOM ────────────────────
  /**
   * Escapes HTML special chars to prevent XSS when building HTML strings.
   * @param {unknown} value
   * @returns {string}
   */
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ─── Rate limiting: prevent rapid repeated submissions ───────────────────────
  let lastSubmitTime = 0;
  const SUBMIT_COOLDOWN_MS = 1000; // 1 s between submissions

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

  // ─── Loading state helpers (fixes hidden+flex Tailwind conflict) ─────────────
  function showLoading() {
    loading.classList.remove("hidden");
    loading.classList.add("is-visible");
  }

  function hideLoading() {
    loading.classList.add("hidden");
    loading.classList.remove("is-visible");
  }

  // ─── Mock data ───────────────────────────────────────────────────────────────
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
        { time: "Morning",   title: "Skydiving Experience",  desc: "Tandem skydive over stunning landscapes",        loc: "Adventure Zone",   cost: "$199", cat: "adventure" },
        { time: "Afternoon", title: "White Water Rafting",   desc: "Navigate thrilling rapids with expert guides",   loc: "River Rapids",     cost: "$89",  cat: "adventure" },
        { time: "Evening",   title: "Campfire Dinner",       desc: "Cook under the stars with fellow adventurers",   loc: "Campsite",         cost: "$35",  cat: "food" },
        { time: "Morning",   title: "Hiking Expedition",     desc: "Guided trek through scenic mountain trails",     loc: "National Park",    cost: "$55",  cat: "nature" },
        { time: "Afternoon", title: "Zip-lining",            desc: "Soar through the canopy on a zip-line course",   loc: "Forest Canopy",    cost: "$65",  cat: "adventure" },
        { time: "Evening",   title: "Local Street Food",     desc: "Sample authentic local flavors",                 loc: "City Center",      cost: "$20",  cat: "food" },
      ],
      Relaxation: [
        { time: "Morning",   title: "Beach Yoga",            desc: "Sunrise yoga session on the sand",               loc: "Beachfront",       cost: "$25",  cat: "relaxation" },
        { time: "Afternoon", title: "Spa Treatment",         desc: "Full body massage and aromatherapy",             loc: "Serenity Spa",     cost: "$120", cat: "relaxation" },
        { time: "Evening",   title: "Sunset Cocktails",      desc: "Handcrafted cocktails with ocean views",         loc: "Beach Bar",        cost: "$45",  cat: "relaxation" },
        { time: "Morning",   title: "Poolside Reading",      desc: "Relax by the infinity pool",                     loc: "Hotel Pool",       cost: "$0",   cat: "relaxation" },
        { time: "Afternoon", title: "Afternoon Tea",         desc: "Elegant tea service with pastries",              loc: "Garden Lounge",    cost: "$35",  cat: "food" },
        { time: "Evening",   title: "Beachside Dinner",      desc: "Fresh seafood with ocean breeze",                loc: "The Shore Restaurant", cost: "$75", cat: "food" },
      ],
      Cultural: [
        { time: "Morning",   title: "Guided Museum Tour",    desc: "Expert-led tour of the city's top museum",       loc: "City Museum",      cost: "$30",  cat: "culture" },
        { time: "Afternoon", title: "Heritage Walk",         desc: "Explore ancient streets and architecture",       loc: "Old Town",         cost: "$20",  cat: "culture" },
        { time: "Evening",   title: "Traditional Show",      desc: "Live folk music and dance performance",          loc: "Cultural Hall",    cost: "$50",  cat: "culture" },
        { time: "Morning",   title: "Cooking Workshop",      desc: "Learn to cook traditional dishes",               loc: "Local Kitchen",    cost: "$60",  cat: "food" },
        { time: "Afternoon", title: "Temple Visit",          desc: "Guided tour of historic temples",                loc: "Temple Complex",   cost: "$15",  cat: "culture" },
        { time: "Evening",   title: "Night Market",          desc: "Browse local crafts and street food",            loc: "Night Bazaar",     cost: "$25",  cat: "shopping" },
      ],
      Romantic: [
        { time: "Morning",   title: "Sunrise Hot Air Balloon", desc: "Float above the landscape at dawn",           loc: "Balloon Launch Site", cost: "$250", cat: "adventure" },
        { time: "Afternoon", title: "Couples Spa",           desc: "Side-by-side massage treatment",                loc: "Luxury Spa",       cost: "$180", cat: "relaxation" },
        { time: "Evening",   title: "Candlelight Dinner",    desc: "Private dinner under the stars",                loc: "Rooftop Terrace",  cost: "$120", cat: "food" },
        { time: "Morning",   title: "Beach Walk",            desc: "Hand-in-hand stroll along the shore",           loc: "Private Beach",    cost: "$0",   cat: "nature" },
        { time: "Afternoon", title: "Wine Tasting",          desc: "Sample premium local wines",                    loc: "Vineyard Estate",  cost: "$70",  cat: "culture" },
        { time: "Evening",   title: "Sunset Cruise",         desc: "Private boat ride at golden hour",              loc: "Harbor",           cost: "$150", cat: "relaxation" },
      ],
      Party: [
        { time: "Morning",   title: "Brunch Club",           desc: "Bottomless brunch at a trendy spot",            loc: "The Brunch Club",  cost: "$40",  cat: "food" },
        { time: "Afternoon", title: "Pool Party",            desc: "DJ sets and cocktails by the pool",             loc: "Rooftop Pool",     cost: "$30",  cat: "nightlife" },
        { time: "Evening",   title: "Club Night",            desc: "VIP entry to hottest nightclub",                loc: "Neon Club",        cost: "$80",  cat: "nightlife" },
        { time: "Morning",   title: "Beach Volleyball",      desc: "Fun beach sports with music",                   loc: "Beach Court",      cost: "$10",  cat: "adventure" },
        { time: "Afternoon", title: "Shopping Spree",        desc: "Hit the best boutiques and malls",              loc: "Fashion District", cost: "$200", cat: "shopping" },
        { time: "Evening",   title: "Karaoke Night",         desc: "Sing your heart out with friends",              loc: "K Box Lounge",     cost: "$35",  cat: "nightlife" },
      ],
    };

    const selectedThemes     = themes[vibe]           || themes.Cultural;
    const selectedActivities = activitiesByVibe[vibe] || activitiesByVibe.Cultural;
    const budgetMultiplier   = budget === "Budget" ? 0.6 : budget === "Luxury" ? 2.5 : 1;

    const itinerary = [];
    for (let i = 0; i < Math.min(days, 8); i++) {
      const activitiesCount = budget === "Budget" ? 2 : 3;
      const dayActivities = [];
      for (let a = 0; a < activitiesCount; a++) {
        const base = selectedActivities[(i * 3 + a) % selectedActivities.length];
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

  // ─── Render itinerary (batched DOM write via requestAnimationFrame) ───────────
  function renderItinerary(data) {
    const vibeColors = vibeDayColors[data.vibe] || vibeDayColors.Cultural;

    // Build HTML string with all user data properly escaped (XSS prevention)
    const dest    = escapeHtml(data.destination);
    const budget  = escapeHtml(data.budget);
    const vibe    = escapeHtml(data.vibe);
    const dayWord = (n) => `${n} day${n > 1 ? "s" : ""}`;

    let html = `
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
          <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-400 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 px-5 py-3 rounded-xl w-fit">
            <span aria-hidden="true">🗓️</span>
            <span class="font-semibold">${dayWord(data.itinerary.length)} planned</span>
          </div>
        </div>
      </div>
      <div class="itinerary-scroll space-y-6 pr-2">
    `;

    data.itinerary.forEach((day, idx) => {
      const colors    = vibeDayColors[data.vibe] || vibeDayColors.Cultural;
      const dayTheme  = escapeHtml(day.theme);
      html += `
        <div class="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800/60 dark:to-slate-800/30 rounded-2xl sm:rounded-3xl overflow-hidden card-lift ${colors.border}"
             style="animation:fadeInUp 0.3s ease-out ${idx * 0.08}s both;">
          <div class="p-6 sm:p-7">
            <div class="flex items-center gap-5 mb-6">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center font-extrabold text-xl ${colors.text}" aria-label="Day ${day.day}">${day.day}</div>
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
                const cat     = escapeHtml(act.category);
                const catIcon = categoryIcons[act.category] || categoryIcons.default;
                const tIcon   = timeIcons[act.time] || "📍";
                const tPill   = timePillColors[act.time] || "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 dark:from-slate-700 dark:to-slate-600 dark:text-slate-300";
                return `
                <div class="relative pl-16">
                  ${actIdx < day.activities.length - 1
                    ? `<div class="absolute left-[26px] top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700" aria-hidden="true"></div>`
                    : ""}
                  <div class="absolute left-[16px] top-2 w-[20px] h-[20px] rounded-full ${colors.dot} border-2 border-white dark:border-slate-800" aria-hidden="true"></div>
                  <div class="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 rounded-xl p-5">
                    <div class="flex items-center gap-3 mb-3 flex-wrap">
                      <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${tPill}">
                        <span aria-hidden="true">${tIcon}</span> ${escapeHtml(act.time)}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-slate-500 font-medium"><span aria-hidden="true">${catIcon}</span> ${cat}</span>
                    </div>
                    <p class="font-bold text-gray-800 dark:text-white text-base sm:text-lg">${title}</p>
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
        </div>
      `;
    });

    html += `</div>`;

    // Batch DOM write in a single rAF to avoid layout thrashing
    requestAnimationFrame(() => {
      results.innerHTML = html;
      results.classList.remove("hidden");
      results.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // ─── Form submit ─────────────────────────────────────────────────────────────
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Basic rate limiting
    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) return;
    lastSubmitTime = now;

    // Hide previous results/errors
    errorEl.classList.add("hidden");
    results.classList.add("hidden");
    results.innerHTML = "";

    // Read + validate inputs
    const destination = destinationInput.value.trim();
    const days        = parseInt(daysInput.value, 10);
    const budget      = budgetSelect.value;
    const vibe        = vibeSelect.value;

    // Validate allowed values (whitelist) to prevent untrusted data
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

    showLoading();
    generateBtn.disabled = true;

    await new Promise((r) => setTimeout(r, 1500));

    try {
      const data = generateMockItinerary(destination, days, budget, vibe);
      renderItinerary(data);
    } catch (_err) {
      showError("Something went wrong. Please try again.");
    } finally {
      hideLoading();
      generateBtn.disabled = false;
    }
  });

  // ─── Reset ───────────────────────────────────────────────────────────────────
  resetBtn.addEventListener("click", () => {
    form.reset();
    results.classList.add("hidden");
    errorEl.classList.add("hidden");
    results.innerHTML = "";
    daysInput.value = 3;
    destinationInput.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ─── Error helper (uses textContent — never innerHTML — safe against XSS) ────
  function showError(msg) {
    errorEl.textContent = "⚠️ " + msg;
    errorEl.classList.remove("hidden");
  }

  // ─── Debounced resize for any future resize listeners ────────────────────────
  // (pattern available for use; not wired to anything currently)
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
  // e.g.: window.addEventListener("resize", debounce(handleResize, 150));

  // ─── Initial focus ───────────────────────────────────────────────────────────
  destinationInput.focus();
})();
