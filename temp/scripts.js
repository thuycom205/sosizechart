let numRows = 10;
let numCols = 14;
let selectedSeatType = 'standard';

function generateLayout() {
    const editor = document.getElementById('layoutEditor');
    editor.innerHTML = "";
    editor.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            let seat = document.createElement('div');
            seat.classList.add('seat', selectedSeatType);
            let span = document.createElement('span');
            span.textContent = `${String.fromCharCode(65 + i)}${j + 1}`;
            seat.appendChild(span);
            seat.addEventListener('click', () => toggleSeatType(seat));
            editor.appendChild(seat);
        }
    }
}

function toggleSeatType(seat) {
    seat.className = ''; // Clear classes
    seat.classList.add('seat', selectedSeatType); // Add back 'seat' and the selected type
}

function selectSeatType(type) {
    selectedSeatType = type;
}

// Initial generation of the layout
generateLayout();
