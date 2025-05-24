import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';

const Chat = ({ roomId, username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('join_room', roomId);

    socket.on('chat_message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat_message');
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        room: roomId,
        message: message,
        sender: username,
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit('chat_message', messageData);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#111b21]">
      {/* Chat Header */}
      <div className="bg-[#202c33] px-4 py-3 border-b border-[#005c4b]">
        <h2 className="text-white font-medium">Chat</h2>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === username ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.sender === username
                  ? 'bg-[#005c4b] text-white'
                  : 'bg-[#202c33] text-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-300">{msg.sender}</span>
                <span className="text-xs text-gray-400">{msg.timestamp}</span>
              </div>
              <p className="break-words text-[#e9edef]">{msg.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 bg-[#202c33] border-t border-[#005c4b]">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#2a3942] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005c4b] placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-[#005c4b] text-white px-4 py-2 rounded-lg hover:bg-[#006d5b] transition-colors duration-200"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 