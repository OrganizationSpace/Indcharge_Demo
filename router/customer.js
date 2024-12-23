const express = require("express");

const authorization = require("../function/auth");


const Customer = require("../controller/customer");

const router = express.Router();
const customer = new Customer();
router.use(express.json());

router.post("/add", authorization, async (req, res, next) => {
  const { email, name, password } = req.body;

  const token = req.headers.authorization;
  try {
    const new_customer = await customer.add({
   
      email,
      password,
      name,
      token,
      tag: "indcharge",
    });
    if (new_customer.status == 200) {
      //io.of(`/org-${req.workspace}`).emit('refresh', { model: 'client' })
      res.status(new_customer.status).json({
        success: new_customer.data.success,
        message: new_customer.data.message,
        data: new_customer.data.data,
      });
    } else {
      res.status(response.status).json({
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/list", authorization, async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const page = req.body.page ?? 0; 
    const query = req.body.query ?? null;
    const list_customers = await customer.list({
   
      token,
      page,
      query
      // tag: "indcharge",
    });
    //console.log(list_customers.data);

    if (list_customers.status == 200) {
      res.status(list_customers.status).json({
        success: list_customers.data.success,
        message: list_customers.data.message,
        data: list_customers.data.data,
      });
    } else {
      res.status(list_customers.status).json({
        success: list_customers.data.success,
        message: list_customers.data.message,
        data: list_customers.data.data,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// router.post("/list", authorization, async (req, res, next) => {
//   const token = req.headers.authorization;
//   try {
//     const list_customers = await customer.list({
//       workspace: req.workspace,
//       token,
//       tag: "indcharge",
//     });
//     console.log(list_customers.data);

//     if (list_customers.status == 200) {
//       res.status(list_customers.status).json({
//         success: list_customers.data.success,
//         message: list_customers.data.message,
//         data: list_customers.data.data,
//       });
//     } else {
//       res.status(list_customers.status).json({
//         success: list_customers.data.success,
//         message: list_customers.data.message,
//         data: list_customers.data.data,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

router.post("/remove", authorization, async (req, res, next) => {
  //console.log(req.body);

  const token = req.headers.authorization;
  try {
    const { emails } = req.body;

    const removed_customer = await customer.remove({
     
      token,
      emails,
      tag: "indcharge",
    });
    if (removed_customer.status == 200) {
      res.status(removed_customer.status).json({
        success: removed_customer.data.success,
        message: removed_customer.data.message,
      });
    } else {
      res.status(removed_customer.status).json({
        success: removed_customer.data.success,
        message: removed_customer.data.message,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;









