import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import AccessKeys from "./pages/AccessKeys";
import Merchant from "./pages/Merchant";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: AccessKeys },
      { path: "access-keys", Component: AccessKeys },
      { path: "merchant", Component: Merchant },
    ],
  },
]);
