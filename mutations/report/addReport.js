const { Report } = require('../../models');

module.exports = async (_, args) => {
  const isExist = await Report.findOne({
    actor: args.actor,
    reporter: args.reporter,
  });
  if (isExist) return new Error('Zaten raporlanmış');
  const report = await Report.create(args);
  return report;
};
