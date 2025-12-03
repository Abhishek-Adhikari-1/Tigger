import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes/routes";
import renderRoutes from "./routes/render.routes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {renderRoutes(routes)}
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
