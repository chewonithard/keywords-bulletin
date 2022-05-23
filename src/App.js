import React, { useState } from "react";
import "./App.css";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import BroadcastArtifact from "./contract/KeywordsBroadcast.json";
import NFTArtifact from "./contract/KeywordsNFT.json";
import useContract from "./useContract";

function App() {
  const [account, setAccount] = useState();

  const broadcastContractAddress = "0xeaEB3E97cCEf999cD254455e7a8e02b4808D7F54";
  const broadcastContract = useContract(
    broadcastContractAddress,
    BroadcastArtifact.abi,
    account
  );

  const nftContractAddress = "0xc73aaBa487EEB4b26BD2BeeEBd54d2e42617E9a3";
  const nftContract = useContract(
    nftContractAddress,
    NFTArtifact.abi,
    account
  );

  return (
    <div className="App">
      <Sidebar
        setAccount={setAccount}
        account={account}
        broadcastContract={broadcastContract}
        nftContract={nftContract}
      />
      <Chat account={account} broadcastContract={broadcastContract} />
    </div>
  );
}

export default App;
