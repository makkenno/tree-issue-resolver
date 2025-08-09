import { FC, ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "./theme";

export const Provider: FC<{ children: ReactNode }> = ({ children }) => (
  <MantineProvider theme={theme} defaultColorScheme="dark">
    <Notifications />
    {children}
  </MantineProvider>
);
