import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import SizeChartForm from "../components/SizeChartForm";
import SizeChartFormB from "../components/SizeChartFormB";
export default function Pagesizechartform() {
    const { t } = useTranslation();
    return (
        <Page>
            <TitleBar
                title={t("PageName.title")}
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
                <SizeChartFormB/>
                <Layout.Section>
                    <SizeChartForm />
                    </Layout.Section>
                <Layout.Section>
                    <Card sectioned>
                        <Text variant="headingMd" as="h2">
                            {t("PageName.heading")}
                        </Text>
                        <TextContainer>
                            <p>{t("PageName.body")}</p>
                        </TextContainer>
                    </Card>
                    <Card sectioned>
                        <Text variant="headingMd" as="h2">
                            {t("PageName.heading")}
                        </Text>
                        <TextContainer>
                            <p>{t("PageName.body")}</p>
                        </TextContainer>
                    </Card>
                </Layout.Section>
                <Layout.Section secondary>
                    <Card sectioned>
                        <Text variant="headingMd" as="h2">
                            {t("PageName.heading")}
                        </Text>
                        <TextContainer>
                            <p>{t("PageName.body")}</p>
                        </TextContainer>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
