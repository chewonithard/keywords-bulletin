import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import useIsMetaMaskInstalled from "../useIsMetaMaskInstalled.js";

const Sidebar = ({ setAccount, account, broadcastContract, nftContract, tokensHash}) => {
  const isMetaMaskInstalled = useIsMetaMaskInstalled();

  const [inputRContent, setInputRContent] = useState("");
  const [inputSContent, setInputSContent] = useState("");
  const [txnStatus, setTxnStatus] = useState(null);

  const handleOnConnect = () => {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        setAccount(ethers.utils.getAddress(accounts[0]));
      })
      .catch((err) => console.log(err));
  };

  const sendReceiverTxn = async () => {
    if (!broadcastContract) return;
    try {
      setTxnStatus("WAIT");
      const messageTxn = await nftContract.mintReceiverNft(inputRContent);
      setTxnStatus("SENDING");
      await messageTxn.wait();
    } catch (e) {
      console.warn("Transaction failed with error", e);
    } finally {
      setInputRContent("");
      setTxnStatus(null);
    }
  };

    const sendSenderTxn = async () => {
    if (!broadcastContract) return;
    try {
      setTxnStatus("WAIT");
      const messageTxn = await nftContract.mintSenderNft(inputSContent);
      setTxnStatus("SENDING");
      await messageTxn.wait();
    } catch (e) {
      console.warn("Transaction failed with error", e);
    } finally {
      setInputSContent("");
      setTxnStatus(null);
    }
  };






  return (
    <div className="sidebar">
      {account && (
        <>
          <b>Connected as:</b>
          <br />
          <small>{account}</small>
          <br />
          <br />
          <b>My Receiver Tokens:</b>
          <br />
          {console.log("rendering again")}
          {Object.entries(tokensHash).map(([k, v], i)=>{
            if (k < 20000) {
             return <small key={i}>{v}[{k}], </small>
            }
          })
          }

         <br />
          <br />
          <textarea className="inputMint"
            disabled={!!txnStatus || !account}
            placeholder="Enter keyword to mint"
            value={inputRContent}
            onChange={(e) => {
              setInputRContent(e.target.value);
            }}
          ></textarea>
          <br />
          <button onClick={sendReceiverTxn} disabled={!!txnStatus || !account}>
            {txnStatus || "Mint Receiver Token"}
          </button>
          <br />
          <br />
          <b>My Sender Tokens:</b>
          <br />

          {Object.entries(tokensHash).map(([k, v], i)=>{
            if (k > 20000) {
             return <small key={i}>{v}[{k}], </small>
            }
          })
          }
          <br />
          <br />
          <textarea className="inputMint"
            disabled={!!txnStatus || !account}
            placeholder="Enter keyword to mint"
            value={inputSContent}
            onChange={(e) => {
              setInputSContent(e.target.value);
            }}
          ></textarea>
          <br />
          <button onClick={sendSenderTxn} disabled={!!txnStatus || !account}>
            {txnStatus || "Mint Sender Token"}
          </button>
         </>
      )}
      {!account && (
        <button onClick={handleOnConnect} disabled={!isMetaMaskInstalled}>
          Connect With MetaMask
        </button>
      )}
      {!isMetaMaskInstalled && <p>Please install MetaMask</p>}

    </div>

  );
};

export default Sidebar;
