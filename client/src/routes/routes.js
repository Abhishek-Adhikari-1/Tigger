import { lazy } from "react";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

const SignInPage = lazy(() => import("../app/auth/signin/page"));
const SignUpPage = lazy(() => import("../app/auth/signup/page"));
const DashboardPage = lazy(() => import("../app/dashboard/page"));
const ProjectsPage = lazy(() => import("../app/projects/page"));

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
    component: MainLayout,
    public: false,
    children: [
      {
        path: "",
        component: DashboardPage,
        public: false,
      },
      {
        path: "projects",
        component: ProjectsPage,
        public: false,
      },
    ],
  },
];

export default routes;
