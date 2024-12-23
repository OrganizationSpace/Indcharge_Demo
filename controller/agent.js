const axios = require("axios");
const { sign, attestation } =require('../function/signature')

class Agent {
  constructor() {
    this.baseUrl = "http://localhost:3000";
    //this.baseUrl = 'http://192.168.29.233:1118';
  }
async login({ email, password, workspace }) {
    try {
      const data = {
        email, 
        password,
        workspace	
			};
	
			const payload = JSON.stringify(data);
			const signature = sign(payload);
      const response = await axios.post(`${this.baseUrl}/agent/super/login`, {
        email, password, workspace
      },
      {
        headers: {
          //"Authorization": token,
          "x-webhook-signature":signature
        },
      });
      return response;
    } catch (error) {
      throw error;
    } }


}
module.exports = Agent;
