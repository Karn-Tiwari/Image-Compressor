const express = require("express"); // Import the Express framework
const { compressImage } = require("../controllers/imageController"); // Import the 'compressImage' function from the 'imageController' file

const router = express.Router(); // Create a new router object

router.post("/compress", compressImage); // Define a POST route for '/compress' that uses the 'compressImage' controller function

module.exports = router; // Export the router object to be used in other parts of the application
