"use client";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";

import theme from "./theme";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      {children}
    </ChakraProvider>
  );
}
