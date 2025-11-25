import { Bubble, Repeat } from "iconsax-react";
import { PiBinocularsBold, PiSwap } from "react-icons/pi";

export default [
	{
		heading: "CROSS-CHAIN BRIDGE",
		links: [
			{
				title: "Multichain Bridge",
				icon: <Repeat />,
				path: "https://bridge.liquids.fi/",
			},
			{
				title: "Liquidity Protocol",
				icon: <Bubble />,
				path: "https://bridge.liquids.fi/liquidity",
			},
		],
	},
	{
		heading: "ORACLE NETWORK",
		links: [
			{
				title: "Explorer",
				path: "https://explorer.liquids.fi/",
				icon: <PiBinocularsBold className="text-[24px]" />,
			},
			{
				title: "Supported chains",
				path: "https://explorer.liquids.fi/supported-chains",
				icon: <PiSwap className="text-[24px]" />,
			},
		],
	},
];
