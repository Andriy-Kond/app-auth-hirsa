const checkUsersValues = (...args) => {
  console.log('checkUsersValues >> ...args:', args); // [undefined, "123456"]
  console.log('checkUsersValues >> ...args:', typeof args); // чомусь object

  // for (const value of Object.value(args)) {
  //   if (!value) throw new Error(`Not valid value ${value}`);
  // }
  // return true;

  // return args.any(value => {
  //   console.log('checkUsersValues >> value:', value);
  //   // if (!value) return res.status(400).json({ message: `Not valid ${value}` });
  //   if (!value) throw new Error(`Not valid value ${value}`);
  //   return true;
  // });
};

module.exports = {
  checkUsersValues,
};
