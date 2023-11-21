import React, { useState, useCallback, useEffect } from 'react';
import { Page, Button, ResourceList, Card, ResourceItem, TextStyle, Stack, Pagination,EmptyState } from '@shopify/polaris';
import { useNavigate } from "@shopify/app-bridge-react";
import { Toast } from '@shopify/polaris';
import { Frame } from '@shopify/polaris';

const SizeChartsPage = () => {
    const [sizeCharts, setSizeCharts] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItemCount, setTotalItemCount] = useState(0);
    const itemsPerPage = 50;

    const [toastActive, setToastActive] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastError, setToastError] = useState(false);

    const toggleActive = useCallback(() => setToastActive((active) => !active), []);
    const toastMarkup = toastActive ? (
        <Toast content={toastMessage} onDismiss={toggleActive} error={toastError} />
    ) : null;

    const gqueryParams = new URLSearchParams( window.DEVPARAMS);
    const [shop, setShop] = useState(gqueryParams.get('shop') || '');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSizeCharts = async () => {
            // Define your parameters
            const params = {
                shop_name: shop,
                page: currentPage,
                items_per_page: itemsPerPage,
            };

            try {
                const response = await fetch('https://lara.com/api/sizecharts/fetchList', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include other headers as necessary, such as authorization tokens
                    },
                    body: JSON.stringify(params), // Send parameters as JSON payload
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Check if the response's content type is JSON
                const contentType = response.headers.get("content-type");
                let data;
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    data = await response.json(); // Parse response as JSON if it's JSON
                } else {
                    // You may handle other types of responses, or throw an error if unexpected
                    data = response;
                }

                setSizeCharts(data.sizeCharts);
                setTotalItemCount(data.totalItemCount);
            } catch (error) {
                console.error('Failed to fetch size charts:', error);
            }
        };

        fetchSizeCharts();
    }, [currentPage, itemsPerPage]);


    const handleCreateNew = useCallback(() => {
        navigate(`/page_sizechart?editId=${0}`);

        // TODO: Implement create new size chart logic
    }, []);

    const handleEdit = useCallback((id) => {
        navigate(`/page_sizechart?editId=${id}` + `&shop_name=${shop}`) ;

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
    const renderContent = () => {
        if (sizeCharts.length === 0 && totalItemCount === 0) {
            return (
                <EmptyState
                    heading="There is no size chart"
                    action={{
                        content: 'Create Size Chart',
                        onAction: handleCreateNew,
                    }}
                >
                    <p>Click the button to start creating your size chart.</p>
                </EmptyState>
            );
        } else {
            return (
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

            );
        }
    };
    const handleDeleteSelected = useCallback(async () => {
        if (selectedItems.length > 0) {
            try {
                const response = await fetch('https://lara.com/api/sizechart/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include other headers as necessary, such as authorization tokens
                    },
                    body: JSON.stringify({ ids: selectedItems }), // Send selected item IDs as JSON payload
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Assuming the server responds with JSON
                const result = await response.json();
                console.log('Delete result:', result);

                // Update the state to remove the deleted items without refetching
                const updatedSizeCharts = sizeCharts.filter((chart) => !selectedItems.includes(chart.id));
                setSizeCharts(updatedSizeCharts);
                setTotalItemCount(prevCount => prevCount - selectedItems.length);
                setSelectedItems([]);

                // Show success toast
                setToastMessage('Size chart(s) deleted successfully.');
                setToastError(false);
                setToastActive(true);

            } catch (error) {
                console.error('Failed to delete size chart(s):', error);
                // Show error toast
                setToastMessage('Failed to delete size chart(s).');
                setToastError(true);
                setToastActive(true);
            }
        }
    }, [selectedItems, setToastMessage, setToastError, setToastActive]);


    const bulkActions = [
        {
            content: 'Delete',
            onAction: handleDeleteSelected,
        },
    ];
    return (
        <Frame>
        <Page
            title="Size Charts"
            primaryAction={{
                content: 'Create Size Chart',
                onAction: handleCreateNew,
            }}
        >
            <Card sectioned>
                {renderContent()}
            </Card>
            {sizeCharts.length > 0 && (
                <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        label={`Page ${currentPage} of ${Math.ceil(totalItemCount / itemsPerPage)}`}
                        hasPrevious={currentPage > 1}
                        onPrevious={handlePreviousPage}
                        hasNext={currentPage * itemsPerPage < totalItemCount}
                        onNext={handleNextPage}
                    />
                </div>
            )}

            {toastMarkup}
        </Page>
        </Frame>
    );
};

export default SizeChartsPage;
