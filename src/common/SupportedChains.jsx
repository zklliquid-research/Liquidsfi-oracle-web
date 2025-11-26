import { useQuery } from "@tanstack/react-query";
import { getSupportedChains } from "../services";
import Loader from "./Loader";
import Empty from "./Empty";
import { Fragment } from "react";
import { shortenString } from "../utils";

function SupportedChains() {
	const {
		data: supportedChainsData,
		isLoading: loadingSupportedChains,
		isError: errorLoadingSupportedChains,
	} = useQuery({
		queryKey: ["supportedChains"],
		queryFn: () => getSupportedChains(),
		keepPreviousData: true,
	});

	return (
		<div className="lg:col-span-3 space-y-4">
			<div className="flex justify-between items-center min-h-[50px]">
				<h2 className="text-[20px] font-bold">Supported Chains</h2>
			</div>

			<div className="border border-[#09243B] p-6 rounded-xl bg-[#04131F]">
				{loadingSupportedChains ? (
					<Loader />
				) : errorLoadingSupportedChains ? (
					<Empty title="Failed to load supported networks..." />
				) : supportedChainsData.length === 0 ? (
					<Empty title="No supported networks found..." />
				) : (
					<>
						<div className="flex items-center justify-between gap-2 text-[#E8E8E8] text-[14px] mb-6">
							<span>Chain</span>
							<span>Oracle Contract</span>
						</div>
						{supportedChainsData.map((network, i) => (
							<Fragment key={i}>
								<div className="border-b border-[#09243B] pb-4 flex flex-wrap justify-between gap-4 items-center mb-4 last:border-0 last:pb-0 last:mb-0">
									<div className="flex items-center gap-3">
										<img src={network.icon} className="h-7 w-7" alt="" />

										<span className="text-[14px] hidden [@media(min-width:408px)]:block text-[#E5E5EA]">
											{network.name}
										</span>
									</div>

									<p className="text-[#E5E5EA] text-[14px] overflow-scroll text-right">
										{shortenString(network.oracleContract)}
									</p>
								</div>
							</Fragment>
						))}
					</>
				)}
			</div>
		</div>
	);
}

export default SupportedChains;
