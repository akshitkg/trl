function createDropdownItem(text) {
    const item = document.createElement('a');
    item.classList.add('dropdown-item');
    item.textContent = text;
    return item;
}

function createCheckboxItem(text) {
    const label = document.createElement('label');
    label.classList.add('dropdown-item');
    label.innerHTML = `
        <input type="checkbox" class="form-check-input" value="${text}">
        ${text}
    `;
    return label;
}

function populateDropdownMenu(id,items) {
    const checkboxMenu = document.getElementById(id);

    items.forEach(item => {
        checkboxMenu.appendChild(createCheckboxItem(item));
    });
}

async function loadData() {
    try {
        const response = await fetch('data.csv'); // Replace with the actual path to your CSV file
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1); // Exclude header row
        const data = rows.map(row => row.split(','));
        console.log(data)

        const uniqueValues = {
            ResearchLab: ['IISc', 'IIT Roorkee', 'IIT Delhi', 'IIT BHU', 'IIT Bhubaneshwar','IIT Bombay','IIT GN', 'IIT Hyd','IIT Kanpur','IIT Madras','IIT Patna'],
            ApplicationDomain: ['ETC','M','Other'],
            TRL: ['(Blanks)',0,1,2,3,4,5,6,7,8,9],
            CurrentTRL: ['(Blanks)',0,1,2,3,4,5,6,7,8,9],
            StatusOfTechnology: ['Commercialized','Demonstration','Lab','Pilot']
            // Add other columns as needed
        };
        const filterDropdownIds=['checkboxMenu1','checkboxMenu2','checkboxMenu3','checkboxMenu4','checkboxMenu5']
        populateDropdownMenu(filterDropdownIds[0],uniqueValues.ResearchLab)
        // populateDropdownMenu(filterDropdownIds[1],uniqueValues.ApplicationDomain)
        // populateDropdownMenu(filterDropdownIds[2],uniqueValues.TRL)
        // populateDropdownMenu(filterDropdownIds[3],uniqueValues.CurrentTRL)
        // populateDropdownMenu(filterDropdownIds[4],uniqueValues.StatusOfTechnology)

        // data.forEach(columns => {
        //     const [column1, column2] = columns; // Adjust based on your CSV columns
        //     uniqueValues.column1.add(column1);
        //     uniqueValues.column2.add(column2);
        //     // Update other columns accordingly
        // });

        const filterDropdown1 = document.getElementById('filterColumn1');
        // const filterDropdown2 = document.getElementById('filterColumn2');
        // Get other filter dropdowns

        uniqueValues.ResearchLab.forEach(value => {
            filterDropdown1.querySelector('.dropdown-menu').appendChild(createDropdownItem(value));
        });
        console.log('here')

        // uniqueValues.column2.forEach(value => {
        //     filterDropdown2.querySelector('.dropdown-menu').appendChild(createDropdownItem(value));
        // });
        // Append items for other filter dropdowns

        const tableBody = document.getElementById('tableBody');
        data.forEach(columns => {
            const [column1, column2] = columns; // Adjust based on your CSV columns
            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
                <td>${column1}</td>
                <td>${column2}</td>
                <!-- Add other columns here -->
            `;
            tableBody.appendChild(tableRow);
        });
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

loadData();
