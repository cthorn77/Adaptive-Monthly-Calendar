const calendar = document.getElementById('calendar');
const button = document.getElementById('button');
const popupOverlay = document.getElementById('popup-overlay');
const closeBtn = document.getElementById('close-btn');
const popupDate = document.getElementById('popup-date');
const popupEvents = document.getElementById('popup-events');

// Store current calendar data for popup
let currentMonth = null;
let currentYear = null;

button.addEventListener('click', function() {
    let startDay = document.getElementById('start-day').value;
    let month = document.getElementById('month').value;
    let year = parseInt(document.getElementById('year').value);
    
    if (year < 1900 || year > 2025 || isNaN(year)) {
        alert('Year must be between 1900 and 2025');
        return;
    }
    
    // Store current calendar data
    currentMonth = getMonth(month);
    currentYear = year;
    
    displayCalendar(startDay, getMonth(month), year);
});

function displayCalendar(startDay, month, year) {
    const newDate = new Date(year, month, 0);
    const daysInMonth = newDate.getDate();
    
    const firstDay = new Date(year, month - 1, 1);
    const firstDayOfWeek = firstDay.toString().split(" ")[0];
    
    let myMap = new Map();
    myMap.set("Sun", 0);
    myMap.set("Mon", 1);
    myMap.set("Tue", 2);
    myMap.set("Wed", 3);
    myMap.set("Thu", 4);
    myMap.set("Fri", 5);
    myMap.set("Sat", 6);
    
    let startDayIndex = myMap.get(startDay);
    let firstDayIndex = myMap.get(firstDayOfWeek);
    let offset = (firstDayIndex - startDayIndex + 7) % 7;
    
    calendar.innerHTML = displayFirstRow(startDay);
    
    let currentDay = 1;
    
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 13; col++) {
            if (col % 2 === 0) {
                let dayCol = Math.floor(col / 2);
                let cellIndex = row * 7 + dayCol;
                let content = '';
                
                if (cellIndex >= offset && currentDay <= daysInMonth) {
                    content = currentDay;
                    currentDay++;
                }
                
                if (col === 12) {
                    calendar.innerHTML += `<p class="center-item add-top-border" data-day="${content}" data-month="${month}" data-year="${year}">${content}</p>`;
                } else {
                    calendar.innerHTML += `<p class="center-item add-top-border add-border" data-day="${content}" data-month="${month}" data-year="${year}">${content}</p>`;
                }
            } else {
                calendar.innerHTML += '<p class="center-item add-top-border add-border"></p>';
            }
        }
    }
}

function getStartDay(startDay) {
    switch (startDay) {
        case "Mon":
            return 0;
        case "Tue":
            return 1;
        case "Wed":
            return 2;
        case "Thu":
            return 3;
        case "Fri":
            return 4;
        case "Sat":
            return 5;
        case "Sun":
            return 6;
    }
}

function getMonth(month) {
    switch (month) {
        case "January":
            return 1;
        case "February":
            return 2;
        case "March":
            return 3;
        case "April":
            return 4;
        case "May":
            return 5;
        case "June":
            return 6;
        case "July":
            return 7;
        case "August":
            return 8;
        case "September":
            return 9;
        case "October":
            return 10;
        case "November":
            return 11;
        case "December":
            return 12;
    }
}

function displayFirstRow(startDay) {
    let firstRow = "";
    let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    while (startDay !== daysOfWeek[0]) {
        daysOfWeek.push(daysOfWeek.shift());
    }

    for (let i=0; i<13; i++) {
        if (i % 2 === 0) {
            if ((i+1) % 13 === 0) {
                firstRow += `<p class="center-item">${daysOfWeek[i/2]}</p>`;
            } else {
                firstRow += `<p class="center-item add-border">${daysOfWeek[i/2]}</p>`;
            }
        } else {
            if ((i+1) % 13 === 0) {
                firstRow += `<p class="center-item"></p>`;
            } else {
                firstRow += `<p class="center-item add-border"></p>`;
            }
        }
    }

    return firstRow;
}

// Popup functionality
function showPopup(day, month, year) {
    if (!day || day === '') return;
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    
    const dateString = `${monthNames[month - 1]} ${day}, ${year}`;
    popupDate.textContent = `Historical Events on ${dateString}`;
    popupEvents.innerHTML = '<p>Loading historical events...</p>';
    
    popupOverlay.style.display = 'flex';
    
    // Fetch historical events
    fetchHistoricalEvents(day, month, year);
}

function hidePopup() {
    popupOverlay.style.display = 'none';
}

async function fetchHistoricalEvents(day, month, year) {
    try {
        const monthNames = ["January", "February", "March", "April", "May", "June",
                           "July", "August", "September", "October", "November", "December"];
        const dateString = `${monthNames[month - 1]} ${day}, ${year}`;
        const query = `What major historical events happened on ${dateString}? Please provide 3-5 significant events that occurred specifically on this exact date and year. Do not include events from other years.`;
        
        // Use PHP API to make the OpenAI call
        const response = await fetch(`api.php?query=${encodeURIComponent(query)}`);
        const events = await response.text();
        
        // Format the events as a list
        const formattedEvents = formatEventsAsList(events);
        popupEvents.innerHTML = formattedEvents;
    } catch (error) {
        popupEvents.innerHTML = '<p>Sorry, unable to fetch historical events at this time.</p>';
        console.error('Error fetching historical events:', error);
    }
}

function formatEventsAsList(eventsText) {
    // Split the text into lines and filter out empty lines
    const lines = eventsText.split('\n').filter(line => line.trim() !== '');
    
    let html = '<ul>';
    
    lines.forEach(line => {
        // Clean up the line and add as list item
        const cleanLine = line.trim()
            .replace(/^[-•*]\s*/, '') // Remove bullet points if present
            .replace(/^\d+\.\s*/, '') // Remove numbers like "1. " or "2. "
            .replace(/^\d+\)\s*/, '') // Remove numbers like "1) " or "2) "
            .replace(/^\(\d+\)\s*/, ''); // Remove numbers like "(1) " or "(2) "
        
        if (cleanLine) {
            html += `<li>${cleanLine}</li>`;
        }
    });
    
    html += '</ul>';
    
    return html;
}

// Event listeners
closeBtn.addEventListener('click', hidePopup);

popupOverlay.addEventListener('click', function(e) {
    if (e.target === popupOverlay) {
        hidePopup();
    }
});

// Add click handlers to calendar cells after they're created
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('center-item') && e.target.textContent.trim() !== '') {
        const day = parseInt(e.target.textContent);
        const month = parseInt(e.target.dataset.month);
        const year = parseInt(e.target.dataset.year);
        
        if (day && month && year) {
            showPopup(day, month, year);
        }
    }
});

// Close popup with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popupOverlay.style.display === 'flex') {
        hidePopup();
    }
});