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
    // Implement the calendar generation logic here
    // Update the calendarDays state with the generated days
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
    const selected = new Date(currentYear, currentMonth, day);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setSelectedDate(selected.toLocaleDateString(undefined, options));
    setShowModal(true);
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="lg:w-7/12 md:w-9/12 sm:w-10/12 mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 bg-gray-700">
            <button onClick={handlePrevMonth} className="text-white">Previous</button>
            <h2 className="text-white">{`${currentMonth + 1}/${currentYear}`}</h2>
            <button onClick={handleNextMonth} className="text-white">Next</button>
          </div>
          <div className="grid grid-cols-7 gap-2 p-4">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => handleDateClick(day)}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal fixed inset-0 flex items-center justify-center z-50">
          {/* Modal content */}
          <div className="modal-content">
            <p>{selectedDate}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivePage;
