require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const User = require('./db/userModel');
const Photo = require('./db/photoModel');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/photoShare';

// Set up session with MongoDB store to prevent session loss on server restart
app.use(session({
  secret: 'my-super-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoURI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth Middleware to protect routes
const requireAuth = (req, res, next) => {
  if (
    req.path === '/admin/login' || 
    req.path === '/admin/logout' || 
    req.path === '/user' || 
    req.path.startsWith('/images')
  ) {
    return next();
  }
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

app.use(requireAuth);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
  res.send('Photo Sharing API');
});

// Login
app.post('/admin/login', async (req, res) => {
  try {
    const { login_name } = req.body;
    const user = await User.findOne({ login_name });
    if (!user) return res.status(400).json({ message: 'Login failed: User not found' });
    
    req.session.userId = user._id;
    req.session.login_name = user.login_name;
    req.session.first_name = user.first_name;
    
    res.json({ _id: user._id, first_name: user.first_name, last_name: user.last_name, login_name: user.login_name });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
app.post('/admin/logout', (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ message: 'Not logged in' });
  }
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Error logging out' });
    res.status(200).send();
  });
});

// Register
app.post('/user', async (req, res) => {
  try {
    const { login_name, password, first_name, last_name, location, description, occupation } = req.body;
    
    if (!login_name || !password || !first_name || !last_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const existing = await User.findOne({ login_name });
    if (existing) {
      return res.status(400).json({ message: 'Login name already exists' });
    }
    
    const newUser = await User.create({
      login_name, password, first_name, last_name, location, description, occupation
    });
    
    res.json({ _id: newUser._id, login_name: newUser.login_name });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload a new photo
const upload = multer({ dest: path.join(__dirname, 'images') });
app.post('/photos/new', upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file provided' });
  if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
  
  try {
    const ext = path.extname(req.file.originalname) || '';
    const newName = req.file.filename + ext;
    fs.renameSync(req.file.path, path.join(req.file.destination, newName));
    
    const newPhoto = await Photo.create({
      file_name: newName,
      date_time: new Date(),
      user_id: req.session.userId,
      comments: []
    });
    res.json(newPhoto);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a comment to a photo
app.post('/commentsOfPhoto/:photo_id', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
  
  const { comment } = req.body;
  if (!comment || comment.trim() === '') {
    return res.status(400).json({ message: 'Empty comment' });
  }
  
  try {
    const photo = await Photo.findById(req.params.photo_id);
    if (!photo) return res.status(400).json({ message: 'Photo not found' });
    
    photo.comments.push({
      comment: comment,
      user_id: req.session.userId,
      date_time: new Date()
    });
    
    await photo.save();
    res.json(photo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// /user/list
app.get('/user/list', async (req, res) => {
  try {
    const users = await User.find({}, '_id first_name last_name').lean();

    for (let u of users) {
      const photoCount = await Photo.countDocuments({ user_id: u._id });
      const commentsCount = await Photo.aggregate([
        { $unwind: "$comments" },
        { $match: { "comments.user_id": new mongoose.Types.ObjectId(u._id) } },
        { $count: "count" }
      ]);
      u.photo_count = photoCount;
      u.comment_count = commentsCount.length > 0 ? commentsCount[0].count : 0;
    }

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', err });
  }
});

// /commentsOfUser/:id
app.get('/commentsOfUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: 'Invalid ID' });

    const photosWithComments = await Photo.find({ "comments.user_id": userId })
      .populate('user_id', '_id first_name last_name').lean();

    let userComments = [];
    photosWithComments.forEach(photo => {
      photo.comments.forEach(c => {
        if (c.user_id.toString() === userId) {
          userComments.push({
            _id: c._id,
            comment: c.comment,
            date_time: c.date_time,
            photo_file_name: photo.file_name,
            photo_id: photo._id,
            photo_owner: photo.user_id // { _id, first_name, last_name }
          });
        }
      });
    });

    res.json(userComments);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', err });
  }
});

// /user/:id
app.get('/user/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
    const user = await User.findById(req.params.id, '_id first_name last_name location description occupation');
    if (!user) return res.status(400).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', err });
  }
});

// /photosOfUser/:id
app.get('/photosOfUser/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
    const photos = await Photo.find({ user_id: req.params.id }).populate('comments.user_id', '_id first_name last_name').lean();
    if (!photos) return res.status(400).json({ message: 'Photos not found' });

    // Map comments format to include `user` field as requested in README
    const formattedPhotos = photos.map(photo => {
      if (photo.comments) {
        photo.comments = photo.comments.map(c => {
          const comment = { ...c };
          comment.user = comment.user_id; // rename user_id -> user
          delete comment.user_id;
          return comment;
        });
      }
      return photo;
    });

    res.json(formattedPhotos);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', err });
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
