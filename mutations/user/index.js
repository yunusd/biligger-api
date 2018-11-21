const registerUser = require('./registerUser');
const editUser = require('./editUser');
const deleteUser = require('./deleteUser');

module.exports = {
  Mutation: {
    registerUser,
    editUser,
    deleteUser,
  },
};
