import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import useIsMetaMaskInstalled from "../useIsMetaMaskInstalled.js";

const Sidebar = ({ setAccount, account, broadcastContract, nftContract}) => {
  const isMetaMaskInstalled = useIsMetaMaskInstalled();
  const [tokensHash, setTokensHash] = useState({});
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

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


useEffect(() => {
    if (!broadcastContract || !account) return;
    const getMyTokens = async () => {
      let _tokenHash = {};
      let promises = [];
      // get tokenIds from smart contract
      promises.push(broadcastContract.getRTokensOfOwner(account));
      promises.push(broadcastContract.getSTokensOfOwner(account));

      // resolve all promises
      let allTokens = await Promise.all(promises);

      // combine tokenId arrays and convert each element to number
      allTokens = allTokens[0].concat(allTokens[1]).map((x) => x.toNumber());

      // loop through allTokens and convert Id to Keyword calling smart contract
      allTokens.forEach(async (tokenId) => {
        const keyword = await broadcastContract.convertIdtoKeyword(tokenId);
        _tokenHash[tokenId] = keyword;
      });

      await timeout(1000)

      setTokensHash(_tokenHash);
    };
    getMyTokens().catch(console.error);
  }, [account, broadcastContract]);

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
