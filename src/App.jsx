import { createBrowserRouter, RouterProvider } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout.jsx";

import ErrorPage from "./layouts/Error.jsx";

import Trade from "./pages/swap/Trade";
import Bridge from "./pages/swap/Bridge";
import Liquidity from "./pages/add-liquidity/Liquidity";
import { SidebarContextProvider } from "./context/SidebarContext";
import Explorer from "./pages/swap/Explorer.jsx";
import SupportedChain from "./pages/swap/SupportedChain.jsx";
import NotFound from "./common/NotFound.jsx";

const isBridge =
  typeof window !== "undefined" && window.location.host.startsWith("bridge.");
const isExplorer =
  typeof window !== "undefined" && window.location.host.startsWith("explorer.");

const bridgeRouter = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Trade /> },
      { path: "transfers/:transferId", element: <Trade /> },
      { path: "liquidity", element: <Liquidity /> },
      { path: "faucet", element: <Bridge /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

const explorerRouter = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Explorer /> },
      { path: "msg/:id", element: <Explorer /> },
      { path: "chains", element: <SupportedChain /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

export default function App() {
  const router = isBridge ? bridgeRouter : explorerRouter;
  return (
    <SidebarContextProvider>
      <RouterProvider router={router} />
    </SidebarContextProvider>
  );
}
