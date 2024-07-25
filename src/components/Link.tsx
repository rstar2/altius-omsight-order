import React from "react";
import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Link({
  href,
  disabled = false,
  children,
}: {
  href: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <ChakraLink
      as={NextLink}
      href={disabled ? "" : href}
      pointerEvents={disabled ? "none" : undefined}
      sx={{
        opacity: disabled ? 0.5 : undefined,
      }}
    >
      {children}
    </ChakraLink>
  );
}
