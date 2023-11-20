import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const { t } = useTranslation();

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: t("NavigationMenu.pageName"),
                  destination: "/pagename",
                },
                  {
                      label: t("Size Chart List"),
                      destination: "/page_size_chart_list",
                  },
                  // {
                  //     label: t("NavigationMenu.List"),
                  //     destination: "/pagesizechartlist",
                  // },
                  // {
                  //     label: t("NavigationMenu.SizeChart"),
                  //     destination: "/pagesizechartform",
                  // },
                  {
                      label: t("Default Size Chart"),
                      destination: "/pagesizeguidedefault",
                  }, {
                      label: t(" Size Chart"),
                      destination: "/page_sizechart",
                  },
              ]}
            />
            <Routes pages={pages} />
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
