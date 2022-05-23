import React from "react";
import { ethers } from "ethers";
import useIsMetaMaskInstalled from "../useIsMetaMaskInstalled.js";


const Sidebar = ({ setAccount, account}) => {
  const isMetaMaskInstalled = useIsMetaMaskInstalled();

  const handleOnConnect = () => {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        setAccount(ethers.utils.getAddress(accounts[0]));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="sidebar">
      {account && (
        <>
          <b>Connected as:</b>
          <br />
          <small>{account}</small>
        </>
      )}
      {!account && (
        <button onClick={handleOnConnect} disabled={!isMetaMaskInstalled}>
          Connect With MetaMask
        </button>
      )}
      {!isMetaMaskInstalled && <p>Please install MetaMask</p>}
      <div>
        Hello
      </div>
    </div>

  );
};

export default Sidebar;
