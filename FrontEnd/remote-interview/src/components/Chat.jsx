import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';

const Chat = ({ roomId, username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('chat_message', ({ message, sender, timestamp }) => {
      setMessages(prev => [...prev, { message, sender, timestamp }]);
    });

    return () => {
      socket.off('chat_message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const timestamp = new Date().toLocaleTimeString();
      socket.emit('chat_message', {
        room: roomId,
        message: newMessage,
        sender: username,
        timestamp
      });
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full max-h-full bg-[#2d2d2d] rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="p-3 bg-[#1a1a1a] border-b border-[#3c4043]">
        <h2 className="text-white text-sm rounded-lg font-medium">Live Chat</h2>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.sender === username ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                msg.sender === username
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#3c4043] text-white'
              }`}
            >
              <div className="text-xs text-gray-300 mb-1">
                {msg.sender} • {msg.timestamp}
              </div>
              <div className="text-sm">{msg.message}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-3 bg-[#1a1a1a] border-t border-[#3c4043]">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#2d2d2d] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 