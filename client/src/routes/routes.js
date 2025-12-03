import ForgotPassword from "../app/(auth)/forgot-password/page";
import SignIn from "../app/(auth)/signin/page";
import SignUp from "../app/(auth)/signup/page";

const routes = [
  {
    path: "/signin",
    component: SignIn,
    public: true,
  },
  {
    path: "/signup",
    component: SignUp,
    public: true,
  },

  {
    path: "/forgot-password",
    component: ForgotPassword,
    public: false,
  },
];

export default routes;
