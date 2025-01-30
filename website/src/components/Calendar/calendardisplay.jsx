// Function to generate the calendar for a specific month and year
function generateCalendar(year, month) {
    // ... (rest of the generateCalendar function)
}

// Initialize the calendar with the current month and year
const currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();
generateCalendar(currentYear, currentMonth);

// Event listeners for previous and next month buttons
document.getElementById('prevMonth').addEventListener('click', () => {
    // ... (rest of the prevMonth event listener)
});

document.getElementById('nextMonth').addEventListener('click', () => {
    // ... (rest of the nextMonth event listener)
});

// Function to show the modal with the selected date
function showModal(selectedDate) {
    // ... (rest of the showModal function)
}

// Function to hide the modal
function hideModal() {
    // ... (rest of the hideModal function)
}

// Event listener for date click events
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('cursor-pointer')) {
        const day = parseInt(event.target.innerText);
        const selectedDate = new Date(currentYear, currentMonth, day);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = selectedDate.toLocaleDateString(undefined, options);
        showModal(formattedDate);
    }
});

// Event listener for closing the modal
document.getElementById('closeModal').addEventListener('click', () => {
    hideModal();
});
