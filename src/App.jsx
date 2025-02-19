import React, { useState } from "react";

const App = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [defendedImage, setDefendedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [epsilon, setEpsilon] = useState(0.2); // 可调节 ε 值

  // 处理用户上传的图片
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // 处理上传并进行防御
  const handleUpload = async () => {
    if (!image) {
      alert("请先选择一张图片!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

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
      alert("处理图片时出错，请重试!");
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
      const defendedFile = new File([blob], "defended_image.png", { type: "image/png" });
  
      const formData = new FormData();
      formData.append("file", defendedFile);
  
      const classifyResponse = await fetch("http://127.0.0.1:8000/classify/", {
        method: "POST",
        body: formData,
      });
  
      const result = await classifyResponse.json();
      alert(`防禦後的圖片預測結果: ${result.predicted_label}`);
    } catch (error) {
      console.error("分類防禦後的圖片失敗:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Adversarial Defense Toolkit</h1>

      {/* Epsilon 說明表 */}
      <div className="mb-6 w-full">
        <h2 className="text-lg font-semibold mb-2">Epsilon (ε) 值與影響</h2>
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Epsilon 值</th>
              <th className="border p-2">效果</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">0.01 ~ 0.1</td>
              <td className="border p-2">幾乎無變化，影響輕微</td>
            </tr>
            <tr>
              <td className="border p-2">0.1 ~ 0.3</td>
              <td className="border p-2">圖片變化小，可能影響模型</td>
            </tr>
            <tr>
              <td className="border p-2">0.3 ~ 0.5</td>
              <td className="border p-2">模型錯誤率大增，圖片開始變形</td>
            </tr>
            <tr>
              <td className="border p-2">0.5 ~ 0.8</td>
              <td className="border p-2">圖片明顯變形，可能無法辨識</td>
            </tr>
            <tr>
              <td className="border p-2">0.8 ~ 1.0</td>
              <td className="border p-2">嚴重失真，幾乎全為噪音</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 生成对抗样本 */}
      <div className="mb-6 w-full text-center">
        <h2 className="text-lg font-semibold">Generate Adversarial Example</h2>
        <label className="block mb-2">
          Epsilon (ε):
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={epsilon}
            onChange={(e) => setEpsilon(e.target.value)}
            className="ml-2 border border-gray-400 p-1 rounded"
          />
        </label>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Generate
        </button>
        {imageUrl && (
          <div className="mt-4">
            <img src={imageUrl} alt="Adversarial Example" className="w-64 h-auto" />
            <a href={imageUrl} download="adversarial_example.png">
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
                Download
              </button>
            </a>
          </div>
        )}
      </div>

      {/* 图片上传區塊 */}
      <div className="mb-6 w-full text-center">
        <h2 className="text-lg font-semibold">Upload Image for Defense</h2>
        <input type="file" onChange={handleImageChange} className="mt-2" />
        {preview && (
          <img src={preview} alt="Uploaded Preview" className="w-64 h-auto mt-2" />
        )}
      </div>

      {/* 防禦圖片按鈕 */}
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Defend Image"}
      </button>

      {/* 结果展示 */}
      {defendedImage && (
        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold">Defended Image:</h2>
          <img src={defendedImage} alt="Defended" className="w-64 h-auto mt-2" />
          <a href={defendedImage} download="defended_image.png">
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
              Download Defended Image
            </button>
          </a>
        </div>
      )}

      {/* 圖片分類按鈕 */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => handleClassify(image)}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Classify Original Image
        </button>

        <button
          onClick={() => handleClassify(defendedImage)}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Classify Defended Image
        </button>
      </div>
    </div>
  );
};

export default App;