"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      // Passing scriptProps prevents React 19 from warning about inline script tags
      scriptProps={{ "data-cfasync": "false" }}
    >
      {children}
    </NextThemesProvider>
  );
}