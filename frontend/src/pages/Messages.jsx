import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { 
  Send, MessageSquare, ArrowLeft, Inbox, Info,  
} from 'lucide-react';

export default function Messages() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null); // { item, otherUser }
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [, setError] = useState('');
  
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  const currentUserId = user?.id || user?._id;

  // Setup a temporary conversation state for a new chat
  async function setupNewConversation(itemId, recipientId) {
    try {
      setLoadingMessages(true);
      const itemRes = await API.get(`/items/${itemId}`);

      const itemData = itemRes.data;
      
      // The other user is the reporter of the item
      const otherUser = itemData.reportedBy;

      if (!otherUser || otherUser._id !== recipientId) {
        // Fallback info if mismatch or populated owner is different
        setError('Error initializing chat with the owner.');
        return;
      }

      setActiveConversation({
        item: {
          _id: itemData._id,
          title: itemData.title,
          type: itemData.type,
          photoUrl: itemData.photoUrl,
          status: itemData.status
        },
        otherUser: {
          _id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email
        },
        unreadCount: 0,
        isTemp: true
      });
      setMessages([]);
    } catch (err) {
      console.error('Error starting new conversation:', err);
      setError('Could not initialize conversation.');
    } finally {
      setLoadingMessages(false);
    }
  };

  // Fetch list of conversations
  const fetchConversations = useCallback(async (selectDefault = false) => {
    try {
      const res = await API.get('/messages/conversations');
      setConversations(res.data);
      
      // If we need to auto-select a conversation (e.g. on first load)
      if (selectDefault) {
        const itemParam = searchParams.get('item');
        const recipientParam = searchParams.get('recipient');
        
        if (itemParam && recipientParam) {
          const match = res.data.find(
            (c) => c.item._id === itemParam && c.otherUser._id === recipientParam
          );
          if (match) {
            setActiveConversation(match);
          } else {
            // Initiate a fresh chat (not in conversation list yet)
            await setupNewConversation(itemParam, recipientParam);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Could not load conversations.');
    } finally {
      setLoadingConversations(false);
    }
  }, [searchParams]);


  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (isPolling = false) => {
    if (!activeConversation) return;
    
    try {
      if (!isPolling) setLoadingMessages(true);
      
      const res = await API.get(
        `/messages/conversation/${activeConversation.item._id}/${activeConversation.otherUser._id}`
      );
      
      if (!isPolling) {
        setMessages(res.data);
      } else {
        setMessages(prev => res.data.length > prev.length ? res.data : prev);
      }
      
      // If there were unread messages, update local conversations unread list
      if (activeConversation.unreadCount > 0) {
        setConversations(prev => 
          prev.map(c => 
            c.item._id === activeConversation.item._id && c.otherUser._id === activeConversation.otherUser._id
              ? { ...c, unreadCount: 0 }
              : c
          )
        );
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      if (!isPolling) setLoadingMessages(false);
    }
  }, [activeConversation]);

  // Handle URL query parameters changes
  useEffect(() => {
    void (async () => {
      await fetchConversations(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Poll for new messages every 4 seconds when conversation is active
  useEffect(() => {
    if (!activeConversation || activeConversation.isTemp) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    void (async () => {
      await fetchMessages(false);
    })();

    pollIntervalRef.current = setInterval(() => {
      void fetchMessages(true);
    }, 4000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [activeConversation, fetchMessages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current || prevMessagesLengthRef.current === 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  // Reset scroll length memory when conversation changes
  useEffect(() => {
    prevMessagesLengthRef.current = 0;
  }, [activeConversation]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeConversation || sendingMessage) return;

    setSendingMessage(true);
    try {
      const res = await API.post('/messages', {
        recipientId: activeConversation.otherUser._id,
        itemId: activeConversation.item._id,
        content: newMessageText.trim()
      });

      // Clear text box
      setNewMessageText('');
      
      // Append new message locally
      setMessages((prev) => [...prev, res.data]);

      // If it was a temporary conversation state, convert it to active and refresh conversations
      if (activeConversation.isTemp) {
        setActiveConversation(prev => ({ ...prev, isTemp: false }));
        // Remove search params to make URL clean
        setSearchParams({});
      }
      
      // Refresh conversation list to show newest messages
      await fetchConversations();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

  const selectConversation = (conv) => {
    setError('');
    setSearchParams({}); // Clear query params if switching chats
    setActiveConversation(conv);
  };

  return (
    <div className="h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3 flex justify-between items-center z-20 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Conversations
          </h1>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
      </nav>

      {/* Main chat window container */}
      <div className="flex-1 flex overflow-hidden w-full max-w-7xl mx-auto md:p-6">
        <div className="flex-1 flex overflow-hidden bg-white dark:bg-slate-900 md:rounded-3xl shadow-2xl md:border border-slate-200 dark:border-slate-800 w-full">
          
          {/* Left Side: Conversation List */}
          <div className={`w-full md:w-[350px] flex-col border-r border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/50 overflow-hidden shrink-0 transition-all duration-300 ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                Chats
                <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs py-0.5 px-2 rounded-full font-bold ml-auto">
                  {conversations.length}
                </span>
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-0.5 p-2 custom-scrollbar">
              {loadingConversations ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              ) : conversations.length === 0 && (!activeConversation || !activeConversation.isTemp) ? (
                <div className="text-center p-8 text-slate-400 flex flex-col items-center gap-3 mt-10">
                  <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <Inbox className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="font-medium text-sm">No messages yet.</p>
                </div>
              ) : (
                <>
                  {activeConversation && activeConversation.isTemp && (
                    <button className="w-full text-left p-3 rounded-xl transition-all duration-300 flex gap-4 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-xl font-black shrink-0">
                        {activeConversation.item.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <span className="text-[10px] px-2 py-0.5 rounded text-indigo-700 bg-indigo-200 dark:bg-indigo-500/30 dark:text-indigo-300 font-bold w-max mb-1">
                          New Chat
                        </span>
                        <h4 className="font-bold text-[15px] text-slate-900 dark:text-white truncate">
                          {activeConversation.item.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                          With {activeConversation.otherUser.name}
                        </p>
                      </div>
                    </button>
                  )}

                  {conversations.map((conv, index) => {
                    const isActive = activeConversation && !activeConversation.isTemp && 
                      activeConversation.item._id === conv.item._id && 
                      activeConversation.otherUser._id === conv.otherUser._id;
                    
                    return (
                      <button
                        key={conv._id || `conv-${index}`}
                        onClick={() => selectConversation(conv)}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex gap-3 relative ${
                          isActive
                            ? 'bg-white dark:bg-indigo-500/10 shadow-sm border border-slate-200 dark:border-transparent'
                            : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 border border-transparent'
                        }`}
                      >
                        {/* Photo or Placeholder */}
                        <div className="relative shrink-0">
                          {conv.item.photoUrl ? (
                            <img 
                              src={conv.item.photoUrl} 
                              alt="" 
                              className="w-12 h-12 object-cover rounded-xl shadow-sm bg-slate-200 dark:bg-slate-800" 
                            />
                          ) : (
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black shadow-sm ${
                              isActive 
                                ? 'bg-indigo-500 text-white' 
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                            }`}>
                              {conv.item.title.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-0.5">
                            <h4 className={`font-bold text-[15px] truncate pr-2 ${isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-100'}`}>
                              {conv.otherUser.name}
                            </h4>
                            <span className={`text-[11px] font-semibold whitespace-nowrap mt-1 ${conv.unreadCount > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                              {new Date(conv.lastMessage.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          
                          <p className={`text-[13px] truncate ${conv.unreadCount > 0 && !isActive ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400 font-medium'}`}>
                            {conv.lastMessage.sender === currentUserId ? 'You: ' : ''}{conv.lastMessage.content}
                          </p>
                        </div>

                        {/* Unread Counter Badge */}
                        {conv.unreadCount > 0 && !isActive && (
                          <span className="absolute top-1/2 -translate-y-1/2 right-3 bg-indigo-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-[20px] px-1.5 flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Right Side: Chat Window */}
          <div className={`flex-1 flex flex-col bg-white dark:bg-slate-950 relative ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="px-4 md:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center gap-4 shrink-0 z-10 shadow-sm">
                  <div className="flex items-center gap-4 min-w-0">
                    <button 
                      onClick={() => setActiveConversation(null)}
                      className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition shrink-0"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-sm">
                      {activeConversation.otherUser.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex flex-col justify-center">
                      <h3 className="font-bold text-[16px] text-slate-900 dark:text-white truncate">
                        {activeConversation.otherUser.name}
                      </h3>
                      <button
                        onClick={() => navigate(`/items/${activeConversation.item._id}`)}
                        className="text-[12px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-left truncate flex items-center gap-1"
                      >
                        <Info className="w-3 h-3" />
                        Regarding: <span className="font-bold truncate">{activeConversation.item.title}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chat Messages List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#f0f4f8] dark:bg-[#0f172a] custom-scrollbar shadow-inner">
                  {loadingMessages ? (
                    <div className="flex justify-center items-center py-20">
                      <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                      <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
                        <MessageSquare className="w-8 h-8 text-slate-400" />
                      </div>
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">Say Hello!</h4>
                        <p className="text-sm text-slate-500 mt-1">Start discussing details.</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isOwnMessage = msg.sender._id === currentUserId || msg.sender === currentUserId;
                      const prevMsg = index > 0 ? messages[index - 1] : null;
                      const isConsecutive = prevMsg && (prevMsg.sender._id === msg.sender._id || prevMsg.sender === msg.sender);
                      
                      return (
                        <div
                          key={msg._id || `msg-${index}`}
                          className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} ${isConsecutive ? 'mt-1' : 'mt-4'}`}
                        >
                          <div className={`relative max-w-[85%] sm:max-w-[70%] group flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`px-4 py-2.5 text-[15px] shadow-sm ${
                                isOwnMessage
                                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                              } ${
                                isOwnMessage 
                                  ? `rounded-2xl rounded-tr-sm ${isConsecutive ? 'rounded-tr-2xl rounded-br-sm' : ''}` 
                                  : `rounded-2xl rounded-tl-sm ${isConsecutive ? 'rounded-tl-2xl rounded-bl-sm' : ''}`
                              }`}
                            >
                              <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                              <div
                                className={`flex items-center gap-1 mt-1 ${
                                  isOwnMessage ? 'justify-end text-white/80' : 'justify-start text-slate-400'
                                }`}
                              >
                                <span className="text-[10px] font-semibold uppercase tracking-wider">
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {isOwnMessage && (
                                  <svg className="w-3 h-3 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input Footer */}
                <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex gap-2 items-end max-w-4xl mx-auto"
                  >
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 border border-transparent focus-within:border-indigo-500 rounded-2xl transition-all flex items-center px-4 py-1">
                      <input
                        type="text"
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white outline-none text-[15px] py-2.5 placeholder:text-slate-400"
                        disabled={sendingMessage}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sendingMessage || !newMessageText.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-400 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors shrink-0 shadow-sm"
                    >
                      <Send className="w-5 h-5 ml-0.5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center p-8 text-center bg-white dark:bg-slate-950">
                <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-slate-900 flex items-center justify-center mb-6 shadow-sm">
                  <MessageSquare className="w-10 h-10 text-indigo-400 dark:text-slate-500" />
                </div>
                <h3 className="font-bold text-xl text-slate-700 dark:text-slate-200 mb-2">
                  Your Messages Hub
                </h3>
                <p className="text-slate-500 text-sm max-w-[250px]">
                  Select an active conversation from the sidebar to continue chatting.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
