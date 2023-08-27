const dropdownData = [
    ['IISc', 'IIT Roorkee', 'IIT Delhi', 'IIT BHU', 'IIT Bhubaneshwar', 'IIT Bombay', 'IIT GN', 'IIT Hyd', 'IIT Kanpur', 'IIT Madras', 'IIT Patna'],
    ['ETC', 'M', 'Other'],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    ['Commercialized', 'Demonstration', 'Lab', 'Pilot']
];

const dropdownButtonNames = [
    'Research Lab',
    'Application Domain',
    'TRL (2019-2020)',
    'Current TRL',
    'Status of Technology'
];

const columnMappings = {
    1: 2, // Dropdown 1 maps to Column 2
    2: 5, // Dropdown 2 maps to Column 5
    3: 6, // Dropdown 3 maps to Column 6
    4: 7, // Dropdown 4 maps to Column 7
    5: 8  // Dropdown 5 maps to Column 8
};

async function loadTableData() {
    try {
        const response = await fetch('processed_data.csv'); // Replace with actual CSV file path
        const csvText = await response.text();
        const rows = csvText.split('\n').splice(1);
        console.log(rows)

        const tableBody = document.getElementById('tableBody');

        // Loop through rows and create table rows
        rows.forEach(row => {
            const columns = row.split(',');
            const tableRow = document.createElement('tr');
            columns.forEach(column => {
                const cell = document.createElement('td');
                cell.textContent = column;
                tableRow.appendChild(cell);
            });
            tableBody.appendChild(tableRow);
        });
    } catch (error) {
        console.error('Error loading table data:', error);
    }
}


// Function to create a checkbox dropdown
// Function to create a checkbox dropdown
// Function to create a checkbox dropdown
function createDropdownWithCheckboxes(data, buttonName, columnIndex) {
    const container = document.getElementById('dropdownContainer');

    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown', 'mb-3', 'me-3');

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-secondary', 'dropdown-toggle');
    button.type = 'button';
    button.dataset.bsToggle = 'dropdown';
    button.textContent = buttonName;

    const dropdownMenu = document.createElement('div');
    dropdownMenu.classList.add('dropdown-menu');
    dropdownMenu.setAttribute('data-dropdown-index', columnIndex); // Use the column index as identifier

    data.forEach(item => {
        const label = document.createElement('label');
        label.classList.add('dropdown-item');
        label.innerHTML = `
            <input type="checkbox" class="form-check-input" data-dropdown-index="${columnIndex}" value="${item}">
            ${item}
        `;
        dropdownMenu.appendChild(label);
    });

    dropdown.appendChild(button);
    dropdown.appendChild(dropdownMenu);
    container.appendChild(dropdown);

    // Open dropdown and prevent it from closing when interacting with checkboxes
    button.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', function () {
        dropdownMenu.classList.remove('show');
    });

    // Prevent dropdown from closing when interacting with checkboxes
    dropdownMenu.addEventListener('click', function (e) {
        e.stopPropagation();
    });
}

// Function to update the table based on selected checkboxes
function updateTableFilter() {
    const selectedCheckboxValues = {};

    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        const columnIndex = parseInt(menu.getAttribute('data-dropdown-index'));
        const selectedCheckboxes = menu.querySelectorAll('.form-check-input:checked');
        const selectedValues = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
        selectedCheckboxValues[columnIndex] = selectedValues;
    });

    const rows = document.querySelectorAll('#tableBody tr');

    rows.forEach(row => {
        let shouldBeVisible = true;

        for (const columnIndex in selectedCheckboxValues) {
            const cellValue = row.children[columnIndex].textContent;

            if (!selectedCheckboxValues[columnIndex].includes(cellValue)) {
                shouldBeVisible = false;
                break;
            }
        }

        row.style.display = shouldBeVisible ? 'table-row' : 'none';
    });
}

// Attach event listeners to checkboxes to update table filter
document.addEventListener('change', function (e) {
    if (e.target.classList.contains('form-check-input')) {
        updateTableFilter();
    }
});

// Call the function to load and populate table data
loadTableData();

// Call the function to create the dropdowns
createDropdownWithCheckboxes(dropdownData[0], dropdownButtonNames[0], 1); // Corresponds to Column 2
createDropdownWithCheckboxes(dropdownData[1], dropdownButtonNames[1], 4); // Corresponds to Column 5
createDropdownWithCheckboxes(dropdownData[2], dropdownButtonNames[2], 5); // Corresponds to Column 6
createDropdownWithCheckboxes(dropdownData[3], dropdownButtonNames[3], 6); // Corresponds to Column 7
createDropdownWithCheckboxes(dropdownData[4], dropdownButtonNames[4], 7); // Corresponds to Column 8
