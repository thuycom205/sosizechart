import React, { useState, useCallback, useEffect } from 'react';
import {
    Page,
    Button,
    ResourceList,
    Card,
    ResourceItem,
    TextStyle,
    Stack,
    Pagination,
    EmptyState,
    Frame,
    Toast,
} from '@shopify/polaris';

import { useNavigate } from "@shopify/app-bridge-react";

const ListPage = ({ title, resourceName, fetchUrl, deleteUrl, createUrl, editUrl, itemsPerPage = 50 }) => {
    const  navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItemCount, setTotalItemCount] = useState(0);
    const [assignMapId, setAssignMapId] = useState(null);

    const [toastActive, setToastActive] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastError, setToastError] = useState(false);
    const gqueryParams = new URLSearchParams( window.DEVPARAMS);
    const [shop, setShop] = useState(gqueryParams.get('shop') || '');
    const toggleActive = useCallback(() => setToastActive((active) => !active), []);
    const toastMarkup = toastActive ? (
        <Toast content={toastMessage} onDismiss={toggleActive} error={toastError} />
    ) : null;
    const handleNextPage = useCallback(() => {
        setCurrentPage(currentPage + 1);
    }, [currentPage]);
    const toggleToastActive = useCallback(() => {
        setToastActive((active) => !active);
    }, []);


    const handlePreviousPage = useCallback(() => {
        setCurrentPage(currentPage - 1);
    }, [currentPage]);

    const handleSelectionChange = useCallback((items) => {
        setSelectedItems(items);
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            const params = {
                shop_name: shop,
                page: currentPage,
                items_per_page: itemsPerPage,
            };

            try {
                const response = await fetch(fetchUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setItems(data.items);
                setTotalItemCount(data.totalItemCount);
            } catch (error) {
                console.error('Failed to fetch items:', error);
            }
        };

        fetchData();
    }, [currentPage, itemsPerPage, fetchUrl]);

    const handleCreateNew = useCallback(() => {
        // Use the createUrl to navigate to the creation page
        navigate(createUrl +`?editId=${0}`);
    }, [createUrl]);

    const handleEdit = useCallback((id) => {
        // Use the editUrl to navigate to the edit page
        navigate(editUrl + `?editId=${id}` + `&shop_name=${shop}`) ;

    }, [editUrl]);

    const handleAssignProduct =useCallback((id,name) => {
        console.log(id);
        setAssignMapId(id);
        window.assign_map_id = id;
        window.assign_map_name = name;
        console.log(assignMapId);
        // Use the editUrl to navigate to the edit page
        navigate('/page_seat_assign_product' + `?editId=${id}` + `&shop_name=${shop}`) ;
    },[assignMapId]);
    const handleDeleteSelected = useCallback(async () => {
        try {
            const response = await fetch(deleteUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ids: selectedItems ,
                    shop_name: shop,
                }),
            });

            if (!response.ok) throw new Error('Network response was not ok.');

            // Assuming the server sends back a message
            const data = await response.json();
            setToastMessage(data.message || 'Items deleted successfully.');
            setToastActive(true);

            // Clear selected items or any other state updates
            // Remove the deleted items from the items state
            const remainingItems = items.filter(
                (item) => !selectedItems.includes(item.id)
            );
            setItems(remainingItems);
            setSelectedItems([]); // Clear the selection
        } catch (error) {
            console.error('Error:', error);
            setToastMessage('Failed to delete items.');
            setToastActive(true);

        }
    }, [selectedItems]);


    const handleAssignProducts = useCallback(async () => {
        console.log(selectedItems);

    },[ selectedItems]);

    // ... other handlers ...

    const renderContent = () => {
        if (items.length === 0 && totalItemCount === 0) {
            return (
                <EmptyState
                    heading={`No ${resourceName.plural.toLowerCase()} found`}
                    action={{
                        content: `Create ${resourceName.singular}`,
                        onAction: handleCreateNew,
                    }}
                >
                    <p>Click the button to start creating a new item.</p>
                </EmptyState>
            );
        } else {
            return (
                <ResourceList
                    resourceName={resourceName}
                    items={items}
                    selectedItems={selectedItems}
                    onSelectionChange={handleSelectionChange}
                    bulkActions={[
                        {
                            content: 'Delete',
                            onAction: handleDeleteSelected,
                        }

                    ]}
                    renderItem={(item) => {
                        const { id, title } = item;
                        return (
                            <ResourceItem
                                id={id.toString()}
                                accessibilityLabel={`Edit ${title}`}
                                name={title}
                                persistActions
                                shortcutActions={[
                                    { content: 'Assign Product', onAction: () => {
                                        setAssignMapId(id);
                                        handleAssignProduct(id,title);
                                        } },
                                    { content: 'Edit', onAction: () => handleEdit(id) }
                                ]}
                            >
                                <TextStyle variation="strong">{title}</TextStyle>
                            </ResourceItem>
                        );
                    }}
                />
            );
        }
    };

    return (
            <Page
                title={title}
                primaryAction={{
                    content: `Create ${resourceName.singular}`,
                    onAction: handleCreateNew,
                }}
            >
                <Card sectioned>
                    {renderContent()}
                </Card>
                {toastMarkup}
                  <Stack distribution="trailing">
                        <Pagination
                            hasPrevious={currentPage > 1}
                            onPrevious={handlePreviousPage}
                            hasNext={currentPage * itemsPerPage < totalItemCount}
                            onNext={handleNextPage}
                        />
                  </Stack>
            </Page>
    );
};

export default ListPage;
