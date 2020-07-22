const User = require("../app/models/usersModels");
const File = require("../app/models/files");

module.exports = {
  async userId(session) {
    if (session.userId) {
      const { userId: id } = session;

      const user = await User.findOne({ where: { id } });

      return user;
    }
  },
  getPagination(req) {
    let offset,
      { page, limit, filter } = req.query;

    page = page || 1;
    limit = limit || 6;
    offset = limit * (page - 1);

    return (params = { page, limit, offset, filter });
  },
  date(timestap) {
    const data = new Date(timestap);

    const year = data.getUTCFullYear();

    const month = `0${data.getUTCMonth() + 1}`.slice(-2);

    const day = `0${data.getUTCDate()}`.slice(-2);

    return {
      iso: `${year}-${month}-${day}`,
      birthDate: `${day}/${month}/${year}`,
    };
  },
  imageName: (req, path) =>
    `${req.protocol}://${req.headers.host}${path.replace("public", "")}`,
};
