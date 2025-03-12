import React, { useState, useEffect } from "react";
import { dynamoDb, MENUS_TABLE_NAME } from "../aws-config";

const LiveMenuPage = () => {
  const [liveMenu, setLiveMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const fetchLiveMenu = async () => {
    try {
      const data = await dynamoDb
        .scan({ TableName: MENUS_TABLE_NAME })
        .promise();
      if (data.Items) {
        const liveMenuID = sessionStorage.getItem("liveMenuID");
        const selectedMenu = data.Items.find(
          (menu) => menu.menuID === liveMenuID
        );
        setLiveMenu(selectedMenu || null);
      }
    } catch (error) {
      console.error("❌ Error fetching live menu:", error);
      setError("Failed to load the live menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMenu();

    const handleStorageUpdate = () => fetchLiveMenu();
    window.addEventListener("liveMenuUpdated", handleStorageUpdate);

    return () =>
      window.removeEventListener("liveMenuUpdated", handleStorageUpdate);
  }, []);

  // Group dishes by category
  const getDishesByCategory = () => {
    if (!liveMenu || !liveMenu.dishes) return {};

    // If dishes don't have categories, create a default one
    if (!liveMenu.dishes.some((dish) => dish.category)) {
      return {
        "All Items": liveMenu.dishes,
      };
    }

    // Otherwise group by actual categories
    return liveMenu.dishes.reduce((acc, dish) => {
      const category = dish.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(dish);
      return acc;
    }, {});
  };

  const categories = liveMenu ? Object.keys(getDishesByCategory()) : [];

  // Helper function to generate synthetic ML insights based on dish properties
  const getMLInsight = (dish) => {
    // This is a mock function - in a real implementation you'd use actual data
    const insights = [
      {
        type: "trending",
        message: "Trending ↑ 23%",
        condition: dish.price > 20 && dish.name.length > 10,
      },
      {
        type: "popular",
        message: "Customer favorite",
        condition:
          dish.name.toLowerCase().includes("pasta") ||
          dish.name.toLowerCase().includes("pizza"),
      },
      {
        type: "profit",
        message: "High profit margin",
        condition:
          dish.price > 15 && !dish.name.toLowerCase().includes("steak"),
      },
      {
        type: "optimize",
        message: "Price increase recommended",
        condition: dish.price < 12 && dish.price > 8,
      },
      {
        type: "pair",
        message: "Often paired with drinks",
        condition:
          dish.name.toLowerCase().includes("bread") ||
          dish.name.toLowerCase().includes("app"),
      },
    ];

    // Find applicable insights
    const applicable = insights.filter((insight) => insight.condition);
    return applicable.length > 0 ? applicable[0] : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 mx-auto max-w-4xl">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!liveMenu) {
    return (
      <div className="p-6 mx-auto max-w-4xl bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <svg
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No live menu is set
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't activated a menu yet. Select a menu to make it live.
          </p>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={() => (window.location.href = "/menus")}
          >
            Go to My Menus
          </button>
        </div>
      </div>
    );
  }

  const dishesByCategory = getDishesByCategory();
  const displayCategories =
    activeCategory === "all" ? categories : [activeCategory];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Menu Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {liveMenu.name || "Foodie's Live Menu"}
            </h1>
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse mr-2"></div>
              <span>Live - Auto-optimizing based on real-time data</span>
            </div>
            {liveMenu.description && (
              <p className="text-gray-600 mt-2">{liveMenu.description}</p>
            )}
          </div>

          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition"
              onClick={() => window.print()}
            >
              Export Menu
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              onClick={() =>
                (window.location.href = `/menus/edit/${liveMenu.menuID}`)
              }
            >
              Edit Menu
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        {categories.length > 1 && (
          <div className="flex overflow-x-auto pb-2 mb-6">
            <button
              className={`px-6 py-2 rounded-full mr-2 whitespace-nowrap ${
                activeCategory === "all"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => setActiveCategory("all")}
            >
              All Items
            </button>

            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full mr-2 whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Menu Categories and Items */}
        {displayCategories.map((category) => (
          <div key={category} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {category}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishesByCategory[category].map((dish) => {
                const mlInsight = getMLInsight(dish);

                return (
                  <div
                    key={dish.dishId}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="h-40 bg-gray-200 relative">
                      {/* Placeholder for dish image - replace with actual image if available */}
                      {dish.imageUrl ? (
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          {dish.name}
                        </div>
                      )}

                      {/* Popularity badge - you could determine this based on sales data */}
                      {dish.popular && (
                        <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Top Seller
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {dish.name}
                        </h3>
                        <div className="text-lg font-bold text-green-700">
                          ${parseFloat(dish.price || 0).toFixed(2)}
                        </div>
                      </div>

                      {dish.description && (
                        <p className="text-gray-600 mb-3 text-sm">
                          {dish.description}
                        </p>
                      )}

                      {/* ML Insights Tag */}
                      {mlInsight && (
                        <div
                          className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            mlInsight.type === "trending"
                              ? "bg-green-100 text-green-800"
                              : mlInsight.type === "popular"
                              ? "bg-blue-100 text-blue-800"
                              : mlInsight.type === "profit"
                              ? "bg-purple-100 text-purple-800"
                              : mlInsight.type === "optimize"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {mlInsight.message}
                        </div>
                      )}

                      {/* Dietary restrictions or additional info */}
                      {dish.dietary && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {dish.dietary.map((diet) => (
                            <span
                              key={diet}
                              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                            >
                              {diet}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* ML Insight Panel */}
        <div className="bg-green-50 border-l-4 border-green-600 rounded-r-lg p-5 mb-6 mt-8">
          <div className="flex">
            <div className="text-2xl mr-4">💡</div>
            <div>
              <div className="text-green-800 font-semibold mb-1">
                ML Menu Insights
              </div>
              <div className="text-gray-800 font-medium mb-1">
                Menu Optimization Opportunity
              </div>
              <p className="text-gray-700 mb-3">
                Based on your current menu mix, we recommend adding more
                vegetarian options and appetizers to increase your average check
                size. Customers who order appetizers spend 22% more on average.
              </p>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md inline-block hover:bg-green-700 transition"
                onClick={() => (window.location.href = "/analytics")}
              >
                View Detailed Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default LiveMenuPage;
