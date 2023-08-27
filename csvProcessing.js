// Read the 'data.csv' file using Fetch API
fetch('data.csv')
    .then(response => response.text())
    .then(csvData => {
        // Split the CSV data into rows
        const rows = csvData.split('\n');
        
        // Process each row to handle the merged cells
        const processedRows = rows.map(row => {
            const columns = row.split(',');
            
            // Check if the first column starts with a double-quoted string
            if (columns[0].startsWith('"')) {
                // If yes, find the end of the merged cell
                let endMergedIndex = -1;
                for (let i = 0; i < columns.length; i++) {
                    if (columns[i].endsWith('"')) {
                        endMergedIndex = i;
                        break;
                    }
                }
                
                // Merge the parts of the merged cell
                const mergedCell = columns.slice(0, endMergedIndex + 1).join(',');
                
                // Remove the merged cell parts from the array
                columns.splice(0, endMergedIndex + 1);
                
                // Insert the merged cell as the first column
                columns.unshift(mergedCell);
            }
            
            // Join the columns back to a row
            return columns.join(',');
        });
        
        // Join the processed rows back to CSV format
        const processedCsvData = processedRows.join('\n');
        
        // Create a Blob containing the processed CSV data
        const blob = new Blob([processedCsvData], { type: 'text/csv' });
        
        // Create a URL for the Blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Create a download link
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'processed_data.csv'; // Set the desired filename
        
        // Append the link to the DOM and click it to trigger download
        document.body.appendChild(link);
        link.click();
        
        // Clean up the Blob URL
        URL.revokeObjectURL(blobUrl);
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });
