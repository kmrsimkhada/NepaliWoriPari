import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChatModal } from './ChatModal';

interface Conversation {
  conversation_id: string;
  business_id: number;
  business_name: string;
  last_message: string;
  last_message_at: string;
  other_user_id: number;
  other_user_name: string;
  unread_count: string;
}

interface ChatInboxProps {
  show: boolean;
  onClose: () => void;
}

export function ChatInbox({ show, onClose }: ChatInboxProps) {
  const { token, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);

  useEffect(() => {
    if (show && token) {
      loadConversations();
    }
  }, [show, token]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations);
      }
    } catch {
      console.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  if (!show || !user) return null;

  if (activeChat) {
    return (
      <ChatModal
        show={true}
        onClose={() => {
          setActiveChat(null);
          loadConversations();
        }}
        businessId={activeChat.business_id}
        businessName={activeChat.business_name}
        providerId={activeChat.other_user_id}
      />
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content chat-inbox-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <h2>💬 Messages</h2>

        <div className="inbox-list">
          {loading ? (
            <p className="chat-loading">Loading conversations...</p>
          ) : conversations.length === 0 ? (
            <p className="chat-empty">No messages yet.</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.conversation_id}
                className="inbox-item"
                onClick={() => setActiveChat(conv)}
              >
                <div className="inbox-item-info">
                  <strong>{conv.other_user_name}</strong>
                  <span className="inbox-business-name">Re: {conv.business_name}</span>
                  <p className="inbox-last-message">{conv.last_message}</p>
                </div>
                <div className="inbox-item-meta">
                  <span className="inbox-time">
                    {new Date(conv.last_message_at).toLocaleDateString()}
                  </span>
                  {parseInt(conv.unread_count) > 0 && (
                    <span className="inbox-unread">{conv.unread_count}</span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
