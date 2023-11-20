import { useState } from "react";
import {Card, TextContainer, Text, Stack, Modal, Select, TextField, Button} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { ResourcePicker } from "@shopify/app-bridge-react";

export function ProductsCard() {
    const [productName, setProductName] = useState("");
    const [productPicker, setProductPicker] = useState(false);
    const [productId, setProductId] = useState("");

    const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const { t } = useTranslation();
  const productsCount = 5;

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/create");

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("ProductsCard.productsCreatedToast", {
          count: productsCount,
        }),
      });
    } else {
      setIsLoading(false);
      setToastProps({
        content: t("ProductsCard.errorCreatingProductsToast"),
        error: true,
      });
    }
  };

  return (
    <>
      {toastMarkup}
      <Card
        title={t("ProductsCard.title")}
        sectioned
        primaryFooterAction={{
          content: t("ProductsCard.populateProductsButton", {
            count: productsCount,
          }),
          onAction: handlePopulate,
          loading: isLoading,
        }}
      >
        <TextContainer spacing="loose">
          <p>{t("ProductsCard.description")}</p>
          <Text as="h4" variant="headingMd">
            {t("ProductsCard.totalProductsHeading")}
            <Text variant="bodyMd" as="p" fontWeight="semibold">
              {isLoadingCount ? "-" : data.count}
            </Text>
          </Text>
        </TextContainer>
      </Card>
        <Card>
            <TextField
                label="Product"
                type="string"
                placeholder="Select a product..."
                value={productName}
                disabled={true}
                connectedRight={
                    <Button onClick={() => setProductPicker(true)}>Browse</Button>
                }
            />
            <ResourcePicker
                resourceType="Product"
                open={productPicker}
                selectMultiple={false}
                onSelection={(selectPayload) => {
                    const product = selectPayload.selection[0];
                    setProductId(product.id);
                    setProductName(product.title);
                    setProductPicker(false);
                }}
            />
        </Card>
    </>
  );
}
