import React from "react";



const ChatBubble = ({ address, receiver, message }) => {
  const bubblePosition = "left";
  return (
    <div className="chat__row">
      {<small>From ...{address.slice(-5)}</small>}
      <div className={["chat__bubble", bubblePosition].join(" ")}>
        <div className={["chat__message", bubblePosition].join(" ")}>
          <small>To: {receiver}</small>
          <br />
          <small>Message: {message}</small>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
