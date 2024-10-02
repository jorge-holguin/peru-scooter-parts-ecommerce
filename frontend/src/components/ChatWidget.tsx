// src/components/ChatWidget.tsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { MessageCircle, X } from 'lucide-react';

interface Message {
  user: string;
  message: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.on('receiveMessage', (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (input.trim() !== '' && socket) {
      const userMessage = { user: 'Tú', message: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      socket.emit('sendMessage', input);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 w-80 h-96 rounded-lg shadow-lg flex flex-col">
          <div className="flex items-center justify-between p-4 bg-indigo-600 text-white rounded-t-lg">
            <h2 className="text-lg font-semibold">Chat de Soporte</h2>
            <button onClick={toggleChat}>
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 p-2 overflow-y-auto">
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
          <div className="p-2">
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
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
