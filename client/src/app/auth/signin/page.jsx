import { SignIn } from "@clerk/clerk-react";
import React from "react";

export default function SignInPage() {
  return (
    <React.Fragment>
      <SignIn
        path="/auth/signin"
        routing="path"
        signUpUrl="/auth/signup"
        forceRedirectUrl="/"
        fallbackRedirectUrl="/"
        afterSignOutUrl="/auth/signin"
      />
    </React.Fragment>
  );
}
