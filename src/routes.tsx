import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import AccessKeys from "./pages/AccessKeys";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: AccessKeys },
      { path: "access-keys", Component: AccessKeys },
    ],
  },
]);
