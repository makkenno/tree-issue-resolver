import { FC, ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";

export const Provider: FC<{ children: ReactNode }> = ({ children }) => (
  <MantineProvider theme={theme}>{children}</MantineProvider>
);
