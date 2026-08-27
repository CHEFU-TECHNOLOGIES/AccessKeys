import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import AccessKeys from "./pages/AccessKeys";
import Employees from "./pages/Employees";
import Workspaces from "./pages/Workspaces";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Overview },
      { path: "access-keys", Component: AccessKeys },
      { path: "employees", Component: Employees },
      { path: "workspaces", Component: Workspaces },
      { path: "activity", Component: Activity },
      { path: "settings", Component: Settings },
    ],
  },
]);
