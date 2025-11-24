import { CloseCircle } from "iconsax-react";
import React, { useRef, useEffect, useContext } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { txExplorerUrl } from "../contracts/contracts-details.json";

const SuccessModal = ({ onClose, hashUrl }) => {
	const {
		successModalIsOpen,
		setSuccessModalIsOpen,
		setMessageId,
		messageId,
		selectedSourceChain,
	} = useContext(SidebarContext);
	const modalRef = useRef(null);

	// useEffect(() => {
	//   const handleClickOutside = (event) => {
	//     if (modalRef.current && !modalRef.current.contains(event.target)) {
	//       onClose();
	//       // setMessageId("");
	//     }
	//   };

	//   document.addEventListener("mousedown", handleClickOutside);

	//   return () => {
	//     document.removeEventListener("mousedown", handleClickOutside);
	//   };
	// }, [onClose]);

	const handleExplorerOpen = () => {
		window.open(
			`${txExplorerUrl[selectedSourceChain?.id]}/${messageId}`,
			"_blank"
		);
		setSuccessModalIsOpen(false);
	};

	if (!successModalIsOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
			<div
				ref={modalRef}
				className=" w-full max-w-sm bg-gray-100  shadow-xl  rounded-xl"
			>
				<button
					onClick={() => setSuccessModalIsOpen(false)}
					className="w-full justify-end items-end flex p-1"
				>
					{" "}
					<CloseCircle size="32" color="#555555" />
				</button>
				<div className="px-4 py-5">
					<div className="text-center">
						<svg
							className="w-16 h-16 mx-auto text-green-600"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="1"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						<p className="mt-5 text-xl font-bold text-gray-900">
							Transaction Submitted successfully
						</p>
						<p className="mt-3 text-sm font-medium text-gray-500">
							You can track the transfer status on LiquidsFi explorer
						</p>
						<div className="mt-8">
							<button
								onClick={handleExplorerOpen}
								type="button"
								className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-indigo-600 transition-all duration-200 bg-indigo-100 border border-transparent rounded-md "
							>
								View on Explorer
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SuccessModal;
