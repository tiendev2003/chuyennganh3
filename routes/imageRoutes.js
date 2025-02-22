const express = require("express");
const {
  getAllImages,
  getProductByImageName,
  deleteImage,
} = require("../controllers/imageController");
const router = express.Router();

router.get("/", getAllImages);
router.get("/:imageName", getProductByImageName);
router.delete("/all/not", deleteImage);

module.exports = router;
