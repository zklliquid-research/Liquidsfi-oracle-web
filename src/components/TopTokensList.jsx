/* eslint-disable react/prop-types */
import { useContext } from "react";

import { WagmiContext } from "../context/WagmiContext";

import "./css/pagination.css";
import TransactionHistories from "./TransactionHistories";
import { SidebarContext } from "../context/SidebarContext";

function TopTokensList({ transactionData }) {
  const { isConnected } = useContext(WagmiContext);
  const { address, userKey } = useContext(SidebarContext);

  return (
    <div className="">
      <div className="flex items-end justify-between ">
        <div className="flex justify-start gap-2 p-1 font-bold text-lg  ">
          Latest Transfers
        </div>
      </div>

      <div className="py-1 font-Roboto max-h-[754px] bg-[#191A1F] rounded-xl pb-10">
        {address || userKey ? (
          <div className=" pt-[15px] text-[18px]">
            <TransactionHistories transactionData={transactionData} />
          </div>
        ) : (
          <div className="text-center pt-[52px] text-[18px] px-2">
            Please connect your wallet to see your trade history.
          </div>
        )}
      </div>
    </div>
  );
}

export default TopTokensList;
