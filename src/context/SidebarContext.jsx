import { createContext, useEffect, useState } from "react";
import {
  BASE_FEE,
  ConnectWallet,
  STELLAR_SDK_SERVER_URL,
} from "../freighter-wallet/soroban";
import { v4 as uuid } from "uuid";
import { Soroban } from "@stellar/stellar-sdk";
import { useAccount, useSwitchChain } from "wagmi";

import {
  abi,
  pools,
  tokens,
  chainIds,
  native,
  chainType,
  chainsArr,
  tokensDecimals,
  chainNetwork,
  protocolTokens,
  protocolDecimals,
} from "../contracts/contracts-details.json";
import { erc20Abi, formatUnits } from "viem";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { config } from "../Wagmi";
import axios from "axios";

const SidebarContext = createContext();

const SidebarContextProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [isXLM, setIsXLM] = useState(false);
  const [userPubKey, setUserPubKey] = useState("");
  const { address } = useAccount();

  const [userKey, setUserKey] = useState("");
  const [network, setNetwork] = useState("");
  const [isOpenDeposit, setIsOpenDeposit] = useState(false);
  const [selectedChain, setSelectedChain] = useState(null);

  const [selectedDestinationChain, setSelectedDestinationChain] =
    useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [claimableCashback, setClaimableCashback] = useState("0.");
  const [freighterConnecting, setFreighterConnecting] = useState(false);
  const [updateBalances, setUpdateBalances] = useState(0);
  const [tokenDes, setTokenDes] = useState(null);
  const [messageId, setMessageId] = useState("");
  const [bridgeBalances, setBridgeBalances] = useState(null);
  const [walletBalances, setWalletBalances] = useState(null);
  const [depositBalances, setDepositBalances] = useState(null);
  // const [messageId, setMessageId] = useState("");

  const { chains } = useSwitchChain();

  const stellarChains = [
    {
      id: 12000000,
      name: "Stellar Testnet",
      chainType: "soroban",
      testnet: true,
    },
    // { id: 13000000, name: "Stellar Mainnet" },
  ];

  const allChains = [
    ...stellarChains,
    ...chains.map((chain) => ({ ...chain, chainType: "evm" })),
  ];

  const storedChainId = Number(
    localStorage.getItem("selectedChainId") || 12000000
  );

  const [selectedSourceChain, setSelectedSourceChain] = useState(null);

  const tokenOptions = Object.entries(tokens).map(([symbol, data]) => ({
    id: uuid(),
    symbol,
    ...data,
  }));

  const [switchToken, setSwitchToken] = useState(tokenOptions[0]);
  const [successModalIsOpen, setSuccessModalIsOpen] = useState(false);

  const walletIsConnected =
    (selectedSourceChain?.chainType === "evm" && address) ||
    (selectedSourceChain?.chainType === "soroban" && userKey);

  const needConnectWallet = !selectedSourceChain;

  async function fetchBalanceAll(type, chain, account, token, decimals) {
    try {
      if (!account) {
        return "0";
      }
      if (type === "soroban") {
        const body = {
          pubKey: "GARM4SLIWOXUPZMG4YK2IR7YD4OBI4XLFDMXZHPH6IZUSLOJJHINE27Q",
          fee: BASE_FEE,
          network: chainNetwork[chain],
          contractId: token,
          operation: "balance",
          args: [{ type: "Address", value: account }],
        };

        const response = await axios.post(
          `${STELLAR_SDK_SERVER_URL}/simulateTransaction`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const amount = Soroban.formatTokenAmount(
          response?.data?.data,
          decimals[token]
        );

        return amount;
      } else if (type === "evm") {
        const result = await readContract(config, {
          abi: erc20Abi,
          address: token,
          functionName: "balanceOf",
          args: [account],
          account: account,
        });

        return formatUnits(result, decimals[token]);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    async function fetchDepositBalances() {
      for (let option of tokenOptions) {
        for (let chain of chainsArr) {
          const account =
            chainType[chain] === "evm"
              ? address
              : chainType[chain] === "soroban"
              ? userKey
              : null;
          const bal = await fetchBalanceAll(
            chainType[chain],
            chain,
            account,
            protocolTokens[option[chain]],
            protocolDecimals
          );

          setDepositBalances((cur) => ({
            ...cur,
            [option[chain]]: bal || "0",
          }));
        }
      }
    }

    fetchDepositBalances();
  }, [address, userKey, isOpenDeposit]);

  useEffect(() => {
    async function fetchWalletBalances() {
      for (let option of tokenOptions) {
        for (let chain of chainsArr) {
          const account =
            chainType[chain] === "evm"
              ? address
              : chainType[chain] === "soroban"
              ? userKey
              : null;
          const bal = await fetchBalanceAll(
            chainType[chain],
            chain,
            account,
            option[chain],
            tokensDecimals
          );

          setWalletBalances((cur) => ({
            ...cur,
            [option[chain]]: bal || "0",
          }));
        }
      }
    }

    fetchWalletBalances();
  }, [address, userKey, isOpenDeposit]);

  useEffect(() => {
    async function fetchBridgeBalances() {
      let i = 0;
      for (let option of tokenOptions) {
        for (let chain of chainsArr) {
          const bal = await fetchBalanceAll(
            chainType[chain],
            chain,
            pools[chain],
            option[chain],
            tokensDecimals
          );

          setBridgeBalances((cur) => ({
            ...cur,
            [option[chain]]: bal || "0",
          }));
        }
      }
    }

    fetchBridgeBalances();
  }, [isOpenDeposit]);

  useEffect(() => {
    setSwitchToken(tokenOptions[0]);
  }, [isOpenDeposit]);

  useEffect(() => {
    async function fetchBalance() {
      // setSwitchToken(tokenOptions[0]);
      if (selectedSourceChain?.chainType === "evm") {
        const tokenDecimal = await readContract(config, {
          abi: erc20Abi,
          address: switchToken[selectedSourceChain?.id],
          functionName: "decimals",
          chainId: selectedSourceChain?.id,
        });

        setTokenDes(tokenDecimal);

        // setTokenDes(tokenDecimal);

        // const result2 = await readContract(config, {
        //   abi: erc20Abi,
        //   address: switchToken[selectedSourceChain?.id],
        //   functionName: "allowance",
        //   args: [addr, pools[selectedSourceChain?.id]],
        //   account: addr,
        //   chainId: selectedSourceChain?.id,
        // });

        // setAllowance(formatUnits(result2, tokenDecimal));

        // const result = await readContract(config, {
        //   abi: erc20Abi,
        //   address: switchToken[selectedSourceChain?.id],
        //   functionName: "balanceOf",
        //   args: [addr],
        //   account: addr,
        // });

        // setBalance(() => formatUnits(result, tokenDecimal));
      } else if (selectedSourceChain?.chainType === "soroban") {
        setTokenDes(7);
      }
    }
    if (selectedSourceChain) {
      fetchBalance();
    }
  }, [
    address,
    // chain,
    selectedSourceChain,
    // isTransfer,
    // updateBalances,
    isOpenDeposit,
    switchToken.id,
  ]);

  useEffect(() => {
    if (storedChainId) {
      const selectedChain = allChains?.find(
        (chain) => chain?.id === Number(storedChainId)
      );

      setSelectedSourceChain(selectedChain);
    }
  }, [storedChainId]);

  async function handleConnectFreighter() {
    setFreighterConnecting(true);
    const res = await ConnectWallet(setUserKey, setNetwork);
    setFreighterConnecting(false);
  }

  async function awaitTransactionConfirmation(hashIn) {
    const confirmHash = await waitForTransactionReceipt(config, {
      hash: hashIn,
    });

    return confirmHash;
  }

  return (
    <SidebarContext.Provider
      value={{
        selectedSourceChain,
        setSelectedSourceChain,
        selectedDestinationChain,
        setSelectedDestinationChain,
        selectedChain,
        allChains,
        setSelectedChain,
        handleConnectFreighter,
        userKey,
        setUserKey,
        network,
        setNetwork,
        isOpen,
        setIsOpen,
        isXLM,
        setIsXLM,
        userPubKey,
        setUserPubKey,
        selectedNetwork,
        setSelectedNetwork,
        freighterConnecting,
        setFreighterConnecting,
        claimableCashback,
        setClaimableCashback,
        updateBalances,
        setUpdateBalances,

        address,
        // messageId,
        // setMessageId,
        tokenOptions,
        switchToken,
        setSwitchToken,
        tokenDes,
        setTokenDes,
        isOpenDeposit,
        setIsOpenDeposit,
        pools,

        tokens,
        chainIds,
        native,
        abi,
        awaitTransactionConfirmation,
        messageId,
        setMessageId,
        successModalIsOpen,
        setSuccessModalIsOpen,
        bridgeBalances,
        setBridgeBalances,
        walletBalances,
        setWalletBalances,
        depositBalances,
        isOpenSidebar,
        setIsOpenSidebar,
        walletIsConnected,
        needConnectWallet,
        storedChainId,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export { SidebarContext, SidebarContextProvider };
