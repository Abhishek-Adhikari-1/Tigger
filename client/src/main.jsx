import { StrictMode } from "react";
import { ClerkLoading, ClerkProvider } from "@clerk/react-router";
import { createRoot } from "react-dom/client";
import { ThemeProvider, useTheme } from "next-themes";
import { dark, light } from "@clerk/themes";
import AppRouter from "./AppRouter.jsx";
import "./global.css";
import { BrowserRouter } from "react-router-dom";
import Loader from "./components/ui/loader.jsx";
import { ThemeToggle } from "./components/themes/theme-toggle.jsx";
import { Toaster } from "react-hot-toast";

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
        <ClerkLoading>
          <div>
            <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-background">
              <ThemeToggle />
            </div>
            <Loader />
          </div>
        </ClerkLoading>

        <AppRouter />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--toast-bg, #fff)',
              color: 'var(--toast-color, #333)',
            },
          }}
        />
      </ClerkProvider>
    </BrowserRouter>
  );
}
