const mongoose = require('mongoose');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

const isDBConnected = () => mongoose.connection.readyState === 1;

const ORIGINAL_USER_TEMPLATE = {
  _id: 'original-user-id',
  name: 'Original User',
  email: 'realuser@careerguide.ai',
  savedCareers: [],
  badges: [{ name: 'Welcome Explorer', icon: '🌟', earnedAt: new Date() }],
  preferences: { theme: 'dark' },
  surveyCompleted: false,
  level: 1,
  xp: 10,
  createdAt: new Date(),
};

const isGenericName = (name) => {
  const normalized = (name || '').trim().toLowerCase();
  return !normalized || normalized === 'user' || normalized === 'original user';
};

// Register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!isDBConnected()) {
      const token = generateToken('original-user-id');
      return res.status(201).json({ success: true, data: { user: { ...ORIGINAL_USER_TEMPLATE, name, email }, token } });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    user.badges.push({ name: 'Welcome Explorer', icon: '🌟' });
    user.xp += 10;
    await user.save();

    res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    if (!isDBConnected()) {
      const token = generateToken('original-user-id');
      return res.json({ success: true, data: { user: { ...ORIGINAL_USER_TEMPLATE, name: req.body.name || 'Original User', email }, token } });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

// Google Auth
exports.googleAuth = async (req, res, next) => {
  try {
    const { googleId, email, name, avatar } = req.body;

    if (!isDBConnected()) {
      const token = generateToken('original-user-id');
      return res.json({ success: true, data: { user: { ...ORIGINAL_USER_TEMPLATE, name, email }, token } });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({ googleId, email, name, avatar });
      user.badges.push({ name: 'Welcome Explorer', icon: '🌟' });
      user.xp += 10;
      await user.save();
    } else {
      let changed = false;
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        changed = true;
      }
      if (name && (isGenericName(user.name) || user.name !== name)) {
        user.name = name;
        changed = true;
      }
      if (avatar && user.avatar !== avatar) {
        user.avatar = avatar;
        changed = true;
      }
      if (changed) {
        await user.save();
      }
    }

    const token = generateToken(user._id);
    res.json({ success: true, data: { user, token } });
  } catch (error) {
    next(error);
  }
};

// Get Profile
exports.getProfile = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.json({ success: true, data: ORIGINAL_USER_TEMPLATE });
    }
    const user = await User.findById(req.userId).populate('savedCareers');
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Update Profile
exports.updateProfile = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.json({ success: true, data: ORIGINAL_USER_TEMPLATE });
    }
    const { name, preferences } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (preferences) updates.preferences = preferences;

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
