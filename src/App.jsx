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
import TransactionDetails from "./pages/transfer/TransactionDetails.jsx";

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			{" "}
			<Route exact path="/" element={<Home />} errorElement={<ErrorPage />} />
			<Route path="/" element={<DashboardLayout />}>
				<Route index element={<Navigate to="/bridge" />} />
				<Route path="/bridge" element={<Trade />} />
				<Route path="/transfers">
					<Route path=":transferId" element={<TransferDetails />} />
				</Route>
				<Route path="/explore">
					<Route path=":transferId" element={<TransactionDetails />} />
				</Route>
				<Route path="/liquidity">
					<Route index element={<Liquidity />} />
				</Route>
				<Route path="/loans">
					<Route
						index
						element={
							<div className="absolute top-0 left-0 w-full h-screen opacity-40 bg-black z-10 text-white text-6xl flex  items-center justify-center">
								{" "}
								Coming soon...
							</div>
						}
					/>
				</Route>
				<Route path="/rewards">
					<Route index element={<div>Rewards page</div>} />
				</Route>

				<Route path="/faucet" element={<Bridge />} />
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
