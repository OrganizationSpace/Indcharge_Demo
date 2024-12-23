const express = require("express");
const bodyParser = require('body-parser')


const authorization = require("../function/auth");
const uploadfile = require("../function/upload_file");


const Advertisement = require("../controller/advertisement");

const router = express.Router();
const advertisement = new Advertisement();
router.use(express.json());
router.use(bodyParser.json())



router.post("/add", authorization, uploadfile, async (req, res) => {
    try {
  
      // console.log(req.workspace);
      // console.log(req.body);
  
      const  {url,button_text}=req.body
  
      const new_advertisement= await advertisement.add({
     
        url: url || null,
        button_text: button_text || null,
        image: process.env.SPACE_DOMAIN + req.file.originalname ?? "undefined",
      });
  
      res.status(200).json({
        success: true,
        message: "advertisement add successful",
        data: new_advertisement,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message, error });
    }
  });

router.post('/remove', authorization, async (req, res) => {
	try {
		const remove_advertisement = await advertisement.remove({
	
		_id:req.body._id
		})
		res
			.status(200)
			.json({ success: true, message: 'advertisement remove', data: remove_advertisement })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})
router.post("/list", authorization, async (req, res) => {
  try {
    const list_advertisement = await advertisement.list();

    res.status(200)
      .json({ success: true, message: "advertisement list successful", data: list_advertisement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message, error });
  }
});

module.exports = router;









