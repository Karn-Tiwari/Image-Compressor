import React, { useState } from "react";
import axios from "axios";
// import uploadingDummyImageUrl from "../../img/uploadingLogo.jpg";
// import downloadingDummyImageUrl from "../../img/DownloadingLogo.jpg";

export default function Home() {
  const [image, setImage] = useState(null);
  const [compressedImageUrl, setCompressedImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [targetSizeKB, setTargetSizeKB] = useState(100); // Default to 100KB

  const handleImageUpload = (event) => {
    setError(null);
    setCompressedImageUrl(null);

    const file = event.target.files[0];
    if (!file) return;

    setImage(file);
  };

  const handleImageCompress = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image); // Ensure the field name is "file"
    formData.append("targetSizeKB", targetSizeKB);

    try {
      setIsLoading(true);
      setCompressionProgress(0);
      const response = await axios.post(
        "https://image-compressor-backend.onrender.com/api/v1/images/compress",
        // "http://localhost:5000/api/v1/images/compress",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setCompressionProgress(percentCompleted);
          },
        }
      );
      const { compressedImageUrl } = response.data;
      console.log("Compressed Image URL:", compressedImageUrl); // Debugging log
      setCompressedImageUrl(compressedImageUrl);
    } catch (error) {
      console.error(
        "Error compressing image:",
        error.response || error.message
      );
      setError("Image compression failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = async (event) => {
    event.preventDefault();

    try {
      // Fetch the image as a blob
      const response = await fetch(compressedImageUrl);
      const blob = await response.blob();

      // Create a new URL for the blob object
      const blobUrl = window.URL.createObjectURL(blob);

      // Create an invisible link element
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "compressed-image.jpg"; // Set the download file name

      // Append the link to the document, trigger the download, and remove the link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release the blob URL to free up memory
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
      setError("Failed to download the image. Please try again.");
    }
  };

  return (
    <div className="main-content overflow-hidden background-transition">
      <div className="mx-auto w-full max-w-7xl">
        <aside className="relative overflow-hidden text-black rounded-lg sm:mx-16 mx-2 sm:py-8 py-4">
          <div className="relative z-10 max-w-screen-xl px-4 pb-20 pt-10 sm:py-24 mx-auto sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Side: Upload Image Box */}
              <div className="text-center">
                <div
                  className="border-2 border-gray-300 "
                  style={{ width: "300px", height: "300px" }}
                >
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Uploaded"
                      className="max-w-full h-auto"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <img
                      src="/img/UploadingLogo.jpg"
                      alt="Upload Dummy"
                      className="max-w-full h-auto"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block mx-auto my-4"
                />
              </div>

              {/* Right Side: Compressed Image Box */}
              <div className="text-center">
                <div
                  className="border-2 border-gray-300 "
                  style={{ width: "300px", height: "300px" }}
                >
                  {compressedImageUrl ? (
                    <img
                      src={compressedImageUrl}
                      alt="Compressed"
                      className="max-w-full h-auto"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <img
                      src="/img/DownloadingLogo.jpg"
                      alt="Download Dummy"
                      className="max-w-full h-auto"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </div>

                {/* Slider to select target compression size */}
                <div className="mt-4">
                  <label htmlFor="size-slider">Select target size (KB):</label>
                  <input
                    id="size-slider"
                    type="range"
                    min="0"
                    max="1000"
                    value={targetSizeKB}
                    onChange={(e) => setTargetSizeKB(e.target.value)}
                    className="w-full mt-2"
                  />
                  <p className="text-center mt-2">{targetSizeKB} KB</p>
                </div>

                <button
                  onClick={handleImageCompress}
                  className="inline-flex text-white items-center px-6 py-3 font-medium bg-orange-700 rounded-lg hover:opacity-75 mt-4"
                >
                  Compress
                </button>

                {compressedImageUrl && (
                  <a
                    href={compressedImageUrl}
                    download="compressed-image.jpg"
                    onClick={handleDownloadClick}
                    className="inline-flex text-white items-center px-6 py-3 font-medium bg-green-700 rounded-lg hover:opacity-75 ml-4 mt-4"
                  >
                    Download
                  </a>
                )}
              </div>
            </div>

            {/* Loading and Progress Indicator */}
            {isLoading && (
              <div className="mt-4">
                <p>Compressing image...</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${compressionProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
