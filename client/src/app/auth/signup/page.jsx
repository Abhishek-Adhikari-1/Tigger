import React from "react";
import { SignUp } from "@clerk/clerk-react";
import { ThemeToggle } from "../../../components/themes/theme-toggle";

export default function SignUpPage() {
  return (
    <React.Fragment>
      <SignUp
        path="/auth/signup"
        routing="path"
        signInUrl="/auth/signin"
        forceRedirectUrl="/"
        fallbackRedirectUrl="/"
        afterSignOutUrl="/auth/signin"
      />
    </React.Fragment>
  );
}
