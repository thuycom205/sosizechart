import { Card, Page, Layout, TextContainer, Text, TextField,AlphaCard } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import EditableTable from "../components/EditableTable";
import React, { useState,useEffect ,useCallback} from 'react';
import RuleCondition from "../components/RuleCondition/RuleCondition";
import SizeChartForm from "../components/SizeChart/SizeChartForm";
export default function Pagesizeguidedefault() {

    const sampleData = {
        "id": 0,
        "sizechart_data": [
            ["Size", "S", "M", "L", "XL"],
            ["EU Size", "46", "50", "54", "58"],
            ["US Size", "36", "40", "44", "48"],
            ["Chest (in)", "34-36", "38-40", "42-44", "46-48"],
            ["Waist (in)", "28-30", "32-34", "36-38", "40-42"]
        ],
        "image_url": "http://example.com/path/to/sizechart-image.jpg",
        "shop_name": "Example Shop",
        "created_at": "2021-01-01T00:00:00Z",
        "updated_at": "2021-01-01T00:00:00Z",
        "is_default_sizechart": 0,
        "title": "Men's T-Shirts Size Chart",
        "rule_id": 0,
        "rules": {
            "products": [
                {
                    "id": "gid://shopify/Product/8061849763989",
                    "title": "bitter morning",
                    "handle": "bitter-morning"
                },
                // ... other products
            ],
            "collections": [
                {
                    "id": "gid://shopify/Collection/214369730709",
                    "title": "Home page",
                    "handle": "frontpage"
                }
                // ... other collections
            ]
        }

    }

    const { t } = useTranslation();
    const [sizeChart, setSizeChart] = useState(null);

    const [ruleConditions, setRuleConditions] = useState({
        rule_id: null, // Example initial rule ID, set as needed
        collections: [],
        products: []
    });
    const queryParams = new URLSearchParams(location.search);

    const [editId, setEditId] = useState(queryParams.get('editId') || '');

    const [title, setTitle] = useState('');

    const [ruleType, setRuleType] = useState('all_conditions'); // Default rule type
    const gqueryParams = new URLSearchParams( window.DEVPARAMS);
    const [shop, setShop] = useState(gqueryParams.get('shop') || '');
    // Handler function to update ruleType in the parent component
    const handleRuleTypeChange = (newRuleType) => {
        setRuleType(newRuleType);
    };
    // Callback to update the rule conditions from the RuleCondition component
    const handleRuleConditionChange = (type, items) => {
        setRuleConditions(prevConditions => ({
            ...prevConditions,
            [type]: items
        }));
    };
    const handleSubmit = async () => {
        try {


            const requestBody = {
                sizeChart: sizeChart,
                title: title,
                ruleConditions: ruleConditions,
                ruleType: ruleType,
                editId: editId,
                shop_name: shop,
                rule_id: ruleConditions.rule_id
            };

            const response = await fetch('https://lara.com/api/sizechart/persist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other necessary headers, such as authorization tokens
                },
                body: JSON.stringify(requestBody) // Convert the requestBody object into a JSON string
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Process the response (if necessary)
            const result = await response.json(); // Assuming the server responds with JSON
            console.log('Save result:', result);

            // You may want to perform some actions after saving, such as redirecting the user
        } catch (error) {
            console.error('Failed to save size chart:', error);
            // Handle any errors that occurred during submission
        }
    };

    // Fetch size chart data from API or use sample data if editId is 0
    useEffect(() => {
                    const fetchSizeChartData = async () => {
                        try {
                            if (parseInt(editId) !== 0) {
                                // Prepare the request body with the editId
                                const requestBody = {editId: editId};

                                // Send a POST request
                                const response = await fetch('https://lara.com/api/sizechart/fetch', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        // Include other headers as needed, e.g., authorization tokens
                                    },
                                    body: JSON.stringify(requestBody) // Convert the JS object to a JSON string
                                });

                                // Check if the response's content type is JSON
                                const contentType = response.headers.get("content-type");
                                let data;
                                if (contentType && contentType.indexOf("application/json") !== -1) {
                                    data = await response.json(); // Parse response as JSON if it's JSON
                                } else {
                                    // You may handle other types of responses, or throw an error if unexpected
                                    data = response;
                                }

                                // Set the state with the fetched data
                                setSizeChart(data.sizechart_data);
                                setTitle(data.title);
                                setRuleConditions({
                                    collections: data.rules.collections,
                                    products: data.rules.products,
                                    rule_id: data.rule_id
                                });
                            } else {
                                // If editId is 0, use the sample data
                                setSizeChart(sampleData.sizechart_data);
                                setTitle(sampleData.title);
                                setRuleConditions({
                                    collections: sampleData.rules.collections,
                                    products: sampleData.rules.products,
                                    rule_id: sampleData.rule_id
                                });
                            }
                        } catch (error) {
                            console.error('Failed to fetch size chart:', error);
                            // Fallback to sample data if there is an error
                            setSizeChart(sampleData.sizechart_data);
                            setTitle(sampleData.title);
                            setRuleConditions({
                                collections: [],
                                products: [],
                                rule_id: 0
                            });
                        }
                    };


    fetchSizeChartData();
    }, [editId, sampleData]);

    return (
        <Page fullWidth title="Size Chart">
            <TitleBar
                title={t("Size chart")}
                primaryAction={{
                    content: t("Save Size Chart"),
                    onAction: () => {
                        handleSubmit();
                        console.log("Save Size Chart");
                        },
                }}
                secondaryActions={[
                    {
                        content: t("PageName.secondaryAction"),
                        onAction: () => console.log("Secondary action"),
                    },
                ]}
            />
            <Layout>

                <Layout.Section>
                    <AlphaCard title="Size Chart">
                    <SizeChartForm sizeChart={sizeChart}/>
                    </AlphaCard>
                    <AlphaCard title="Rule to apply size chart to products">
                    <RuleCondition
                        rule_id={ruleConditions.rule_id}
                        icollections={ruleConditions.collections}
                        iproducts={ruleConditions.products}
                        onCollectionsChange={(collections) => handleRuleConditionChange('collections', collections)}
                        onProductsChange={(products) => handleRuleConditionChange('products', products)}
                        ruleType={ruleType} // Pass ruleType state
                        onRuleTypeChange={handleRuleTypeChange} // Pass handler function
                    />
                        </AlphaCard>
                </Layout.Section>



            </Layout>
        </Page>
    );
}
