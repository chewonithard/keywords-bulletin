import React from "react";



const ChatBubble = ({ address, receiver, message, tokensHash }) => {
  const bubblePosition = "left";
  return (
    <div className="chat__row">
      {<small>From ...{address.slice(-5)}</small>}
      <div className={["chat__bubble", bubblePosition].join(" ")}>
        <div className={["chat__message", bubblePosition].join(" ")}>
          <small>To: {tokensHash[receiver]}[{receiver}]</small>
          <br />
          <small>{message}</small>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
