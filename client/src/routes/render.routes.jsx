import { Protect, RedirectToSignIn } from "@clerk/clerk-react";
import { Route } from "react-router-dom";

export default function renderRoutes(routesArray) {
  return routesArray.map(
    ({ path, component: Component, public: isPublic, children }) => {
      const element = isPublic ? (
        <Component />
      ) : (
        <>
          <Protect fallback={<RedirectToSignIn />}>
            <Component />
          </Protect>
        </>
      );

      return (
        <Route key={path} path={path} element={element}>
          {children && renderRoutes(children)}
        </Route>
      );
    }
  );
}
