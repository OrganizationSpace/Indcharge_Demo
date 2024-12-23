const axios = require("axios");
class Masfob {
  constructor() {
    this.baseUrl = "https://api.masfob.com";
    //this.baseUrl = 'http://192.168.29.233:1118';
  }
async login({ email, password, workspace }) {
    try {
      const response = await axios.post(`${this.baseUrl}/agent/super/login`, {
        email, password, workspace
      });
      return response;
    } catch (error) {
      throw error;
    } }


    

  async clientAdd({ token, email, name, password, tag }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/client/add`,
        { password, name, email, tag },
        {   headers: {
            Authorization: token,
          },     }
      );
      return response;
    } catch (error) {
      throw error;
    } }
  async clientList({ token, tag }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/client/list`,
        { tag }, {
          headers: {
            Authorization: token,
          },}
      );
      return response;
    } catch (error) {
      throw error;
    } }
  async clientDelete({ token, email, tag }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/client/delete`,
        { email: { $in: email }, tag },
        { headers: {
            Authorization: token,
          },     }
      );
      return response;
    } catch (error) {
      throw error;
    }  }
}
module.exports = Masfob;
