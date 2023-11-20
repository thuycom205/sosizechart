import { Card, Page, Layout, TextContainer, Text, TextField,AlphaCard } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import EditableTable from "../components/EditableTable";
import React, { useState,useEffect ,useCallback} from 'react';
import RuleCondition from "../components/RuleCondition/RuleCondition";
import SizeChartForm from "../components/SizeChart/SizeChartForm";
export default function Pagesizeguidedefault() {
    const { t } = useTranslation();
    const [ruleConditions, setRuleConditions] = useState({
        rule_id: null, // Example initial rule ID, set as needed
        collections: [],
        products: []
    });
    const [optionSetName, setOptionSetName] = useState('');

    const [ruleType, setRuleType] = useState('all_conditions'); // Default rule type

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
    return (
        <Page fullWidth title="Size Chart">
            <TitleBar
                title={t("Size chart")}
                primaryAction={{
                    content: t("PageName.primaryAction"),
                    onAction: () => console.log("Primary action"),
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
                    <SizeChartForm/>
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
