const axios = require("axios");
const { sign, attestation } = require("../function/signature");

class Customer {
  constructor() {
    this.baseUrl = "http://localhost:3000";
    //this.baseUrl = "https://api.masfob.com";
    //this.baseUrl = 'http://192.168.29.233:1118';
  }
  async add({ token, email, name, password, tag }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/client/add`,
        { password, name, email, tag },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }}

  async list({  token,page, query }) {
    try {
      const inputData = {
				page: page,
        query:query	
			};
	
			const payload = JSON.stringify(inputData);
			const signature = sign(payload);
      const response = await axios.post(
        `${this.baseUrl}/agent/list`,
        //`${this.baseUrl}/agent/superadmin/list`,
        inputData,
        // {
        //   headers: {
        //     Authorization: token,
        //   },
        // }
        {
          headers: {
              "Authorization": token,
              "x-webhook-signature":signature
          },
      }
      );
      return response;
    } catch (error) {
      throw error;
    }}

  async remove({ token, emails, tag }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/client/delete`,
        { email: { $in: emails }, tag },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    } }
}
module.exports = Customer;
