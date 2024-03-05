const router = require('express').Router();
const orderController = require('../controllers/ordersController');
const {  verifyToken  }= require('../middleware/verifyToken');

router.get("/",verifyToken , orderController.getOrders);
router.get("/:id", orderController.getUserOrders);

module.exports = router