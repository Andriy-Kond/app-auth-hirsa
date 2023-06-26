const bcrypt = require('bcryptjs');

const hash = async () => {
  if (!pass) {
    throw new Error(`Pass is ${pass}`);
  }
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pass, salt);
};

const comparePass = async (pass, hashPass) => {
  return await bcrypt.compare(pass, hashPass);
};

module.exports = { hash, comparePass };

// const hash = async () => {
//   const pass = 'mypass';
//   const salt = await bcrypt.genSalt(10);
//   const ourPass = await bcrypt.hash(pass, salt);
//   console.log('hash >> ourPass:', ourPass);
//   const parsedPass = await bcrypt.compare(pass, ourPass);
//   console.log('hash >> parsedPass:', parsedPass);
// };
// hash();
