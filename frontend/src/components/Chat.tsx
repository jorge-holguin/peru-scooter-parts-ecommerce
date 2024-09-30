// frontend/src/components/Chat.tsx
import React, { useState, useEffect } from 'react';
import socket from '../services/socket';

interface Message {
  user: string;
  message: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('receiveMessage', (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== '') {
      const userMessage = { user: 'usuario', message: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      socket.emit('sendMessage', input);
      setInput('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Escribe tu mensaje"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => (e.key === 'Enter' ? sendMessage() : null)}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default Chat;
