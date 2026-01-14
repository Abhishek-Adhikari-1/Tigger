import { lazy } from "react";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

const SignInPage = lazy(() => import("../app/auth/signin/page"));
const SignUpPage = lazy(() => import("../app/auth/signup/page"));
const DashboardPage = lazy(() => import("../app/dashboard/page"));
const ProjectsPage = lazy(() => import("../app/projects/page"));
const ProjectPageSpecific = lazy(() =>
  import("../app/projects/[projectId]/page")
);
const TaskDetailPage = lazy(() =>
  import("../app/projects/[projectId]/[taskId]/page")
);

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
        index: true,
        component: DashboardPage,
        public: false,
      },
      {
        path: "projects",
        component: ProjectsPage,
        public: false,
      },
      {
        path: "projects/:projectId",
        component: ProjectPageSpecific,
        public: false,
      },
      {
        path: "projects/:projectId/:taskId",
        component: TaskDetailPage,
        public: false,
      },
    ],
  },
];

export default routes;
