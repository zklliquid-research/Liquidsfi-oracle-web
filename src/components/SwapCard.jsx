import { useState, useEffect, useContext, useCallback } from "react";
import { ethers } from "ethers";
import { InfoCircle, Repeat, Setting4, TickCircle } from "iconsax-react";
import { Soroban, Horizon, Networks, StrKey } from "@stellar/stellar-sdk";

import { v4 as uuid } from "uuid";

import { ClipLoader } from "react-spinners";

import { erc20Abi, formatUnits, parseEther, parseUnits } from "viem";
import { useAccount, useSwitchChain } from "wagmi";

import {
  writeContract,
  readContract,
  waitForTransactionReceipt,
} from "@wagmi/core";

import Button from "./Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { parseEther } from "viem";
import { useDebounce, useMediaQuery } from "usehooks-ts";

import WalletsModal from "./WalletsModal";

import {
  abi,
  pools,
  tokens,
  chainIds,
  native,
} from "../contracts/contracts-details.json";
import { config } from "../Wagmi";
import SwitchNetworkDropdown from "../components/SwitchNetworkDropdown";
import DestinationChainDropdown from "./DestinationChainDropdown";

import SwitchSourceToken from "./SwitchSourceToken";
import DestinationToken from "./DestinationToken";

import {
  BASE_FEE,
  depositToken,
  getTxBuilder,
  server,
  submitTx,
  xlmToStroop,
  STELLAR_SDK_SERVER_URL,
  anyInvokeMainnet,
  sendTransactionMainnet,
  HORIZON_URL,
  getTrustline,
  changeTrustline,
} from "../freighter-wallet/soroban";
import {
  getNetwork,
  setAllowed,
  signTransaction,
  getAddress,
  addToken,
} from "@stellar/freighter-api";
import { SidebarContext } from "../context/SidebarContext";
import axios from "axios";
import { handleUpsertTransaction } from "../services";

function SwapCard({ setUserKeyXLM, setNetworkXLM, userKeyXLM }) {
  const [recheckTrustline, setRecheckTrustline] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [allowance, setAllowance] = useState(0);
  // const [needApproval, setNeedApproval] = useState(false);

  const [hasTrust, setHasTrust] = useState(false);

  const { chain, address, isConnected } = useAccount();

  const [amount, setAmount] = useState(null);
  const [recipientAddr, setRecipientAddr] = useState("");
  const [curAllowance, setCurAllowance] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trxHash, setTrxHash] = useState("");
  const [isTransfer, setIsTransfer] = useState(false);

  const [selectedId, setSelectedId] = useState();

  const [totalDebitedAmount, setTotalDebitedAmount] = useState(null);
  const [bridgeFee, setBridgeFee] = useState(null);
  const [addrIsValid, setAddrIsValid] = useState(true);

  const STORAGE_KEY = address;
  const MAX_ITEMS = 5;

  const isMobile = useMediaQuery("(max-width: 375px)");

  const needApproval = allowance < Number(totalDebitedAmount);

  const tokenOptions = Object.entries(tokens).map(([symbol, data]) => ({
    id: uuid(),
    symbol,
    ...data,
  }));

  //   const [switchToken, setSwitchToken] = useState(tokenOptions[0]);

  const {
    selectedSourceChain,
    setSelectedSourceChain,
    selectedDestinationChain,
    setSelectedDestinationChain,
    isXLM,
    userPubKey,
    setUserPubKey,
    selectedNetwork,
    allChains,
    setSelectedNetwork,
    freighterConnecting,
    claimableCashback,
    setClaimableCashback,
    updateBalances,
    setUpdateBalances,
    userKey,
    network,
    switchToken,
    setSwitchToken,
    tokenDes,
    setTokenDes,
    setMessageId,
    setSuccessModalIsOpen,
  } = useContext(SidebarContext);

  function handleAdressIsValid(addr) {
    if (selectedDestinationChain?.chainType === "evm") {
      const isValid = ethers.isAddress(addr);

      setAddrIsValid(isValid);
    } else if (selectedDestinationChain?.chainType === "soroban") {
      const isValid =
        StrKey.isValidEd25519PublicKey(addr) || StrKey.isValidContract(addr);

      setAddrIsValid(isValid);

      if (StrKey.isValidContract(addr)) {
        setHasTrust(true);
      } else if (StrKey.isValidEd25519PublicKey(addr)) {
        async function fetchHasTrust() {
          const accountHasTrust = await getTrustline(
            addr,
            switchToken[12000000],
            "TESTNET"
          );

          setHasTrust(accountHasTrust);
        }

        fetchHasTrust();
      }
    }
  }

  useEffect(() => {
    handleAdressIsValid(recipientAddr);
  }, [selectedDestinationChain?.name]);

  //   useEffect(() => {
  //     async function fetchCashback() {
  //       const body = {
  //         pubKey: userPubKey,
  //         fee: BASE_FEE,
  //         networkPassphrase: selectedNetwork?.networkPassphrase,
  //         contractId: pools[12000000],
  //         operation: "get_claimable_cashback",
  //         args: [
  //           { type: "Address", value: userPubKey },
  //           {
  //             type: "Address",
  //             value: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
  //           },
  //         ],
  //       };

  //       const response = await axios.post(
  //         `${STELLAR_SDK_SERVER_URL}/simulateTransaction`,
  //         body,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       const receivedCashback = JSON.parse(response?.data?.data, (key, value) =>
  //         /^\d+$/.test(value) ? BigInt(value) : value
  //       );

  //       const cashback = Soroban.formatTokenAmount(
  //         receivedCashback?.claimable_amount?.toString(),
  //         7
  //       );

  //       setClaimableCashback(cashback);

  //       // setBalance(() => amount);
  //     }
  //     if (userPubKey && selectedSourceChain?.id === 1200) {
  //       fetchCashback();
  //     }
  //   }, [userPubKey, selectedSourceChain, updateBalances]);

  useEffect(() => {
    async function fetchBalance() {
      const body = {
        pubKey: userKey,
        fee: BASE_FEE,
        network: network?.network,
        contractId: switchToken[selectedSourceChain?.id],
        operation: "balance",
        args: [{ type: "Address", value: userKey }],
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

      const body2 = {
        pubKey: userKey,
        fee: BASE_FEE,
        network: network?.network,
        contractId: switchToken[selectedSourceChain?.id],
        operation: "decimals",
        args: [],
      };

      const responseDes = await axios.post(
        `${STELLAR_SDK_SERVER_URL}/simulateTransaction`,
        body2,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const amount = Soroban.formatTokenAmount(
        response?.data?.data,
        responseDes?.data?.data
      );

      setBalance(() => amount);
    }
    if (userKey && selectedSourceChain?.chainType === "soroban") {
      fetchBalance();
    }
  }, [
    userKey,
    selectedNetwork,
    selectedSourceChain,
    updateBalances,
    switchToken?.id,
  ]);

  useEffect(() => {
    async function fetchBridgeFeeXLM() {
      const body = {
        pubKey: userKey,
        fee: BASE_FEE,
        network: network?.network,
        contractId: pools[12000000],
        operation: "get_bridge_fee",
        args: [],
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

      const fee = Soroban.formatTokenAmount(response?.data?.data, 7);

      const receivedFee = JSON.parse(fee, (key, value) =>
        /^\d+$/.test(value) ? BigInt(value) : value
      );

      const actualFee = formatUnits(receivedFee?.rate, 7);

      setBridgeFee(actualFee);

      // setBalance(() => amount);
    }
    if (userKey && selectedSourceChain?.id === 12000000 && amount) {
      fetchBridgeFeeXLM();
    }

    async function fetchTotalDebitAmountXLM() {
      const body = {
        pubKey: userPubKey,
        fee: BASE_FEE,
        networkPassphrase: selectedNetwork?.networkPassphrase,
        contractId: pools[12000000],
        operation: "get_total_debit_at_transfer",
        args: [
          { type: "Address", value: switchToken[12000000] },
          { type: "i128", value: amount },
        ],
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

      const debitAmount = Soroban.formatTokenAmount(response?.data?.data, 7);
      if (!amount) {
        setTotalDebitedAmount(null);
      } else {
        setTotalDebitedAmount(debitAmount);
      }
    }

    if (userPubKey && selectedSourceChain?.id === 1200 && amount) {
      fetchTotalDebitAmountXLM();
    }
  }, [
    amount,
    userKey,
    selectedNetwork,
    selectedSourceChain,
    selectedDestinationChain,
    switchToken?.id,
  ]);
  useEffect(() => {
    async function fetchBridgeFeeEVM() {
      const bridgeFee = await readContract(config, {
        abi: abi,
        address: pools[selectedSourceChain?.id],
        functionName: "bridgeFee",
      });

      setBridgeFee(formatUnits(bridgeFee, 18));
      // console.log("bridge fee", formatUnits(bridgeFee, 18));
    }
    if (
      address &&
      selectedSourceChain?.id !== 1200 &&
      amount &&
      selectedDestinationChain?.id
    ) {
      fetchBridgeFeeEVM();
    }

    async function fetchTotalAmountEVM() {
      const fees = await readContract(config, {
        abi: abi,
        address: pools[selectedSourceChain?.id],
        functionName: "liquidityFeeRate",
        args: [switchToken[selectedSourceChain?.id]],
      });

      const tokenDecimal = await readContract(config, {
        abi: erc20Abi,
        address: switchToken[selectedSourceChain?.id],
        functionName: "decimals",
      });

      setTotalDebitedAmount(
        Number(formatUnits(fees[0], tokenDecimal)) +
          Number(amount) +
          (Number(amount) * Number(fees[1])) / 100000
      );
    }
    if (address && selectedSourceChain?.id !== 1200 && amount) {
      fetchTotalAmountEVM();
    }
  }, [
    amount,
    address,
    selectedNetwork,
    selectedSourceChain,
    selectedDestinationChain,
    switchToken?.id,
  ]);

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text.length > 0) {
        setRecipientAddr(() => text);
      }
    } catch (err) {
      console.error("Failed to reac contents");
    }
  }

  const formatBalance = (number, decimal) => {
    if (number == undefined) {
      return;
    }

    const decimals = number.toString().split(".")[1];
    if (decimals && decimals.length >= decimal) {
      return Number(number).toFixed(decimal);
    } else {
      return number.toString();
    }
  };

  async function handleChangeTrustline() {
    setIsProcessing(true);
    try {
      await addToken({
        contractId: switchToken[12000000],
        networkPassphrase: Networks[switchToken.network],
      });
    } catch (e) {
      console.log(e);
    } finally {
      setRecheckTrustline(uuid());
      setIsProcessing(false);
    }
  }

  async function handleTransferFromXLM() {
    setIsProcessing(true);
    try {
      const args = [
        { type: "Address", value: userKey },
        { type: "u64", value: chainIds[selectedDestinationChain?.id] },
        { type: "string", value: recipientAddr },
        { type: "Address", value: switchToken[selectedSourceChain?.id] },
        { type: "i128", value: amount },
        { type: "bool", value: false },
      ];

      // console.log(args);

      const resSign = await anyInvokeMainnet(
        userKey,
        BASE_FEE,
        network?.network,
        pools[selectedSourceChain?.id],
        "bridge_to_evm",
        args,
        ""
      );

      const res = await sendTransactionMainnet(
        resSign?.signedTxXdr,
        network?.network
      );

      if (res) {
        const msgData = {
          tx_id:
            "0x" + res?.resultMetaJson?.v4?.soroban_meta?.return_value?.bytes,
          origin_tx_hash: res?.txHash,
          origin_id: chainIds[selectedSourceChain?.id],
          sender: userKey,
          origin_contract: pools[selectedSourceChain?.id],
          destination_id: chainIds[selectedDestinationChain?.id],
          destination_contract: pools[selectedDestinationChain?.id],
          tx_data: "000000000000",
          token_contract: switchToken[selectedSourceChain?.id],
          token_amount: amount,
        };

        await handleUpsertTransaction(msgData);

        const trxData = {
          amount: amount,
          tx_data: "000000000000",
          from: selectedSourceChain?.id,
          to: selectedDestinationChain?.id,
          name: switchToken.symbol,
          id: res?.txHash,
          time: new Date().toLocaleDateString(),
        };

        saveTransferData(trxData);

        setMessageId(res?.txHash);
        setSuccessModalIsOpen(true);
      }
      // console.log("transfer res", res);
    } catch (e) {
      console.log(e);
    } finally {
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    async function fetchBalance(addr) {
      const tokenDecimal = await readContract(config, {
        abi: erc20Abi,
        address: switchToken[selectedSourceChain?.id],
        functionName: "decimals",
        chainId: selectedSourceChain?.id,
      });

      setTokenDes(tokenDecimal);

      const result2 = await readContract(config, {
        abi: erc20Abi,
        address: switchToken[selectedSourceChain?.id],
        functionName: "allowance",
        args: [addr, pools[selectedSourceChain?.id]],
        account: addr,
        chainId: selectedSourceChain?.id,
      });

      setAllowance(formatUnits(result2, tokenDecimal));

      const result = await readContract(config, {
        abi: erc20Abi,
        address: switchToken[selectedSourceChain?.id],
        functionName: "balanceOf",
        args: [addr],
        account: addr,
      });

      setBalance(() => formatUnits(result, tokenDecimal));
    }
    if (
      selectedSourceChain &&
      address &&
      selectedSourceChain?.chainType === "evm"
    ) {
      fetchBalance(address);
    }
  }, [
    address,
    chain,
    selectedSourceChain,
    isTransfer,
    updateBalances,
    switchToken.id,
  ]);

  async function handleApprove() {
    setIsProcessing(() => true);
    try {
      const ethQuantity = parseUnits(totalDebitedAmount?.toString(), tokenDes);

      const tx = await writeContract(config, {
        abi: erc20Abi,
        address: switchToken[selectedSourceChain?.id],
        functionName: "approve",
        args: [pools[selectedSourceChain?.id], ethQuantity],
      });
      const res = await awaitTransactionConfirmation(tx);
      if (res) {
        setUpdateBalances(uuid());
      }
      console.log("approval successful", res);
    } catch (e) {
      console.log(e);
    } finally {
      setUpdateBalances(uuid());
      setIsProcessing(false);
    }
  }

  async function handleTransferTokens() {
    try {
      if (selectedSourceChain?.chainType === "soroban") {
        await handleTransferFromXLM();
      } else if (selectedSourceChain?.chainType === "evm") {
        await handleTransferFromEVM();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setRecipientAddr("");
      setSelectedDestinationChain(null);
      setUpdateBalances(uuid());
    }
  }

  async function awaitTransactionConfirmation(hashIn) {
    const confirmHash = await waitForTransactionReceipt(config, {
      hash: hashIn,
    });

    return confirmHash;
  }

  async function handleTransferFromEVM() {
    setIsProcessing(() => true);

    try {
      const bridgeFee = await readContract(config, {
        abi: abi,
        address: pools[selectedSourceChain?.id],
        functionName: "bridgeFee",
      });

      const ethQuantity = parseUnits(amount, tokenDes);

      const tx = await writeContract(config, {
        abi: abi,
        address: pools[selectedSourceChain?.id],
        functionName: "outgoingTransfer",
        args: [
          chainIds[selectedDestinationChain?.id],
          recipientAddr,
          switchToken[selectedSourceChain?.id],
          ethQuantity,
          false,
        ],
        value: bridgeFee,
      });

      //   const res = await tx.wait();

      const res = await awaitTransactionConfirmation(tx);
      if (res) {
        setTrxHash(() => res);

        const msg_id = res?.logs[1].topics[1];
        const origin_hash = res?.transactionHash;

        const msgData = {
          tx_id: msg_id,
          origin_tx_hash: origin_hash,
          origin_id: chainIds[selectedSourceChain?.id],
          sender: address,
          origin_contract: pools[selectedSourceChain?.id],
          destination_id: chainIds[selectedDestinationChain?.id],
          destination_contract: pools[selectedDestinationChain?.id],
          tx_data: "000000000000",
          token_contract: switchToken[selectedSourceChain?.id],
          token_amount: amount,
        };

        await handleUpsertTransaction(msgData);

        const trxData = {
          amount: amount,
          from: selectedSourceChain?.id,
          to: selectedDestinationChain?.id,
          name: switchToken?.symbol,
          id: res?.transactionHash,
          time: new Date().toLocaleDateString(),
        };

        saveTransferData(trxData);

        setMessageId(res?.transactionHash);
        setSuccessModalIsOpen(true);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsProcessing(false);
    }
  }

  function saveTransferData(newData) {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    if (data.length >= MAX_ITEMS) {
      data.shift();
    }

    data.push(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function handleMax() {
    setAmount(() => balance);
  }

  return (
    <>
      <div className="p-4  bg-[#04131F]  md:p-6 rounded-xl ">
        <div className="grid grid-cols-3">
          <div aria-hidden="true">&nbsp;</div>
          <h3 className="text-xl font-bold text-center text-2">Swap/Bridge</h3>
          <div className="text-right">
            <button onClick={() => setIsSettingsModalOpen(true)}>
              <Setting4 />
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between mt-4 ">
          <div className="flex flex-col w-full items-start space-y-3 ">
            <p className="text-sm font-medium text-dark-100">From</p>

            {(isConnected || userKey) && (
              <div className="flex items-end justify-between  w-full ">
                <SwitchNetworkDropdown
                  isMobile={isMobile}
                  allChains={allChains}
                />

                <SwitchSourceToken
                  switchToken={switchToken}
                  setSwitchToken={setSwitchToken}
                  tokenOptions={tokenOptions}
                />
              </div>
            )}
            <div className="flex justify-between items-center w-full ">
              {" "}
              <input
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                className="w-2/3 text-xl font-bold  text-white bg-transparent border-0 outline-none md:text-3xl placeholder:text-dark-200"
                placeholder="0.00"
                // value={!!amount && formatBalance(amount, 8)}
              />
              {totalDebitedAmount && (
                <div className="text-green-500 flex gap-2 rounded-lg px-2">
                  <span>
                    {Number(totalDebitedAmount)?.toFixed(4)}{" "}
                    {switchToken?.symbol}
                  </span>
                  <InfoCircle className="w-5 h-auto text-gray-400" />
                </div>
              )}
              {/* {true && (
                <div className=" text-green-500 flex gap-2 rounded-lg px-2">
                  5.05 USDC
                  <InfoCircle className="w-5 h-auto text-gray-400" />
                </div>
              )} */}
            </div>

            <div className="flex justify-between items-center w-full">
              {" "}
              <button
                className="text-sm font-semibold text-white uppercase"
                onClick={handleMax}
              >
                Max
              </button>
              <div className="flex-shrink-0 space-y-2 text-right ">
                {
                  <p className="text-xs font-medium md:text-sm text-gray-200">
                    Balance: {Number(balance)?.toFixed(2)} {switchToken?.symbol}
                  </p>
                }
              </div>
            </div>
          </div>
        </div>

        <div className="my-3   relative text-center after:content-[''] after:absolute after:left-0 after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-px after:bg-dark-300 af">
          <button
            className="relative z-10 p-1 rounded-lg bg-dark-300 hover:bg-dark-300/50"
            // onClick={switchTokensHandler}
          >
            <Repeat className="rotate-90" />
          </button>
        </div>

        <div className="flex   items-end justify-between mt-4">
          <div className="flex w-full  flex-col items-start space-y-3">
            <p className="text-sm font-medium text-dark-100">To</p>
            {(isConnected || userKey) && (
              <div className="flex w-full  items-end justify-between ">
                <DestinationChainDropdown
                  allChains={allChains}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  isMobile={isMobile}
                />

                <DestinationToken switchToken={switchToken} />
              </div>
            )}
            <div
              disabled={true}
              type="number"
              className="w-full text-xl font-bold text-white bg-transparent border-0 outline-none md:text-3xl placeholder:text-dark-200"
              placeholder="0.00"
              // disabled={true}
              // value={amount}
              // onChange={(e) => getEstimatedSwapData(e.target.value)}
            >
              {amount ? amount : "0.00"}
            </div>
          </div>
        </div>
        {selectedDestinationChain && amount > 0 && (
          <div className=" w-full mt-5">
            <div className="relative   ">
              <div className="absolute -inset-x-2 -inset-y-5"></div>

              <div className="relative w-full">
                <input
                  onChange={(e) => {
                    setRecipientAddr(() => e.target.value);
                    handleAdressIsValid(e.target.value);
                  }}
                  type="text"
                  name=""
                  id=""
                  placeholder="Paste recipient here"
                  className={`block w-full text-black px-2 h-[45px] text-[12.5px] font-normal  placeholder-gray-800 bg-gray-300 border  rounded-sm  ${
                    !hasTrust &&
                    selectedDestinationChain?.id === 12000000 &&
                    "text-red-600"
                  }`}
                  value={recipientAddr}
                />

                {selectedDestinationChain?.id === 12000000 &&
                  (hasTrust ? (
                    <div className="mt-0 absolute inset-y-0 right-0 flex items-center pr-2 ">
                      <TickCircle
                        variant="Bold"
                        className="text-green-700 h-6 w-6"
                      />
                    </div>
                  ) : (
                    <div
                      className="mt-0 absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer "
                      onClick={handlePaste}
                    >
                      <InfoCircle
                        variant="Bold"
                        className="text-red-600 h-6 w-6"
                      />
                    </div>
                  ))}
              </div>

              <div className="flex relative mt-4 font-semibold justify-between items-center w-full ">
                {" "}
                {true && (
                  <div className=" text-gray-300 flex gap-2 rounded-lg px-2">
                    <div className=""> Bridge Fee:</div>{" "}
                    <InfoCircle className="w-5 h-auto text-gray-300" />
                  </div>
                )}
                {bridgeFee ? (
                  <div className="text-green-500">
                    {Number(bridgeFee)?.toFixed(4) || 0}{" "}
                    {native[selectedSourceChain?.id]}
                  </div>
                ) : (
                  <ClipLoader
                    size={20}
                    color={"#9ca3af "}
                    loading={true}
                    className="relative top-[3px] text-gray-400 "
                  />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          {!addrIsValid ? (
            <button
              // className={`${
              //   disabled
              //     ? "bg-gray-500 cursor-not-allowed"
              //     : "bg-gradient-to-r from-[#DC40A4] to-[#6749D5]"
              // } w-full rounded-lg py-3 ${className}`}
              className="bg-gray-500 cursor-not-allowed w-full rounded-lg py-3 font-semibold "
            >
              Not a Valid {selectedDestinationChain?.name} Address
            </button>
          ) : !hasTrust && selectedDestinationChain?.id === 12000000 ? (
            <Button
              disabled={
                !amount || !selectedDestinationChain || !selectedSourceChain
              }
              onClick={handleChangeTrustline}
            >
              Connect and Change Trustline
            </Button>
          ) : isConnected || userKey ? (
            isProcessing ? (
              <Button>
                <>
                  <ClipLoader
                    size={20}
                    color={"#ffffff"}
                    loading={true}
                    className="relative top-[3px]"
                  />
                  <span className="ml-2">Processing...</span>
                </>
              </Button>
            ) : needApproval && selectedSourceChain?.id !== 12000000 ? (
              <Button disabled={!amount} onClick={handleApprove}>
                Approve
              </Button>
            ) : (
              <Button
                disabled={
                  !amount || !selectedDestinationChain || !selectedSourceChain
                }
                onClick={handleTransferTokens}
              >
                Transfer Now
              </Button>
            )
          ) : (
            <Button onClick={() => setIsOpen(true)}>Connect Wallet</Button>
          )}
        </div>

        {/* <div className="mt-6">
          {isConnected ? (
            isSwapAvailable ? (
              <Button>
                {isActionLoading ? (
                  <>
                    <ClipLoader
                      size={20}
                      color={"#ffffff"}
                      loading={true}
                      className="relative top-[3px]"
                    />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  "Approve"
                )}
              </Button>
            ) : (
              <Button disabled={true}>{errorMessage}</Button>
            )
          ) : (
            <Button onClick={() => setIsOpen(true)}>Connect Wallet</Button>
          )}
          <button onClick={handleTransfer}>Buy now</button>
        </div> */}
      </div>

      {/* <button onClick={handleTransferPayout}> transfer Test</button> */}

      <WalletsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        setUserKeyXLM={setUserKeyXLM}
        setNetworkXLM={setNetworkXLM}
        userKeyXLM={userKeyXLM}
      />
    </>
  );
}

export default SwapCard;
