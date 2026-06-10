# 🌍 TripNova – Smart Travel Itinerary Planner

<div align="center">

![TripNova](https://img.shields.io/badge/TripNova-AI--Powered-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-Free-red)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

**A modern AI-powered travel planning web app that helps users generate smart travel itineraries based on destination, budget, and number of days.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Setup](#-api-integration) • [Screenshots](#-screenshots) • [Future Enhancements](#-future-enhancements)

</div>

---

## 📖 About

TripNova is a cutting-edge travel planning application that leverages real-time APIs to deliver seamless and interactive travel experiences. Whether you're planning a weekend getaway or a month-long adventure, TripNova generates intelligent itineraries tailored to your preferences, budget, and timeline.

### ✨ Key Highlights

- **Dynamic Itinerary Generation** – Smart, AI-driven travel plans based on your inputs
- **Real-Time Data** – Live integration with Places, Weather, and Maps APIs
- **Modern UI/UX** – Bento Grid layout with smooth animations and transitions
- **Dark/Light Mode** – Seamless theme switching for all lighting conditions
- **Data Persistence** – Local storage support to save your travel plans
- **Responsive Design** – Optimized for desktop, tablet, and mobile devices

---

## 🚀 Features

### Core Functionality

- **Dynamic Itinerary Generation**
  - Generates day-by-day travel plans
  - Customizable based on destination, budget, and duration
  - Smart recommendations for activities and attractions

- **Real-Time Places API Integration**
  - Fetches popular attractions, restaurants, and landmarks
  - Provides detailed information about each location
  - Filters by category and user preferences

- **Weather Data Integration**
  - Real-time weather forecasts for your destination
  - Helps plan activities based on weather conditions
  - Multi-day weather predictions

- **Google Maps Integration**
  - Interactive map with location markers
  - Visual representation of your itinerary
  - Easy navigation and exploration

### UI/UX Excellence

- **Skeleton Loading Screen**
  - Smooth loading states for better UX
  - Reduces perceived wait time
  - Professional loading animations

- **Dark Mode + Light Mode**
  - Toggle between themes effortlessly
  - System preference detection
  - Consistent design across both modes

- **Responsive Bento Grid Layout**
  - Modern, creative 2D grid design
  - Flexible and adaptive layout
  - Visually appealing card-based interface

- **Smooth Animations**
  - Micro-interactions for better engagement
  - Transition effects between states
  - Optimized performance for 60fps

- **Local Storage Support**
  - Save your itineraries locally
  - Access offline
  - Data persistence across sessions

---

## 🎨 UI/UX Highlights

- **Bento Grid Layout Design** – Modern, card-based interface inspired by contemporary design trends
- **Clean and Modern Interface** – Minimalist design with focus on content
- **Smooth Transitions** – Fluid animations between different states and views
- **User-Friendly Input System** – Intuitive forms with real-time validation
- **Loading States** – Professional skeleton screens and spinners
- **Responsive Design** – Perfect experience on all device sizes

---

## 🛠️ Tech Stack

### Frontend Technologies

- **HTML5** – Semantic markup and structure
- **CSS3** – Modern styling with animations and transitions
- **Tailwind CSS** – Utility-first CSS framework for rapid development
- **JavaScript (ES6+)** – Modern JavaScript with async/await, modules, and more

### APIs & Integrations

- **Places API** – Location data and points of interest
- **Weather API** – Real-time weather information
- **Google Maps API** – Interactive maps and location services

### Development Tools

- **Node.js** – JavaScript runtime for development
- **npm** – Package management
- **Git** – Version control

---

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)
- API keys (see [API Integration](#-api-integration) section)

### Step-by-Step Setup

1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/Smart_Travel_Itinerary_Planner.git
cd Smart_Travel_Itinerary_Planner
```

2. **Install Dependencies**

```bash
npm install
```

3. **Add API Keys**

Create a `.env` file in the root directory and add your API keys:

```env
PLACES_API_KEY=your_places_api_key_here
WEATHER_API_KEY=your_weather_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

4. **Run Locally**

```bash
npm start
```

5. **Open in Browser**

Navigate to `http://localhost:3000` (or your configured port)

---

## 🔑 API Integration

To use TripNova, you'll need to obtain API keys from the following services:

### Places API

- **Provider**: Google Places API / OpenTripMap / Foursquare
- **Purpose**: Fetch location data, attractions, restaurants, and points of interest
- **Setup**: 
  1. Sign up at the provider's developer portal
  2. Create a new project/API key
  3. Add the key to your `.env` file

### Weather API

- **Provider**: OpenWeatherMap / WeatherAPI
- **Purpose**: Get real-time weather forecasts and conditions
- **Setup**:
  1. Register at the weather API provider
  2. Generate your free API key
  3. Add the key to your `.env` file

### Google Maps API

- **Provider**: Google Cloud Platform
- **Purpose**: Display interactive maps with location markers
- **Setup**:
  1. Create a Google Cloud project
  2. Enable Maps JavaScript API
  3. Create an API key with appropriate restrictions
  4. Add the key to your `.env` file

### 🔒 Security Best Practices

- **Never commit API keys to version control**
- **Use environment variables for all sensitive data**
- **Rotate API keys regularly**
- **Set up API key restrictions (IP, domain, referrer)**
- **Use separate keys for development and production**

---

## 📸 Screenshots

### Home Page
![Home Page](/assets/HomePage.png)
*Clean, modern landing page with intuitive navigation*

### Input Form
![Input Form](/assets/InputForm1.png)
![Input Form](/assets/InputForm2.png)
![Input Form](/assets/InputForm3.png)
![Input Form](/assets/InputForm4.png)

*User-friendly form for destination, budget, and duration inputs*

### Itinerary Output
![Itinerary Output](/assets/ItineraryOutput.png)
*Generated itinerary with day-by-day breakdown and recommendations*

### Weather Info
![Weather Info](/assets/WeatherInfo.png)

*Real-time weather updates including temperature, conditions, and live weather icons for better travel planning*

### Dark Mode UI
![Dark Mode](/assets/DarkModeUI.png)
*Seamless dark mode experience with optimized contrast*

---

## 🌟 Future Enhancements

### Planned Features

- **AI-Based Itinerary (Advanced)**
  - Machine learning models for personalized recommendations
  - Natural language processing for user preferences
  - Adaptive learning from user feedback

- **User Authentication**
  - Sign up / login functionality
  - Social media authentication (Google, Facebook)
  - Profile management and preferences

- **Save & Share Trips**
  - Cloud storage for itineraries
  - Share trips with friends and family
  - Collaborative trip planning
  - Export to PDF and calendar

- **Mobile App Version**
  - React Native / Flutter mobile application
  - Offline mode support
  - Push notifications for travel updates

- **Additional Integrations**
  - Flight and hotel booking APIs
  - Currency conversion
  - Language translation
  - Local transportation options

- **Community Features**
  - User reviews and ratings
  - Travel forums and discussions
  - Photo sharing and travel blogs

---

## 👨‍💻 Author

**Krish**

- GitHub: [@codexxxx07](https://github.com/codexxxx07)
- LinkedIn: [@krishanjit-chakraborty-258a5237a?utm_source=share_via&utm_content=profile&utm_medium=member_android](https://www.linkedin.com/in/krishanjit-chakraborty-258a5237a?utm_source=share_via&utm_content=profile&utm_medium=member_android)
- Instagram: [@_k_r_i_s_h_x_](https://www.instagram.com/_k_r_i_s_h_x_)
- Discord: [@krish014669](https://discord.com/channels/krish014669)

---

## 📜 License

This project is **free to use for learning and personal projects**.

Feel free to fork, modify, and use the code for educational purposes. If you use this project, attribution is appreciated but not required.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

If you have any questions, issues, or suggestions:

- Open an issue on GitHub
- Contact the author directly
- Check the documentation for common solutions

---

## 🎯 Acknowledgments

- Inspired by modern travel planning needs
- Built with love for the travel community
- Thanks to all API providers for their services

---

<div align="center">

**⭐ If you like this project, please give it a star! ⭐**

Made with ❤️ by Krish

</div>
