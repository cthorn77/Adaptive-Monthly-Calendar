const calendar = document.getElementById('calendar');
const button = document.getElementById('button');

button.addEventListener('click', function() {
    let startDay = document.getElementById('start-day').value;
    let month = document.getElementById('month').value;
    let year = parseInt(document.getElementById('year').value);
    
    if (year < 1900 || year > 2025 || isNaN(year)) {
        alert('Year must be between 1900 and 2025');
        return;
    }
    
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
                    calendar.innerHTML += `<p class="center-item add-top-border">${content}</p>`;
                } else {
                    calendar.innerHTML += `<p class="center-item add-top-border add-border">${content}</p>`;
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