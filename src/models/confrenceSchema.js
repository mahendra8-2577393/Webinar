const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConferenceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  fieldsAvailable: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  modeOfConference: {
    type: String,
    enum: ["online", "offline", "hybrid"],
    required: true,
  },
  conferenceStatus: {
    type: String,
    enum: ["ongoing", "finished", "upcoming"],
    default: "upcoming",
  },
});

const conference = mongoose.model("Conference", ConferenceSchema);

module.exports = conference;
