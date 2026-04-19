require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./db/userModel');
const Photo = require('./db/photoModel');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Photo Sharing API');
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
