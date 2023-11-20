import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure to import the Bootstrap CSS

const EditableTable = () => {
    // ... (the rest of your component stays the same)

    return (
        <div className="container mt-3">
            <div className="row mb-2">
                <button className="btn btn-primary mr-2" onClick={addRow}>Add Measurement</button>
                <button className="btn btn-primary" onClick={addColumn}>Add Size</button>
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
                                className="btn btn-secondary mr-2"
                                onClick={() => deleteColumn(columnIndex)}
                            >
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
