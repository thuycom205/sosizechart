import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure to import the Bootstrap CSS

const EditableTable = () => {
    const [errors, setErrors] = useState([]);
    const [editId, setEditId] = useState(0);
    const validateTableData = () => {
        let isValid = true;
        const newErrors = {};
        tableData.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const cellKey = `row-${rowIndex}-cell-${cellIndex}`;
                if (cell.trim() === '' ) { // Assuming first row is headers
                    newErrors[cellKey] = 'Cell cannot be empty';
                    isValid = false;
                } else {
                    newErrors[cellKey] = '';
                }
            });
        });
        setErrors(newErrors);
        return isValid;
    };
    const sampleData = [
        ['Size', 'S', 'M', 'L'],
        ['EU Size', '46', '50', '54'],
        ['US Size', '36', '40', '44'],
        ['Chest (in)', '34-36', '38-40', '42-44'],
        ['Waist (in)', '28-30', '32-34', '36-38'],
        // ... any other measurements you want to include
    ];
    // Initial state for the table data with size chart information
    const [tableData, setTableData] = useState(sampleData);

    useEffect(() => {
        const queryString =
            window.DEVPARAMS;
        const params = new URLSearchParams(queryString);

// Get the 'shop' parameter from the query string
        const shop = params.get('shop');
        const session = params.get('session');

        // Fetch the data when the component mounts
        // Fetch the data when the component mounts
        fetch(`/api/sizechart/get?shop=${encodeURIComponent(shop)}&session=${encodeURIComponent(session)}`)
            .then(response => response.json())
            .then(data => {
                // Check if the data is not empty and has the expected properties
                if (data && data.hasOwnProperty('id') && data.hasOwnProperty('sizechart_data')) {
                    // Set the edit ID if it's available
                    setEditId(data.id);

                    // Assuming 'sizechart_data' is already an array
                    // If 'sizechart_data' is a serialized string, you'll need to parse it as JSON
                    // For example, you might need to do JSON.parse(data.sizechart_data) if it's a JSON string
                    setTableData(data.sizechart_data);
                } else {
                    // Handle the scenario where data is not in the expected format
                    console.error('Error: Data is not in the expected format:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                // If there's an error fetching the data, handle it appropriately
                // For example, you might want to set a state variable to show an error message to the user
            });

    }, []);

    const handleSubmit = () => {
        if (!validateTableData()) {
            // Do not submit if validation fails
            return;
        }
        const host =
            window.DEVPARAMS;
        const payload = {
            editId: editId,
            devparams: host,
            // The id you want to send
            tableData: tableData // Your existing table data
        };
        // Submit the edited data
        fetch('/api/sizechart/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                // Handle successful submission here
            })
            .catch((error) => {
                // Handle errors here
            });
    };

    // Define the color styles
    const headerStyle = { backgroundColor: '#f8d7da' }; // light pinkish color for the header
    const rowStyles = [
        { backgroundColor: '#ffffff' }, // white background for one row
        { backgroundColor: '#f2f2f2' }, // light grey background for the alternate row
    ];

    // Function to get the style for a row based on its index
    const getRowStyle = (index) => rowStyles[index % rowStyles.length];

    // Function to handle cell value changes
    const handleCellChange = (rowIndex, columnIndex, value) => {
        const newData = [...tableData];
        newData[rowIndex][columnIndex] = value;
        setTableData(newData);
    };

    // Function to add a new row with default values
    const addRow = () => {
        const newRow = new Array(tableData[0].length).fill('');
        newRow[0] = 'New Measurement'; // Default label for new rows
        setTableData([...tableData, newRow]);
    };

    // Function to delete a row
    const deleteRow = (rowIndex) => {
        const newData = tableData.filter((_, index) => index !== rowIndex);
        setTableData(newData);
    };

    // Function to add a new column with default values
    const addColumn = () => {
        const newColumnLabel = `Size ${String.fromCharCode(65 + tableData[0].length - 1)}`; // Generate next size label
        const newData = tableData.map((row, index) => {
            const newItem = index === 0 ? newColumnLabel : ''; // Add new size label on the first row
            return [...row, newItem];
        });
        setTableData(newData);
    };

    // Function to delete a column
    const deleteColumn = (columnIndex) => {
        const newData = tableData.map(row => {
            row.splice(columnIndex, 1);
            return row;
        });
        setTableData(newData);
    };

    return (
        <div className="container mt-3">
            <div className="row mb-2">
                <button className="btn btn-primary mr-2 mb-2" onClick={addRow}>Add Measurement</button>
                <button className="btn btn-primary mb-2" onClick={addColumn}>Add Size</button>
            </div>
            <table className="table table-bordered">
                <tbody>
                {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, columnIndex) => (
                            <td key={columnIndex}>
                                <input
                                    className={`form-control ${rowIndex === 0 ? 'font-weight-bold' : ''}`}
                                    type="text"
                                    value={cell}
                                    onChange={(e) => handleCellChange(rowIndex, columnIndex, e.target.value)}
                                />
                            </td>
                        ))}
                        {rowIndex !== 0 && (
                            <td>
                                <button className="btn btn-danger" onClick={() => deleteRow(rowIndex)}>
                                    Delete Measurement
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
            {tableData.length > 1 && (
                <div className="row">
                    {tableData[0].map((_, columnIndex) => (
                        columnIndex !== 0 && (
                            <button
                                key={columnIndex}
                                className="btn btn-secondary mr-2 mb-2"
                                onClick={() => deleteColumn(columnIndex)}
                            >
                                Delete Size {tableData[0][columnIndex]}
                            </button>
                        )
                    ))}
                </div>
            )}
            {/* Submit button with good layout and styling */}
            <div className="text-right">
                <button className="btn btn-success btn-lg" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default EditableTable;
