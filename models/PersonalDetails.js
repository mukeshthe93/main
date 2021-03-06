const mongoose = require('mongoose');

const PersonalDetails = new mongoose.Schema({
  first_name: { type: String, required: true },
  second_name: { type: String, required: true },
  address: { type: String, required: false, default: '' },
  headline: { type: String, required: false, default: '' },
  dob: { type: Date, required: false },
  dob_day: { type: String, required: false, default: '' },
  dob_month: { type: String, required: false },
  dob_year: { type: String, required: false },
  phone_num: { type: String, required: false },
  gender: { type: String, required: false },
  location: { type: String, required: false },
  status: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  pointsEarned: {
    type: Number,
    default: 15,
  },
  pointsSpent: {
    type: Number,
    default: 0,
  },
  tasksDone: {
    type: Number,
    default: 0,
  },
  tasksPosted: {
    type: Number,
    default: 0,
  },
  tasksCanceled: {
    type: Number,
    default: 0,
  },
  skills: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
  },
  githubusername: {
    type: String,
  },
  experience: [
    {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      location: {
        type: String,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  projects: [
    {
      title: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
      location: {
        type: String,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  education: [
    {
      school: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldofstudy: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  social: {
    youtube: {
      type: String,
      default: '',
    },
    twitter: {
      type: String,
      default: '',
    },
    facebook: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    instagram: {
      type: String,
      default: '',
    },
  },
  tagline: {
    type: String,
    default: '',
  },
  memberSince: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Profile = mongoose.model('PersonalDetails', PersonalDetails);
