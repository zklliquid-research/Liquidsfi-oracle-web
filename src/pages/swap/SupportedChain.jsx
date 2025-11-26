import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import SupportedChains from "../../common/SupportedChains";

function SupportedChain() {
  return (
    <main className="pb-4 h-full">
      <div className="mx-auto px-4">
        {/* <Link to="/" className="flex items-center gap-2 mb-4">
          <FaArrowLeftLong className="text-[28px] text-white" />
          Back
        </Link> */}

        <div className=" gap-[38px]">
          <SupportedChains detailsPage={true} />
        </div>
      </div>
    </main>
  );
}

export default SupportedChain;
