const registerUser = require('./registerUser');
const editUser = require('./editUser');
const deleteUser = require('./deleteUser');
const resetUserPassword = require('./resetUserPassword');

module.exports = {
  Mutation: {
    registerUser,
    editUser,
    deleteUser,
    resetUserPassword,
  },
};
