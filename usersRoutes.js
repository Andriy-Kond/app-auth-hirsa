const router = require('express').Router();
const { User } = require('./schemas/User');
const { hash, comparePass } = require('./controllers/bcrypt');

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
    const hashPass = await hash(password);
    user.password = hashPass;
    console.log('router.post >> user:', user);
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
    const user = await User.findOne({ email }, '_id email password').lean(); // повернуться лише ті поля, що ми вказали. Якщо вказати з дефісом, то параметр теж не повернеться
    // const user = await User.findOne({ email }); // повернеться весь об'єкт з бази (без password, бо у схемі вказано select: false): _id, email, createdAt, updatedAt, __v

    const passed = await comparePass(password, user.password);
    console.log('router.post >> passed:', passed);

    res.send(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.module.exports = { usersRouter: router };
