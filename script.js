// Register the service worker for offline capabilities
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registered', reg))
        .catch(err => console.error('Service Worker registration failed', err));
}

document.addEventListener('DOMContentLoaded', () => {
    const counterDisplay = document.getElementById('counter-display');
    const addButton = document.getElementById('add-drink-button');
    const resetButton = document.getElementById('reset-button');

    let count = 0;
    const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

    // Function to update the display
    function updateDisplay() {
        counterDisplay.textContent = count;
    }

    // Function to save data to local storage
    function saveData() {
        localStorage.setItem('drinkCount', count);
        localStorage.setItem('lastDrinkTimestamp', Date.now());
    }

    // Function to load and check data on startup
    function loadData() {
        const savedCount = localStorage.getItem('drinkCount');
        const lastTimestamp = localStorage.getItem('lastDrinkTimestamp');

        if (savedCount !== null && lastTimestamp !== null) {
            const timeSinceLastDrink = Date.now() - parseInt(lastTimestamp, 10);
            
            // AUTOMATIC RESET LOGIC
            if (timeSinceLastDrink > TWENTY_FOUR_HOURS_IN_MS) {
                // If it's been more than 24 hours, reset
                count = 0;
                saveData(); // Save the reset state
            } else {
                // Otherwise, load the saved count
                count = parseInt(savedCount, 10);
            }
        }
        updateDisplay();
    }

    // Event listener for the main button
    addButton.addEventListener('click', () => {
        count++;
        updateDisplay();
        saveData();
    });

    // Event listener for the "semi-hidden" reset button
    resetButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the link from navigating
        // Confirmation dialog to prevent accidental resets
        if (confirm('Are you sure you want to reset the counter to 0?')) {
            count = 0;
            updateDisplay();
            saveData();
        }
    });

    // Load data when the app starts
    loadData();
});