const { compressImageService } = require("../services/imageService.js");
const path = require("path");

exports.compressImage = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const targetSizeKB = parseInt(req.body.targetSizeKB, 10);
    console.log("Parsed targetSizeKB:", targetSizeKB);

    if (isNaN(targetSizeKB) || targetSizeKB <= 0) {
      return res.status(400).json({ error: "Invalid target size" });
    }

    const compressedImagePath = await compressImageService(
      req.file,
      targetSizeKB
    );

    // Use environment variable for the base URL
    const baseUrl = process.env.BASE_URL;
    const compressedImageUrl = `${baseUrl}/uploads/${path.basename(
      compressedImagePath
    )}`;

    res.status(200).json({
      compressedImageUrl,
    });
  } catch (error) {
    console.error("Error during image compression:", error);
    res.status(500).json({ error: "Image compression failed" });
  }
};
