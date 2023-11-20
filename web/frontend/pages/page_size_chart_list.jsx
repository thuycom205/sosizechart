import React, { useState, useCallback, useEffect } from 'react';
import { Page, Button, ResourceList, Card, ResourceItem, TextStyle, Stack, Pagination } from '@shopify/polaris';
import { useNavigate } from "@shopify/app-bridge-react";

const SizeChartsPage = () => {
    const [sizeCharts, setSizeCharts] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItemCount, setTotalItemCount] = useState(0);
    const itemsPerPage = 10;



    const navigate = useNavigate();

    useEffect(() => {
        // Replace this with your API call
        const fetchSizeCharts = async () => {
            // Simulate an API response
            const response = {
                sizeCharts: Array.from({ length: itemsPerPage }, (_, i) => ({
                    id: `${(currentPage - 1) * itemsPerPage + i + 1}`,
                    title: `Size Chart ${(currentPage - 1) * itemsPerPage + i + 1}`,
                })),
                totalItemCount: 50, // Replace with actual count from the API
            };

            setSizeCharts(response.sizeCharts);
            setTotalItemCount(response.totalItemCount);
        };

        fetchSizeCharts();
    }, [currentPage, itemsPerPage]);

    const handleCreateNew = useCallback(() => {
        console.log('Create new size chart');
        navigate(`/page_sizechart?editId=${0}`);

        // TODO: Implement create new size chart logic
    }, []);

    const handleEdit = useCallback((id) => {
        console.log(`Edit size chart with id: ${id}`);
        // TODO: Implement edit size chart logic
    }, []);

    const handleNextPage = useCallback(() => {
        setCurrentPage(currentPage + 1);
    }, [currentPage]);

    const handlePreviousPage = useCallback(() => {
        setCurrentPage(currentPage - 1);
    }, [currentPage]);

    const handleSelectionChange = useCallback((items) => {
        setSelectedItems(items);
    }, []);

    const handleDeleteSelected = useCallback(() => {
        console.log('Deleting selected size charts:', selectedItems);
        // TODO: Implement delete selected size charts logic
        // After deleting, you may want to fetch the size charts again to update the list
    }, [selectedItems]);

    const bulkActions = [
        {
            content: 'Delete',
            onAction: handleDeleteSelected,
        },
    ];

    return (
        <Page
            title="Size Charts"
            primaryAction={{
                content: 'Create Size Chart',
                onAction: handleCreateNew,
            }}
        >
            <Card>
                <ResourceList
                    resourceName={{ singular: 'size chart', plural: 'size charts' }}
                    items={sizeCharts}
                    selectedItems={selectedItems}
                    onSelectionChange={handleSelectionChange}
                    bulkActions={bulkActions}
                    renderItem={(item) => {
                        const { id, title } = item;
                        return (
                            <ResourceItem
                                id={id}
                                accessibilityLabel={`Edit ${title}`}
                                name={title}
                                persistActions
                                shortcutActions={[{ content: 'Edit', onAction: () => handleEdit(id) }]}
                            >
                                <Stack alignment="center" distribution="equalSpacing">
                                    <TextStyle variation="strong">{title}</TextStyle>
                                </Stack>
                            </ResourceItem>
                        );
                    }}
                />
                <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        label={`Page ${currentPage} of ${Math.ceil(totalItemCount / itemsPerPage)}`}
                        hasPrevious={currentPage > 1}
                        onPrevious={handlePreviousPage}
                        hasNext={currentPage * itemsPerPage < totalItemCount}
                        onNext={handleNextPage}
                    />
                </div>
            </Card>
        </Page>
    );
};

export default SizeChartsPage;
