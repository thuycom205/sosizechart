import React, { useState, useEffect } from 'react';
import { Card, DataTable, Button, Stack, Icon, TextStyle, Select } from '@shopify/polaris';
import { DeleteMinor } from '@shopify/polaris-icons';
import {ResourcePicker} from "@shopify/app-bridge-react";

const RuleCondition = ({
                           rule_id,
                           icollections,
                           iproducts,
                           onCollectionsChange,
                           onProductsChange,
                           ruleType,
                           onRuleTypeChange
                       }) => {
    const [collections, setCollections] = useState(icollections || []);
    const [products, setProducts] = useState(iproducts || []);
    const [selectedRuleType, setSelectedRuleType] = useState(ruleType);
    const [openProductResourcePicker, setOpenProductResourcePicker] = useState(false);
    const [openCollectionResourcePicker, setOpenCollectionResourcePicker] = useState(false);

    useEffect(() => {
        if (!Array.isArray(icollections)) {
            console.error('Expected icollections to be an array');
            setCollections([]); // Set to default empty array if invalid
        } else {
            // Check if every item in the array has id, title, and handle
            const isValid = icollections.every(col =>
                col.hasOwnProperty('id') &&
                col.hasOwnProperty('title') &&
                col.hasOwnProperty('handle')
            );

            if (!isValid) {
                console.error('Invalid collection object structure');
                setCollections([]); // Set to default empty array if invalid
            } else {
                setCollections(icollections);
            }
        }
    }, [icollections]);
    //
    useEffect(() => {
        if (!Array.isArray(iproducts)) {
            console.error('Expected iproducts to be an array');
            setProducts([]); // Set to default empty array if invalid
        } else {
            // Check if every item in the array has id, title, and handle
            const isValid = iproducts.every(prod =>
                prod.hasOwnProperty('id') &&
                prod.hasOwnProperty('title') &&
                prod.hasOwnProperty('handle')
            );

            if (!isValid) {
                console.error('Invalid product object structure');
                setProducts([]); // Set to default empty array if invalid
            } else {
                setProducts(iproducts);
            }
        }
    }, [iproducts]);


    const handleRuleTypeChange = (newValue) => {
        setSelectedRuleType(newValue);
        onRuleTypeChange(newValue);
    };

    const handleCollectionSelection = (selectedPayload) => {
        setOpenCollectionResourcePicker(false);

        // Extract the selected collections from the payload
        const selectedCollections = selectedPayload.selection;

        // Filter out collections that are already in the state
        const newCollections = selectedCollections.filter(
            (selectedCollection) => !collections.some((collection) => collection.id === selectedCollection.id)
        );

        // Map the filtered collections to the desired format
        const formattedNewCollections = newCollections.map((collection) => ({
            id: collection.id,
            title: collection.title,
            handle: collection.handle
        }));

        // Update the state to include the newly added collections
        onCollectionsChange([...collections, ...formattedNewCollections]);

        setCollections([...collections, ...formattedNewCollections]);

    };

    const handleProductSelection = (selectedPayload) => {
        setOpenProductResourcePicker(false);

        // Extract the selected products from the payload
        const selectedProducts = selectedPayload.selection;

        // Filter out products that are already in the state
        const newProducts = selectedProducts.filter(
            (selectedProduct) => !products.find((product) => product.id === selectedProduct.id)
        );

        // Map the filtered products to the desired format
        const formattedNewProducts = newProducts.map((product) => ({
            id: product.id,
            title: product.title,
            handle: product.handle
        }));

        // Update the state to include the newly added products
        onProductsChange([...products, ...formattedNewProducts]);

        setProducts([...products, ...formattedNewProducts]);

    }

    const removeCollection = (collectionId) => {
        setCollections(collections.filter((collection) => collection.id !== collectionId));
    };
    const removeProduct = (productId) => {
        setProducts(products.filter((product) => product.id !== productId));

        // Code to handle product removal
    };

    const renderRuleTypeSelector = () => {
        return (
            <Select
                label="Rule type"
                options={[
                    { label: 'All conditions', value: 'all_conditions' },
                    { label: 'Any conditions', value: 'any_conditions' }
                ]}
                value={selectedRuleType}
                onChange={handleRuleTypeChange}
            />
        );
    };

    const renderCollectionsTable = () => {
        if (collections.length > 0) {
            const rows = collections.map((collection) => [
                collection.title,
                collection.handle,
                <Button
                    plain
                    icon={DeleteMinor}
                    onClick={() => removeCollection(collection.id)}
                />
            ]);

            return (
                <DataTable
                    columnContentTypes={['text', 'text', 'text']}
                    headings={['Title', 'Handle', 'Actions']}
                    rows={rows}
                />
            );
        }
        return <TextStyle variation="subdued">No collections added</TextStyle>;
    };

    const renderProductsTable = () => {
        if (products.length > 0) {
            const rows = products.map((product) => [
                product.title,
                product.handle,
                <Button
                    plain
                    icon={DeleteMinor}
                    onClick={() => removeProduct(product.id)}
                />
            ]);

            return (
                <DataTable
                    columnContentTypes={['text', 'text', 'text']}
                    headings={['Title', 'Handle', 'Actions']}
                    rows={rows}
                />
            );
        }
        return <TextStyle variation="subdued">No products added</TextStyle>;
    };
    const maxWidthStyle = {
        maxWidth: '950px',
        marginLeft: 'auto',
        marginRight: 'auto'
    };
    return (
        <div style={maxWidthStyle}> {/* Apply the maxWidthStyle here */}

            <Card title="Rule Manager">
            <Card.Section>
                {renderRuleTypeSelector()}
            </Card.Section>
            <Card.Section title="Collections">
                <Stack distribution="trailing">
                    <Button onClick={() => setOpenCollectionResourcePicker(true)}>Add Collection</Button>
                </Stack>
                {renderCollectionsTable()}
            </Card.Section>
            <Card.Section title="Products">
                <Stack distribution="trailing">
                    <Button onClick={() => setOpenProductResourcePicker(true)}>Add Product</Button>
                </Stack>
                {renderProductsTable()}
            </Card.Section>
            <ResourcePicker
                resourceType="Product"
                open={openProductResourcePicker}
                onSelection={handleProductSelection}
                onCancel={() => setOpenProductResourcePicker(false)}
            />
            <ResourcePicker
                resourceType="Collection"
                open={openCollectionResourcePicker}
                onSelection={handleCollectionSelection}
                onCancel={() => setOpenCollectionResourcePicker(false)}
            />
        </Card>
        </div>
    );
};

export default RuleCondition;
