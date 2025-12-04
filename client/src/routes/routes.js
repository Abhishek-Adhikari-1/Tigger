import AuthLayout from "../layouts/AuthLayout";
import SignInPage from "../app/auth/signin/page";
import SignUpPage from "../app/auth/signup/page";
import DashboardPage from "../app/dashboard/page";

const routes = [
  {
    path: "/auth",
    component: AuthLayout,
    public: true,
    children: [
      {
        path: "signin/*",
        component: SignInPage,
        public: true,
      },
      {
        path: "signup/*",
        component: SignUpPage,
        public: true,
      },
    ],
  },
  {
    path: "/",
    component: DashboardPage,
    public: false,
  },
];

export default routes;
