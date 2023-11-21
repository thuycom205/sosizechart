import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
} from "@shopify/polaris";

import {  ChoiceList, Button, Select }
    from '@shopify/polaris';
import React, { useState } from 'react';

import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";
import { useNavigate } from "@shopify/app-bridge-react";

export default function HomePage() {
    const [sizeChartEnabled, setSizeChartEnabled] = useState(['enabled']);
    const [defaultSizeChart, setDefaultSizeChart] = useState('default');

    // Mock data for the dropdown options
    const sizeChartOptions = [
        { label: 'Size Chart 1', value: 'chart1' },
        { label: 'Size Chart 2', value: 'chart2' },
        // Add more size chart options here
    ];
    const navigate = useNavigate();

    const videoTutorialUrl = 'https://yourdomain.com/video-tutorial';
    const userManualUrl = 'https://yourdomain.com/user-manual';
  const { t } = useTranslation();
  return (
    <Page narrowWidth>
      <TitleBar title={t("HomePage.title")} primaryAction={null} />
      <Layout>
          <Layout.Section>
              <Card title="General Settings" sectioned>
                  <ChoiceList
                      choices={[
                          { label: 'Enable Size Chart', value: 'enabled' },
                          { label: 'Disable Size Chart', value: 'disabled' },
                      ]}
                      selected={sizeChartEnabled}
                      onChange={setSizeChartEnabled}
                  />

              </Card>
          </Layout.Section>

          <Layout.Section secondary>
              <Card title="Getting Started Guide" sectioned>
                  <Stack vertical spacing="loose">
                      <p>Follow these steps to get started with the Size Chart app:</p>
                      <ol>
                          <li>Select a default size chart or create a new one.</li>
                          <li>Assign size charts to your products or collections.</li>
                          <li>Customize the appearance of your size charts.</li>
                          <li>Use the preview feature to see how they will look on your store.</li>
                          <li>Contact support if you need help along the way.</li>
                      </ol>
                      <Button primary onClick={() => {
                          // Logic to navigate to Size Chart Management
                          window.DEVPARAMS;
                          const host =
                              new URLSearchParams(window.DEVPARAMS).get("shop");
                          navigate(`/pagesizeguidedefault` +`?shop_name=` +  host);

                      }}>
                          Configure Default Size Chart
                      </Button>

                      <Button primary onClick={() => {
                          window.DEVPARAMS;
                          const host =
                              new URLSearchParams(window.DEVPARAMS).get("shop");
                          navigate(`/pagesizeguidedefault` +`?shop_name=` +  host);
                      }}>
                          Go to Size Chart Management
                      </Button>
                      <p>For more detailed instructions:</p>
                      <Link url={videoTutorialUrl} external>
                          Watch our video tutorial
                      </Link>
                      <Link url={userManualUrl} external>
                          Read the user manual
                      </Link>
                  </Stack>
              </Card>
          </Layout.Section>
          <div style={{ display: 'none' }}>
        <Layout.Section>
          <ProductsCard />
        </Layout.Section>
          </div>
      </Layout>
    </Page>
  );
}
