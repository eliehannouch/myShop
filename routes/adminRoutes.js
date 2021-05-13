const express = require("express");
const { check, body } = require("express-validator");

const adminController = require("../controllers/adminController");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.post(
  "/add-product",
  [
    body(
      "title",
      "Title should be at least 3 characters long with only letters and numbers"
    )
      .isString()
      .isLength({ min: 3 })
      .trim(),

    body("price", "Price should be a numeric value").isNumeric(),
    body(
      "description",
      "Product description should be at least 5 characters long and at most 255"
    )
      .isLength({ min: 5, max: 255 })
      .trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body(
      "title",
      "Title should be at least 3 characters long with only letters and numbers"
    )
      .isString()
      .isLength({ min: 3 })
      .trim(),

    body("price", "Price should be a numeric value").isNumeric(),
    body(
      "description",
      "Product description should be at least 5 characters long and at most 255"
    )
      .isLength({ min: 5, max: 255 })
      .trim(),
  ],
  isAuth,
  adminController.postEditProduct
);

// router.post("/delete-product", isAuth, adminController.postDeleteProduct);

router.delete("/product/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
