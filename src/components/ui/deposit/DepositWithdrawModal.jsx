import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import Modal from "../../../common/Modal";
import Input from "../../../common/Input";
import Button from "../../../common/Button";
import SelectAssetDropdown from "./SelectAssetDropdown";

import BUSDIcon from "@/assets/svg/BUSD.svg";
import USDTIcon from "@/assets/svg/usdt.svg";
import USDCIcon from "@/assets/svg/USDC.svg";
import { SidebarContext } from "../../../context/SidebarContext";
import { useAccount } from "wagmi";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "../../../Wagmi";
import {
  BASE_FEE,
  anyInvokeMainnet,
  sendTransactionMainnet,
} from "../../../freighter-wallet/soroban";

const validationSchema = Yup.object().shape({
  asset: Yup.string().required("Please select an asset"),
  depositQuantity: Yup.number()
    .required("Please enter a deposit quantity")
    .typeError("Deposit quantity must be a number"),
});

const DepositWithdrawModal = ({ isOpenDeposit, onClose, action }) => {
  const {
    tokenOptions,
    selectedSourceChain,
    address,
    userKey,
    switchToken,
    setSwitchToken,
    tokenDes,
    setTokenDes,
    pools,
    oracleContracts,
    tokens,
    chainIds,
    native,
    abi,
    setMessageId,
    awaitTransactionConfirmation,
    setSuccessModalIsOpen,
    network,
    bridgeBalances,
    setBridgeBalances,
    walletBalances,
    setWalletBalances,
    depositBalances,
  } = useContext(SidebarContext);

  const [processMessage, setProcessMessage] = useState("");

  const initialValues = {
    asset: tokenOptions[0].symbol,
    depositQuantity: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (selectedSourceChain?.chainType === "evm") {
        try {
          const ethQuantity = parseUnits(values?.depositQuantity, tokenDes);

          const onchainFunction =
            action === "deposit"
              ? "addLiquidity"
              : action === "withdraw"
              ? "removeLiquidity"
              : null;

          let allowance = 0;
          let protocolToken = "";

          if (action === "deposit") {
            setProcessMessage("Reading allowance...");
            const allow = await readContract(config, {
              abi: erc20Abi,
              address: switchToken?.[selectedSourceChain?.id],
              functionName: "allowance",
              args: [address, pools[selectedSourceChain?.id]],
              account: address,
              chainId: selectedSourceChain?.id,
            });
            allowance = formatUnits(allow, tokenDes);
          } else if (action === "withdraw") {
            setProcessMessage("reading protocol token...");
            protocolToken = await readContract(config, {
              abi: abi,
              address: pools[selectedSourceChain?.id],
              functionName: "protocolToken",
              args: [switchToken?.[selectedSourceChain?.id]],
            });

            setProcessMessage("reading allowance...");
            const allow = await readContract(config, {
              abi: erc20Abi,
              address: protocolToken,
              functionName: "allowance",
              args: [address, pools[selectedSourceChain?.id]],
              account: address,
              chainId: selectedSourceChain?.id,
            });

            allowance = formatUnits(allow, tokenDes);

            // setAllowance(formatUnits(result2, tokenDecimal));
          }

          if (allowance < values?.depositQuantity) {
            setProcessMessage("approving allowance...");
            if (action === "deposit") {
              const tx = await writeContract(config, {
                abi: erc20Abi,
                address: switchToken[selectedSourceChain?.id],
                functionName: "approve",
                args: [pools[selectedSourceChain?.id], ethQuantity],
              });
              await awaitTransactionConfirmation(tx);
              console.log("approval success", tx);
            } else if (action === "withdraw") {
              const tx = await writeContract(config, {
                abi: erc20Abi,
                address: protocolToken,
                functionName: "approve",
                args: [pools[selectedSourceChain?.id], ethQuantity],
              });

              await awaitTransactionConfirmation(tx);
              console.log("approval success", tx);
            }
          }

          if (!onchainFunction) {
            return null;
          }
          setProcessMessage("submitting transaction...");

          const tx = await writeContract(config, {
            abi: abi,
            address: pools[selectedSourceChain?.id],
            functionName: onchainFunction,
            args: [switchToken?.[selectedSourceChain?.id], ethQuantity],
          });

          const res = await awaitTransactionConfirmation(tx);
          setMessageId(res?.transactionHash);

          console.log("the res", res);
          onClose();
          setSuccessModalIsOpen(true);
        } catch (e) {
          console.log(e);
        } finally {
          setProcessMessage("");
          // setIsProcessing(false);
        }
      } else if (selectedSourceChain?.chainType === "soroban") {
        try {
          const args = [
            { type: "Address", value: userKey },
            { type: "Address", value: switchToken[selectedSourceChain?.id] },
            { type: "i128", value: values?.depositQuantity },
          ];

          // console.log(args);

          const onchainFunction =
            action === "deposit"
              ? "add_liquidity"
              : action === "withdraw"
              ? "remove_liquidity"
              : null;

          setProcessMessage("submitting transaction...");
          const resSign = await anyInvokeMainnet(
            userKey,
            BASE_FEE,
            network?.network,
            pools[selectedSourceChain?.id],
            onchainFunction,
            args,
            ""
          );

          const res = await sendTransactionMainnet(
            resSign?.signedTxXdr,
            network?.network
          );

          onClose();
          setSuccessModalIsOpen(true);

          setMessageId(res?.txHash);
        } catch (e) {
          console.log(e);
        } finally {
          setProcessMessage("");
        }
      }

      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
      setProcessMessage("");
    }
  };

  const headingOptions =
    action === "deposit"
      ? "Deposit Assets"
      : action === "withdraw"
      ? "Withdraw Assets"
      : "";

  const balDescription =
    action === "deposit"
      ? "Wallet Balance"
      : action === "withdraw"
      ? "Withdrawable Balance"
      : "";

  return (
    <Modal open={isOpenDeposit} onClose={onClose} heading={headingOptions}>
      <div className="space-y-3">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form autoComplete="off">
              <div className="mb-4">
                <SelectAssetDropdown
                  setSwitchToken={setSwitchToken}
                  tokenOptions={tokenOptions}
                  value={values.symbol}
                  onChange={(option) => {
                    setFieldValue("asset", option.symbol);
                  }}
                  options={hearAboutUs}
                  label="Asset"
                />
                <ErrorMessage
                  name="asset"
                  component="div"
                  className="text-red-500 text-[13px] font-display mt-1"
                />
              </div>

              <div className="flex items-center gap-5 mb-6 mt-2 justify-between">
                <h3 className="text-[#6D7A86] font-medium font-display leading-[20px] text-[15.5px]">
                  {balDescription}
                </h3>
                <h3 className="flex items-center gap-1.5 font-semibold font-display leading-[20px] text-[16px]">
                  <img
                    className="w-6 h-auto"
                    src={`/cryptoIcons/${values.asset}.svg`}
                    alt=""
                  />
                  {action === "deposit"
                    ? walletBalances[switchToken[selectedSourceChain?.id]]
                    : action === "withdraw"
                    ? depositBalances[switchToken[selectedSourceChain?.id]]
                    : "0"}{" "}
                  {values?.asset}
                </h3>
              </div>

              <div className="mb-6">
                <Field
                  as={Input}
                  type="text"
                  name="depositQuantity"
                  id="depositQuantity"
                  placeholder="0,00"
                  label="Deposit Quantity"
                />
                <ErrorMessage
                  name="depositQuantity"
                  component="div"
                  className="text-red-500 font-display text-[13px] mt-1"
                />
              </div>

              <div className="border-b border-dark-300 my-3"></div>

              <div className="pt-5">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  processMessage={processMessage}
                >
                  Confirm Transaction
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default DepositWithdrawModal;

const hearAboutUs = [
  { label: "BUSD", value: "BUSD", icon: <BUSDIcon className="h-5 w-auto" /> },
  { label: "USDT", value: "USDT", icon: <USDTIcon className="h-5 w-auto" /> },
  { label: "USDC", value: "USDC", icon: <USDCIcon className="h-5 w-auto" /> },
];
