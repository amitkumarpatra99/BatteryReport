import React, { useEffect, useState } from 'react';
import BatteryGauge from './components/BatteryGauge';
import HealthChart from './components/HealthChart';
import Footer from './components/Footer';
import { FiPhone, FiMail, FiGlobe } from "react-icons/fi";


function App() {
  const [battery, setBattery] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    console.log('Fetching from:', API_BASE_URL);
    try {
      const currentRes = await fetch(`${API_BASE_URL}/api/battery/current`);
      if (!currentRes.ok) throw new Error('Failed to fetch battery status');
      const currentData = await currentRes.json();
      setBattery(currentData);

      const historyRes = await fetch(`${API_BASE_URL}/api/battery/history`);
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-text-primary">
      <div className="glow-text">Loading System Data...</div>
    </div>
  );

  if (error) {
    const isMixedContent = window.location.protocol === 'https:';

    return (
      <div className="flex justify-center items-center h-screen p-5">
        <div className="glass-panel p-8 max-w-md w-full text-center border-danger/50">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-danger mb-2">Connection Failed</h2>

          {isMixedContent ? (
            <div className="mb-6">
              <p className="text-text-secondary mb-4">
                <strong>Security Block Detected:</strong><br />
                Browsers block access to your <b>Local Battery Data</b> from this <b>Secure (HTTPS)</b> website.
              </p>
              <p className="text-text-primary font-medium mb-4">
                Please open the Local App to view your data:
              </p>
              <a
                href="http://localhost:5173"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-accent hover:bg-accent-glow text-bg-dark font-bold py-3 px-6 rounded-full transition-all"
              >
                Open Local App ↗
              </a>
            </div>
          ) : (
            <>
              <p className="text-text-secondary mb-6">
                Could not reach the local backend server (http://localhost:5000).
              </p>

              <div className="text-left bg-black/30 p-5 rounded-xl mb-6 text-sm text-text-secondary backdrop-blur-md border border-white/10 shadow-lg">
                <p className="font-semibold text-text-primary mb-3 text-base">Troubleshooting</p>
                <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                  <li>Ensure the backend server is running.</li>
                  <li>Check terminal for <code>npm start</code> errors.</li>
                  <li>Verify nothing is blocking Port 5000.</li>
                </ul>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="bg-accent hover:bg-accent-glow text-bg-dark font-bold py-2 px-6 rounded-full transition-all"
              >
                Retry Connection
              </button>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 space-y-2 text-sm">
            <p className="font-semibold text-text-primary">Need Help?</p>
            <div className="flex justify-center gap-4 text-text-secondary">
              <a href="mailto:mrpatra.web@gmail.com" className="hover:text-text-primary hover:underline">Support</a>
              <span>•</span>
              <a href="https://mrpatra.vercel.app/" target="_blank" className="hover:text-text-primary hover:underline">Website</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-5 min-h-screen flex flex-col">
      <header className="mb-10 text-center">
        <h1 className="glow-text text-4xl m-0 md:text-5xl font-bold">Windows Battery Status </h1>
        <p className="text-text-secondary mt-2">Real-time Windows Battery Telemetry</p>
      </header>

      <div className="flex-grow">
        {battery && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Main Gauge */}
            <div className="col-span-1">
              <BatteryGauge percent={battery.percent} isCharging={battery.isCharging} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 col-span-1 lg:col-span-1">
              <StatCard
                label="Status"
                value={battery.isCharging ? 'Charging' : 'Discharging'}
                icon={battery.isCharging ? '⚡' : '🔋'}
                color={battery.isCharging ? 'text-warning' : 'text-text-primary'}
              />
              <StatCard
                label="Power Source"
                value={battery.acConnected ? 'AC Power' : 'Battery'}
                icon="🔌"
              />
              <StatCard
                label="Time Remaining"
                value={battery.timeRemaining ? `${battery.timeRemaining} min` : 'Calculating...'}
                icon="⏳"
              />
              <StatCard
                label="Voltage"
                value={`${battery.voltage} V`}
                icon="⚡"
              />
            </div>

            {/* Health Stats */}
            <div className="glass-panel p-6 flex flex-col justify-around col-span-1">
              <h3 className="m-0 mb-5 text-text-secondary font-medium">Battery Health</h3>
              <HealthRow label="Designed Capacity" value={`${battery.designedCapacity} mWh`} />
              <HealthRow label="Max Capacity" value={`${battery.maxCapacity} mWh`} />
              <HealthRow label="Cycle Count" value={battery.cycleCount} />
              <div className="mt-5 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent shadow-[0_0_10px_var(--accent-color)]"
                  style={{ width: `${(battery.maxCapacity / battery.designedCapacity) * 100}%` }}
                />
              </div>
              <div className="text-right mt-1 text-sm text-text-secondary">
                Health: {Math.round((battery.maxCapacity / battery.designedCapacity) * 100)}%
              </div>
            </div>

            {/* Battery Insights */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <div className="glass-panel p-6">
                <h3 className="m-0 mb-4 text-text-secondary font-medium">Battery Insights</h3>
                <div className="flex items-start gap-4">
                  <div className="text-3xl bg-white/5 p-3 rounded-xl">
                    {battery.isCharging ? '⚡' : battery.percent < 20 ? '⚠️' : '💡'}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary mb-1">
                      {battery.isCharging
                        ? 'Charging in Progress'
                        : battery.percent < 20
                          ? 'Low Battery Warning'
                          : 'Battery Status Normal'}
                    </h4>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {battery.isCharging
                        ? 'Your device is currently plugged in. For optimal battery health, consider unplugging once it reaches 80% unless you are performing intensive tasks.'
                        : battery.percent < 20
                          ? 'Your battery level is critical. Please plug in your charger immediately to prevent data loss or shutdown.'
                          : 'Your battery is operating within normal parameters. To extend lifespan, try to keep the charge between 20% and 80%.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <HealthChart data={history} />
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

const StatCard = ({ label, value, icon, color }) => (
  <div className="glass-panel p-5 flex flex-col justify-center">
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-text-secondary text-sm">{label}</div>
    <div className={`text-xl font-semibold ${color || 'text-text-primary'}`}>{value}</div>
  </div>
);

const HealthRow = ({ label, value }) => (
  <div className="flex justify-between mb-3 border-b border-white/5 pb-2">
    <span className="text-text-secondary">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default App;
