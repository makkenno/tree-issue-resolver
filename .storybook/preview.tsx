import React from "react";

import type { Preview } from "@storybook/react";
import { Provider } from "../src/provider";
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { useEffect } from "react";
import { addons } from "@storybook/preview-api";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";
import { useMantineColorScheme } from "@mantine/core";

const channel = addons.getChannel();

function ColorSchemeWrapper({ children }: { children: React.ReactNode }) {
  const { setColorScheme } = useMantineColorScheme();
  const handleColorScheme = (value: boolean) =>
    setColorScheme(value ? "dark" : "light");

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, handleColorScheme);
    return () => channel.off(DARK_MODE_EVENT_NAME, handleColorScheme);
  }, [channel]);

  return <>{children}</>;
}

const preview: Preview = {
  decorators: [
    (renderStory) => <ColorSchemeWrapper>{renderStory()}</ColorSchemeWrapper>,
    (Story, { parameters }) => {
      const { pageLayout } = parameters;
      switch (pageLayout) {
        case "page":
          return (
            <Provider>
              <div className="page-layout">
                <Story />
              </div>
            </Provider>
          );
        case "page-mobile":
          return (
            <Provider>
              <div className="page-mobile-layout">
                <Story />
              </div>
            </Provider>
          );
        default:
          return (
            <Provider>
              <Story />
            </Provider>
          );
      }
    },
  ],
};

export default preview;
