
import React, { useState, useEffect } from 'react';
import SensorCard from '@/components/SensorCard';
import Chart from '@/components/Chart';
import { Thermometer, Droplet, Leaf, Database } from 'lucide-react';

const Dashboard = () => {
  const [sensorData, setSensorData] = useState({
    temperature: 24.5,
    humidity: 65,
    ph: 6.8,
    gasLevels: 350,
  });

  const [chartData, setChartData] = useState({
    temperature: [],
    humidity: [],
    ph: [],
    gasLevels: [],
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        temperature: +(prev.temperature + (Math.random() - 0.5) * 2).toFixed(1),
        humidity: Math.max(0, Math.min(100, +(prev.humidity + (Math.random() - 0.5) * 5).toFixed(0))),
        ph: +(prev.ph + (Math.random() - 0.5) * 0.2).toFixed(1),
        gasLevels: Math.max(0, +(prev.gasLevels + (Math.random() - 0.5) * 20).toFixed(0)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Generate chart data
  useEffect(() => {
    const generateData = (baseValue: number, variance: number) => {
      return Array.from({ length: 24 }, (_, i) => ({
        time: `${i.toString().padStart(2, '0')}:00`,
        value: +(baseValue + (Math.random() - 0.5) * variance).toFixed(1),
      }));
    };

    setChartData({
      temperature: generateData(24, 8),
      humidity: generateData(65, 20),
      ph: generateData(6.8, 1),
      gasLevels: generateData(350, 100),
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Farm Monitoring Dashboard</h1>
          <p className="text-gray-600">Real-time sensor data and analytics for your smart farm</p>
        </div>

        {/* Sensor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SensorCard
            title="Temperature"
            value={sensorData.temperature}
            unit="°C"
            icon={Thermometer}
            color="bg-orange-500"
            trend="up"
            trendValue="2.1°C"
          />
          <SensorCard
            title="Humidity"
            value={sensorData.humidity}
            unit="%"
            icon={Droplet}
            color="bg-blue-500"
            trend="stable"
            trendValue="0.5%"
          />
          <SensorCard
            title="pH Level"
            value={sensorData.ph}
            unit="pH"
            icon={Leaf}
            color="bg-green-500"
            trend="down"
            trendValue="0.3"
          />
          <SensorCard
            title="Gas Levels"
            value={sensorData.gasLevels}
            unit="ppm"
            icon={Database}
            color="bg-purple-500"
            trend="up"
            trendValue="15 ppm"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart
            data={chartData.temperature}
            color="#f97316"
            title="Temperature Trends (24h)"
          />
          <Chart
            data={chartData.humidity}
            color="#3b82f6"
            title="Humidity Levels (24h)"
          />
          <Chart
            data={chartData.ph}
            color="#22c55e"
            title="pH Level Changes (24h)"
          />
          <Chart
            data={chartData.gasLevels}
            color="#a855f7"
            title="Gas Level Monitoring (24h)"
          />
        </div>

        {/* Status Overview */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">All sensors online</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Data transmission normal</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700">1 alert pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
