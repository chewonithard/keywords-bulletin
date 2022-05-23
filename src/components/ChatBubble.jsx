import React from "react";



const ChatBubble = ({ ownMessage, address, message }) => {
  const bubblePosition = ownMessage ? "right" : "left";
  return (
    <div className="chat__row">
      {!ownMessage && <small>{address}</small>}
      <div className={["chat__bubble", bubblePosition].join(" ")}>
        <div className={["chat__message", bubblePosition].join(" ")}>
          {ownMessage}
          {message}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
