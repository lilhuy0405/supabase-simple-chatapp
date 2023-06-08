const ChatMessage = ({ message, user }: any) => {
  const { text, user_id: uid } = message;
  const messageClass = uid === user.id ? "sent" : "received";
  return (
    <div>
      <div className={`message ${messageClass}`}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* <span style={{ color: "#fff" }}>{message.sender_name}: </span> */}
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
