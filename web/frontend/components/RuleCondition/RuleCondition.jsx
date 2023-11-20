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
        // Initial fetch for collections and products would be here
    }, []);

    const handleRuleTypeChange = (newValue) => {
        setSelectedRuleType(newValue);
        onRuleTypeChange(newValue);
    };

    const handleCollectionSelection = (selectedPayload) => {
        // Code to handle collection selection
    };

    const handleProductSelection = (selectedPayload) => {
        // Code to handle product selection
    };

    const removeCollection = (collectionId) => {
        // Code to handle collection removal
    };

    const removeProduct = (productId) => {
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
