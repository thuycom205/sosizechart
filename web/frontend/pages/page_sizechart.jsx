import { Card, Page, Layout, TextContainer, Text, TextField,AlphaCard } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import EditableTable from "../components/EditableTable";
import React, { useState,useEffect ,useCallback} from 'react';
import RuleCondition from "../components/RuleCondition/RuleCondition";
import SizeChartForm from "../components/SizeChart/SizeChartForm";
import { useLocation } from 'react-router-dom';
import { Toast } from '@shopify/polaris';
import { Frame } from '@shopify/polaris';
import { useNavigate } from "@shopify/app-bridge-react";

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

            ],
            "collections": [
                // ... other collections
            ]
        }

    }
    const navigate = useNavigate();

    // New state for Toast
    const [toastActive, setToastActive] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastError, setToastError] = useState(false);

    const { t } = useTranslation();
    const [sizeChart, setSizeChart] = useState([]);

    const [ruleConditions, setRuleConditions] = useState({
        rule_id: null, // Example initial rule ID, set as needed
        collections: [],
        products: []
    });

    const [editId, setEditId] = useState(0);

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
    const toggleActive = useCallback(() => setToastActive((active) => !active), []);

    // Toast markup
    const toastMarkup = toastActive ? (
        <Toast content={toastMessage} onDismiss={toggleActive} error={toastError} />
    ) : null;

    const handleSubmit = async () => {
        if (validateSizeChart()) { // Only proceed if the size chart is valid

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
                setToastMessage('Size chart saved successfully.');
                setToastError(false);
                setToastActive(true); // S
                // You may want to perform some actions after saving, such as redirecting the user
            } catch (error) {
                // Handle any errors that occurred during submission
                console.error('Failed to save size chart:', error);
                setToastMessage('Failed to save size chart.');
                setToastError(true);
                setToastActive(true); // Show error toast
            }
        }
    };
    const handleSizeChartChange = useCallback((newTableData) => {
        setSizeChart(newTableData);
    }, []);

    // This function will be called when a row is deleted from the size chart
    const handleSizeChartRowDelete = useCallback((rowIndex) => {
        const updatedTableData = sizeChart.filter((_, index) => index !== rowIndex);
        setSizeChart(updatedTableData);
    }, [sizeChart]);

    // This function will be called when a column is deleted from the size chart
    const handleSizeChartColumnDelete = useCallback((columnIndex) => {
        const updatedTableData = sizeChart.map(row => {
            const newRow = [...row];
            newRow.splice(columnIndex, 1);
            return newRow;
        });
        setSizeChart(updatedTableData);
    }, [sizeChart]);

    const validateSizeChart = () => {
        // Check if title is empty
        if (!title.trim()) {
            setToastMessage('Title is required.');
            setToastError(true);
            setToastActive(true);
            return false; // Validation failed
        }

        // Check if any cell in sizeChart is empty
        for (let row of sizeChart) {
            if (row.some(cell => cell.trim() === '')) {
                setToastMessage('All fields in the size chart must have a value.');
                setToastError(true);
                setToastActive(true);
                return false; // Validation failed
            }
        }

        // If all checks pass, return true
        return true;
    };

    useEffect(() => {
        // The `location` object contains the current URL information
        const queryParams = new URLSearchParams(location.search);

        // Get 'editId' and 'shop_name' from the URL
        const editIdParam = queryParams.get('editId');
        const shopNameParam = queryParams.get('shop_name');

        // Set the state variables
        if (editIdParam) {
            setEditId(editIdParam);
        }

        if (shopNameParam) {
            setShop(shopNameParam);
        }
        const fetchSizeChartData = async () => {
            try {
                //if (parseInt(editId) !== 0) {
                if (true) {
                    const requestBody = { editId: queryParams.get('editId') };

                    const response = await fetch('https://lara.com/api/sizechart/fetch', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // Include other headers as needed, e.g., authorization tokens
                        },
                        body: JSON.stringify(requestBody)
                    });

                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        const data = await response.json();
                        setSizeChart(data.sizechart_data);
                        setTitle(data.title);
                        setRuleConditions({
                            collections: data.rules ? data.rules.collections : [],
                            products: data.rules ? data.rules.products : [],
                            rule_id: data.rules ? data.rule_id : 0
                        });

                    } else {
                        setSizeChart(response.sizechart_data);
                        setTitle(response.title);
                        setRuleConditions({
                            collections: response.rules ? response.rules.collections : [],
                            products: response.rules ? response.rules.products : [],
                            rule_id: response.rules ? response.rule_id : 0
                        });
                        throw new Error("Received non-JSON response from server.");
                    }
                } else {
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
                setSizeChart(sampleData.sizechart_data);
                setTitle(sampleData.title);
                setRuleConditions({
                    collections: [],
                    products: [],
                    rule_id: 0
                });
            }
        };

        // Correctly fetch size chart data when the component mounts or when editId changes
        fetchSizeChartData();
    }, [location]);


    if (sizeChart== null || sizeChart.length == 0 || sizeChart == undefined)  {
        return <div>Loading...</div>;

    } else {
        return (
            <Frame>
            <Page fullWidth title="Size Chart">
                <TitleBar
                    title={t("Size chart")}
                    primaryAction={{
                        content: t("Save Size Chart"),
                        onAction: () => {
                            handleSubmit();
                        },
                    }}
                    secondaryActions={[
                        {
                            content: t("Size Chart Management"),
                            onAction: () => {
                                window.DEVPARAMS;
                                const host =
                                    new URLSearchParams(window.DEVPARAMS).get("shop");
                                navigate(`/page_size_chart_list` +`?shop_name=` +  host);
                            },                        },
                    ]}
                />
                <Layout>
                    <Layout.Section>
                        <AlphaCard title="Size Chart">
                            <SizeChartForm
                                tableData={sizeChart}
                                onSizeChartChange={handleSizeChartChange}
                                title={title}
                                onTitleChange={setTitle}
                            />
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
                {toastMarkup} {/* Render the Toast component */}

            </Page>
            </Frame>
        );
    }

}
