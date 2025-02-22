const { ProductImage, Product } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
exports.getAllImages = async (req, res) => {
  try {
    const images = await ProductImage.findAll();
    // chuẩn hoá dữ liệu trả về
    const data = images.map((image) => {
      return process.env.API_BACKEND + "/" + image.url;
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get product by image id
exports.getProductByImageName = async (req, res) => {
  try {
    const { imageName } = req.params;
    const image = await ProductImage.findOne({
      where: {
        url: {
          [Op.like]: `%${imageName}%`,
        },
      },
      include: [{ model: Product, as: "product" }],
    });
    if (image) {
      res.status(200).json(image.product);
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    // Lấy tất cả các URL ảnh từ database
    const images = await ProductImage.findAll({});
    const imageUrls = images.map((image) => path.basename(image.url));

    // Lấy danh sách tất cả file trong thư mục uploads
    const uploadDir = path.join(__dirname, "../uploads");
    const allFiles = getAllFiles(uploadDir);

    // Kiểm tra và xóa file nếu không có trong database
    allFiles.forEach((filePath) => {
      const fileName = path.basename(filePath);
      if (!imageUrls.includes(fileName)) {
        fs.unlinkSync(filePath);
      }
    });

    res.status(200).json({ message: "Unused images deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
};
