require('dotenv').config({ path: `${__dirname}/../.env` });
const router = require('express').Router();
const { auth } = require('../controllers/auth');
const { User } = require('../schemas/User');

//~ Прибираємо, бо перенесли цей функціонал
// const { hash, comparePass } = require('../controllers/bcrypt'); у schemas/User.js у UserSchema.pre
//~ /Прибираємо, бо перенесли цей функціонал

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({}, '-password -__v').lean(); // lean() - перетворити документ mongoose у JSON
    res.send(users); // відправити всіх юзерів на фронт
  } catch (error) {
    console.log('router.post >> error:', error);
    res.status(400).json({ message: error.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { email, password } = req.body;
    //& Код перенесений у controllers/checkUsersValues.js, бо він повторюється
    // if (!email) {
    //   // throw new Error("Error")
    //   return res.status(400).json({ message: 'Not valid  email' });
    // }
    // if (!password)
    //   return res.status(400).json({ message: 'Not valid password' });
    //& /Код перенесений у controllers/checkUsersValues.js, бо він повторюється
    if (!checkUsersValues(email, password)) {
      return res.status(400).json({ message: 'Not valid  email or password' });
    }

    const user = await User({ email });

    //~ Прибираємо, бо перенесли цей функціонал
    // const hashPass = await hash(password);
    // user.password = hashPass;
    // console.log('router.post >> user:', user);
    //~ /Прибираємо, бо перенесли цей функціонал

    await user.save(); // зберігаємо юзера
    res.send(user); // повертаємо на фронтенд
  } catch (error) {
    console.log('router.post >> error:', error);
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  // У try...catch обов'язково тре використовувати асинхронні операції, щоби швидше спіймати помилку.
  try {
    const { email, password } = req.body;
    //& Код перенесений у controllers/checkUsersValues.js, бо він повторюється
    // if (!email) {
    //   // throw new Error("Error")
    //   return res.status(400).json({ message: 'Not valid  email' });
    // }
    // if (!password)
    //   return res.status(400).json({ message: 'Not valid password' });
    //& /Код перенесений у controllers/checkUsersValues.js, бо він повторюється
    if (!checkUsersValues(email, password)) {
      return res.status(400).json({ message: 'Not valid  email or password' });
    }

    const exists = await User.exists({ email });
    console.log('router.post >> exists:', exists);
    if (!exists)
      res.status(400).json({ message: `User by email ${email} not found` });

    // lean() вертає не документ mongoDB, а JSON-об'єкт
    // const user = await User.findOne({ email }, '_id email password').lean();

    const user = await User.findOne({ email }, '_id email password'); // повернуться лише ті поля, що ми вказали. Якщо вказати з дефісом, то параметр теж не повернеться
    // const user = await User.findOne({ email }); // повернеться весь об'єкт з бази (без password, бо у схемі вказано select: false): _id, email, createdAt, updatedAt, __v

    //& Перенесли перевірку пароля у схему-клас "UserSchema" (schemas/User.js)
    // const passed = await comparePass(password, user.password);
    // console.log('router.post >> passed:', passed);
    //& /Перенесли перевірку пароля у схему-клас "UserSchema" (schemas/User.js)
    const passed = await user.chekPassword(password);
    console.log('router.post >> passed:', passed);
    if (!passed)
      return res
        .status(400)
        .json({ message: `User's password ${password} not valid` });

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: '47h',
    });

    // res.send(user);
    res.status(200).send({ message: 'SUCCESS', token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.module.exports = { usersRouter: router };
