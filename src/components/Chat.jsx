import React, { useEffect, useState } from "react";
import ChatBubble from "./ChatBubble";
import { ethers } from "ethers";

const Chat = ({ account, broadcastContract, tokensHash}) => {
  const [inputContent, setInputContent] = useState("");
  const [inputId, setInputId] = useState("");
  const [txnStatus, setTxnStatus] = useState(null);
  const [messages, setMessages] = useState([]);

  const getMessages = async () => {
    if (!broadcastContract || !account) return;
    const messages_ = await broadcastContract.getMessages();

    setMessages(() => {
      return messages_.map((w) => ({
        address: w.sender,
        receiver: w.receiverTokenId.toNumber(),
        date: w.timestamp._hex,
        content: w.content,
      }));
    });

    console.log('getMessages function ran')
  };

  const setupMessageListener = async () => {
    if (!broadcastContract) return;

    broadcastContract.on(
      "NewMessage",
      (address, receiver, timestamp, content) => {
        // setMessages((prev) => {
        //   const _receiver = receiver.toNumber()
        //   const newMessage = {
        //     address,
        //     _receiver,
        //     date: timestamp._hex,
        //     content,
        //   };
        //   return [...prev, newMessage]
        // });
        console.log('new message event fired')
      }
    );
  };

  const sendMessage = async () => {
    if (!broadcastContract) return;
    try {
      setTxnStatus("WAIT");
      const messageTxn = await broadcastContract.sendMessage(inputContent, inputId);
      setTxnStatus("SENDING");
      await messageTxn.wait();
    } catch (e) {
      console.warn("Transaction failed with error", e);
      alert("Error must hold reciprocal Sender NFT") // hardcoded error, need to change in future
    } finally {
      setInputContent("");
      setInputId("");
      setTxnStatus(null);
      getMessages(); // interim solution till i solve the setupEventListener issue;
    }
  };

  useEffect(() => {
    // if (!broadcastContract || messages.length > 0) return;
    getMessages();
    setupMessageListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [broadcastContract]);

  return (
    <div className="chat">
      <div className="chat__messages">
        {!broadcastContract && (
          <p className="state-message">
            Connect to the chat in order to see the messages!
          </p>
        )}
        {account && messages && messages.length === 0 && (
          <p className="state-message">There are no messages to display</p>
        )}
        {messages &&
          messages.length > 0 &&
          messages.map((m, i) => {
            if (m.receiver in tokensHash)
            return (
            <ChatBubble
              key={i}
              address={m.address}
              receiver={m.receiver}
              message={m.content}
              tokensHash={tokensHash}
            />
          )})}
      </div>
      <div className="chat__actions-wrapper">
        {!account && (
          <p className="state-message">Connect With Metamask to see messages!</p>
        )}
        <div className="chat__input">
          <textarea className="inputId"
            disabled={!!txnStatus || !account}
            placeholder="Receiver token id"
            value={inputId}
            onChange={(e) => {
              setInputId(e.target.value);
            }}
          ></textarea>
          <textarea className="inputContent"
            disabled={!!txnStatus || !account}
            placeholder="Message"
            value={inputContent}
            onChange={(e) => {
              setInputContent(e.target.value);
            }}
          ></textarea>
          <button onClick={sendMessage} disabled={!!txnStatus || !account}>
            {txnStatus || "send message"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
