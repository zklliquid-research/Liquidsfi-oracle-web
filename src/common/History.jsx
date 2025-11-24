/* eslint-disable react/prop-types */
import { shortenString, timeAgo } from "@/utils";
import Status from "./Status";
import ToFrom from "./ToFrom";

function History({ transaction }) {
	return (
		<div className="flex flex-wrap gap-2 items-center justify-between">
			<div className="w-[200px]">
				<div className="flex items-center gap-2">
					<span className="text-[14px]">Msg ID</span>
					<span className="text-[#2DD4BF] text-[14px]">
						{shortenString(transaction.tx_id, 12)}
					</span>
				</div>
				<span className="text-[#B2B9C7] text-[14px] block text-left">
					{timeAgo(transaction?.updated_at)}
				</span>
			</div>

			<ToFrom transaction={transaction} />

			<Status transaction={transaction} />
		</div>
	);
}

export default History;
