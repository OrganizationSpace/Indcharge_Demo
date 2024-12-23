const Preference_ = require("../schema/preference");
class Preference {
  async create({ organization_name, workspace }) {
    try {
      const result = new Preference_({ organization_name, workspace }).save();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async is_exist({ organization_name }) {
    try {
      const result = await Preference_.findOne({ organization_name });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    } }
}
module.exports = Preference;