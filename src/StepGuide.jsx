import React from "react";

const StepGuide = () => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">
        How to Use the Adversarial Defense Toolkit
      </h2>
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="flex items-start space-x-4">
          <div>
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full text-xl font-bold">
              1
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Generate an Adversarial Example
            </h3>
            <p className="text-gray-400">
              Set the <strong>Epsilon (ε)</strong> value and click
              <strong> "Generate"</strong> to create an adversarial example.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start space-x-4">
          <div>
            <div className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full text-xl font-bold">
              2
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Select a Defense Method</h3>
            <p className="text-gray-400">
              Upload an image and choose a <strong>defense method</strong>{" "}
              (Gaussian Blur, Bilateral Filter, etc.).
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start space-x-4">
          <div>
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-500 text-white rounded-full text-xl font-bold">
              3
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Apply Defense Techniques</h3>
            <p className="text-gray-400">
              Click <strong>"Defend Image"</strong> to process the image and
              apply the defense technique.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-start space-x-4">
          <div>
            <div className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full text-xl font-bold">
              4
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Download the Defended Image
            </h3>
            <p className="text-gray-400">
              Download the processed image and test classification performance.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex items-start space-x-4">
          <div>
            <div className="flex items-center justify-center w-10 h-10 bg-purple-500 text-white rounded-full text-xl font-bold">
              5
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Classify the Image</h3>
            <p className="text-gray-400">
              Use <strong>"Classify Original Image"</strong> and
              <strong> "Classify Defended Image"</strong> to check
              classification results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StepGuide;
