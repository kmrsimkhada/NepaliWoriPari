import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

interface Message {
  id?: number;
  sender_id: number;
  receiver_id?: number;
  content: string;
  sender_name?: string;
  created_at: string;
}

interface ChatModalProps {
  show: boolean;
  onClose: () => void;
  businessId: number;
  businessName: string;
  providerId: number;
}

export function ChatModal({ show, onClose, businessId, businessName, providerId }: ChatModalProps) {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && token && user) {
      // Generate conversation ID
      const sorted = [user.id, providerId].sort((a, b) => a - b);
      const convId = `${sorted[0]}_${sorted[1]}_${businessId}`;
      setConversationId(convId);

      // Connect socket
      const socket = io(import.meta.env.VITE_API_URL || '/', {
        auth: { token },
      });

      socket.on('connect', () => {
        socket.emit('join_conversation', convId);
      });

      socket.on('new_message', (msg: { senderId: number; content: string; created_at: string }) => {
        // Only add messages from the other user (sender's messages are added optimistically)
        if (msg.senderId !== user.id) {
          setMessages((prev) => [...prev, {
            sender_id: msg.senderId,
            content: msg.content,
            created_at: msg.created_at,
          }]);
        }
      });

      socketRef.current = socket;

      // Load existing messages
      loadMessages(convId);

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [show, token, user, businessId, providerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async (convId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/${convId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch {
      // No existing messages yet
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !token || !conversationId || !user) return;

    const content = newMessage.trim();
    setNewMessage('');

    // Optimistically add message to local state immediately
    setMessages((prev) => [...prev, {
      sender_id: user.id,
      content,
      created_at: new Date().toISOString(),
    }]);

    // Send via API (persists to DB)
    try {
      await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: providerId,
          businessId,
          content,
        }),
      });

      // Emit via socket for real-time delivery to the other user
      socketRef.current?.emit('send_message', {
        conversationId,
        receiverId: providerId,
        content,
      });
    } catch {
      // Message already shown optimistically
    }
  };

  if (!show || !user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chat-header">
          <div>
            <h3>💬 {businessName}</h3>
            <span className="chat-subtitle">Chat with provider</span>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="chat-messages">
          {loading ? (
            <p className="chat-loading">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="chat-empty">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`chat-bubble ${msg.sender_id === user.id ? 'sent' : 'received'}`}
              >
                <p>{msg.content}</p>
                <span className="chat-time">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="chat-input-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="chat-input"
            autoFocus
          />
          <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
