const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const Schema = require('mongoose').Schema;

const UserSchema = Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, // обрізає пусті по бокам
      minlength: 10,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 100,
      select: false, // на фронтенд не буде повертатись це поле
    },
    age: {
      type: Number,
      min: 0,
      max: 150,
    },
  },
  {
    collection: 'users', // колекція у БД
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema); // реєстрація моделі

module.exports = { User };
