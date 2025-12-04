import { OrganizationSwitcher, UserButton } from "@clerk/clerk-react";
import React from "react";

export default function DashboardPage() {
  return (
    <React.Fragment>
      <UserButton />
      <OrganizationSwitcher hidePersonal={true} />
      <div>Dashboard Page</div>
    </React.Fragment>
  );
}
