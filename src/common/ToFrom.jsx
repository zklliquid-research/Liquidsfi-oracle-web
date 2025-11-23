/* eslint-disable react/prop-types */
import { shortenString } from "@/utils";

function ToFrom({ transaction }) {
	return (
		<div className="space-y-1 min-w-[200px]">
			<div className="flex items-center gap-2">
				<img
					src={transaction.origin_chain_info.origin_icon}
					className="h-7 w-7"
					alt=""
				/>
				<span className="text-[14px]">From</span>
				<span className="text-[#2DD4BF] text-[14px]">
					{shortenString(transaction.origin_chain_info.origin_contract, 12)}
				</span>
			</div>
			<div className="flex items-center gap-2">
				<img
					src={transaction.dest_chain_info.dest_icon}
					className="h-7 w-7"
					alt=""
				/>
				<span className="text-[14px]">To</span>
				<span className="text-[#2DD4BF] text-[14px]">
					{shortenString(transaction.dest_chain_info.destination_contract, 12)}
				</span>
			</div>
		</div>
	);
}

export default ToFrom;
