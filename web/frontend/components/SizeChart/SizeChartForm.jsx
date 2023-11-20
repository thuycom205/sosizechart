import React, { useState, useCallback } from 'react';
import { IndexTable, Page, Card, TextField, Button, TextStyle } from '@shopify/polaris';

const SizeChartForm = ({
                           tableData, onSizeChartChange
}) => {
    // const [tableData, setTableData] = useState([
    //     ['Size', 'S', 'M', 'L'],
    //     ['EU Size', '46', '50', '54'],
    //     ['US Size', '36', '40', '44'],
    //     ['Chest (in)', '34-36', '38-40', '42-44'],
    //     ['Waist (in)', '28-30', '32-34', '36-38'],]);
    //
    // setTableData(sizeChart);

    // Assume the first row contains headings
    const headings = tableData.length > 0 ? tableData[0] : [];

    const handleCellChange = useCallback((rowIndex, columnIndex, value) => {
        const newData = [...tableData];
        newData[rowIndex][columnIndex] = value;
        onSizeChartChange(newData); // Call the function passed from the parent
    }, [tableData]);

    const rowMarkup = tableData.slice(1).map((row, rowIndex) => {
        return (
            <IndexTable.Row id={String(rowIndex)} key={rowIndex} position={rowIndex}>
                {row.map((content, columnIndex) => (
                    <IndexTable.Cell key={`${rowIndex}-${columnIndex}`}>
                        <TextField
                            value={content}
                            onChange={(value) => handleCellChange(rowIndex + 1, columnIndex, value)}
                            autoComplete="off"
                        />
                    </IndexTable.Cell>
                ))}
                <IndexTable.Cell>
                    <Button destructive onClick={() => deleteRow(rowIndex)}>Delete</Button>
                </IndexTable.Cell>
            </IndexTable.Row>
        );
    });

    // const deleteRow = useCallback((rowIndex) => {
    //     const newData = [...tableData];
    //     newData.splice(rowIndex + 1, 1); // +1 because we have sliced the first row of headings
    //     onSizeChartChange(newData); // Update the parent state
    // }, [tableData]);

    const deleteRow = (rowIndex) => {
        const newData = [...tableData];
        newData.splice(rowIndex + 1, 1); // +1 because we have sliced the first row of headings
        onSizeChartChange(newData); // Update the parent state
    };
    // Function to add a new row with default values
    const addRow = () => {
        const newRow = new Array(tableData[0].length).fill('');
        newRow[0] = 'New Measurement';
        onSizeChartChange([...tableData, newRow]);
        // Default label for new rows
       // setTableData([...tableData, newRow]);
    };

    // Function to add a new column with default values
    const addColumn = () => {
        const newColumnLabel = `Size ${String.fromCharCode(65 + tableData[0].length - 1)}`; // Generate next size label
        const newData = tableData.map((row, index) => {
            const newItem = index === 0 ? newColumnLabel : ''; // Add new size label on the first row
            return [...row, newItem];
        });
        onSizeChartChange(newData);

        // setTableData(newData);
    };

    // Define the resource name for Polaris IndexTable
    const resourceName = {
        singular: 'measurement',
        plural: 'measurements',
    };

    return (
        <Page title="Editable Size Chart">
            <Card>
                <IndexTable
                    resourceName={resourceName}
                    itemCount={tableData.length - 1} // We subtract one for the heading row
                    headings={headings.map((heading, index) => (
                        <IndexTable.Cell key={index}>
                            <TextStyle variation="strong">{heading}</TextStyle>
                        </IndexTable.Cell>
                    ))}
                    selectable={false}
                >
                    {rowMarkup}
                </IndexTable>
                <div style={{ marginTop: 'var(--p-space-3)', marginBottom: 'var(--p-space-3)'  }}>
                    <Button onClick={() => addRow()}>Add Measurement</Button>
                    <Button onClick={() => addColumn()}>Add Size</Button>
                    {/* Add functionality for these button actions */}
                </div>
            </Card>
        </Page>
    );
};

export default SizeChartForm;
