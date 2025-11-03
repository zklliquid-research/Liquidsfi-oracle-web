/* eslint-disable no-unused-vars */
import ExplorerStats from "../../common/ExplorerStats";
import ExplorerBanner from "../../common/ExplorerBanner";
import TransactionHistory from "../../common/TransactionHistory";
import SupportedChains from "../../common/SupportedChains";

function Explorer() {
	return (
		<>
			<div className={`text-white`}>
				<h1 className="heading-primary">Oracle Metric</h1>

				<ExplorerStats />

				<ExplorerBanner />

				<div className="grid grid-cols-1 lg:grid-cols-7 gap-[38px]">
					<TransactionHistory />

					<SupportedChains />
				</div>
			</div>
		</>
	);
}

export default Explorer;
