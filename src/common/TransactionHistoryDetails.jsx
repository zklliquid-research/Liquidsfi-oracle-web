/* eslint-disable react/prop-types */
import { capitalizeFirst, timeAgo } from "@/utils";
import HistoryDetails from "./HistoryDetails";
import Status from "./Status";

function TransactionHistoryDetails({ transaction }) {
	return (
		<div className="text-sm overflow-scroll">
			<div className="px-5">
				<HistoryDetails title="Msg ID" value={transaction.tx_id} iconPresent />
				<HistoryDetails
					title="Origin ID"
					value={transaction.origin_chain_info.origin_id}
					iconPresent
				/>
				<HistoryDetails
					title="Destination ID"
					value={transaction.dest_chain_info.dest_id}
					iconPresent
				/>
				<HistoryDetails
					title="Origin Transaction Hash"
					value={transaction.origin_tx_hash}
					textColor="text-[#2DD4BF]"
					iconPresent
					link={transaction.origin_chain_info.origin_tx_explorer}
				/>
				<HistoryDetails
					title="Destination Transaction Hash"
					value={transaction.destination_tx_hash}
					textColor="text-[#2DD4BF]"
					iconPresent
					link={transaction.dest_chain_info.dest_tx_explorer}
				/>
				<HistoryDetails
					title="Transaction Data"
					value={transaction.tx_data}
					iconPresent
				/>
				<HistoryDetails
					title="Origin Status"
					value={capitalizeFirst(transaction.origin_status)}
				/>
				<HistoryDetails
					title="Destination Status"
					value={capitalizeFirst(transaction.destination_status)}
				/>

				<HistoryDetails
					title="Final Status"
					value={<Status transaction={transaction} />}
				/>

				{transaction.error && (
					<HistoryDetails
						title="Error"
						value={transaction.error.message}
						textColor="text-red-400"
					/>
				)}

				<HistoryDetails
					title="Sender"
					value={transaction.origin_chain_info.sender}
					textColor="text-[#2DD4BF]"
					iconPresent
					link={transaction.origin_chain_info.sender_explorer}
				/>

				<HistoryDetails
					title="Origin Contract"
					value={transaction.origin_chain_info.origin_contract}
					textColor="text-[#2DD4BF]"
					iconPresent
					link={transaction.origin_chain_info.origin_contract_explorer}
				/>

				<HistoryDetails
					title="Destination Contract"
					value={transaction.dest_chain_info.destination_contract}
					textColor="text-[#2DD4BF]"
					iconPresent
					link={transaction.dest_chain_info.destination_contract_explorer}
				/>

				<HistoryDetails
					title="Transmission Attempt Count"
					value={transaction.transmission_attempt_count}
				/>

				<HistoryDetails
					title="Source Chain"
					value={
						<span className="font-medium flex items-center text-left text-[#D2D5D9] gap-2">
							<img
								src={transaction.origin_chain_info.origin_icon}
								className="h-7 w-7"
								alt=""
							/>

							<span>{transaction.origin_chain_info.origin_name}</span>
						</span>
					}
				/>

				<HistoryDetails
					title="Destination Chain"
					value={
						<span className="font-medium flex items-center text-left text-[#D2D5D9] gap-2">
							<img
								src={transaction.dest_chain_info.dest_icon}
								className="h-7 w-7"
								alt=""
							/>

							<span>{transaction.dest_chain_info.dest_name}</span>
						</span>
					}
				/>

				<HistoryDetails
					title="Created At"
					value={timeAgo(transaction.created_at)}
				/>

				<HistoryDetails
					title="Updated At"
					value={timeAgo(transaction.updated_at)}
				/>
			</div>
		</div>
	);
}

export default TransactionHistoryDetails;
