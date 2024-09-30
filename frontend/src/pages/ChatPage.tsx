// src/pages/ChatPage.tsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

interface Message {
  user: string;
  message: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const socket = io('http://localhost:5000');

  useEffect(() => {
    socket.on('receiveMessage', (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = () => {
    if (input.trim() !== '') {
      const userMessage = { user: 'Tú', message: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      socket.emit('sendMessage', input);
      setInput('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Chat de Soporte
      </h1>
      <div className="flex-1 overflow-y-auto mb-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.user === 'Tú' ? 'text-right' : 'text-left'
            }`}
          >
            <p
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.user === 'Tú'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              {msg.message}
            </p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Escribe tu mensaje"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => (e.key === 'Enter' ? sendMessage() : null)}
          className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
