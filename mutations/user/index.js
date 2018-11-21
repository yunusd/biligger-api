const registerUser = require('./registerUser');
const editUser = require('./editUser');

module.exports = {
  Mutation: {
    registerUser,
    editUser,
  },
};
