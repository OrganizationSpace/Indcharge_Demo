const History_ = require("../schema/history");
class History {
  async create({ workspace, code,session }) {
    try {
      const result = new History_({ workspace, code }).save({session});
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
module.exports = History;
