/* eslint-disable react/prop-types */
import { ArrowRight } from "iconsax-react";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTransactionsHistory } from "../services";
import TransactionHistoryDetails from "../common/TransactionHistoryDetails";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Loader from "../common/Loader";
import Empty from "../common/Empty";

export default function TransactionHistories({ transactionData }) {
	const navigate = useNavigate();
	const { id: txIdFromUrl } = useParams();
	const [selectedTxId, setSelectedTxId] = useState(null);
	const [openTransaction, setOpenTransaction] = useState(null);
	const [isDesktop, setIsDesktop] = useState(
		typeof window !== "undefined" ? window.innerWidth >= 1024 : false
	);

	// Handle window size
	useEffect(() => {
		const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Sync sheet with URL
	useEffect(() => {
		if (!transactionData) return;

		const index = transactionData.findIndex(
			(tx) => String(tx.id) === txIdFromUrl
		);

		if (index !== -1) {
			setOpenTransaction(index);
		} else {
			setOpenTransaction(null);
		}
	}, [txIdFromUrl, transactionData]);

	// Prevent background scrolling
	useEffect(() => {
		document.body.style.overflow = openTransaction !== null ? "hidden" : "";
		return () => (document.body.style.overflow = "");
	}, [openTransaction]);

	function updateUrl(transaction) {
		if (!transaction) navigate("/", { replace: true });
		else navigate(`/transfers/${transaction.id}`, { replace: true });
	}

	const {
		data: transactionHistoryData,
		isLoading: loadingTransactionHistory,
		isError: errorLoadingTransactionHistory,
	} = useQuery({
		queryKey: ["transactionDetails", selectedTxId],
		queryFn: () => getTransactionsHistory(selectedTxId),
		enabled: !!selectedTxId, // only fetch when ID exists
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 5, // 5 min cache
	});

	useEffect(() => {
		if (txIdFromUrl) {
			setSelectedTxId(txIdFromUrl);
		} else {
			setSelectedTxId(null);
		}
	}, [txIdFromUrl]);

	return (
		<div>
			<div className="lg:col-span-9 px-3 md:px-0">
				<div className="flex flex-col mt-4">
					<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
							<div className="overflow-hidden ring-1 ring-black ring-opacity-5 md:rounded-xl">
								<table className="min-w-full  lg:divide-y lg:divide-gray-600">
									<thead className="table-header-group border-b border-gray-600">
										<tr>
											<th className="py-3.5 px-4 text-left sm:px-6 text-sm whitespace-nowrap font-medium text-gray-200">
												Transaction Details
											</th>

											<th className="py-3.5 px-4 text-left sm:px-6 text-sm whitespace-nowrap font-medium text-gray-200">
												TimeStamp
											</th>

											<th className="py-3.5 px-4 text-left sm:px-6 text-sm whitespace-nowrap font-medium text-gray-200">
												Status
											</th>
										</tr>
									</thead>

									<tbody className="divide-y divide-gray-600">
										{[...transactionData]
											.reverse()
											.map((transaction, index) => {
												const isOpen = openTransaction === index;

												return (
													<Fragment key={index}>
														<tr
															className="cursor-pointer hover:bg-[#202026]"
															onClick={() => {
																// if (isOpen) {
																// 	setOpenTransaction(null);
																// 	updateUrl(null);
																// } else {
																// 	setOpenTransaction(index);
																// 	updateUrl(transaction);
																// 	setTransactionDataDetails(
																// 		detailsCache[transaction.id]
																// 	);
																// }
																if (isOpen) {
																	setOpenTransaction(null);
																	updateUrl(null);
																	setSelectedTxId(null);
																} else {
																	setOpenTransaction(index); // open instantly
																	setSelectedTxId(transaction.id); // triggers React Query fetch
																	updateUrl(transaction);
																}
															}}
														>
															<td className="px-4 py-4 text-sm font-bold text-gray-200 sm:px-6 whitespace-nowrap">
																<div className=" inline-flex items-center flex-wrap gap-4">
																	<img
																		className="flex-shrink-0 object-cover w-7 h-7 mr-3 rounded-full"
																		src={`/cryptoIcons/${transaction.name}.svg`}
																		alt=""
																	/>
																	<div className="flex">{`${transaction.amount} ${transaction.name}: `}</div>
																	<div className="flex">
																		<img
																			className="ml-2 flex-shrink-0 object-cover w-7 h-7 mr-3 rounded-full"
																			src={`/cryptoIcons/${transaction.from}.svg`}
																			alt=""
																		/>
																		<ArrowRight size="24" color="#37d67a" />
																		<img
																			className="ml-2 flex-shrink-0 object-cover w-7 h-7 mr-3 rounded-full"
																			src={`/cryptoIcons/${transaction.to}.svg`}
																			alt=""
																		/>
																	</div>
																</div>
																{/* <div className="space-y-1 2xl:hidden pl-11">
																	<p className="text-sm font-medium text-gray-200">
																		{transaction.time}
																	</p>
																</div> */}
															</td>

															<td className="px-4 py-4 text-sm font-medium text-gray-200 sm:px-6 2xl:table-cell whitespace-nowrap">
																{transaction.time}
															</td>

															<td className=" px-4 py-4 text-sm font-medium text-gray-200 sm:px-6 2xl:table-cell whitespace-nowrap">
																<div className="inline-flex items-center">
																	<svg
																		className="mr-1.5 h-2.5 w-2.5 text-green-500"
																		fill="currentColor"
																		viewBox="0 0 8 8"
																	>
																		<circle cx="4" cy="4" r="3" />
																	</svg>
																	Submitted
																</div>
															</td>

															{/* <td className="px-4 py-4 text-sm font-medium text-right text-gray-200 sm:px-6 whitespace-nowrap 2xl:hidden">
																<div className="mt-1 ">
																	<div className="inline-flex items-center justify-end mt-1">
																		<svg
																			className="mr-1.5 h-2.5 w-2.5 text-green-500"
																			fill="currentColor"
																			viewBox="0 0 8 8"
																		>
																			<circle cx="4" cy="4" r="3" />
																		</svg>
																		Submitted
																	</div>
																</div>
															</td> */}
														</tr>
													</Fragment>
												);
											})}
									</tbody>
								</table>

								<AnimatePresence>
									{openTransaction !== null && (
										<>
											<motion.div
												key="overlay"
												initial={{ opacity: 0 }}
												animate={{ opacity: 0.5 }}
												exit={{ opacity: 0 }}
												transition={{ duration: 0.3 }}
												className="fixed inset-0 bg-black z-40"
												onClick={() => {
													setOpenTransaction(null);
													updateUrl(null);
												}}
											/>

											{/* PANEL */}
											{isDesktop ? (
												<motion.div
													key="desktop-panel"
													initial={{ x: "100%" }}
													animate={{ x: 0 }}
													exit={{ x: "100%" }}
													transition={{
														type: "tween",
														duration: 0.4,
														ease: "easeInOut",
													}}
													className="fixed right-0 top-0 bottom-0 w-[calc(100vw-150px)] bg-[#04131F] z-50 border-none rounded-xl flex flex-col overflow-hidden"
												>
													<div className="flex items-center justify-between pr-4 py-4">
														<h1 className="text-[20px] px-5 lg:text-[32px] text-white font-bold">
															Transaction Details
														</h1>
														<button
															onClick={() => {
																setOpenTransaction(null);
																updateUrl(null);
															}}
															className="bg-[#09243B] rounded-lg p-1.5 hover:bg-[#0D374E] transition"
														>
															<IoMdClose className="size-6 text-white" />
														</button>
													</div>

													<hr className="border border-[#09243B] my-6" />

													{loadingTransactionHistory ? (
														<Loader />
													) : errorLoadingTransactionHistory ? (
														<Empty title="Failed to load transaction..." />
													) : (
														<TransactionHistoryDetails
															transaction={transactionHistoryData[0]}
														/>
													)}
												</motion.div>
											) : (
												<motion.div
													key="mobile-panel"
													initial={{ y: "100%" }}
													animate={{ y: 0 }}
													exit={{ y: "100%" }}
													transition={{
														type: "tween",
														duration: 0.4,
														ease: "easeInOut",
													}}
													className="fixed bottom-0 w-screen right-0 h-[80%] bg-[#04131F] z-50 border-none rounded-t-xl flex flex-col overflow-hidden"
												>
													<div className="flex items-center justify-between pr-4 py-4">
														<h1 className="text-[20px] text-left px-5 lg:text-[32px] text-white font-bold">
															Transaction Details
														</h1>
														<button
															onClick={() => {
																setOpenTransaction(null);
																updateUrl(null);
															}}
															className="bg-[#09243B] rounded-lg p-1.5 hover:bg-[#0D374E] transition"
														>
															<IoMdClose className="size-6 text-white" />
														</button>
													</div>
													<hr className="border border-[#09243B] my-6" />

													{loadingTransactionHistory ? (
														<Loader />
													) : errorLoadingTransactionHistory ? (
														<Empty title="Failed to load transaction..." />
													) : (
														<TransactionHistoryDetails
															transaction={transactionHistoryData[0]}
														/>
													)}
												</motion.div>
											)}
										</>
									)}
								</AnimatePresence>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
