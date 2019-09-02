const { Report } = require('../../models');

module.exports.deleteReport = async (_, { id }) => Report.findByIdAndDelete();
