const express = require("express");

const jsonwebtoken = require('jsonwebtoken')
//const authorization = require("../function/auth");
const { sign, attestation } =require('../function/signature')


const Agent = require("../controller/agent");

const router = express.Router();
const agent = new Agent();
router.use(express.json());


router.post("/login", async (req, res, next) => {
   // console.log(req.body);
    try {
      const { workspace, email, password } = req.body;
  
      const response = await agent.login ({
        workspace: workspace,
        email: email,
        password: password,
     
      });
  
      if (response.status == 200) {
        const token = response.headers["token"];
        //const data = await prefToken(eco_token);
  
        res.setHeader("token", token);
  
        res.status(response.status).json({
          success: response.data.success,
          message: response.data.message,
          data: response.data.data,
        });
      } else {
        // Failed login
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  



 

  router.post("/admin/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      const user_login = {
        email: "admin@gmail.com",
        password: "admin321",
      };
  
   
      if (email === user_login.email && password === user_login.password) {
    
        const token = jsonwebtoken.sign({ email: email }, process.env.SECRET);
     
        res.setHeader("token", token);
        res.status(200).json({
          success: true,
          message: "Login successful",
          data: { token: token },
        });
      } else {
       
        res.status(400).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  });






//   router.post("/agent/add", authorization, async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const agentAdd = await Organization.updateOne(
//         { workspace: req.workspace },
  
//         { $push: { agents: { email, password } } }
//       );
//       res.status(200).json({
//         success: true,
//         message: "agent added successful",
//         data: agentAdd,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: error.message, error });
//     }
//   });
  
//   router.post("/agent/update", authorization, async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const agentUpdate = await Organization.updateOne(
//         { workspace: req.workspace, "agents.email": email },
  
//         { $set: { "agents.$.password": password } }
//       );
//       res.status(200).json({
//         success: true,
//         message: "agent updated successful",
//         data: agentUpdate,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: error.message, error });
//     }
//   });
  
//   router.post("/agent/remove", authorization, async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const agentRemove = await Organization.updateOne(
//         { workspace: req.workspace },
  
//         { $pull: { agents: { email, password } } }
//       );
//       res.status(200).json({
//         success: true,
//         message: "agent successful remove",
//         data: agentRemove,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: error.message, error });
//     }
//   });
  
//   router.post("/agent/list", authorization, async (req, res) => {
//     try {
//       const agentList = await Organization.find({ workspace: req.workspace });
//       res.status(200).json({
//         success: true,
//         message: "agent List successful ",
//         data: agentList[0].agents,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: error.message, error });
//     }
//   });

module.exports = router;









