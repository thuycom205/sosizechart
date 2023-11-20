import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import SizeChartList from "../components/SizeChartList.jsx";
export default function PageName() {
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
        <SizeChartList />
      </Layout>
    </Page>
  );
}
