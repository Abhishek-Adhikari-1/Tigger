import { Protect, RedirectToSignIn } from "@clerk/clerk-react";
import { Route } from "react-router-dom";

export default function renderRoutes(routesArray) {
  return routesArray.map(
    ({ path, component: Component, public: isPublic, children, index }) => {
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
        <Route key={path} path={path} element={element} index={index}>
          {children && renderRoutes(children)}
        </Route>
      );
    }
  );
}
