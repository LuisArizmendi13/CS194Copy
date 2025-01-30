import React, { useState, useEffect } from 'react';

const ArchivePage = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    generateCalendar(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

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
      calendarArray.push(i);
    }

    setCalendarDays(calendarArray);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => {
      if (prevMonth === 0) {
        setCurrentYear(prevYear => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      if (prevMonth === 11) {
        setCurrentYear(prevYear => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };

  const handleDateClick = (day) => {
    if (day !== null) {
      const selected = new Date(currentYear, currentMonth, day);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setSelectedDate(selected.toLocaleDateString(undefined, options));
      setShowModal(true);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen py-8">
      <div className="lg:w-7/12 md:w-9/12 sm:w-10/12 mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 bg-gray-700">
            <button onClick={handlePrevMonth} className="text-white hover:bg-gray-600 px-3 py-1 rounded">Previous</button>
            <h2 className="text-white text-xl font-semibold">{`${monthNames[currentMonth]} ${currentYear}`}</h2>
            <button onClick={handleNextMonth} className="text-white hover:bg-gray-600 px-3 py-1 rounded">Next</button>
          </div>
          <div className="grid grid-cols-7 gap-2 p-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600">{day}</div>
            ))}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`cursor-pointer text-center py-2 ${
                  day ? 'hover:bg-gray-200' : ''
                } ${day === null ? 'text-gray-300' : 'text-gray-700'}`}
                onClick={() => handleDateClick(day)}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <p className="text-xl mb-4">{selectedDate}</p>
            <button 
              onClick={() => setShowModal(false)}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivePage;
