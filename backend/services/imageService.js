const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

exports.compressImageService = async (file, targetSizeKB) => {
  const uploadsDir = path.join(__dirname, "../uploads");
  const originalFileName = path.parse(file.originalname).name;
  const outputFileName = `${originalFileName}-compressed.jpg`;
  const outputFilePath = path.join(uploadsDir, outputFileName);
  const targetSizeBytes = targetSizeKB * 1024;

  try {
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    console.log("starting compression...");

    // Initial compression attempt
    await sharp(file.buffer)
      .jpeg({ quality: 80 }) // Adjust quality as needed
      .toFile(outputFilePath);

    // Check the file size and adjust if necessary
    let fileSize = fs.statSync(outputFilePath).size;
    let quality = 80;

    console.log(
      `Initial file size: ${fileSize} bytes, target size: ${targetSizeBytes} bytes`
    );

    while (fileSize > targetSizeBytes && quality > 10) {
      quality -= 10;
      console.log(`Adjusting quality to: ${quality}`);
      await sharp(file.buffer).jpeg({ quality }).toFile(outputFilePath);
      fileSize = fs.statSync(outputFilePath).size;
      console.log(`New File size: ${fileSize} bytes`);
    }

    if (fileSize > targetSizeBytes) {
      console.warn(
        "Could not compress to the desired size, returning best possible compression"
      );
    } else {
      console.log("compression successful");
    }

    return outputFilePath;
  } catch (error) {
    console.error("Error in compressImageService:", error);
    throw error;
  }
};
