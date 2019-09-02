const addReport = require('./addReport');
const deleteReport = require('./deleteReport');

module.exports = {
  Mutation: {
    addReport,
    deleteReport,
  },
};
