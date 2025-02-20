import React, { useState } from "react";
import StepGuide from "./StepGuide.jsx";
import ContactButton from "./ContactButton.jsx";
const App = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [defendedImage, setDefendedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [epsilon, setEpsilon] = useState(0.2); // 可调节 ε 值
  const [selectedDefense, setSelectedDefense] = useState("auto"); // 預設為 Auto
  // 处理用户上传的图片
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // 处理上传并进行防御
  const handleUpload = async () => {
    if (!image) {
      alert("請先選擇一張圖片!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("defense_method", selectedDefense); // 傳遞防禦方式

    try {
      const response = await fetch("http://localhost:8000/defend/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process the image.");
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setDefendedImage(imageUrl);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("處理圖片時出錯，請重試!");
    } finally {
      setLoading(false);
    }
  };

  // 生成对抗样本
  const handleGenerate = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/generate_adversarial_example?epsilon=${epsilon}`
      );
      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      setImageUrl(imgUrl);
    } catch (error) {
      console.error("Error generating adversarial example:", error);
    }
  };

  const handleClassify = async (imageFile) => {
    if (!defendedImage) {
      alert("請先執行防禦，然後再分類!");
      return;
    }

    try {
      // 下載 Blob 並轉換為 File
      const response = await fetch(defendedImage);
      const blob = await response.blob();
      const defendedFile = new File([blob], "defended_image.png", {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("file", defendedFile);

      const classifyResponse = await fetch("http://127.0.0.1:8000/classify/", {
        method: "POST",
        body: formData,
      });

      const result = await classifyResponse.json();
      alert(`Predicted label after defense: ${result.predicted_label}`);
    } catch (error) {
      console.error("Failed to classify the image after defense:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-2xl mx-auto">
      <div className="text-4xl font-bold mb-1">Adversarial Defense Toolkit</div>
      <StepGuide />
      <ContactButton />
      {/* Epsilon 說明表 */}
      <div className="mb-6 w-full mt-4">
        <h2 className="text-lg font-semibold mb-2">
          Epsilon (ε) Values & Their Effects
        </h2>
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-700">
              <th className="border p-2">Epsilon Value</th>
              <th className="border p-2">Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">0.01 ~ 0.1</td>
              <td className="border p-2">
                Almost no visible change, minimal impact
              </td>
            </tr>
            <tr>
              <td className="border p-2">0.1 ~ 0.3</td>
              <td className="border p-2">
                Slight image change, may affect model prediction
              </td>
            </tr>
            <tr>
              <td className="border p-2">0.3 ~ 0.5</td>
              <td className="border p-2">
                Model error rate increases, image starts to distort
              </td>
            </tr>
            <tr>
              <td className="border p-2">0.5 ~ 0.8</td>
              <td className="border p-2">
                Image visibly distorted, may be hard to recognize
              </td>
            </tr>
            <tr>
              <td className="border p-2">0.8 ~ 1.0</td>
              <td className="border p-2">Severely distorted, mostly noise</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 生成对抗样本 */}
      <div className="mb-6 w-full text-center border border-gray-300 p-4 rounded">
        <h2 className="text-lg font-semibold">Generate Adversarial Example</h2>
        <div className="flex items-center space-x-2 justify-center mt-4">
          <label className="block">Epsilon (ε):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={epsilon}
            onChange={(e) => setEpsilon(e.target.value)}
            className="ml-2 border border-gray-400 p-1 rounded"
          />
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-green-500 text-white rounded"
            style={{ marginLeft: "11px" }}
          >
            Generate
          </button>
        </div>
        {imageUrl && (
          <div className="mt-4">
            <img
              src={imageUrl}
              alt="Adversarial Example"
              className="w-64 h-auto border border-gray-300 rounded shadow-sm mx-auto"
            />
            <a href={imageUrl} download="adversarial_example.png">
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
                Download
              </button>
            </a>
          </div>
        )}
      </div>

      {/* 图片上传區塊 */}
      <div className="mb-6 w-full text-center border border-gray-300 p-4 rounded">
        <h2 className="text-lg font-semibold">Upload Image for Defense</h2>
        <input type="file" onChange={handleImageChange} className="mt-2" />
        {preview && (
          <img
            src={preview}
            alt="Uploaded Preview"
            className="w-64 h-auto mt-2 border border-gray-300 rounded shadow-sm mx-auto"
          />
        )}
      </div>
      <div className="mb-6 w-full text-center border border-gray-300 p-4 rounded">
        <label className="mr-4 text-lg font-semibold ">
          Choose Defense Method:
          <select
            value={selectedDefense}
            onChange={(e) => setSelectedDefense(e.target.value)}
          >
            <option value="gaussian">Gaussian Blur</option>
            <option value="bilateral">Bilateral Filter</option>
            <option value="median">Median Filter</option>
            <option value="auto">Auto (Apply All Defenses)</option>
          </select>
        </label>

        {/* 防禦圖片按鈕 */}
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Processing..." : "Defend Image"}
        </button>
      </div>
      {/* 结果展示 */}
      {defendedImage && (
        <div className="mt-4 text-center border border-gray-300 p-4 rounded shadow-sm w-full">
          <h2 className="text-lg font-semibold">Defended Image:</h2>
          <img
            src={defendedImage}
            alt="Defended"
            className="w-64 h-auto mt-2 border border-gray-300 rounded shadow-sm mx-auto"
          />
          <a href={defendedImage} download="defended_image.png">
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
              Download Defended Image
            </button>
          </a>
        </div>
      )}

      {/* 圖片分類按鈕 */}
      <div className="mt-6 flex space-x-4 justify-center w-full border border-gray-300 p-4 rounded shadow-sm text-center flex-col items-center">
        <h2 className="text-lg font-semibold mb-4">Classify Images:</h2>
        <div className="flex space-x-4 ">
          <button
            onClick={() => handleClassify(image)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Classify Original Image
          </button>

          <button
            onClick={() => handleClassify(defendedImage)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Classify Defended Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
