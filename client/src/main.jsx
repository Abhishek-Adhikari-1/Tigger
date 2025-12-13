import { StrictMode } from "react";
import { ClerkProvider } from "@clerk/react-router";
import { createRoot } from "react-dom/client";
import { ThemeProvider, useTheme } from "next-themes";
import { dark, light } from "@clerk/themes";
import AppRouter from "./AppRouter.jsx";
import "./global.css";
import { BrowserRouter } from "react-router-dom";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system">
      <Root />
    </ThemeProvider>
  </StrictMode>
);

export function Root() {
  const { resolvedTheme } = useTheme();

  return (
    <BrowserRouter>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/auth/signin"
        signInUrl="/auth/signin"
        signUpUrl="/auth/signup"
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
        touchSession
        appearance={{
          layout: {
            unsafe_disableDevelopmentModeWarnings: true,
            animations: true,
            shimmer: true,
            socialButtonsPlacement: "bottom",
          },
          theme: resolvedTheme === "dark" ? dark : light,
          variables: {
            colorPrimary: resolvedTheme === "dark" ? "#7770ff" : "#4b42f0",
            colorPrimaryForeground: "#ffffff",
          },
        }}
      >
        <AppRouter />
      </ClerkProvider>
    </BrowserRouter>
  );
}
