const Item = require('../models/Item');
const Notification = require('../models/Notification');
// Create new item (lost or found report)
exports.createItem = async (req, res) => {
  try {
    const { title, description, category, type, location, date } = req.body;

    const newItem = new Item({
      title,
      description,
      category,
      type,
      location,
      date,
      photoUrl: req.file ? req.file.path : '',
      reportedBy: req.user.id
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all items with optional search/filter
exports.getItems = async (req, res) => {
  try {
    const { category, location, keyword, type, status, reportedBy } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (reportedBy) filter.reportedBy = reportedBy;
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    const items = await Item.find(filter)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get single item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('reportedBy', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: verify or reject item
// Admin: verify or reject item
exports.verifyItem = async (req, res) => {
  try {
    const { status } = req.body; // 'verified' or 'rejected'

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status, verifiedBy: req.user.id },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (status === 'verified') {
      // Notify the reporter their item was verified
      await Notification.create({
        user: item.reportedBy,
        message: `Your ${item.type} item "${item.title}" has been verified.`,
        itemRef: item._id
      });

      // Simple keyword-based match check against opposite type
      const oppositeType = item.type === 'lost' ? 'found' : 'lost';
      const potentialMatches = await Item.find({
        type: oppositeType,
        status: 'verified',
        category: item.category,
        $or: [
          { title: { $regex: item.title.split(' ')[0], $options: 'i' } },
          { location: { $regex: item.location, $options: 'i' } }
        ]
      });

      for (const match of potentialMatches) {
        await Notification.create({
          user: item.reportedBy,
          message: `A possible match for your "${item.title}" was found: "${match.title}".`,
          itemRef: match._id
        });
        await Notification.create({
          user: match.reportedBy,
          message: `A possible match for your "${match.title}" was found: "${item.title}".`,
          itemRef: item._id
        });
      }
    }

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update item status (e.g., mark as recovered)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// Dashboard/report statistics
exports.getStats = async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const lostCount = await Item.countDocuments({ type: 'lost' });
    const foundCount = await Item.countDocuments({ type: 'found' });
    const pendingCount = await Item.countDocuments({ status: 'pending' });
    const verifiedCount = await Item.countDocuments({ status: 'verified' });
    const recoveredCount = await Item.countDocuments({ status: 'recovered' });
    const rejectedCount = await Item.countDocuments({ status: 'rejected' });

    // Category breakdown
    const categoryBreakdown = await Item.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Items reported per day (last 7 days trend)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyTrend = await Item.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      totalItems,
      lostCount,
      foundCount,
      pendingCount,
      verifiedCount,
      recoveredCount,
      rejectedCount,
      categoryBreakdown,
      dailyTrend
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};