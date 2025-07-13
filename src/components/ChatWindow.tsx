import React, { useState } from 'react';
import { Send, Paperclip, Smile, MoreVertical } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface ChatWindowProps {
  roscaName: string;
  members: string[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ roscaName, members }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Alice Johnson',
      content: 'Welcome everyone to our ROSCA group! Looking forward to saving together.',
      timestamp: '2025-01-15T10:30:00Z',
      isCurrentUser: false,
    },
    {
      id: '2',
      sender: 'You',
      content: 'Thanks Alice! Excited to be part of this group.',
      timestamp: '2025-01-15T10:32:00Z',
      isCurrentUser: true,
    },
    {
      id: '3',
      sender: 'Bob Smith',
      content: 'When is our first contribution due?',
      timestamp: '2025-01-15T10:35:00Z',
      isCurrentUser: false,
    },
    {
      id: '4',
      sender: 'Alice Johnson',
      content: 'The first contribution is due on January 25th. I\'ll send a reminder closer to the date.',
      timestamp: '2025-01-15T10:37:00Z',
      isCurrentUser: false,
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'You',
        content: message,
        timestamp: new Date().toISOString(),
        isCurrentUser: true,
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-900">{roscaName}</h3>
          <p className="text-sm text-gray-500">{members.length} members</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.isCurrentUser
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {!msg.isCurrentUser && (
                <p className="text-xs font-medium mb-1 opacity-75">{msg.sender}</p>
              )}
              <p className="text-sm">{msg.content}</p>
              <p className={`text-xs mt-1 ${
                msg.isCurrentUser ? 'text-orange-100' : 'text-gray-500'
              }`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Paperclip className="h-4 w-4 text-gray-600" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Smile className="h-4 w-4 text-gray-600" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;