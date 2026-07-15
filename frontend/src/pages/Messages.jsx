import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { 
  Send, MessageSquare, ArrowLeft, Inbox, Info, MapPin, Tag, User 
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
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const currentUserId = user?.id || user?._id;

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

  // Setup a temporary conversation state for a new chat
  const setupNewConversation = async (itemId, recipientId) => {
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

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (isPolling = false) => {
    if (!activeConversation) return;
    
    try {
      if (!isPolling) setLoadingMessages(true);
      
      const res = await API.get(
        `/messages/conversation/${activeConversation.item._id}/${activeConversation.otherUser._id}`
      );
      
      setMessages(res.data);
      
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800 px-6 py-4 flex justify-between items-center z-10 shadow-sm shrink-0">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
          Chat Room
        </h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </nav>

      {/* Main chat window container */}
      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto p-4 md:p-6 gap-6 min-h-0">
        
        {/* Left Side: Conversation List */}
        <div className={`w-full md:w-80 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm shrink-0 transition-all duration-300 ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              Active Chats
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loadingConversations ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : conversations.length === 0 && (!activeConversation || !activeConversation.isTemp) ? (
              <div className="text-center py-12 px-4 text-slate-500">
                <Inbox className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-sm font-medium">No messages yet.</p>
                <p className="text-xs text-slate-400 mt-1">Start a conversation from any lost or found item details page.</p>
              </div>
            ) : (
              <>
                {/* Render temporary new conversation at the top if exists */}
                {activeConversation?.isTemp && (
                  <button
                    onClick={() => selectConversation(activeConversation)}
                    className="w-full text-left p-3.5 rounded-xl border border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 transition-all flex gap-3 relative"
                  >
                    {activeConversation.item.photoUrl ? (
                      <img 
                        src={activeConversation.item.photoUrl} 
                        alt="" 
                        className="w-12 h-12 object-cover rounded-lg bg-slate-100" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-lg font-bold">
                        {activeConversation.item.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          New Conversation
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {activeConversation.item.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        With {activeConversation.otherUser.name}
                      </p>
                    </div>
                  </button>
                )}

                {/* Render regular conversation list */}
                {conversations.map((conv) => {
                  const isActive = activeConversation && 
                    activeConversation.item._id === conv.item._id && 
                    activeConversation.otherUser._id === conv.otherUser._id;

                  return (
                    <button
                      key={`${conv.item._id}_${conv.otherUser._id}`}
                      onClick={() => selectConversation(conv)}
                      className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 flex gap-3 relative border group ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
                          : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-slate-150 dark:hover:border-slate-800'
                      }`}
                    >
                      {/* Photo or Placeholder */}
                      {conv.item.photoUrl ? (
                        <img 
                          src={conv.item.photoUrl} 
                          alt="" 
                          className="w-12 h-12 object-cover rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/50 dark:border-slate-800" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-lg font-bold shrink-0 border border-slate-200/50 dark:border-slate-800">
                          {conv.item.title.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            conv.item.type === 'lost'
                              ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                              : 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400'
                          }`}>
                            {conv.item.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {conv.item.title}
                        </h4>
                        
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                          {conv.otherUser.name}
                        </p>

                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-1">
                          {conv.lastMessage.sender === currentUserId ? 'You: ' : ''}{conv.lastMessage.content}
                        </p>
                      </div>

                      {/* Unread Counter Badge */}
                      {conv.unreadCount > 0 && !isActive && (
                        <span className="absolute right-4 bottom-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
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
        <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center gap-4 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => setActiveConversation(null)}
                    className="md:hidden p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                        {activeConversation.otherUser.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[120px] hidden sm:inline">
                        ({activeConversation.otherUser.email})
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/items/${activeConversation.item._id}`)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 mt-0.5 text-left truncate"
                    >
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      About item: <span className="font-bold truncate">{activeConversation.item.title}</span>
                    </button>
                  </div>
                </div>

                {/* Right Header Badges */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    activeConversation.item.type === 'lost'
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30'
                      : 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30'
                  }`}>
                    {activeConversation.item.type}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase font-semibold">
                    {activeConversation.item.status}
                  </span>
                </div>
              </div>

              {/* Chat Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/10">
                {loadingMessages ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 max-w-sm mx-auto space-y-2">
                    <MessageSquare className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
                    <p className="font-semibold text-sm">Send a message to start the conversation.</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Discuss details, confirm verification criteria, or establish a pickup spot safely.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwnMessage = msg.sender._id === currentUserId || msg.sender === currentUserId;
                    
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                            isOwnMessage
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : 'bg-white dark:bg-slate-800 text-slate-850 dark:text-slate-150 rounded-tl-none border border-slate-200/50 dark:border-slate-800'
                          }`}
                        >
                          <p className="leading-relaxed break-words">{msg.content}</p>
                          <span
                            className={`block text-[9px] mt-1 text-right font-medium ${
                              isOwnMessage ? 'text-indigo-200' : 'text-slate-400'
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Error messages block */}
              {error && (
                <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-y border-red-200 dark:border-red-900/50 py-2 px-4 text-center shrink-0">
                  {error}
                </p>
              )}

              {/* Chat Input Footer */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none text-sm transition"
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !newMessageText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl p-3 transition shadow-md shrink-0 flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center p-8 text-center text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-250/20 dark:border-slate-800">
                <MessageSquare className="w-8 h-8 text-slate-350 dark:text-slate-650 animate-pulse" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">
                Your Conversation Center
              </h3>
              <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                Select an active chat from the side list, or visit any item page to contact its reporter.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
