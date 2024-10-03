const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = { discriminatorKey: "kind" };

// User Schema
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      min: 10,
      max: 10,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    role: {
      type: Number,
      enum: [0, 1, 2],
      required: true,
    },
    securityQuestion: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
    },
  },
  options
);

const User = mongoose.model("User", UserSchema);

// Viewer Schema
const AudienceSchema = new Schema({
  ourCollegeStudent: {
    type: Boolean,
    default: false,
  },
  conferenceAttendedId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "conference",
    },
  ],
});

const Audience = User.discriminator("Audience", AudienceSchema);

// UserRelation Schema
const UserRelation = new Schema({
  conferenceId: {
    type: mongoose.Types.ObjectId,
    ref: "conference",
  },
  AudienceId: {
    type: mongoose.Types.ObjectId,
    ref: "Audience",
  },
  modeOfAttendence: {
    type: String,
    enum: ["Offline", "Online"],
  },
});

const userRelation = mongoose.model("UserRelation", UserRelation);

// Presenter Schema
const PresenterSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  linkeldnUrl: {
    type: String,
    required: true,
  },
  validatedPresenter: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  updatedTime: {
    type: Date,
  },
});

const presenter = User.discriminator("Presenter", PresenterSchema);

// PresenterRelation Schema
const PresenterRelation = new Schema({
  presenterId: { type: mongoose.Types.ObjectId, ref: "presenter" },

  conferenceId: {
    type: mongoose.Types.ObjectId,
    ref: "conference",
  },
  paper_url: {
    type: String,
  },
  streamOfPaper: {
    type: String,
  },
  fileOriginalName: {
    type: String,
    required: true,
  },
});

const presenterRelation = mongoose.model(
  "PresenterRelation",
  PresenterRelation
);

// VerifyPresenter Schema

// Admin Schema
const AdminSchema = new Schema({
  presenterRelation: [
    {
      type: mongoose.Types.ObjectId,
      ref: "verifyPresenter",
    },
  ],
});

const admin = mongoose.model("Admin", AdminSchema);

module.exports = {
  User,
  Audience,
  presenter,
  userRelation,
  presenterRelation,
  admin,
};
