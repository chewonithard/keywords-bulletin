import React, { useState, useEffect } from "react";
import "./App.css";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import BroadcastArtifact from "./contract/KeywordsBroadcast.json";
import NFTArtifact from "./contract/KeywordsNFT.json";
import useContract from "./useContract";

function App() {
  const [account, setAccount] = useState();
  const [tokensHash, setTokensHash] = useState({});

  const broadcastContractAddress = "0xeaEB3E97cCEf999cD254455e7a8e02b4808D7F54";
  const broadcastContract = useContract(
    broadcastContractAddress,
    BroadcastArtifact.abi,
    account
  );

  const nftContractAddress = "0x9Bb20e9E67FfA3dd10eaC6f9f389063b5bbed394";
  const nftContract = useContract(
    nftContractAddress,
    NFTArtifact.abi,
    account
  );

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

      await timeout(1000);

      setTokensHash(_tokenHash);
    };
    getMyTokens().catch(console.error);
  }, [account]);

  return (
    <div className="App">
      <Sidebar
        setAccount={setAccount}
        account={account}
        broadcastContract={broadcastContract}
        nftContract={nftContract}
        tokensHash={tokensHash}
      />
      <Chat account={account} broadcastContract={broadcastContract} tokensHash={tokensHash} />
    </div>
  );
}

export default App;
