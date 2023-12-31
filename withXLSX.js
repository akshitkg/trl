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
        const response = await fetch('data.xlsx'); // Replace with actual Excel file path
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Assuming you want to read the first sheet
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const tableBody = document.getElementById('tableBody');

        jsonData.forEach(row => {
            const tableRow = document.createElement('tr');
            row.forEach(column => {
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

    // New code for pagination
    // const allCheckboxesUnselected = Object.values(selectedCheckboxValues).every(values => values.length === 0);

    // // If all checkboxes are unselected, show all rows
    // if (allCheckboxesUnselected) {
    //     rows.forEach(row => {
    //         row.style.display = 'table-row';
    //     });
    // }

    // // Add the following code to update the pagination
    // updatePagination();

}

// function updatePagination() {
//     const rowsPerPage = 30;
//     const totalRows = document.querySelectorAll('#tableBody tr[style="display: table-row;"]').length;

//     const pageCount = Math.ceil(totalRows / rowsPerPage);
//     const paginationContainer = document.getElementById('pagination');
//     paginationContainer.innerHTML = ''; // Clear previous pagination items

//     for (let i = 1; i <= pageCount; i++) {
//         const li = document.createElement('li');
//         li.classList.add('page-item');
//         const link = document.createElement('a');
//         link.classList.add('page-link');
//         link.href = '#';
//         link.textContent = i;
//         li.appendChild(link);
//         paginationContainer.appendChild(li);

//         link.addEventListener('click', function () {
//             showPage(i);
//         });
//     }

//     showPage(1); // Show the first page by default
// }

// function showPage(pageNumber) {
//     const rowsPerPage = 30;
//     const startIndex = (pageNumber - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;

//     const rows = document.querySelectorAll('#tableBody tr');
//     rows.forEach((row, index) => {
//         if (index >= startIndex && index < endIndex) {
//             row.style.display = 'table-row';
//         } else {
//             row.style.display = 'none';
//         }
//     });
// }





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

    // Check if all checkboxes are unselected
    const allCheckboxesUnselected = Object.values(selectedCheckboxValues).every(values => values.length === 0);

    // If all checkboxes are unselected, show all rows
    if (allCheckboxesUnselected) {
        rows.forEach(row => {
            row.style.display = 'table-row';
        });
    }
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


// updatePagination();
