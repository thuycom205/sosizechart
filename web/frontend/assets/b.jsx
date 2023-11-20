import React, { useState } from 'react';

const EditableTable = () => {
    const [tableData, setTableData] = useState([
        ['Size', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
        ['US', '0', '2', '4', '6', '8', '10', '12', '14'],
        ['EUR', '32', '34', '36', '38', '40', '42', '44', '46'],
        // ... more rows with size chart data
    ]);

    // Define the color styles
    const headerStyle = { backgroundColor: '#f8d7da' }; // light pinkish color for the header
    const rowStyles = [
        { backgroundColor: '#ffffff' }, // white background for one row
        { backgroundColor: '#f2f2f2' }, // light grey background for the alternate row
    ];

    // Function to get the style for a row based on its index
    const getRowStyle = (index) => rowStyles[index % rowStyles.length];

    // ... other functions (handleCellChange, addRow, deleteRow, addColumn, deleteColumn) ...

    return (
        <div>
            <button onClick={addRow}>Add Measurement</button>
            <button onClick={addColumn}>Add Size</button>
            <table>
                <tbody>
                {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex} style={rowIndex === 0 ? headerStyle : getRowStyle(rowIndex)}>
                        {row.map((cell, columnIndex) => (
                            <td key={columnIndex}>
                                <input
                                    type="text"
                                    value={cell}
                                    onChange={(e) => handleCellChange(rowIndex, columnIndex, e.target.value)}
                                    style={rowIndex === 0 ? { fontWeight: 'bold' } : {}}
                                />
                            </td>
                        ))}
                        {rowIndex !== 0 && (
                            <td>
                                <button onClick={() => deleteRow(rowIndex)}>Delete Measurement</button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
            {tableData.length > 0 && (
                <div>
                    {tableData[0].map((_, columnIndex) => (
                        columnIndex !== 0 && (
                            <button key={columnIndex} onClick={() => deleteColumn(columnIndex)}>
                                Delete Size {tableData[0][columnIndex]}
                            </button>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default EditableTable;
