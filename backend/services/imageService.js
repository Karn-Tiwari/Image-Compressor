const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

exports.compressImageService = async (file, targetSizeKB) => {
  const outputFilePath = path.join(__dirname, "../uploads", `${uuidv4()}.jpg`);
  const targetSizeBytes = targetSizeKB * 1024;

  try {
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
