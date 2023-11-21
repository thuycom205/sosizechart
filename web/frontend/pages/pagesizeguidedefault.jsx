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
        "is_default_sizechart": 1,
        "title": "Men's T-Shirts Size Chart",
    }
    const [toastActive, setToastActive] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastError, setToastError] = useState(false);

    const { t } = useTranslation();
    const [sizeChart, setSizeChart] = useState([]);


    const [title, setTitle] = useState('');
    const navigate = useNavigate();

    const gqueryParams = new URLSearchParams( window.DEVPARAMS);
    const [shop, setShop] = useState(gqueryParams.get('shop') || '');
    // Callback to update the rule conditions from the RuleCondition component
    const handleSubmit = async () => {
        try {


            const requestBody = {
                sizeChart: sizeChart,
                title: "Default Size Chart",
                shop_name: shop,
                is_default_sizechart: 1,
            };

            const response = await fetch('https://lara.com/api/sizechart/persistDefault', {
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

            // You may want to perform some actions after saving, such as redirecting the user
        } catch (error) {
            setToastMessage('Failed to save size chart.');
            setToastError(true);
            setToastActive(true);
            console.error('Failed to save size chart:', error);
            // Handle any errors that occurred during submission
        }
    };
    const handleSizeChartChange = useCallback((newTableData) => {
        setSizeChart(newTableData);
    }, []);

    const toggleActive = useCallback(() => setToastActive((active) => !active), []);

    // Toast markup
    const toastMarkup = toastActive ? (
        <Toast content={toastMessage} onDismiss={toggleActive} error={toastError} />
    ) : null;

    useEffect(() => {
        // The `location` object contains the current URL information
        const queryParams = new URLSearchParams(location.search);

        // Get 'editId' and 'shop_name' from the URL
        const shopNameParam = queryParams.get('shop_name');


        if (shopNameParam) {
            setShop(shopNameParam);
        }
        const fetchSizeChartData = async () => {
            try {
                if (true) {
                    const requestBody = {
                        shop_name: queryParams.get('shop_name'),
                        is_default_sizechart: 1
                    };

                    const response = await fetch('https://lara.com/api/sizechart/fetchDefault', {
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
                        } else {
                            setSizeChart(response.sizechart_data);
                            setTitle(response.title);
                            throw new Error("Received non-JSON response from server.");
                        }


                } else {
                    setSizeChart(sampleData.sizechart_data);
                    setTitle(sampleData.title);
                }
            } catch (error) {
                console.error('Failed to fetch size chart:', error);
                setSizeChart(sampleData.sizechart_data);
                setTitle(sampleData.title);
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
                            },
                        },
                    ]}
                />
                <Layout>
                    <Layout.Section>
                        <AlphaCard title="Size Chart">
                            <SizeChartForm
                                tableData={sizeChart}
                                onSizeChartChange={handleSizeChartChange}

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
