/* eslint-disable no-unused-vars */
import { Fragment, useEffect, useState } from "react";
import Search from "./Search";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTransactionHistory } from "../services";
import Loader from "./Loader";
import Empty from "./Empty";
import History from "./History";
import TransactionHistoryDetails from "./TransactionHistoryDetails";
import { Popover } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

function TransactionHistory() {
	const [query, setQuery] = useState("");
	const navigate = useNavigate();
	const { id: transactionIdFromUrl } = useParams();

	const {
		data: transactionHistoryData,
		isLoading: loadingTransactionHistory,
		isError: errorLoadingTransactionHistory,
	} = useQuery({
		queryKey: ["transactionHistory", query],
		queryFn: () => getTransactionHistory(query),
		keepPreviousData: true,
	});

	const [openTransaction, setOpenTransaction] = useState(null);
	const [isDesktop, setIsDesktop] = useState(
		typeof window !== "undefined" ? window.innerWidth >= 1024 : false
	);

	useEffect(() => {
		const handleResize = () => {
			setIsDesktop(window.innerWidth >= 1024);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (!transactionHistoryData) return;

		const index = transactionHistoryData.findIndex(
			(tx) => String(tx.tx_id) === transactionIdFromUrl
		);

		if (index !== -1) {
			setOpenTransaction(index);
		} else {
			setOpenTransaction(null);
		}
	}, [transactionIdFromUrl, transactionHistoryData]);

	function updateUrl(transaction) {
		if (!transaction) navigate("/", { replace: true });
		else navigate(`/msg/${transaction.tx_id}`, { replace: true });
	}

	useEffect(() => {
		if (openTransaction !== null) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [openTransaction]);

	const isVisible = query.length < 50;
	return (
		<div className="lg:col-span-4 space-y-4">
			{/* <div className="flex justify-between relative  items-center gap-4 flex-wrap min-h-[50px]">
				{isVisible && (
					<h2
						className="text-[20px] font-bold shrink-0 opacity-0 translate-y-2 transition-all duration-500 ease-out"
						style={{
							opacity: isVisible ? 1 : 0,
							transform: isVisible ? "translateY(0)" : "translateY(10px)",
						}}
					>
						Latest Transactions
					</h2>
				)}

				<Search visible={true} query={query} setQuery={setQuery} />
			</div> */}

			<div className="flex justify-between relative items-center gap-4 flex-wrap min-h-[50px]">
				{isVisible && (
					<motion.h2
						layout
						className="text-[20px] font-bold shrink-0 transition-all duration-300"
						animate={{
							opacity: isVisible ? 1 : 0,
							y: isVisible ? 0 : 10,
						}}
					>
						Latest Transactions
					</motion.h2>
				)}

				<motion.div
					layout
					transition={{ duration: 0.35, ease: "easeInOut" }}
					className="flex-1"
				>
					<Search visible={true} query={query} setQuery={setQuery} />
				</motion.div>
			</div>

			<div className="border border-[#09243B] p-6 rounded-xl bg-[#04131F]">
				{loadingTransactionHistory ? (
					<Loader />
				) : errorLoadingTransactionHistory ? (
					<Empty title="Failed to load transaction..." />
				) : transactionHistoryData.length === 0 ? (
					<Empty title="No transaction found..." />
				) : (
					transactionHistoryData.map((transaction, i) => (
						<Fragment key={i}>
							<div className="border-b border-[#09243B] pb-4 cursor-pointer mb-4 last:border-0 last:pb-0 last:mb-0">
								{isDesktop ? (
									<Popover>
										{({ open, close }) => {
											const isOpen = openTransaction === i;
											return (
												<>
													<Popover.Button
														onClick={() => {
															if (isOpen) {
																// closing
																setOpenTransaction(null);
																updateUrl(null);
															} else {
																// opening
																setOpenTransaction(i);
																updateUrl(transaction);
															}
														}}
														className="w-full focus:outline-none"
													>
														<History transaction={transaction} />
													</Popover.Button>

													<AnimatePresence>
														{isOpen && (
															<>
																<motion.div
																	key="overlay"
																	initial={{ opacity: 0 }}
																	animate={{ opacity: 0.5 }}
																	exit={{ opacity: 0 }}
																	transition={{ duration: 0.3 }}
																	className="fixed inset-0 bg-black z-40"
																	onClick={() => {
																		close();
																		navigate("/", { replace: true });
																		setOpenTransaction(null);
																	}}
																/>
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
																		<h1 className="text-[20px] text-left px-5 lg:text-[32px] text-white font-bold">
																			Transaction Details
																		</h1>
																		<button
																			onClick={() => {
																				close();
																				navigate("/", {
																					replace: true,
																				});
																				setOpenTransaction(null);
																			}}
																			className="bg-[#09243B] rounded-lg p-1.5 hover:bg-[#0D374E] transition"
																		>
																			<IoMdClose className="size-6 text-white" />
																		</button>
																	</div>
																	<hr className="border border-[#09243B] my-6" />

																	<TransactionHistoryDetails
																		transaction={transaction}
																	/>
																</motion.div>
															</>
														)}
													</AnimatePresence>
												</>
											);
										}}
									</Popover>
								) : (
									<Popover>
										{({ open, close }) => {
											const isOpen = openTransaction === i;
											return (
												<>
													<Popover.Button
														onClick={() => {
															const next = isOpen ? null : i;
															setOpenTransaction(next);
															updateUrl(next ? null : transaction);
														}}
														className="w-full focus:outline-none"
													>
														<History transaction={transaction} />
													</Popover.Button>

													<AnimatePresence>
														{isOpen && (
															<>
																<motion.div
																	key="overlay"
																	initial={{ opacity: 0 }}
																	animate={{ opacity: 0.5 }}
																	exit={{ opacity: 0 }}
																	transition={{ duration: 0.3 }}
																	className="fixed inset-0 bg-black z-40"
																	onClick={() => {
																		close();
																		navigate("/", { replace: true });
																		setOpenTransaction(null);
																	}}
																/>
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
																				close();
																				navigate("/", {
																					replace: true,
																				});
																				setOpenTransaction(null);
																			}}
																			className="bg-[#09243B] rounded-lg p-1.5 hover:bg-[#0D374E] transition"
																		>
																			<IoMdClose className="size-6 text-white" />
																		</button>
																	</div>
																	<hr className="border border-[#09243B] my-6" />

																	<TransactionHistoryDetails
																		transaction={transaction}
																	/>
																</motion.div>
															</>
														)}
													</AnimatePresence>
												</>
											);
										}}
									</Popover>
								)}
							</div>
						</Fragment>
					))
				)}
			</div>
		</div>
	);
}

export default TransactionHistory;
