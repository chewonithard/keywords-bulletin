import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import useIsMetaMaskInstalled from "../useIsMetaMaskInstalled.js";

const Sidebar = ({ setAccount, account, broadcastContract, nftContract}) => {
  const isMetaMaskInstalled = useIsMetaMaskInstalled();
  const [myRTokens, setMyRTokens] = useState([]);
  const [mySTokens, setMySTokens] = useState([]);
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

  const getMyRTokens = async () => {
    const myRTokens_ = await broadcastContract.getRTokensOfOwner(account);

    setMyRTokens(() => {
      return myRTokens_.map((w) => (
        w.toNumber()
      ));
    });
  };

  const getMySTokens = async () => {
    const mySTokens_ = await broadcastContract.getSTokensOfOwner(account);

    setMySTokens(() => {
      return mySTokens_.map((w) => (
        w.toNumber()
      ));
    });
  };

  const sendTxn = async () => {
    if (!broadcastContract) return;
    try {
      setTxnStatus("WAIT");
      const messageTxn = await nftContract.mintSenderNft(inputRContent);
      setTxnStatus("SENDING");
      await messageTxn.wait();
    } catch (e) {
      console.warn("Transaction failed with error", e);
    } finally {
      setInputRContent("");
      setTxnStatus(null);
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
          {myRTokens.map((m, i) => (
            <small key={i}>{m} </small>
          ))}
         <br />
          <br />
          <textarea className="inputMint"
            disabled={!!txnStatus || !account}
            placeholder="Keyword to mint"
            value={inputSContent}
            onChange={(e) => {
              setInputRContent(e.target.value);
            }}
          ></textarea>
          <br />
          <button onClick={sendTxn} disabled={!!txnStatus || !account}>
            {txnStatus || "Mint Receiver NFT"}
          </button>
          <br />
          <br />
          <b>My Sender Tokens:</b>
          <br />
          {mySTokens.map((m, i) => (
            <small key={i}>{m} </small>
          ))}
          <br />
          <br />
          <textarea className="inputMint"
            disabled={!!txnStatus || !account}
            placeholder="Keyword to mint"
            value={inputSContent}
            onChange={(e) => {
              setInputSContent(e.target.value);
            }}
          ></textarea>
          <br />
          <button onClick={sendTxn} disabled={!!txnStatus || !account}>
            {txnStatus || "Mint Sender NFT"}
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
