import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout.jsx";

import ErrorPage from "./layouts/Error.jsx";
import Home from "./pages/Home.jsx";

import Trade from "./pages/swap/Trade";
import Bridge from "./pages/swap/Bridge";
import Liquidity from "./pages/add-liquidity/Liquidity";
import { SidebarContextProvider } from "./context/SidebarContext";
import TransferDetails from "./pages/transfer/TransferDetails.jsx";
import Explorer from "./pages/swap/Explorer.jsx";
import SupportedChain from "./pages/swap/SupportedChain.jsx";
// import TransactionDetails from "./pages/transfer/TransactionDetails.jsx";

const client = import.meta.env.VITE_CLIENT;

// Define routes conditionally BEFORE the JSX
let routeGroup;
if (client === "APP") {
  routeGroup = (
    <>
      <Route index element={<Trade />} />
      <Route path="liquidity" element={<Liquidity />} />
    </>
  );
} else if (client === "EXPLORER") {
  routeGroup = (
    <>
      <Route index element={<Explorer />} />
      <Route path="/msg/:id" element={<Explorer />} />

      <Route path="/supported-chains" element={<SupportedChain />} />
    </>
  );
} else {
  routeGroup = (
    <>
      <Route index element={<div>Invalid BASE_URL</div>} />
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {" "}
      <Route exact path="/" element={<Home />} errorElement={<ErrorPage />} />
      <Route path="/" element={<DashboardLayout />}>
        {routeGroup}
      </Route>
    </>
  )
);

function App() {
  return (
    <SidebarContextProvider>
      <RouterProvider router={router} />
    </SidebarContextProvider>
  );
}

export default App;
