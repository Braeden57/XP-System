const mongoose = require('mongoose');

const QuestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  campaign: {
    type: String,
    required: true
  },
  expiry: {
    type: Date,
    required: true
  },
  xp: {
    type: Number,
    required: true
  },
  instruction: {
    type: String,
    required: true
  }
});

const Quest = mongoose.model('Quest', QuestSchema);

module.exports = Quest;
