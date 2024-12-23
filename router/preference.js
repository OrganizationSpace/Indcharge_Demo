const express = require("express");

const Preference = require("../controller/preference");

const router = express.Router();
const preference = new Preference();
router.use(express.json());

router.post("/registration", async (req, res) => {
  try {
    const { organization_name, workspace } = req.body;
    const response = await preference.create({
      organization_name: organization_name,
      workspace: workspace,
    });
    if (response.status === 200) {
      res.status(response.status).json({
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      });
    } else {
      // Failed request
      res.status(response.status).json({
        success: false,
        message: response.data.message,
        data: response.data.data,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;












