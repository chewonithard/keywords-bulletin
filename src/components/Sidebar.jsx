import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import useIsMetaMaskInstalled from "../useIsMetaMaskInstalled.js";

const Sidebar = ({ setAccount, account, broadcastContract, nftContract}) => {
  const isMetaMaskInstalled = useIsMetaMaskInstalled();
  const [rTokensHash, setRTokensHash] = useState({});
  const [sTokensHash, setSTokensHash] = useState({});
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

  async function getMyRTokens() {
    let tokenHash = {}
    const myRTokensArray = await broadcastContract.getRTokensOfOwner(account);
    const myRTokensArray_ = myRTokensArray.map((x) => x.toNumber())

    myRTokensArray_.forEach(async (tokenId) => {
      const keyword = await broadcastContract.convertIdtoKeyword(tokenId);

      tokenHash[tokenId] = keyword
    });
    return setRTokensHash(tokenHash);
  }
  async function getMySTokens() {
    let tokenHash = {}
    const mySTokensArray = await broadcastContract.getSTokensOfOwner(account);
    const mySTokensArray_ = mySTokensArray.map((x) => x.toNumber())

    mySTokensArray_.forEach(async (tokenId) => {
      const keyword = await broadcastContract.convertIdtoKeyword(tokenId);

      tokenHash[tokenId] = keyword
    });
    return setSTokensHash(tokenHash);
  }

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
      getMyRTokens();
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
      getMySTokens();
      getMyRTokens();
    }
  };

  useEffect(() => {
      if (!broadcastContract || !account) return;
      getMyRTokens();
      getMySTokens();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [broadcastContract]);

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

          {Object.entries(rTokensHash).map(([k, v], i)=>(
            <small key={i}>{v}[{k}], </small>
          ))}

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
          {Object.entries(sTokensHash).map(([k, v], i)=>(
            <small key={i}>{v}[{k}], </small>
          ))}
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
