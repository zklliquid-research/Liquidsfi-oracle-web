import { IoIosCheckmarkCircle } from "react-icons/io";
import { PiArrowSquareOut } from "react-icons/pi";
import { BiCopy } from "react-icons/bi";

function TransactionDetails() {
  return (
    <div className="bg-[#04131F] mx-auto text-sm py-10">
      <h1 className="text-[20px] px-5 lg:text-[32px] text-white font-bold">
        Transaction Details
      </h1>

      <hr className="border border-[#09243B] my-6" />

      <div className="px-5">
        <div className="border-b p-4 overflow-scroll border-[#09243B] grid grid-cols-1 md:grid-cols-3">
          <span className="text-[#D2D5D9] font-medium col-span-1">
            Message ID
          </span>
          <span className="text-[#D2D5D9] font-medium col-span-2">
            0x00fd299398b26507c84bacdc2d005d1d8b8d3284fb8b15ef41bc73b103ad83cf
          </span>
        </div>

        <div className="border-b p-4 overflow-scroll border-[#09243B] grid grid-cols-1 md:grid-cols-3">
          <span className="text-[#D2D5D9] font-medium col-span-1">
            Source Transaction Hash
          </span>
          <span className="text-[#2DD4BF] font-medium flex items-center gap-2 col-span-2">
            0x2ab89a9a01297debf4cdda591a2e4ec180fde39695beca5562203cf1a121f03a
            <PiArrowSquareOut className="text-white shrink-0" />
            <BiCopy className="text-white shrink-0" />
          </span>
        </div>

        <div className="border-b p-4 overflow-scroll border-[#09243B] grid grid-cols-1 md:grid-cols-3">
          <span className="text-[#D2D5D9] font-medium">
            Destination Transaction Hash
          </span>
          <span className="text-[#2DD4BF] font-medium flex items-center gap-2 col-span-2">
            0x2ab89a9a01297debf4cdda591a2e4ec180fde39695beca5562203cf1a121f03a
            <PiArrowSquareOut className="text-white shrink-0" />
            <BiCopy className="text-white shrink-0" />
          </span>
        </div>

        <div className="border-b p-4 overflow-scroll border-[#09243B] grid grid-cols-1 md:grid-cols-3">
          <span className="text-[#D2D5D9] font-medium">Status</span>

          <span className="p-1 text-xs bg-[#DDF8E6] w-fit rounded-[24px] font-normal flex items-center text-left text-[#1E633A]">
            <IoIosCheckmarkCircle className="" />
            Success
          </span>
        </div>

        <div className="border-b p-4 overflow-scroll border-[#09243B] grid grid-cols-1 md:grid-cols-3">
          <span className="text-[#D2D5D9] font-medium">Source Chain</span>

          <span className="font-medium flex items-center text-left text-[#D2D5D9] gap-2">
            <img src="/monad.svg" alt="" />
            Monad Testnet
          </span>
        </div>

        <div className="border-b p-4 overflow-scroll border-[#09243B] grid grid-cols-1 md:grid-cols-3">
          <span className="text-[#D2D5D9] font-medium">Destination Chain</span>

          <span className="font-medium flex items-center text-left text-[#D2D5D9] gap-2">
            <img src="/avalanche.svg" alt="" />
            Avalanche Fuji
          </span>
        </div>

        <div className="border-b p-4 overflow-scroll border-[#09243B] grid grid-cols-1 md:grid-cols-3">
          <span className="text-[#D2D5D9] font-medium">
            Transaction Timestamp
          </span>

          <span className="font-medium flex items-center text-left text-[#D2D5D9] gap-2">
            2 days ago (September 22, 2025 at 08:10:18 UTC)
          </span>
        </div>

        <div className="border-b p-4 overflow-scroll border-[#09243B] grid grid-cols-1 md:grid-cols-3">
          <span className="text-[#D2D5D9] font-medium">Origin</span>
          <span className="text-[#2DD4BF] font-medium flex items-center gap-2 col-span-2">
            0x2ab89a9a01297debf4cdda591a2e4ec180fde39695beca5562203cf1a121f03a
            <PiArrowSquareOut className="text-white shrink-0" />
            <BiCopy className="text-white shrink-0" />
          </span>
        </div>

        <div className="border-b p-4 overflow-scroll border-[#09243B] grid grid-cols-1 md:grid-cols-3">
          <span className="text-[#D2D5D9] font-medium">From</span>
          <span className="text-[#2DD4BF] font-medium flex items-center gap-2 col-span-2">
            0x2ab89a9a01297debf4cdda591a2e4ec180fde39695beca5562203cf1a121f03a
            <PiArrowSquareOut className="text-white shrink-0" />
            <BiCopy className="text-white shrink-0" />
          </span>
        </div>

        <div className="border-b p-4 overflow-scroll border-[#09243B] grid grid-cols-1 md:grid-cols-3">
          <span className="text-[#D2D5D9] font-medium">To</span>
          <span className="text-[#2DD4BF] font-medium flex items-center gap-2 col-span-2">
            0x2ab89a9a01297debf4cdda591a2e4ec180fde39695beca5562203cf1a121f03a
            <PiArrowSquareOut className="text-white shrink-0" />
            <BiCopy className="text-white shrink-0" />
          </span>
        </div>

        <div className="border-b p-4 overflow-scroll border-[#09243B] grid grid-cols-1 md:grid-cols-3">
          <span className="text-[#D2D5D9] font-medium">Tokens and Amounts</span>

          <span className="font-medium flex items-center text-left text-[#D2D5D9] gap-2">
            None
          </span>
        </div>

        <div className="border-b p-4 overflow-scroll border-[#09243B] grid grid-cols-1 md:grid-cols-3">
          <span className="text-[#D2D5D9] font-medium">Fees</span>

          <span className="font-medium flex items-center text-left text-[#D2D5D9] gap-2">
            0.00528801930759088
          </span>
        </div>

        <div className="border-b p-4 overflow-scroll border-[#09243B] grid grid-cols-1 md:grid-cols-3 items-center">
          <span className="text-[#D2D5D9] font-medium">Data</span>

          <div className="space-y-[12px]">
            <div className="flex items-center gap-2">
              <span className="bg-[#09243B] text-white p-2 rounded-[4px] ">
                HEX
              </span>
              <span className="text-[#D2D5D9] font-medium">
                0002000000000000000000000000000000000000000000000000000000000007
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-[#09243B] text-white p-2 rounded-[4px]">
                HEX
              </span>
              <span className="text-[#D2D5D9] font-medium">
                0002000000000000000000000000000000000000000000000000000000000007
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#09243B] text-white p-2 rounded-[4px] ">
                HEX
              </span>
              <span className="text-[#D2D5D9] font-medium">
                0002000000000000000000000000000000000000000000000000000000000007
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#09243B] text-white p-2 rounded-[4px] ">
                HEX
              </span>
              <span className="text-[#D2D5D9] font-medium">
                0002000000000000000000000000000000000000000000000000000000000007
              </span>
            </div>
          </div>
        </div>

        <div className="border-b p-4 overflow-scroll border-[#09243B] grid grid-cols-1 md:grid-cols-3">
          <span className="text-[#D2D5D9] font-medium">Gas limit</span>

          <span className="font-medium flex items-center text-left text-[#D2D5D9] gap-2">
            352066
          </span>
        </div>

        <div className="border-b p-4 overflow-scroll border-[#09243B] grid grid-cols-1 md:grid-cols-3">
          <span className="text-[#D2D5D9] font-medium">Sequence Number</span>

          <span className="font-medium flex items-center text-left text-[#D2D5D9] gap-2">
            204082
          </span>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetails;
