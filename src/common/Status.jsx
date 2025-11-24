/* eslint-disable react/prop-types */
import { IoCheckmarkCircle } from "react-icons/io5";
import { RiErrorWarningFill } from "react-icons/ri";
import { capitalizeFirst } from "@/utils";

function Status({ transaction }) {
	return (
		<div
			className={`flex w-[100px] items-center gap-1 shrink-0 text-[12px] sm:text-[15px] py-1.5 px-3 rounded-3xl ${
				transaction.final_status === "success"
					? "bg-[#DDF8E6] text-[#1E633A]"
					: transaction.final_status === "pending"
					? "bg-yellow-500/20 text-yellow-400"
					: "bg-[#FCE9E9] text-red-400"
			} `}
		>
			{transaction.final_status === "pending" ? (
				<RiErrorWarningFill className="text-[16px] text-[#E28204]" />
			) : transaction.final_status === "success" ? (
				<IoCheckmarkCircle className="text-[16px] text-[#2FB96C]" />
			) : (
				<RiErrorWarningFill className="text-[16px] text-[#F31307]" />
			)}
			{capitalizeFirst(transaction?.final_status)}
		</div>
	);
}

export default Status;
