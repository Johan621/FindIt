const Message = require('../models/Message');
const Item = require('../models/Item');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Send a message regarding an item
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, itemId, content } = req.body;
    const senderId = req.user.id;

    if (!recipientId || !content || !content.trim()) {
      return res.status(400).json({ message: 'Recipient and Content are required.' });
    }

    if (recipientId === senderId) {
      return res.status(400).json({ message: 'You cannot send a message to yourself.' });
    }

    // Verify recipient and item exist
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient user not found.' });
    }

    let item = null;
    if (itemId && itemId !== 'system') {
      item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({ message: 'Item not found.' });
      }
    }

    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      content: content.trim()
    });
    if (itemId && itemId !== 'system') {
      newMessage.item = itemId;
    }

    await newMessage.save();

    // Notify the recipient
    const senderUser = await User.findById(senderId);
    const senderName = senderUser ? senderUser.name : 'Another user';
    await Notification.create({
      user: recipientId,
      message: item ? `${senderName} sent you a message about "${item.title}".` : `${senderName} sent you a message.`,
      itemRef: item ? item._id : undefined
    });

    // Populate sender and recipient details before returning
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .populate('item', 'title type');

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get list of conversations for logged-in user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .populate('item', 'title type photoUrl status')
      .sort({ createdAt: -1 });

    const conversationsMap = {};

    for (const msg of messages) {
      const otherUser = msg.sender._id.toString() === userId ? msg.recipient : msg.sender;
      if (!otherUser) continue;

      const itemIdString = msg.item ? msg.item._id.toString() : 'system';
      const key = `${itemIdString}_${otherUser._id}`;

      if (!conversationsMap[key]) {
        conversationsMap[key] = {
          item: msg.item || { _id: 'system', title: 'Admin Support', type: 'system', status: 'active' },
          otherUser: {
            _id: otherUser._id,
            name: otherUser.name,
            email: otherUser.email
          },
          lastMessage: {
            content: msg.content,
            createdAt: msg.createdAt,
            sender: msg.sender._id
          },
          unreadCount: 0
        };
      }

      if (msg.recipient._id.toString() === userId && !msg.read) {
        conversationsMap[key].unreadCount += 1;
      }
    }

    res.status(200).json(Object.values(conversationsMap));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all messages in a conversation
exports.getMessagesForConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, otherUserId } = req.params;

    const query = {
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    };
    if (itemId && itemId !== 'system') {
      query.item = itemId;
    } else {
      query.item = { $exists: false };
    }

    const messages = await Message.find(query)
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: 1 });

    const updateQuery = {
      sender: otherUserId,
      recipient: userId,
      read: false
    };
    if (itemId && itemId !== 'system') {
      updateQuery.item = itemId;
    } else {
      updateQuery.item = { $exists: false };
    }

    // Mark messages sent by the other user as read
    await Message.updateMany(updateQuery, { read: true });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Mark conversation as read
exports.markConversationAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, otherUserId } = req.params;

    const updateQuery = {
      sender: otherUserId,
      recipient: userId,
      read: false
    };
    if (itemId && itemId !== 'system') {
      updateQuery.item = itemId;
    } else {
      updateQuery.item = { $exists: false };
    }

    await Message.updateMany(updateQuery, { read: true });

    res.status(200).json({ message: 'Conversation marked as read.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
