import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Function to parse the synthetic data and organize it by date
const processSalesData = (salesData) => {
  // Create a map of dates with sales data
  const dateMap = new Map();

  salesData.forEach((dish) => {
    dish.sales.forEach((sale) => {
      const saleDate = sale.time.split("T")[0]; // Extract YYYY-MM-DD

      if (!dateMap.has(saleDate)) {
        dateMap.set(saleDate, {
          date: saleDate,
          dishes: [],
          totalSales: 0,
          totalRevenue: 0,
        });
      }

      // Add dish to this date if not already there
      const dateData = dateMap.get(saleDate);
      if (!dateData.dishes.some((d) => d.name === dish.name)) {
        dateData.dishes.push({
          name: dish.name,
          price: dish.price,
          orders: 0,
          revenue: 0,
        });
      }

      // Find the dish and update counts
      const dishData = dateData.dishes.find((d) => d.name === dish.name);
      dishData.orders += 1;
      dishData.revenue += sale.price;

      // Update totals
      dateData.totalSales += 1;
      dateData.totalRevenue += sale.price;
    });
  });

  // Convert map to array and sort by date
  return Array.from(dateMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

// Sample menus data - create historical menu snapshots
const historicalMenus = {
  "2024-12-25": {
    id: "menu-holiday-2024",
    name: "Holiday Special Menu 2024",
    description:
      "Limited-time festive menu featuring seasonal ingredients and holiday favorites",
    items: [
      "Garlic Bread",
      "Bruschetta",
      "Mozzarella Sticks",
      "Grilled Salmon",
      "Tiramisu",
      "Chocolate Lava Cake",
    ],
    insights:
      "Special holiday menu greatly outperformed regular service. Festive promotions drove significant traffic.",
  },
  "2025-01-15": {
    id: "menu-winter-2025",
    name: "Winter Comfort Menu 2025",
    description: "Warming dishes perfect for the cold season",
    items: [
      "Mozzarella Sticks",
      "Spaghetti Carbonara",
      "Margherita Pizza",
      "Tiramisu",
    ],
    insights:
      "Winter menu performed well despite typically slower season. Comfort food items drove higher check averages.",
  },
  "2025-02-14": {
    id: "menu-valentines-2025",
    name: "Valentine's Day Special Menu",
    description: "Romantic dishes curated for couples",
    items: [
      "Bruschetta",
      "Grilled Salmon",
      "Spaghetti Carbonara",
      "Chocolate Lava Cake",
    ],
    insights:
      "Valentine's menu saw highest average check of the quarter. Dessert attachment rate hit 85%.",
  },
  "2025-03-01": {
    id: "menu-spring-2025",
    name: "Pasta La Vista - Spring Menu 2025",
    description:
      "As the seasons change, so do our offerings. Fresh herbs, crisp vegetables, and lighter fare to welcome the new season.",
    items: [
      "Garlic Bread",
      "Margherita Pizza",
      "Spaghetti Carbonara",
      "Grilled Salmon",
      "Tiramisu",
    ],
    insights:
      "Launch of our spring menu showed strong initial performance with seafood items seeing notable increase in popularity.",
  },
};

const ArchivePage = () => {
  const [salesData, setSalesData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateData, setSelectedDateData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [helpVisible, setHelpVisible] = useState(true);

  // ✅ Fetch sales_data.json dynamically from the public folder
  useEffect(() => {
    setLoading(true);
    fetch("/sales_data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load sales data");
        }
        return response.json();
      })
      .then((data) => {
        setSalesData(data);
        setProcessedData(processSalesData(data));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading JSON:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    generateCalendar(currentYear, currentMonth);
  }, [currentYear, currentMonth, processedData]);

  const generateCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const calendarArray = [];

    for (let i = 0; i < startingDay; i++) {
      calendarArray.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const formattedDate = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(i).padStart(2, "0")}`;
      const dateHasData = processedData.some(
        (data) => data.date === formattedDate
      );
      const hasMenu = Object.keys(historicalMenus).includes(formattedDate);

      calendarArray.push({
        day: i,
        hasData: dateHasData,
        hasMenu: hasMenu,
        date: formattedDate,
      });
    }

    setCalendarDays(calendarArray);
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 0) {
        setCurrentYear((prevYear) => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 11) {
        setCurrentYear((prevYear) => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };

  const handleDateClick = (dayInfo) => {
    if (!dayInfo) return;

    setSelectedDate(dayInfo.date);

    // Find data for this date
    const dateData = processedData.find((data) => data.date === dayInfo.date);
    const menuData = historicalMenus[dayInfo.date];

    setSelectedDateData({
      date: dayInfo.date,
      salesData: dateData || null,
      menuData: menuData || null,
    });

    setShowModal(true);
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Menu Archive</h1>
          <p className="text-sm text-gray-600">
            View historical menus and sales data
          </p>
        </header>

        {/* Help Dialog */}
        {helpVisible && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md shadow-sm">
            <div className="flex justify-between">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    How to Use the Menu Archive
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p className="mb-2">
                      This tool lets you look back at your restaurant's past
                      menus and their performance:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <span className="font-medium">Green dots</span> show
                        dates with sales data available
                      </li>
                      <li>
                        <span className="font-medium">Blue borders</span>{" "}
                        indicate dates with special menus
                      </li>
                      <li>
                        Click on any highlighted date to see what menu was
                        running and how it performed
                      </li>
                      <li>Use the arrows to navigate between months</li>
                      <li>
                        Compare performance across different dates to identify
                        successful menu changes
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setHelpVisible(false)}
                className="text-blue-500 hover:text-blue-700"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <div className="md:col-span-2">
              <div className="bg-white shadow-sm rounded-md overflow-hidden">
                <div className="flex items-center justify-between px-6 py-3 bg-gray-700 text-white">
                  <button
                    onClick={handlePrevMonth}
                    className="hover:bg-gray-600 px-3 py-1 rounded flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Prev
                  </button>
                  <h2 className="text-lg font-semibold">{`${monthNames[currentMonth]} ${currentYear}`}</h2>
                  <button
                    onClick={handleNextMonth}
                    className="hover:bg-gray-600 px-3 py-1 rounded flex items-center"
                  >
                    Next
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center font-medium text-gray-600 text-sm"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((dayInfo, index) => {
                      if (dayInfo === null) {
                        return (
                          <div
                            key={`empty-${index}`}
                            className="text-center py-2 px-1 bg-gray-50 border rounded-md text-gray-300 cursor-default"
                          ></div>
                        );
                      }

                      return (
                        <div
                          key={`day-${dayInfo.day}`}
                          onClick={() =>
                            (dayInfo.hasData || dayInfo.hasMenu) &&
                            handleDateClick(dayInfo)
                          }
                          className={`
                            cursor-pointer text-center py-2 px-1 border rounded-md relative
                            ${
                              dayInfo.hasData || dayInfo.hasMenu
                                ? "hover:bg-gray-100"
                                : "text-gray-400 cursor-default"
                            }
                            ${
                              dayInfo.hasMenu
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                            }
                            ${
                              selectedDate === dayInfo.date ? "bg-blue-100" : ""
                            }
                          `}
                        >
                          <div className="text-sm">{dayInfo.day}</div>
                          {dayInfo.hasData && (
                            <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Sales data available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border-2 border-blue-500 bg-blue-50 rounded-md mr-2"></div>
                      <span>Menu available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend & Info Section */}
            <div className="md:col-span-1">
              <div className="bg-white shadow-sm rounded-md p-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Recent Menus
                </h3>
                <div className="space-y-3">
                  {Object.entries(historicalMenus)
                    .sort((a, b) => b[0].localeCompare(a[0])) // Sort dates in descending order
                    .slice(0, 4) // Take only the most recent 4
                    .map(([date, menu]) => (
                      <button
                        key={date}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md border border-gray-200"
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedDateData({
                            date,
                            salesData:
                              processedData.find((d) => d.date === date) ||
                              null,
                            menuData: menu,
                          });
                          setShowModal(true);
                        }}
                      >
                        <div className="font-medium">{menu.name}</div>
                        <div className="text-xs text-gray-500">
                          {formatDate(date)}
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              <div className="bg-white shadow-sm rounded-md p-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Menu Insights
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Use the archive to identify your most successful menus and
                  understand seasonal trends.
                </p>
                <div className="p-3 bg-green-50 rounded-md">
                  <p className="text-sm font-medium text-green-800">Pro Tip</p>
                  <p className="text-sm text-green-700 mt-1">
                    Compare holiday menus from year to year to optimize your
                    special offerings and pricing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Menu Details Modal */}
      {showModal && selectedDateData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Menu Archive: {formatDate(selectedDateData.date)}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedDateData(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {selectedDateData.menuData ? (
                <div>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-blue-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium text-blue-800">
                          {selectedDateData.menuData.name}
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          {selectedDateData.menuData.description}
                        </p>
                        {selectedDateData.menuData.insights && (
                          <p className="text-sm text-blue-700 mt-2 italic">
                            "{selectedDateData.menuData.insights}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedDateData.salesData && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white border rounded-md p-4">
                        <div className="text-sm text-gray-500 font-medium">
                          TOTAL SALES
                        </div>
                        <div className="text-xl font-bold text-gray-800">
                          {selectedDateData.salesData.totalSales}
                        </div>
                      </div>
                      <div className="bg-white border rounded-md p-4">
                        <div className="text-sm text-gray-500 font-medium">
                          TOTAL REVENUE
                        </div>
                        <div className="text-xl font-bold text-gray-800">
                          ${selectedDateData.salesData.totalRevenue.toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-white border rounded-md p-4">
                        <div className="text-sm text-gray-500 font-medium">
                          AVG ORDER VALUE
                        </div>
                        <div className="text-xl font-bold text-gray-800">
                          $
                          {(
                            selectedDateData.salesData.totalRevenue /
                            selectedDateData.salesData.totalSales
                          ).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Menu Items
                  </h3>
                  <div className="bg-white border rounded-md divide-y">
                    {selectedDateData.menuData.items.map((item, index) => {
                      // Find this item in the sales data if available
                      const dishData = selectedDateData.salesData?.dishes.find(
                        (d) => d.name === item
                      );

                      return (
                        <div
                          key={index}
                          className="p-4 flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium text-gray-800">
                              {item}
                            </div>
                            {dishData && (
                              <div className="text-sm text-gray-500">
                                {dishData.orders} orders
                              </div>
                            )}
                          </div>
                          {dishData && (
                            <div className="text-green-600 font-semibold">
                              ${dishData.revenue.toFixed(2)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Link
                      to={`/menus/${selectedDateData.menuData.id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                    >
                      View Full Menu Details
                    </Link>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition">
                      Compare with Current Menu
                    </button>
                  </div>
                </div>
              ) : selectedDateData.salesData ? (
                <div>
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-amber-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium text-amber-800">
                          No specific menu recorded for this date
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                          We have sales data, but no record of which menu was
                          active. This was likely the standard menu.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white border rounded-md p-4">
                      <div className="text-sm text-gray-500 font-medium">
                        TOTAL SALES
                      </div>
                      <div className="text-xl font-bold text-gray-800">
                        {selectedDateData.salesData.totalSales}
                      </div>
                    </div>
                    <div className="bg-white border rounded-md p-4">
                      <div className="text-sm text-gray-500 font-medium">
                        TOTAL REVENUE
                      </div>
                      <div className="text-xl font-bold text-gray-800">
                        ${selectedDateData.salesData.totalRevenue.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-white border rounded-md p-4">
                      <div className="text-sm text-gray-500 font-medium">
                        AVG ORDER VALUE
                      </div>
                      <div className="text-xl font-bold text-gray-800">
                        $
                        {(
                          selectedDateData.salesData.totalRevenue /
                          selectedDateData.salesData.totalSales
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Items Sold
                  </h3>
                  <div className="bg-white border rounded-md divide-y">
                    {selectedDateData.salesData.dishes
                      .sort((a, b) => b.orders - a.orders) // Sort by number of orders
                      .map((dish, index) => (
                        <div
                          key={index}
                          className="p-4 flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium text-gray-800">
                              {dish.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {dish.orders} orders
                            </div>
                          </div>
                          <div className="text-green-600 font-semibold">
                            ${dish.revenue.toFixed(2)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="text-gray-500 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No Menu Data Available
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    There is no menu or sales data recorded for this date. Try
                    selecting a date highlighted in green or blue on the
                    calendar.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivePage;
