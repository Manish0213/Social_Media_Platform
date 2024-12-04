import React, {useEffect,useRef} from 'react'

const Messages = ({messages}) => {
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${msg.sender_id._id === JSON.parse(localStorage.getItem('loggedInUser'))._id ? "sent" : "received"}`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
  )
}

export default Messages
