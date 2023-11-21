import React, { useState, useCallback } from 'react';
import { Card, Page, Button, TextField, Stack } from '@shopify/polaris';

const SizeChartForm = ({ tableData, onSizeChartChange,title, onTitleChange }) => {
    // Check if there's more than one column to allow deletion
    const canDeleteColumn = tableData[0]?.length > 1;

    // Handles change in cell value
    const handleCellChange = useCallback((rowIndex, columnIndex, value) => {
        const newData = [...tableData];
        newData[rowIndex][columnIndex] = value;
        onSizeChartChange(newData);
    }, [tableData, onSizeChartChange]);

    // Adds a new row with default values
    const addRow = useCallback(() => {
        const newRow = new Array(tableData[0].length).fill('');
        const newData = [...tableData, newRow];
        onSizeChartChange(newData);
    }, [tableData, onSizeChartChange]);

    // Adds a new column with default values
    const addColumn = useCallback(() => {
        const newData = tableData.map(row => [...row, '']);
        onSizeChartChange(newData);
    }, [tableData, onSizeChartChange]);

    // Deletes a specific row
    const deleteRow = useCallback((rowIndex) => {
        const newData = [...tableData];
        newData.splice(rowIndex, 1);
        onSizeChartChange(newData);
    }, [tableData, onSizeChartChange]);

    // Deletes a specific column
    const deleteColumn = useCallback((columnIndex) => {
        if (!canDeleteColumn) return;
        const newData = tableData.map(row => {
            const newRow = [...row];
            newRow.splice(columnIndex, 1);
            return newRow;
        });
        onSizeChartChange(newData);
    }, [tableData, onSizeChartChange, canDeleteColumn]);

    // Render the table with functionality to delete rows and columns
    const tableMarkup = tableData.map((row, rowIndex) => (
        <tr key={rowIndex}>
            {row.map((cell, columnIndex) => (
                <td key={`${rowIndex}-${columnIndex}`}>
                    <TextField
                        value={cell}
                        onChange={(value) => handleCellChange(rowIndex, columnIndex, value)}
                        autoComplete="off"
                    />
                </td>
            ))}
            <td>
                <Button onClick={() => deleteRow(rowIndex)} destructive>
                    Delete Measurement
                </Button>
            </td>
        </tr>
    ));

    // Render the headers with functionality to delete columns
    const headerMarkup = (
        <tr>
            {tableData[0].map((header, columnIndex) => (
                <th key={`header-${columnIndex}`}>
                    <Stack alignment="center">
                        {/*<TextField*/}
                        {/*    value={header}*/}
                        {/*    onChange={(value) => handleCellChange(0, columnIndex, value)}*/}
                        {/*    autoComplete="off"*/}
                        {/*/>*/}
                        {canDeleteColumn && columnIndex > 0 && (
                            <Button onClick={() => deleteColumn(columnIndex)}  plain >
                                Delete
                            </Button>
                        )}
                    </Stack>
                </th>
            ))}
            <th />
        </tr>
    );

    return (
        <Page title="Editable Size Chart">
            <Card sectioned>
                <TextField label="Title *" value={title} onChange={onTitleChange} />
            </Card>
            <Card sectioned>
                <div style={{ marginBottom: '1rem' }}>
                    <Button onClick={addRow}>Add Measurement</Button>
                    <Button onClick={addColumn} primary>
                        Add Size
                    </Button>
                </div>
                <table>
                    <thead>{headerMarkup}</thead>
                    <tbody>{tableMarkup}</tbody>
                </table>
            </Card>
        </Page>
    );
};

export default SizeChartForm;
