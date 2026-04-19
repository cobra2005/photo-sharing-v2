require('dotenv').config();
const mongoose = require('mongoose');
const models = require('./models.cjs');
const User = require('./userModel');
const Photo = require('./photoModel');
const SchemaInfo = require('./schemaInfo');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to DB for seeding'))
  .catch(e => console.error('Connection error:', e));

async function loadData() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Photo.deleteMany({});
    await SchemaInfo.deleteMany({});

    // Load schema info
    await SchemaInfo.create(models.schemaInfo());

    // Load users
    const users = models.userListModel();
    await User.insertMany(users);

    // Load photos
    for (const u of users) {
      const photos = models.photoOfUserModel(u._id);
      for (const p of photos) {
        // Fix comments to reference user_id instead of embedding full user object
        if (p.comments) {
          p.comments.forEach(c => {
            c.user_id = c.user._id;
            delete c.user;
          });
        }
        await Photo.create(p);
      }
    }

    console.log('Database seeded successfully!');
  } catch (e) {
    console.error('Error seeding the database: ', e);
  } finally {
    mongoose.connection.close();
  }
}

loadData();
