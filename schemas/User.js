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
      minLength: 10,
      maxLength: 50,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 100,
      // select: false, // на фронтенд не буде повертатись це поле
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

// Створюємо метод checkPassword за допомогою mongoose для перевірки паролю замість методу compare у userRoutes.js (const passed = await comparePass(password, user.password);)
UserSchema.methods.checkPassword = async function (password) {
  return await comparePass(password, this.password);
};

const User = mongoose.model('User', UserSchema); // реєстрація моделі

module.exports = { User };
