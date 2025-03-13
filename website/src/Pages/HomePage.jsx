import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserRestaurantId } from "../aws-config";
import QRCodeComponent from "../components/QRCodeComponent";
import { Link } from "react-router-dom";

// Mock data for demo - replace with actual API calls in production
const fetchRestaurantData = () => {
  return {
    name: "Foodie",
    address: "123 Main St, San Francisco, CA 94101",
    metrics: {
      todayRevenue: 3245,
      todayOrders: 87,
      averageOrderValue: 37.29,
      profitMargin: 23.4,
      revenueTrend: 12.3,
      ordersTrend: 8.7,
      aovTrend: 3.2,
      profitTrend: 1.8,
    },
    topDishes: [
      {
        id: 1,
        name: "Truffle Mushroom Pasta",
        orders: 24,
        revenue: 551.76,
        image: null,
      },
      {
        id: 2,
        name: "Grilled Salmon",
        orders: 18,
        revenue: 449.82,
        image: null,
      },
      {
        id: 3,
        name: "Chocolate Lava Cake",
        orders: 15,
        revenue: 149.85,
        image: null,
      },
    ],
    recentActivity: [
      {
        id: 1,
        type: "optimization",
        text: "Menu automatically optimized based on weekend sales data",
        time: "Today, 9:45 AM",
        icon: "✓",
      },
      {
        id: 2,
        type: "menu",
        text: "Added 3 new seasonal items to menu",
        time: "Yesterday, 4:30 PM",
        icon: "↑",
      },
      {
        id: 3,
        type: "price",
        text: "Adjusted pricing on 5 menu items based on ML recommendations",
        time: "Mar 10, 11:20 AM",
        icon: "$",
      },
      {
        id: 4,
        type: "report",
        text: "Weekly performance report generated",
        time: "Mar 10, 8:00 AM",
        icon: "📊",
      },
    ],
    mlInsight: {
      title: "Menu Optimization Opportunity",
      description:
        "Based on recent sales data, we recommend adjusting prices for your top 3 dishes to increase profit margin by ~8%.",
      actionUrl: "/analytics",
    },
  };
};

const HomePage = () => {
  const { user } = useAuth();
  const [restaurantID, setRestaurantID] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      user.getSession((err, session) => {
        if (!err && session.isValid()) {
          const restaurantId = getUserRestaurantId(session);
          setRestaurantID(restaurantId || "Foodie"); // Default to "Foodie" for the demo

          // Fetch dashboard data
          // In production, replace this with actual API calls
          setRestaurantData(fetchRestaurantData());
          setLoading(false);
        }
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">
          Redirecting to Sign In...
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-white rounded-md shadow-sm mb-4 overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center">
            <div className="p-4 lg:p-5 flex-grow">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white text-lg font-bold mr-3 flex-shrink-0">
                  {restaurantData.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {restaurantData.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {restaurantData.address}
                  </p>
                </div>
              </div>
              <h1 className="text-xl font-bold text-gray-800 mb-1">
                Welcome to your dashboard!
              </h1>
              <p className="text-sm text-gray-600">
                Your ML-powered menu platform is actively optimizing your menu
                for better performance.
              </p>
            </div>

            <div className="bg-gray-50 p-4 border-t lg:border-t-0 lg:border-l border-gray-100 flex-shrink-0 lg:w-64">
              <div className="text-sm text-gray-700 mb-2 font-medium">
                Share Your Digital Menu
              </div>
              <QRCodeComponent restaurantID={restaurantID} />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <MetricCard
            title="TODAY'S REVENUE"
            value={`$${restaurantData.metrics.todayRevenue.toLocaleString()}`}
            trend={restaurantData.metrics.revenueTrend}
            icon="💰"
          />
          <MetricCard
            title="ORDERS TODAY"
            value={restaurantData.metrics.todayOrders}
            trend={restaurantData.metrics.ordersTrend}
            icon="🛒"
          />
          <MetricCard
            title="AVERAGE ORDER"
            value={`$${restaurantData.metrics.averageOrderValue}`}
            trend={restaurantData.metrics.aovTrend}
            icon="📈"
          />
          <MetricCard
            title="PROFIT MARGIN"
            value={`${restaurantData.metrics.profitMargin}%`}
            trend={restaurantData.metrics.profitTrend}
            icon="✨"
          />
        </div>

        {/* ML Insight */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-md shadow-sm p-4 mb-4 border-l-4 border-green-500">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-grow">
              <div className="text-green-800 font-semibold mb-1 text-sm">
                AI Menu Assistant
              </div>
              <div className="text-gray-800 font-medium mb-1">
                {restaurantData.mlInsight.title}
              </div>
              <p className="text-sm text-gray-700 mb-3">
                {restaurantData.mlInsight.description}
              </p>
              <Link
                to={restaurantData.mlInsight.actionUrl}
                className="bg-green-600 text-white text-sm px-3 py-1.5 rounded inline-block hover:bg-green-700 transition"
              >
                View Recommendations
              </Link>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Top Performing Dishes */}
          <DashboardCard
            title="Top Performing Dishes"
            icon="🔥"
            className="lg:col-span-1"
          >
            <div className="space-y-3">
              {restaurantData.topDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md transition"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-md mr-3 flex-shrink-0"></div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-800 text-sm">
                      {dish.name}
                    </h4>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500">
                        {dish.orders} orders today
                      </p>
                      <p className="text-xs font-medium text-green-600">
                        ${dish.revenue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/analytics"
              className="text-green-600 text-xs font-medium hover:underline mt-3 inline-block"
            >
              View All Performance Data →
            </Link>
          </DashboardCard>

          {/* Recent Activity */}
          <DashboardCard
            title="Recent Activity"
            icon="📝"
            className="lg:col-span-1"
          >
            <div className="space-y-3">
              {restaurantData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start p-1">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                    {activity.icon}
                  </div>
                  <div>
                    <p className="text-gray-800 text-sm">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Right Column - Quick Actions & Getting Started */}
          <div className="lg:col-span-1 space-y-4">
            {/* Quick Actions */}
            <DashboardCard title="Quick Actions" icon="⚡">
              <div className="grid grid-cols-2 gap-2">
                <ActionButton to="/menus" icon="📋" label="Edit Live Menu" />
                <ActionButton
                  to="/analytics"
                  icon="📊"
                  label="View Analytics"
                />
                <ActionButton to="/archive" icon="🗂️" label="Menu Archive" />
                <ActionButton to="/orders" icon="💰" label="Revenue Report" />
              </div>
            </DashboardCard>

            {/* Getting Started */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-md shadow-sm p-4 border-l-4 border-amber-500 text-sm">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
                  ?
                </div>
                <h3 className="text-base font-bold text-gray-800">
                  Getting Started
                </h3>
              </div>

              <div className="space-y-3">
                <StepItem
                  number="1"
                  title="Set Up Your Menu"
                  description="Add dishes and customize your digital menu"
                  actionText="Create Menu"
                  actionUrl="/menus/new"
                />
                <StepItem
                  number="2"
                  title="Activate ML Features"
                  description="Enable AI-driven optimization and pricing"
                />
                <StepItem
                  number="3"
                  title="Review Analytics"
                  description="Track performance and apply recommendations"
                />
              </div>

              <button
                className="mt-3 bg-amber-500 text-white px-3 py-1.5 rounded text-sm hover:bg-amber-600 transition w-full"
                onClick={() =>
                  alert(
                    "Tutorial feature will be implemented in the next phase!"
                  )
                }
              >
                View Full Tutorial
              </button>
            </div>
          </div>
        </div>

        {/* Menu Archive Card */}
        <div className="bg-white rounded-md shadow-sm overflow-hidden mb-4">
          <div className="bg-blue-50 p-4 border-l-4 border-blue-500">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path
                    fillRule="evenodd"
                    d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="text-blue-800 font-semibold mb-1">
                  Menu Archive Now Available
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Access historical menu data and performance metrics to track
                  your menu's evolution over time. Compare sales across
                  different menu versions to identify what works best.
                </p>
                <Link
                  to="/archive"
                  className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded inline-block hover:bg-blue-700 transition"
                >
                  Explore Menu Archive
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs mt-6 mb-2">
          Data last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

// Reusable components
const MetricCard = ({ title, value, trend, icon }) => (
  <div className="bg-white rounded-md shadow-sm p-3 flex items-start">
    <div className="mr-3 text-xl">{icon}</div>
    <div className="flex-grow">
      <div className="text-xs text-gray-500 font-medium mb-1">{title}</div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-green-600 mt-1">↑ {trend}% vs yesterday</div>
    </div>
  </div>
);

const DashboardCard = ({ title, children, icon, className }) => (
  <div
    className={`bg-white rounded-md shadow-sm overflow-hidden ${
      className || ""
    }`}
  >
    <div className="border-b border-gray-100 p-3 flex items-center">
      <div className="text-lg mr-2">{icon}</div>
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
    </div>
    <div className="p-3">{children}</div>
  </div>
);

const ActionButton = ({ to, icon, label }) => (
  <Link
    to={to}
    className="bg-gray-50 hover:bg-gray-100 transition rounded-md p-3 text-center border border-gray-100 flex flex-col items-center"
  >
    <div className="text-xl mb-1">{icon}</div>
    <div className="font-medium text-xs">{label}</div>
  </Link>
);

const StepItem = ({ number, title, description, actionText, actionUrl }) => (
  <div className="flex items-start">
    <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
      {number}
    </div>
    <div>
      <h4 className="font-medium text-gray-800 text-sm">{title}</h4>
      <p className="text-xs text-gray-600 mb-1">{description}</p>
      {actionText && actionUrl && (
        <Link to={actionUrl} className="text-amber-600 hover:underline text-xs">
          {actionText}
        </Link>
      )}
    </div>
  </div>
);

export default HomePage;
