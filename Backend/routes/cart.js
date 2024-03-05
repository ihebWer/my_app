const router = require('express').Router();
const cartController = require('../controllers/cartController');
const {  verifyToken  }= require('../middleware/verifyToken');


router.get("/find", verifyToken, cartController.getcart);
router.get("/cartCount", verifyToken, cartController.getCartCount);
router.post("/", verifyToken, cartController.addCart);
router.delete("/:id", verifyToken, cartController.deleteCartItem);
router.put("/quantity/:cartItemId", verifyToken, cartController.decrementCartItem);
router.delete("/", verifyToken, cartController.resetCart);



module.exports = router;
