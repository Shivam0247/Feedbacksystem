import Feedback from '../models/Feedback.js';

export const createFeedback = async (req, res) => {
  try {
    const { title, message, category, rating } = req.body;

    if (!title || !message || !category || !rating) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      title,
      message,
      category,
      rating
    });

    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('user', 'name email')
      .populate('category', 'name')
      .populate('upvotes', 'name');

    res.status(201).json(populatedFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      rating,
      user,
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // Search by title or message
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by rating
    if (rating) {
      query.rating = parseInt(rating);
    }

    // Filter by user
    if (user) {
      query.user = user;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const feedbacks = await Feedback.find(query)
      .populate('user', 'name email')
      .populate('category', 'name')
      .populate('upvotes', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Feedback.countDocuments(query);

    res.json({
      feedbacks,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('user', 'name email')
      .populate('category', 'name')
      .populate('upvotes', 'name');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check if user owns the feedback
    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this feedback' });
    }

    const { title, message, category, rating } = req.body;

    if (title) feedback.title = title;
    if (message) feedback.message = message;
    if (category) feedback.category = category;
    if (rating) feedback.rating = rating;

    await feedback.save();

    const updatedFeedback = await Feedback.findById(feedback._id)
      .populate('user', 'name email')
      .populate('category', 'name')
      .populate('upvotes', 'name');

    res.json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check if user owns the feedback
    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this feedback' });
    }

    await feedback.deleteOne();
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleUpvote = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    const userId = req.user._id.toString();
    const upvoteIndex = feedback.upvotes.findIndex(
      id => id.toString() === userId
    );

    if (upvoteIndex > -1) {
      feedback.upvotes.splice(upvoteIndex, 1);
    } else {
      feedback.upvotes.push(userId);
    }

    await feedback.save();

    const updatedFeedback = await Feedback.findById(feedback._id)
      .populate('user', 'name email')
      .populate('category', 'name')
      .populate('upvotes', 'name');

    res.json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

