require('dotenv').config({ path: `${__dirname}/.env` });
const jwt = require('jsonwebtoken');
const { User } = require('../schemas/User');

// має приймати інфу юзера, його токен, перевірити це все і якщо все добре, то назначити у реквест юзера і next
const auth = async (req, res, next) => {
  try {
    // console.log('auth >> req:', req); // у об'єкті req є масив: ... rewHeaders ...
    // Знайти слово Bearer у rewHeaders.
    const foundToken = req.rewHeaders.find(str => str.includes('Bearer')) || '';
    // Далі розбити цей рядок на масив через пробіл і взяти з цього масиву перший елемент (нульовий буде слово Bearer)
    if (!foundToken) return new Error(`Error token ${foundToken} is filed`); // ця помилка полетить у catch
    const token = foundToken?.split(' ')[1];
    // if (!token) res.status(400).send(`Error token ${token} is filed`);
    if (!token) return new Error(`Error token ${token} is filed`); // ця помилка полетить у catch

    const tokenData = jwt.verify(token, process.env.SECRET);
    // if (!tokenData) res.status(400).send(`Error user ${tokenData} is filed`);
    if (!tokenData) return new Error(`Error user ${tokenData} is filed`); // ця помилка полетить у catch

    // перевірка чи є такий юзер.
    const user = await User.findById(
      tokenData.id,
      '-password -__v -createdAt -updatedAt'
    );
    req.user = user;
    next();

    // res.send(user); // об'єкт з id, часом створення і зупинки токену
  } catch (error) {
    console.log('router.post >> error:', error);
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  auth,
};
