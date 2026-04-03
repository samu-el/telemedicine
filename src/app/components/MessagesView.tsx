import { useState } from 'react';
import { User } from '../App';
import { Send, Paperclip, Search, MoreVertical } from 'lucide-react';

interface MessagesViewProps {
  user: User;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  role: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  caseId?: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  attachment?: {
    name: string;
    type: string;
  };
}

export function MessagesView({ user }: MessagesViewProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    null
  );
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock conversations based on user role
  const getConversations = (): Conversation[] => {
    if (user.role === 'patient') {
      return [
        {
          id: '1',
          name: 'Dr. Michael Weber',
          avatar: 'MW',
          role: 'Dermatologist',
          lastMessage: 'Your prescription has been approved and sent to the pharmacy.',
          timestamp: '10:30 AM',
          unread: 2,
          caseId: '#1234',
        },
        {
          id: '2',
          name: 'Dr. Sarah Johnson',
          avatar: 'SJ',
          role: 'General Practitioner',
          lastMessage: 'Please send me the additional photos we discussed.',
          timestamp: 'Yesterday',
          unread: 0,
          caseId: '#1232',
        },
        {
          id: '3',
          name: 'MedCare Pharmacy',
          avatar: 'MP',
          role: 'Pharmacy',
          lastMessage: 'Your order #5678 is ready for delivery.',
          timestamp: '2 days ago',
          unread: 0,
        },
      ];
    } else if (user.role === 'doctor') {
      return [
        {
          id: '1',
          name: 'Emma Schmidt',
          avatar: 'ES',
          role: 'Patient',
          lastMessage: 'Thank you doctor! When should I start the treatment?',
          timestamp: '11:45 AM',
          unread: 1,
          caseId: '#1234',
        },
        {
          id: '2',
          name: 'Max Weber',
          avatar: 'MW',
          role: 'Patient',
          lastMessage: 'I uploaded the photos as requested.',
          timestamp: '9:20 AM',
          unread: 3,
          caseId: '#1233',
        },
        {
          id: '3',
          name: 'Lisa Müller',
          avatar: 'LM',
          role: 'Patient',
          lastMessage: 'The treatment is working well, thank you!',
          timestamp: 'Yesterday',
          unread: 0,
          caseId: '#1232',
        },
      ];
    } else if (user.role === 'pharmacy') {
      return [
        {
          id: '1',
          name: 'Emma Schmidt',
          avatar: 'ES',
          role: 'Patient',
          lastMessage: 'Can I change my delivery address?',
          timestamp: '2:15 PM',
          unread: 1,
        },
        {
          id: '2',
          name: 'Dr. Michael Weber',
          avatar: 'MW',
          role: 'Doctor',
          lastMessage: 'Please confirm the prescription details for case #1234',
          timestamp: 'Yesterday',
          unread: 0,
        },
      ];
    }
    return [];
  };

  const getMessages = (conversationId: string): Message[] => {
    // Mock messages for the selected conversation
    return [
      {
        id: '1',
        senderId: 'other',
        text: 'Hello! I have reviewed your case and photos.',
        timestamp: '10:15 AM',
        isOwn: false,
      },
      {
        id: '2',
        senderId: 'own',
        text: 'Thank you doctor. What is the diagnosis?',
        timestamp: '10:18 AM',
        isOwn: true,
      },
      {
        id: '3',
        senderId: 'other',
        text: 'Based on the information provided, I recommend starting with a topical treatment. I will send you a prescription.',
        timestamp: '10:25 AM',
        isOwn: false,
      },
      {
        id: '4',
        senderId: 'own',
        text: 'That sounds good. How long should I use it?',
        timestamp: '10:27 AM',
        isOwn: true,
      },
      {
        id: '5',
        senderId: 'other',
        text: 'Your prescription has been approved and sent to the pharmacy.',
        timestamp: '10:30 AM',
        isOwn: false,
      },
    ];
  };

  const conversations = getConversations();
  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle sending message
      setMessageText('');
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const messages = selectedConversation ? getMessages(selectedConversation) : [];

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                selectedConversation === conv.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {conv.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {conv.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{conv.role}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.lastMessage}
                  </p>
                  {conv.caseId && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded">
                      {conv.caseId}
                    </span>
                  )}
                </div>
                {conv.unread > 0 && (
                  <div className="w-5 h-5 bg-[#5B6FF8] rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {conv.unread}
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConv ? (
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedConv.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedConv.name}
                  </p>
                  <p className="text-sm text-gray-600">{selectedConv.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedConv.caseId && (
                  <span className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full">
                    {selectedConv.caseId}
                  </span>
                )}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md px-4 py-3 rounded-2xl ${
                    message.isOwn
                      ? 'bg-[#5B6FF8] text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  {message.attachment && (
                    <div className="mt-2 p-2 bg-white bg-opacity-20 rounded-lg">
                      <p className="text-xs">{message.attachment.name}</p>
                    </div>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      message.isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-end gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex-1">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  rows={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="p-3 bg-[#5B6FF8] text-white rounded-lg hover:bg-[#4A5FE7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              All messages are HIPAA compliant and encrypted
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select a conversation
            </h3>
            <p className="text-sm text-gray-600">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
