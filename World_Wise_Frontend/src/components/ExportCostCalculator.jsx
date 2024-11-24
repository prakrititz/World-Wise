import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Truck,
  Globe,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ExportDashboard = () => {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Exchange Rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/INR"
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExchangeRates();
  }, []);

  // Sample KPI Data
  const kpiMetrics = [
    {
      title: "Total Revenue",
      value: "$1.2M",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Orders Fulfilled",
      value: "820",
      change: "+5%",
      trend: "up",
      icon: Truck,
    },
    {
      title: "Profit Margin",
      value: "28%",
      change: "-3%",
      trend: "down",
      icon: TrendingDown,
    },
  ];

  const COLORS = ["#1e3a8a", "#6366f1", "#22c55e", "#eab308", "#f43f5e"];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Export Dashboard
            </h1>
            <p className="text-gray-600">Monitor your export performance</p>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            Export Data
          </button>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpiMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-500">{metric.title}</p>
                <h3 className="text-xl font-bold text-gray-900">
                  {metric.value}
                </h3>
                <div
                  className={`flex items-center text-sm ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="ml-1">{metric.change}</span>
                </div>
              </div>
              <div
                className={`p-3 rounded-full ${
                  metric.trend === "up"
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                <metric.icon className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          ))}
        </div>

        {/* Exchange Rates */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Currency Exchange Rates
          </h2>
          {isLoading ? (
            <p className="text-gray-500">Loading exchange rates...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(exchangeRates).slice(0, 6).map((currency, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-4 shadow"
                >
                  <span className="font-medium text-gray-900">
                    {currency}/INR
                  </span>
                  <span className="text-blue-600 font-bold">
                    {exchangeRates[currency].toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Revenue Analysis
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { month: "Jan", revenue: 100000 },
                  { month: "Feb", revenue: 120000 },
                  { month: "Mar", revenue: 150000 },
                  { month: "Apr", revenue: 170000 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportDashboard;
