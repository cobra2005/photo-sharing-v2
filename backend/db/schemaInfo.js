const mongoose = require('mongoose');

const schemaInfo = new mongoose.Schema({
  version: String,
  load_date_time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SchemaInfo', schemaInfo);
