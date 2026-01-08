# Battery Status Monitor 🔋

A modern, full-stack MERN application that provides real-time telemetry and historical data for your Windows laptop's battery health. Built with a beautiful, dark-themed UI using Tailwind CSS and Glassmorphism design principles.



## ✨ Features

- **Real-Time Monitoring**: Live updates of battery percentage, charging status, voltage, and time remaining.
- **Historical Data**: Visualizes battery charge history over time using interactive area charts.
- **Health Metrics**: Displays critical health data like Cycle Count, Designed Capacity, and Max Capacity.
- **Modern UI**: Sleek "Midnight" dark theme with neon glows and glassmorphism effects.
- **Responsive Design**: Fully optimized for desktops, tablets, and mobile devices.
- **Concurrent Execution**: Run both backend and frontend with a single command.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Recharts
- **Backend**: Node.js, Express
- **Database**: MongoDB (Local)
- **System Info**: `systeminformation` library

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Must be installed and running locally)

### Installation

1.  **Clone the repository** (or download source):
    ```bash
    git clone <repository-url>
    cd "Windows Battery Status"
    ```

2.  **Install Dependencies**:
    This project has a root script to install dependencies for both server and client.
    ```bash
    npm run install-all
    ```
    *Alternatively, you can install them manually:*
    ```bash
    cd server && npm install
    cd ../client && npm install
    ```

### Running the App

1.  **Start MongoDB**: Ensure your local MongoDB instance is running.
2.  **Start the Application**:
    Run the following command from the root directory:
    ```bash
    npm start
    ```
    This will concurrently start:
    - **Backend Server** on `http://localhost:5000`
    - **Frontend Client** on `http://localhost:5173`

3.  **Open in Browser**: Visit `http://localhost:5173` to view the dashboard.

## 📂 Project Structure

```
Windows Battery Status/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (BatteryGauge, HealthChart)
│   │   ├── App.jsx         # Main Dashboard Logic
│   │   └── index.css       # Tailwind Directives & Global Styles
│   ├── tailwind.config.js  # Tailwind Configuration
│   └── vite.config.js      # Vite Configuration
├── server/                 # Express Backend
│   ├── models/             # Mongoose Models (BatteryLog)
│   ├── index.js            # API Routes & Server Entry
│   └── package.json
├── package.json            # Root scripts for concurrent execution
└── README.md               # Project Documentation
```



## ⚠️ Deployment Limitations

**Important**: This application is designed to run **locally** on your Windows machine.

- **Why?**: It uses the `systeminformation` Node.js library to read your laptop's physical battery sensors.
- **Cloud Deployment**: If you deploy the frontend to Vercel/Netlify, it will **fail to fetch data** unless you also have the backend running locally on your machine and allow the browser to access `localhost`.
- **Best Practice**: Clone and run this project locally for the intended experience.

### 🔓 Enabling Local Network Access (Chrome/Edge)
If you are running the frontend on a public URL (like Vercel) but the backend is on `localhost`, Chrome may block the connection. To fix this:
1.  Open the deployed website in Chrome.
2.  Click the **Lock icon** (🔒) or **Settings icon** in the address bar.
3.  Click **Site settings**.
4.  Find **Insecure content** or **Local network access** and set it to **Allow**.
5.  Reload the page.

## 🔧 Troubleshooting

- **MongoDB Error**: If you see connection errors, ensure MongoDB is running locally on port `27017`.
- **No Data**: The app uses `systeminformation` which requires node to run on the host machine. It will not show battery data if deployed to a cloud server (like Vercel) without a dedicated agent.
