/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import {
	PiPaperPlaneTilt,
	PiShieldCheck,
	PiUserList,
	PiUsersThree,
	PiWarningCircle,
} from "react-icons/pi";
import { getExplorerStat } from "../services";

export default function ExplorerStats() {
	const {
		data: explorerStatData,
		isLoading: loadingExplorerStatData,
		isError: errorLoadingExplorerStatData,
	} = useQuery({
		queryKey: ["explorerStat"],
		queryFn: () => getExplorerStat(),
		keepPreviousData: true,
	});

	return (
		<>
			{loadingExplorerStatData ? (
				<div className="flex flex-shrink-0 gap-4 mt-8 overflow-auto scroll-track-hide animate-pulse">
					{/* Total Messages */}
					<div className="inline-flex items-center w-full min-w-[272px] gap-3 bg-[#04131F] rounded-xl p-3">
						<div className="w-[30px] h-[30px] bg-[#0A2233] rounded-md" />
						<div className="flex flex-col gap-2">
							<div className="w-28 h-3 bg-[#0A2233] rounded" />
							<div className="flex items-end gap-2 mt-1">
								<div className="w-16 h-4 bg-[#0A2233] rounded" />
							</div>
						</div>
					</div>

					{/* Total Verified Messages */}
					<div className="inline-flex items-center w-full min-w-[272px] gap-3 bg-[#04131F] rounded-xl p-3">
						<div className="w-[30px] h-[30px] bg-[#0A2233] rounded-md" />
						<div className="flex flex-col gap-2">
							<div className="w-36 h-3 bg-[#0A2233] rounded" />
							<div className="flex items-end gap-2 mt-1">
								<div className="w-20 h-4 bg-[#0A2233] rounded" />
							</div>
						</div>
					</div>

					{/* Total User Count */}
					<div className="inline-flex items-center w-full min-w-[272px] gap-3 bg-[#04131F] rounded-xl p-3">
						<div className="w-[30px] h-[30px] bg-[#0A2233] rounded-md" />
						<div className="flex flex-col gap-2">
							<div className="w-28 h-3 bg-[#0A2233] rounded" />
							<div className="flex items-end gap-2 mt-1">
								<div className="w-16 h-4 bg-[#0A2233] rounded" />
							</div>
						</div>
					</div>

					{/* Total Clients */}
					<div className="inline-flex items-center w-full min-w-[272px] h-[87px] gap-3 bg-[#04131F] rounded-xl p-3">
						<div className="w-[30px] h-[30px] bg-[#0A2233] rounded-md" />
						<div className="flex flex-col gap-2">
							<div className="w-28 h-3 bg-[#0A2233] rounded" />
							<div className="flex items-end gap-2 mt-1">
								<div className="w-16 h-4 bg-[#0A2233] rounded" />
							</div>
						</div>
					</div>
				</div>
			) : errorLoadingExplorerStatData ? (
				<div className="flex flex-col items-center justify-center w-full mt-8 text-center">
					<PiWarningCircle className="text-[#FF6B6B] text-[40px] mb-3" />
					<p className="text-[#6D7A86] text-sm font-medium">
						Failed to load explorer statistics.
					</p>
					<p className="text-[#4DFFDF] text-xs mt-1">
						{"An unexpected error occurred."}
					</p>
				</div>
			) : (
				<div className="flex flex-shrink-0 gap-4 mt-8 overflow-auto scroll-track-hide">
					<div className="inline-flex items-center w-full min-w-[272px] gap-3 bg-[#04131F] h-[88px] rounded-xl p-3">
						<PiPaperPlaneTilt className="text-[#4DFFDF] text-[24px]" />
						<div>
							<p className="text-[#6D7A86] text-sm font-medium">
								Total Messages
							</p>
							<div className="flex items-end gap-2 mt-1">
								<p className="text-base font-semibold leading-5">
									{explorerStatData?.totalTransactions}
								</p>
							</div>
						</div>
					</div>

					<div className="inline-flex items-center w-full min-w-[272px] gap-3 bg-[#04131F]  rounded-xl p-3">
						<PiShieldCheck className="text-[#4DFFDF] text-[24px]" />
						<div>
							<p className="text-[#6D7A86] text-sm font-medium">
								Total Verified Messages
							</p>
							<div className="flex items-end gap-2 mt-1">
								<p className="text-base font-semibold leading-5">
									{explorerStatData?.totalTransactionsVerified}
								</p>
							</div>
						</div>
					</div>

					<div className="inline-flex items-center w-full min-w-[272px] gap-3 bg-[#04131F]  rounded-xl p-3">
						<PiUsersThree className="text-[#4DFFDF] text-[24px]" />
						<div>
							<p className="text-[#6D7A86] text-sm font-medium">
								Total User Count
							</p>
							<div className="flex items-end gap-2 mt-1">
								<p className="text-base font-semibold leading-5">
									{explorerStatData?.totalUsers}
								</p>
							</div>
						</div>
					</div>

					<div className="inline-flex items-center w-full min-w-[272px] h-[87px] gap-3 bg-[#04131F]  rounded-xl p-3">
						<PiUserList className="text-[#4DFFDF] text-[24px]" />
						<div>
							<p className="text-[#6D7A86] text-sm font-medium">
								Total Clients
							</p>
							<div className="flex items-end gap-2 mt-1">
								<p className="text-base font-semibold leading-5">
									{explorerStatData?.totalClients}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
