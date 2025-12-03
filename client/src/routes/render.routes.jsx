import { Route } from "react-router-dom";

export default function renderRoutes(routesArray) {
  return routesArray.map(
    ({ path, component: Component, public: isPublic, children }) => {
      const element = isPublic ? (
        <Component />
      ) : (
        <div>
          <div>This is procted route</div>
          <Component />
        </div>
      );

      return (
        <Route key={path} path={path} element={element}>
          {children && renderRoutes(children)}
        </Route>
      );
    }
  );
}
