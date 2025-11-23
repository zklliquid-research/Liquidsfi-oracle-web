import axios from "axios";

export const getTransactionHistory = async (query) => {
	const { data } = await axios.get(
		`${
			import.meta.env.VITE_BASE_URL
		}/get-historical-transactions?limit=10&tx_id=${query}`
	);

	return data.data;
};

export const getSupportedChains = async () => {
	const { data } = await axios.get(
		`${import.meta.env.VITE_BASE_URL}/supported-chains`
	);

	return data;
};

export const getExplorerStat = async () => {
	const { data } = await axios.get(
		`${import.meta.env.VITE_BASE_URL}/get-oracle-stats`
	);

	return data;
};

export const getTransactionsHistory = async (query) => {
	const { data } = await axios.get(
		`${
			import.meta.env.VITE_BASE_URL
		}/get-historical-transactions?tx_id=${query}`
	);

	return data.data;
};
