import Feedback from '../models/Feedback.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

export const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Open', 'In-progress', 'Completed', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.status = status;
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

export const deleteAnyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    await feedback.deleteOne();
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFeedback = await Feedback.countDocuments();
    
    const avgRatingResult = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' }
        }
      }
    ]);
    const avgRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 0;

    const categoryCount = await Category.countDocuments();

    const statusCounts = await Feedback.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryUsage = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: '$categoryInfo'
      },
      {
        $project: {
          categoryName: '$categoryInfo.name',
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      totalUsers,
      totalFeedback,
      avgRating: Math.round(avgRating * 10) / 10,
      categoryCount,
      statusCounts,
      categoryUsage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

