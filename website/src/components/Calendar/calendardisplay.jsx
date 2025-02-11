// Function to generate the calendar for a specific month and year
function generateCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  document.querySelector('.flex-auto').textContent = `${monthNames[month]} ${year}`;

  const calendarBody = document.querySelector('.isolate.mt-2.grid');
  calendarBody.innerHTML = '';

  let date = 1;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.classList.add('py-1.5', 'hover:bg-gray-100', 'focus:z-10');

      if (i === 0 && j < startingDay) {
        button.classList.add('bg-gray-50', 'text-gray-400');
        button.disabled = true;
      } else if (date > daysInMonth) {
        button.classList.add('bg-gray-50', 'text-gray-400');
        button.disabled = true;
      } else {
        button.classList.add('bg-white', 'text-gray-900');
        const time = document.createElement('time');
        time.dateTime = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        time.classList.add('mx-auto', 'flex', 'h-7', 'w-7', 'items-center', 'justify-center', 'rounded-full');
        time.textContent = date;
        button.appendChild(time);
        date++;
      }

      if (i === 0 && j === 0) button.classList.add('rounded-tl-lg');
      if (i === 0 && j === 6) button.classList.add('rounded-tr-lg');
      if (i === 5 && j === 0) button.classList.add('rounded-bl-lg');
      if (i === 5 && j === 6) button.classList.add('rounded-br-lg');

      calendarBody.appendChild(button);
    }
  }
}

// Initialize the calendar with the current month and year
const currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();
generateCalendar(currentYear, currentMonth);

// Event listeners for previous and next month buttons
document.querySelector('button[class*="Previous month"]').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar(currentYear, currentMonth);
});

document.querySelector('button[class*="Next month"]').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar(currentYear, currentMonth);
});

// Function to show the modal with the selected date
function showModal(selectedDate) {
  const modal = document.createElement('div');
  modal.id = 'eventModal';
  modal.classList.add('fixed', 'inset-0', 'bg-gray-600', 'bg-opacity-50', 'overflow-y-auto', 'h-full', 'w-full');
  modal.innerHTML = `
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Selected Date</h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500">${selectedDate}</p>
        </div>
        <div class="items-center px-4 py-3">
          <button id="closeModal" class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Function to hide the modal
function hideModal() {
  const modal = document.getElementById('eventModal');
  if (modal) {
    modal.remove();
  }
}

// Event listener for date click events
document.addEventListener('click', (event) => {
  if (event.target.tagName === 'TIME') {
    const selectedDate = new Date(event.target.dateTime);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = selectedDate.toLocaleDateString(undefined, options);
    showModal(formattedDate);
  }
});

// Event listener for closing the modal
document.addEventListener('click', (event) => {
  if (event.target.id === 'closeModal') {
    hideModal();
  }
});

// Add event button functionality
document.querySelector('button[class*="bg-cyan-600"]').addEventListener('click', () => {
  alert('Add event functionality to be implemented');
});
