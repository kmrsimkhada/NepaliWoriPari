import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to generate conversation ID (consistent regardless of who initiates)
function getConversationId(userId1: number, userId2: number, businessId: number): string {
  const sorted = [userId1, userId2].sort((a, b) => a - b);
  return `${sorted[0]}_${sorted[1]}_${businessId}`;
}

// GET /api/messages/unread-count - Get total unread message count
router.get('/unread-count', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM messages WHERE receiver_id = $1 AND is_read = FALSE',
      [userId]
    );
    res.json({ unreadCount: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// GET /api/messages/conversations - Get all conversations for the logged-in user
router.get('/conversations', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const result = await pool.query(
      `SELECT DISTINCT ON (m.conversation_id)
        m.conversation_id,
        m.business_id,
        b.name as business_name,
        m.content as last_message,
        m.created_at as last_message_at,
        m.sender_id,
        CASE 
          WHEN m.sender_id = $1 THEN m.receiver_id
          ELSE m.sender_id
        END as other_user_id,
        u.name as other_user_name,
        (SELECT COUNT(*) FROM messages WHERE conversation_id = m.conversation_id AND receiver_id = $1 AND is_read = FALSE) as unread_count
       FROM messages m
       JOIN businesses b ON m.business_id = b.id
       JOIN users u ON u.id = CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END
       WHERE m.sender_id = $1 OR m.receiver_id = $1
       ORDER BY m.conversation_id, m.created_at DESC`,
      [userId]
    );

    res.json({ conversations: result.rows });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// GET /api/messages/:conversationId - Get messages in a conversation
router.get('/:conversationId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user!.userId;

    // Verify user is part of this conversation
    const check = await pool.query(
      'SELECT id FROM messages WHERE conversation_id = $1 AND (sender_id = $2 OR receiver_id = $2) LIMIT 1',
      [conversationId, userId]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to view this conversation' });
    }

    // Mark messages as read
    await pool.query(
      'UPDATE messages SET is_read = TRUE WHERE conversation_id = $1 AND receiver_id = $2 AND is_read = FALSE',
      [conversationId, userId]
    );

    const result = await pool.query(
      `SELECT m.id, m.sender_id, m.receiver_id, m.content, m.is_read, m.created_at,
              u.name as sender_name
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at ASC`,
      [conversationId]
    );

    res.json({ messages: result.rows });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/messages/send - Send a message
router.post('/send', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, businessId, content } = req.body;
    const senderId = req.user!.userId;

    if (!receiverId || !businessId || !content) {
      return res.status(400).json({ error: 'receiverId, businessId, and content are required' });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Cannot send message to yourself' });
    }

    const conversationId = getConversationId(senderId, receiverId, businessId);

    const result = await pool.query(
      `INSERT INTO messages (conversation_id, sender_id, receiver_id, business_id, content)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, conversation_id, sender_id, receiver_id, business_id, content, is_read, created_at`,
      [conversationId, senderId, receiverId, businessId, content]
    );

    res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export { getConversationId };
export default router;
